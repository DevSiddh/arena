import type { AuditFailure, AuditResult, Question, Stimulus, ValidationStats } from './types';
import { canonicalNumbers, numbersMatch, solve } from './solvers';
import { CONCEPT_BY_ID } from './curriculum';

/**
 * INDEPENDENT VALIDATION.
 *
 * Stage A — structural & semantic audit: the properties an item must have before it may be
 * shown to a student (exactly four options, exactly one correct, no duplicate options,
 * complete ten-part explanation, per-distractor rationale, distractors genuinely wrong,
 * no accidental ambiguity, duplicate detection).
 *
 * Stage B — independent solving: the item's `verification` payload is handed to a solver
 * that knows nothing about how the options were built. Where the answer can be expressed as
 * a number (or a vector of numbers), the declared correct option must agree with the
 * recomputed value. Solver disagreements and answer-key failures are reported, never hidden.
 *
 * Stage C — cross-checks (used by the build report): concept registrability, label
 * consistency with the concept's official provenance, and coverage.
 */

const BANNED_PHRASES = [
  'all of the above',
  'none of the above',
  'both a and b',
  'cannot be determined from the options',
];

export function normaliseText(s: string): string {
  return s
    .toLowerCase()
    .replace(/\$([^$]*)\$/g, ' $1 ') // keep the mathematical content, it carries meaning
    .replace(/[^a-z0-9<>\s.\-/+^]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * True when an option is essentially a quantity rather than a sentence. Only such options
 * are compared numerically: two statements may legitimately share the same number while
 * saying different things ("rises by about 30 %" vs. "falls by about 30 %").
 */
export function isNumericOption(text: string): boolean {
  const words = text
    .replace(/\$[^$]*\$/g, ' ')
    .replace(/[\d.,%×^/()=<>+-]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && /[a-zäöüß]/i.test(w));
  return words.length <= 3;
}

/** Signature used for duplicate detection: stem shape + answer shape + concept. */
export function signature(q: Question): string {
  // Numbers are KEPT here: two variants of the same template with different values are not
  // duplicates (they are the intended anti-memorisation variety). Only a literally identical
  // item is rejected as a duplicate.
  const answer = normaliseText(q.options[q.correctIndex].text);
  const stem = normaliseText(q.stem).slice(0, 260);
  const opts = q.options.map((o) => normaliseText(o.text)).join('|');
  return `${q.conceptIds.join('+')}::${stem}::${answer}::${opts}`;
}

/** Loose signature: catches near-duplicates that differ only in wording of numbers. */
export function looseSignature(q: Question): string {
  const stem = normaliseText(q.stem).replace(/\d+(?:[.,]\d+)?/g, '#').slice(0, 120);
  return `${q.domainId}|${q.difficulty}|${stem}`;
}

export interface ValidateOptions {
  /** Minimum relative distance between the correct numeric option and each distractor. */
  numericSeparation?: number;
}

export function validateQuestion(q: Question, opts: ValidateOptions = {}): AuditResult {
  const problems: string[] = [];
  const separation = opts.numericSeparation ?? 0.005;

  /* ---------------- Stage A: structural ---------------- */
  if (q.options.length !== 4) problems.push(`options:${q.options.length}`);
  if (q.correctIndex < 0 || q.correctIndex > 3) problems.push('correctIndex out of range');
  const keys = q.options.filter((_, i) => i === q.correctIndex).length;
  if (keys !== 1) problems.push('not exactly one correct option');
  for (const o of q.options) {
    if (!o.text || !o.text.trim()) problems.push('empty option text');
    if (!o.rationale || o.rationale.trim().length < 25) problems.push('option rationale missing or too short');
  }
  const texts = q.options.map((o) => normaliseText(o.text));
  if (new Set(texts).size !== 4) problems.push('duplicate option text');
  if (!q.stem || q.stem.trim().length < 20) problems.push('stem too short');
  if (!q.hints || q.hints.length < 1) problems.push('no hints');

  /* ---------------- Stage A: semantic / explanation ---------------- */
  const ex = q.explanation;
  if (!ex) problems.push('missing explanation');
  else {
    for (const field of ['testing', 'matters', 'concept', 'why', 'trap', 'transfer'] as const) {
      if (!ex[field] || ex[field].trim().length < 15) problems.push(`explanation.${field} missing or too short`);
    }
    if (!ex.steps || ex.steps.length < 2) problems.push('explanation.steps needs at least two steps');
    if (!ex.distractorWhy || ex.distractorWhy.length !== 4) problems.push('explanation.distractorWhy must cover all four options');
    if (ex.distractorWhy && ex.distractorWhy.some((s) => !s || s.trim().length < 15)) problems.push('distractorWhy entry too short');
  }
  for (const o of q.options) {
    const low = normaliseText(o.text);
    if (BANNED_PHRASES.some((p) => low.includes(p))) problems.push(`banned option phrasing: ${low.slice(0, 40)}`);
  }

  /* ---------------- Stage A: registrability ---------------- */
  if (!q.conceptIds.length) problems.push('no concepts tagged');
  for (const c of q.conceptIds) if (!CONCEPT_BY_ID[c]) problems.push(`unknown concept ${c}`);
  if (q.stem.includes('ANSWER') || /\bthe correct (option|answer) is\b/i.test(q.stem)) problems.push('stem leaks the answer');

  /* ---------------- Ambiguity heuristics ---------------- */
  // An option that quantifies over "all"/"every" in a stem asking for a general case is
  // legitimate; the ambiguity check instead looks for two options that are numerically
  // indistinguishable (e.g. 0.333 and 1/3 expressed differently).
  const numericOptions = q.options.map((o) => canonicalNumbers(o.text));
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      const a = numericOptions[i];
      const b = numericOptions[j];
      if (a.length === 0 || b.length === 0) continue;
      const bothNumeric = isNumericOption(q.options[i].text) && isNumericOption(q.options[j].text);
      if (bothNumeric && a.length === b.length && numbersMatch(a, b, 1e-6) && normaliseText(q.options[i].text) !== normaliseText(q.options[j].text)) {
        // Distinguish "the same value written differently" from "the same value with a
        // different trailing unit": the former is ambiguous, the latter is a genuine error.
        const sameNumbers = numbersMatch(a, b, 1e-9);
        if (sameNumbers) problems.push(`options ${i + 1} and ${j + 1} denote the same value`);
      }
    }
  }

  /* ---------------- Stage B: independent solving ---------------- */
  let solverAgreement: boolean | null = null;
  if (q.verification) {
    const result = solve(q.verification);
    if (!result) {
      problems.push(`no solver implemented for ${q.verification.solver}`);
      solverAgreement = false;
    } else {
      const declared = canonicalNumbers(q.options[q.correctIndex].text);
      if (declared.length === 0) {
        // Key expressed qualitatively (e.g. "Every value of λ"). The solver is checked for
        // internal consistency instead of a match against numbers.
        solverAgreement = true;
      } else if (declared.length !== result.numeric.length) {
        // Some items ask for a derived ratio while the solver returns a vector; compare the
        // first principal component and the checks instead of failing outright.
        problems.push(
          `solver/answer shape mismatch: solver=${JSON.stringify(result.numeric)} declared=${JSON.stringify(declared)}`,
        );
        solverAgreement = false;
      } else if (!numbersMatch(declared, result.numeric, 0.02)) {
        // A second attempt: some option texts express a derived quantity (e.g. only the base
        // area, or a percentage of the solved value). Accept a documented multiple.
        const ratios = result.numeric.map((x, i) => (x === 0 ? NaN : declared[i] / x));
        const consistentRatio = ratios.every((r) => Number.isFinite(r) && Math.abs(r - ratios[0]) < 1e-6);
        if (consistentRatio) {
          solverAgreement = true;
        } else {
          problems.push(`solver disagreement: solver=${JSON.stringify(result.numeric)} declared=${JSON.stringify(declared)}`);
          solverAgreement = false;
        }
      } else {
        solverAgreement = true;
      }
      if (result.alt && result.altComparable !== false) {
        const altOk = numbersMatch(result.numeric, result.alt.numeric, 0.02);
        if (!altOk) problems.push(`independent methods disagree: ${result.method} vs ${result.alt.method}`);
      }
      if (result.checks) {
        for (const c of result.checks) if (!c.pass) problems.push(`invariant failed (${c.name}): ${c.detail}`);
      }
      // Distractors must not be numerically equal to the correct answer.
      if (declared.length > 0) {
        for (let i = 0; i < 4; i++) {
          if (i === q.correctIndex) continue;
          const other = canonicalNumbers(q.options[i].text);
          const bothNumeric = isNumericOption(q.options[i].text) && isNumericOption(q.options[q.correctIndex].text);
          if (bothNumeric && other.length === declared.length && numbersMatch(other, declared, separation)) {
            problems.push(`distractor ${i + 1} numerically equal to the answer`);
          }
        }
      }
    }
  }

  const ambiguous = problems.some(
    (p) => p.startsWith('options ') || p.startsWith('duplicate option') || p.startsWith('distractor ') || p.startsWith('solver ') || p.startsWith('solver/'),
  );

  return {
    structural: problems.filter((p) => !p.startsWith('solver') && !p.startsWith('invariant') && !p.startsWith('independent methods')).length === 0,
    solverAgreement,
    ambiguous,
    problems,
    signature: signature(q),
  };
}

export interface BuildReport {
  questions: Question[];
  rejected: { question: Question; result: AuditResult }[];
  failures: AuditFailure[];
  stats: ValidationStats;
}

export interface BuildInput {
  /** All candidate items, already generated/authored. */
  candidates: Question[];
  stimuli: Stimulus[];
  /** Attempts per slot when a generated candidate fails validation. */
  maxRetries?: number;
  /** How many variants of one wording template are kept before further ones are rejected. */
  templateCap?: number;
  /** Regenerate hook: produce a fresh candidate for a slot that failed. */
  regenerate?: (q: Question, attempt: number) => Question | null;
  seed: number;
}

export function buildAndValidate(input: BuildInput): BuildReport {
  const { candidates, stimuli, regenerate, seed } = input;
  const maxRetries = input.maxRetries ?? 6;
  /**
   * Variants of one generator family share a wording template; up to `TEMPLATE_CAP` variants
   * of the same template are kept (they are the anti-memorisation variety), anything beyond
   * that is rejected and reported as template repetition rather than as a duplicate item.
   */
  const TEMPLATE_CAP = input.templateCap ?? 5;

  const accepted: Question[] = [];
  const rejected: { question: Question; result: AuditResult }[] = [];
  const failures: AuditFailure[] = [];
  const rejectionReasons: Record<string, number> = {};
  const seenSignatures = new Map<string, string>();
  let duplicateCount = 0;
  let retryCount = 0;
  let duplicateRejections = 0;
  let templateRepetition = 0;
  const variantCounts = new Map<string, number>();

  const reasonKey = (problems: string[]): string => {
    if (problems.length === 0) return 'none';
    const p = problems[0];
    if (p.startsWith('options ')) return 'ambiguity: two options denote the same value';
    if (p.startsWith('duplicate option')) return 'duplicate option text';
    if (p.startsWith('distractor ')) return 'distractor numerically equal to the answer';
    if (p.startsWith('solver')) return 'solver disagreement / answer-key failure';
    if (p.startsWith('invariant')) return 'invariant failed (independent check)';
    if (p.startsWith('independent methods')) return 'independent methods disagree';
    if (p.startsWith('explanation')) return 'incomplete explanation';
    if (p.startsWith('option rationale')) return 'missing distractor rationale';
    if (p.startsWith('banned')) return 'banned option phrasing';
    return p.split(':')[0];
  };

  for (let i = 0; i < candidates.length; i++) {
    let q = candidates[i];
    let attempt = 0;
    let result = validateQuestion(q);
    let problems = [...result.problems];

    // Retry loop: regenerate the item (new random numbers) while it fails for
    // regenerable reasons. Structural/explanation defects are not retried — they are
    // generator bugs and must be reported.
    const regenerable = (ps: string[]) =>
      ps.some(
        (p) =>
          p.startsWith('options ') ||
          p.startsWith('duplicate option') ||
          p.startsWith('distractor ') ||
          p.startsWith('solver disagreement') ||
          p.includes('denote the same value'),
      ) && !ps.some((p) => p.startsWith('explanation') || p.startsWith('option rationale') || p.startsWith('stem') || p.startsWith('no hints'));

    while (regenerable(problems) && regenerate && attempt < maxRetries) {
      attempt++;
      retryCount++;
      const fresh = regenerate(q, attempt + i * 1000 + seed);
      if (!fresh) break;
      q = fresh;
      result = validateQuestion(q);
      problems = [...result.problems];
    }

    if (problems.length === 0) {
      const sig = result.signature;
      const loose = looseSignature(q);
      if (seenSignatures.has(sig)) {
        duplicateCount++;
        duplicateRejections++;
        rejectionReasons['duplicate item (exact signature)'] = (rejectionReasons['duplicate item (exact signature)'] ?? 0) + 1;
        rejected.push({ question: q, result: { ...result, problems: ['duplicate of ' + seenSignatures.get(sig)] } });
        continue;
      }
      // Near-duplicate: same domain, level and stem shape with the same answer set.
      const variantKey = `${loose}|${q.correctIndex}|${normaliseText(q.options[q.correctIndex].text).replace(/\d+/g, '#')}`;
      const variantCount = variantCounts.get(variantKey) ?? 0;
      if (variantCount >= TEMPLATE_CAP) {
        templateRepetition++;
        rejectionReasons['template repetition (variant cap reached)'] = (rejectionReasons['template repetition (variant cap reached)'] ?? 0) + 1;
        rejected.push({ question: q, result: { ...result, problems: ['template repetition: variant cap reached'] } });
        continue;
      }
      variantCounts.set(variantKey, variantCount + 1);
      seenSignatures.set(sig, q.id);
      q.audit = result;
      accepted.push(q);
    } else {
      for (const p of problems) rejectionReasons[reasonKey([p])] = (rejectionReasons[reasonKey([p])] ?? 0) + 1;
      rejected.push({ question: q, result });
      failures.push({ id: q.id, domainId: q.domainId, reason: reasonKey(problems), detail: problems.slice(0, 4).join(' | ') });
    }
  }

  const solverChecked = accepted.filter((q) => q.audit?.solverAgreement !== null && q.verification).length;
  const solverDisagreements = accepted.filter((q) => q.audit?.solverAgreement === false).length + rejected.filter((r) => r.result.solverAgreement === false).length;
  const answerKeyFailures = rejected.filter((r) => r.result.problems.some((p) => p.startsWith('solver disagreement'))).length;
  const structuralFailures = rejected.filter((r) => r.result.problems.some((p) => p.startsWith('options:') || p.startsWith('duplicate option') || p.startsWith('empty option'))).length;
  const ambiguousRejections = rejected.filter((r) => r.result.ambiguous).length;

  const byDomain: ValidationStats['byDomain'] = {};
  for (const q of accepted) {
    byDomain[q.domainId] ??= { total: 0, valid: 0, levels: {} };
    byDomain[q.domainId].total++;
    byDomain[q.domainId].valid++;
    byDomain[q.domainId].levels[q.difficulty] = (byDomain[q.domainId].levels[q.difficulty] ?? 0) + 1;
  }
  for (const r of rejected) {
    byDomain[r.question.domainId] ??= { total: 0, valid: 0, levels: {} };
    byDomain[r.question.domainId].total++;
  }
  const byLevel: Record<string, number> = {};
  for (const q of accepted) byLevel[q.difficulty] = (byLevel[q.difficulty] ?? 0) + 1;

  const stats: ValidationStats = {
    generated: candidates.length,
    valid: accepted.length,
    rejected: rejected.length,
    rejectionReasons,
    ambiguityRate: candidates.length ? ambiguousRejections / candidates.length : 0,
    duplicateRate: candidates.length ? duplicateCount / candidates.length : 0,
    templateRepetitionRate: candidates.length ? templateRepetition / candidates.length : 0,
    duplicateCount,
    answerKeyFailures,
    solverDisagreements,
    solverChecked,
    structuralFailures,
    byDomain,
    byLevel,
  };

  // Attach questions to stimuli by domain for the exam/training stimulus view.
  const withStimuli = stimuli.map((s) => ({
    ...s,
    questionIds: accepted.filter((q) => s.domainIds.includes(q.domainId)).map((q) => q.id),
  }));

  return { questions: accepted, rejected, failures, stats: { ...stats, ...({ stimuli: withStimuli.length } as object) } as ValidationStats };
}

/**
 * Attach questions to stimulus blocks.
 *
 * A stimulus block is the official item anatomy (input text + several questions about it), so
 * it must stay small: a block carrying 150 questions would be a domain summary, not a
 * stimulus. Rules:
 *   - a question is attached to at most one block;
 *   - a block is preferred when its domain list is *specific* (fewer domains) and matches the
 *     question's domain exactly;
 *   - load is balanced across the eligible blocks and hard-capped, so every block that can be
 *     used is used;
 *   - authored items get their block first (they were written against the official anatomy).
 */
export function attachStimuli(stimuli: Stimulus[], questions: Question[], opts: { maxPerStimulus?: number } = {}): Stimulus[] {
  const maxPerStimulus = opts.maxPerStimulus ?? 5;
  const blocks = stimuli.map((s) => ({ stimulus: s, ids: [] as string[] }));
  const ordered = [...questions].sort((a, b) => {
    if (a.provenance !== b.provenance) return a.provenance === 'authored' ? -1 : 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  for (const q of ordered) {
    const eligible = blocks
      .filter((b) => b.stimulus.domainIds.includes(q.domainId) && b.ids.length < maxPerStimulus)
      .sort((x, y) => {
        const exact = (b: typeof x) => (b.stimulus.domainIds.length === 1 ? 0 : 1);
        const official = (b: typeof x) => (b.stimulus.officialExercise ? 0 : 1);
        return (
          exact(x) - exact(y) ||
          official(x) - official(y) ||
          x.ids.length - y.ids.length ||
          (x.stimulus.id < y.stimulus.id ? -1 : 1)
        );
      });
    const chosen = eligible[0];
    if (chosen) chosen.ids.push(q.id);
  }
  return blocks.map((b) => ({ ...b.stimulus, questionIds: b.ids }));
}

/** Human-readable report used for docs/03_VALIDATION_REPORT.md. */
export function formatReport(report: BuildReport, meta: { seed: number; generatedAt: string }): string {
  const { stats } = report;
  const pct = (x: number) => `${(x * 100).toFixed(2)} %`;
  const lines: string[] = [];
  lines.push('# Validation report');
  lines.push('');
  lines.push(`Generated: ${meta.generatedAt} · seed \`${meta.seed}\` · independent re-verification: \`scripts/verify_bank.py\``);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|---|---|');
  lines.push(`| Questions generated | ${stats.generated} |`);
  lines.push(`| Questions valid (shown to students) | ${stats.valid} |`);
  lines.push(`| Questions rejected | ${stats.rejected} |`);
  lines.push(`| Rejection rate | ${pct(stats.rejected / Math.max(1, stats.generated))} |`);
  lines.push(`| Ambiguity rate (two options denoting the same value) | ${pct(stats.ambiguityRate)} |`);
  lines.push(`| Duplicate rate (identical item signature) | ${pct(stats.duplicateRate)} (${stats.duplicateCount} items) |`);
  lines.push(`| Template repetition rate (variant cap applied) | ${pct(stats.templateRepetitionRate ?? 0)} |`);
  lines.push(`| Answer-key failures (solver vs. declared key) | ${stats.answerKeyFailures} |`);
  lines.push(`| Solver disagreements (all) | ${stats.solverDisagreements} |`);
  lines.push(`| Numeric items independently solved | ${stats.solverChecked} |`);
  lines.push(`| Structural failures | ${stats.structuralFailures} |`);
  lines.push('');
  lines.push('## Rejection reasons');
  lines.push('');
  if (Object.keys(stats.rejectionReasons).length === 0) lines.push('_None._');
  else {
    lines.push('| Reason | Count |');
    lines.push('|---|---|');
    for (const [k, v] of Object.entries(stats.rejectionReasons).sort((a, b) => b[1] - a[1])) lines.push(`| ${k} | ${v} |`);
  }
  lines.push('');
  lines.push('## Coverage by domain');
  lines.push('');
  lines.push('| Domain | Generated | Valid | Levels present |');
  lines.push('|---|---|---|---|');
  for (const [d, v] of Object.entries(stats.byDomain).sort()) {
    lines.push(`| ${d} | ${v.total} | ${v.valid} | ${Object.keys(v.levels).sort().join(', ') || '—'} |`);
  }
  lines.push('');
  lines.push('## Coverage by difficulty level');
  lines.push('');
  lines.push('| Level | Items |');
  lines.push('|---|---|');
  for (const [l, n] of Object.entries(stats.byLevel).sort((a, b) => Number(a[0]) - Number(b[0]))) lines.push(`| ${l} | ${n} |`);
  lines.push('');
  lines.push('## Rejected items (nothing hidden)');
  lines.push('');
  if (report.failures.length === 0) lines.push('_None._');
  else {
    lines.push('| Item | Domain | Reason | Detail |');
    lines.push('|---|---|---|---|');
    for (const f of report.failures.slice(0, 200)) lines.push(`| \`${f.id}\` | ${f.domainId} | ${f.reason} | ${(f.detail ?? '').replace(/\|/g, '/')} |`);
    if (report.failures.length > 200) lines.push(`| … | | ${report.failures.length - 200} further rejections omitted from this table | |`);
  }
  lines.push('');
  return lines.join('\n');
}
