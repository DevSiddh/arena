import type { Question, Explanation, ErrorTag, Difficulty, CognitiveMove, ItemStyle, ReasoningType, Figure, ConfidenceLabel, Verification } from '../types';

export interface AuthoredOption {
  text: string;
  errorTag: ErrorTag;
  /** Why this option is wrong (or why the key is right). */
  why: string;
}

export interface AuthoredSpec {
  id: string;
  domainId: string;
  conceptIds: string[];
  label: ConfidenceLabel;
  stem: string;
  /** Options in the order they should be presented; `correct` indexes into this array. */
  options: [AuthoredOption, AuthoredOption, AuthoredOption, AuthoredOption];
  correct: 0 | 1 | 2 | 3;
  difficulty: Difficulty;
  reasoningType: ReasoningType;
  cognitiveMove: CognitiveMove;
  style: ItemStyle;
  hints: string[];
  explanation: Explanation;
  figure?: Figure;
  verification?: Verification;
  tags?: string[];
  stimulusId?: string;
}

/**
 * Register an authored (hand-written) item. Authored items keep their option order — the
 * order is part of the design (e.g. escalating plausibility in a "which statement is
 * correct" item), so nothing is shuffled.
 */
export function Q(spec: AuthoredSpec): Question {
  if (spec.options.length !== 4) throw new Error(`authored ${spec.id}: needs exactly 4 options`);
  if (new Set(spec.options.map((o) => o.text)).size !== 4) throw new Error(`authored ${spec.id}: duplicate option text`);
  const options = spec.options.map((o, i) => ({
    text: o.text,
    errorTag: i === spec.correct ? ('none' as ErrorTag) : o.errorTag,
    rationale: o.why,
  }));
  if (spec.explanation.distractorWhy.length !== 4) throw new Error(`authored ${spec.id}: explanation.distractorWhy must have 4 entries`);
  return {
    id: spec.id,
    domainId: spec.domainId,
    conceptIds: spec.conceptIds,
    label: spec.label,
    stimulusId: spec.stimulusId,
    stem: spec.stem,
    figure: spec.figure,
    options,
    correctIndex: spec.correct,
    difficulty: spec.difficulty,
    reasoningType: spec.reasoningType,
    cognitiveMove: spec.cognitiveMove,
    style: spec.style,
    hints: spec.hints,
    explanation: spec.explanation,
    verification: spec.verification,
    provenance: 'authored',
    tags: spec.tags ?? [],
  };
}

/**
 * Helper for "which statement is correct" items: builds the option array from an ordered
 * list of statements, the index of the true one, and per-statement diagnoses.
 */
export function statements(
  items: { text: string; tag?: ErrorTag; why: string }[],
  correctIndex: number,
): { options: [AuthoredOption, AuthoredOption, AuthoredOption, AuthoredOption]; correct: 0 | 1 | 2 | 3 } {
  if (items.length !== 4) throw new Error('statements(): need exactly 4 statements');
  const options = items.map((i) => ({ text: i.text, errorTag: i.tag ?? 'concept_confusion', why: i.why })) as [
    AuthoredOption,
    AuthoredOption,
    AuthoredOption,
    AuthoredOption,
  ];
  return { options, correct: correctIndex as 0 | 1 | 2 | 3 };
}
