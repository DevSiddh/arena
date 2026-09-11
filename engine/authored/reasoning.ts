import { Q } from './helpers';
import type { Question } from '../types';
import type { AuthoredOption, AuthoredSpec } from './helpers';

/**
 * Authored questions for the reasoning domains that the official field list names but does
 * not demonstrate:
 *   D13 Scientific Reasoning, Models & Estimation
 *   D14 Experimental & Evidence-Based Reasoning
 *   D15 Argument & Text Reasoning (the quantifier-precision skill that official Exercise 1
 *       question 8 exercises in mathematical clothing)
 *
 * Every item is labelled PREPARATION_EXTENSION except where it directly generalises a
 * demonstrated reasoning move (labelled OFFICIAL_FIELD_LIST).
 */

type Spec = {
  id: string;
  domainId: string;
  conceptIds: string[];
  stem: string;
  options: AuthoredOption[];
  correct: number;
  difficulty: AuthoredSpec['difficulty'];
  testing: string;
  matters: string;
  irrelevant?: string;
  concept: string;
  why: string;
  steps: string[];
  trap: string;
  transfer: string;
  hints: string[];
  reasoning?: AuthoredSpec['reasoningType'];
  move?: AuthoredSpec['cognitiveMove'];
  style?: AuthoredSpec['style'];
};

function build(s: Spec): Question {
  return Q({
    id: s.id,
    domainId: s.domainId,
    conceptIds: s.conceptIds,
    label: 'PREPARATION_EXTENSION',
    stem: s.stem,
    options: s.options as AuthoredSpec['options'],
    correct: s.correct as AuthoredSpec['correct'],
    difficulty: s.difficulty,
    reasoningType: s.reasoning ?? 'evidence_evaluation',
    cognitiveMove: s.move ?? 'explain_or_critique',
    style: s.style ?? 'statement_compare',
    hints: s.hints,
    explanation: {
      testing: s.testing,
      matters: s.matters,
      irrelevant: s.irrelevant,
      concept: s.concept,
      why: s.why,
      steps: s.steps,
      distractorWhy: s.options.map((o) => o.why),
      trap: s.trap,
      transfer: s.transfer,
    },
  });
}

const O = (text: string, tag: AuthoredOption['errorTag'], why: string): AuthoredOption => ({ text, errorTag: tag, why });

/* ================================================================== */
/* D13 — scientific reasoning, models and estimation                   */
/* ================================================================== */

export const SCIENTIFIC_AUTHORED: Question[] = [
  build({
    id: 'a13-01',
    domainId: 'D13',
    conceptIds: ['C13.model'],
    stem:
      'The official hydrostatics input estimates the water pressure at depth with ρ = 1000 kg/m³ and g ≈ 10 N/kg, and notes that in a precise calculation the risen water column would also have to be taken into account. Which statement about such simplified models is correct?',
    options: [
      O('A simplified model is acceptable if the simplification cannot change the answer qualitatively and the required precision is stated.', 'none', 'Correct: the simplification is judged by whether it preserves the qualitative conclusion and by whether the intended precision is respected.'),
      O('A simplified model is acceptable only if it delivers the exact value.', 'overprecision', 'Demanding exactness would rule out every estimation model, including the official one.'),
      O('A simplified model is always preferable to a precise calculation.', 'wrong_assumption', 'Precision is chosen according to purpose; neither simplification nor exactness is universally better.'),
      O('Simplifications are acceptable in physics but not in the social sciences.', 'definition_misuse', 'Every empirical discipline works with simplified models, from ideal gases to rational-actor assumptions.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'What makes a simplified model legitimate rather than sloppy.',
    matters: 'The two criteria: the conclusion survives the simplification, and the claimed precision matches the method.',
    concept: 'Models trade realism for tractability; the trade is justified by the use of the result.',
    why: 'A model is a tool for a decision or an explanation, so its adequacy is judged against the purpose, not against reality in full.',
    steps: [
      'Identify what was simplified (the water column above the risen level, the exact ρ and g).',
      'Check the consequence: the order of magnitude and the direction of the conclusion are unchanged.',
      'Check the promise: the answer is quoted to a precision the simplification supports.',
    ],
    trap: 'Treating “simplified” as automatically “wrong”, or quoting spuriously precise numbers from a rough model.',
    transfer: 'The same two-part test applies to economic forecasts, engineering safety factors and epidemiological projections.',
    hints: ['Ask what decision the number is meant to support.', 'Two things must hold: the conclusion and the claimed precision.'],
  }),
  build({
    id: 'a13-02',
    domainId: 'D13',
    conceptIds: ['C13.scaling', 'C13.estimate'],
    stem:
      'A model of a river is built at a scale of 1 : 100 (all lengths). At a certain point the real river carries a flow of 30 m³/s. Which flow rate must the model carry so that the *volumes* transported per second correspond to the same relative scale?',
    options: [
      O('0.00003 m³/s, because volumes scale with the third power of the length scale', 'none', 'Correct: a 1 : 100 length scale means volumes scale as 100³ = 10⁶, so the model flow is 30/10⁶ = 0.00003 m³/s.'),
      O('0.3 m³/s, because the area scales with the square of the length scale', 'linearity_assumption', 'Using the square instead of the cube fits areas, not volumes: the model flow is 10 000 times smaller than this.'),
      O('3000 m³/s, because the model must exaggerate the flow to remain stable', 'rule_misapplication', 'A model cannot carry a flow larger than the scale relation allows.'),
      O('30 m³/s, because flow rate is unchanged by scaling', 'concept_confusion', 'Volumetric flow involves volume, which scales with the cube of length.'),
    ] as AuthoredOption[],
    correct: 0,
    difficulty: 5,
    testing: 'Applying the cube law to a quantity (volume per time) that involves a volume.',
    matters: 'The number of length dimensions in a volume: three.',
    concept: 'Scaling laws: volume ∝ length³, so volumetric flow scales with the cube of the length scale.',
    why: 'Every spatial dimension of the model is reduced by 100, so the volume is reduced by 100³ = 10⁶.',
    steps: [
      'Length scale: 1/100 per dimension.',
      'Volume scale: (1/100)³ = 10⁻⁶.',
      'Model flow: 30 × 10⁻⁶ = 3 × 10⁻⁵ m³/s (0.000 03 m³/s).',
    ],
    trap: 'Using the square (area) scaling for a volume, or ignoring scaling altogether.',
    transfer: 'The same cube law governs model ships, wind-tunnel models and the surprising strength-to-weight differences between small and large structures.',
    hints: ['Count how many length dimensions a volume has.', 'The scale factor applies to each dimension separately.'],
  }),
  build({
    id: 'a13-03',
    domainId: 'D13',
    conceptIds: ['C13.estimate'],
    stem:
      'A report concludes that a new sorting algorithm is faster than the existing one: on 200 test items it needed 1 800 comparisons instead of 2 000. Which statement about this conclusion is most appropriate?',
    options: [
      O('The difference is small and was measured on a tiny input; without information about scaling behaviour, the general claim is not supported.', 'none', 'Correct: a 10 % difference on 200 items says little about behaviour on realistic input sizes.'),
      O('The conclusion is proven, because the measurement is objective.', 'overprecision', 'Objectivity of a measurement does not establish that it generalises to other input sizes.'),
      O('The algorithm is clearly better and should replace the existing one immediately.', 'scope_error', 'Acting on a 10 % difference from one small trial is not justified by the evidence.'),
      O('The comparison is meaningless because algorithms cannot be compared.', 'definition_misuse', 'Algorithm comparison is standard practice; the issue is the evidence, not the feasibility.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Judging an empirical claim against the conditions under which it was obtained.',
    matters: 'The input size (200 items) and the magnitude of the difference (10 %).',
    concept: 'Performance claims depend on the operating conditions; growth behaviour matters more than one measurement.',
    why: 'A constant-factor advantage measured on a small input cannot be extrapolated: the growth class decides behaviour at scale.',
    steps: [
      'Note the measurement conditions: small input, single trial.',
      'Ask whether the claim (“faster”) generalises to other sizes.',
      'Conclude that the claim needs scaling information before it is decision-relevant.',
    ],
    trap: 'Accepting a precise-looking measurement as proof of a general claim.',
    transfer: 'The same caution applies to benchmark comparisons, marketing test results and pilot studies.',
    hints: ['What was measured, and under what conditions?', 'Does the claim require more than one input size?'],
  }),
  build({
    id: 'a13-04',
    domainId: 'D13',
    conceptIds: ['C13.precision'],
    stem:
      'A measuring instrument is described as follows: repeated measurements of the same sample give values within ±2 units of each other, but the true value is consistently 15 units higher than every measurement. Which statement is correct?',
    options: [
      O('The measurements are precise but biased: repeatability is good while accuracy is poor.', 'none', 'Correct: precision describes scatter, accuracy describes distance from the true value.'),
      O('The measurements are accurate but imprecise: the offset cancels out on average.', 'definition_misuse', 'A systematic offset does not cancel; it shifts every measurement in the same direction.'),
      O('The instrument is both accurate and precise, because ±2 is a small range.', 'concept_confusion', 'A small range shows precision only; the 15-unit offset destroys accuracy.'),
      O('Nothing can be concluded, because the true value is unknown.', 'wrong_assumption', 'The question states the deviation from the true value, so accuracy can be judged.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Separating the two distinct quality dimensions of a measurement.',
    matters: 'The scatter (±2) and the systematic deviation (15).',
    concept: 'Precision = repeatability; accuracy = closeness to the true value.',
    why: 'Random errors widen the scatter, systematic errors shift the centre; they must be diagnosed separately because the remedies differ.',
    steps: [
      'Look at the scatter: ±2 ⇒ high precision.',
      'Look at the offset: 15 ⇒ low accuracy.',
      'Combine: precise but biased.',
    ],
    trap: 'Concluding “good instrument” from a small scatter, or “bad instrument” from an offset — each statement needs both dimensions.',
    transfer: 'Calibration (fixable by a correction) differs from noise (fixable by averaging), a distinction used in every laboratory and data pipeline.',
    hints: ['Two properties are being described — which phrase belongs to which?', 'Would averaging repeated measurements remove the 15-unit gap?'],
  }),
  build({
    id: 'a13-05',
    domainId: 'D13',
    conceptIds: ['C13.model', 'C09.assume'],
    stem:
      'A consultancy applies the order-quantity model to a product whose demand doubles in the last quarter of every year. Which statement is most appropriate?',
    options: [
      O('The constant-demand assumption is violated, so the formula’s result should be treated as an approximation and the seasonality handled explicitly.', 'none', 'Correct: the model remains a useful benchmark, but its central premise does not hold for this product.'),
      O('The formula cannot be used at all, and the model is therefore worthless.', 'overprecision', 'Models with violated assumptions can still provide a baseline; “worthless” overstates the case.'),
      O('The formula gives an exact answer for any demand pattern, since demand enters as a single number.', 'model_assumption_error', 'The formula is derived under the constant-demand premise; a single annual figure hides the seasonality that drives cost.'),
      O('The seasonality has no effect on costs because only the annual total matters.', 'wrong_assumption', 'Timing drives average inventory and therefore holding cost, which is exactly what the model computes.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Recognising which model assumption a real situation violates, and calibrating the response accordingly.',
    matters: 'The constant, known demand assumption and the seasonal pattern in the data.',
    concept: 'Assumption checking before model application.',
    why: 'A model is only as good as its premises; identifying the violated premise tells you how to compensate rather than whether to discard the tool.',
    steps: [
      'List the model assumptions (constant demand, no discounts, unlimited capital/storage, cost minimisation).',
      'Test the situation against each: seasonal demand breaks the first.',
      'Decide the response: use the result as a benchmark, adjust for the season.',
    ],
    trap: 'Reacting in absolutes — either ignoring the violation or discarding the model entirely.',
    transfer: 'The same diagnostic habit applies to financial models, queueing estimates and scheduling assumptions.',
    hints: ['Which assumption of the model does a seasonal product break?', 'What is the proportionate response to a violated premise?'],
  }),
  build({
    id: 'a13-06',
    domainId: 'D13',
    conceptIds: ['C13.estimate'],
    stem:
      'A claim states that a new battery technology stores “1 000 times more energy” than current batteries, based on a laboratory cell with a volume of 0.01 cm³. Which reaction is most scientifically appropriate?',
    options: [
      O('Ask how the figure scales: extremely small laboratory cells often show high specific performance that does not survive scaling to practical cell sizes.', 'none', 'Correct: scale-up effects and packaging are the standard reason why laboratory records do not transfer directly.'),
      O('Accept the figure, since laboratory measurements are reliable.', 'overprecision', 'Reliability of a measurement does not establish that the effect survives scale-up.'),
      O('Reject the figure, because laboratory results are always misleading.', 'overprecision', 'Blanket rejection is as unjustified as blanket acceptance.'),
      O('Ignore the volume, because energy density is independent of cell size.', 'linearity_assumption', 'Energy density is a ratio, but practical constraints (current collectors, packaging, heat) scale differently from the active material.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'The scale-up question in evaluating a technical performance claim.',
    matters: 'The size of the test cell relative to practical devices and the ratio nature of “energy density”.',
    concept: 'Scale effects: ratios measured in miniature systems need not hold in full-size systems.',
    why: 'Inactive components, heat transport and manufacturing tolerances do not scale down proportionally, so small cells systematically flatter performance.',
    steps: [
      'Note the measured ratio and the cell size.',
      'Ask which mechanisms dominate at larger sizes.',
      'Conclude that the claim needs a scale-up argument before it can be believed.',
    ],
    trap: 'Comparing a laboratory ratio directly with a product specification, a routine error in technology reporting.',
    transfer: 'The same caution applies to lab-scale catalysts, pilot plants and clinical dosages.',
    hints: ['Ratios are only comparable if the surrounding conditions are comparable.', 'What is different about a 0.01 cm³ cell?'],
  }),
  build({
    id: 'a13-07',
    domainId: 'D13',
    conceptIds: ['C13.estimate', 'C01.estimate'],
    stem:
      'Estimate which of the following quantities is of the order of 10⁶ (one million) in SI units for an ordinary office building.',
    options: [
      O('The mass of the building in kilograms', 'none', 'Correct: a building of about 1 000 m² of floor area with roughly 500 kg/m² of structure and contents comes to about 5 × 10⁵ kg — the closest order of magnitude of the four.'),
      O('The mass of the building in grams', 'unit_error', 'This is 10³ times the kilogram figure, i.e. of order 10⁹ — the prefix was ignored.'),
      O('The power consumption in watts', 'unit_error', 'Office power demand is of the order 10⁴–10⁵ W, and the unit is different from mass.'),
      O('The number of bricks in the building in units of 10²', 'rule_misapplication', 'The question asks for a quantity in SI units, not for a rescaled count.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Producing and comparing order-of-magnitude estimates, including unit awareness.',
    matters: 'The choice of unit (kilograms, not grams) and a rough mass per floor area.',
    concept: 'Fermi estimation anchored on a familiar intermediate quantity.',
    why: 'Anchoring on a per-area figure converts an impossible question (total mass) into a multiplication of quantities that can be estimated.',
    steps: [
      'Estimate floor area: about 10³ m².',
      'Estimate mass per area: several hundred kg/m² including structure and contents.',
      'Multiply: about 10⁵–10⁶ kg ⇒ the kilogram estimate is the right order.',
    ],
    trap: 'Ignoring unit prefixes, which shifts any estimate by orders of magnitude.',
    transfer: 'The same anchoring technique estimates national consumption, logistics capacity or the scale of any project.',
    hints: ['Anchor on a per-square-metre figure you can judge.', 'Check the unit in which the question asks for the answer.'],
  }),
  build({
    id: 'a13-08',
    domainId: 'D13',
    conceptIds: ['C13.model', 'C15.necessary'],
    stem:
      'A model predicts that a system will reach equilibrium within 4 hours. Which statement about the model’s assumptions is most useful for deciding whether to trust the prediction in a new setting?',
    options: [
      O('Identify which conditions the model requires to hold — for example constant temperature or a closed system — and check whether the new setting satisfies them.', 'none', 'Correct: assumptions define the model’s domain of validity, so checking them is what makes the prediction transportable.'),
      O('Check whether the model was published in a reputable journal.', 'irrelevant_data_used', 'Publication venue is weak evidence about validity in a specific new setting.'),
      O('Verify that the model has been used successfully before.', 'irrelevant_data_used', 'Past success is encouraging but does not determine whether the new setting satisfies the premises.'),
      O('Assume the prediction holds, since models are designed to be general.', 'wrong_assumption', 'Models are general only within their assumptions; generality is not a property of the equations alone.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Treating assumptions as the boundary conditions of a model’s validity.',
    matters: 'The specific premises of the model (temperature, closure, linearity, equilibrium) and the features of the new setting.',
    concept: 'Domain of validity: a model applies where its assumptions hold.',
    why: 'Predictions are derived *from* the assumptions, so the assumptions are the transferable part of the knowledge.',
    steps: [
      'Extract the assumptions that enter the derivation.',
      'Compare them with the new setting.',
      'Where a premise fails, expect a systematic deviation rather than random noise.',
    ],
    trap: 'Judging a model by its source’s reputation instead of by the fit between premises and situation.',
    transfer: 'This is the routine of engineering judgement, epidemiological modelling and financial stress testing.',
    hints: ['What has to be true for the equations to apply?', 'Which of the four options tests the fit between premises and the new situation?'],
  }),
];

/* ================================================================== */
/* D14 — experimental & evidence-based reasoning                       */
/* ================================================================== */

export const EXPERIMENT_AUTHORED: Question[] = [
  build({
    id: 'a14-01',
    domainId: 'D14',
    conceptIds: ['C14.control'],
    stem:
      'A company tests a new training app by giving it to volunteers from its own staff. After eight weeks, participants score better on a knowledge test than they did before. Which feature limits the conclusion most?',
    options: [
      O('There is no control group, so improvement from retesting and seasonality cannot be separated from the app’s effect.', 'none', 'Correct: without a comparison group, any change over time is attributed to the intervention by default.'),
      O('The test should have been longer than eight weeks.', 'irrelevant_data_used', 'Duration is a design choice; the missing comparison is the fundamental limitation.'),
      O('The participants were volunteers, so the app cannot work.', 'overprecision', 'Volunteering limits generalisability but does not show that the app fails to work.'),
      O('Knowledge tests cannot measure training effects at all.', 'overprecision', 'Knowledge tests are standard outcome measures; the issue is the comparison structure.'),
    ],
    correct: 0,
    difficulty: 3,
    testing: 'Recognising the absence of a comparison group as the primary threat to a before/after claim.',
    matters: 'The structure of the evidence: one group, measured twice.',
    concept: 'Control groups isolate the intervention from other changes over time.',
    why: 'Practice effects, seasonal variation and general trends all produce improvement; only a comparable untreated group reveals what would have happened anyway.',
    steps: [
      'Identify the design: single group, pre/post.',
      'List rival explanations for the improvement.',
      'Note that none of them is excluded without a control group.',
    ],
    trap: 'Focusing on sample size or duration, which are secondary to the design’s comparison structure.',
    transfer: 'The same reasoning evaluates wellness programmes, teaching innovations and process changes.',
    hints: ['What would have happened without the app, and does the study know?', 'Which single design element is missing?'],
  }),
  build({
    id: 'a14-02',
    domainId: 'D14',
    conceptIds: ['C14.control', 'C14.bias'],
    stem:
      'A study on a new painkiller gives one group the drug and another group a tablet with no active ingredient. Patients are told only that they “may receive either”. Both groups are asked to rate their pain. Which purpose does the inactive tablet serve?',
    options: [
      O('It controls for expectation effects: without it, improvement could be attributed to the belief of being treated.', 'none', 'Correct: the placebo isolates the pharmacological effect from the expectation effect.'),
      O('It increases the sample size without additional cost.', 'rule_misapplication', 'A placebo group is not a way of enlarging a sample; it is a comparison condition.'),
      O('It guarantees that the groups are identical in every respect.', 'overprecision', 'Randomisation balances groups on average; a placebo does not make them identical.'),
      O('It ensures that the researchers cannot know the results.', 'definition_misuse', 'That is what blinding achieves — a related but different device.'),
    ],
    correct: 0,
    difficulty: 3,
    testing: 'The function of a placebo control and its distinction from randomisation and blinding.',
    matters: 'The comparison condition (inactive tablet) and the information given to participants.',
    concept: 'Placebo control, randomisation and blinding are three separate devices with different jobs.',
    why: 'Expectation alone can change reported outcomes, so a treatment effect can only be estimated against an otherwise identical experience.',
    steps: [
      'Identify what the inactive tablet removes: the belief of receiving an active treatment.',
      'Distinguish it from randomisation (how groups are formed) and blinding (who knows what).',
      'Attribute the correct purpose.',
    ],
    trap: 'Confusing the three devices, especially placebo with blinding.',
    transfer: 'The same logic appears in service trials (a “sham” feature) and in policy pilots with an untreated comparison.',
    hints: ['Three devices are in play: forming groups, hiding allocation, and giving an inactive treatment — which one is asked about here?', 'What would belief alone do to a self-reported pain rating?'],
  }),
  build({
    id: 'a14-03',
    domainId: 'D14',
    conceptIds: ['C14.replicate', 'C04.sampling'],
    stem:
      'A single study with 40 participants reports a large effect that contradicts three earlier studies with more than 300 participants each. Which stance is most defensible?',
    options: [
      O('The new result is interesting but not yet decisive; replication and an explanation for the discrepancy are needed.', 'none', 'Correct: a single small study does not overturn a body of evidence without replication or a mechanism for the difference.'),
      O('The new study should be accepted because more recent studies are always better.', 'overprecision', 'Recency is not a validity criterion.'),
      O('The earlier studies must be wrong because they are older.', 'overprecision', 'Age is not a criterion of invalidity either.'),
      O('Findings from different studies cannot be compared.', 'definition_misuse', 'Comparison and synthesis of studies are the basis of evidence-based practice.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Calibrating belief in a new result against the existing evidence base.',
    matters: 'The size of the new study relative to the previous ones, and the absence of an explanation for the contradiction.',
    concept: 'Evidence accumulates; single studies (particularly small ones) are estimates within a distribution.',
    why: 'Small studies have wide uncertainty and are more likely to produce extreme values, so a surprising result from a small study is expected occasionally by chance.',
    steps: [
      'Compare the designs and sizes.',
      'Consider the base rate of surprising findings from small samples.',
      'Decide: wait for replication, but do not dismiss the result.',
    ],
    trap: 'Reacting with certainty in either direction — credulous acceptance or outright dismissal.',
    transfer: 'The same calibration governs reactions to new medical findings, market studies and evaluation reports.',
    hints: ['How much evidence does the new study contain relative to the others?', 'Which response keeps the result but withholds certainty?'],
  }),
  build({
    id: 'a14-04',
    domainId: 'D14',
    conceptIds: ['C14.conclude', 'C12.level'],
    stem:
      'A survey finds that countries with higher chocolate consumption also have more Nobel laureates per capita. Which conclusion is supported?',
    options: [
      O('The two quantities are correlated across countries; no causal claim can be made from this design.', 'none', 'Correct: an ecological correlation across countries establishes co-variation only.'),
      O('Eating chocolate raises intellectual achievement.', 'correlation_causation', 'The individual-level causal claim is not supported by a country-level association.'),
      O('The finding proves that wealth explains both variables, since richer countries do both.', 'correlation_causation', 'Wealth is a plausible confounder, but the study cannot demonstrate that it explains the pattern.'),
      O('The correlation is meaningless because the variables are measured differently.', 'definition_misuse', 'Correlations between differently measured variables are routinely meaningful when interpreted correctly.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Drawing the weakest claim that the design supports, and detecting an ecological leap.',
    matters: 'The unit of analysis (countries) versus the unit of the causal claim (individuals).',
    concept: 'Ecological fallacy: an association between group averages does not transfer to individuals.',
    why: 'Country-level co-variation can reflect any third factor — wealth, institutions, education systems — that differs across countries.',
    steps: [
      'Identify the units: countries, not people.',
      'State the association between those units.',
      'Refuse to move to an individual-level causal claim.',
    ],
    trap: 'Turning a striking correlation into a memorable causal story — the pattern the item is designed to catch.',
    transfer: 'The same restraint applies to regional health statistics, school league tables and company-level productivity studies.',
    hints: ['What is compared with what, and at which level?', 'Would the correlation still license the same sentence if the unit were households?'],
  }),
  build({
    id: 'a14-05',
    domainId: 'D14',
    conceptIds: ['C14.conclude', 'C14.control'],
    stem:
      'A pilot study reports that a new admission procedure reduced dropout by 6 percentage points (from 12 % to 6 %) at one faculty, without a comparison faculty. Which additional piece of evidence would most strengthen the conclusion that the procedure caused the reduction?',
    options: [
      O('A comparison with faculties that kept the old procedure over the same period, with similar student profiles.', 'none', 'Correct: a contemporaneous comparison group rules out shared causes such as an intake change affecting everyone.'),
      O('A larger sample of applicants within the same faculty.', 'irrelevant_data_used', 'A larger sample improves precision but does not address the missing comparison.'),
      O('Statements from the procedure’s designers supporting the result.', 'wrong_assumption', 'Testimony about a mechanism is not evidence about the magnitude or cause of the change.'),
      O('A follow-up of the same cohorts three years later.', 'irrelevant_data_used', 'A longer horizon addresses durability, not attribution.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Selecting the evidence that addresses the actual weakness in a quasi-experimental claim.',
    matters: 'The missing comparison group and the possibility of a faculty-wide or nationwide trend.',
    concept: 'Attribution requires a counterfactual, normally supplied by a comparison group.',
    why: 'A before/after difference mixes the intervention with everything else that changed in the same period; a comparison group separates them.',
    steps: [
      'Identify the claim: the procedure caused a 6-point reduction.',
      'Identify what could otherwise explain it: an intake change, a policy change affecting all faculties.',
      'Choose the evidence that tests the alternative: comparable faculties without the change.',
    ],
    trap: 'Choosing “more data” (bigger sample, longer follow-up) when the problem is design, not precision.',
    transfer: 'This is the reasoning behind difference-in-differences designs in economics and staged roll-outs in operations.',
    hints: ['What is the counterfactual, and is it observed anywhere?', 'Which option observes the same period without the intervention?'],
  }),
  build({
    id: 'a14-06',
    domainId: 'D14',
    conceptIds: ['C14.bias', 'C04.sampling'],
    stem:
      'An online retailer evaluates a redesign by comparing visitors who were shown the new layout with visitors who were shown the old one on the same day. Which threat to the comparison is most serious?',
    options: [
      O('Visitors may not have been assigned randomly: the two groups could differ systematically in device, origin or intent.', 'none', 'Correct: without random assignment, the groups may differ in ways that matter for the outcome.'),
      O('The comparison was made on a single day.', 'irrelevant_data_used', 'A single day limits generalisation to other periods but does not by itself bias the group comparison.'),
      O('The sample is too large to be analysed.', 'overprecision', 'Sample size is not a threat here.'),
      O('Redesigns cannot be evaluated empirically.', 'definition_misuse', 'They can, given a sound comparison design.'),
    ],
    correct: 0,
    difficulty: 3,
    testing: 'Identifying non-random assignment as the primary threat in an observational comparison.',
    matters: 'How visitors ended up in each condition.',
    concept: 'Group formation determines what a comparison can show.',
    why: 'If the assignment mechanism correlates with the outcome (e.g. returning visitors see the new layout), the comparison mixes the design effect with those differences.',
    steps: [
      'Ask how the two groups were formed.',
      'Ask what else that mechanism might correlate with.',
      'Conclude that random assignment (A/B testing) would be needed to isolate the design effect.',
    ],
    trap: 'Worrying about sample size instead of assignment.',
    transfer: 'The same question decides the credibility of any A/B test, campaign comparison or service change.',
    hints: ['Who decided which version a visitor saw?', 'Which option questions the formation of the groups?'],
  }),
];

/* ================================================================== */
/* D15 — argument & text reasoning (quantifier precision)              */
/* ================================================================== */

export const ARGUMENT_AUTHORED: Question[] = [
  build({
    id: 'a15-01',
    domainId: 'D15',
    conceptIds: ['C15.quantifier'],
    stem:
      '“Every project that used the new tool finished on time.” Which observation would refute this statement?',
    options: [
      O('One project that used the tool finished late.', 'none', 'Correct: a universal statement (“every”) is refuted by a single counterexample.'),
      O('Many projects that did not use the tool finished late.', 'scope_error', 'This is about projects outside the statement’s scope; it does not touch the claim.'),
      O('Some projects that used the tool finished early.', 'scope_error', 'This is consistent with the claim and therefore cannot refute it.'),
      O('Most projects that used the tool finished late.', 'scope_error', '“Most” is strong evidence against the claim but not a formal refutation; one late project already refutes “every”.'),
    ],
    correct: 0,
    difficulty: 2,
    testing: 'The asymmetry between universal statements and their falsification.',
    matters: 'The quantifier “every” and what is logically required to defeat it.',
    concept: 'A universal claim is refuted by one counterexample; it is never proved by examples alone.',
    why: 'The claim asserts a property of all members of a set, so any member lacking that property makes the claim false.',
    steps: [
      'Parse the claim: ∀ project using the tool: finished on time.',
      'Identify the negation: at least one project that used the tool finished late.',
      'Match that negation to the options.',
    ],
    trap: 'Choosing “most projects finished late”, which is the strongest evidence but not the logically decisive observation.',
    transfer: 'The same asymmetry underlies hypothesis testing (a single decisive observation can falsify a general law) and quality claims in contracts.',
    hints: ['What exactly does the word “every” promise?', 'What is the minimum required to show the promise broken?'],
    style: 'statement_compare',
  }),
  build({
    id: 'a15-02',
    domainId: 'D15',
    conceptIds: ['C15.necessary'],
    stem:
      'A study reports: “All successful applicants had completed an internship; therefore an internship is necessary for a successful application.” Which criticism is correct?',
    options: [
      O('The reasoning is invalid: the reported observation cannot establish that an internship is required, because a necessary condition must hold in every successful case, which the study does not demonstrate.', 'none', 'Correct: the claim “necessary” requires that no successful applicant lacked an internship — a much stronger statement than the one reported.'),
      O('The reasoning is valid, because all successful applicants are covered by the observation.', 'sufficient_necessary_confusion', 'The observation, as reported, is too weak to support necessity; a necessary condition must hold in *every* successful case without exception, and the study design does not establish that.'),
      O('The reasoning shows that internships are sufficient for success.', 'sufficient_necessary_confusion', 'Necessity and sufficiency are different claims; nothing here shows that an internship produces success.'),
      O('The conclusion is correct but should be stated as a correlation.', 'definition_misuse', 'Restating the claim as a correlation abandons the necessity claim rather than repairing the inference.'),
    ] as AuthoredOption[],
    correct: 0,
    difficulty: 5,
    testing: 'Necessary versus sufficient conditions, and the evidential demands of each.',
    matters: 'The exact quantifier structure: “all successful had X” supports “X was present in the observed successes”, not “X is required for success”.',
    concept: 'Necessary condition: absence precludes the outcome; sufficient condition: presence produces the outcome.',
    why: 'A correlation among successful cases does not exclude the possibility that successful applicants without an internship exist outside the observed sample.',
    steps: [
      'Write the claim formally: success ⇒ internship.',
      'Ask what evidence would support it: no success without an internship, in a representative sample.',
      'Note that the reported study, by its own description, does not supply that.',
    ],
    trap: 'Treating the reported pattern as proof of a requirement, and sliding between “necessary” and “sufficient”.',
    transfer: 'The same distinction governs admission criteria, hiring requirements and technical specifications (a part that is *necessary* versus one that is *enough*).',
    hints: ['What would have to be observed for the internship to be *necessary*?', 'Two logical relations look similar in everyday speech: required and enough.'],
  }),
  build({
    id: 'a15-03',
    domainId: 'D15',
    conceptIds: ['C15.inference'],
    stem:
      '“Our competitor reduced prices last quarter and sales rose. Therefore reducing prices increases sales for all firms in this market.” Which two weaknesses appear together in this argument?',
    options: [
      O('Other causes of the sales rise are ignored, and a single case is generalised to all firms.', 'none', 'Correct: the argument both omits rival explanations and over-extends from one observation.'),
      O('The quantities are measured in different units, and the comparison is unfair.', 'irrelevant_data_used', 'No unit or comparability problem is described.'),
      O('The conclusion contradicts the premise, so the argument is self-defeating.', 'definition_misuse', 'The conclusion follows loosely from the premise rather than contradicting it.'),
      O('The argument is valid, but the sample is small.', 'sufficient_necessary_confusion', 'Describing it as valid misreads the problem: validity fails precisely because of the generalisation.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Diagnosing compound weaknesses in a short argument.',
    matters: 'Two distinct defects: missing rival causes (confounding) and an unjustified generalisation (scope).',
    concept: 'Argument diagnosis: identify separately what is missing and what is over-claimed.',
    why: 'Different defects require different remedies — one needs better comparison, the other needs a narrower claim — so they must be named separately.',
    steps: [
      'List what else could have raised sales (seasonality, marketing, competitor supply issues).',
      'Note the jump from one firm to “all firms in this market”.',
      'Combine the two observations into the correct option.',
    ],
    trap: 'Accepting an option that names only one of the two defects when the question asks for both.',
    transfer: 'Business cases, policy briefs and news commentary frequently contain exactly this pair of flaws.',
    hints: ['Look for an omitted alternative cause.', 'Look for a claim wider than the evidence.'],
  }),
  build({
    id: 'a15-04',
    domainId: 'D15',
    conceptIds: ['C15.claim'],
    stem:
      'Text: “Attendance at the lecture fell by 15 %. The lecture hall is too small, so students must be watching the recording instead.” Which statement is the argument’s main unsupported claim?',
    options: [
      O('That students are watching the recording instead.', 'none', 'Correct: the attendance figure is given data; the substitution is the inferred, unverified explanation.'),
      O('That attendance fell by 15 %.', 'irrelevant_data_used', 'This is the reported measurement, not an inference.'),
      O('That the lecture hall exists.', 'irrelevant_data_used', 'This is a background fact, not a claim under dispute.'),
      O('That the lecture is valuable.', 'irrelevant_data_used', 'The argument does not need this assumption to run; it is not the load-bearing claim.'),
    ],
    correct: 0,
    difficulty: 3,
    testing: 'Separating reported data from the inference built on it.',
    matters: 'The single link in the argument that requires evidence but has none.',
    concept: 'Argument anatomy: data, warrant, claim.',
    why: 'A conclusion needs a warrant connecting data to claim; here the warrant (“they must be watching recordings”) is asserted without support.',
    steps: [
      'Mark the data: a 15 % attendance drop.',
      'Mark the claim: an increase in recording use.',
      'Identify the missing warrant: evidence that students who stopped attending actually watched recordings.',
    ],
    trap: 'Naming the data itself as the unsupported element because it is the most prominent sentence.',
    transfer: 'The same anatomy is used to read research abstracts critically and to audit management reporting.',
    hints: ['Which sentence could be verified with a number, and which requires evidence about behaviour?', 'The conclusion is the part that needs a supporting link.'],
  }),
  build({
    id: 'a15-05',
    domainId: 'D15',
    conceptIds: ['C15.quantifier'],
    stem: '“The survey shows that a majority of staff support the change.” Which of the following is a correct restatement of exactly the same claim?',
    options: [
      O('More than half of the surveyed staff support the change.', 'none', 'Correct: a majority means more than half of the group actually surveyed.'),
      O('All staff support the change.', 'scope_error', 'A majority is strictly weaker than unanimity.'),
      O('The most frequently given single answer was support.', 'definition_misuse', 'A plurality can be below 50 %; it is not the same as a majority.'),
      O('Staff prefer the change to any alternative that was measured.', 'definition_misuse', 'Preference relative to an alternative is a different claim from a majority in favour.'),
    ],
    correct: 0,
    difficulty: 2,
    testing: 'Precision in reading quantifiers used in everyday reporting.',
    matters: 'The exact numeric content of “majority” and who it refers to (the surveyed staff).',
    concept: 'Majority ≠ plurality ≠ unanimity.',
    why: 'Survey language encodes quantifier information; replacing one quantifier with another silently changes the claim.',
    steps: [
      'Translate “majority” into “more than half of those surveyed”.',
      'Compare each option with that translation.',
    ],
    trap: 'Reading “majority” as “most people think so”, which can be true with a plurality below half in multi-option settings.',
    transfer: 'Election reporting, market-share claims and survey summaries all depend on this vocabulary.',
    hints: ['Write the number that “majority” requires.', 'Which option preserves both the quantity and the population?'],
  }),
  build({
    id: 'a15-06',
    domainId: 'D15',
    conceptIds: ['C15.necessary'],
    stem:
      '“Our product passed all 40 safety tests. Therefore it is safe in every situation.” Which statement best describes the logical gap?',
    options: [
      O('Passing the tested conditions does not exclude untested conditions; the conclusion extends beyond the evidence.', 'none', 'Correct: the tests define the conditions covered, and the conclusion generalises to all situations.'),
      O('The tests are invalid because 40 is an arbitrary number.', 'irrelevant_data_used', 'The number of tests is not the logical problem.'),
      O('Safety cannot be established for products at all.', 'overprecision', 'Safety can be established within defined conditions; that is what standards do.'),
      O('The conclusion is correct because passing tests is necessary for safety.', 'sufficient_necessary_confusion', 'Passing tests may be necessary, but necessity of a condition does not make it sufficient for the wider claim.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Distinguishing evidence within a tested domain from a universal claim.',
    matters: 'The scope of the tests versus the scope of the conclusion.',
    concept: 'Inductive support is limited to the domain of the evidence.',
    why: 'Tests are samples of situations; a universal claim requires the universal domain to be covered, which a finite test series cannot do.',
    steps: [
      'State what the evidence covers: the 40 tested scenarios.',
      'State what the conclusion claims: all situations.',
      'Identify the gap between the two domains.',
    ],
    trap: 'Confusing “not proven unsafe” with “proven safe in all circumstances”.',
    transfer: 'The same reasoning is used in certification arguments, insurance exclusions and software testing claims.',
    hints: ['What exactly did the tests cover?', 'Which option distinguishes the tested domain from the claimed one?'],
  }),
];
