/**
 * Core data model for the dMAT Subject Module (General Academic Module) mastery system.
 *
 * Design rule: every piece of evidence that the diagnostic engine needs — the concept,
 * the cognitive move, the error mechanism behind each distractor, the confidence label
 * about official provenance — is *data on the item*, never something inferred later from
 * prose.
 */

/** How strongly the official material supports a topic. Never blurred in the UI. */
export type ConfidenceLabel =
  | 'OFFICIAL_SAMPLE' // directly demonstrated by one of the four official sample exercises
  | 'OFFICIAL_FIELD_LIST' // the official instructions name this area as possibly covered
  | 'PREREQUISITE' // needed to understand a demonstrated concept
  | 'PREPARATION_EXTENSION'; // our reasoned extension, not a dMAT syllabus claim

export const LABEL_TEXT: Record<ConfidenceLabel, string> = {
  OFFICIAL_SAMPLE: 'Official sample',
  OFFICIAL_FIELD_LIST: 'Officially named area',
  PREREQUISITE: 'Prerequisite knowledge',
  PREPARATION_EXTENSION: 'Preparation extension',
};

export const LABEL_NOTE: Record<ConfidenceLabel, string> = {
  OFFICIAL_SAMPLE:
    'Directly demonstrated by an official sample exercise in the g.a.s.t. preparatory materials (as at 02.09.2026).',
  OFFICIAL_FIELD_LIST:
    'Named by the official instructions as a possible topic area ("mathematics, computational sciences, natural sciences, engineering, business administration, economics, social sciences and humanities"). No sample question is published for it.',
  PREREQUISITE:
    'Not named officially, but required to understand a demonstrated concept — taught here as a stepping stone.',
  PREPARATION_EXTENSION:
    'Our reasoned extension for practice. This is not a claim about the official dMAT syllabus.',
};

/** 7-level difficulty taxonomy required by the preparation brief. */
export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DIFFICULTY_TEXT: Record<Difficulty, string> = {
  1: 'Foundation — does the concept make sense?',
  2: 'Direct application — one taught rule, one step',
  3: 'Multi-step application — combine several relations',
  4: 'Transfer — same principle, unfamiliar context',
  5: 'Deductive / tricky — careful interpretation, no formula matching',
  6: 'Exam-style — the cognitive demand of a real Subject Module question',
  7: 'Advanced transfer — harder than typical preparation examples',
};

/** What kind of reasoning the item is actually measuring. */
export type ReasoningType =
  | 'recall_structure'
  | 'rule_application'
  | 'multi_step_application'
  | 'conceptual_discrimination'
  | 'representation_transfer'
  | 'parameter_reasoning'
  | 'optimisation_reasoning'
  | 'causal_reasoning'
  | 'evidence_evaluation'
  | 'estimation_scaling'
  | 'logical_deduction';

/** The six recurring cognitive moves observed in the official sample items (see source analysis §3). */
export type CognitiveMove =
  | 'execute_rule'
  | 'interpret_representation'
  | 'effect_of_change'
  | 'general_case'
  | 'explain_or_critique'
  | 'classify_situation';

export const MOVE_TEXT: Record<CognitiveMove, string> = {
  execute_rule: 'Execute a rule',
  interpret_representation: 'Interpret a representation',
  effect_of_change: 'Reason about the effect of a change',
  general_case: 'State the general / necessary case',
  explain_or_critique: 'Explain or critique a mechanism',
  classify_situation: 'Classify a described situation',
};

/** Surface form of the item — used to defeat "this looks like the last one". */
export type ItemStyle =
  | 'numeric_direct'
  | 'statement_compare'
  | 'effect_direction'
  | 'graph_choice'
  | 'critique_reasoning'
  | 'relevance_filter'
  | 'missing_information'
  | 'reverse_question';

/**
 * Error mechanism attached to every distractor. This is what allows the diagnostic
 * engine to report *why* a student failed instead of a percentage.
 */
export type ErrorTag =
  | 'prerequisite_gap'
  | 'concept_confusion'
  | 'rule_misapplication'
  | 'sign_error'
  | 'component_confusion'
  | 'unit_error'
  | 'unit_conversion'
  | 'calculation_slip'
  | 'graph_misread'
  | 'question_misread'
  | 'wrong_assumption'
  | 'transfer_failure'
  | 'inequality_direction'
  | 'ratio_error'
  | 'base_rate_neglect'
  | 'correlation_causation'
  | 'sufficient_necessary_confusion'
  | 'model_assumption_error'
  | 'linearity_assumption'
  | 'square_root_scaling'
  | 'irrelevant_data_used'
  | 'overprecision'
  | 'label_confusion'
  | 'definition_misuse'
  | 'causal_direction_reversed'
  | 'scope_error'
  | 'none';

export const ERROR_TAG_TEXT: Record<ErrorTag, string> = {
  prerequisite_gap: 'Missing prerequisite knowledge',
  concept_confusion: 'Conceptual misunderstanding',
  rule_misapplication: 'Rule/procedure misapplied',
  sign_error: 'Sign handling error',
  component_confusion: 'Component confusion (x/y/z order)',
  unit_error: 'Unit error',
  unit_conversion: 'Unit conversion error',
  calculation_slip: 'Calculation slip',
  graph_misread: 'Graph/table misread',
  question_misread: 'Question misread',
  wrong_assumption: 'Assumption that the model does not make',
  transfer_failure: 'Failed to transfer to a new context',
  inequality_direction: 'Direction of an inequality/effect reversed',
  ratio_error: 'Ratio/proportion error',
  base_rate_neglect: 'Base rate neglected',
  correlation_causation: 'Correlation mistaken for causation',
  sufficient_necessary_confusion: 'Sufficient confused with necessary',
  model_assumption_error: 'Model assumption misunderstood',
  linearity_assumption: 'Assumed linearity that does not hold',
  square_root_scaling: 'Square-root scaling mishandled',
  irrelevant_data_used: 'Irrelevant information used',
  overprecision: 'Overprecise answer claimed',
  label_confusion: 'Two similar labels confused',
  definition_misuse: 'Definition misapplied',
  causal_direction_reversed: 'Cause and effect reversed',
  scope_error: 'Claim wider than the evidence allows',
  none: '—',
};

/** Figures are declarative data; the UI renders them as original SVG/graphics. */
export type Figure =
  | {
      kind: 'vector_grid';
      vectors: { label: string; to: [number, number]; color?: string }[];
      showResultant?: { label: string; to: [number, number]; color?: string };
      xRange?: [number, number];
      yRange?: [number, number];
    }
  | { kind: 'pressure_depth'; lines: { label: string; rho: number; p0: number; color?: string }[]; hMax: number; markedDepths?: number[] }
  | { kind: 'tank_points'; points: { label: string; depth: number }[]; fluid: string; depthsScaleMax?: number }
  | { kind: 'eoq_curves'; D: number; S: number; H: number; qMax: number; highlight?: 'ordering' | 'holding' | 'total' | 'optimal' }
  | { kind: 'ship_stability'; ships: { label: string; beam: number; boxOffset: number }[] }
  | { kind: 'flooded_room'; roomHeight: number; leakDepth: number; leakHeight: number; riseFraction?: number }
  | { kind: 'suction_pump'; h: number; t: number }
  | { kind: 'bar_chart'; title: string; xLabel: string; yLabel: string; categories: string[]; series: { name: string; values: number[]; color?: string }[] }
  | { kind: 'line_chart'; title: string; xLabel: string; yLabel: string; x: number[]; series: { name: string; values: number[]; color?: string }[] }
  | { kind: 'table'; title?: string; headers: string[]; rows: (string | number)[][] }
  | { kind: 'flowchart'; title?: string; steps: string[] }
  | { kind: 'lever'; loadArm: number; effortArm: number; load: number }
  | { kind: 'blob_diagram'; caption?: string; nodes: { id: string; label: string; x: number; y: number }[]; edges: { from: string; to: string; label?: string; dashed?: boolean }[] };

export interface Option {
  /** Option text. Inline maths may be written as $...$ (KaTeX). */
  text: string;
  /** Error mechanism if the student picks this option. 'none' for the correct option. */
  errorTag: ErrorTag;
  /** Why this option is wrong (or, for the key, a one-line confirmation). */
  rationale: string;
}

export interface Explanation {
  /** 1. What the question is testing. */
  testing: string;
  /** 2. Which information matters. */
  matters: string;
  /** 3. Which information is irrelevant (optional — omitted when nothing is irrelevant). */
  irrelevant?: string;
  /** 4. Which concept applies, and 5. why it applies. */
  concept: string;
  why: string;
  /** 6. Step-by-step reasoning (calculation where necessary). */
  steps: string[];
  /** 8. Why each of the other options fails (aligned with options order). */
  distractorWhy: string[];
  /** 9. The common trap. */
  trap: string;
  /** 10. The general principle that transfers. */
  transfer: string;
}

/** Nothing here reveals the answer: it is everything an independent solver needs. */
export type Verification =
  | { solver: 'vector.addsub'; payload: { a: number[]; b: number[]; c: number[]; sign: '+' | '-' } }
  | { solver: 'vector.magnitude'; payload: { a: number[] } }
  | { solver: 'vector.magnitude_pair'; payload: { a: number[]; b: number[] } }
  | { solver: 'vector.scaled_magnitude'; payload: { a: number[]; k: number } }
  | { solver: 'vector.scalar_mult'; payload: { a: number[]; k: number } }
  | { solver: 'vector.dot'; payload: { a: number[]; b: number[] } }
  | { solver: 'vector.angle'; payload: { a: number[]; b: number[] } }
  | { solver: 'vector.cross'; payload: { a: number[]; b: number[] } }
  | { solver: 'vector.parallelogram_area'; payload: { a: [number, number]; b: [number, number] } }
  | { solver: 'vector.triple'; payload: { a: number[]; b: number[]; c: number[] } }
  | { solver: 'hydro.pressure'; payload: { depth_m: number; rho: number; p0_pa: number; g: number } }
  | { solver: 'hydro.pressure_diff'; payload: { d1: number; d2: number; rho: number; g: number } }
  | { solver: 'hydro.buoyant_mass'; payload: { volume_m3: number; submergedFraction: number; rho: number } }
  | { solver: 'hydro.trapped_air_rise'; payload: { roomHeight_m: number; depth_m: number; p0_pa: number; rho: number; g: number } }
  | { solver: 'hydro.suction_lift'; payload: { vacuum_bar: number } }
  | { solver: 'eoq.qstar'; payload: { D: number; S: number; H: number } }
  | { solver: 'eoq.total_cost'; payload: { D: number; S: number; H: number; Q: number } }
  | { solver: 'eoq.orders_per_year'; payload: { D: number; S: number; H: number; Q: number } }
  | { solver: 'eoq.cycle_days'; payload: { D: number; S: number; H: number; Q: number } }
  | { solver: 'eoq.sensitivity'; payload: { D: number; S: number; H: number; k: number } }
  | { solver: 'finance.breakeven'; payload: { fixedCost: number; price: number; variableCost: number } }
  | { solver: 'stat.weighted_mean'; payload: { values: number[]; weights: number[] } }
  | { solver: 'stat.mean'; payload: { values: number[] } }
  | { solver: 'stat.median'; payload: { values: number[] } }
  | { solver: 'stat.probability'; payload: { favourable: number; total: number; complement: boolean } }
  | { solver: 'stat.bayes_counts'; payload: { n_outcome: number; n_both: number; n_total: number } }
  | { solver: 'physics.power'; payload: { energy_J: number; time_s: number } }
  | { solver: 'physics.work'; payload: { force_N: number; distance_m: number } }
  | { solver: 'physics.efficiency'; payload: { useful_J: number; input_J: number } }
  | { solver: 'physics.flow_continuity'; payload: { area1: number; velocity1: number; area2: number } }
  | { solver: 'physics.lever'; payload: { load_N: number; loadArm: number; effortArm: number } }
  | { solver: 'physics.density'; payload: { mass_kg: number; volume_m3: number } }
  | { solver: 'physics.gas_ratio'; payload: { p1: number; p2: number; v1: number } }
  | { solver: 'math.percentage_change'; payload: { from: number; to: number } }
  | { solver: 'math.proportion'; payload: { a: number; b: number; c: number } }
  | { solver: 'math.unit_convert'; payload: { value: number; factor: number } }
  | { solver: 'math.rate'; payload: { amount: number; per: number; target: number } }
  | { solver: 'comp.binary_to_decimal'; payload: { bits: string } }
  | { solver: 'comp.loop_trace'; payload: { start: number; step: number; iterations: number; op: 'add' | 'multiply' } }
  | { solver: 'econ.elasticity_direction'; payload: { priceChangePct: number; elasticity: number } }
  | { solver: 'econ.opportunity_cost'; payload: { explicit: number[]; bestForgone: number } }
  | { solver: 'datainterp.gradient'; payload: { x1: number; y1: number; x2: number; y2: number } }
  | { solver: 'datainterp.share'; payload: { part: number; total: number } };

export interface Question {
  id: string;
  domainId: string;
  conceptIds: string[];
  /** Official-provenance label of the *concept* being tested. */
  label: ConfidenceLabel;
  /** Stimulus block (input text) this question belongs to, if any. */
  stimulusId?: string;
  stem: string;
  figure?: Figure;
  options: Option[];
  correctIndex: number;
  difficulty: Difficulty;
  reasoningType: ReasoningType;
  cognitiveMove: CognitiveMove;
  style: ItemStyle;
  /** Staged hints for training mode: recall → representation → method. */
  hints: string[];
  explanation: Explanation;
  /** Payload for the independent solver. Present on every numeric item. */
  verification?: Verification;
  provenance: 'authored' | 'generated';
  /** Free-form tags used by the exam assembler and the anti-memorisation checks. */
  tags: string[];
  /** Set by the build pipeline. */
  audit?: AuditResult;
}

export interface AuditResult {
  structural: boolean;
  solverAgreement: boolean | null;
  ambiguous: boolean;
  problems: string[];
  /** Signature used for duplicate detection. */
  signature: string;
}

export interface Stimulus {
  id: string;
  title: string;
  label: ConfidenceLabel;
  /** Domains whose concepts the stimulus supports. */
  domainIds: string[];
  /** Input text in the official two-part item anatomy: text + questions. */
  body: string;
  figure?: Figure;
  /** Populated by the assembler. */
  questionIds?: string[];
  /** Marks the stimulus as adapted from an official exercise (used for the "official example" study cards). */
  officialExercise?: string;
}

export interface DomainDef {
  id: string;
  title: string;
  short: string;
  /** Primary confidence label(s) for the domain. */
  labels: ConfidenceLabel[];
  /** Justification: why this belongs in a preparation curriculum (required by the brief). */
  justification: string;
  /** Official evidence, if any. */
  officialEvidence?: string;
  /** What we deliberately do NOT teach inside this domain. */
  excluded?: string;
}

export interface ConceptDef {
  id: string;
  domainId: string;
  title: string;
  /** Prerequisite concept ids — the diagnostic engine walks this graph. */
  prereq: string[];
  label: ConfidenceLabel;
  /** Where to send the student when the concept is weak. */
  lessonId: string;
}

export type LessonBlock =
  | { kind: 'prose'; markdown: string }
  | { kind: 'intuition'; markdown: string }
  | { kind: 'formula'; latex: string; caption?: string }
  | { kind: 'table'; headers: string[]; rows: (string | number)[][]; caption?: string }
  | { kind: 'figure'; figure: Figure; caption?: string }
  | { kind: 'steps'; items: string[] }
  | { kind: 'misconception'; wrong: string; right: string }
  | { kind: 'official'; exerciseId: string; note: string };

export interface LessonSection {
  /** The 12 required lesson steps. */
  step:
    | 'what_is_it'
    | 'why_it_matters'
    | 'prerequisites'
    | 'core_knowledge'
    | 'visual_intuition'
    | 'worked_example'
    | 'guided_practice'
    | 'independent_practice'
    | 'transfer'
    | 'dmat_style'
    | 'trick_misconception'
    | 'mastery_check';
  title: string;
  blocks: LessonBlock[];
  /** Concept ids whose item pools feed the practice steps. */
  practiceConceptIds?: string[];
  /** Difficulty band to draw practice items from. */
  practiceLevels?: Difficulty[];
}

export interface Lesson {
  id: string;
  domainId: string;
  title: string;
  subtitle: string;
  labels: ConfidenceLabel[];
  estimatedMinutes: number;
  sections: LessonSection[];
}

export interface OfficialExampleStudy {
  /** Reference to an official exercise (numbers only; no official question text is reproduced). */
  id: string;
  title: string;
  domainId: string;
  /** What the official exercise teaches — summary, our own words. */
  teaches: string[];
  /** The reasoning moves the official questions demand. */
  moves: string[];
  /** Our own paraphrase of the official "why": the point of the exercise. */
  keyInsight: string;
  /** How the product trains this beyond the sample. */
  beyondSample: string[];
}

export interface Bank {
  questions: Question[];
  stimuli: Stimulus[];
  lessons: Lesson[];
  meta: {
    generatedAt: string;
    seed: number;
    counts: Record<string, number>;
    failures: AuditFailure[];
    stats: ValidationStats;
  };
}

export interface AuditFailure {
  id: string;
  domainId: string;
  reason: string;
  detail?: string;
}

export interface ValidationStats {
  generated: number;
  valid: number;
  rejected: number;
  rejectionReasons: Record<string, number>;
  ambiguityRate: number;
  duplicateRate: number;
  templateRepetitionRate?: number;
  duplicateCount: number;
  answerKeyFailures: number;
  solverDisagreements: number;
  solverChecked: number;
  structuralFailures: number;
  byDomain: Record<string, { total: number; valid: number; levels: Record<string, number> }>;
  byLevel: Record<string, number>;
}
