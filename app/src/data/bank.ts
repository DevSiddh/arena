/**
 * The application's data + state layer.
 *
 * The question bank is a build artefact (`content/bank.json`, produced by `npm run build:bank`);
 * the lesson layer is imported from source so its types stay exact. Student state is an evidence
 * log kept in localStorage: mastery is always *derived* from evidence with the same engine code the
 * CLI tools use, never stored as a separate, drift-prone number.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import bankJson from '../../../content/bank.json';
import { LESSONS } from '../../../content/lessons';
import type { Bank, Lesson, Question } from '../../../engine/types';
import type { AttemptEvidence, Diagnosis } from '../../../engine/evidence';
import { diagnose, formatDiagnosisMarkdown } from '../../../engine/evidence';
import { masteryModel, type ConceptMastery } from '../../../engine/diagnostics';
import type { ExamResult } from '../../../engine/exam';

export const BANK: Bank = {
  questions: (bankJson as unknown as Bank).questions,
  stimuli: (bankJson as unknown as Bank).stimuli,
  lessons: LESSONS,
  meta: (bankJson as unknown as Bank).meta,
};

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(BANK.questions.map((q) => [q.id, q]));
export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export interface ExamAttemptRecord {
  atIso: string;
  seed: number;
  formId: string;
  score: number;
  total: number;
  accuracy: number;
  unanswered: number;
  timeUsedMs: number;
  headline: string;
}

interface PersistedState {
  version: 1;
  evidence: AttemptEvidence[];
  exams: ExamAttemptRecord[];
}

const STORAGE_KEY = 'dmat-gam-preparation-state-v1';

function load(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, evidence: [], exams: [] };
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed.version !== 1 || !Array.isArray(parsed.evidence)) return { version: 1, evidence: [], exams: [] };
    return parsed;
  } catch {
    return { version: 1, evidence: [], exams: [] };
  }
}

export interface Store {
  evidence: AttemptEvidence[];
  exams: ExamAttemptRecord[];
  mastery: Record<string, ConceptMastery>;
  diagnosis: Diagnosis;
  /** Per-day answer counts, for the activity strip on the home view. */
  record: (e: AttemptEvidence | AttemptEvidence[]) => void;
  recordExam: (result: ExamResult, seed: number) => void;
  reset: () => void;
  answeredIds: string[];
}

export function useStore(): Store {
  const [state, setState] = useState<PersistedState>(() => load());
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable: the session still works in memory */
    }
  }, [state]);

  const record = useCallback((e: AttemptEvidence | AttemptEvidence[]) => {
    setState((s) => ({ ...s, evidence: [...s.evidence, ...(Array.isArray(e) ? e : [e])] }));
  }, []);

  const recordExam = useCallback((result: ExamResult, seed: number) => {
    setState((s) => ({
      ...s,
      exams: [
        ...s.exams,
        {
          atIso: new Date().toISOString(),
          seed,
          formId: result.formId,
          score: result.score,
          total: result.total,
          accuracy: result.accuracy,
          unanswered: result.unanswered,
          timeUsedMs: result.timeUsedMs,
          headline: result.diagnosis.headline,
        },
      ],
    }));
  }, []);

  const reset = useCallback(() => setState({ version: 1, evidence: [], exams: [] }), []);

  const mastery = useMemo(() => masteryModel(state.evidence), [state.evidence]);
  const diagnosis = useMemo(() => diagnose(state.evidence), [state.evidence]);
  const answeredIds = useMemo(() => [...new Set(state.evidence.map((e) => e.questionId))], [state.evidence]);

  return { ...state, mastery, diagnosis, record, recordExam, reset, answeredIds };
}

export function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function diagnosisMarkdown(d: Diagnosis, title: string): string {
  return formatDiagnosisMarkdown(d, title);
}
