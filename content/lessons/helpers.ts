/**
 * Small authoring helpers for the lessons.
 *
 * A lesson is data, not a prose blob: every one of the twelve mandated steps is an explicit
 * `LessonSection`, the practice steps declare which concept pools and difficulty bands feed
 * them, and `assertLesson()` refuses to load a lesson that is missing a step or that asks for
 * practice without a pool. The teaching sequence is therefore enforced by the type system and
 * by a runtime check, not by convention.
 */

import type { ConfidenceLabel, Difficulty, Figure, Lesson, LessonBlock, LessonSection } from '../../engine/types';

export const STEP_ORDER: LessonSection['step'][] = [
  'what_is_it',
  'why_it_matters',
  'prerequisites',
  'core_knowledge',
  'visual_intuition',
  'worked_example',
  'guided_practice',
  'independent_practice',
  'transfer',
  'dmat_style',
  'trick_misconception',
  'mastery_check',
];

export const STEP_TITLE: Record<LessonSection['step'], string> = {
  what_is_it: 'What it is',
  why_it_matters: 'Why it matters for the dMAT',
  prerequisites: 'Prerequisites',
  core_knowledge: 'Core knowledge',
  visual_intuition: 'Visual intuition',
  worked_example: 'Worked example',
  guided_practice: 'Guided practice',
  independent_practice: 'Independent practice',
  transfer: 'Transfer',
  dmat_style: 'dMAT-style items',
  trick_misconception: 'Trick and misconception',
  mastery_check: 'Mastery check',
};

export const labels: Record<ConfidenceLabel, string> = {
  OFFICIAL_SAMPLE: 'Official sample',
  OFFICIAL_FIELD_LIST: 'Officially named area',
  PREREQUISITE: 'Prerequisite knowledge',
  PREPARATION_EXTENSION: 'Preparation extension',
};

/* block constructors */
export const p = (markdown: string): LessonBlock => ({ kind: 'prose', markdown });
export const intuition = (markdown: string): LessonBlock => ({ kind: 'intuition', markdown });
export const f = (latex: string, caption?: string): LessonBlock => ({ kind: 'formula', latex, caption });
export const t = (headers: string[], rows: (string | number)[][], caption?: string): LessonBlock => ({ kind: 'table', headers, rows, caption });
export const fig = (figure: Figure, caption?: string): LessonBlock => ({ kind: 'figure', figure, caption });
export const steps = (items: string[]): LessonBlock => ({ kind: 'steps', items });
export const mis = (wrong: string, right: string): LessonBlock => ({ kind: 'misconception', wrong, right });
export const official = (exerciseId: string, note: string): LessonBlock => ({ kind: 'official', exerciseId, note });

/** A teaching step (no practice pool). */
export function sec(step: LessonSection['step'], blocks: LessonBlock[], title?: string): LessonSection {
  return { step, title: title ?? STEP_TITLE[step], blocks };
}

/** A practice step: the UI draws its items from the bank by concept + difficulty band. */
export function practice(
  step: LessonSection['step'],
  blocks: LessonBlock[],
  conceptIds: string[],
  levels: Difficulty[],
  title?: string,
): LessonSection {
  return { step, title: title ?? STEP_TITLE[step], blocks, practiceConceptIds: conceptIds, practiceLevels: levels };
}

export function lesson(
  id: string,
  domainId: string,
  title: string,
  subtitle: string,
  lessonLabels: ConfidenceLabel[],
  estimatedMinutes: number,
  sections: LessonSection[],
): Lesson {
  const l: Lesson = { id, domainId, title, subtitle, labels: lessonLabels, estimatedMinutes, sections };
  assertLesson(l);
  return l;
}

/** Throws when a lesson does not satisfy the twelve-step contract. Used at module load. */
export function assertLesson(l: Lesson): void {
  const found = l.sections.map((s) => s.step);
  for (const step of STEP_ORDER) {
    if (!found.includes(step)) throw new Error(`lesson ${l.id}: missing step "${step}"`);
  }
  if (found.length !== STEP_ORDER.length) {
    const dupes = found.filter((s, i) => found.indexOf(s) !== i);
    throw new Error(`lesson ${l.id}: duplicate step(s) ${[...new Set(dupes)].join(', ')}`);
  }
  found.forEach((s, i) => {
    if (s !== STEP_ORDER[i]) throw new Error(`lesson ${l.id}: step ${s} is out of order (position ${i})`);
  });
  for (const s of l.sections) {
    const isPractice = ['guided_practice', 'independent_practice', 'transfer', 'dmat_style', 'mastery_check'].includes(s.step);
    if (isPractice && (!s.practiceConceptIds?.length || !s.practiceLevels?.length)) {
      throw new Error(`lesson ${l.id}: practice step "${s.step}" declares no concept pool or difficulty band`);
    }
    if (s.blocks.length === 0) throw new Error(`lesson ${l.id}: step "${s.step}" has no content`);
  }
}
