/**
 * Exam mode — the 90-minute simulation.
 *
 * This module is deliberately separate from `engine/diagnostics.ts`: an exam has no hints, no
 * instant feedback, no retry, no visible difficulty and no remediation inserted mid-sitting. The
 * separation is structural, not a matter of UI discipline:
 *
 *   - `studentView()` is the *only* object the exam UI renders, and it carries no key, no
 *     explanations, no difficulty and no error tags. `leakCheck()` walks that view on every build
 *     and fails the build if any of those fields ever reach it.
 *   - Answer keys live on the internal `ExamForm` and are used only by `submit()`.
 *   - The diagnosis after submission comes from the shared `engine/evidence.ts` core, so the exam
 *     and the training mode explain a failure the same way (cause, not score).
 *
 * Blueprint honesty: the domain weights follow the official material (the four demonstrated domains
 * dominate), but the item count, the level mix and the reasoning minimums are our documented design
 * decisions — the official material publishes no question count. `coverageOf()` reports every
 * target the bank could not meet instead of quietly missing it.
 */

import type {
  Bank,
  CognitiveMove,
  ConfidenceLabel,
  Difficulty,
  ErrorTag,
  ItemStyle,
  Question,
  ReasoningType,
} from './types';
import { DIFFICULTY_TEXT, MOVE_TEXT } from './types';
import { CONCEPT_BY_ID, DOMAINS, DOMAIN_BY_ID } from './curriculum';
import { makeRng } from './rng';
import type { Rng } from './rng';
import { conceptStats, diagnose, evidenceFromAttempt, errorProfile, sliceBy } from './evidence';
import type { AttemptEvidence, Diagnosis, ErrorProfileEntry, Slice } from './evidence';

/* ------------------------------------------------------------------ blueprint */

export interface ExamBlueprint {
  id: string;
  title: string;
  durationMinutes: number;
  questionCount: number;
  domainTargets: Record<string, number>;
  levelTargets: Partial<Record<Difficulty, number>>;
  moveMinimums: Partial<Record<CognitiveMove, number>>;
  reasoningMinimums: Partial<Record<ReasoningType, number>>;
  stimulusBlocks: { min: number; max: number; sizeMin: number; sizeMax: number };
  instructions: string[];
  designNotes: string[];
}

/**
 * 40 items in 90 minutes ≈ 2 min 15 s per item. The level and reasoning minimums are the shape of a
 * real sitting: mostly application (levels 2–5), a few exam-style items (6), and a small number of
 * advanced-transfer items (7) so that a strong student is still discriminated.
 */
export const EXAM_BLUEPRINT: ExamBlueprint = {
  id: 'GAM-SIM-90',
  title: 'General Academic Module — 90-minute simulation',
  durationMinutes: 90,
  questionCount: 40,
  domainTargets: { D02: 5, D06: 5, D09: 5, D11: 4, D01: 3, D03: 3, D04: 2, D05: 2, D07: 2, D08: 2, D10: 2, D12: 2, D13: 1, D14: 1, D15: 1 },
  levelTargets: { 2: 6, 3: 10, 4: 9, 5: 8, 6: 5, 7: 2 },
  moveMinimums: { execute_rule: 6, interpret_representation: 4, effect_of_change: 4, general_case: 3, explain_or_critique: 3, classify_situation: 3 },
  reasoningMinimums: {
    rule_application: 5,
    multi_step_application: 5,
    conceptual_discrimination: 4,
    representation_transfer: 3,
    parameter_reasoning: 3,
    logical_deduction: 2,
    evidence_evaluation: 3,
    causal_reasoning: 2,
    optimisation_reasoning: 2,
  },
  stimulusBlocks: { min: 1, max: 3, sizeMin: 3, sizeMax: 5 },
  instructions: [
    'One sitting, 90 minutes, 40 single-choice items. Four options, exactly one correct.',
    'No notes, no formula sheet, no spreadsheet — mental arithmetic only.',
    'You may navigate freely, flag items and change answers until the time expires.',
    'There is no negative marking; unanswered items simply do not score.',
    'The timer keeps running if you leave an item open. At 00:00 the sitting is submitted automatically.',
  ],
  designNotes: [
    'Domain weighting follows the official material: the four demonstrated domains (vectors, hydrostatics, order-quantity/optimisation, research methodology) carry about half the form.',
    'The remaining domains are the [PREREQUISITE] and [PREPARATION EXTENSION] areas of the curriculum map; they are practiced here but are not presented as an official syllabus.',
    'The item count and difficulty mix are our design decision for a 90-minute simulation; the official material does not publish a question count.',
    'Two-part items (input text or figure, then several questions) mirror the official item anatomy and appear as text blocks in the second half of the form.',
  ],
};

/** Reference time per item, by difficulty: the pacing benchmark of the report. */
function targetMsFor(d: Difficulty): number {
  const table: Record<Difficulty, number> = { 1: 60_000, 2: 90_000, 3: 120_000, 4: 150_000, 5: 170_000, 6: 200_000, 7: 220_000 };
  return table[d];
}

/* ------------------------------------------------------------------ form */

export interface ExamItem {
  position: number;
  questionId: string;
  domainId: string;
  conceptIds: string[];
  difficulty: Difficulty;
  reasoningType: ReasoningType;
  cognitiveMove: CognitiveMove;
  style: ItemStyle;
  stem: string;
  figure?: Question['figure'];
  optionTexts: string[];
  stimulusId?: string;
  /** Internal: used by `submit()` only, never by the student view. */
  correctIndex: number;
  /** Reference time for pacing analysis. */
  targetMs: number;
}

export interface ExamCoverage {
  byDomain: Record<string, number>;
  byLevel: Record<string, number>;
  byMove: Record<string, number>;
  byReasoning: Record<string, number>;
  stimulusBlocks: number;
  unmet: string[];
}

export interface ExamForm {
  id: string;
  seed: number;
  blueprint: ExamBlueprint;
  createdAt: string;
  items: ExamItem[];
  coverage: ExamCoverage;
}

function toExamItem(q: Question, position: number): ExamItem {
  return {
    position,
    questionId: q.id,
    domainId: q.domainId,
    conceptIds: q.conceptIds,
    difficulty: q.difficulty,
    reasoningType: q.reasoningType,
    cognitiveMove: q.cognitiveMove,
    style: q.style,
    stem: q.stem,
    figure: q.figure,
    optionTexts: q.options.map((o) => o.text),
    stimulusId: q.stimulusId,
    correctIndex: q.correctIndex,
    targetMs: targetMsFor(q.difficulty),
  };
}

interface Deficit {
  level: Map<number, number>;
  move: Map<string, number>;
  reasoning: Map<string, number>;
}

/** Value of a candidate item: how much of the still-missing blueprint shape it closes. */
function candidateValue(q: Question, d: Deficit, usedConcepts: Set<string>, usedStyles: Set<ItemStyle>, rng: Rng): number {
  const levelNeed = Math.max(0, d.level.get(q.difficulty) ?? 0);
  const moveNeed = Math.max(0, d.move.get(q.cognitiveMove) ?? 0);
  const reasonNeed = Math.max(0, d.reasoning.get(q.reasoningType) ?? 0);
  const conceptNovelty = q.conceptIds.every((c) => !usedConcepts.has(c)) ? 1 : q.conceptIds.some((c) => !usedConcepts.has(c)) ? 0.4 : 0;
  const styleNovelty = usedStyles.has(q.style) ? 0 : 1;
  return 3 * levelNeed + 2.2 * moveNeed + 1.6 * reasonNeed + 1.4 * conceptNovelty + 0.8 * styleNovelty + rng.next() * 0.9;
}

function consume(q: Question, d: Deficit): void {
  const dec = (m: Map<string | number, number>, k: string | number) => m.set(k, Math.max(0, (m.get(k) ?? 0) - 1));
  dec(d.level, q.difficulty);
  dec(d.move, q.cognitiveMove);
  dec(d.reasoning, q.reasoningType);
}

export function buildExamForm(bank: Bank, seed: number, blueprint: ExamBlueprint = EXAM_BLUEPRINT, builtAt = new Date().toISOString()): ExamForm {
  const rng = makeRng(seed);
  const items: ExamItem[] = [];
  const chosen = new Set<string>();
  const usedConcepts = new Set<string>();
  const usedStyles = new Set<ItemStyle>();
  const stimulusCount = new Map<string, number>();
  const deficit: Deficit = {
    level: new Map(Object.entries(blueprint.levelTargets).map(([k, v]) => [Number(k), v as number])),
    move: new Map(Object.entries(blueprint.moveMinimums).map(([k, v]) => [k, v as number])),
    reasoning: new Map(Object.entries(blueprint.reasoningMinimums).map(([k, v]) => [k, v as number])),
  };
  const pool = bank.questions.filter((q) => q.options.length === 4 && q.correctIndex >= 0 && q.correctIndex < 4);
  const unmet: string[] = [];

  const commit = (q: Question) => {
    chosen.add(q.id);
    for (const c of q.conceptIds) usedConcepts.add(c);
    usedStyles.add(q.style);
    consume(q, deficit);
    if (q.stimulusId) stimulusCount.set(q.stimulusId, (stimulusCount.get(q.stimulusId) ?? 0) + 1);
    items.push(toExamItem(q, items.length));
  };

  const domainOrder = Object.keys(blueprint.domainTargets).sort(
    (a, b) => (blueprint.domainTargets[b] ?? 0) - (blueprint.domainTargets[a] ?? 0) || (DOMAIN_BY_ID[a]?.title ?? a).localeCompare(DOMAIN_BY_ID[b]?.title ?? b),
  );

  const pickFor = (domainId: string): Question | null => {
    const candidates = pool.filter((q) => q.domainId === domainId && !chosen.has(q.id));
    if (!candidates.length) return null;
    let best: Question | null = null;
    let bestValue = -Infinity;
    for (const q of candidates) {
      const v = candidateValue(q, deficit, usedConcepts, usedStyles, rng);
      if (v > bestValue) {
        bestValue = v;
        best = q;
      }
    }
    return best;
  };

  // 1. Domain quotas, biggest first: the official domains are guaranteed their share.
  for (const domainId of domainOrder) {
    const want = blueprint.domainTargets[domainId] ?? 0;
    let got = 0;
    for (let i = 0; i < want; i++) {
      const q = pickFor(domainId);
      if (!q) {
        unmet.push(`${domainId}: ${want - got} item(s) unavailable in the bank`);
        break;
      }
      commit(q);
      got += 1;
      if (items.length >= blueprint.questionCount) break;
    }
    if (items.length >= blueprint.questionCount) break;
  }

  // 2. Top up to the full length by blueprint deficit.
  while (items.length < blueprint.questionCount) {
    const candidates = pool.filter((q) => !chosen.has(q.id));
    if (!candidates.length) {
      unmet.push(`form size ${blueprint.questionCount} not reachable: bank exhausted at ${items.length}`);
      break;
    }
    let best: Question | null = null;
    let bestValue = -Infinity;
    for (const q of candidates) {
      const v = candidateValue(q, deficit, usedConcepts, usedStyles, rng);
      if (v > bestValue) {
        bestValue = v;
        best = q;
      }
    }
    if (!best) break;
    commit(best);
  }

  // 3. Text blocks: keep only blocks of a usable size, then arrange them as two-part items.
  repairStimulusBlocks(items, pool, chosen, stimulusCount, blueprint, unmet);
  arrange(items, blueprint, rng);

  while (items.length < blueprint.questionCount) {
    const next = pool.find((q) => !chosen.has(q.id));
    if (!next) {
      unmet.push(`form size ${blueprint.questionCount} not reachable: bank exhausted at ${items.length}`);
      break;
    }
    chosen.add(next.id);
    items.push(toExamItem(next, items.length));
  }
  items.forEach((it, i) => (it.position = i));

  const coverage = coverageOf(items, blueprint);
  coverage.unmet = unmet;
  return { id: `EXAM-${seed}`, seed, blueprint, createdAt: builtAt, items, coverage };
}

/**
 * A stimulus block with only one question is dropped (it is not the official two-part anatomy); a
 * block with too few is filled from its siblings, and an oversized one is trimmed. Anything that
 * cannot be fixed is reported in `unmet`.
 */
function repairStimulusBlocks(
  items: ExamItem[],
  pool: Question[],
  chosen: Set<string>,
  stimulusCount: Map<string, number>,
  blueprint: ExamBlueprint,
  unmet: string[],
): void {
  const counts = new Map<string, number>();
  for (const it of items) if (it.stimulusId) counts.set(it.stimulusId, (counts.get(it.stimulusId) ?? 0) + 1);

  for (let i = items.length - 1; i >= 0; i--) {
    const sid = items[i].stimulusId;
    if (sid && (counts.get(sid) ?? 0) < 2) {
      chosen.delete(items[i].questionId);
      items.splice(i, 1);
      counts.set(sid, (counts.get(sid) ?? 0) - 1);
    }
  }

  const blocks = [...counts.entries()].filter(([, n]) => n >= 2);
  for (const [sid, n] of blocks) {
    for (let fill = n; fill < blueprint.stimulusBlocks.sizeMin; fill++) {
      const sibling = pool.find((q) => q.stimulusId === sid && !chosen.has(q.id));
      if (!sibling) break;
      chosen.add(sibling.id);
      items.push(toExamItem(sibling, items.length));
      counts.set(sid, fill + 1);
    }
  }

  for (const [sid, n] of [...counts.entries()]) {
    if (n <= blueprint.stimulusBlocks.sizeMax) continue;
    let toDrop = n - blueprint.stimulusBlocks.sizeMax;
    for (let i = items.length - 1; i >= 0 && toDrop > 0; i--) {
      if (items[i].stimulusId === sid) {
        chosen.delete(items[i].questionId);
        items.splice(i, 1);
        toDrop -= 1;
      }
    }
    counts.set(sid, blueprint.stimulusBlocks.sizeMax);
  }

  const usable = [...counts.values()].filter((n) => n >= blueprint.stimulusBlocks.sizeMin).length;
  if (usable < blueprint.stimulusBlocks.min) {
    unmet.push(`text blocks: ${usable} usable block(s) available, blueprint asks for ${blueprint.stimulusBlocks.min} — the bank needs more authored questions inside a stimulus block`);
  }

  while (items.length < blueprint.questionCount) {
    const next = pool.find((q) => !chosen.has(q.id));
    if (!next) break;
    chosen.add(next.id);
    items.push(toExamItem(next, items.length));
  }
}

function coverageOf(items: ExamItem[], blueprint: ExamBlueprint): ExamCoverage {
  const tally = (xs: (string | number)[]): Record<string, number> =>
    xs.reduce<Record<string, number>>((acc, k) => ({ ...acc, [String(k)]: (acc[String(k)] ?? 0) + 1 }), {});
  const blocks = new Set(items.filter((i) => i.stimulusId).map((i) => i.stimulusId as string));
  const unmet: string[] = [];
  for (const [level, target] of Object.entries(blueprint.levelTargets)) {
    const have = items.filter((i) => String(i.difficulty) === level).length;
    if (have < (target as number)) unmet.push(`level ${level} ${DIFFICULTY_TEXT[Number(level) as Difficulty].split(' — ')[0]}: ${have}/${target}`);
  }
  for (const [move, target] of Object.entries(blueprint.moveMinimums)) {
    const have = items.filter((i) => i.cognitiveMove === move).length;
    if (have < (target as number)) unmet.push(`cognitive move "${MOVE_TEXT[move as CognitiveMove]}": ${have}/${target}`);
  }
  for (const [reason, target] of Object.entries(blueprint.reasoningMinimums)) {
    const have = items.filter((i) => i.reasoningType === reason).length;
    if (have < (target as number)) unmet.push(`reasoning type "${reason}": ${have}/${target}`);
  }
  return {
    byDomain: tally(items.map((i) => i.domainId)),
    byLevel: tally(items.map((i) => i.difficulty)),
    byMove: tally(items.map((i) => i.cognitiveMove)),
    byReasoning: tally(items.map((i) => i.reasoningType)),
    stimulusBlocks: blocks.size,
    unmet,
  };
}

/**
 * Arrange the form: interleave domains so that no two consecutive items come from the same topic,
 * keep each text block together, and place blocks from the second quarter onwards (as in the
 * official material, where the two-part items follow straight single items).
 */
function arrange(items: ExamItem[], blueprint: ExamBlueprint, rng: Rng): void {
  const blocks = new Map<string, ExamItem[]>();
  const singles: ExamItem[] = [];
  for (const it of items) {
    if (it.stimulusId) {
      const b = blocks.get(it.stimulusId);
      if (b) b.push(it);
      else blocks.set(it.stimulusId, [it]);
    } else singles.push(it);
  }

  const grouped = [...blocks.entries()].filter(([, b]) => b.length >= 2).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  const blockList = grouped.slice(0, blueprint.stimulusBlocks.max).map(([id, b]) => ({ id, items: b.sort((a, c) => a.position - c.position) }));
  const placedIds = new Set(blockList.flatMap((b) => b.items.map((i) => i.questionId)));
  for (const [, b] of grouped.slice(blueprint.stimulusBlocks.max)) {
    for (const it of b) if (!placedIds.has(it.questionId)) singles.push(it);
  }

  const byDomain = new Map<string, ExamItem[]>();
  for (const it of singles) {
    const g = byDomain.get(it.domainId);
    if (g) g.push(it);
    else byDomain.set(it.domainId, [it]);
  }
  for (const g of byDomain.values()) g.sort((a, b) => a.difficulty - b.difficulty || (rng.chance(0.5) ? -1 : 1));

  const order = [...byDomain.keys()].sort((a, b) =>
    byDomain.get(a)!.length === byDomain.get(b)!.length ? a.localeCompare(b) : byDomain.get(b)!.length - byDomain.get(a)!.length,
  );

  const interleaved: ExamItem[] = [];
  let remaining = singles.length;
  let guard = 0;
  while (remaining > 0) {
    for (const d of order) {
      const q = byDomain.get(d)!.shift();
      if (q) {
        interleaved.push(q);
        remaining -= 1;
      }
    }
    guard += 1;
    if (guard > 500) break;
  }

  const out: ExamItem[] = [];
  const placeAt = new Set<number>();
  const firstAt = Math.max(4, Math.floor(interleaved.length / 4));
  let nextAt = firstAt;
  for (const _b of blockList) {
    if (nextAt < interleaved.length) placeAt.add(nextAt);
    nextAt += 10;
  }
  let bIndex = 0;
  for (let i = 0; i < interleaved.length; i++) {
    if (placeAt.has(i) && bIndex < blockList.length) {
      out.push(...blockList[bIndex].items);
      bIndex += 1;
    }
    out.push(interleaved[i]);
  }
  while (bIndex < blockList.length) {
    out.push(...blockList[bIndex].items);
    bIndex += 1;
  }
  const emitted = new Set(out.map((i) => i.questionId));
  for (const it of items) if (!emitted.has(it.questionId)) out.push(it);
  // Items whose block was dropped must no longer claim a stimulus.
  for (const it of out) if (it.stimulusId && !placedIds.has(it.questionId)) delete it.stimulusId;
  items.splice(0, items.length, ...out);
}

/* ------------------------------------------------------------------ student view (no leaks) */

export interface ExamStudentItem {
  index: number;
  itemId: string;
  stem: string;
  figure?: Question['figure'];
  options: string[];
  stimulusId?: string;
}

export interface ExamStudentStimulus {
  id: string;
  title: string;
  label: ConfidenceLabel;
  body: string;
  figure?: Question['figure'];
  itemIds: string[];
  officialExercise?: string;
}

export interface ExamStudentView {
  id: string;
  blueprintId: string;
  title: string;
  durationMinutes: number;
  itemCount: number;
  instructions: string[];
  items: ExamStudentItem[];
  stimuli: ExamStudentStimulus[];
}

export function studentView(form: ExamForm, bank: Bank): ExamStudentView {
  const stimuliById = new Map(bank.stimuli.map((s) => [s.id, s]));
  const usedStimuli = new Set(form.items.map((i) => i.stimulusId).filter((x): x is string => !!x));
  const itemId = (i: ExamItem) => `i${i.position + 1}`;
  return {
    id: form.id,
    blueprintId: form.blueprint.id,
    title: form.blueprint.title,
    durationMinutes: form.blueprint.durationMinutes,
    itemCount: form.items.length,
    instructions: form.blueprint.instructions,
    items: form.items.map((i) => ({
      index: i.position,
      itemId: itemId(i),
      stem: i.stem,
      figure: i.figure,
      options: i.optionTexts,
      stimulusId: i.stimulusId,
    })),
    stimuli: [...usedStimuli]
      .map((sid) => stimuliById.get(sid))
      .filter((s): s is NonNullable<typeof s> => !!s)
      .map((s) => ({
        id: s.id,
        title: s.title,
        label: s.label,
        body: s.body,
        figure: s.figure,
        itemIds: form.items.filter((i) => i.stimulusId === s.id).map(itemId),
        officialExercise: s.officialExercise,
      })),
  };
}

/** Fields that must never appear in anything the student can see during a sitting. */
const LEAK_FIELDS = ['correctIndex', 'explanation', 'hints', 'errorTag', 'rationale', 'difficulty', 'reasoningType', 'cognitiveMove', 'verification', 'answerKey'];

/**
 * Walk a rendered object and return the paths of any leaked answer-bearing field. Called on every
 * build; a non-empty result fails the build (see `scripts/build-bank.ts`).
 */
export function leakCheck(node: unknown, path = 'view', depth = 0): string[] {
  const leaks: string[] = [];
  const walk = (n: unknown, p: string, d: number) => {
    if (d > 24 || n === null || n === undefined) return;
    if (Array.isArray(n)) {
      n.forEach((v, i) => walk(v, `${p}[${i}]`, d + 1));
      return;
    }
    if (typeof n === 'object') {
      for (const [k, v] of Object.entries(n as Record<string, unknown>)) {
        if (LEAK_FIELDS.includes(k)) leaks.push(`${p}.${k}`);
        walk(v, `${p}.${k}`, d + 1);
      }
    }
  };
  walk(node, path, depth);
  return leaks;
}

export function examFormPreview(bank: Bank, seed: number): Question[] {
  const form = buildExamForm(bank, seed);
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  return form.items.map((i) => byId.get(i.questionId)).filter((q): q is Question => !!q);
}

/* ------------------------------------------------------------------ sitting */

export interface ExamSession {
  formId: string;
  startedAtMs: number;
  answers: (number | null)[];
  flagged: boolean[];
  /** Time spent per item, accumulated on navigation (the clock never stops). */
  spentMs: number[];
  openIndex: number;
  openSinceMs: number;
  submittedAtMs: number | null;
}

export function startSession(form: ExamForm, nowMs: number): ExamSession {
  return {
    formId: form.id,
    startedAtMs: nowMs,
    answers: form.items.map(() => null),
    flagged: form.items.map(() => false),
    spentMs: form.items.map(() => 0),
    openIndex: 0,
    openSinceMs: nowMs,
    submittedAtMs: null,
  };
}

export function timeAllowedMs(form: ExamForm): number {
  return form.blueprint.durationMinutes * 60_000;
}

export function remainingMs(session: ExamSession, form: ExamForm, nowMs: number): number {
  const end = session.startedAtMs + timeAllowedMs(form);
  const at = session.submittedAtMs ?? nowMs;
  return Math.max(0, end - at);
}

export function isExpired(session: ExamSession, form: ExamForm, nowMs: number): boolean {
  return remainingMs(session, form, nowMs) <= 0;
}

/** Navigate; the time spent on the previously open item is booked first. */
export function openItem(session: ExamSession, index: number, nowMs: number): ExamSession {
  if (index < 0 || index >= session.answers.length) return session;
  const spent = [...session.spentMs];
  if (session.submittedAtMs === null && nowMs > session.openSinceMs) {
    spent[session.openIndex] += nowMs - session.openSinceMs;
  }
  return { ...session, spentMs: spent, openIndex: index, openSinceMs: nowMs };
}

export function selectOption(session: ExamSession, index: number, optionIndex: number): ExamSession {
  if (session.submittedAtMs !== null || index < 0 || index >= session.answers.length) return session;
  const answers = [...session.answers];
  answers[index] = optionIndex;
  return { ...session, answers };
}

export function toggleFlag(session: ExamSession, index: number): ExamSession {
  if (session.submittedAtMs !== null || index < 0 || index >= session.answers.length) return session;
  const flagged = [...session.flagged];
  flagged[index] = !flagged[index];
  return { ...session, flagged };
}

export function answeredCount(session: ExamSession): number {
  return session.answers.filter((a) => a !== null).length;
}

export function flaggedIndices(session: ExamSession): number[] {
  return session.flagged.map((f, i) => (f ? i : -1)).filter((i) => i >= 0);
}

/* ------------------------------------------------------------------ marking & diagnosis */

export interface ExamWeakArea {
  domainId: string;
  title: string;
  correct: number;
  attempted: number;
  accuracy: number;
}

export interface ExamReviewRow {
  index: number;
  questionId: string;
  chosen: number | null;
  correctIndex: number;
  correct: boolean;
  errorTag: ErrorTag | null;
  /** Error mechanism, or "unanswered" when nothing was chosen. */
  cause: ErrorTag | 'unanswered' | null;
  domainId: string;
  conceptTitles: string[];
  difficulty: Difficulty;
  reasoningType: ReasoningType;
  spentMs: number;
  /** Post-exam review only — never present during the sitting. */
  explanation: Question['explanation'] | null;
}

export interface ExamResult {
  formId: string;
  title: string;
  score: number;
  total: number;
  correct: number;
  wrong: number;
  unanswered: number;
  /** Correct ÷ answered. */
  accuracy: number;
  /** Correct ÷ total. */
  overallAccuracy: number;
  timeUsedMs: number;
  timeAllowedMs: number;
  averageMsPerItem: number;
  pacing: { medianMs: number; overTarget: number; under30s: number; finishedEarlyMs: number };
  byDomain: Slice[];
  byLevel: Slice[];
  byReasoning: Slice[];
  byMove: Slice[];
  byStyle: Slice[];
  errorProfile: ErrorProfileEntry[];
  weakAreas: ExamWeakArea[];
  weakConcepts: ReturnType<typeof conceptStats>;
  diagnosis: Diagnosis;
  review: ExamReviewRow[];
  unansweredPolicy: 'incorrect';
  reportingNote: string;
}

const REPORTING_NOTE =
  'Score reporting for the dMAT is published inconsistently (raw score, scaled 0–200 per module, or percentile). This simulation therefore reports raw marks (correct / total) and a diagnostic breakdown, and deliberately does not invent a scaled score.';

/**
 * Mark a sitting. `nowMs` is clamped to the allowed time so that leaving the tab open overnight
 * cannot produce a 12-hour "time used" figure, and the current item's open interval is booked.
 */
export function submit(session: ExamSession, form: ExamForm, bank: Bank, nowMs: number): { session: ExamSession; result: ExamResult } {
  const submittedAtMs = Math.min(nowMs, session.startedAtMs + timeAllowedMs(form));
  const spent = [...session.spentMs];
  if (nowMs > session.openSinceMs) spent[session.openIndex] += nowMs - session.openSinceMs;
  const closed: ExamSession = { ...session, spentMs: spent, submittedAtMs };

  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const evidence: AttemptEvidence[] = form.items.map((item, i) => {
    const q = byId.get(item.questionId);
    if (q) return evidenceFromAttempt(q, closed.answers[i], closed.spentMs[i], 'exam');
    // The bank changed under a stored form: fall back to the item's own data rather than dropping it.
    const correct = closed.answers[i] === item.correctIndex;
    return {
      questionId: item.questionId,
      domainId: item.domainId,
      conceptIds: item.conceptIds,
      difficulty: item.difficulty,
      reasoningType: item.reasoningType,
      cognitiveMove: item.cognitiveMove,
      style: item.style,
      correct,
      answerIndex: closed.answers[i],
      errorTag: null,
      spentMs: closed.spentMs[i],
      mode: 'exam' as const,
    };
  });

  const correct = evidence.filter((e) => e.correct).length;
  const unanswered = evidence.filter((e) => e.answerIndex === null).length;
  const answered = evidence.length - unanswered;
  const timeUsedMs = Math.min(nowMs, submittedAtMs) - session.startedAtMs;
  const times = evidence.map((e) => e.spentMs).filter((t) => t > 0).sort((a, b) => a - b);
  const medianMs = times.length ? times[Math.floor(times.length / 2)] : 0;
  const domainTitle = (id: string) => DOMAIN_BY_ID[id]?.title ?? id;

  const diagnosis = diagnose(evidence);
  const byDomain = sliceBy(evidence, (e) => e.domainId, domainTitle);
  const weakAreas: ExamWeakArea[] = byDomain
    .filter((s) => s.attempted >= 1 && s.accuracy < 0.6)
    .map((s) => ({ domainId: s.key, title: s.label, correct: s.correct, attempted: s.attempted, accuracy: s.accuracy }));

  const review: ExamReviewRow[] = form.items.map((item, i) => {
    const e = evidence[i];
    const q = byId.get(item.questionId);
    return {
      index: i,
      questionId: item.questionId,
      chosen: closed.answers[i],
      correctIndex: item.correctIndex,
      correct: e.correct,
      errorTag: e.errorTag,
      cause: e.errorTag ?? (e.answerIndex === null ? 'unanswered' : null),
      domainId: item.domainId,
      conceptTitles: item.conceptIds.map((c) => CONCEPT_BY_ID[c]?.title ?? c),
      difficulty: item.difficulty,
      reasoningType: item.reasoningType,
      spentMs: closed.spentMs[i],
      explanation: q?.explanation ?? null,
    };
  });

  const result: ExamResult = {
    formId: form.id,
    title: form.blueprint.title,
    score: correct,
    total: evidence.length,
    correct,
    wrong: answered - correct,
    unanswered,
    accuracy: answered ? correct / answered : 0,
    overallAccuracy: evidence.length ? correct / evidence.length : 0,
    timeUsedMs,
    timeAllowedMs: timeAllowedMs(form),
    averageMsPerItem: evidence.length ? timeUsedMs / evidence.length : 0,
    pacing: {
      medianMs,
      overTarget: form.items.filter((it, i) => closed.spentMs[i] > it.targetMs).length,
      under30s: closed.spentMs.filter((t) => t > 0 && t < 30_000).length,
      finishedEarlyMs: Math.max(0, session.startedAtMs + timeAllowedMs(form) - submittedAtMs),
    },
    byDomain,
    byLevel: sliceBy(evidence, (e) => String(e.difficulty), (k) => DIFFICULTY_TEXT[Number(k) as Difficulty]),
    byReasoning: sliceBy(evidence, (e) => e.reasoningType),
    byMove: sliceBy(evidence, (e) => e.cognitiveMove, (k) => MOVE_TEXT[k as CognitiveMove]),
    byStyle: sliceBy(evidence, (e) => e.style),
    errorProfile: errorProfile(evidence),
    weakAreas,
    weakConcepts: conceptStats(evidence).filter((s) => s.accuracy < 0.6),
    diagnosis,
    review,
    unansweredPolicy: 'incorrect',
    reportingNote: REPORTING_NOTE,
  };
  return { session: closed, result };
}

/* ------------------------------------------------------------------ report */

const pct = (x: number) => `${Math.round(x * 100)} %`;
const mmss = (ms: number) => `${Math.floor(ms / 60_000)}:${String(Math.round((ms % 60_000) / 1000)).padStart(2, '0')}`;

export function formatExamResultMarkdown(result: ExamResult, form?: ExamForm): string {
  const lines: string[] = [];
  lines.push('# Exam result — ' + result.title, '');
  lines.push(
    `**${result.score} / ${result.total}** correct · accuracy ${pct(result.accuracy)} of answered · ${result.unanswered} unanswered (counted as incorrect) · time used ${mmss(result.timeUsedMs)} of ${mmss(result.timeAllowedMs)}`,
    '',
  );
  lines.push('## Diagnosis', '', `**${result.diagnosis.headline}**`, '');
  if (result.diagnosis.causes.length) {
    lines.push('| Cause of lost marks | Items | Share |', '|---|---|---|');
    for (const c of result.diagnosis.causes) lines.push(`| ${c.label} | ${c.count} | ${pct(c.share)} |`);
    lines.push('');
  }
  for (const f of result.diagnosis.findings) {
    lines.push(`### ${f.title}`, '', f.explanation, '');
    for (const e of f.evidence) lines.push(`- ${e}`);
    lines.push('', `_First step: ${f.firstStep}_`, '');
  }
  lines.push('## Breakdown by domain', '', '| Domain | Correct | Items | Accuracy |', '|---|---|---|---|');
  for (const s of result.byDomain) lines.push(`| ${s.label} | ${s.correct} | ${s.attempted} | ${pct(s.accuracy)} |`);
  lines.push('', '## Breakdown by reasoning type', '', '| Reasoning type | Correct | Items | Accuracy |', '|---|---|---|---|');
  for (const s of result.byReasoning) lines.push(`| ${s.label} | ${s.correct} | ${s.attempted} | ${pct(s.accuracy)} |`);
  lines.push('', '## Breakdown by difficulty', '', '| Level | Correct | Items | Accuracy |', '|---|---|---|---|');
  for (const s of result.byLevel) lines.push(`| ${s.label} | ${s.correct} | ${s.attempted} | ${pct(s.accuracy)} |`);
  lines.push('', '## Pacing', '');
  lines.push(`- median time per item: ${mmss(result.pacing.medianMs)}`);
  lines.push(`- items above their reference time: ${result.pacing.overTarget}`);
  lines.push(`- items answered in under 30 s: ${result.pacing.under30s}`);
  lines.push(`- time left on the clock at submission: ${mmss(result.pacing.finishedEarlyMs)}`);
  if (result.weakAreas.length) {
    lines.push('', '## Weak areas to work on next', '');
    for (const w of result.weakAreas) lines.push(`- ${w.title}: ${w.correct}/${w.attempted}`);
  }
  if (result.diagnosis.studyPlan.length) {
    lines.push('', '## Study plan', '', '| Lesson | Concepts | Why | Minutes |', '|---|---|---|---|');
    for (const s of result.diagnosis.studyPlan) lines.push(`| ${s.lessonId} | ${s.conceptIds.join(', ')} | ${s.why} | ${s.estimatedMinutes} |`);
  }
  lines.push('', '## Review (post-exam only)', '');
  for (const r of result.review) {
    const mark = r.correct ? 'correct' : r.chosen === null ? 'unanswered' : 'wrong';
    lines.push(
      `- Q${r.index + 1} (${r.domainId}, level ${r.difficulty}) — ${mark}` +
        (r.chosen === null ? '' : `, chose option ${r.chosen + 1}`) +
        `. Answer: option ${r.correctIndex + 1}.${r.cause && r.cause !== 'unanswered' ? ` Mechanism: ${r.cause}.` : ''}`,
    );
  }
  lines.push('', `> ${result.reportingNote}`, '');
  if (form) {
    lines.push('## Form coverage', '');
    lines.push(`- domains: ${Object.entries(form.coverage.byDomain).map(([d, n]) => `${d}:${n}`).join(', ')}`);
    lines.push(`- levels: ${Object.entries(form.coverage.byLevel).sort().map(([l, n]) => `L${l}:${n}`).join(', ')}`);
    lines.push(`- text blocks: ${form.coverage.stimulusBlocks}`);
    if (form.coverage.unmet.length) {
      lines.push('- blueprint targets not met:', ...form.coverage.unmet.map((u) => `  - ${u}`));
    } else {
      lines.push('- every blueprint target was met.');
    }
    lines.push('');
  }
  return lines.join('\n');
}

/**
 * What the bank cannot currently supply. Shown by the build (and by the UI's teacher view) so that
 * a thin domain is visible instead of silently under-represented in every sitting.
 */
export function blueprintFeasibility(bank: Bank, blueprint: ExamBlueprint = EXAM_BLUEPRINT): string[] {
  const issues: string[] = [];
  for (const [domainId, want] of Object.entries(blueprint.domainTargets)) {
    const have = bank.questions.filter((q) => q.domainId === domainId).length;
    if (have < want) issues.push(`${domainId}: bank has ${have} items, blueprint wants ${want}`);
  }
  const total = bank.questions.length;
  if (total < blueprint.questionCount) issues.push(`bank has ${total} items, blueprint wants ${blueprint.questionCount}`);
  for (const [level, want] of Object.entries(blueprint.levelTargets)) {
    const have = bank.questions.filter((q) => String(q.difficulty) === level).length;
    if (have < (want as number)) issues.push(`level ${level}: bank has ${have} items, blueprint wants ${want}`);
  }
  const blocks = bank.stimuli.filter((s) => (s.questionIds?.length ?? 0) >= blueprint.stimulusBlocks.sizeMin).length;
  if (blocks < blueprint.stimulusBlocks.min) issues.push(`usable text blocks in bank: ${blocks}, blueprint wants ${blueprint.stimulusBlocks.min}`);
  return issues;
}

/** Domains whose reasoning is directly demonstrated by an official sample exercise. */
export const OFFICIAL_DOMAIN_IDS: string[] = DOMAINS.filter((d) => d.labels.includes('OFFICIAL_SAMPLE')).map((d) => d.id);
