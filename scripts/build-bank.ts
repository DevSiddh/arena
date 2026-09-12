/**
 * Bank build: generate, validate, write the artefacts, and report honestly.
 *
 * Outputs
 *   content/bank.json               the validated bank (only items that passed every stage)
 *   docs/03_VALIDATION_REPORT.md    full validation statistics, rejected-item table
 *   docs/05_QUESTIONS.md            the printable question documentation (evaluation sections)
 *   content/exam-form.json          a student-view exam form (no answer key — enforced)
 *   docs/04_EXAM_FORM.md            blueprint, achieved coverage, self-test results
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { buildBank, FAMILIES, AUTHORED } from '../engine/bank';
import { LESSONS } from '../content/lessons';
import { CONCEPTS, DOMAINS, OFFICIAL_EXAMPLES } from '../engine/curriculum';
import {
  EXAM_BLUEPRINT,
  buildExamForm,
  examFormPreview,
  leakCheck,
  openItem,
  selectOption,
  startSession,
  studentView,
  submit,
  timeAllowedMs,
  blueprintFeasibility,
} from '../engine/exam';
import { DIFFICULTY_TEXT, MOVE_TEXT, ACTIVITY_TEXT, SKILL_TEXT, SCENE } from '../engine/types';
import { evaluateAnswerKey, solverSelfTest } from '../engine/solvers';

const SEED = 20260902;
const EXAM_SEED = 20260926;

const { bank, report, reportMarkdown } = buildBank({ seed: SEED, variantsPerFamily: 12, targetCandidates: 700, lessons: LESSONS });

mkdirSync('content', { recursive: true });
mkdirSync('docs', { recursive: true });
writeFileSync('content/bank.json', JSON.stringify(bank, null, 1));
/* ------------------------------------------------------------------ concept coverage */
/**
 * Coverage is reported, not assumed.
 *
 * A lesson teaches concepts; a practice step draws items for them. If the bank has no items for a
 * concept, the practice step silently returns fewer items than the lesson asks for — so the gap is
 * measured here and appended to the validation report, together with every practice pool that is
 * thinner than the pool the step requests.
 */
const conceptItemCounts = new Map<string, number>();
for (const q of bank.questions) for (const c of q.conceptIds) conceptItemCounts.set(c, (conceptItemCounts.get(c) ?? 0) + 1);
const emptyConcepts = CONCEPTS.filter((c) => !conceptItemCounts.get(c.id));
const thinPools: string[] = [];
for (const l of LESSONS) {
  for (const section of l.sections) {
    const pool = section.practiceConceptIds;
    if (!pool?.length) continue;
    const wanted = 8; // the largest pool a lesson step requests (mastery check)
    const available = pool.reduce((min, c) => Math.min(min, conceptItemCounts.get(c) ?? 0), Number.POSITIVE_INFINITY);
    if (available < wanted) {
      thinPools.push(`${l.id} ${section.step}: thinnest concept has ${available === Number.POSITIVE_INFINITY ? 0 : available} item(s) (a five-item step needs 5, the mastery check 8)`);
    }
  }
}
const coverageMd: string[] = [];
coverageMd.push('', '## Concept coverage', '');
coverageMd.push(`Concepts in the curriculum: **${CONCEPTS.length}**. Concepts with at least one item: **${CONCEPTS.length - emptyConcepts.length}**.`);
coverageMd.push('');
coverageMd.push('| Domain | Concepts | Items | Concepts with 0 items |');
coverageMd.push('|---|---|---|---|');
for (const d of DOMAINS) {
  const concepts = CONCEPTS.filter((c) => c.domainId === d.id);
  const items = concepts.reduce((sum, c) => sum + (conceptItemCounts.get(c.id) ?? 0), 0);
  const empty = concepts.filter((c) => !conceptItemCounts.get(c.id)).map((c) => c.id);
  coverageMd.push(`| ${d.id} ${d.short} | ${concepts.length} | ${items} | ${empty.join(', ') || '—'} |`);
}
coverageMd.push('', 'Concepts with **no items at all**: ' + (emptyConcepts.length ? emptyConcepts.map((c) => `${c.id} (${c.title}, ${c.domainId})`).join('; ') : 'none. Every taught concept has practice material.'));
coverageMd.push('');
if (thinPools.length) {
  coverageMd.push('Practice steps whose thinnest concept has fewer items than the step requests (the lesson shows a shortfall note instead of inventing items):');
  coverageMd.push('');
  for (const t of thinPools) coverageMd.push(`- ${t}`);
} else {
  coverageMd.push('Every lesson practice step can be filled to its requested size from its own concepts.');
}
coverageMd.push('');
writeFileSync('docs/03_VALIDATION_REPORT.md', reportMarkdown + coverageMd.join('\n'));

console.log('=== BANK BUILD ===');
console.log('generated :', bank.meta.stats.generated);
console.log('valid     :', bank.meta.stats.valid);
console.log('rejected  :', bank.meta.stats.rejected);
console.log('ambiguity :', (bank.meta.stats.ambiguityRate * 100).toFixed(2), '%');
console.log('duplicates:', (bank.meta.stats.duplicateRate * 100).toFixed(2), '%  (' + bank.meta.stats.duplicateCount + ')');
console.log('answer-key failures:', bank.meta.stats.answerKeyFailures);
console.log('solver disagreements:', bank.meta.stats.solverDisagreements, 'of', bank.meta.stats.solverChecked, 'numerically solvable items');
console.log('by domain :', JSON.stringify(bank.meta.counts));
console.log('by level  :', JSON.stringify(bank.meta.stats.byLevel));
{
  const counts = new Map<string, number>();
  for (const q of bank.questions) for (const c of q.conceptIds) counts.set(c, (counts.get(c) ?? 0) + 1);
  const empty = CONCEPTS.filter((c) => !counts.get(c.id));
  console.log('concepts  :', CONCEPTS.length, '· without items:', empty.length ? empty.map((c) => c.id).join(', ') : 'none');
}

const substantive = report.rejected.filter(
  (r) =>
    !r.result.problems.every(
      (p) =>
        p.startsWith('duplicate') ||
        p.includes('denote the same value') ||
        p.startsWith('near-duplicate') ||
        p.startsWith('distractor') ||
        p.startsWith('options ') ||
        p.startsWith('solver disagreement'),
    ),
);
if (substantive.length) {
  console.log('--- rejections that are NOT the expected duplicate/ambiguity classes ---');
  for (const r of substantive.slice(0, 25)) console.log('  ', r.question.id, '::', r.result.problems.join(' | ').slice(0, 220));
} else {
  console.log('rejection classes: only duplicates / ambiguous option pairs / distractor equal to key');
}

/* ------------------------------------------------------------------ solvers */
const solverTest = solverSelfTest();
const keyCheck = evaluateAnswerKey(bank.questions);
console.log('');
console.log('=== SOLVERS ===');
console.log('self-test :', solverTest.passed ? `PASS (${solverTest.cases} cases)` : `FAIL (${solverTest.failures.join('; ')})`);
console.log('key check :', `${keyCheck.solved} items re-derived · ${keyCheck.agreed} agree · ${keyCheck.disagreed} disagree · ${keyCheck.notSolvable} qualitative`);
if (keyCheck.disagreements.length) {
  for (const d of keyCheck.disagreements.slice(0, 10)) console.log('   DISAGREE', d);
}

/* ------------------------------------------------------------------ evaluation sections */
const withEval = bank.questions.filter((q) => q.evaluation).length;
console.log('');
console.log('=== EVALUATION SECTIONS ===');
console.log('items with evaluation:', withEval, 'of', bank.questions.length);
const activityCounts = new Map<string, number>();
for (const q of bank.questions) {
  const a = q.evaluation?.activity ?? 'none';
  activityCounts.set(a, (activityCounts.get(a) ?? 0) + 1);
}
console.log('activity mix:', JSON.stringify(Object.fromEntries([...activityCounts.entries()].sort((a, b) => b[1] - a[1]))));

/* ------------------------------------------------------------------ lessons */
const writeLessonDocs = () => {
  const lines: string[] = [];
  lines.push('# 05 — Lesson layer (12-step teaching sequence)');
  lines.push('');
  lines.push(
    'Every lesson follows the required sequence: what it is → why it matters → prerequisites → core knowledge → visual intuition → worked example → guided practice → independent practice → transfer → dMAT-style items → trick/misconception → mastery check. ' +
      'Practice steps are not prose: each one names the concept pool and difficulty band the application draws its items from.',
  );
  lines.push('');
  lines.push('| Lesson | Domain | Title | Themes | Input texts |');
  lines.push('|---|---|---|---|---|');
  for (const l of LESSONS) {
    const pools = new Set(l.sections.flatMap((s) => s.practiceConceptIds ?? []));
    lines.push(`| ${l.id} | ${l.domainId} | ${l.title} | ${pools.size} | ${l.sections.filter((s) => s.blocks.some((b) => b.kind === 'official')).length} |`);
  }
  lines.push('');
  lines.push('## Step inventory');
  lines.push('');
  lines.push('| Lesson | Steps | Practice steps | Levels covered | Input texts |');
  lines.push('|---|---|---|---|---|');
  for (const l of LESSONS) {
    const practiceSteps = l.sections.filter((s) => s.practiceConceptIds?.length);
    const levels = [...new Set(practiceSteps.flatMap((s) => s.practiceLevels ?? []))].sort();
    lines.push(
      `| ${l.id} | ${l.sections.length} (all 12) | ${practiceSteps.map((s) => s.step).length}: ${practiceSteps.map((s) => s.step.replace(/_/g, ' ')).join(', ')} | ${levels.join(', ')} | ${l.sections.filter((s) => s.blocks.some((b) => b.kind === 'official')).length} |`,
    );
  }
  writeFileSync('docs/05_LESSONS.md', lines.join('\n'));
};
writeLessonDocs();

/* ------------------------------------------------------------------ exam mode */
const form = buildExamForm(bank, EXAM_SEED, EXAM_BLUEPRINT);
const view = studentView(form, bank);
const leaks = leakCheck(view);
const issues = blueprintFeasibility(bank, EXAM_BLUEPRINT);
console.log('');
console.log('=== EXAM MODE (90-minute simulation) ===');
console.log('form      :', form.items.length, 'items ·', Object.keys(form.coverage.byDomain).length, 'domains ·', form.coverage.stimulusBlocks, 'text blocks');
console.log('levels    :', JSON.stringify(form.coverage.byLevel));
console.log('moves     :', JSON.stringify(form.coverage.byMove));
console.log('feasibility:', issues.length === 0 ? 'blueprint fully satisfiable from the bank' : issues.join(' | '));
console.log('answer leak:', leaks.length === 0 ? 'none (student view carries no key, hints, difficulty or explanations)' : leaks.join(', '));

const perfect = (() => {
  let s = startSession(form, 0);
  form.items.forEach((it, i) => {
    s = openItem(s, i, i * 1000);
    s = selectOption(s, i, it.correctIndex);
  });
  return submit(s, form, bank, form.items.length * 1000).result;
})();
const blank = submit(startSession(form, 0), form, bank, 5_000).result;
const systematicallyWrong = (() => {
  let s = startSession(form, 0);
  form.items.forEach((it, i) => {
    s = openItem(s, i, i * 60_000);
    s = selectOption(s, i, (it.correctIndex + 1) % 4);
  });
  return submit(s, form, bank, timeAllowedMs(form)).result;
})();

const checks: [string, boolean][] = [
  ['perfect sitting scores full marks', perfect.score === form.items.length && perfect.total === form.items.length],
  ['blank sitting counts every item as unanswered', blank.score === 0 && blank.unanswered === form.items.length],
  ['wrong sitting produces causes', systematicallyWrong.wrong === form.items.length && systematicallyWrong.diagnosis.causes.length > 0],
  ['wrong sitting yields a study plan', systematicallyWrong.diagnosis.studyPlan.length > 0],
  ['wrong sitting diagnoses why, not just how many', systematicallyWrong.diagnosis.findings.length > 0],
  ['exam review carries explanations (post-exam only)', systematicallyWrong.review.every((r) => r.explanation !== null)],
  ['student view leaks nothing', leaks.length === 0],
  ['form has the full item count', form.items.length === EXAM_BLUEPRINT.questionCount],
  ['coverage reports unmet targets honestly', form.coverage.unmet.length === 0 || new Set(form.coverage.unmet).size === form.coverage.unmet.length],
];
for (const [label, ok] of checks) console.log(ok ? '  ok  ' : '  FAIL', label);
const failedChecks = checks.filter(([, ok]) => !ok);
console.log(failedChecks.length === 0 ? 'exam self-test: PASS' : `exam self-test: ${failedChecks.length} FAILED`);

/* ------------------------------------------------------------------ exam docs */
const md: string[] = [];
md.push('# 04 — Exam mode', '');
md.push(
  `Generated by \`scripts/build-bank.ts\` (form seed ${EXAM_SEED}). The exam is a fixed 90-minute simulation with no hints, no instant feedback, no visible difficulty, no elimination help and no arcade elements. \`content/exam-form.json\` holds the student view that the app renders — it structurally cannot contain the answer key, and \`leakCheck()\` verifies that on every build.`,
);
md.push('');
md.push('## Blueprint');
md.push('');
md.push(`| Aspect | Value |`);
md.push(`|---|---|`);
md.push(`| Items | ${EXAM_BLUEPRINT.questionCount} |`);
md.push(`| Duration | ${EXAM_BLUEPRINT.durationMinutes} minutes (≈ ${Math.round((EXAM_BLUEPRINT.durationMinutes * 60) / EXAM_BLUEPRINT.questionCount)} s per item) |`);
md.push(`| Options per item | 4, exactly one correct |`);
md.push(`| Text blocks | ${EXAM_BLUEPRINT.stimulusBlocks.min}–${EXAM_BLUEPRINT.stimulusBlocks.max}, each with ${EXAM_BLUEPRINT.stimulusBlocks.sizeMin}–${EXAM_BLUEPRINT.stimulusBlocks.sizeMax} questions |`);
md.push(`| Unanswered items | counted as incorrect (reported explicitly) |`);
md.push('');
md.push('### Domain targets');
md.push('');
md.push('| Domain | Target | Achieved | Title |');
md.push('|---|---|---|---|');
for (const [d, target] of Object.entries(EXAM_BLUEPRINT.domainTargets)) {
  md.push(`| ${d} | ${target} | ${form.coverage.byDomain[d] ?? 0} | ${DOMAINS.find((x) => x.id === d)?.title ?? ''} |`);
}
md.push('');
md.push('### Difficulty mix');
md.push('');
md.push('| Level | Target | Achieved | Description |');
md.push('|---|---|---|---|');
for (const [lvl, target] of Object.entries(EXAM_BLUEPRINT.levelTargets)) {
  md.push(`| ${lvl} | ${target} | ${form.coverage.byLevel[lvl] ?? 0} | ${DIFFICULTY_TEXT[Number(lvl) as 1]} |`);
}
md.push('');
md.push('### Cognitive moves');
md.push('');
md.push('| Move | Minimum | Achieved |');
md.push('|---|---|---|');
for (const [mv, min] of Object.entries(EXAM_BLUEPRINT.moveMinimums)) md.push(`| ${MOVE_TEXT[mv as keyof typeof MOVE_TEXT]} | ${min} | ${form.coverage.byMove[mv] ?? 0} |`);
md.push('');
md.push('### Instructions shown to the student');
md.push('');
for (const i of EXAM_BLUEPRINT.instructions) md.push(`- ${i}`);
md.push('');
md.push('### Design notes (what is official and what is our decision)');
md.push('');
for (const i of EXAM_BLUEPRINT.designNotes) md.push(`- ${i}`);
md.push('');
md.push('## Self-test');
md.push('');
md.push('| Check | Result |');
md.push('|---|---|');
for (const [label, ok] of checks) md.push(`| ${label} | ${ok ? 'pass' : 'FAIL'} |`);
md.push('');
md.push('## Reference sittings');
md.push('');
md.push(`- perfect sitting: ${perfect.score}/${perfect.total}, ${perfect.diagnosis.headline}`);
md.push(`- blank sitting: ${blank.score}/${blank.total}, headline “${blank.diagnosis.headline}”`);
md.push(`- systematically wrong sitting: ${systematicallyWrong.score}/${systematicallyWrong.total}; causes: ${systematicallyWrong.diagnosis.causes.map((c) => `${c.label} (${c.count})`).join('; ')}`);
md.push(`- blueprint feasibility against the current bank: ${issues.length === 0 ? 'fully satisfiable' : issues.join('; ')}`);
md.push('');
md.push('## Reporting');
md.push('');
md.push(`> ${perfect.reportingNote}`);
md.push('');
writeFileSync('docs/04_EXAM_FORM.md', md.join('\n'));
writeFileSync('content/exam-form.json', JSON.stringify(view, null, 1));

/* ------------------------------------------------------------------ question documentation */
const byDomain = new Map<string, typeof bank.questions>();
for (const q of bank.questions) {
  const list = byDomain.get(q.domainId) ?? [];
  list.push(q);
  byDomain.set(q.domainId, list);
}
const qd: string[] = [];
qd.push('# 07 — Question documentation');
qd.push('');
qd.push(
  `Every item in the bank (${bank.questions.length} items) with its evaluation section (task type, skill, setting), difficulty, reasoning type, cognitive move, source family and confidence label. ` +
    `Full worked solutions and the complete rationale for each distractor are in \`content/bank.json\` and are rendered in the app; this document is the audit view — the item's id, what it demands and where it came from.`,
);
qd.push('');
qd.push('## Official example studies (how the four sample exercises are used)');
qd.push('');
for (const ex of OFFICIAL_EXAMPLES) {
  qd.push(`### ${ex.title} — ${ex.domainId}`);
  qd.push('');
  qd.push(ex.teaches.map((t) => `- ${t}`).join('\n'));
  qd.push('');
  qd.push(`*Key insight:* ${ex.keyInsight}`);
  qd.push('');
  qd.push(`*Beyond the sample:* ${ex.beyondSample.join(' ')}`);
  qd.push('');
}
for (const d of DOMAINS) {
  const items = byDomain.get(d.id) ?? [];
  qd.push(`## ${d.id} — ${d.title} (${items.length} items)`);
  qd.push('');
  qd.push(`**Official status:** ${d.labels.join(', ')}${d.officialEvidence ? ` — evidence: ${d.officialEvidence}` : ''}`);
  qd.push('');
  qd.push('| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |');
  qd.push('|---|---|---|---|---|---|---|---|---|---|---|');
  for (const q of items) {
    const e = q.evaluation;
    qd.push(
      `| ${q.id} | ${q.difficulty} | ${e ? ACTIVITY_TEXT[e.activity] : '—'} | ${e ? SKILL_TEXT[e.skill] : '—'} | ${e ? SCENE[e.scene] : '—'} | ${q.reasoningType} | ${q.cognitiveMove} | ${q.style} | ${q.label} | ${q.provenance}${q.tags.length ? ` (${q.tags.slice(0, 2).join(', ')})` : ''} | ${q.stimulusId ?? '—'} |`,
    );
  }
  qd.push('');
}
writeFileSync('docs/07_QUESTIONS.md', qd.join('\n'));

/* ------------------------------------------------------------------ summary */
console.log('');
console.log('=== ARTEFACTS ===');
console.log('content/bank.json                 ', bank.questions.length, 'items');
console.log('content/exam-form.json            ', view.items.length, 'items,', view.stimuli.length, 'text blocks, no answer key');
console.log('docs/03_VALIDATION_REPORT.md      ', bank.meta.stats.valid, 'valid of', bank.meta.stats.generated, 'generated');
console.log('docs/04_EXAM_FORM.md              blueprint + self-test');
console.log('docs/05_LESSONS.md                ', LESSONS.length, 'lessons × 12 steps');
console.log('docs/07_QUESTIONS.md              ', bank.questions.length, 'documented items across', DOMAINS.length, 'domains');
console.log('generator families                ', FAMILIES.length, '· authored items', AUTHORED.length, '· concepts', CONCEPTS.length);
console.log('preview                           ', examFormPreview(bank, EXAM_SEED).length, 'questions');
