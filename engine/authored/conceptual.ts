import { Q } from './helpers';
import type { Question, Explanation, Difficulty, CognitiveMove, ReasoningType, ItemStyle, ConfidenceLabel, ErrorTag } from '../types';
import type { AuthoredOption, AuthoredSpec } from './helpers';

/**
 * Authored conceptual items for the quantitatively generated domains.
 *
 * Generators cover computation and parameter reasoning; these items cover what a generator
 * cannot fake: judging a proposed explanation, spotting the wrong step in someone else's
 * solution, reading a figure critically, and deciding what a model's answer does not tell
 * you. Official Exercise 2 Q4 and Exercise 1 Q2 are exactly this kind of item.
 */

interface Spec {
  id: string;
  domainId: string;
  conceptIds: string[];
  label: ConfidenceLabel;
  stem: string;
  options: AuthoredOption[];
  correct: number;
  difficulty: Difficulty;
  reasoningType?: ReasoningType;
  cognitiveMove?: CognitiveMove;
  style?: ItemStyle;
  hints: string[];
  testing: string;
  matters: string;
  irrelevant?: string;
  concept: string;
  why: string;
  steps: string[];
  trap: string;
  transfer: string;
  figure?: AuthoredSpec['figure'];
  tags?: string[];
}

function C(s: Spec): Question {
  return Q({
    id: s.id,
    domainId: s.domainId,
    conceptIds: s.conceptIds,
    label: s.label,
    stem: s.stem,
    options: s.options as AuthoredSpec['options'],
    correct: s.correct as AuthoredSpec['correct'],
    difficulty: s.difficulty,
    reasoningType: s.reasoningType ?? 'conceptual_discrimination',
    cognitiveMove: s.cognitiveMove ?? 'explain_or_critique',
    style: s.style ?? 'critique_reasoning',
    hints: s.hints,
    figure: s.figure,
    tags: s.tags,
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

const o = (text: string, tag: ErrorTag, why: string): AuthoredOption => ({ text, errorTag: tag, why });

/* ================================================================== */
/* D02 — vectors: critique and reading items                           */
/* ================================================================== */

export const VECTOR_CONCEPTUAL: Question[] = [
  C({
    id: 'ac02-01',
    domainId: 'D02',
    conceptIds: ['C02.dot', 'C02.magnitude'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'A student computes $\\vec{a}\\cdot\\vec{b} = 12$ for two vectors with $|\\vec{a}| = 3$ and $|\\vec{b}| = 5$ and concludes: “The angle between the vectors must be acute, and since $12 < 15$ the vectors are not parallel.” Which assessment of the two parts of this statement is correct?',
    options: [
      o('Both parts are justified: a positive scalar product means an acute angle, and a value below |a||b| excludes the parallel case.', 'none', 'Correct: both conclusions follow from the geometric meaning of the scalar product.'),
      o('The first part is wrong, because the angle can be obtuse even with a positive scalar product.', 'inequality_direction', 'The sign of the scalar product is exactly what distinguishes acute from obtuse; a positive value cannot correspond to an obtuse angle.'),
      o('The second part is wrong, because a value below |a||b| is compatible with parallel vectors.', 'concept_confusion', 'Parallel vectors give precisely $\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|$, so a smaller value rules that case out.'),
      o('Both parts are wrong, because the angle cannot be determined from the scalar product alone.', 'concept_confusion', 'The scalar product together with the two lengths determines the cosine of the angle completely.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Checking someone else’s chain of geometric conclusions from a scalar product value.',
    matters: 'The relation $\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\varphi$ and the sign and size of the given value.',
    concept: 'The scalar product encodes both the angle class (sign) and the degree of alignment (relative size).',
    why: 'Dividing by the product of the lengths gives $\\cos\\varphi = 12/15 = 0.8$, which is positive (acute) and less than 1 (not parallel).',
    steps: [
      '$\\cos\\varphi = 12/(3\\cdot 5) = 0.8$',
      'Positive ⇒ the angle is acute; between 0 and 1 ⇒ the vectors are neither parallel nor antiparallel.',
      'Both parts of the student’s statement therefore hold.',
    ],
    trap: 'Assuming a positive scalar product always implies a large angle, or confusing “not parallel” with “perpendicular”.',
    transfer: 'The same reasoning assesses whether two measured signals point in similar directions — the basis of correlation-style reasoning.',
    hints: ['Divide the scalar product by the two lengths.', 'The sign of the cosine tells you the angle class; its size tells you how aligned the vectors are.'],
  }),
  C({
    id: 'ac02-02',
    domainId: 'D02',
    conceptIds: ['C02.cross', 'C02.area'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'For two vectors it is found that $|\\vec{a}\\times\\vec{b}| = |\\vec{a}|\\,|\\vec{b}|$. Which conclusion is correct?',
    options: [
      o('The vectors are perpendicular; the parallelogram spanned has the maximum possible area for these lengths.', 'none', 'Correct: the cross-product magnitude equals the product of lengths exactly when $\\sin\\varphi = 1$, i.e. at 90°.'),
      o('The vectors are parallel.', 'concept_confusion', 'Parallel vectors give a cross product of zero, not a maximal one.'),
      o('The vectors have equal length.', 'irrelevant_data_used', 'Nothing in the relation forces the two lengths to be equal.'),
      o('The angle between the vectors is 45°, because sin 45° is about 0.7.', 'ratio_error', 'A sine of 1 corresponds to 90°; 45° would give a cross-product magnitude smaller than the product of lengths.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Reading an equality between a computed quantity and its upper bound.',
    matters: 'The factorisation $|\\vec{a}\\times\\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\varphi$ and the value $\\sin\\varphi = 1$.',
    concept: 'The cross-product magnitude is maximal for perpendicular vectors.',
    why: 'Since $\\sin\\varphi \\le 1$, equality with the product of the lengths forces $\\sin\\varphi = 1$, which happens only at $\\varphi = 90°$.',
    steps: [
      'Write $|\\vec{a}\\times\\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\varphi$.',
      'Equality with $|\\vec{a}||\\vec{b}|$ ⇒ $\\sin\\varphi = 1$ ⇒ $\\varphi = 90°$.',
      'Interpret: the spanned parallelogram has its maximum area.',
    ],
    trap: 'Reading the equality as a statement about lengths rather than about the angle.',
    transfer: 'Recognising when a quantity has reached its extreme value is a general pattern — efficiency at 100 %, maximum range at 45°, full correlation at ±1.',
    hints: ['Which factor in the cross-product relation can reach the value 1?', 'What angle produces that value?'],
  }),
  C({
    id: 'ac02-03',
    domainId: 'D02',
    conceptIds: ['C02.triple', 'C02.coplanar'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'A structure is described by three vectors with $\\vec{c} = \\vec{a} - 3\\vec{b}$. A student wants to compute the spanned volume with the triple product. Without computing, what can be said?',
    options: [
      o('The volume is zero and the computation can be skipped, because $\\vec{c}$ is built from $\\vec{a}$ and $\\vec{b}$.', 'none', 'Correct: any linear combination of two vectors lies in their plane, so the three vectors are coplanar.'),
      o('The volume equals three times the volume spanned by $\\vec{a}$ and $\\vec{b}$.', 'concept_confusion', 'Two vectors do not span a volume at all; a third independent direction would be needed.'),
      o('The volume is $3|\\vec{a}\\times\\vec{b}|$.', 'rule_misapplication', 'This is a scaled plane area, not a volume: the units of the result would be wrong.'),
      o('Nothing can be said without the components, because coplanarity depends on the numbers.', 'prerequisite_gap', 'Coplanarity here follows from the structure of the relation, not from particular values.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Using structure instead of computation to answer a geometry question — the reasoning the official coplanarity item rewards.',
    matters: 'The relation between the three vectors: one is a linear combination of the other two.',
    concept: 'Coplanarity ⇔ zero triple product; linear combinations stay in the plane.',
    why: 'The plane spanned by $\\vec{a}$ and $\\vec{b}$ contains every combination $\\alpha\\vec{a} + \\beta\\vec{b}$, and $\\vec{a} - 3\\vec{b}$ is such a combination.',
    steps: [
      'Recognise the structure: $\\vec{c}$ is a linear combination of $\\vec{a}$ and $\\vec{b}$.',
      'Conclude that all three vectors lie in one plane.',
      'Therefore the spanned volume is 0 for any components.',
    ],
    trap: 'Starting a computation because a formula is available; structural insight is faster and immune to arithmetic slips.',
    transfer: 'The same shortcut shows instantly why four points defined by two parameters are coplanar, and why a rank-deficient system has no unique solution.',
    hints: ['Where does $\\vec{c}$ “live” relative to the other two vectors?', 'What does the triple product measure?'],
  }),
  C({
    id: 'ac02-04',
    domainId: 'D02',
    conceptIds: ['C02.resulttype', 'C02.dot'],
    label: 'OFFICIAL_SAMPLE',
    stem: 'Which of the following expressions is mathematically meaningless (a type error)?',
    options: [
      o('$\\vec{a} + \\vec{b}\\cdot\\vec{c}$', 'none', 'Correct: the scalar product yields a scalar, and a scalar cannot be added to a vector — a type error.'),
      o('$\\vec{a}\\cdot(\\vec{b}\\times\\vec{c})$', 'concept_confusion', 'This is the triple product: a vector product inside, a scalar product outside — well defined.'),
      o('$|\\vec{a}\\times\\vec{b}| + 2$', 'concept_confusion', 'The magnitude is a number, so adding 2 is well defined.'),
      o('$(\\vec{a}\\times\\vec{b})\\cdot(\\vec{c}\\times\\vec{d})$', 'concept_confusion', 'Both products are vectors, so their scalar product is a number — well defined.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Type consistency in expressions mixing scalars and vectors.',
    matters: 'The type of each intermediate result.',
    concept: 'Scalar and vector results cannot be combined arbitrarily: addition requires matching types.',
    why: 'Checking types operation by operation catches errors that a purely numerical approach hides.',
    steps: [
      '$\\vec{b}\\cdot\\vec{c}$ is a scalar.',
      'Adding a scalar to the vector $\\vec{a}$ is undefined.',
      'The other three expressions combine matching types at every step.',
    ],
    trap: 'Trusting the familiar look of the symbols instead of checking what each operation returns.',
    transfer: 'The same discipline appears as dimensional analysis in physics and as type checking in programming.',
    hints: ['Determine the type of each sub-expression first.', 'Only one expression mixes a scalar into a vector addition.'],
  }),
];

/* ================================================================== */
/* D06 — hydrostatics: critique and interpretation items               */
/* ================================================================== */

export const HYDRO_CONCEPTUAL: Question[] = [
  C({
    id: 'ac06-01',
    domainId: 'D06',
    conceptIds: ['C06.depth', 'C06.buoy'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'A student explains why a large ship floats: “The ship is so heavy that it pushes the water down with great force; the water pushes back with an equally large force, so the ship floats.” Which criticism of this explanation is most accurate?',
    options: [
      o('The explanation appeals to the ship’s weight alone; floating depends on the weight of the *displaced water*, which is set by the hull volume.', 'none', 'Correct: the explanation never mentions the displaced volume, which is what makes a steel hull float while a steel block of the same mass sinks.'),
      o('The explanation is wrong because a heavy ship cannot float at all.', 'concept_confusion', 'Heavy ships do float; the issue is the reason given, not the conclusion.'),
      o('The explanation is correct but incomplete, because it omits the ship’s colour.', 'irrelevant_data_used', 'Colour is irrelevant to buoyancy; this option is a non-explanation.'),
      o('The explanation is correct, because forces of equal size always cancel.', 'concept_confusion', 'Equal and opposite forces on the same body can also produce equilibrium in a different configuration; “always cancel” is not a valid rule.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Evaluating an explanation’s *mechanism* rather than its conclusion — the item style of official Exercise 2 question 4.',
    matters: 'The quantity that decides floating: displaced volume, hence displaced water weight.',
    concept: 'Buoyancy equals the weight of the displaced fluid; hull shape determines the displaced volume.',
    why: 'Two objects of equal mass behave differently only if their displaced volumes differ, which is exactly what a partial explanation by weight leaves out.',
    steps: [
      'Identify what the explanation uses: weight and Newton’s third law.',
      'Add the missing quantity: the volume of water displaced.',
      'Conclude that the explanation cannot distinguish a floating hull from a sinking block.',
    ],
    trap: 'Accepting an explanation because its conclusion is correct, without checking whether it explains the phenomenon at all.',
    transfer: 'The same demand for mechanism appears in economics (“prices fell because demand rose — but by which channel?”) and in engineering failure analysis.',
    hints: ['Would the same words explain why a steel block of the same mass sinks?', 'Which quantity is missing from the explanation?'],
  }),
  C({
    id: 'ac06-02',
    domainId: 'D06',
    conceptIds: ['C06.depth', 'C06.atm'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'Two identical containers are filled to the same depth: one with water, one with a liquid of twice the density. The pressure at the bottom of the second container is compared with that of the first, but both containers stand in the same room. Which statement is correct?',
    options: [
      o('The depth-dependent part doubles, but the total pressure does not double, because the atmospheric pressure is the same in both cases.', 'none', 'Correct: only the ρgh term scales; the p₀ term is unchanged, so the total rises by less than a factor of two.'),
      o('The total pressure doubles exactly.', 'wrong_assumption', 'This ignores the additive atmospheric term, which does not scale with the liquid.'),
      o('The pressure is the same, because the depth is the same and pressure depends only on depth.', 'concept_confusion', 'Pressure at depth depends on the fluid’s density as well as on depth, which the official input states explicitly.'),
      o('The pressure is lower in the denser liquid, because a denser liquid settles more evenly.', 'inequality_direction', 'A denser liquid column weighs more, so the pressure at the bottom is higher.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Separating the scaled term from the additive constant in the pressure law.',
    matters: 'The structure $p = p_0 + \\rho g h$: one term constant, one proportional to density and depth.',
    concept: 'Density enters only the depth-dependent term.',
    why: 'Since atmosphere presses identically on both surfaces, the difference between the two pressures is confined to $\\rho g h$.',
    steps: [
      'Write $p_1 = p_0 + \\rho g h$ and $p_2 = p_0 + 2\\rho g h$.',
      'Compare: $p_2 = 2(p_1 - p_0) + p_0$, which is less than $2p_1$.',
      'Conclude that only the depth-dependent part doubles.',
    ],
    trap: 'Applying “density doubles” to the whole pressure, including the atmospheric part.',
    transfer: 'Any quantity that is a sum of a fixed and a proportional part (costs, wages, temperatures in different scales) behaves this way.',
    hints: ['Which term in the pressure law contains the density?', 'Does that term include the atmospheric pressure?'],
  }),
  C({
    id: 'ac06-03',
    domainId: 'D06',
    conceptIds: ['C06.trapped', 'C05.gas'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'A sealed, downward-open container floats in a water tank with an air pocket inside. Which change would cause it to sink, and why?',
    options: [
      o('Compressing the water surface, because the air pocket shrinks and the displaced water volume falls.', 'none', 'Correct: compressing the trapped gas reduces the displaced volume, hence the buoyant force.'),
      o('Adding salt to the water, because salt water is denser.', 'concept_confusion', 'Denser water increases buoyancy, so the object would rise rather than sink.'),
      o('Raising the whole tank, because the air pressure falls with altitude.', 'wrong_assumption', 'Raising the container moves the system without changing the relative pressures inside; the described mechanism does not apply.'),
      o('Cooling the water, because the container contracts.', 'irrelevant_data_used', 'The relevant compressible volume is the *air*, not the container; without data on the container’s thermal behaviour this cannot be the intended mechanism.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Locating the compressible element and tracing the effect to the buoyant force — the official bubble item’s transfer task.',
    matters: 'Which volume in the system can change, and how buoyant force depends on displaced volume.',
    concept: 'Buoyancy follows the displaced volume; a gas pocket is the only compressible part here.',
    why: 'Buoyant force is the weight of the displaced fluid. Compressing the bubble displaces less water, so the weight of the object is no longer balanced.',
    steps: [
      'Identify the compressible component: the air pocket.',
      'Pressure up ⇒ bubble volume down ⇒ displaced volume down.',
      'Buoyant force falls below weight ⇒ the container sinks.',
    ],
    trap: 'Looking for an effect through the water (density, temperature) instead of through the gas.',
    transfer: 'Ballast tanks, Cartesian divers and submarine depth control all use exactly this mechanism.',
    hints: ['Which part of the system can change its volume?', 'What does the buoyant force actually depend on?'],
    figure: { kind: 'tank_points', points: [{ label: 'air pocket', depth: 2 }], fluid: 'water', depthsScaleMax: 5 },
  }),
  C({
    id: 'ac06-04',
    domainId: 'D06',
    conceptIds: ['C06.buoy', 'C06.displaced'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'A block floats in water, then the same block is placed in oil of density 800 kg/m³. Which statement about the block is correct?',
    options: [
      o('The block floats deeper in the oil, because less water-equivalent mass is displaced per unit of submerged volume.', 'none', 'Correct: the submerged volume must be larger to displace the same mass in a less dense fluid.'),
      o('The block floats higher, because oil is lighter and supports it better.', 'inequality_direction', 'A less dense fluid supports less per unit volume, so the block must sink deeper.'),
      o('The submerged volume is the same, because the block’s weight is unchanged.', 'concept_confusion', 'The weight is unchanged, but the displaced mass must come from a larger volume of the less dense fluid.'),
      o('The block sinks to the bottom, because oil cannot support floating objects.', 'wrong_assumption', 'Bodies float in oil whenever their density is below that of the oil.'),
    ],
    correct: 0,
    difficulty: 4,
    testing: 'Reasoning about the density ratio without numbers.',
    matters: 'The floating condition in terms of mass: the same body mass requires a larger volume in the lighter fluid.',
    concept: 'Submerged fraction = ρ_body/ρ_fluid.',
    why: 'Since the required displaced mass is fixed by the body, a smaller fluid density demands a proportionally larger displaced volume.',
    steps: [
      'Floating requires ρ_fluid · V_sub = m_body.',
      'With ρ_fluid smaller, V_sub must be larger.',
      'Conclusion: the block sits deeper in the oil.',
    ],
    trap: 'Associating “lighter fluid” with “better support”, which reverses the relation.',
    transfer: 'The same ratio explains why a hydrometer reads differently in different liquids and why ships ride higher in the sea than in a river.',
    hints: ['Write the floating condition as mass balance.', 'What must change if the fluid density falls?'],
  }),
];

/* ================================================================== */
/* D09 — EOQ: critique and managerial reasoning                        */
/* ================================================================== */

export const EOQ_CONCEPTUAL: Question[] = [
  C({
    id: 'ac09-01',
    domainId: 'D09',
    conceptIds: ['C09.qstar', 'C09.cost'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'A warehouse manager says: “I doubled our order quantity, so our total inventory costs must have doubled too.” Which assessment is correct?',
    options: [
      o('Neither part of the total cost doubles: the ordering cost halves while the holding cost doubles, so the total rises far less than proportionally.', 'none', 'Correct: the two components move in opposite directions, so the sum grows much more slowly than the quantity.'),
      o('Both components double, so the manager is right.', 'model_assumption_error', 'The ordering cost is (D/Q)S, which falls when Q rises — it cannot double.'),
      o('The total cost actually falls, because fewer orders are placed.', 'concept_confusion', 'Holding costs rise faster than ordering costs fall whenever Q exceeds the optimum, so the total rises, not falls.'),
      o('The total cost is unaffected, because the effects cancel.', 'linearity_assumption', 'The effects do not cancel exactly except at the optimum; the cancellation is only approximate and the total still changes.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Applying the structure of the cost model to a managerial claim, without computing.',
    matters: 'The two cost terms and their opposite dependence on Q.',
    concept: 'Ordering cost ∝ 1/Q, holding cost ∝ Q; their sum has a minimum.',
    why: 'The two components move in opposite directions, so the total cost curve is flat near the optimum and grows much more slowly than Q.',
    steps: [
      'Ordering cost: doubling Q halves the number of orders ⇒ halves this term.',
      'Holding cost: doubling Q doubles the average stock ⇒ doubles this term.',
      'Total: 2.5 times one component versus 2 times at the optimum ⇒ a factor of only about 1.25.',
    ],
    trap: 'Assuming every cost scales linearly with the order quantity.',
    transfer: 'The same structure governs batch production, subscription plans and fixed-versus-variable cost decisions in general.',
    hints: ['Write both cost terms as functions of Q.', 'Do the two terms move in the same direction when Q changes?'],
  }),
  C({
    id: 'ac09-02',
    domainId: 'D09',
    conceptIds: ['C09.assume', 'C09.scaling'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'A firm sells a product whose demand is stable but whose supplier offers a 10 % discount on orders above 500 units, while the model-optimal quantity is 300 units. What does the standard model imply here?',
    options: [
      o('The model is not directly applicable, because it assumes there are no quantity discounts; the discount must be evaluated separately.', 'none', 'Correct: “no quantity discounts” is one of the model’s stated assumptions, so the discount is outside its scope.'),
      o('The model still gives the exact optimum, because it minimises the total cost.', 'model_assumption_error', 'The formula minimises only the ordering and holding terms under the stated assumptions; the purchase price is not part of that objective.'),
      o('The optimal quantity becomes 500 units, because the discount makes larger orders cheaper.', 'wrong_assumption', 'The discount may make 500 units attractive, but this has to be shown by comparing the total annual cost at both quantities against the discounted price — it does not follow from the model.'),
      o('The discount is irrelevant because demand is stable.', 'irrelevant_data_used', 'Whether demand is stable is unrelated to whether a price break changes the optimal quantity.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Recognising when a model falls outside its assumptions, and what that implies for its use.',
    matters: 'The assumption list, in particular “no quantity discounts”.',
    concept: 'A model answers the question it was built for; discounts change the objective.',
    why: 'The standard formula balances ordering and holding costs only. Once the unit price depends on quantity, the decision needs a comparison of the total annual cost at each candidate quantity, not a formula substitution.',
    steps: [
      'List the assumptions and find the violated one: quantity discounts are excluded.',
      'State what the model does and does not optimise.',
      'Decide the correct procedure: compare the total cost (including purchase price) at 300 and at 500 units.',
    ],
    trap: 'Assuming that a business situation is “close enough” to the model, or believing the model silently accounts for price breaks.',
    transfer: 'The same discipline is needed before applying any textbook model in a specific setting — check the assumptions first.',
    hints: ['Which assumption does a discount violate?', 'What does the model actually minimise?'],
  }),
  C({
    id: 'ac09-03',
    domainId: 'D09',
    conceptIds: ['C09.scaling', 'C09.value'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'A firm reclassifies a stored item as higher-value after a theft and insurance review. All sales and ordering parameters stay the same. What does the model predict, and why?',
    options: [
      o('A smaller optimal order quantity, because a higher unit value raises the annual holding cost per unit.', 'none', 'Correct: higher value ⇒ higher H (capital tied up, insurance, risk) ⇒ smaller Q*, since H is in the denominator.'),
      o('A larger optimal order quantity, because the firm must spread the risk over more units.', 'inequality_direction', 'Spreading risk is done by ordering more often, i.e. by smaller quantities, not larger ones.'),
      o('No change, because the unit value does not appear in the formula.', 'concept_confusion', 'The unit value enters indirectly through H, which is part of the formula.'),
      o('No change, because only physical storage costs matter.', 'model_assumption_error', 'The official input states explicitly that H covers the value of the stored goods as well as storage.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Tracing a business fact through an intermediate model parameter to a change in the optimum — the official parameter-reasoning style.',
    matters: 'The definition of H (storage plus capital and risk costs) and its position in the formula.',
    concept: 'H = f(storage, unit value); Q* ∝ 1/√H.',
    why: 'Higher-value stock costs more to hold per unit and per year, and the model responds by holding less of it at a time.',
    steps: [
      'Identify the affected parameter: H rises.',
      'Locate H in $Q^* = \\sqrt{2DS/H}$: the denominator.',
      'Conclusion: Q* falls.',
    ],
    trap: 'Treating the formula as containing only “operational” costs and missing the financial carrying cost of the goods.',
    transfer: 'High-value goods (electronics, pharmaceuticals) are ordered more frequently than cheap bulk goods for exactly this reason.',
    hints: ['Which component of holding cost depends on the item’s value?', 'Is that parameter in the numerator or the denominator?'],
  }),
  C({
    id: 'ac09-04',
    domainId: 'D09',
    conceptIds: ['C09.curve', 'C09.balance'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'On a cost-versus-quantity chart, the ordering cost curve and the holding cost curve cross at a quantity of 400 units. Which conclusion is correct, and under what condition?',
    options: [
      o('400 units is the optimum if the curves represent the annual totals of the two cost components of the model.', 'none', 'Correct: the total cost is minimised exactly where the two components are equal, provided the curves are the model’s annual ordering and holding costs.'),
      o('400 units is the optimum in every cost model, since equality of costs is always optimal.', 'overprecision', 'Equality of two cost curves is only the optimum for this trade-off structure, not as a general rule.'),
      o('400 units is where profit is maximised.', 'irrelevant_data_used', 'The chart shows costs, not revenues; profit maximisation requires a revenue curve as well.'),
      o('The crossing point is irrelevant, because only the total cost curve matters.', 'concept_confusion', 'The minimum of the total cost lies exactly at that crossing, so the crossing point is the key location on the chart.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Connecting a graphical feature (intersection) to an optimisation statement, with its condition.',
    matters: 'What the two curves represent and the fact that the total is their sum.',
    concept: 'At the minimum of a sum of a decreasing and an increasing term, the two terms are equal.',
    why: 'If the falling term were still larger than the rising one, increasing Q would reduce the total; equality is exactly the turning point.',
    steps: [
      'Write the total as the sum of the two curves.',
      'Argue with direction: below the crossing, ordering cost exceeds holding cost, so larger orders help.',
      'Conclude that the minimum lies at the crossing — for this cost structure.',
    ],
    trap: 'Generalising “equal costs ⇒ optimum” beyond models where that structure holds.',
    transfer: 'The same argument finds optimal maintenance intervals, replacement times and queue capacities.',
    hints: ['What happens to the total cost just below and just above the crossing?', 'Which single condition makes the conclusion valid?'],
  }),
];

/* ================================================================== */
/* Cross-domain reading & model items (D03, D10, D01)                  */
/* ================================================================== */

export const MISC_CONCEPTUAL: Question[] = [
  C({
    id: 'ac03-01',
    domainId: 'D03',
    conceptIds: ['C03.distort'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'Two charts show the same data: a bar chart with a vertical axis starting at 0, and another bar chart with the axis starting at 95. Which statement is correct?',
    options: [
      o('Both can be read correctly for values, but the second exaggerates the visible differences between categories.', 'none', 'Correct: the truncated axis compresses the reference, so small differences look large.'),
      o('The second chart is more informative because it shows the differences clearly.', 'graph_misread', 'Showing differences clearly by removing the reference distorts the comparison; the effect is visual exaggeration.'),
      o('The first chart is wrong because it wastes space.', 'irrelevant_data_used', 'Wasting space is a layout criticism, not a factual error.'),
      o('Neither chart can be used, because bar lengths must never be compared.', 'definition_misuse', 'Bar lengths are a legitimate encoding; the issue is the axis range.'),
    ],
    correct: 0,
    difficulty: 3,
    testing: 'Reading a chart critically, including the choice of axis range.',
    matters: 'Where the axis starts, because bar length encodes magnitude relative to a reference.',
    concept: 'Truncated axes exaggerate differences; the encoded quantity is a proportion of the axis range.',
    why: 'When the axis begins at 95, a difference of 2 units occupies a large fraction of the plotted height although it is tiny relative to the values.',
    steps: [
      'Identify the axis ranges of both charts.',
      'Ask what a reader perceives: the ratio of bar lengths within the plotted frame.',
      'Conclude that only the zero-based chart communicates magnitude faithfully.',
    ],
    trap: 'Preferring the more dramatic chart, or dismissing axis truncation as a mere style choice.',
    transfer: 'The same check applies to share prices, temperature series and any index plotted over a short range.',
    hints: ['What does the length of a bar represent in each chart?', 'Which chart would make a 2 % difference look dramatic?'],
  }),
  C({
    id: 'ac03-02',
    domainId: 'D03',
    conceptIds: ['C03.read', 'C03.gradient'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A table reports total operating cost and total output for each of five machine settings. A student wants to know the *additional* cost of producing one more unit at the highest output level. Which quantity must be computed?',
    options: [
      o('The change in cost between the two highest-output settings divided by the change in output between them.', 'none', 'Correct: the marginal cost is a ratio of differences, not a level.'),
      o('The total cost at the highest output divided by the output.', 'rule_misapplication', 'This is the average cost, which includes the fixed-cost component and is not the cost of one additional unit.'),
      o('The difference between the highest and lowest total cost.', 'question_misread', 'This is a total difference across the whole range, not a marginal quantity.'),
      o('The ratio of the highest cost to the lowest cost.', 'ratio_error', 'A ratio of costs carries no information about the additional unit.'),
    ],
    correct: 0,
    difficulty: 3,
    testing: 'Distinguishing a marginal (additional) quantity from an average or a total.',
    matters: 'The two adjacent data points at the relevant end of the table.',
    concept: 'Marginal quantities are differences of totals over differences of inputs.',
    why: 'The question asks for the cost of one more unit *at a specific operating level*, which is a local rate of change, not a global average.',
    steps: [
      'Identify the requested quantity: Δcost/Δoutput near the highest output.',
      'Select the two appropriate rows.',
      'Note that the other options are levels or unrelated ratios.',
    ],
    trap: 'Reporting average cost because it is easy to compute from the table.',
    transfer: 'Marginal reasoning governs pricing decisions, tax rates and capacity planning — “what does one more unit change?”.',
    hints: ['Which word in the question indicates a rate rather than a level?', 'How do you obtain a rate from a table of totals?'],
  }),
  C({
    id: 'ac10-01',
    domainId: 'D10',
    conceptIds: ['C10.marginal', 'C10.breakeven'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A firm is operating above its break-even point. A customer offers to buy additional units at a price below the normal price but above the variable cost per unit. Which reasoning is correct?',
    options: [
      o('Accepting adds a positive contribution margin, so profit rises, provided the fixed costs and other sales are unaffected.', 'none', 'Correct: above break-even, the fixed costs are already covered, so the additional contribution is profit.'),
      o('Accepting is unprofitable, because the price is below the normal price.', 'concept_confusion', 'The relevant comparison is with the variable cost, not with the list price, once the fixed costs are covered.'),
      o('Accepting is unprofitable, because the fixed costs must be recalculated per unit for the new volume.', 'rule_misapplication', 'Fixed costs do not change with volume in this model; spreading them over more units changes the average, not the total.'),
      o('Accepting is profitable only if the special price exceeds the average cost.', 'wrong_assumption', 'Requiring the price to exceed average cost would reject profitable additional business that contributes to fixed costs.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Applying marginal reasoning when fixed costs are already covered.',
    matters: 'The distinction between average cost and contribution margin, and whether fixed costs are sunk for this decision.',
    concept: 'Short-run decisions compare price with variable cost, because fixed costs are unaffected.',
    why: 'Any price above variable cost adds to the total contribution that must cover fixed costs and profit, so it improves the result.',
    steps: [
      'Identify the decision-relevant costs: only variable costs change with the additional volume.',
      'Check the price against the variable cost: price > variable cost.',
      'Conclude that the additional contribution is positive and profit rises.',
    ],
    trap: 'Using average cost (which includes fixed costs) as the hurdle when the fixed costs are already covered — a systematic under-selling error.',
    transfer: 'The same logic justifies off-peak pricing, filling otherwise empty capacity and accepting marginal exports.',
    hints: ['Which costs actually change if the order is accepted?', 'What is the contribution per unit of the special order?'],
  }),
  C({
    id: 'ac01-01',
    domainId: 'D01',
    conceptIds: ['C01.ratio', 'C01.estimate'],
    label: 'PREREQUISITE',
    stem:
      'A report states: “Energy use per unit of output fell by 20 %, while total energy use rose by 5 %.” What must have happened to output?',
    options: [
      o('Output rose by about 31 %, because the energy intensity fell while total energy rose.', 'none', 'Correct: total energy = intensity × output, so output changes by the ratio 1.05/0.8 ≈ 1.31.'),
      o('Output rose by 25 %, i.e. 5 % plus 20 %.', 'linearity_assumption', 'Percentage changes combine multiplicatively, not additively.'),
      o('Output fell by about 15 %, because energy per unit fell.', 'causal_direction_reversed', 'Falling intensity with rising total energy implies more output, not less.'),
      o('Output cannot be determined from these two figures.', 'wrong_assumption', 'Two of the three quantities in the identity total = intensity × output are given, so the third follows.'),
    ],
    correct: 0,
    difficulty: 5,
    testing: 'Combining percentage changes through a multiplicative identity rather than adding them.',
    matters: 'The relation total = intensity × output and the direction of each change.',
    concept: 'Ratios and percentages combine multiplicatively; the identity connects the three quantities.',
    why: 'If total energy is intensity times output, then output = total/intensity, so its relative change is the quotient of the two relative changes.',
    steps: [
      'Write the identity: $E = I \\cdot Q$.',
      'Relative changes: $E$ becomes 1.05 of its old value, $I$ becomes 0.8.',
      '$Q$ therefore becomes $1.05/0.8 = 1.3125$ ⇒ about +31 %.',
    ],
    trap: 'Adding or subtracting percentages, or applying the intensity change in the wrong direction.',
    transfer: 'The same multiplicative bookkeeping underlies productivity statistics, emissions intensity debates and price/volume/margin decomposition.',
    hints: ['Write the identity linking total, intensity and output.', 'Percentage changes combine by multiplying the factors, not by adding.'],
  }),
  C({
    id: 'ac01-02',
    domainId: 'D01',
    conceptIds: ['C01.estimate'],
    label: 'PREREQUISITE',
    stem:
      'A student calculates a pressure and obtains 2 000 000 bar. Which response is most appropriate?',
    options: [
      o('Re-examine the calculation for a unit or factor error: 2 million bar is unphysical for any ordinary setting and suggests the pattern “Pa read as bar”.', 'none', 'Correct: a sanity check on the magnitude should trigger a review of the units.'),
      o('Report the value, because precise calculation is more reliable than intuition.', 'overprecision', 'Precision in the arithmetic says nothing about correctness of the units; the magnitude is decisive.'),
      o('Round the value to 2 × 10⁶ bar and report it as an estimate.', 'unit_error', 'Rounding preserves the wrong unit.'),
      o('Assume the setting must be extraordinary, such as the interior of a planet.', 'wrong_assumption', 'Inventing an extraordinary setting to rescue an implausible number is the opposite of a sanity check.'),
    ],
    correct: 0,
    difficulty: 3,
    testing: 'Using an order-of-magnitude sanity check to catch unit errors.',
    matters: 'A reference magnitude: 1 bar corresponds to about 10 m of water, and the deepest ocean gives about 1 000 bar.',
    concept: 'Order-of-magnitude checks as a routine verification step.',
    why: 'Physical quantities have familiar ranges; a value a thousand times outside its range almost always indicates a unit slip (Pa vs. bar is exactly 10⁵).',
    steps: [
      'Recall a reference value: ocean trenches reach about 10³ bar.',
      'Compare: 2 × 10⁶ bar is three orders of magnitude beyond the extreme reference.',
      'Conclude that a unit error (Pa reported as bar) is the likely cause.',
    ],
    trap: 'Trusting arithmetic and skipping the plausibility check, which is the only defence in a no-notes exam.',
    transfer: 'The same reflex catches errors in energy bills, dosages, budgets and any figure quoted without context.',
    hints: ['Is there a familiar reference value for this quantity?', 'Which unit confusion would produce exactly this error?'],
  }),
];
