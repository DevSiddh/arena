/**
 * Lesson registry.
 *
 * One lesson per preparation domain (L01 ↔ D01 … L15 ↔ D15). Loading this module validates
 * every lesson against the twelve-step contract (see helpers.ts) and against the curriculum
 * graph: every concept in `engine/curriculum.ts` must point at a lesson that exists, and every
 * practice step must draw from concepts that lesson actually teaches.
 */

import type { Lesson } from '../../engine/types';
import { CONCEPTS, DOMAINS } from '../../engine/curriculum';
import { L01 } from './L01';
import { L02 } from './L02';
import { L03 } from './L03';
import { L04 } from './L04';
import { L05 } from './L05';
import { L06 } from './L06';
import { L07 } from './L07';
import { L08 } from './L08';
import { L09 } from './L09';
import { L10 } from './L10';
import { L11 } from './L11';
import { L12 } from './L12';
import { L13 } from './L13';
import { L14 } from './L14';
import { L15 } from './L15';

export const LESSONS: Lesson[] = [L01, L02, L03, L04, L05, L06, L07, L08, L09, L10, L11, L12, L13, L14, L15];

export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export const LESSON_BY_DOMAIN: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.domainId, l]));

/** Covereage and integrity problems; empty array means the lesson layer is consistent. */
export function lessonProblems(): string[] {
  const problems: string[] = [];
  for (const d of DOMAINS) {
    if (!LESSON_BY_DOMAIN[d.id]) problems.push(`domain ${d.id} (${d.short}) has no lesson`);
  }
  for (const c of CONCEPTS) {
    const l = LESSON_BY_ID[c.lessonId];
    if (!l) {
      problems.push(`concept ${c.id} points at missing lesson ${c.lessonId}`);
      continue;
    }
    if (l.domainId !== c.domainId) problems.push(`concept ${c.id} (${c.domainId}) points at lesson ${l.id} of ${l.domainId}`);
    const pools = l.sections.flatMap((s) => s.practiceConceptIds ?? []);
    if (!pools.includes(c.id)) problems.push(`concept ${c.id} is never practised in ${l.id}`);
  }
  for (const l of LESSONS) {
    for (const s of l.sections) {
      for (const cid of s.practiceConceptIds ?? []) {
        if (!CONCEPTS.some((c) => c.id === cid)) problems.push(`lesson ${l.id} step ${s.step} practice pool references unknown concept ${cid}`);
      }
    }
  }
  return problems;
}

export interface LessonStats {
  lessonId: string;
  domainId: string;
  title: string;
  minutes: number;
  sections: number;
  practicePools: number;
  concepts: string[];
  levels: number[];
}

export function lessonStats(): LessonStats[] {
  return LESSONS.map((l) => {
    const practiceSteps = l.sections.filter((s) => s.practiceConceptIds?.length);
    return {
      lessonId: l.id,
      domainId: l.domainId,
      title: l.title,
      minutes: l.estimatedMinutes,
      sections: l.sections.length,
      practicePools: practiceSteps.length,
      concepts: [...new Set(practiceSteps.flatMap((s) => s.practiceConceptIds ?? []))],
      levels: [...new Set(practiceSteps.flatMap((s) => s.practiceLevels ?? []))].sort((a, b) => a - b),
    };
  });
}
