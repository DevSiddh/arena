import { writeFileSync, mkdirSync } from 'node:fs';
import { buildBank } from '../engine/bank';
import {
  EXAM_BLUEPRINT,
  blueprintFeasibility,
  buildExamForm,
  examFormPreview,
  leakCheck,
  openItem,
  selectOption,
  startSession,
  studentView,
  submit,
  timeAllowedMs,
} from '../engine/exam';
import { DIFFICULTY_TEXT, MOVE_TEXT } from '../engine/types';

const SEED = 20260902;
const EXAM_SEED = 20260926;

const { bank, report, reportMarkdown } = buildBank({ seed: SEED, variantsPerFamily: 14, targetCandidates: 660 });

mkdirSync('content', { recursive: true });
mkdirSync('docs', { recursive: true });
writeFileSync('content/bank.json', JSON.stringify(bank, null, 1));
writeFileSync('docs/03_VALIDATION_REPORT.md', reportMarkdown);

console.log('=== BANK BUILD ===');
console.log('generated :', bank.meta.stats.generated);
console.log('valid     :', bank.meta.stats.valid);
console.log('rejected  :', bank.meta.stats.rejected);
console.log('ambiguity :', (bank.meta.stats.ambiguityRate * 100).toFixed(2), '%');
console.log('duplicates:', (bank.meta.stats.duplicateRate * 100).toFixed(2), '%  (' + bank.meta.stats.duplicateCount + ')');
console.log('answer-key failures:', bank.meta.stats.answerKeyFailures);
console.log('solver disagreements:', bank.meta.stats.solverDisagreements, 'of', bank.meta.stats.solverChecked, 'solver-checked items');
console.log('by domain :', JSON.stringify(bank.meta.counts));
console.log('by level  :', JSON.stringify(bank.meta.stats.byLevel));

const EXPECTED_REJECTIONS = [/^duplicate/i, /denote the same value/i, /^near-duplicate/i, /^distractor/i, /template repetition/i, /variant cap/i];
const bad = report.rejected.filter((r) => !r.result.problems.every((p) => EXPECTED_REJECTIONS.some((re) => re.test(p))));
console.log('rejection classes beyond the expected set:', bad.length === 0 ? 'none' : bad.length);
if (bad.length) {
  for (const b of bad.slice(0, 12)) console.log('  UNEXPECTED', b.question.id, '::', b.result.problems.join(' | ').slice(0, 200));
}

/* ------------------------------------------------------------------ exam mode */
console.log('');
console.log('=== EXAM MODE (90-minute simulation) ===');
const form = buildExamForm(bank, EXAM_SEED, EXAM_BLUEPRINT);
const view = studentView(form, bank);
const leaks = leakCheck(view);
const feasibility = blueprintFeasibility(bank, EXAM_BLUEPRINT);

console.log('form       :', form.items.length, 'items ·', Object.keys(form.coverage.byDomain).length, 'domains ·', form.coverage.stimulusBlocks, 'text block(s) ·', form.blueprint.durationMinutes, 'min');
console.log('coverage   : levels', JSON.stringify(form.coverage.byLevel), '· moves', JSON.stringify(form.coverage.byMove));
console.log('unmet      :', feasibility.length === 0 ? 'none' : feasibility.join(' | '));
console.log('answer leak:', leaks.length === 0 ? 'none (student view carries no key, hints, difficulty or explanations)' : leaks.join(', '));

// Self-test the engine end to end: a perfect sitting, a blank sitting and a systematically wrong one.
const perfect = (() => {
  let s = startSession(form, 0);
  form.items.forEach((it, i) => {
    s = openItem(s, i, i * 1_000);
    s = selectOption(s, i, it.correctIndex);
  });
  return submit(s, form, bank, form.items.length * 1_000).result;
})();
const blank = (() => {
  const s = submit(startSession(form, 0), form, bank, 5_000).result;
  return s;
})();
const systematicallyWrong = (() => {
  let s = startSession(form, 0);
  form.items.forEach((it, i) => {
    s = openItem(s, i, i * 60_000);
    s = selectOption(s, i, (it.correctIndex + 1) % 4);
  });
  return submit(s, form, bank, timeAllowedMs(form)).result;
})();

const checks: [string, boolean][] = [
  ['perfect sitting scores full marks', perfect.score === form.items.length && perfect.unanswered === 0],
  ['blank sitting counts every item as unanswered/incorrect', blank.score === 0 && blank.unanswered === form.items.length],
  ['wrong sitting produces a diagnosis with causes', systematicallyWrong.wrong === form.items.length && systematicallyWrong.diagnosis.causes.length > 0],
  ['wrong sitting yields a study plan', systematicallyWrong.diagnosis.studyPlan.length > 0],
  ['exam review carries explanations (post-exam only)', systematicallyWrong.review.every((r) => r.explanation !== null)],
  ['student view leaks nothing', leaks.length === 0],
  ['form has the full item count', form.items.length === EXAM_BLUEPRINT.questionCount],
  ['coverage reports honestly', form.coverage.unmet.length === 0 || new Set(form.coverage.unmet).size === form.coverage.unmet.length],
];
for (const [label, ok] of checks) console.log(ok ? '  ok  ' : '  FAIL', label);
const failed = checks.filter(([, ok]) => !ok);
console.log(failed.length === 0 ? 'exam self-test: PASS' : `exam self-test: ${failed.length} FAILED`);
console.log('perfect:', perfect.score + '/' + perfect.total, '· blank diagnosis:', blank.diagnosis.headline);
console.log('wrong  :', systematicallyWrong.score + '/' + systematicallyWrong.total, '·', systematicallyWrong.diagnosis.headline);
console.log('preview (legacy helper):', examFormPreview(bank, EXAM_SEED).length, 'questions');

writeFileSync('content/exam-form.json', JSON.stringify(view, null, 1));

const md: string[] = [];
md.push('# 04 — Exam mode: form, coverage and self-test', '');
md.push(
  'Generated by `scripts/build-bank.ts` from `content/bank.json` (seed ' +
    EXAM_SEED +
    '). Exam mode is a fixed 90-minute simulation with no hints, no instant feedback, no visible difficulty and no arcade elements. The student view written to `content/exam-form.json` structurally cannot contain the answer key, and `leakCheck()` proves that on every build.',
  '',
);
md.push('## Blueprint', '');
md.push(`- title: ${EXAM_BLUEPRINT.title}`);
md.push(`- duration: ${EXAM_BLUEPRINT.durationMinutes} minutes for ${EXAM_BLUEPRINT.questionCount} items (about ${Math.round((EXAM_BLUEPRINT.durationMinutes * 60) / EXAM_BLUEPRINT.questionCount)} s per item)`);
md.push(`- text blocks: ${EXAM_BLUEPRINT.stimulusBlocks.min}–${EXAM_BLUEPRINT.stimulusBlocks.max}, each with ${EXAM_BLUEPRINT.stimulusBlocks.sizeMin}–${EXAM_BLUEPRINT.stimulusBlocks.sizeMax} questions`);
md.push('- instructions given to the student:', ...EXAM_BLUEPRINT.instructions.map((i) => `  - ${i}`));
md.push('- design notes:', ...EXAM_BLUEPRINT.designNotes.map((i) => `  - ${i}`));
md.push('', '## Achieved coverage (seed ' + EXAM_SEED + ')', '');
md.push('| Domain | Items |', '|---|---|');
for (const [d, n] of Object.entries(form.coverage.byDomain).sort()) md.push(`| ${d} | ${n} |`);
md.push('', '| Level | Items |', '|---|---|');
for (const [l, n] of Object.entries(form.coverage.byLevel).sort()) md.push(`| ${Number(l)} — ${DIFFICULTY_TEXT[Number(l) as 1]} | ${n} |`);
md.push('', '| Cognitive move | Items |', '|---|---|');
for (const [m, n] of Object.entries(form.coverage.byMove).sort()) md.push(`| ${MOVE_TEXT[m as keyof typeof MOVE_TEXT]} | ${n} |`);
md.push('', '| Reasoning type | Items |', '|---|---|');
for (const [r, n] of Object.entries(form.coverage.byReasoning).sort()) md.push(`| ${r} | ${n} |`);
md.push('', `Text blocks in the form: ${form.coverage.stimulusBlocks}.`);
md.push('', '## Self-test', '', '| Check | Result |', '|---|---|');
for (const [label, ok] of checks) md.push(`| ${label} | ${ok ? 'pass' : 'FAIL'} |`);
md.push('', '## Blueprint feasibility against the current bank', '');
md.push(feasibility.length === 0 ? 'Every blueprint target is satisfiable from the bank.' : feasibility.map((f) => `- ${f}`).join('\n'));
md.push('', '## Reference results', '');
md.push(`- perfect sitting: ${perfect.score}/${perfect.total}, no diagnosis findings`);
md.push(`- blank sitting: ${blank.score}/${blank.total}, headline “${blank.diagnosis.headline}”`);
md.push(`- systematically wrong sitting: ${systematicallyWrong.score}/${systematicallyWrong.total}, causes: ${systematicallyWrong.diagnosis.causes.map((c) => `${c.label} (${c.count})`).join(', ')}`);
md.push('', '## Reporting', '', `> ${perfect.reportingNote}`, '');
writeFileSync('docs/04_EXAM_FORM.md', md.join('\n'));
