/**
 * Coverage items.
 *
 * Written because a lesson practice step must be able to draw *something* for every concept it
 * teaches: the concept-coverage report (`docs/03_VALIDATION_REPORT.md`, section "Concept coverage")
 * showed two concepts with no items at all and a set of concepts with too few to run a five-item
 * practice pool. Every item here belongs to one of those concepts, and each concept gets one item at
 * the level a lesson uses for guided practice and one at the level it uses for transfer.
 *
 * These are authored rather than generated because the concepts are about judgement — finding the
 * first wrong step in someone else's procedure, separating a nominal from a real quantity, knowing
 * what replication does and does not fix — and no parameter can generate that.
 */

import { Q } from './helpers';
import type { CognitiveMove, ConfidenceLabel, Difficulty, ErrorTag, ItemStyle, Question, ReasoningType } from '../types';
import type { AuthoredOption, AuthoredSpec } from './helpers';

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

const o = (text: string, errorTag: ErrorTag, why: string): AuthoredOption => ({ text, errorTag, why });

export const COVERAGE_AUTHORED: Question[] = [
  /* ---------------------------------------------------------------- C08.debug */
  C({
    id: 'acov-debug-01',
    domainId: 'D08',
    conceptIds: ['C08.debug'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A student computes the average of the numbers 4, 8, 12, 16 as follows: "Step 1: 4 + 8 + 12 + 16 = 40. Step 2: there are four numbers. Step 3: 40 ÷ 4 = 10. Step 4: I check by taking 10 · 4 = 40. So the average is 10." Where is the first error?',
    options: [
      o('There is no error — the result and the check are both correct.', 'none', 'Correct: the sum is 40, the count is 4, the quotient is 10, and the check reproduces the sum.'),
      o('Step 1: the sum should be 30.', 'calculation_slip', 'The four numbers do add to 40; adding them correctly is what makes the later steps meaningful.'),
      o('Step 3: the sum should be divided by the number of *different* values, which is 3.', 'rule_misapplication', 'The divisor is how many values enter the sum — four — not how many distinct values appear.'),
      o('Step 4: a check must use a different operation, so it proves nothing.', 'concept_confusion', 'Running the inverse operation (multiplying back) is exactly the right check; it is a different operation.'),
    ],
    correct: 0,
    difficulty: 3,
    reasoningType: 'conceptual_discrimination',
    cognitiveMove: 'explain_or_critique',
    hints: ['Follow the procedure step by step yourself before judging it.', 'A check earns its name by recovering the input through the inverse operation.'],
    testing: 'Auditing a short procedure for a first divergence, rather than accepting or rejecting it as a whole.',
    matters: 'The four values, the count, and the direction of the inverse check.',
    concept: 'Debugging a procedure: verify each step against the definition it implements, then verify the result with an independent direction.',
    why: 'An error can only be localised if the steps are checked in order; a correct result with a wrong step, or a wrong result with correct steps, call for different responses.',
    steps: ['Sum: 4 + 8 + 12 + 16 = 40 ✓', 'Count: four values ✓', 'Quotient: 40 ÷ 4 = 10 ✓', 'Check: 10 · 4 = 40 ✓ — no divergence, so no error to find'],
    trap: 'Inventing an error because a step "looks" wrong, or "fixing" a correct method with a rule from a different situation.',
    transfer: 'The same audit is how you check a spreadsheet formula, a unit conversion chain or a line of evidence in a report: localise, then verify.',
  }),
  C({
    id: 'acov-debug-02',
    domainId: 'D08',
    conceptIds: ['C08.debug'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A quality script is supposed to flag every item whose measured length exceeds 25 mm. The rule is written as: `flag = length > 25`. A measured length of exactly 25 mm is not flagged and the tolerance table says 25 mm is still acceptable. Later, someone changes the rule to `flag = length >= 25`. What does that change do?',
    options: [
      o('It starts flagging acceptable items: the boundary value 25 is now rejected although the tolerance allows it.', 'none', 'Correct: the comparison operator decides whether the boundary belongs to the accepted set.'),
      o('Nothing — > and >= differ only in syntax.', 'concept_confusion', 'The two operators differ exactly at the boundary, which is where the tolerance specification is enforced.'),
      o('It stops flagging items above 25 mm.', 'inequality_direction', 'The direction is unchanged; only the boundary moved, so items above 25 mm are flagged in both versions.'),
      o('It changes the unit of the comparison.', 'unit_error', 'No unit is touched; the change is in the comparison, not in the quantity.'),
    ],
    correct: 0,
    difficulty: 4,
    reasoningType: 'parameter_reasoning',
    cognitiveMove: 'effect_of_change',
    hints: ['Ask what happens exactly at 25 mm under each version of the rule.', 'Specification language ("exceeds 25 mm") fixes which boundary is allowed.'],
    testing: 'The effect of a boundary condition in a rule, evaluated against a written specification.',
    matters: 'The tolerance table (25 mm is acceptable) and the two comparison operators.',
    concept: 'Strict and non-strict inequalities treat the boundary differently; a specification word ("exceeds") decides which is required.',
    why: 'A program is a literal implementation of the words around it: "exceeds 25 mm" excludes 25 mm, so `>` is right and `>=` silently rejects acceptable work.',
    steps: ['Tolerance: 25 mm is acceptable ⇒ 25 must NOT be flagged', '`length > 25` ⇒ 25 is not flagged ✓', '`length >= 25` ⇒ 25 is flagged ✗ — the boundary is now rejected'],
    trap: 'Treating > and >= as interchangeable, which only shows up at the boundary — exactly where tolerances live.',
    transfer: 'The same boundary reasoning decides who passes a cut-off, when an alarm fires, and whether a limit is inclusive in any technical specification.',
  }),

  /* ---------------------------------------------------------------- C10.real */
  C({
    id: 'acov-real-01',
    domainId: 'D10',
    conceptIds: ['C10.real', 'C10.marginal'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A workshop invoices a job for 12 000 €. Of that amount, 1 500 € is value-added tax that must be passed on to the tax office. The workshop also paid 4 000 € for materials. The owner says: "I earned 12 000 − 4 000 = 8 000 € on this job." Which correction is right?',
    options: [
      o('The tax is not income: the real amount earned before materials is 10 500 €, and after materials 6 500 €.', 'none', 'Correct: the nominal invoice total includes money that never belongs to the business.'),
      o('The owner is right; the invoice total is what the business earned.', 'concept_confusion', 'Money collected on behalf of the tax office is not revenue from the work.'),
      o('The owner should also subtract the tax from the materials cost.', 'rule_misapplication', 'The materials figure is a cost of the job, not a tax-bearing amount to be adjusted twice.'),
      o('The owner should add the tax back to the profit, since it is recoverable.', 'causal_direction_reversed', 'Adding a pass-through amount back overstates the result by exactly the amount that was never earned.'),
    ],
    correct: 0,
    difficulty: 2,
    reasoningType: 'conceptual_discrimination',
    cognitiveMove: 'interpret_representation',
    hints: ['Separate the money the business keeps from the money it merely collects.', 'Real quantities are what remains after pass-through items are removed.'],
    testing: 'Separating a nominal (invoiced) amount from the real amount the business earned.',
    matters: 'The invoice total, the tax portion and the material cost.',
    irrelevant: 'The tax rate itself — it is not needed once the tax amount is given.',
    concept: 'Nominal vs. real quantities: a nominal total can include items that pass straight through and never become revenue.',
    why: 'Profit is computed from the resources the business controls, not from the size of the invoice; pass-through tax inflates the invoice without adding value.',
    steps: ['Invoice 12 000 € includes 1 500 € tax ⇒ revenue from the job = 10 500 €', 'Subtract material cost: 10 500 − 4 000 = 6 500 €', 'The owner overstated profit by 1 500 €'],
    trap: 'Reading the invoice total as earnings, which is the most common revenue error in small businesses.',
    transfer: 'The same distinction governs gross vs. net wages, list prices vs. transaction prices and every "revenue" figure quoted in a sales meeting.',
  }),
  C({
    id: 'acov-real-02',
    domainId: 'D10',
    conceptIds: ['C10.real'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A monthly budget is written in nominal terms and inflation is 3 % per year. A department holds its nominal budget constant for three years. What happens to what it can actually buy, and why?',
    options: [
      o('It buys progressively less: the same nominal amount loses about 3 % of its purchasing power each year.', 'none', 'Correct: real purchasing power falls because prices rise while the allowance does not.'),
      o('Nothing changes; a constant budget means constant resources.', 'concept_confusion', 'A constant number of currency units is not a constant quantity of goods once prices move.'),
      o('It buys more, because holding money is safe during inflation.', 'causal_direction_reversed', 'Holding a nominal amount during inflation loses purchasing power; it never gains it.'),
      o('It is unaffected for three years, and then loses 3 % at once.', 'concept_confusion', 'Purchasing power falls continuously as prices rise; there is no single moment at which the erosion happens.'),
    ],
    correct: 0,
    difficulty: 4,
    reasoningType: 'causal_reasoning',
    cognitiveMove: 'effect_of_change',
    hints: ['Ask what the same number of euro buys after prices have risen.', 'A price level that grows each year erodes the same nominal amount year after year.'],
    testing: 'Reasoning about a nominal quantity whose real value changes because the price level moves.',
    matters: 'The fixed nominal budget and the annual inflation rate.',
    concept: 'Real value = nominal value ÷ price level; with a fixed nominal amount, real value falls as the price level rises.',
    why: 'Budgets buy goods, not numbers: if the price level rises by 3 % a year, the same amount of money commands fewer goods each year.',
    steps: ['Year 0: purchasing power = 100 %', 'Year 1: 100 / 1.03 ≈ 97 %', 'Year 2: ≈ 94 %', 'Year 3: ≈ 91 % — about 9 % lost in total, compounding each year'],
    trap: 'Treating a nominal figure as a real one, or adding percentage changes instead of compounding them.',
    transfer: 'The same reasoning applies to salaries in high-inflation economies, to fixed research grants and to any long contract signed in nominal currency.',
  }),

  /* ---------------------------------------------------------------- C14.replicate */
  C({
    id: 'acov-replicate-01',
    domainId: 'D14',
    conceptIds: ['C14.replicate'],
    label: 'OFFICIAL_FIELD_LIST',
    stem:
      'A single experiment finds an effect of 12 % with a 95 % confidence interval of 3 % to 21 %. The team decides to repeat the experiment exactly once more and reports only the second run. What does the repetition accomplish?',
    options: [
      o('It tests whether the result is stable, but only if the repeated result is reported alongside the first — reporting one run alone adds nothing.', 'none', 'Correct: replication is evidence when both attempts are visible.'),
      o('It doubles the precision, because two measurements always halve the uncertainty.', 'linearity_assumption', 'Precision improves only when the results are combined; a single reported run has the same uncertainty as before.'),
      o('It makes the result conclusive, since an experiment that works twice cannot be chance.', 'sufficient_necessary_confusion', 'Repeating the same design twice cannot rule out a systematic error that both runs share.'),
      o('It removes the need for a control group in the second run.', 'wrong_assumption', 'Replication does not replace a control; the comparison remains the source of the effect estimate.'),
    ],
    correct: 0,
    difficulty: 2,
    reasoningType: 'evidence_evaluation',
    cognitiveMove: 'explain_or_critique',
    hints: ['Ask what a reader can conclude from one reported run versus two reported runs.', 'Repetition addresses chance, not shared flaws.'],
    testing: 'What replication does and does not establish about a result.',
    matters: 'The effect size, its interval, and whether both runs are reported.',
    concept: 'Replication tests stability against chance; it cannot remove a systematic error shared by identical runs.',
    why: 'A result is more credible when independent repetitions agree, but only if the reader can see that they agree — and even then, both may share the same flaw.',
    steps: ['One run: effect 12 %, interval 3–21 %', 'A second, identical run tests only random variation', 'Reporting just the second run discards the replication it was meant to provide'],
    trap: 'Equating "repeated" with "confirmed", or improving precision on paper by re-running and reporting the better run.',
    transfer: 'The same reasoning evaluates clinical replications, A/B test reruns and any situation where a second measurement is quoted as if it were independent evidence.',
  }),
  C({
    id: 'acov-replicate-02',
    domainId: 'D14',
    conceptIds: ['C14.replicate', 'C14.bias'],
    label: 'OFFICIAL_FIELD_LIST',
    stem:
      'Two laboratories run the same measurement protocol on the same samples. Lab A reports 4.8 ± 0.2 units, Lab B reports 5.6 ± 0.2 units. Both intervals are narrow. What is the most useful conclusion?',
    options: [
      o('The methods are precise within each laboratory but they do not agree with each other, so the protocol is not yet reproducible across sites.', 'none', 'Correct: small individual intervals plus a large between-lab gap points to a systematic, site-specific difference.'),
      o('The true value is 5.2, the average of the two laboratories.', 'concept_confusion', 'Averaging two disagreeing measurements hides the disagreement instead of explaining it.'),
      o('Lab B is wrong, because its value is higher.', 'causal_direction_reversed', 'There is no information that makes one laboratory authoritative; the gap is what needs explaining.'),
      o('The measurement is unreliable, so the whole study should be abandoned.', 'overprecision', 'A disagreement between sites is a call for calibration, not for discarding the question.'),
    ],
    correct: 0,
    difficulty: 4,
    reasoningType: 'evidence_evaluation',
    cognitiveMove: 'explain_or_critique',
    hints: ['Compare the *within* laboratory spread with the *between* laboratory difference.', 'Narrow intervals that do not overlap mean the difference is not random noise.'],
    testing: 'Distinguishing repeatability within a site from reproducibility across sites.',
    matters: 'The two intervals and the distance between the two reported values.',
    concept: 'Repeatability (same setup, repeated) versus reproducibility (different setups, same protocol).',
    why: 'A method can be internally consistent and still give different answers elsewhere; that gap is evidence about the method, not about the samples.',
    steps: ['Intervals: 4.8 ± 0.2 and 5.6 ± 0.2 — they do not overlap', 'So the difference is larger than the stated uncertainty', 'Systematic, site-specific causes (calibration, procedure, equipment) become the prime suspects'],
    trap: 'Averaging disagreeing results, or assuming the tighter interval must be the correct one.',
    transfer: 'The same distinction is used when two suppliers measure the same part, when two hospitals report different complication rates, and in any multi-site study.',
  }),

  /* ---------------------------------------------------------------- C15.claim */
  C({
    id: 'acov-claim-01',
    domainId: 'D15',
    conceptIds: ['C15.claim', 'C15.quantifier'],
    label: 'OFFICIAL_FIELD_LIST',
    stem:
      'A report states: "Customers who used the new packaging reported fewer transport damages." Which claim is actually supported by this sentence alone?',
    options: [
      o('A difference was observed among those who used the new packaging — nothing yet about the size, the cause or the general population.', 'none', 'Correct: the sentence reports an observation; magnitude, cause and scope are not stated.'),
      o('The new packaging reduces transport damages for all customers.', 'scope_error', 'The sentence names no population beyond "customers who used it", and no comparison group.'),
      o('The packaging is the cause of the reduction.', 'correlation_causation', 'An observation of difference is not evidence of a cause, especially without a control group.'),
      o('The reduction is small, so the packaging is not worth using.', 'overprecision', 'No magnitude is given, so no judgement about practical importance can be made from the sentence.'),
    ],
    correct: 0,
    difficulty: 2,
    reasoningType: 'evidence_evaluation',
    cognitiveMove: 'general_case',
    hints: ['Ask exactly what a reader learns from the words, not what the author implies.', 'Words like "fewer" describe a comparison, not a cause or a magnitude.'],
    testing: 'Separating the claim a sentence supports from the claims it merely suggests.',
    matters: 'Who was observed, and what was compared.',
    concept: 'A claim needs a stated scope (who), a comparison and a magnitude before it can support a general conclusion.',
    why: 'Reading the weakest claim that the evidence supports is what keeps a report honest; every stronger reading needs extra evidence.',
    steps: ['Observed: customers who used the new packaging', 'Reported: fewer transport damages (a comparison, no numbers)', 'Unsupported so far: magnitude, cause, and generalisation to other customers'],
    trap: 'Upgrading an observation ("fewer") into a causal, universal or quantified claim while reading.',
    transfer: 'The same discipline applies to advertising, news headlines and management summaries — find the weakest defensible claim first.',
  }),
  C({
    id: 'acov-claim-02',
    domainId: 'D15',
    conceptIds: ['C15.claim', 'C15.inference'],
    label: 'OFFICIAL_FIELD_LIST',
    stem:
      'Two studies measure the same relationship. Study 1 (n = 40) finds +0.45 and reports it as "not significant". Study 2 (n = 4 000) finds +0.12 and reports it as "highly significant". A colleague concludes: "The effect is smaller than we thought." What is the sound critique?',
    options: [
      o('Significance is partly a matter of sample size: a smaller estimate can be significant in a large sample, and a bigger estimate can fail to reach significance in a small one — the two numbers are not directly comparable this way.', 'none', 'Correct: significance combines effect size with sample size, so the two figures do not rank the effects.'),
      o('The larger study must be right, so the effect really is +0.12.', 'concept_confusion', 'The larger study is more precise, but the two designs may still differ in population or measurement.'),
      o('The smaller study must be right, because its effect is larger.', 'causal_direction_reversed', 'A larger estimate is not more accurate; in a small sample it is simply more uncertain.'),
      o('The small study should simply be ignored, so the effect is about +0.12.', 'scope_error', 'Discarding the study with the larger estimate because it was underpowered removes evidence in one direction — exactly the bias the colleague claims to avoid.'),
    ],
    correct: 0,
    difficulty: 5,
    reasoningType: 'evidence_evaluation',
    cognitiveMove: 'general_case',
    hints: ['Ask what "significant" is a statement about — the estimate, or the estimate relative to its uncertainty?', 'A small sample makes a large estimate imprecise.'],
    testing: 'Reading a significance statement as a joint statement about effect size and precision.',
    matters: 'Both effect estimates and both sample sizes.',
    concept: 'Statistical significance depends on effect size and sample size together; it is not a ranking of effect magnitudes.',
    why: 'The same true effect can be significant in a large study and non-significant in a small one; comparing the two significance verdicts as if they were effect sizes inverts what the numbers say.',
    steps: ['Study 1: +0.45 with n = 40 — a large estimate with a wide interval', 'Study 2: +0.12 with n = 4 000 — a small estimate with a narrow interval', 'Both are compatible with a modest positive effect; the verdicts differ because the precision does'],
    trap: 'Treating "significant" as "larger" and "not significant" as "smaller" — the two words compare an estimate with its own uncertainty.',
    transfer: 'The same trap appears when reading meta-analyses, medical guidelines and any headline that compares significance stars across studies.',
  }),

  /* ---------------------------------------------------------------- C05.density */
  C({
    id: 'acov-density-01',
    domainId: 'D05',
    conceptIds: ['C05.density'],
    label: 'PREREQUISITE',
    stem: 'A block of material has a mass of 2.4 kg and a volume of 0.003 m³. What is its density, and what does the number mean?',
    options: [
      o('800 kg/m³ — one cubic metre of the material has a mass of 800 kg.', 'none', 'Correct: density is mass per unit volume, so the number states the mass of one cubic metre.'),
      o('0.0072 kg/m³ — the mass multiplied by the volume.', 'rule_misapplication', 'Multiplying mass by volume gives kg·m³, not a mass per volume; dividing is required.'),
      o('0.0072 kg/m³ — the volume divided by the mass.', 'unit_error', 'Volume divided by mass gives m³/kg, the reciprocal of density.'),
      o('800 kg/m³ — one kilogram of the material occupies 800 cubic metres.', 'concept_confusion', 'The value is right but the meaning is inverted: 800 kg fit in one cubic metre, not the other way round.'),
    ],
    correct: 0,
    difficulty: 1,
    reasoningType: 'recall_structure',
    cognitiveMove: 'execute_rule',
    hints: ['Density is mass per volume: divide, do not multiply.', 'Check the unit: kg per m³.'],
    testing: 'Computing density and stating what the number means.',
    matters: 'The mass (2.4 kg) and the volume (0.003 m³).',
    concept: '$\\rho = m / V$; the unit kg/m³ is a mass per unit of volume.',
    why: 'Density is defined as the mass contained in a unit volume, which is why a large object can be lighter than a small one of a denser material.',
    steps: ['$\\rho = 2.4 / 0.003$', '$\\rho = 800$ kg/m³', 'Meaning: 1 m³ of this material has a mass of 800 kg'],
    trap: 'Multiplying instead of dividing, or reading a per-unit statement the wrong way round.',
    transfer: 'Density is the input for buoyancy (does it float?), for converting volume flows into mass flows, and for estimating masses from drawings.',
  }),
  C({
    id: 'acov-density-02',
    domainId: 'D05',
    conceptIds: ['C05.density', 'C05.force'],
    label: 'PREREQUISITE',
    stem:
      'A steel plate measures 2 m × 1 m × 0.01 m. Steel has a density of about 7 850 kg/m³. What is the weight of the plate (mass × 9.81 m/s²), and which intermediate step matters most?',
    options: [
      o('About 1 540 N: the volume (0.02 m³) must be found first, then mass (157 kg), then weight.', 'none', 'Correct: weight comes from mass, and mass comes from volume and density.'),
      o('About 157 N: the density gives the weight directly.', 'concept_confusion', 'Density gives mass, not weight; the factor 9.81 m/s² is missing.'),
      o('About 15 400 N: the thickness should be counted in centimetres.', 'unit_conversion', 'The thickness 0.01 m is already one centimetre; treating it as 0.1 m inflates the volume tenfold.'),
      o('About 154 N: the thickness is negligible and should be ignored.', 'overprecision', 'A plate 1 cm thick has a real volume; ignoring the third dimension removes 99 % of the material.'),
    ],
    correct: 0,
    difficulty: 3,
    reasoningType: 'multi_step_application',
    cognitiveMove: 'execute_rule',
    hints: ['Volume = length × width × thickness, all in metres.', 'Density → mass → weight, in that order.'],
    testing: 'Chaining volume → mass → weight correctly and keeping the units consistent.',
    matters: 'All three dimensions and the density.',
    concept: 'Mass = density × volume; weight = mass × gravitational acceleration.',
    why: 'Each step converts one quantity into the next, and the unit tells you which operation is needed: m³ × kg/m³ = kg, kg × m/s² = N.',
    steps: ['$V = 2 \\cdot 1 \\cdot 0.01 = 0.02$ m³', '$m = 7\\,850 \\cdot 0.02 = 157$ kg', '$F = 157 \\cdot 9.81 \\approx 1\\,540$ N'],
    trap: 'Stopping at mass, or converting the thickness wrongly (0.01 m = 1 cm, not 0.1 m).',
    transfer: 'The same chain sizes crane loads, checks whether a floor can carry a machine and converts any volume into a force.',
  }),

  /* ---------------------------------------------------------------- C09.assume */
  C({
    id: 'acov-assume-01',
    domainId: 'D09',
    conceptIds: ['C09.assume'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'The order-quantity model assumes demand is known and constant. A shop faces seasonal demand: high in December, low in June. If the model is applied with the average annual demand, what is the main consequence?',
    options: [
      o('The order quantity is a compromise: it will be too large for the quiet months and too small for the peak, so shortages and excess stock appear even though the average is right.', 'none', 'Correct: a single constant-order quantity cannot follow a seasonal pattern.'),
      o('The average demand makes the model exact, because averages remove seasonality.', 'concept_confusion', 'Averaging removes seasonality from the input but leaves it in the demand the shop actually faces.'),
      o('The model becomes invalid because the formula only works when demand is zero in some months.', 'wrong_assumption', 'The model does not require zero demand in some months; it requires known and constant demand.'),
      o('Only the holding cost becomes wrong; the ordering cost is unaffected and the result is still usable.', 'rule_misapplication', 'Both cost components depend on the order quantity, so both go wrong together.'),
    ],
    correct: 0,
    difficulty: 3,
    reasoningType: 'conceptual_discrimination',
    cognitiveMove: 'explain_or_critique',
    hints: ['Ask what the model needs to be true, then check whether the shop satisfies it.', 'A single Q must serve every month if Q is constant.'],
    testing: 'Judging whether a model\'s assumptions hold for a described situation.',
    matters: 'The demand pattern (seasonal) and the model\'s requirement (known, constant demand).',
    concept: 'Assumption auditing: the order-quantity model assumes known constant demand; when demand varies, the single optimal Q no longer tracks it.',
    why: 'An optimal quantity is optimal only with respect to the assumed demand, so a mismatch between the assumption and reality produces systematic over- and under-stocking rather than random error.',
    steps: ['Model assumption: demand rate is known and constant', 'Reality: demand varies by a factor of two or more across the year', 'Consequence: Q is too high in June (carrying cost) and too low in December (stockouts)'],
    trap: 'Substituting an average into a model whose structure, not only whose input, depends on constancy.',
    transfer: 'The same audit applies to interest models with variable rates, to linear cost models with volume discounts, and to any formula whose assumptions are invisible in the numbers.',
  }),
  C({
    id: 'acov-assume-02',
    domainId: 'D09',
    conceptIds: ['C09.assume', 'C09.scaling'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'A company doubles its annual demand for an item. Using the order-quantity model with unchanged ordering and holding cost per unit, and ignoring quantity discounts, what happens to the optimal order quantity and to the number of orders per year?',
    options: [
      o('The order quantity rises by a factor of about 1.41 and the number of orders rises by the same factor — neither doubles.', 'none', 'Correct: Q* is proportional to the square root of demand, and orders per year follow the same root.'),
      o('Both double, because demand doubled.', 'linearity_assumption', 'The square root in the formula means the response is weaker than proportional.'),
      o('The order quantity doubles and the number of orders stays the same.', 'rule_misapplication', 'Keeping the order frequency would require each order to double, which the optimality condition does not allow once costs are fixed.'),
      o('The order quantity stays the same and the number of orders doubles.', 'sufficient_necessary_confusion', 'That is only optimal if the ordering cost were zero, which it is not.'),
    ],
    correct: 0,
    difficulty: 5,
    reasoningType: 'parameter_reasoning',
    cognitiveMove: 'effect_of_change',
    hints: ['Write $Q^* = \\sqrt{2DS/H}$ and see how $D$ enters.', 'A square-root dependence means a doubling of the input gives about 1.41 times the output.'],
    testing: 'Reasoning about the *shape* of a formula rather than recomputing a single number.',
    matters: 'The position of demand in the formula and the fact that the other parameters are unchanged.',
    concept: 'Scaling: $Q^* \\propto \\sqrt{D}$, so a doubling of demand multiplies Q* by $\\sqrt{2} \\approx 1.41$, and the order frequency by the same factor.',
    why: 'The formula balances a cost proportional to the number of orders against one proportional to the quantity, and that trade-off has a square-root optimum — so costs of change are sub-linear.',
    steps: ['$Q^* = \\sqrt{2DS/H}$', 'Demand doubles: $Q^* \\to \\sqrt{2} \\cdot \\sqrt{2DS/H} = 1.41\\,Q^*$', 'Orders per year $= D/Q^* \\to 2D/(1.41 Q^*) = 1.41 \\cdot (D/Q^*)$'],
    trap: 'Scaling everything linearly with demand, which ignores the square root in the trade-off.',
    transfer: 'Square-root scaling appears in safety stock, in queueing and in many design rules: knowing it prevents both over- and under-reacting to growth.',
  }),

  /* ---------------------------------------------------------------- C03.distort */
  C({
    id: 'acov-distort-01',
    domainId: 'D03',
    conceptIds: ['C03.distort'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A bar chart of quarterly revenue starts its vertical axis at 900 000 € instead of 0. Q1 is 905 000 € and Q2 is 912 000 €. Visually, the Q2 bar looks almost twice as tall as the Q1 bar. Which statement about this chart is correct?',
    options: [
      o('The comparison is exaggerated: the true difference is about 0.8 %, but the truncated axis makes it look like a doubling.', 'none', 'Correct: the axis cut-off changes the visual ratio without changing the data.'),
      o('The chart is simply more precise, because zooming in on the relevant range shows the differences better.', 'concept_confusion', 'Zooming into a range can be legitimate for a line chart of trends, but bars encode size by length, so a cut-off axis falsifies size comparisons.'),
      o('The chart is wrong only if the axes are not labelled, but here the labels are present.', 'sufficient_necessary_confusion', 'A labelled truncated axis still misleads: the defect is in the ratio of the bars, not in the labelling.'),
      o('The difference is real, so the chart is accurate; only the reader\'s perception is at fault.', 'scope_error', 'An accurate number displayed in a way that misrepresents the ratio is a chart defect, not a reader defect.'),
    ],
    correct: 0,
    difficulty: 2,
    reasoningType: 'representation_transfer',
    cognitiveMove: 'interpret_representation',
    hints: ['Ask what quantity the *length* of a bar is supposed to represent.', 'Percentages of change follow from the values, not from the drawn heights.'],
    testing: 'Recognising a distorted scale and reconstructing the true comparison.',
    matters: 'The two revenue values and the fact that the bar length encodes size.',
    concept: 'Truncated axes in bar charts change the ratio of the lengths while leaving the numbers untouched; line charts of trends are more tolerant of cut-offs than bars.',
    why: 'A reader extracts size from length, not from the label; if lengths are rescaled, the visual message contradicts the data.',
    steps: ['Difference: 912 000 − 905 000 = 7 000 €', 'Relative to 905 000: about 0.8 %', 'Drawn with a 900 000 baseline: 12 000 vs 5 000 units of height — nearly 2.4×'],
    trap: 'Trusting the picture over the numbers, or accepting "zoomed in" as a justification for bar charts.',
    transfer: 'The same check transfers to cost benchmark charts, exam-score comparisons and every dashboard where the baseline can be moved.',
  }),
  C({
    id: 'acov-distort-02',
    domainId: 'D03',
    conceptIds: ['C03.distort', 'C03.read'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A line chart shows "complaints per 1 000 customers" rising from 4.0 to 4.4 over a year in which the customer base doubled from 50 000 to 100 000. A manager reads it as "complaints nearly doubled". What does the data actually say?',
    options: [
      o('Total complaints roughly doubled (200 to 440) while the rate rose only 10 % — the chart plots the rate, so the reading contradicts the axis.', 'none', 'Correct: with a doubled customer base, a 10 % rise in the rate means about a doubling of the number of complaints.'),
      o('Complaints nearly doubled and the rate confirms it.', 'unit_error', 'The chart plots complaints per 1 000 customers, not complaints; the two quantities differ by the size of the customer base.'),
      o('Nothing changed, because 4.0 and 4.4 are nearly the same number.', 'overprecision', 'A 10 % change in a complaint rate is a real change in performance, not noise by default.'),
      o('The rate must be falling, since the customer base grew faster.', 'causal_direction_reversed', 'A rising rate with a growing base means both the rate and the absolute number rise; nothing falls here.'),
    ],
    correct: 0,
    difficulty: 4,
    reasoningType: 'representation_transfer',
    cognitiveMove: 'interpret_representation',
    hints: ['Read the axis label first: which quantity is plotted?', 'Absolute numbers = rate × base, so a doubled base doubles the absolute figure at a constant rate.'],
    testing: 'Converting between a rate and an absolute quantity using the changing base.',
    matters: 'The two rates, the two customer-base sizes, and the axis label.',
    concept: 'A rate is not an amount: absolute = rate × base, so a constant rate with a growing base already means growing totals.',
    why: 'Management decisions act on quantities (how many complaints to handle), while charts often display rates; the conversion is the reader\'s job.',
    steps: ['Start: 4.0 per 1 000 × 50 000 = 200 complaints', 'End: 4.4 per 1 000 × 100 000 = 440 complaints', 'Rate: +10 %; total: +120 % — the manager\'s sentence describes the totals, the chart shows the rate'],
    trap: 'Reading a rate as if it were a count, especially when the base changes over the same period.',
    transfer: 'The same conversion is needed for accident rates, defect rates, hospital infections and every KPI expressed per thousand.',
  }),

  /* ---------------------------------------------------------------- C04.sampling */
  C({
    id: 'acov-sampling-01',
    domainId: 'D04',
    conceptIds: ['C04.sampling'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A university wants to know how many hours per week students work alongside their studies. The survey is sent by email to all students on a Friday afternoon and answers arrive within 48 hours. Which problem is most serious?',
    options: [
      o('Students who are busy working are the least likely to answer promptly, so the responses are biased towards those with more free time.', 'none', 'Correct: the timing and channel systematically exclude the group being studied.'),
      o('The sample is too small to compute any average.', 'concept_confusion', 'Sample size is not the issue here; the direction of the missing responses is.'),
      o('Voluntary email surveys are always invalid, whatever the timing.', 'sufficient_necessary_confusion', 'Self-selection is a serious weakness, but the claim "always invalid" is a stronger statement than the evidence supports.'),
      o('Nothing is wrong, because every student received the invitation.', 'wrong_assumption', 'Being invited is not the same as being represented; non-response is the problem.'),
    ],
    correct: 0,
    difficulty: 2,
    reasoningType: 'evidence_evaluation',
    cognitiveMove: 'classify_situation',
    hints: ['Ask who is systematically missing from the responses, not how many answered.', 'Non-response matters when the reason for not answering is related to the quantity measured.'],
    testing: 'Identifying non-response bias and its direction.',
    matters: 'The population, the invitation method and the timing.',
    concept: 'Coverage and non-response: a sample represents a population only if the probability of answering is unrelated to the measured quantity.',
    why: 'A survey estimates a population value by assuming the answers are representative; when busy students answer late or not at all, the estimate shifts in a predictable direction.',
    steps: ['Population: all students', 'Invitation: email, Friday afternoon, 48-hour window', 'Missing group: students working long hours — exactly the quantity of interest', 'Consequence: the average hours worked will be understated'],
    trap: 'Judging a sample only by its size, or by the fact that everyone was invited.',
    transfer: 'The same reasoning evaluates online reviews, app ratings and internal feedback surveys, where the missing voices are the informative ones.',
  }),
  C({
    id: 'acov-sampling-02',
    domainId: 'D04',
    conceptIds: ['C04.sampling', 'C04.mean'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A factory measures the diameter of 30 parts from one production shift and reports "all parts conform". A colleague wants to claim that today\'s output meets the specification. What is the crucial gap?',
    options: [
      o('One shift from one machine is not the production process: tool wear, setup and material lots vary, so the claim needs samples across shifts, machines and time.', 'none', 'Correct: the sample represents a moment, not the ongoing process.'),
      o('Thirty parts is too few for any conclusion, so the sample must be at least 300.', 'overprecision', 'Sample size matters, but no fixed number compensates for sampling only one shift.'),
      o('The measurement itself is the weak point, so the claim should be about the measuring device.', 'scope_error', 'The question is about the process, not about the instrument.'),
      o('The claim is fine if the shift is typical.', 'wrong_assumption', '"Typical" is exactly what has not been established; assuming it removes the need for the evidence.'),
    ],
    correct: 0,
    difficulty: 4,
    reasoningType: 'evidence_evaluation',
    cognitiveMove: 'explain_or_critique',
    hints: ['Ask what varies between shifts that does not vary within a shift.', 'A process claim needs evidence about the process, not about one realisation of it.'],
    testing: 'Distinguishing a sample from one condition of a process.',
    matters: 'The scope of the claim (today\'s output) and the scope of the evidence (one shift).',
    concept: 'Representativeness is about covering the variation in the population, not about the number of observations taken in one place.',
    why: 'Sources of variation between shifts (tool wear, material, operator) are invisible inside a single shift, so no amount of within-shift sampling can detect them.',
    steps: ['Claim: today\'s production conforms', 'Evidence: 30 parts from one shift on one machine', 'Unsampled variation: other shifts, other machines, different material lots', 'Conclusion: the claim is broader than the evidence'],
    trap: 'Increasing the sample size within the same narrow condition, which adds precision without adding coverage.',
    transfer: 'The same reasoning applies to software load tests run on one machine, to crop trials in one field and to medical results from a single clinic.',
  }),

  /* ---------------------------------------------------------------- C12.level */
  C({
    id: 'acov-level-01',
    domainId: 'D12',
    conceptIds: ['C12.level'],
    label: 'OFFICIAL_FIELD_LIST',
    stem: 'A questionnaire asks for the customer\'s satisfaction on a five-point scale: very dissatisfied, dissatisfied, neutral, satisfied, very satisfied. Which analysis is appropriate?',
    options: [
      o('Counts and percentages per category, and medians if an order is assumed — but averaging the labels as if they were numbers is not justified.', 'none', 'Correct: an ordinal scale supports order and frequency statements, not arithmetic ones.'),
      o('Compute the mean of 1–5 scores; ordinal scales are numeric.', 'definition_misuse', 'The numbers are labels for ordered categories; the distance between "neutral" and "satisfied" is not necessarily equal to the next step.'),
      o('Compute ratios between categories, for example "twice as satisfied".', 'definition_misuse', 'Ratios require a true zero and equal intervals, neither of which an ordinal scale has.'),
      o('Only the mode is permissible; even counts and percentages are unsound.', 'sufficient_necessary_confusion', 'Counting categories is exactly what nominal and ordinal data support; restricting further is unnecessary.'),
    ],
    correct: 0,
    difficulty: 2,
    reasoningType: 'conceptual_discrimination',
    cognitiveMove: 'classify_situation',
    hints: ['Ask what the scale supports: naming, ordering, equal steps, or a true zero.', 'Medians need order; means need equal intervals.'],
    testing: 'Matching a measurement level (nominal, ordinal, interval, ratio) to permissible operations.',
    matters: 'The wording of the categories and the fact that only their order is defined.',
    concept: 'Levels of measurement: nominal (naming), ordinal (order), interval (equal steps), ratio (true zero).',
    why: 'Every summary statistic presumes a level of measurement; computing a mean on an ordinal scale assumes equal distances that the scale never promised.',
    steps: ['Scale: five ordered categories', 'Order defined ⇒ counts, percentages, medians, comparisons', 'Distances not defined ⇒ means and differences are not justified'],
    trap: 'Encoding categories as 1–5 and then forgetting that the encoding was arbitrary.',
    transfer: 'The same discipline applies to education grades, pain scales, credit ratings and any Likert item in a survey.',
  }),
  C({
    id: 'acov-level-02',
    domainId: 'D12',
    conceptIds: ['C12.level', 'C12.operational'],
    label: 'OFFICIAL_FIELD_LIST',
    stem:
      'A study reports that "employee engagement explains 34 % of the variance in productivity". Both variables are measured with self-report questionnaires. What is the most defensible interpretation?',
    options: [
      o('A statistical association of that size exists between the two questionnaire measures; whether either reflects the concept it names, and in which direction the influence runs, needs separate evidence.', 'none', 'Correct: variance explained is about the measures, not about the concepts or the causal direction.'),
      o('Engagement causes productivity, and it accounts for 34 % of it.', 'correlation_causation', 'The analysis establishes association; causation and its direction need designs the study does not have.'),
      o('The result is meaningless, because self-reports are always invalid.', 'overprecision', 'Self-reports have known weaknesses; that does not make a reported association vanish.'),
      o('Since 66 % of productivity is unexplained, engagement does not matter.', 'scope_error', 'A 34 % association can still be the strongest signal available; the size of what is unexplained does not erase it.'),
    ],
    correct: 0,
    difficulty: 4,
    reasoningType: 'evidence_evaluation',
    cognitiveMove: 'general_case',
    hints: ['Separate the measurement ("what was recorded") from the concept ("what it is called").', 'Variance explained is a statement about the two measures in this sample.'],
    testing: 'Reading a variance-explained figure at the level the design supports.',
    matters: 'The measure type (self-report), the statistic (variance explained) and the design (observational).',
    concept: 'Operationalisation: a study tests the defined measures, so conclusions about the underlying concepts require validation of those measures.',
    why: 'An association between two questionnaire scores can come from the concepts themselves, from shared method variance, or from a third factor; the statistic alone cannot separate them.',
    steps: ['Statistic: 34 % shared variance between engagement and productivity scores', 'Design: both measured by self-report, no manipulation', 'Supported: an association between the measures', 'Not yet supported: causal direction, or that the measures capture the concepts'],
    trap: 'Upgrading "associated with" into "causes" or into a claim about the concepts rather than about the instruments.',
    transfer: 'The same reading applies to all questionnaire-based management research, to engagement surveys and to student-satisfaction league tables.',
  }),

  /* ---------------------------------------------------------------- C13.precision */
  C({
    id: 'acov-precision-01',
    domainId: 'D13',
    conceptIds: ['C13.precision'],
    label: 'OFFICIAL_FIELD_LIST',
    stem: 'A length is quoted as 12.50 m and another as 12.5 m. Which statement is correct?',
    options: [
      o('They differ in precision: 12.50 m states the value to the centimetre, 12.5 m only to the decimetre — the extra zero is information, not decoration.', 'none', 'Correct: trailing zeros after a decimal point record the precision of the measurement.'),
      o('They are identical, so the extra zero may be dropped without loss.', 'overprecision', 'Dropping the zero silently widens the stated uncertainty by a factor of ten.'),
      o('12.50 m is more accurate than 12.5 m.', 'concept_confusion', 'Precision (how finely it is stated) is not accuracy (how close it is to the true value).'),
      o('The two values differ by 0.05 m, namely half of the last stated place.', 'sufficient_necessary_confusion', 'The difference between the *stated* values is zero; 0.05 m is the possible rounding range, not a difference between the two figures.'),
    ],
    correct: 0,
    difficulty: 2,
    reasoningType: 'conceptual_discrimination',
    cognitiveMove: 'interpret_representation',
    hints: ['Read the last written digit: it fixes the finest unit stated.', 'Accuracy and precision are different questions.'],
    testing: 'Reading significance from the way a number is written.',
    matters: 'The number of decimals in each figure.',
    concept: 'Significant figures: trailing zeros after a decimal point state the precision of the measurement.',
    why: 'A quoted number is a claim about a range, and the written digits are the only record of how fine that range is.',
    steps: ['12.50 m ⇒ measured to 0.01 m', '12.5 m ⇒ measured to 0.1 m', 'Same value, different stated uncertainty — both statements are legitimate, but they mean different things'],
    trap: 'Deleting trailing zeros when copying a value, which destroys the measurement information the author supplied.',
    transfer: 'The same convention decides how many digits a result may carry after a calculation and how to compare results from instruments of different resolution.',
  }),
  C({
    id: 'acov-precision-02',
    domainId: 'D13',
    conceptIds: ['C13.precision', 'C13.estimate'],
    label: 'OFFICIAL_FIELD_LIST',
    stem:
      'A calculation multiplies a measured length of 3.7 m (two significant figures) by a count of exactly 12 items. A calculator shows 44.4. How should the result be reported, and why?',
    options: [
      o('As 44 m: a product cannot be more precise than the least precise factor, and the length has two significant figures.', 'none', 'Correct: the count carries no measurement uncertainty, so the length limits the precision.'),
      o('As 44.4 m, because the calculator gives four digits.', 'overprecision', 'Calculator digits are not evidence of measurement precision.'),
      o('As 44.40 m, to be safe with rounding.', 'overprecision', 'Adding digits does not protect anything; it claims precision that was never measured.'),
      o('As 44.4 m with a ±0.05 m uncertainty, since the count is exact.', 'unit_error', 'The uncertainty of the product is dominated by the length\'s ±0.05 m, which propagates to about ±0.6 m, not ±0.05 m.'),
    ],
    correct: 0,
    difficulty: 5,
    reasoningType: 'estimation_scaling',
    cognitiveMove: 'general_case',
    hints: ['Count how many significant figures each input carries.', 'An exact count does not limit precision; the measured factor does.'],
    testing: 'Propagating measurement precision through a multiplication, including the case of an exact factor.',
    matters: 'The precision of the length (2 significant figures) and the exactness of the count.',
    concept: 'Precision rule: a result produced by multiplication or division has the precision of its least precise measured factor.',
    why: 'The uncertainty of the length (±0.05 m) is a fraction of its value; multiplying by an exact number scales the value and the uncertainty by the same factor, so the relative precision cannot improve.',
    steps: ['Length: 3.7 m ⇒ about ±0.05 m, i.e. roughly 1 % relative uncertainty', 'Product: 3.7 × 12 = 44.4 m, with the same 1 % relative uncertainty (≈ ±0.6 m)', 'Reported to two significant figures: 44 m'],
    trap: 'Copying every digit from the calculator, or treating an exact count as a limit on precision.',
    transfer: 'The same rule keeps cost calculations, engineering quantities and reported measurements honest — and makes "44.4 m" recognisable as false precision.',
  }),

  /* ---------------------------------------------------------------- C11.phases */
  C({
    id: 'acov-phases-01',
    domainId: 'D11',
    conceptIds: ['C11.phases'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'A team writes: "We will collect the data first and look at it to decide which hypothesis to test, then write the literature review." Which critique of the research design is most fundamental?',
    options: [
      o('Hypotheses must be fixed before the data are inspected, otherwise any pattern the data happen to contain becomes "the hypothesis".', 'none', 'Correct: the sequence is what gives the test its meaning.'),
      o('The literature review must come last, since it summarises the findings.', 'rule_misapplication', 'The order of writing is a matter of style; the order of hypothesis and data is a matter of validity.'),
      o('Data collection should never be followed by hypothesis testing.', 'sufficient_necessary_confusion', 'Collecting data and then testing a pre-specified hypothesis is entirely normal; the critique is about *deciding* the hypothesis afterwards.'),
      o('Nothing is wrong, because explorative research is always allowed.', 'wrong_assumption', 'Exploration is legitimate, but it must be labelled as exploration; calling it a hypothesis test misrepresents the evidence.'),
    ],
    correct: 0,
    difficulty: 1,
    reasoningType: 'conceptual_discrimination',
    cognitiveMove: 'classify_situation',
    hints: ['Ask which step must be fixed in advance for a test to be a test.', 'Exploration and confirmation are both legitimate — but they are different claims.'],
    testing: 'Recognising the phase order that a hypothesis test presupposes.',
    matters: 'The order of hypothesis formation and data inspection.',
    concept: 'Phases of research: question → theory and hypotheses → design → data collection → analysis → reporting; hypotheses are fixed before the data are seen.',
    why: 'A test is informative only if the prediction could have failed; choosing the prediction after seeing the data removes that possibility.',
    steps: ['Intended claim: hypothesis test', 'Required order: hypothesis first, then data', 'Described order: data first, hypothesis second', 'Actual status: exploratory analysis (legitimate, but a different claim)'],
    trap: 'Confusing thorough exploration with hypothesis testing — the problem is the label, not the activity.',
    transfer: 'The same distinction appears in A/B testing (peeking), in machine learning (test-set leakage) and in any analysis where the data informed the model.',
  }),
  C({
    id: 'acov-phases-02',
    domainId: 'D11',
    conceptIds: ['C11.phases', 'C11.qtypes'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      'A study asks: "How do first-year students experience the transition to university?" and reports averages of a satisfaction scale. Which mismatch is most important?',
    options: [
      o('The question asks for experience and meaning, which calls for qualitative data; reporting a satisfaction average answers a different (quantitative) question.', 'none', 'Correct: the data type must match the kind of question asked.'),
      o('Averages are always weaker than interviews.', 'sufficient_necessary_confusion', 'Neither approach is universally stronger; the mismatch, not the method, is the problem.'),
      o('The sample must be too small for averages; that is the issue.', 'concept_confusion', 'Sample size is not what makes the average irrelevant to the stated question.'),
      o('Nothing is wrong: satisfaction is a component of experience.', 'scope_error', 'A component of a concept cannot substitute for the concept when the question is explicitly about how students experience it.'),
    ],
    correct: 0,
    difficulty: 3,
    reasoningType: 'conceptual_discrimination',
    cognitiveMove: 'classify_situation',
    hints: ['Ask what kind of answer the question demands: numbers, or descriptions and reasons.', 'A scale measures level; a "how" question asks for mechanism and meaning.'],
    testing: 'Aligning question type with data type and analysis.',
    matters: 'The wording of the research question and the form of the reported data.',
    concept: 'Question types: descriptive, comparative, relational, explanatory — each implies a data type and an analysis.',
    why: 'A research design is coherent when the evidence can answer the question asked; averages can describe a level but cannot explain an experience.',
    steps: ['Question: how students experience the transition (explanatory/descriptive, qualitative)', 'Data: satisfaction scale (quantitative, ordinal)', 'Gap: the analysis cannot answer the "how" — it answers "how satisfied on average"'],
    trap: 'Assuming that any data about the topic answers the question about the topic.',
    transfer: 'The same check is used when reviewing survey-based studies of culture, engagement or wellbeing, where the questionnaire may measure something adjacent to the question.',
  }),

  /* ---------------------------------------------------------------- C10.marginal */
  C({
    id: 'acov-marginal-01',
    domainId: 'D10',
    conceptIds: ['C10.marginal', 'C10.breakeven'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A company produces 10 000 units at an average cost of 8 € per unit, of which 3 € is fixed cost per unit (total fixed costs 30 000 €). A customer offers to buy 1 000 additional units at 5.50 € each, without affecting existing sales. Should the company accept, on cost grounds alone?',
    options: [
      o('Yes: the additional units cost only the 5 € variable cost each, so each one contributes 0.50 € — the fixed costs are already covered by existing production.', 'none', 'Correct: marginal thinking uses the costs that the decision actually changes.'),
      o('No: the offer price of 5.50 € is below the average cost of 8 €, so every unit would be sold at a loss.', 'concept_confusion', 'Average cost includes fixed costs that do not change with this order; only the variable cost of 5 € is incremental.'),
      o('No: the fixed cost per unit rises to about 3.10 € when production expands, so the order is unprofitable.', 'rule_misapplication', 'Fixed cost per unit falls as volume rises; and in any case fixed costs are not part of the decision.'),
      o('Yes, because any order that increases revenue must increase profit.', 'sufficient_necessary_confusion', 'Revenue can rise while profit falls, if the price does not cover the incremental cost.'),
    ],
    correct: 0,
    difficulty: 3,
    reasoningType: 'causal_reasoning',
    cognitiveMove: 'classify_situation',
    hints: ['Ask which costs change if the order is accepted, and which do not.', 'Fixed costs are covered by existing sales; the order only adds variable cost.'],
    testing: 'Distinguishing incremental (marginal) costs from average costs in a decision.',
    matters: 'The variable cost per unit and the offered price.',
    irrelevant: 'The fixed cost per unit at the current volume — it is unchanged by the decision.',
    concept: 'Marginal analysis: a decision compares the change in revenue with the change in cost, not with the average cost.',
    why: 'Average cost answers "what did a unit cost on average"; the decision question is "what does one more unit cost" — and fixed costs do not depend on the decision.',
    steps: ['Variable cost per unit: 8 − 3 = 5 €', 'Offer: 4.50 €... below 5 € — so on variable cost alone the order loses 0.50 € per unit', 'Re-read the figures: 1 000 × (5 − 4.50) = 500 € loss ⇒ decline unless non-cost reasons (market entry, spare capacity) justify it'],
    trap: 'Comparing the offer with the average cost in either direction: it is too pessimistic with fixed costs included, and too optimistic if variable cost is ignored.',
    transfer: 'The same reasoning governs special orders, make-or-buy decisions, off-peak pricing and whether to run an extra shift.',
  }),
  C({
    id: 'acov-marginal-02',
    domainId: 'D10',
    conceptIds: ['C10.marginal', 'C10.elasticity'],
    label: 'PREPARATION_EXTENSION',
    stem:
      'A product sells 20 000 units per year at 25 € with a variable cost of 15 € per unit and fixed costs of 90 000 €. A price increase of 10 % is expected to reduce volume by 4 %. What happens to contribution and to profit, and what margin of error does the decision have?',
    options: [
      o('Contribution rises from 200 000 € to 240 000 € and profit from 110 000 € to 150 000 €; the decision only turns negative if volume falls by more than about 20 %.', 'none', 'Correct: the price effect dominates the small volume loss, and the tolerated volume loss is far larger than the expected one.'),
      o('Profit falls, because fewer units are sold.', 'causal_direction_reversed', 'The volume loss is small while the price rise is large; the direction of the net effect follows the arithmetic, not the unit count.'),
      o('Contribution falls, since contribution per unit is unchanged by the price rise.', 'rule_misapplication', 'The contribution per unit rises from 10 € to 12.50 €; only the volume falls slightly.'),
      o('Profit rises by exactly 10 %, matching the price increase.', 'linearity_assumption', 'Profit depends on volume as well; with unchanged volume a 10 % price rise would raise contribution by 25 %, so neither 10 % nor 25 % is right.'),
    ],
    correct: 0,
    difficulty: 5,
    reasoningType: 'parameter_reasoning',
    cognitiveMove: 'effect_of_change',
    hints: ['Recompute contribution per unit after the price change, then multiply by the new volume.', 'Break-even volume loss: how much volume could be lost before the price rise stops paying?'],
    testing: 'Combining price and volume effects, and quantifying how wrong the estimate may be before the decision flips.',
    matters: 'The old and new price, the volume change, and the variable cost.',
    concept: 'Contribution = (price − variable cost) × volume; a price change shifts contribution per unit, so the decision compares that gain with the volume loss.',
    why: 'Profit responds to price and volume in opposite directions, and the margin of error is what makes the decision robust or fragile — the two must be computed, not felt.',
    steps: [
      'Before: (25 − 15) × 20 000 = 200 000 € contribution; profit 200 000 − 90 000 = 110 000 €',
      'After: price 27.50 €, contribution per unit 12.50 €, volume 19 200 ⇒ 240 000 € contribution, profit 150 000 €',
      'Break-even volume: 12.50 × V = 200 000 ⇒ V = 16 000 units, so a volume loss of up to 4 000 units (20 %) still pays',
    ],
    trap: 'Reading the price increase as a proportional profit increase, or ignoring how much the volume estimate may be wrong.',
    transfer: 'The same margin-of-error reasoning protects decisions about discounts, subscription price changes, and any case where the volume response is only estimated.',
  }),
];
