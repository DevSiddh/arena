/**
 * Evidence model and diagnosis.
 *
 * The whole point of the preparation system is that a result is never just "62 %". Every
 * answer — right or wrong — is stored as an `AttemptEvidence` record carrying the concept,
 * the difficulty, the reasoning type and, for wrong answers, the *error mechanism* of the
 * distractor the student chose. `diagnose()` converts those records into causes:
 * prerequisite gap, conceptual misunderstanding, calculation, unit handling, misreading, or
 * failed transfer to an unfamiliar context.
 *
 * Both the exam engine and the training engine feed this module, so a student sees the same
 * diagnosis language everywhere.
 */

import type { CognitiveMove, Difficulty, ErrorTag, ItemStyle, Question, ReasoningType } from './types';
import { ERROR_TAG_TEXT } from './types';
import { CONCEPT_BY_ID, prerequisitesOf } from './curriculum';

/* ------------------------------------------------------------------ evidence records */

export interface AttemptEvidence {
  questionId: string;
  domainId: string;
  conceptIds: string[];
  difficulty: Difficulty;
  reasoningType: ReasoningType;
  cognitiveMove: CognitiveMove;
  style: ItemStyle;
  /** True when the chosen option was the key. */
  correct: boolean;
  /** Chosen option index, or null when the item was left unanswered. */
  answerIndex: number | null;
  /** Error mechanism of the chosen option (null when correct or unanswered). */
  errorTag: ErrorTag | null;
  /** Time on task. 0 when unknown. */
  spentMs: number;
  /** Context the evidence came from — the exam never shows hints, training does. */
  mode: 'training' | 'exam';
  usedHints?: number;
  retried?: boolean;
}

/** Build an evidence record from a question and the option that was chosen. */
export function evidenceFromAttempt(
  q: Question,
  chosen: number | null,
  spentMs: number,
  mode: AttemptEvidence['mode'],
  extra: { usedHints?: number; retried?: boolean } = {},
): AttemptEvidence {
  const correct = chosen !== null && chosen === q.correctIndex;
  return {
    questionId: q.id,
    domainId: q.domainId,
    conceptIds: q.conceptIds,
    difficulty: q.difficulty,
    reasoningType: q.reasoningType,
    cognitiveMove: q.cognitiveMove,
    style: q.style,
    correct,
    answerIndex: chosen,
    errorTag: correct || chosen === null ? null : q.options[chosen]?.errorTag ?? null,
    spentMs,
    mode,
    ...extra,
  };
}

/* ------------------------------------------------------------------ failure causes */

export type FailureCause =
  | 'prerequisite_gap'
  | 'conceptual'
  | 'calculation'
  | 'unit'
  | 'misread'
  | 'transfer_failure'
  | 'pacing'
  | 'unanswered';

export const FAILURE_CAUSE_TEXT: Record<FailureCause, string> = {
  prerequisite_gap: 'A prerequisite is missing',
  conceptual: 'The concept itself is not yet understood',
  calculation: 'The method is right, the execution is not reliable',
  unit: 'Units and quantities are mishandled',
  misread: 'The question is misread or the wrong information is used',
  transfer_failure: 'Familiar items work, unfamiliar contexts do not',
  pacing: 'Time and pacing',
  unanswered: 'Items left blank',
};

export const FAILURE_CAUSE_ACTION: Record<FailureCause, string> = {
  prerequisite_gap: 'Re-study the prerequisite concept first; do not drill the dependent topic yet.',
  conceptual: 'Work through the concept lesson and explain the rule in your own words before practising.',
  calculation: 'Practise the same rule with the no-notes rule and check each step; keep units attached while computing.',
  unit: 'Drill unit conversion and carry units through every computation until the target unit is the last step.',
  misread: 'Before computing, write down what is asked and which given values matter. Slow down on the first read.',
  transfer_failure: 'Practise transfer items (level 4+) where the context changes but the principle does not.',
  pacing: 'Practise under a clock; cap time per item and leave items blank only deliberately.',
  unanswered: 'Answer every item: a reasoned guess is never worse than a blank in a no-penalty format.',
};

const CONCEPTUAL_TAGS: ErrorTag[] = [
  'concept_confusion',
  'definition_misuse',
  'label_confusion',
  'model_assumption_error',
  'wrong_assumption',
  'sufficient_necessary_confusion',
  'correlation_causation',
  'scope_error',
  'base_rate_neglect',
  'overprecision',
  'linearity_assumption',
  'rule_misapplication',
  'causal_direction_reversed',
];

const CALCULATION_TAGS: ErrorTag[] = [
  'calculation_slip',
  'sign_error',
  'component_confusion',
  'ratio_error',
  'square_root_scaling',
];

const UNIT_TAGS: ErrorTag[] = ['unit_error', 'unit_conversion'];

const MISREAD_TAGS: ErrorTag[] = ['question_misread', 'irrelevant_data_used', 'graph_misread', 'inequality_direction'];

/** Map a distractor's error mechanism onto the cause taxonomy the diagnosis reports. */
export function causeOfErrorTag(tag: ErrorTag | null, unanswered = false): FailureCause {
  if (unanswered) return 'unanswered';
  if (!tag || tag === 'none') return 'conceptual';
  if (tag === 'prerequisite_gap') return 'prerequisite_gap';
  if (tag === 'transfer_failure') return 'transfer_failure';
  if (CONCEPTUAL_TAGS.includes(tag)) return 'conceptual';
  if (CALCULATION_TAGS.includes(tag)) return 'calculation';
  if (UNIT_TAGS.includes(tag)) return 'unit';
  if (MISREAD_TAGS.includes(tag)) return 'misread';
  return 'conceptual';
}

/* ------------------------------------------------------------------ simple aggregations */

export interface Slice {
  key: string;
  label: string;
  attempted: number;
  correct: number;
  accuracy: number;
  /** Average difficulty of the attempted items — prevents over-reading a hard slice. */
  averageDifficulty: number;
}

function sliceOf(keyLabel: string, key: string, items: AttemptEvidence[]): Slice {
  const correct = items.filter((e) => e.correct).length;
  return {
    key,
    label: keyLabel,
    attempted: items.length,
    correct,
    accuracy: items.length ? correct / items.length : 0,
    averageDifficulty: items.length ? items.reduce((s, e) => s + e.difficulty, 0) / items.length : 0,
  };
}

export function sliceBy(ev: AttemptEvidence[], key: (e: AttemptEvidence) => string, label: (k: string) => string = (k) => k): Slice[] {
  const groups = new Map<string, AttemptEvidence[]>();
  for (const e of ev) {
    const k = key(e);
    const g = groups.get(k);
    if (g) g.push(e);
    else groups.set(k, [e]);
  }
  return [...groups.entries()]
    .map(([k, items]) => sliceOf(label(k), k, items))
    .sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted);
}

export function overallAccuracy(ev: AttemptEvidence[]): number {
  return ev.length ? ev.filter((e) => e.correct).length / ev.length : 0;
}

/* ------------------------------------------------------------------ concept statistics */

export interface ConceptStat {
  conceptId: string;
  title: string;
  domainId: string;
  lessonId: string;
  prereq: string[];
  attempted: number;
  correct: number;
  accuracy: number;
  /** Mean difficulty the student faced on this concept. */
  averageDifficulty: number;
  wrongItemIds: string[];
  /** Error mechanisms actually observed on this concept. */
  errorTags: ErrorTag[];
}

export function conceptStats(ev: AttemptEvidence[]): ConceptStat[] {
  const out = new Map<string, ConceptStat>();
  for (const e of ev) {
    for (const cid of e.conceptIds) {
      const def = CONCEPT_BY_ID[cid];
      const cur =
        out.get(cid) ??
        {
          conceptId: cid,
          title: def?.title ?? cid,
          domainId: def?.domainId ?? e.domainId,
          lessonId: def?.lessonId ?? '',
          prereq: def?.prereq ?? [],
          attempted: 0,
          correct: 0,
          accuracy: 0,
          averageDifficulty: 0,
          wrongItemIds: [],
          errorTags: [],
        };
      cur.attempted += 1;
      if (e.correct) cur.correct += 1;
      else {
        cur.wrongItemIds.push(e.questionId);
        if (e.errorTag && e.errorTag !== 'none') cur.errorTags.push(e.errorTag);
      }
      cur.averageDifficulty += e.difficulty;
      out.set(cid, cur);
    }
  }
  for (const s of out.values()) {
    s.accuracy = s.attempted ? s.correct / s.attempted : 0;
    s.averageDifficulty = s.attempted ? s.averageDifficulty / s.attempted : 0;
  }
  return [...out.values()].sort((a, b) => a.accuracy - b.accuracy || b.attempted - a.attempted);
}

export interface ErrorProfileEntry {
  tag: ErrorTag;
  label: string;
  count: number;
  share: number;
  cause: FailureCause;
  /** Item ids where this mechanism was observed (max 6, for the review list). */
  itemIds: string[];
}

export function errorProfile(ev: AttemptEvidence[]): ErrorProfileEntry[] {
  const wrong = ev.filter((e) => !e.correct);
  const counts = new Map<ErrorTag, string[]>();
  for (const e of wrong) {
    const tag = e.errorTag ?? 'question_misread';
    const list = counts.get(tag);
    if (list) list.push(e.questionId);
    else counts.set(tag, [e.questionId]);
  }
  return [...counts.entries()]
    .map(([tag, ids]) => ({
      tag,
      label: ERROR_TAG_TEXT[tag],
      count: ids.length,
      share: wrong.length ? ids.length / wrong.length : 0,
      cause: causeOfErrorTag(tag),
      itemIds: ids.slice(0, 6),
    }))
    .sort((a, b) => b.count - a.count);
}

export interface CauseProfileEntry {
  cause: FailureCause;
  label: string;
  count: number;
  share: number;
  itemIds: string[];
  action: string;
}

export function causeProfile(ev: AttemptEvidence[]): CauseProfileEntry[] {
  const wrong = ev.filter((e) => !e.correct);
  const counts = new Map<FailureCause, string[]>();
  for (const e of wrong) {
    const cause = causeOfErrorTag(e.errorTag, e.answerIndex === null);
    const list = counts.get(cause);
    if (list) list.push(e.questionId);
    else counts.set(cause, [e.questionId]);
  }
  return [...counts.entries()]
    .map(([cause, ids]) => ({
      cause,
      label: FAILURE_CAUSE_TEXT[cause],
      count: ids.length,
      share: wrong.length ? ids.length / wrong.length : 0,
      itemIds: ids.slice(0, 6),
      action: FAILURE_CAUSE_ACTION[cause],
    }))
    .sort((a, b) => b.count - a.count);
}

/* ------------------------------------------------------------------ diagnosis */

export interface DiagnosisFinding {
  kind: FailureCause | 'strength';
  severity: 'high' | 'medium' | 'low';
  title: string;
  /** Why this finding was reached — the reasoning, not the raw score. */
  explanation: string;
  evidence: string[];
  concepts: string[];
  lessonIds: string[];
  firstStep: string;
}

export interface StudyPlanStep {
  lessonId: string;
  conceptIds: string[];
  why: string;
  estimatedMinutes: number;
}

export interface Diagnosis {
  attempts: number;
  correct: number;
  accuracy: number;
  unanswered: number;
  headline: string;
  causes: CauseProfileEntry[];
  findings: DiagnosisFinding[];
  strengths: string[];
  studyPlan: StudyPlanStep[];
  nextStep: string;
}

export interface DiagnoseOptions {
  /** Minimum items on a concept before it can be called weak. */
  minConceptAttempts?: number;
  /** Concept accuracy below which the concept counts as weak. */
  weakThreshold?: number;
  mode?: AttemptEvidence['mode'];
}

/**
 * Turn raw answers into causes.
 *
 * Two of the findings need the concept graph:
 *  - a *prerequisite gap* is reported only when a weak concept sits above a prerequisite that
 *    is itself demonstrably weak (or was answered wrong directly);
 *  - a *transfer failure* is reported when the easy/standard items are solid but level 4+
 *    items in the same or related concepts fail.
 */
export function diagnose(ev: AttemptEvidence[], opts: DiagnoseOptions = {}): Diagnosis {
  const minAttempts = opts.minConceptAttempts ?? 2;
  const weakThreshold = opts.weakThreshold ?? 0.6;
  const attempts = ev.length;
  const correct = ev.filter((e) => e.correct).length;
  const accuracy = attempts ? correct / attempts : 0;
  const unanswered = ev.filter((e) => e.answerIndex === null).length;
  const causes = causeProfile(ev);
  const last = conceptStats(ev);
  const concepts = new Map(last.map((s) => [s.conceptId, s]));
  const findings: DiagnosisFinding[] = [];

  /* --- prerequisite gaps ------------------------------------------------------------- */
  const weak = last.filter((s) => s.attempted >= minAttempts && s.accuracy < weakThreshold);
  for (const s of weak) {
    const roots = prerequisitesOf(s.conceptId)
      .map((p) => concepts.get(p))
      .filter((p): p is ConceptStat => !!p)
      .filter((p) => p.accuracy < 0.7)
      .sort((a, b) => a.accuracy - b.accuracy);
    const missing = s.prereq
      .map((p) => concepts.get(p))
      .filter((p): p is ConceptStat => !!p && p.accuracy <= 0.5);
    const root = roots[0] ?? missing[0];
    if (!root) continue;
    findings.push({
      kind: 'prerequisite_gap',
      severity: s.accuracy <= 0.25 ? 'high' : 'medium',
      title: `${s.title} fails because ${root.title} is not secure`,
      explanation: `You answered ${s.correct}/${s.attempted} items on "${s.title}" correctly, and the prerequisite "${root.title}" is also weak (${root.correct}/${root.attempted}). Drilling the harder topic now would train the symptom; the dependency has to be repaired first.`,
      evidence: [
        `${root.conceptId} ${root.title}: ${root.correct}/${root.attempted} correct`,
        `${s.conceptId} ${s.title}: ${s.correct}/${s.attempted} correct`,
        `wrong items: ${s.wrongItemIds.slice(0, 4).join(', ')}`,
      ],
      concepts: [root.conceptId, s.conceptId],
      lessonIds: [...new Set([root.lessonId, s.lessonId].filter(Boolean))],
      firstStep: FAILURE_CAUSE_ACTION.prerequisite_gap,
    });
  }

  /* --- dominant error mechanisms ------------------------------------------------------ */
  const byCause = new Map<FailureCause, CauseProfileEntry>(causes.map((c) => [c.cause, c]));
  for (const cause of ['conceptual', 'calculation', 'unit', 'misread', 'unanswered'] as FailureCause[]) {
    const entry = byCause.get(cause);
    if (!entry) continue;
    if (entry.count < 2 && !(entry.count >= 1 && entry.share >= 0.5)) continue;
    const affected = last.filter((s) => s.errorTags.some((t) => causeOfErrorTag(t) === cause));
    findings.push({
      kind: cause,
      severity: entry.share >= 0.5 && entry.count >= 3 ? 'high' : 'medium',
      title: FAILURE_CAUSE_TEXT[cause],
      explanation:
        cause === 'conceptual'
          ? `${entry.count} of ${causes.reduce((s, c) => s + c.count, 0)} wrong answers came from choosing an option built on a wrong idea — the rule itself, not the arithmetic, is the problem.`
          : cause === 'calculation'
            ? `${entry.count} wrong answers used a correct approach but an incorrect execution — speed and step discipline, not understanding.`
            : cause === 'unit'
              ? `${entry.count} wrong answers mishandled units or conversions (e.g. bar vs. metre of water column).`
              : cause === 'misread'
                ? `${entry.count} wrong answers show the wrong information being used or the question being read in the wrong direction.`
                : `${entry.count} items were left blank, which costs certain marks in a format without negative marking.`,
      evidence: [
        ...entry.itemIds.slice(0, 4).map((id) => `${id} — ${ERROR_TAG_TEXT[ev.find((e) => e.questionId === id)?.errorTag ?? 'question_misread']}`),
        ...(affected.length ? [`affected concepts: ${affected.slice(0, 5).map((s) => s.conceptId).join(', ')}`] : []),
      ],
      concepts: affected.map((s) => s.conceptId),
      lessonIds: [...new Set(affected.map((s) => s.lessonId).filter(Boolean))],
      firstStep: FAILURE_CAUSE_ACTION[cause],
    });
  }

  /* --- transfer failure --------------------------------------------------------------- */
  const easy = ev.filter((e) => e.difficulty <= 2);
  const hard = ev.filter((e) => e.difficulty >= 4);
  if (easy.length >= 3 && hard.length >= 3 && overallAccuracy(easy) >= 0.75 && overallAccuracy(hard) < 0.5) {
    const hardConcepts = [...new Set(hard.filter((e) => !e.correct).flatMap((e) => e.conceptIds))];
    findings.push({
      kind: 'transfer_failure',
      severity: 'high',
      title: 'Familiar items work, unfamiliar contexts do not',
      explanation: `You solved ${Math.round(overallAccuracy(easy) * 100)} % of the direct items but only ${Math.round(overallAccuracy(hard) * 100)} % of transfer and exam-style items. The principle is available; recognising it behind a new context is the missing skill.`,
      evidence: [
        `levels 1–2: ${easy.filter((e) => e.correct).length}/${easy.length}`,
        `levels 4+: ${hard.filter((e) => e.correct).length}/${hard.length}`,
        hardConcepts.length ? `failing concepts in transfer items: ${hardConcepts.slice(0, 6).join(', ')}` : '',
      ].filter(Boolean),
      concepts: hardConcepts,
      lessonIds: [...new Set(hardConcepts.map((c) => CONCEPT_BY_ID[c]?.lessonId ?? '').filter(Boolean))],
      firstStep: FAILURE_CAUSE_ACTION.transfer_failure,
    });
  }

  /* --- pacing ------------------------------------------------------------------------ */
  const timed = ev.filter((e) => e.spentMs > 0);
  if (timed.length >= 8) {
    const totalMs = timed.reduce((s, e) => s + e.spentMs, 0);
    const perItem = totalMs / timed.length;
    if (unanswered / Math.max(attempts, 1) >= 0.15 || perItem > 150_000) {
      findings.push({
        kind: 'pacing',
        severity: 'medium',
        title: FAILURE_CAUSE_TEXT.pacing,
        explanation: `Average time per item was ${(perItem / 1000).toFixed(0)} s with ${unanswered} blank answer(s). Under the no-notes rule the limiting factor is often time allocation, not knowledge.`,
        evidence: [`${timed.length} timed items`, `average ${(perItem / 1000).toFixed(0)} s`, `${unanswered} unanswered`],
        concepts: [],
        lessonIds: [],
        firstStep: FAILURE_CAUSE_ACTION.pacing,
      });
    }
  }

  /* --- strengths --------------------------------------------------------------------- */
  const strengths = last
    .filter((s) => s.attempted >= minAttempts && s.accuracy >= 0.8)
    .slice(0, 6)
    .map((s) => `${s.title} (${s.correct}/${s.attempted})`);
  if (overallAccuracy(ev.filter((e) => e.difficulty >= 4)) >= 0.75 && hard.length >= 4) {
    strengths.push(`Transfer and exam-style items at ${Math.round(overallAccuracy(hard) * 100)} % — your principle-recognition is working`);
  }

  /* --- ordered findings and study plan ------------------------------------------------ */
  // A sitting that is mostly blank is not evidence about concepts. Say so instead of
  // diagnosing topics the student never attempted.
  if (attempts > 0 && unanswered >= Math.max(2, 0.5 * attempts)) {
    findings.splice(
      0,
      findings.length,
      {
        kind: 'unanswered',
        severity: 'high',
        title: FAILURE_CAUSE_TEXT.unanswered,
        explanation: `${unanswered} of ${attempts} items were left without an answer. There is not enough attempted work to judge concept knowledge; the immediate issue is that the sitting was not completed.`,
        evidence: [`${unanswered}/${attempts} items unanswered`, `${correct} correct answer(s) recorded`],
        concepts: [],
        lessonIds: [],
        firstStep: FAILURE_CAUSE_ACTION.unanswered,
      },
    );
  }

  const severityRank = { high: 0, medium: 1, low: 2 } as const;
  findings.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  const planMap = new Map<string, StudyPlanStep>();
  for (const f of findings) {
    for (const lessonId of f.lessonIds) {
      const conceptIds = f.concepts.filter((c) => CONCEPT_BY_ID[c]?.lessonId === lessonId);
      const step = planMap.get(lessonId);
      if (step) {
        step.conceptIds = [...new Set([...step.conceptIds, ...conceptIds])];
        step.why = step.why.includes(f.title) ? step.why : `${step.why}; ${f.title}`;
      } else {
        planMap.set(lessonId, {
          lessonId,
          conceptIds,
          why: f.title,
          estimatedMinutes: f.severity === 'high' ? 45 : 30,
        });
      }
    }
  }
  const studyPlan = [...planMap.values()].sort((a, b) => b.estimatedMinutes - a.estimatedMinutes);

  const top = findings[0];
  const headline =
    attempts === 0
      ? 'No answers recorded yet.'
      : accuracy >= 0.8 && findings.length === 0
        ? `Strong result (${correct}/${attempts}). Keep the level up with transfer items.`
        : top
          ? `${correct}/${attempts} correct. Main cause of lost marks: ${top.title.toLowerCase()}.`
          : `${correct}/${attempts} correct, no systematic cause visible yet — the sample is still small.`;

  return {
    attempts,
    correct,
    accuracy,
    unanswered,
    headline,
    causes,
    findings,
    strengths,
    studyPlan,
    nextStep: top ? top.firstStep : 'Move on to harder items in the same domains and keep time per item under two minutes.',
  };
}

/** Diagnosis as Markdown — used by CLI tools and by the printable study report. */
export function formatDiagnosisMarkdown(d: Diagnosis, title = 'Diagnosis'): string {
  const lines: string[] = [`# ${title}`, '', `**${d.headline}**`, ''];
  if (d.causes.length) {
    lines.push('## Why marks were lost', '');
    lines.push('| Cause | Items | Share of errors |');
    lines.push('|---|---|---|');
    for (const c of d.causes) lines.push(`| ${c.label} | ${c.count} | ${Math.round(c.share * 100)} % |`);
    lines.push('');
  }
  for (const f of d.findings) {
    lines.push(`## ${f.title}`, '', f.explanation, '', 'Evidence:', '');
    for (const e of f.evidence) lines.push(`- ${e}`);
    lines.push('', `First step: ${f.firstStep}`, '');
  }
  if (d.strengths.length) {
    lines.push('## What is already solid', '');
    for (const s of d.strengths) lines.push(`- ${s}`);
    lines.push('');
  }
  if (d.studyPlan.length) {
    lines.push('## Study plan', '');
    lines.push('| Lesson | Concepts | Why | Minutes |');
    lines.push('|---|---|---|---|');
    for (const s of d.studyPlan) lines.push(`| ${s.lessonId} | ${s.conceptIds.join(', ')} | ${s.why} | ${s.estimatedMinutes} |`);
    lines.push('');
  }
  return lines.join('\n');
}
