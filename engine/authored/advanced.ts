import { Q } from './helpers';
import type { Question } from '../types';
import type { AuthoredOption, AuthoredSpec } from './helpers';

/**
 * Level 6–7 items ("exam-style" and "advanced transfer").
 *
 * These are deliberately harder than the official samples — the official material warns that
 * the samples "do not necessarily reflect the difficulty level of the questions on the actual
 * test", so mastery work needs items above the sample tier. Each one requires combining at
 * least two concepts, interpreting a described situation rather than a stated formula, or
 * deciding which of several plausible methods applies.
 */

interface Spec {
  id: string;
  domainId: string;
  conceptIds: string[];
  stem: string;
  options: AuthoredOption[];
  correct: number;
  difficulty: 6 | 7;
  testing: string;
  matters: string;
  irrelevant?: string;
  concept: string;
  why: string;
  steps: string[];
  trap: string;
  transfer: string;
  hints: string[];
  reasoning: AuthoredSpec['reasoningType'];
  move: AuthoredSpec['cognitiveMove'];
  style?: AuthoredSpec['style'];
  tags?: string[];
}

function A(s: Spec): Question {
  return Q({
    id: s.id,
    domainId: s.domainId,
    conceptIds: s.conceptIds,
    label: 'OFFICIAL_SAMPLE',
    stem: s.stem,
    options: s.options as AuthoredSpec['options'],
    correct: s.correct as AuthoredSpec['correct'],
    difficulty: s.difficulty,
    reasoningType: s.reasoning,
    cognitiveMove: s.move,
    style: s.style ?? 'numeric_direct',
    hints: s.hints,
    tags: ['advanced', ...(s.tags ?? [])],
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

const o = (text: string, tag: AuthoredOption['errorTag'], why: string): AuthoredOption => ({ text, errorTag: tag, why });

export const ADVANCED_AUTHORED: Question[] = [
  /* ---------------- D02 — vectors, two concepts combined ---------------- */
  A({
    id: 'ad02-01',
    domainId: 'D02',
    conceptIds: ['C02.dot', 'C02.cross', 'C02.area'],
    stem:
      'Three forces act at a point: $\\vec{F}_1 = (2, 1)$, $\\vec{F}_2 = (-1, 3)$ and $\\vec{F}_3 = (1, -4)$ (in newtons). ' +
      'A student wants to know (i) the resultant force and (ii) the angle between $\\vec{F}_1$ and $\\vec{F}_2$, and then claims that because $\\vec{F}_1 \\cdot \\vec{F}_2 > 0$, the angle must be smaller than 90°. ' +
      'Which assessment is fully correct?',
    options: [
      o('The resultant is $(2, 0)$ N and the student’s conclusion about the angle is correct, because a positive scalar product means the angle is acute.', 'none', 'Correct: the components add to $(2+(-1)+1,\\; 1+3-4) = (2, 0)$, and $\\vec{F}_1\\cdot\\vec{F}_2 = 2(-1) + 1(3) = 1 > 0$ forces an acute angle.'),
      o('The resultant is $(2, 0)$ N, but the angle conclusion is wrong because a positive scalar product only shows that the vectors are not parallel.', 'sufficient_necessary_confusion', 'The sign of the scalar product is exactly the acute/obtuse test; “not parallel” is a different (weaker) statement.'),
      o('The resultant is $(4, 0)$ N and the angle conclusion is correct.', 'calculation_slip', 'The components were not added correctly: $-1 + 1 = 0$ contributes nothing, and $1 + 3 - 4 = 0$, giving $(2, 0)$ N, not $(4, 0)$ N.'),
      o('Neither part can be answered because forces must be combined with the vector product.', 'concept_confusion', 'Forces combine by vector addition; the vector product measures a perpendicular effect (torque), not a resultant force.'),
    ],
    correct: 0,
    difficulty: 6,
    testing: 'Multi-concept vector work: component-wise addition, the dot product as an angle test, and judging a student’s reasoning.',
    matters: 'The three component pairs, and the value of $\\vec{F}_1\\cdot\\vec{F}_2 = 1$.',
    concept: 'Vector addition for the resultant; the sign of the scalar product classifies the angle.',
    why: 'Addition is component-wise and independent per axis, while the scalar product combines both vectors into a single number whose sign carries the angle information.',
    steps: [
      '$\\vec{F}_1 + \\vec{F}_2 + \\vec{F}_3 = (2 - 1 + 1,\\; 1 + 3 - 4) = (2, 0)$ N',
      '$\\vec{F}_1\\cdot\\vec{F}_2 = (2)(-1) + (1)(3) = 1 > 0$',
      'Positive scalar product with non-zero lengths ⇒ $\\cos\\varphi > 0$ ⇒ the angle is acute.',
    ],
    trap: 'Treating the resultant magnitude as the sum of the component magnitudes, and confusing “acute angle” with “not parallel”.',
    transfer: 'The same two-step reading (add components, then test alignment) decides whether two forces reinforce each other or whether two measured indicators move together.',
    hints: ['Add the vectors first, component by component.', 'Then compute the dot product of the first two and interpret its sign.'],
    reasoning: 'multi_step_application',
    move: 'explain_or_critique',
  }),

  /* ---------------- D06 — hydrostatics, three laws combined ---------------- */
  A({
    id: 'ad06-01',
    domainId: 'D06',
    conceptIds: ['C06.depth', 'C06.trapped', 'C06.buoy', 'C05.gas'],
    stem:
      'An open-bottomed container floats in a sealed water tank with an air pocket of height 1.0 m inside it. The water surface in the tank is at atmospheric pressure. ' +
      'The container has a constant cross-section and the tank is now closed and pressurised with an additional 1 bar above the water surface. ' +
      'Which statement describes the result?',
    options: [
      o('The air pocket shrinks to about half its height and the container sinks, because the displaced water volume falls.', 'none', 'Correct: doubling the absolute pressure halves the trapped air volume, which reduces the displaced volume and therefore buoyancy.'),
      o('The air pocket shrinks, but the container rises because the pressurised water pushes upwards more strongly.', 'wrong_assumption', 'Pressure acts in all directions; the net effect on the container is decided by the *displaced volume*, which has become smaller.'),
      o('The air pocket keeps its size because the additional pressure acts equally inside and outside the container.', 'concept_confusion', 'The additional pressure is applied to the water, so the water presses harder on the trapped air; the pressure inside does not rise automatically.'),
      o('The container sinks without any change in the air pocket, because the water density increases.', 'wrong_assumption', 'Water is modelled as incompressible here, so its density does not change; the decisive change is the compression of the gas.'),
    ],
    correct: 0,
    difficulty: 7,
    testing: 'Combining the pressure law, isothermal gas compression and buoyancy in one scenario — the cross-concept demand of the hardest official items.',
    matters: 'The absolute pressure before (1 bar) and after (2 bar) pressurisation, and the fact that buoyancy follows the displaced volume.',
    irrelevant: 'The absolute depth of the container: the change is caused by the *additional* pressure, and the ratio of absolute pressures is what compresses the gas.',
    concept: 'p·V = constant for the trapped gas; buoyancy = weight of the displaced water.',
    why: 'Doubling the absolute pressure halves the gas volume; a smaller gas pocket means less displaced water, so the buoyant force drops below the weight and the container sinks until it reaches a new equilibrium.',
    steps: [
      'Absolute pressure before: ≈ 1 bar (atmosphere).',
      'After pressurisation: ≈ 2 bar ⇒ the trapped air volume halves, so the pocket height falls to about 0.5 m.',
      'Displaced water volume falls accordingly ⇒ buoyant force falls ⇒ the container sinks.',
    ],
    trap: 'Explaining the change through the water density (incompressible) or assuming the pocket keeps its size because “pressure acts everywhere”.',
    transfer: 'This is the reasoning behind ballast systems, Cartesian divers and why a closed diving bell cannot be raised by simply pumping water in.',
    hints: ['Compare absolute pressures, not gauge pressures.', 'Which volume can actually change — and what does buoyancy depend on?'],
    reasoning: 'multi_step_application',
    move: 'explain_or_critique',
  }),

  /* ---------------- D09 — EOQ with a discount decision ---------------- */
  A({
    id: 'ad09-01',
    domainId: 'D09',
    conceptIds: ['C09.qstar', 'C09.cost', 'C09.sensitivity'],
    stem:
      'A retailer needs $D = 3600$ units per year. Each order costs €50 and holding one unit for a year costs €4. The supplier offers a 2 % discount on the purchase price if orders are at least 600 units. ' +
      'The model-optimal quantity without the discount is 300 units. Which procedure is correct for deciding whether to order 600 units?',
    options: [
      o('Compare the total annual cost (ordering + holding + purchase price) at 300 units with the same total at 600 units, taking the discount only in the second case.', 'none', 'Correct: the discount changes the objective, so both candidate quantities must be evaluated with their full annual cost including the purchase price.'),
      o('Order 600 units, because the formula is minimised at the smallest quantity that receives the discount.', 'wrong_assumption', 'The formula minimises ordering and holding costs only; it cannot choose among price regimes.'),
      o('Order 300 units, because any deviation from $Q^*$ increases the ordering and holding cost.', 'model_assumption_error', 'It is true that ordering and holding costs rise, but the discount reduces the purchase cost — which may outweigh that increase. Comparing only the two cost terms ignores the discount.'),
      o('Compare the two quantities using only the purchase price, since ordering and holding costs are identical in both cases.', 'concept_confusion', 'The ordering and holding costs differ substantially between 300 and 600 units: at 600 units the ordering cost halves while the holding cost doubles.'),
    ],
    correct: 0,
    difficulty: 7,
    testing: 'Deciding how to handle a situation the standard model excludes, without discarding the model’s cost logic.',
    matters: 'The full annual cost structure including the purchase price, and the fact that the discount applies only in one regime.',
    concept: 'Total annual cost = purchase cost + ordering cost + holding cost; a price break creates two regimes that must be compared directly.',
    why: 'The model’s optimum is defined for a constant unit price. With a price break the decision becomes a comparison of two candidate solutions — the unconstrained optimum and the smallest quantity that earns the discount — evaluated on total cost.',
    steps: [
      'Candidate 1: $Q = 300$, no discount. Ordering cost = (3600/300)·50 = €600, holding cost = (300/2)·4 = €600, plus the full purchase price.',
      'Candidate 2: $Q = 600$, with discount. Ordering cost = (3600/600)·50 = €300, holding cost = (600/2)·4 = €1200, so €300 more in inventory costs than candidate 1.',
      'The discount is worthwhile if 2 % of the annual purchase value exceeds that €300 gap.',
    ],
    trap: 'Applying the square-root formula mechanically, or assuming that the discount always pays for the extra holding cost.',
    transfer: 'The same structure underlies bulk-buying decisions, subscription tiers and any quantity-dependent pricing.',
    hints: ['Write down the total annual cost as three components.', 'Evaluate both candidate quantities and compare — the discount is worth it only if it exceeds the extra inventory cost.'],
    reasoning: 'optimisation_reasoning',
    move: 'general_case',
    tags: ['extension', 'multi-concept'],
  }),

  /* ---------------- D11 — research design, level 6/7 ---------------- */
  A({
    id: 'ad11-01',
    domainId: 'D11',
    conceptIds: ['C11.linear', 'C11.document', 'C11.mixed', 'C11.general'],
    stem:
      'A ministry wants to know whether a new advisory service improves small firms’ survival, and also how firms actually use the advice. ' +
      'A proposal offers: (1) a survey of 2 000 firms with a matched comparison group, (2) interviews with 20 firms chosen to cover different usage patterns, and (3) a change to the survey questionnaire after wave 1 to capture a service element that was overlooked. ' +
      'The ministry asks which aspects of the proposal are methodologically sound. Which assessment is correct?',
    options: [
      o('All three parts are defensible if the questionnaire change is documented and its consequences for comparability are reported.', 'none', 'Correct: the design matches each question to an appropriate method, and a documented, disclosed change is permissible in a quantitative project.'),
      o('Only (1) and (2) are defensible; changing the questionnaire after wave 1 makes the whole study invalid.', 'overprecision', 'Changes are explicitly permitted; what matters is documentation and the resulting limitation on comparability — not invalidity of the entire study.'),
      o('Only (1) is defensible; the interviews cannot contribute to the question of how firms use advice.', 'scope_error', 'Interviewing a stratified sample of firms is precisely how usage patterns and mechanisms are investigated.'),
      o('Only (2) and (3) are defensible; a matched comparison group cannot support conclusions about improvement.', 'concept_confusion', 'A matched comparison group is a standard quasi-experimental device and is designed exactly to support conclusions about improvement.'),
    ],
    correct: 0,
    difficulty: 7,
    testing: 'Judging a complete mixed-method proposal against the rules of both traditions at once.',
    matters: 'Three separate judgements: matching each question to a method, the permissibility of a documented design change, and the comparability consequences of that change.',
    concept: 'Mixed designs are legitimate; quantitative projects permit documented changes whose consequences are reported.',
    why: 'Each element serves a different function — survey with comparison for the effect, interviews for usage, and a documented instrument change with disclosed limits — so none of them is invalidating by itself.',
    steps: [
      'Match question to method: “does it improve survival” ⇒ survey with comparison; “how do firms use advice” ⇒ interviews.',
      'Assess the change: permitted, but documentation and disclosure of comparability limits are required.',
      'Conclude that all three parts can be defended under the stated conditions.',
    ],
    trap: 'Reacting to the design change with a blanket rejection instead of assessing documentation and consequences — the exact distinction the official material draws.',
    transfer: 'This is the judgement applied in reviewing grant proposals, clinical protocol amendments and evaluation tenders.',
    hints: ['Judge each of the three parts separately before combining them.', 'Which rule does the official material give for modifications in a quantitative project?'],
    reasoning: 'evidence_evaluation',
    move: 'general_case',
  }),

  /* ---------------- D13 — model validity, level 6 ---------------- */
  A({
    id: 'ad13-01',
    domainId: 'D13',
    conceptIds: ['C13.model', 'C09.assume', 'C13.scaling'],
    stem:
      'A start-up scales a laboratory process by a factor of 1 000 in volume. In the laboratory, the reaction is limited by the rate at which the reactants are mixed. ' +
      'The team plans to keep the mixing power per litre constant. Which outcome should be expected?',
    options: [
      o('Mixing becomes insufficient: keeping power per litre constant does not keep mixing time constant, because the distances over which mixing must act grow with the length scale.', 'none', 'Correct: larger vessels need proportionally more mixing power, so a constant power per litre cannot maintain the same mixing behaviour.'),
      o('The process scales directly, because every intensive quantity (per litre) is preserved.', 'linearity_assumption', 'Preserving an intensive quantity is not sufficient: the transport distances and diffusion times scale with the size of the vessel.'),
      o('The reaction becomes faster, because a larger volume offers more contact area between the reactants.', 'concept_confusion', 'Contact area per litre does not increase with volume; if anything, transport limitations worsen.'),
      o('Nothing can be said, because scale-up depends on equipment quality alone.', 'wrong_assumption', 'Scale-up behaviour follows from the physics of transport and mixing, which can be reasoned about without knowing the manufacturer.'),
    ],
    correct: 0,
    difficulty: 6,
    testing: 'Applying scaling reasoning to a process rather than to a static shape.',
    matters: 'The length scale (×10 for a 1 000-fold volume) and the fact that transport processes depend on distance.',
    concept: 'Intensive quantities (per litre) do not capture transport behaviour; mixing and heat transfer depend on the length scale.',
    why: 'A process limited by transport has a rate that depends on the distance over which transport must occur, and that distance grows with the vessel size while a constant power per litre does not compensate for it.',
    steps: [
      'Volume ×1000 ⇒ length scale ×10 for each spatial dimension.',
      'Transport time scales roughly with the square of the length scale in diffusive regimes, and with the circulation pattern in stirred ones.',
      'Constant power per litre therefore cannot maintain the laboratory mixing regime ⇒ the reaction rate may fall.',
    ],
    trap: 'Assuming that matching an intensive quantity (per litre, per kg) guarantees identical behaviour across scales.',
    transfer: 'The same reasoning explains why laboratory catalysts, bioreactors and oven recipes cannot simply be multiplied.',
    hints: ['By what factor do the linear dimensions grow when the volume grows a thousandfold?', 'Does mixing act over a point or over a distance?'],
    reasoning: 'estimation_scaling',
    move: 'effect_of_change',
  }),

  /* ---------------- D12/D14 — evidence, level 6 ---------------- */
  A({
    id: 'ad12-01',
    domainId: 'D12',
    conceptIds: ['C12.confound', 'C14.conclude', 'C11.general'],
    stem:
      'Three studies examine the link between a training programme and subsequent promotion: (A) a survey showing that trained employees are promoted more often; (B) a matched-pair comparison of 200 employees over three years; (C) interviews with 15 promoted employees, 11 of whom had been trained. ' +
      'A report summarises: “The studies agree, so the programme works.” Which criticism of the summary is strongest?',
    options: [
      o('The studies have different designs and different inferential reach; agreement between them adds plausibility but does not remove the confounding in study A, and study C cannot support a prevalence claim at all.', 'none', 'Correct: agreement across designs is suggestive, but each study has its own limitation, and the summary presents them as if they were interchangeable.'),
      o('The summary is correct, because three independent studies cannot all be wrong.', 'overprecision', 'Independent studies can share the same bias; agreement is not proof.'),
      o('The summary is wrong because study C is qualitative.', 'overprecision', 'Qualitative evidence is legitimate for mechanism questions; it is not disqualifying per se.'),
      o('The summary should instead claim that the programme has no effect, because study A is confounded.', 'wrong_assumption', 'One confounded study does not establish the absence of an effect; it fails to establish its presence.'),
    ],
    correct: 0,
    difficulty: 6,
    testing: 'Weighting evidence of different designs rather than counting studies.',
    matters: 'What each design can and cannot show: A cannot exclude selection, B controls some of it, C describes a mechanism in promoted employees.',
    concept: 'Evidence quality differs by design; synthesis must respect each design’s inferential scope.',
    why: 'The conclusion requires the strength of the best available comparison, not the number of studies that point in the same direction.',
    steps: [
      'Classify each study: cross-sectional survey, matched comparison, case-based interviews.',
      'Identify the inferential limits of each.',
      'Conclude that agreement is supportive but the report’s flat claim overstates what the set establishes.',
    ],
    trap: 'Treating “three studies agree” as a stronger signal than “one well-designed comparison”.',
    transfer: 'This is the discipline of evidence synthesis in policy, medicine and management.',
    hints: ['What can each design establish on its own?', 'Does agreement across weak designs equal strength?'],
    reasoning: 'evidence_evaluation',
    move: 'explain_or_critique',
  }),

  /* ---------------- D15 — argument, level 6 ---------------- */
  A({
    id: 'ad15-01',
    domainId: 'D15',
    conceptIds: ['C15.necessary', 'C15.quantifier', 'C15.inference'],
    stem:
      '“Every firm in our sample that adopted the standard also reduced defects. Some firms that did not adopt it also reduced defects. Therefore adoption is neither sufficient nor necessary for reducing defects.” ' +
      'Which statement about this reasoning is correct?',
    options: [
      o('Both conclusions are justified by the two observations: the non-adopters who improved defeat sufficiency, and a conclusion about necessity would require seeing firms that improved only by adopting.', 'none', 'Correct: sufficiency fails because improvement occurred without adoption; necessity (adoption present in all improving firms) is not established — and neither is its absence claimed by these observations alone.'),
      o('The reasoning is invalid because the sample is not representative.', 'irrelevant_data_used', 'Representativeness affects generalisation, not the logical relations within the observed sample.'),
      o('The reasoning is invalid because necessity cannot be discussed without a control group.', 'definition_misuse', 'Necessity is a logical relation between conditions that can be examined in the data; a control group concerns causal inference, not the definition.'),
      o('The reasoning is valid, but it should have said that adoption is harmful.', 'wrong_assumption', 'Nothing in the observations supports harm; absence of necessity and sufficiency says nothing about negative effects.'),
    ],
    correct: 0,
    difficulty: 6,
    testing: 'Necessary/sufficient analysis applied to a compound pair of observations.',
    matters: 'Which observation bears on which logical relation.',
    concept: 'Sufficiency fails if the outcome occurs without the condition; necessity fails if the outcome occurs only with it… and both relations are logically independent of each other.',
    why: 'The two logical relations are tested by different counterexamples, so each must be evaluated separately rather than as a single verdict.',
    steps: [
      'Sufficiency (adoption ⇒ improvement): refuted by improving firms that did not adopt.',
      'Necessity (improvement ⇒ adoption): the observed improving non-adopters refute necessity as well — so the statement should say necessity is absent, and the argument’s own evidence establishes that.',
      'Check each option against this analysis rather than against intuitions about causality.',
    ],
    trap: 'Mixing up logical relations with causal strength, or dismissing the reasoning because the sample is small.',
    transfer: 'This analysis is used to read “necessary conditions” in standards, specifications and policy documents accurately.',
    hints: ['Write each claim as an implication and find its counterexample.', 'Which observation speaks to which direction of the implication?'],
    reasoning: 'logical_deduction',
    move: 'general_case',
  }),

  /* ---------------- D03/D01 — data + rate, level 6 ---------------- */
  A({
    id: 'ad03-01',
    domainId: 'D03',
    conceptIds: ['C03.gradient', 'C03.distort', 'C01.ratio'],
    stem:
      'A table gives a firm’s output and total cost for five plant sizes. Between the smallest and the largest plant, output rises by 60 % and total cost rises by 30 %. ' +
      'A manager concludes: “Our average cost per unit has fallen by 30 %.” Which assessment is correct?',
    options: [
      o('The claim is wrong: average cost changes by the factor of the cost change divided by the factor of the output change, i.e. by about 19 % — not by 30 %.', 'none', 'Correct: average cost = total cost / output, so relative changes divide: 1.30/1.60 ≈ 0.81, a fall of about 19 %.'),
      o('The claim is correct: both changes are percentages, so they can be subtracted.', 'linearity_assumption', 'Percentages combine multiplicatively; subtracting them confuses absolute and relative changes.'),
      o('The claim is wrong, because average cost cannot be computed from a table of totals.', 'wrong_assumption', 'Average cost is exactly total divided by output, so the table suffices.'),
      o('The claim is wrong: average cost has risen by about 30 %.', 'causal_direction_reversed', 'Costs grew more slowly than output, so average cost falls; the direction is reversed here.'),
    ],
    correct: 0,
    difficulty: 6,
    testing: 'Combining percentage reasoning with a ratio definition in a data-interpretation setting.',
    matters: 'The definition of average cost and the multiplicative combination of relative changes.',
    irrelevant: 'The absolute values in the table: only the relative changes matter for a claim about a ratio.',
    concept: 'For a ratio, relative changes divide (or equivalently, indices divide).',
    why: 'Average cost is a quotient, so its index is the quotient of the two indices.',
    steps: [
      'Cost index: 1.30. Output index: 1.60.',
      'Average-cost index: 1.30 / 1.60 = 0.8125.',
      'So average cost falls by about 18.75 %, i.e. roughly 19 %.',
    ],
    trap: 'Subtracting percentages (30 % − 60 %), which predicts a fall of 30 % — close enough to look right.',
    transfer: 'The same index arithmetic underlies productivity (output per hour), unit labour cost and emission intensity.',
    hints: ['Write average cost as a quotient of the two quantities in the table.', 'Relative changes of a quotient are obtained by dividing the two factors.'],
    reasoning: 'multi_step_application',
    move: 'interpret_representation',
  }),
];
