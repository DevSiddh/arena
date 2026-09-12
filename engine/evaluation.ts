/**
 * Evaluation section of a question: what the item makes the student *do*, how demanding that is,
 * and in which setting.
 *
 * Every question carries one (types.ts → `Evaluation`), and `buildAndValidate` derives a default
 * when the author did not state one, so no item reaches a student without a plain-language
 * statement of what it measures. The printable report and the exam review both show it.
 */

import type { ActivityKind, Evaluation, Question, SceneKind, SkillKind } from './types';

const SCENE_BY_DOMAIN: Record<string, SceneKind> = {
  D01: 'everyday',
  D02: 'technical',
  D03: 'everyday',
  D04: 'everyday',
  D05: 'scientific',
  D06: 'technical',
  D07: 'technical',
  D08: 'computational',
  D09: 'economic',
  D10: 'economic',
  D11: 'social_science',
  D12: 'social_science',
  D13: 'scientific',
  D14: 'scientific',
  D15: 'social_science',
};

/** Item style → the activity the student performs. Style is the stronger signal when present. */
const ACTIVITY_BY_STYLE: Record<string, ActivityKind> = {
  numeric_direct: 'calculation',
  statement_compare: 'analysis',
  effect_direction: 'model_assessment',
  graph_choice: 'graph_interpretation',
  critique_reasoning: 'argumentation',
  relevance_filter: 'information_selection',
  missing_information: 'information_selection',
  reverse_question: 'formula_transformation',
  description_choice: 'classification',
};

export function deriveEvaluation(q: Question): Evaluation {
  const concepts = q.conceptIds.join(' ');
  const hasGraphicFigure = !!q.figure && ['bar_chart', 'line_chart', 'table'].includes(q.figure.kind);

  let activity: ActivityKind = ACTIVITY_BY_STYLE[q.style] ?? 'analysis';
  if (hasGraphicFigure) activity = 'graph_interpretation';
  if (/C08\.(trace|debug)/.test(concepts) && activity === 'analysis') activity = 'trace';
  if (/C01\.estimate|C13\.estimate/.test(concepts) && q.difficulty >= 3 && activity === 'calculation') activity = 'estimation';
  if (q.cognitiveMove === 'classify_situation' && activity === 'analysis') activity = 'classification';

  let skill: SkillKind;
  switch (q.reasoningType) {
    case 'recall_structure':
      skill = 'basic_recall';
      break;
    case 'conceptual_discrimination':
      skill = q.difficulty >= 5 ? 'model_critique' : 'routine_procedure';
      break;
    case 'rule_application':
      skill = q.difficulty <= 2 ? 'routine_procedure' : 'quantitative_literacy';
      break;
    case 'multi_step_application':
      skill = 'quantitative_literacy';
      break;
    case 'representation_transfer':
    case 'parameter_reasoning':
      skill = 'transfer';
      break;
    case 'estimation_scaling':
      skill = 'quantitative_literacy';
      break;
    case 'optimisation_reasoning':
      skill = q.difficulty >= 5 ? 'model_critique' : 'quantitative_literacy';
      break;
    case 'evidence_evaluation':
      skill = 'evidence_judgement';
      break;
    case 'causal_reasoning':
      skill = 'reasoning_under_uncertainty';
      break;
    case 'logical_deduction':
      skill = 'reasoning_under_uncertainty';
      break;
    default:
      skill = q.difficulty >= 5 ? 'transfer' : 'routine_procedure';
  }
  if (q.difficulty >= 6 && (skill === 'routine_procedure' || skill === 'basic_recall')) skill = 'model_critique';

  const scene: SceneKind = SCENE_BY_DOMAIN[q.domainId] ?? 'everyday';
  return {
    activity,
    skill,
    scene,
    certifies: [q.difficulty],
    note:
      q.verification
        ? 'Numeric item: the key is recomputed by an independent solver (and again in Python by scripts/verify_bank.py).'
        : 'Conceptual item: no computation to re-derive — correctness rests on the single defensible option and its distractor rationales.',
  };
}

/** One line for the printable report. */
export function evaluationLine(q: Question): string {
  const e = q.evaluation ?? deriveEvaluation(q);
  return `${e.activity} · ${e.skill} · ${e.scene}`;
}

export function withEvaluation(q: Question): Question {
  if (!q.evaluation) q.evaluation = deriveEvaluation(q);
  return q;
}
