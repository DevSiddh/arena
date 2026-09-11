/**
 * Mastery model, adaptive practice selection, training sessions and the learning path.
 *
 * This module is the training half of the system; `engine/exam.ts` is the examination half and
 * `engine/evidence.ts` holds the shared diagnosis core (both modules consume it, neither
 * re-implements it).
 *
 * Design decisions that matter:
 *  - Mastery is a *shrunken* estimate, not a raw percentage: a concept with one lucky correct
 *    answer must not read as mastered. See PRIOR_STRENGTH below.
 *  - One item can never master a concept (MASTERED_AT requires a minimum number of attempts).
 *  - Mastery decays into "needs review" when the most recent attempts were wrong: mastery is a
 *    current state, not a trophy.
 *  - Prerequisites are checked on the concept graph, so a weak prerequisite is visible *before*
 *    the student wastes time on the dependent topic.
 *  - Everything is deterministic given (bank, request, seed): the same practice request always
 *    yields the same set, which is what makes this testable.
 */

import type { Bank, Difficulty, Lesson, Question } from './types';
import { CONCEPT_BY_ID, CONCEPTS, LESSONS_BY_DOMAIN_ORDER, prerequisitesOf } from './curriculum';
import { makeRng } from './rng';
import { diagnose, evidenceFromAttempt, errorProfile, overallAccuracy } from './evidence';
import type { AttemptEvidence, Diagnosis, ErrorProfileEntry } from './evidence';

/* ------------------------------------------------------------------ constants */

/** Prior weight, in "attempts", pulling an unseen concept towards 0.5. */
const PRIOR_STRENGTH = 2;
/** Mastery estimate at which a concept counts as mastered. */
const MASTERED_AT = 0.8;
/** Confidence (attempts / attempts + 4) below which mastered concepts stay in the review queue. */
const MASTERED_CONFIDENCE = 0.7;
/** Mastery at which a prerequisite counts as good enough to unlock the next lesson. */
const PREREQ_OK_AT = 0.7;
/**
 * Minimum attempts before "mastered" can be claimed at all.
 *
 * Calibration note (kept here so the numbers are not mysterious): with PRIOR_STRENGTH = 2 and
 * MASTERED_AT = 0.8, three correct answers at levels 3–4 (weights 0.9–1.05) give a weighted sum of
 * ≈ 3.0, hence mastery (3.0 + 1.0) / 5.0 = 0.80 — exactly the threshold. Two correct answers are
 * never enough at any difficulty, and one hint halves the weight of its item, so assisted work does
 * not masquerade as mastery.
 */
const MIN_ATTEMPTS_FOR_MASTERY = 3;

/** Harder items carry more information about mastery than easy ones. */
function difficultyWeight(d: Difficulty): number {
  return 0.6 + 0.15 * (d - 1);
}

/* ------------------------------------------------------------------ mastery model */

/** Alias kept for the UI layer, which imports the model as `ConceptMastery`. */
export type ConceptMastery = MasteryState;

export type MasteryStateName = 'unseen' | 'learning' | 'practising' | 'mastered' | 'needs_review';

export interface MasteryState {
  conceptId: string;
  title: string;
  domainId: string;
  lessonId: string;
  /** Direct prerequisites from the curriculum graph. */
  prereq: string[];
  attempts: number;
  correct: number;
  /** Shrunken mastery estimate in [0, 1]. */
  mastery: number;
  /** n / (n + 4) — how much evidence stands behind `mastery`. */
  confidence: number;
  /** Consecutive correct answers at the end of the history. */
  streak: number;
  /** Attempts answered with a hint or after a retry (weighted at half). */
  assistedAttempts: number;
  lastSeenAt: number | null;
  state: MasteryStateName;
  prerequisitesOk: boolean;
  weakPrerequisites: string[];
  averageDifficulty: number;
}

export function masteryModel(history: AttemptEvidence[], nowMs = 0): Record<string, MasteryState> {
  const byConcept = new Map<string, AttemptEvidence[]>();
  for (const e of history) {
    for (const cid of e.conceptIds) {
      const list = byConcept.get(cid);
      if (list) list.push(e);
      else byConcept.set(cid, [e]);
    }
  }

  const build = (conceptId: string): MasteryState => {
    const def = CONCEPT_BY_ID[conceptId];
    const items = (byConcept.get(conceptId) ?? []).slice().sort((a, b) => a.spentMs - b.spentMs);
    let weighted = 0;
    let weightSum = 0;
    let assisted = 0;
    for (const e of items) {
      const assist = (e.usedHints ?? 0) > 0 || e.retried ? 0.5 : 1;
      const w = difficultyWeight(e.difficulty) * assist;
      weighted += w * (e.correct ? 1 : 0);
      weightSum += w;
      if (assist < 1) assisted += 1;
    }
    const raw = weightSum > 0 ? weighted / weightSum : 0.5;
    // Shrink towards 0.5 by the prior: 3 pseudo-attempts at 50 %.
    const mastery = (raw * weightSum + 0.5 * PRIOR_STRENGTH) / (weightSum + PRIOR_STRENGTH);
    let streak = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].correct) streak += 1;
      else break;
    }
    const lastThree = items.slice(-3);
    const needsReview = mastery >= 0.6 && lastThree.some((e) => !e.correct) && items.length >= 3;
    const state: MasteryStateName =
      items.length === 0
        ? 'unseen'
        : mastery >= MASTERED_AT && items.length >= MIN_ATTEMPTS_FOR_MASTERY
          ? needsReview
            ? 'needs_review'
            : 'mastered'
          : mastery < 0.5 || items.length < 2
            ? 'learning'
            : 'practising';
    return {
      conceptId,
      title: def?.title ?? conceptId,
      domainId: def?.domainId ?? '',
      lessonId: def?.lessonId ?? '',
      prereq: def?.prereq ?? [],
      attempts: items.length,
      correct: items.filter((e) => e.correct).length,
      mastery,
      confidence: items.length / (items.length + 4),
      streak,
      assistedAttempts: assisted,
      // No wall-clock timestamps exist on evidence items; recency is judged from the order of the
      // history (needs_review uses the last three attempts), never invented here.
      lastSeenAt: null,
      state,
      prerequisitesOk: true,
      weakPrerequisites: [],
      averageDifficulty: items.length ? items.reduce((s, e) => s + e.difficulty, 0) / items.length : 0,
    };
  };

  const model: Record<string, MasteryState> = {};
  for (const c of CONCEPTS) model[c.id] = build(c.id);
  for (const c of CONCEPTS) {
    const weak = prerequisitesOf(c.id).filter((p) => (model[p]?.mastery ?? 0) < PREREQ_OK_AT);
    model[c.id].weakPrerequisites = weak;
    model[c.id].prerequisitesOk = weak.length === 0;
  }
  return model;
}

export interface DomainReadiness {
  mastery: number;
  state: 'unseen' | 'learning' | 'practising' | 'mastered';
  /** Up to three weakest concepts, already formatted for display. */
  weakest: string[];
}

export function domainReadiness(model: Record<string, MasteryState>): Record<string, DomainReadiness> {
  const out: Record<string, DomainReadiness> = {};
  for (const c of CONCEPTS) {
    const m = model[c.id];
    const entry = (out[c.domainId] ??= { mastery: 0, state: 'unseen', weakest: [] });
    entry.mastery += m.mastery;
  }
  for (const [domainId, entry] of Object.entries(out)) {
    const concepts = CONCEPTS.filter((c) => c.domainId === domainId);
    const avg = concepts.length ? entry.mastery / concepts.length : 0;
    entry.mastery = avg;
    entry.weakest = concepts
      .map((c) => model[c.id])
      .filter((m) => m.mastery < 0.7)
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, 3)
      .map((m) => `${m.conceptId} ${m.title} (${Math.round(m.mastery * 100)} %)`);
    entry.state = avg >= MASTERED_AT ? 'mastered' : avg >= 0.6 ? 'practising' : concepts.some((c) => model[c.id].attempts > 0) ? 'learning' : 'unseen';
  }
  return out;
}

export interface LearningGate {
  lessonId: string;
  domainId: string;
  title: string;
  order: number;
  unlocked: boolean;
  reason: string;
  mastery: number;
  weakConcepts: string[];
  prerequisites: string[];
}

/**
 * Lesson gates. The order is the curriculum order; a lesson opens once the previous lesson's
 * domain is at 70 % mastery — or immediately if the student has already worked on it (a gate must
 * never lock a capable student out, it only stops the *default* path from running ahead).
 */
export function learningPath(model: Record<string, MasteryState>): LearningGate[] {
  const order = LESSONS_BY_DOMAIN_ORDER();
  return order.map((l, i) => {
    const concepts = CONCEPTS.filter((c) => c.domainId === l.domainId);
    const masteryOf = (domainId: string) => {
      const cs = CONCEPTS.filter((c) => c.domainId === domainId);
      return cs.length ? cs.reduce((s, c) => s + (model[c.id]?.mastery ?? 0.5), 0) / cs.length : 0;
    };
    const mastery = masteryOf(l.domainId);
    const weak = concepts.filter((c) => (model[c.id]?.mastery ?? 0.5) < 0.7).map((c) => `${c.id} ${c.title}`);
    if (i === 0) {
      return { lessonId: l.id, domainId: l.domainId, title: l.title, order: i, unlocked: true, reason: 'start here', mastery, weakConcepts: weak, prerequisites: [] };
    }
    const prev = order[i - 1];
    const prevMastery = masteryOf(prev.domainId);
    const started = concepts.some((c) => (model[c.id]?.attempts ?? 0) > 0);
    const unlocked = prevMastery >= PREREQ_OK_AT || started;
    return {
      lessonId: l.id,
      domainId: l.domainId,
      title: l.title,
      order: i,
      unlocked,
      reason: unlocked
        ? started
          ? 'in progress — you have already worked on this domain'
          : `unlocked: ${prev.id} is at ${Math.round(prevMastery * 100)} % mastery`
        : `finish ${prev.id} first (currently ${Math.round(prevMastery * 100)} %)`,
      mastery,
      weakConcepts: weak,
      prerequisites: [prev.id],
    };
  });
}

/** Concepts worth revisiting: failed recently, or mastered on thin evidence, or simply weak. */
export function reviewQueue(model: Record<string, MasteryState>, limit = 12): MasteryState[] {
  return Object.values(model)
    .filter((m) => m.state === 'needs_review' || (m.state === 'mastered' && m.confidence < MASTERED_CONFIDENCE) || (m.attempts > 0 && m.mastery < 0.7))
    .sort((a, b) => a.mastery - b.mastery || b.attempts - a.attempts)
    .slice(0, limit);
}

export interface MasteryBand {
  levels: Difficulty[];
  label: string;
}

/**
 * Difficulty band for a mastery level. A weak concept gets foundation items — never harder versions
 * of something that is not understood yet.
 */
export function masteryBand(level: number): MasteryBand {
  if (level < 0.4) return { levels: [1, 2], label: 'foundation — rebuild the concept' };
  if (level < 0.6) return { levels: [2, 3], label: 'direct application' };
  if (level < 0.75) return { levels: [3, 4], label: 'multi-step and transfer' };
  if (level < 0.85) return { levels: [4, 5], label: 'transfer and interpretation' };
  return { levels: [5, 6, 7], label: 'exam-style and advanced transfer' };
}

/* ------------------------------------------------------------------ adaptive picker */

export interface PickRequest {
  count: number;
  seed: number;
  domainId?: string;
  /** Restrict to these concepts (a lesson practice pool passes its own concept list). */
  conceptIds?: string[];
  /** Restrict to these levels, unless an item is a remediation pick. */
  levels?: Difficulty[];
  excludeIds?: string[];
  /** Concepts identified as missing prerequisites: they are picked first, at low level. */
  remediationConceptIds?: string[];
  remediationShare?: number;
}

export interface PickResult {
  questions: Question[];
  /** Human-readable reason per item, shown as "why this item". */
  reasons: string[];
  /** How many items the pool could not supply (reported, never silently padded). */
  shortfall: number;
}

export function pickItems(bank: Bank, req: PickRequest, model: Record<string, MasteryState>): PickResult {
  const rng = makeRng(req.seed);
  const exclude = new Set(req.excludeIds ?? []);
  const remediation = new Set(req.remediationConceptIds ?? []);
  const remediationTarget = Math.min(req.count, Math.max(0, Math.round((req.remediationShare ?? 0.25) * req.count)));

  const inScope = (q: Question): boolean => {
    if (req.domainId && q.domainId !== req.domainId) return false;
    if (req.conceptIds?.length && !q.conceptIds.some((c) => req.conceptIds!.includes(c))) return false;
    if (!q.conceptIds.some((c) => remediation.has(c)) && req.levels && !req.levels.includes(q.difficulty)) return false;
    return true;
  };

  const pool = bank.questions.filter((q) => !exclude.has(q.id));
  const chosen: Question[] = [];
  const reasons: string[] = [];
  const usedIds = new Set<string>();
  const usedStyles = new Set<string>();
  /** How often each concept has already been used in *this* request (coverage balance). */
  const pickedPerConcept = new Map<string, number>();

  const levelOf = (q: Question) => {
    const levels = q.conceptIds.map((c) => model[c]?.mastery ?? 0.5);
    return levels.length ? Math.min(...levels) : 0.5;
  };

  const scoreOf = (q: Question): number => {
    const level = levelOf(q);
    const band = masteryBand(level);
    const bandHit = band.levels.includes(q.difficulty) ? 2 : 0;
    const conceptWeak = 1 - level;
    const styleNovelty = usedStyles.has(q.style) ? 0 : 0.8;
    const isRemediation = q.conceptIds.some((c) => remediation.has(c)) ? 3 : 0;
    // A concept with fewer than MIN_ATTEMPTS_FOR_MASTERY attempts cannot be judged at all, so items
    // that produce evidence where evidence is missing outrank more items on an already-measured
    // concept. Without this term the picker keeps drilling the weakest concept and starves the rest
    // of the pool (they then sit at two attempts forever and can never be called mastered).
    const unresolved = Math.max(
      ...q.conceptIds.map((c) => {
        const attempts = model[c]?.attempts ?? 0;
        return attempts < MIN_ATTEMPTS_FOR_MASTERY ? (MIN_ATTEMPTS_FOR_MASTERY - attempts) / MIN_ATTEMPTS_FOR_MASTERY : 0;
      }),
    );
    // Coverage balance: a concept already used in this request is worth less than one that has not
    // appeared yet, otherwise a single weakest concept absorbs the whole session.
    const saturation = Math.max(...q.conceptIds.map((c) => pickedPerConcept.get(c) ?? 0));
    return isRemediation + bandHit + conceptWeak + styleNovelty + 1.6 * unresolved - 1.7 * saturation + rng.next() * 0.5;
  };

  const take = (q: Question, reason: string) => {
    chosen.push(q);
    reasons.push(reason);
    usedIds.add(q.id);
    usedStyles.add(q.style);
    for (const c of q.conceptIds) pickedPerConcept.set(c, (pickedPerConcept.get(c) ?? 0) + 1);
  };

  /**
   * Greedy selection, one item at a time, re-scoring after every pick: the coverage-balance term
   * only means something if the score is recomputed *after* each item is taken. (Sorting once and
   * then walking the list would freeze the session state during the sort and let one concept absorb
   * the whole session — the bug this loop exists to prevent.)
   */
  const greedilyTake = (candidates: Question[], budget: number, reason: (q: Question) => string): void => {
    const remaining = candidates.filter((q) => !usedIds.has(q.id));
    while (chosen.length < req.count && budget > 0 && remaining.length) {
      let bestIndex = -1;
      let bestValue = -Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const value = scoreOf(remaining[i]);
        if (value > bestValue) {
          bestValue = value;
          bestIndex = i;
        }
      }
      if (bestIndex < 0) break;
      const [q] = remaining.splice(bestIndex, 1);
      take(q, reason(q));
      budget -= 1;
    }
  };

  // 1. Remediation first: repair what is missing rather than more of what failed.
  if (remediationTarget > 0) {
    const poolR = bank.questions.filter((q) => q.conceptIds.some((c) => remediation.has(c)) && (!req.domainId || q.domainId === req.domainId));
    greedilyTake(poolR, remediationTarget, (q) => `prerequisite repair: ${q.conceptIds.find((c) => remediation.has(c))}`);
  }

  // 2. Then the adaptive sequence over the requested scope.
  greedilyTake(
    pool.filter(inScope),
    req.count,
    (q) => `mastery ${Math.round(levelOf(q) * 100)} % → ${masteryBand(levelOf(q)).label}`,
  );

  return { questions: chosen, reasons, shortfall: Math.max(0, req.count - chosen.length) };
}

/* ------------------------------------------------------------------ training sessions */

export interface TrainingAnswerState {
  optionIndex: number | null;
  hintsUsed: number;
  wrongAttempts: number;
  ms: number;
}

export interface TrainingSession {
  id: string;
  startedAtMs: number;
  conceptIds: string[];
  levels: Difficulty[];
  queue: string[];
  cursor: number;
  answers: Record<string, TrainingAnswerState>;
  completed: string[];
  /** Items inserted by the remediation step during the session. */
  appended: string[];
}

export interface TrainingFeedback {
  correct: boolean;
  correctIndex: number;
  chosen: number;
  errorTag: string | null;
  message: string;
  explanation: Question['explanation'];
  /** Training mode allows exactly one retry before the item is scored. */
  retryAllowed: boolean;
  hintsUsed: number;
}

export function startTraining(bank: Bank, req: PickRequest, nowMs: number, model: Record<string, MasteryState>): { session: TrainingSession; picked: PickResult } {
  const picked = pickItems(bank, req, model);
  const session: TrainingSession = {
    id: `TR-${req.seed}-${nowMs}`,
    startedAtMs: nowMs,
    conceptIds: req.conceptIds ?? [],
    levels: req.levels ?? [],
    queue: picked.questions.map((q) => q.id),
    cursor: 0,
    answers: {},
    completed: [],
    appended: [],
  };
  return { session, picked };
}

export function currentQuestion(session: TrainingSession, bank: Bank): Question | null {
  const id = session.queue[session.cursor];
  return id ? bank.questions.find((q) => q.id === id) ?? null : null;
}

export function requestHint(session: TrainingSession, bank: Bank): { session: TrainingSession; hint: string | null } {
  const q = currentQuestion(session, bank);
  if (!q) return { session, hint: null };
  const state = session.answers[q.id] ?? { optionIndex: null, hintsUsed: 0, wrongAttempts: 0, ms: 0 };
  const nextIndex = Math.min(state.hintsUsed + (state.optionIndex === null ? 1 : 0), q.hints.length);
  const updated: TrainingSession = {
    ...session,
    answers: { ...session.answers, [q.id]: { ...state, hintsUsed: nextIndex } },
  };
  return { session: updated, hint: q.hints[nextIndex - 1] ?? null };
}

export function submitTrainingAnswer(session: TrainingSession, bank: Bank, optionIndex: number, ms: number): { session: TrainingSession; feedback: TrainingFeedback | null } {
  const q = currentQuestion(session, bank);
  if (!q) return { session, feedback: null };
  const state = session.answers[q.id] ?? { optionIndex: null, hintsUsed: 0, wrongAttempts: 0, ms: 0 };
  const correct = optionIndex === q.correctIndex;
  const wrongAttempts = correct ? state.wrongAttempts : state.wrongAttempts + 1;
  const retryAllowed = !correct && wrongAttempts <= 1;
  const next: TrainingSession = {
    ...session,
    answers: { ...session.answers, [q.id]: { ...state, optionIndex, ms: state.ms + ms, wrongAttempts } },
    completed: correct || !retryAllowed ? [...session.completed, q.id] : session.completed,
  };
  return {
    session: next,
    feedback: {
      correct,
      correctIndex: q.correctIndex,
      chosen: optionIndex,
      errorTag: correct ? null : q.options[optionIndex]?.errorTag ?? null,
      message: correct
        ? 'Correct.'
        : retryAllowed
          ? 'Not yet — the explanation below tells you which idea was wrong. Try once more before moving on.'
          : 'Not this time. Read the full explanation, then continue; this concept will come back in the review queue.',
      explanation: q.explanation,
      retryAllowed,
      hintsUsed: next.answers[q.id].hintsUsed,
    },
  };
}

/**
 * Move on. If the item was failed, insert a remediation item in front of the queue: a prerequisite
 * item when the concept graph knows one, otherwise the same concept one level easier.
 */
export function advanceTraining(session: TrainingSession, bank: Bank, model: Record<string, MasteryState>): TrainingSession {
  const q = currentQuestion(session, bank);
  let next: TrainingSession = { ...session, cursor: Math.min(session.cursor + 1, session.queue.length) };
  if (!q) return next;
  const state = session.answers[q.id];
  const failed = state && state.optionIndex !== q.correctIndex && state.wrongAttempts >= 1;
  if (!failed || !model) return next;
  const weakPrereq = q.conceptIds.flatMap((c) => model[c]?.weakPrerequisites ?? []);
  // Exactly one remediation item, chosen from the narrowest useful pool first and widened only if
  // that pool is empty. Excluding items already answered in this session keeps the repair genuine
  // (a repeat of the failed item teaches nothing) but must not starve the pool, so the widest
  // attempt excludes only the completed items.
  const bands: Difficulty[][] = weakPrereq.length
    ? [[1, 2, 3]]
    : [
        [Math.max(1, q.difficulty - 1) as Difficulty],
        [Math.max(1, q.difficulty - 1) as Difficulty, q.difficulty],
        [1, 2, 3, 4, 5, 6, 7],
      ];
  let extra: Question | undefined;
  for (const [i, levels] of bands.entries()) {
    const pick = pickItems(
      bank,
      {
        domainId: q.domainId,
        conceptIds: weakPrereq.length ? weakPrereq : q.conceptIds,
        levels,
        count: 1,
        seed: bank.questions.length + q.difficulty + session.cursor + 7 + i,
        excludeIds: i === bands.length - 1 ? [...session.completed] : [...session.queue, ...session.completed],
      },
      model,
    );
    if (pick.questions[0] && !session.queue.includes(pick.questions[0].id)) {
      extra = pick.questions[0];
      break;
    }
  }
  if (extra) {
    next = {
      ...next,
      queue: [...next.queue.slice(0, next.cursor), extra.id, ...next.queue.slice(next.cursor)],
      appended: [...next.appended, extra.id],
    };
  }
  return next;
}

export interface TrainingResult {
  answered: number;
  correct: number;
  accuracy: number;
  hintsUsed: number;
  retried: number;
  appended: number;
  evidence: AttemptEvidence[];
  diagnosis: Diagnosis;
  errorProfile: ErrorProfileEntry[];
  /** Concepts that crossed into "mastered" during this session. */
  masteredNow: string[];
  nextConcepts: string[];
}

export function finishTraining(session: TrainingSession, bank: Bank, modelBefore: Record<string, MasteryState>): TrainingResult {
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const evidence: AttemptEvidence[] = [];
  for (const [qid, state] of Object.entries(session.answers)) {
    const q = byId.get(qid);
    if (!q) continue;
    evidence.push(
      evidenceFromAttempt(q, state.optionIndex, state.ms, 'training', {
        usedHints: state.hintsUsed,
        retried: state.wrongAttempts > 0 && state.optionIndex === q.correctIndex,
      }),
    );
  }
  const diagnosis = diagnose(evidence, { mode: 'training' });
  const modelAfter = masteryModel(evidence);
  const masteredNow = Object.keys(modelAfter).filter((c) => modelAfter[c].state === 'mastered' && modelBefore[c]?.state !== 'mastered');
  return {
    answered: evidence.length,
    correct: evidence.filter((e) => e.correct).length,
    accuracy: overallAccuracy(evidence),
    hintsUsed: evidence.reduce((s, e) => s + (e.usedHints ?? 0), 0),
    retried: evidence.filter((e) => e.retried).length,
    appended: session.appended.length,
    evidence,
    diagnosis,
    errorProfile: errorProfile(evidence),
    masteredNow,
    nextConcepts: diagnosis.studyPlan.flatMap((s) => s.conceptIds),
  };
}

/* ------------------------------------------------------------------ lesson practice pools */

export type LessonStepName =
  | 'what_it_is'
  | 'why_it_matters'
  | 'prerequisites'
  | 'core_knowledge'
  | 'visual_intuition'
  | 'worked_example'
  | 'guided_practice'
  | 'independent_practice'
  | 'transfer'
  | 'dmat_style'
  | 'trick'
  | 'mastery_check';

/**
 * Practice for one lesson step: the step declares which concepts it exercises and at which levels;
 * the picker intersects that with the band the student's mastery justifies.
 */
export function practicePool(lesson: Lesson, step: LessonStepName, model: Record<string, MasteryState>, bank: Bank): PickResult {
  const section = lesson.sections.find((s) => s.step === step);
  if (!section?.practiceConceptIds?.length) return { questions: [], reasons: [], shortfall: 0 };
  const conceptLevels = section.practiceConceptIds.map((c) => model[c]?.mastery ?? 0.5);
  const level = conceptLevels.length ? Math.min(...conceptLevels) : 0.5;
  const adaptive = masteryBand(level).levels;
  const declared = section.practiceLevels ?? adaptive;
  const levels = declared.filter((d) => adaptive.includes(d));
  const band = levels.length ? levels : declared;
  const remediation = section.practiceConceptIds.flatMap((c) => model[c]?.weakPrerequisites ?? []);
  const wanted = step === 'mastery_check' ? 8 : 5;
  const seed = hashSeed(`${lesson.id}:${step}:${Math.round(level * 100)}`);
  const primary = pickItems(
    bank,
    {
      conceptIds: section.practiceConceptIds,
      levels: band,
      count: wanted,
      seed,
      remediationConceptIds: [...new Set(remediation)],
      remediationShare: step === 'guided_practice' ? 0.4 : 0.2,
    },
    model,
  );
  if (primary.shortfall === 0) return primary;
  // The step's own concepts could not fill the pool (thin authored domains). Rather than showing a
  // half-empty step, the rest is drawn from the *other* concepts of the same lesson, and each such
  // item says so in its reason. The shortfall that remains is reported honestly.
  const siblings = [...new Set(lesson.sections.flatMap((s) => s.practiceConceptIds ?? []))].filter((c) => !section.practiceConceptIds!.includes(c));
  if (!siblings.length) return primary;
  const topUp = pickItems(
    bank,
    {
      conceptIds: siblings,
      levels: band,
      count: primary.shortfall,
      seed: seed + 1,
      excludeIds: primary.questions.map((q) => q.id),
    },
    model,
  );
  return {
    questions: [...primary.questions, ...topUp.questions],
    reasons: [...primary.reasons, ...topUp.reasons.map((r) => `same lesson, adjacent concept — ${r}`)],
    shortfall: topUp.shortfall,
  };
}

/* ------------------------------------------------------------------ what next */

export interface NextStep {
  kind: 'review' | 'lesson' | 'exam';
  lessonId?: string;
  conceptIds: string[];
  why: string;
}

export function nextStep(model: Record<string, MasteryState>): NextStep {
  const gates = learningPath(model);
  const review = reviewQueue(model, 5);
  if (review.length >= 3) {
    return {
      kind: 'review',
      conceptIds: review.map((r) => r.conceptId),
      why: `${review.length} concepts are due for review, weakest first: ${review[0].title} (${Math.round(review[0].mastery * 100)} %).`,
    };
  }
  const current = gates.find((g) => g.unlocked && g.mastery < 0.85) ?? gates[gates.length - 1];
  if (current) {
    return {
      kind: 'lesson',
      lessonId: current.lessonId,
      conceptIds: CONCEPTS.filter((c) => c.domainId === current.domainId).map((c) => c.id),
      why: current.reason,
    };
  }
  return { kind: 'exam', conceptIds: [], why: 'All lessons are at mastery level — take a 90-minute simulation to confirm readiness.' };
}

/** FNV-1a: deterministic seeds for practice pools (a lesson step always yields the same set). */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
