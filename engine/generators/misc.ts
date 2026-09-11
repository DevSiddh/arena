import type { Rng } from '../rng';
import type { Question } from '../types';
import { assemble, distinctOpts, num, type GenSpec, type Opt } from './helpers';

/**
 * Generators for the non-demonstrated domains (D01, D03, D04, D05, D07, D08, D10, D13).
 * Every domain here carries the label OFFICIAL_FIELD_LIST or PREPARATION_EXTENSION: the
 * official material names the area as possibly covered, but shows no sample question. The
 * answer options reuse patterns observed in the official items (order-of-magnitude,
 * confusion of two plausible relations, inverted ratios, unit mixing).
 */

function makeId(tag: string, rng: Rng): string {
  return `gen-${tag}-${rng.int(100000, 999999)}`;
}

/* ================================================================== */
/* D01 — mathematical & quantitative reasoning                        */
/* ================================================================== */

export function genPercentageChange(rng: Rng): Question {
  const from = rng.pick([40, 50, 60, 80, 120, 150, 200, 250, 400]);
  const pct = rng.pick([10, 20, 25, -10, -20, -25, 50, -50]);
  const to = from * (1 + pct / 100);
  const context = rng.pick([
    'The price of a component',
    'The number of applications',
    'The energy consumption of a machine',
    'The monthly output of a plant',
  ]);
  const reversed = rng.pick([-pct * 0.8, -pct * 0.6, pct * 0.5]);
  return assemble(
    {
      id: makeId('pct', rng),
      domainId: 'D01',
      conceptIds: ['C01.ratio'],
      label: 'PREREQUISITE',
      stem: `${context} changes from ${from} to ${num(to, 2)}. What is the percentage change?`,
      options: [
        { text: `${pct > 0 ? '+' : ''}${num(pct, 1)} %`, errorTag: 'none', rationale: 'Correct: the change is measured against the original value.', correct: true },
        { text: `${num(reversed, 1)} %`, errorTag: 'ratio_error', rationale: 'The change was referred to the wrong base (a different value instead of the original one).' },
        { text: `${num(to - from, 1)} %`, errorTag: 'unit_error', rationale: 'This is the absolute difference in units, not a percentage of the original value.' },
        { text: `${num((from / to - 1) * 100, 1)} %`, errorTag: 'ratio_error', rationale: 'The ratio was inverted: percentages of change are always measured relative to the starting value.' },
      ],
      difficulty: 2,
      reasoningType: 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Divide the change by the *original* value.', 'A change from 100 to 90 is −10 %, and from 90 to 100 is +11 % — the base differs.'],
      explanation: {
        testing: 'Choosing the correct base for a percentage change.',
        matters: `The original value (${from}) as the reference quantity.`,
        concept: 'Percentage change = (new − old)/old × 100.',
        why: 'Percentages express a ratio to an explicit base, and by convention the base is the situation before the change.',
        steps: [`Change: $${num(to, 2)} - ${from} = ${num(to - from, 2)}$`, `Relative to ${from}: $${num(to - from, 2)}/${from} = ${num(pct / 100, 4)}$ ⇒ ${num(pct, 1)} %`],
        trap: 'Dividing by the new value instead of the old one — a mistake that even survives into technical reporting.',
        transfer: 'The same base convention governs growth rates, inflation figures and efficiency claims.',
      },
      verification: { solver: 'math.percentage_change', payload: { from, to } },
    },
    rng,
  );
}

export function genProportion(rng: Rng): Question {
  const per = rng.pick([4, 5, 6, 8, 10, 12, 15]);
  const amount = rng.pick([3, 4, 6, 7, 9, 12]);
  const target = rng.pick([20, 24, 30, 36, 40, 45, 60]);
  const unitRate = amount / per;
  const answer = unitRate * target;
  const context = rng.pick([
    ['A machine produces', 'components in', 'hours. How many components does it produce in', 'hours at the same rate?'],
    ['A printer uses', 'cartridges per', 'working days. How many cartridges are needed for', 'days?'],
    ['A lab consumes', 'litres of solvent in', 'experiments. How much is needed for', 'experiments?'],
  ]);
  return assemble(
    {
      id: makeId('prop', rng),
      domainId: 'D01',
      conceptIds: ['C01.rate'],
      label: 'PREREQUISITE',
      stem: `${context[0]} ${amount} ${context[1]} ${per} ${context[2]} ${target} ${context[3]}`.replace(/\s+/g, ' '),
      options: [
        { text: `${num(answer, 2)}`, errorTag: 'none', rationale: 'Correct: scale by the ratio target/per.', correct: true },
        { text: `${num(amount * target / per ** 2 * per, 2) === num(answer, 2) ? num(answer * 2, 2) : num((amount * per) / target, 2)}`, errorTag: 'ratio_error', rationale: 'The ratio was set up the wrong way round (dividing by the target instead of multiplying by it).' },
        { text: `${num(amount + (target - per), 2)}`, errorTag: 'linearity_assumption', rationale: 'This adds the difference instead of scaling proportionally, which is only correct for small equal steps.' },
        { text: `${num(unitRate, 2)}`, errorTag: 'question_misread', rationale: 'This is the rate per unit (the amount per one entity), not the amount for the target quantity.' },
      ],
      difficulty: 2,
      reasoningType: 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: [`First find the amount per unit: $${amount}/${per}$.`, 'Then multiply the rate by the target quantity.'],
      explanation: {
        testing: 'Proportional scaling via a unit rate.',
        matters: `The pair describing the known rate (${amount} per ${per}) and the target quantity (${target}).`,
        concept: 'Proportionality: equal ratios.',
        why: 'If the process is uniform, doubling the input doubles the output, so the value per unit is the bridge between the two situations.',
        steps: [`Rate: $${amount}/${per} = ${num(unitRate, 4)}$`, `Target: $${num(unitRate, 4)} \\times ${target} = ${num(answer, 2)}$`],
        trap: 'Setting up the proportion with the target in the numerator of the second ratio when it belongs in the denominator — always check whether the answer should be larger or smaller.',
        transfer: 'Unit-rate reasoning underlies currency conversion, dosage calculation and fuel consumption estimates.',
      },
      verification: { solver: 'math.rate', payload: { amount, per, target } },
    },
    rng,
  );
}

export function genUnitConversion(rng: Rng): Question {
  const cases = [
    { q: 'Convert $2.5$ kWh into joules.', factor: 3.6e6, value: 2.5, unit: 'J', wrongNote: 'kWh → J multiplies by 3.6 million.', alt: ['900 J', '9000 J', '360000 J'] },
    { q: 'Convert $3$ bar into pascal.', factor: 1e5, value: 3, unit: 'Pa', wrongNote: '1 bar = 100 000 Pa.', alt: ['0.03 Pa', '3000 Pa', '30000 Pa'] },
    { q: 'Convert $4$ m³ into litres.', factor: 1000, value: 4, unit: 'l', wrongNote: '1 m³ = 1000 l.', alt: ['0.004 l', '40 l', '400 l'] },
    { q: 'Convert $250$ hPa into bar.', factor: 0.001, value: 250, unit: 'bar', wrongNote: '1 hPa = 0.001 bar, so 1000 hPa = 1 bar.', alt: ['25 bar', '2.5 bar', '250000 bar'] },
  ];
  const c = rng.pick(cases);
  const answer = c.value * c.factor;
  return assemble(
    {
      id: makeId('unit', rng),
      domainId: 'D01',
      conceptIds: ['C01.units'],
      label: 'PREREQUISITE',
      stem: c.q,
      options: [
        { text: `$${num(answer, 6)}$ ${c.unit}`, errorTag: 'none', rationale: `Correct: ${c.wrongNote} Applying the factor to ${num(c.value, 3)} gives ${num(answer, 3)} ${c.unit}.`, correct: true },
        { text: `$${c.alt[0]}$`, errorTag: 'unit_conversion', rationale: `Too small by an order of magnitude: ${c.wrongNote}` },
        { text: `$${c.alt[1]}$`, errorTag: 'unit_conversion', rationale: `A common prefix error: ${c.wrongNote}` },
        { text: `$${c.alt[2]}$`, errorTag: 'unit_conversion', rationale: `The conversion factor was applied in the wrong direction. ${c.wrongNote}` },
      ],
      difficulty: 2,
      reasoningType: 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Write the conversion as a fraction equal to 1 and multiply.', 'Check the order of magnitude: is the new unit bigger (smaller number) or smaller (larger number)?'],
      explanation: {
        testing: 'Safe unit conversion — the habit that prevents order-of-magnitude errors in pressure, energy and volume questions.',
        matters: 'The numerical definition of the two units involved.',
        concept: 'Multiplying by a conversion factor equal to one.',
        why: 'Units are algebraic objects: replacing one unit by its definition preserves the physical quantity.',
        steps: [
        `Conversion factor: $1$ unit $= ${num(c.factor, 8)}$ of the new unit`,
        `Result: $${num(c.value, 3)} \\times ${num(c.factor, 8)} = ${num(answer, 6)}$ ${c.unit}`,
      ],
        trap: 'Losing a power of ten — in exams the distractor set almost always contains the "prefix error" value.',
        transfer: 'Consistent unit handling is what makes formulas such as ρgh safe to evaluate.',
      },
      verification: { solver: 'math.unit_convert', payload: { value: c.value, factor: c.factor } },
    },
    rng,
  );
}

export function genEstimation(rng: Rng): Question {
  const cases = [
    { q: 'A city of about 4 million inhabitants consumes water. Estimate the order of magnitude of the daily water consumption if each person uses roughly 120 litres per day.', correct: 5e8, unit: 'litres', wrong: [5e6, 5e7, 5e10], why: '$4\\times10^6$ people × $1.2\\times10^2$ litres ≈ $5\\times10^8$ litres.' },
    { q: 'A warehouse stores pallets of 500 kg each. It has 4 000 pallet positions, half of them occupied. Estimate the stored mass.', correct: 1e6, unit: 'kg', wrong: [1e5, 1e7, 1e8], why: '$2000 \\times 500 = 10^6$ kg.' },
    { q: 'A machine consumes 2 kW and runs 8 hours a day for 250 days a year. Estimate the annual energy consumption in kilowatt-hours.', correct: 4000, unit: 'kWh', wrong: [400, 20000, 400000], why: '$2 \\times 8 \\times 250 = 4000$ kWh.' },
  ];
  const c = rng.pick(cases);
  return assemble(
    {
      id: makeId('est', rng),
      domainId: 'D01',
      conceptIds: ['C01.estimate'],
      label: 'PREREQUISITE',
      stem: `${c.q} Which result is of the right order of magnitude?`,
      options: [
        { text: `about ${c.correct.toLocaleString('en-US').replace(/,/g, ' ')} ${c.unit}`, errorTag: 'none', rationale: `Correct: ${c.why}`, correct: true },
        { text: `about ${c.wrong[0].toLocaleString('en-US').replace(/,/g, ' ')} ${c.unit}`, errorTag: 'unit_error', rationale: `One power of ten too small. ${c.why}` },
        { text: `about ${c.wrong[1].toLocaleString('en-US').replace(/,/g, ' ')} ${c.unit}`, errorTag: 'calculation_slip', rationale: `A factor of about ten off in the multiplication. ${c.why}` },
        { text: `about ${c.wrong[2].toLocaleString('en-US').replace(/,/g, ' ')} ${c.unit}`, errorTag: 'overprecision', rationale: `Far too large: the estimated factors multiply, they do not add further powers of ten. ${c.why}` },
      ],
      difficulty: 3,
      reasoningType: 'estimation_scaling',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Round each factor generously, then multiply the powers of ten separately.', 'Estimate the exponent rather than the digits: 4 million ≈ 10⁶ and 120 ≈ 10².'],
      explanation: {
        testing: 'Fermi-style estimation: controlling the order of magnitude without exact arithmetic.',
        matters: 'The exponents of the individual factors.',
        concept: 'Multiplication of rounded factors, powers of ten added.',
        why: 'Order-of-magnitude reasoning is immune to small errors and is the only feasible approach in a no-notes exam with awkward figures.',
        steps: [c.why, 'Round every factor to one significant digit, multiply the leading digits, add the exponents.'],
        trap: 'Producing a spuriously precise number (e.g. 476 800 litres) instead of the correct magnitude, or slipping one power of ten.',
        transfer: 'Estimation is the fastest sanity check on any computed result — if the order of magnitude is wrong, the method is wrong.',
      },
    },
    rng,
  );
}

/* ================================================================== */
/* D03 — data interpretation                                          */
/* ================================================================== */

export function genTableShare(rng: Rng): Question {
  const categories = ['North', 'South', 'East', 'West'];
  const values = [rng.int(20, 60), rng.int(20, 60), rng.int(20, 60), rng.int(20, 60)];
  const total = values.reduce((a, b) => a + b, 0);
  const maxIdx = values.indexOf(Math.max(...values));
  let idx = rng.int(0, 3);
  while (idx === maxIdx) idx = rng.int(0, 3); // avoids a distractor that equals the answer
  const share = (values[idx] / total) * 100;
  return assemble(
    {
      id: makeId('share', rng),
      domainId: 'D03',
      conceptIds: ['C03.read'],
      label: 'OFFICIAL_FIELD_LIST',
      stem: `The table shows the number of units sold by four regional branches in one year. What share of the total is accounted for by the ${categories[idx]} branch?`,
      figure: {
        kind: 'table',
        title: 'Units sold per branch',
        headers: ['Branch', 'Units sold'],
        rows: categories.map((c, i) => [c, values[i]]),
      },
      options: [
        { text: `about ${num(share, 1)} %`, errorTag: 'none', rationale: 'Correct: the branch value divided by the row total.', correct: true },
        { text: `about ${num((values[idx] / Math.max(...values)) * 100, 1)} %`, errorTag: 'graph_misread', rationale: 'This compares the branch with the largest branch, not with the total.' },
        { text: `about ${num(((values[idx] / total) * 100) / 4, 1)} %`, errorTag: 'rule_misapplication', rationale: 'The share was divided by the number of branches, which would only be correct for equal values.' },
        { text: `about ${num(share * 2, 1)} %`, errorTag: 'calculation_slip', rationale: 'Roughly double the correct share — the denominator was halved.' },
      ],
      difficulty: 2,
      reasoningType: 'representation_transfer',
      cognitiveMove: 'interpret_representation',
      style: 'numeric_direct',
      hints: ['First sum the column to get the total.', 'A share is part ÷ total, expressed in per cent.'],
      explanation: {
        testing: 'Extracting the right denominator from a table before forming a ratio.',
        matters: `The ${categories[idx]} value (${values[idx]}) and the column total (${total}).`,
        irrelevant: 'The other columns are needed only to build the total, not as comparison values.',
        concept: 'Share = part divided by total.',
        why: 'A share is always relative to the whole population described by the table.',
        steps: [`Total: $${values.join(' + ')} = ${total}$`, `Share: $${values[idx]}/${total} = ${num(values[idx] / total, 4)} \\approx ${num(share, 1)}$ %`],
        trap: 'Comparing with the largest category instead of the total.',
        transfer: 'The same denominator discipline is needed for market shares, budget lines and error rates.',
      },
      verification: { solver: 'datainterp.share', payload: { part: values[idx], total } },
    },
    rng,
  );
}

export function genGradient(rng: Rng): Question {
  const m = rng.pick([2, 3, 4, 5, 8]);
  let c = rng.pick([10, 20, 30, 40, 50]);
  while (c === m) c = rng.pick([10, 20, 30, 40, 50]);
  const x1 = rng.pick([1, 2, 4, 5]);
  const x2 = x1 + rng.pick([2, 3, 4, 5]);
  const y1 = c + m * x1;
  const y2 = c + m * x2;
  const day1 = rng.int(2, 10);
  const day2 = day1 + (x2 - x1);
  return assemble(
    {
      id: makeId('grad', rng),
      domainId: 'D03',
      conceptIds: ['C03.gradient'],
      label: 'OFFICIAL_FIELD_LIST',
      stem:
        `The figure shows the daily output of a plant (in units per day) against the number of machine hours. ` +
        `At ${x1} machine hours the output is ${y1} units; at ${x2} machine hours it is ${y2} units. What is the additional output per additional machine hour?`,
      figure: {
        kind: 'line_chart',
        title: 'Output versus machine hours',
        xLabel: 'machine hours',
        yLabel: 'units per day',
        x: [x1, x2],
        series: [{ name: 'output', values: [y1, y2] }],
      },
      options: [
        { text: `${m} units per machine hour`, errorTag: 'none', rationale: 'Correct: the slope of the line is the change in output per unit change in the input.', correct: true },
        { text: `${num(c, 2)} units per machine hour`, errorTag: 'graph_misread', rationale: `This is the intercept (${c}) — the level at zero hours, not the rate of change.` },
        { text: `${num(y2 - y1, 2)} units per machine hour`, errorTag: 'question_misread', rationale: 'This is the total change in output, not the change per additional hour.' },
        { text: `${num((y2 - y1) / (x1 + x2), 2)} units per machine hour`, errorTag: 'rule_misapplication', rationale: 'The rise was divided by the sum of the two inputs instead of by the difference between them.' },
      ],
      difficulty: 2,
      reasoningType: 'representation_transfer',
      cognitiveMove: 'interpret_representation',
      style: 'graph_choice',
      hints: ['The slope is the change in the vertical quantity divided by the change in the horizontal quantity.', 'Use the difference between the two points, not their sum.'],
      explanation: {
        testing: 'Reading a rate of change (gradient) from two data points and distinguishing it from level and total change.',
        matters: `The two coordinate pairs (${x1}, ${y1}) and (${x2}, ${y2}).`,
        irrelevant: `The starting day numbering and the absolute level of the curve — only the differences matter for a gradient.`,
        concept: 'Gradient = change in y divided by change in x.',
        why: 'A rate of change must be normalised by the size of the input change, otherwise it is just a total difference.',
        steps: [`$\\Delta y = ${y2} - ${y1} = ${y2 - y1}$`, `$\\Delta x = ${x2} - ${x1} = ${x2 - x1}$`, `Gradient $= ${y2 - y1}/${x2 - x1} = ${m}$ units per machine hour`],
        trap: 'Reporting the intercept or the raw rise; both appear in the chart and look like "the answer".',
        transfer: 'Marginal rates (cost per unit, output per hour, return per euro) are all gradients in disguise.',
      },
      verification: { solver: 'datainterp.gradient', payload: { x1, y1, x2, y2 } },
    },
    rng,
  );
}

/* ================================================================== */
/* D04 — probability & statistics                                     */
/* ================================================================== */

export function genMeanMedian(rng: Rng): Question {
  const base = [rng.int(2, 9), rng.int(4, 14), rng.int(5, 16), rng.int(6, 18), rng.int(7, 20)];
  const outlier = rng.pick([95, 120, 150]);
  // The extreme value is always included: it is what makes mean and median differ, which is
  // the pedagogical point of the item and prevents the two quantities from coinciding.
  const values = [...base, outlier];
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const median = sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  const ask = rng.pick(['mean', 'median', 'contrast'] as const);
  if (ask === 'contrast') {
    return assemble(
      {
        id: makeId('stat-contrast', rng),
        domainId: 'D04',
        conceptIds: ['C04.mean'],
        label: 'PREREQUISITE',
        stem: `A data set of ${values.length} measurements contains the values ${values.join(', ')}. Which statement about mean and median is correct?`,
        options: [
          {
            text: `The mean (${num(mean, 2)}) is ${mean > median ? 'greater' : 'smaller'} than the median (${num(median, 2)}) because the extreme value pulls the mean.`,
            errorTag: 'none',
            rationale: 'Correct: the mean reacts to every value, the median only to the middle of the ordered list.',
            correct: true,
          },
          { text: `Both are equal (${num(mean, 2)}).`, errorTag: 'concept_confusion', rationale: 'They coincide only in symmetric distributions; here the extreme value breaks the symmetry.' },
          { text: 'The median is always greater than the mean for any data set.', errorTag: 'wrong_assumption', rationale: 'The relationship depends on the direction of the skew, and for symmetric data the two are equal.' },
          { text: 'The median cannot be determined without knowing the measurement units.', errorTag: 'prerequisite_gap', rationale: 'Units shift both values equally; they do not affect which is larger.' },
        ],
        difficulty: 4,
        reasoningType: 'conceptual_discrimination',
        cognitiveMove: 'general_case',
        style: 'statement_compare',
        hints: ['Sort the values and find the middle one.', 'Ask what an extreme value does to a sum (mean) compared with a position (median).'],
        explanation: {
          testing: 'Understanding how summary statistics respond to extreme values.',
          matters: 'The ordered list, and the fact that the mean uses the sum while the median uses the middle position.',
          concept: 'Robustness of the median versus sensitivity of the mean.',
          why: 'A single large value adds to the total (shifting the mean) but only occupies the last position (leaving the middle unchanged).',
          steps: [`Ordered: ${sorted.join(', ')}`, `Median: ${num(median, 2)}`, `Mean: ${num(mean, 2)} — the extreme value moves it ${mean > median ? 'upwards' : 'downwards'}`],
          trap: 'Assuming mean and median are interchangeable summaries of "the typical value".',
          transfer: 'Reported average incomes, house prices and processing times are all cases where the choice of summary changes the story.',
        },
      },
      rng,
    );
  }
  const value = ask === 'mean' ? mean : median;
  const other = ask === 'mean' ? median : mean;
  return assemble(
    {
      id: makeId('stat', rng),
      domainId: 'D04',
      conceptIds: ['C04.mean'],
      label: 'PREREQUISITE',
      stem: `A laboratory records ${values.length} measurements: ${values.join(', ')}. What is the ${ask} of this sample?`,
      options: [
        { text: `${num(value, 3)}`, errorTag: 'none', rationale: `Correct: this is the ${ask} of the sample, computed from all ${values.length} observations.`, correct: true },
        { text: `${num(other, 3)}`, errorTag: 'concept_confusion', rationale: `This is the ${ask === 'mean' ? 'median' : 'mean'}, which differs because the values are not symmetric.` },
        { text: `${num(values.reduce((a, b) => Math.max(a, b)), 3)}`, errorTag: 'rule_misapplication', rationale: 'This is the largest value, not a central tendency measure.' },
        { text: `${num(values.reduce((a, b) => a + b, 0), 3)}`, errorTag: 'question_misread', rationale: 'This is the sum of the values; the mean divides it by the number of observations.' },
      ],
      difficulty: 2,
      reasoningType: 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: [ask === 'mean' ? 'Sum the values and divide by the count.' : 'Sort the values and take the middle one.', 'With an even count the median is the average of the two middle values.'],
      explanation: {
        testing: `Computing the ${ask} and keeping the two summary statistics apart.`,
        matters: `All ${values.length} values; the arithmetic differs between the two statistics.`,
        concept: ask === 'mean' ? 'Arithmetic mean = sum/count.' : 'Median = middle value of the ordered sample.',
        why: 'The mean uses every magnitude; the median uses only position, which is why the median resists extremes.',
        steps: [`Ordered: ${sorted.join(', ')}`, `Sum: ${values.reduce((a, b) => a + b, 0)}, count: ${values.length}`, `Result: ${num(value, 3)}`],
        trap: 'Confusing the two — the classic exam item gives a skewed sample so that the answers differ visibly.',
        transfer: 'Choosing the right summary is itself a decision: averages hide skew, medians hide magnitude.',
      },
      verification: ask === 'mean' ? { solver: 'stat.mean', payload: { values } } : { solver: 'stat.median', payload: { values } },
    },
    rng,
  );
}

export function genProbability(rng: Rng): Question {
  const total = rng.pick([20, 25, 40, 50, 80, 100, 200]);
  let fav = rng.int(1, Math.min(30, total - 1));
  // avoid the case fav/total = 1/2, where the complement would coincide with the answer
  if (2 * fav === total) fav = fav - 1;
  const complement = rng.chance(0.4);
  const p = complement ? 1 - fav / total : fav / total;
  const other = complement ? fav / total : 1 - fav / total;
  const pool: Opt[] = [
    { text: `${num(other, 4)}`, errorTag: 'question_misread', rationale: `This is the probability of the complementary event (${complement ? 'defective' : 'not defective'}).` },
    { text: `${num(fav, 4)}`, errorTag: 'rule_misapplication', rationale: 'This is the number of affected items, not a probability: probabilities lie between 0 and 1.' },
    { text: `${num(p * p, 4)}`, errorTag: 'rule_misapplication', rationale: 'The probability was squared, which would be the chance of two independent draws both having the property.' },
    { text: `${num(fav / (total + fav), 4)}`, errorTag: 'ratio_error', rationale: 'The affected items were divided by the affected plus total items, which is not a probability of this experiment.' },
  ];
  const distractors = distinctOpts(pool, [`${num(p, 4)}`], 3);
  if (distractors.length < 3) throw new Error('genProbability: not enough distinct distractors');
  return assemble(
    {
      id: makeId('prob', rng),
      domainId: 'D04',
      conceptIds: ['C04.prob'],
      label: 'PREREQUISITE',
      stem:
        `In a batch of ${total} items, ${fav} are defective. One item is drawn at random. What is the probability that it is ` +
        `${complement ? '**not** defective' : 'defective'}?`,
      options: [...distractors, { text: `${num(p, 4)}`, errorTag: 'none', rationale: 'Correct: count the favourable outcomes and divide by the total.', correct: true }],
      difficulty: 2,
      reasoningType: 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Probability = favourable outcomes ÷ possible outcomes.', 'For "not", you can either count the other group or subtract from 1.'],
      explanation: {
        testing: 'Counting favourable outcomes and handling the complement, while keeping the result in probability form.',
        matters: `The two counts (${fav} affected out of ${total}).`,
        concept: 'Classical probability with equally likely outcomes.',
        why: 'Each item is equally likely to be drawn, so the chance is the share of the favourable group in the whole batch.',
        steps: [`Possible outcomes: ${total}`, `Favourable: ${complement ? total - fav : fav}`, `Probability: ${num(p, 4)}`],
        trap: 'Giving a count instead of a probability, or answering for the opposite event.',
        transfer: 'Defect rates, response rates and success probabilities in research all use this counting logic.',
      },
      verification: { solver: 'stat.probability', payload: { favourable: fav, total, complement } },
    },
    rng,
  );
}

export function genBaseRate(rng: Rng): Question {
  const total = rng.pick([1000, 2000, 4000, 5000, 10000]);
  const prevalence = rng.pick([0.01, 0.02, 0.05, 0.1]);
  const positivity = rng.pick([0.6, 0.7, 0.8]);
  const affected = total * prevalence;
  const both = affected * positivity;
  const p = positivity; // P(marker | condition) — the conditional quantity asked for
  const joint = both / total;
  const complement = 1 - positivity;
  const prevalenceOnly = prevalence;
  const pool: Opt[] = [
    { text: `${num(joint, 4)}`, errorTag: 'question_misread', rationale: `This is the joint probability of being affected *and* showing the marker ($${num(both, 0)}$${''} of ${total}), not the probability of the marker within the affected group.` },
    { text: `${num(prevalenceOnly, 4)}`, errorTag: 'base_rate_neglect', rationale: 'This is the prevalence of the condition itself, which the question already tells us holds for this person.' },
    { text: `${num(complement, 4)}`, errorTag: 'question_misread', rationale: 'This is the probability that an affected person does *not* show the marker — the complement of the requested quantity.' },
    { text: `${num(prevalence * positivity + 0.1, 4)}`, errorTag: 'rule_misapplication', rationale: 'The two percentages were combined by addition instead of by conditioning within the affected group.' },
    { text: `${num(positivity / 2, 4)}`, errorTag: 'calculation_slip', rationale: 'The conditional probability was halved; within the affected group the marker appears in the stated share of cases.' },
  ];
  const distractors = distinctOpts(pool, [`${num(p, 4)}`], 3);
  if (distractors.length < 3) throw new Error('genBaseRate: not enough distinct distractors');
  return assemble(
    {
      id: makeId('baserate', rng),
      domainId: 'D04',
      conceptIds: ['C04.conditional'],
      label: 'PREREQUISITE',
      stem:
        `In a study population of ${total} people, ${num(prevalence * 100, 0)} % have a certain condition. Among those with the condition, ${num(positivity * 100, 0)} % show a particular marker. ` +
        'A person from the study population is chosen at random and is known to have the condition. What is the probability that this person shows the marker?',
      options: [...distractors, { text: `${num(p, 4)}`, errorTag: 'none', rationale: 'Correct: within the affected group, the marker appears in the stated share of cases.', correct: true }],
      difficulty: 4,
      reasoningType: 'conceptual_discrimination',
      cognitiveMove: 'interpret_representation',
      style: 'statement_compare',
      hints: [
        'The question fixes the group — you are already inside the affected part of the population.',
        'Conditional probability restricts the denominator to the condition.',
      ],
      explanation: {
        testing: 'Reading "given that" correctly and choosing the right denominator.',
        matters: `The size of the affected group (${num(affected, 0)} people) as the reference population.`,
        irrelevant: `The overall population size (${total}) once the condition is known to hold.`,
        concept: 'Conditional probability P(marker | condition) = count(both)/count(condition).',
        why: 'Conditioning removes the rest of the population from consideration, so the base rate drops out of the calculation.',
        steps: [
          `Affected: $${total} \\times ${prevalence} = ${num(affected, 0)}$ people`,
          `Affected with marker: $${num(affected, 0)} \\times ${positivity} = ${num(both, 0)}$ people`,
          `$P = ${num(both, 0)}/${num(affected, 0)} = ${num(p, 4)}$, which is exactly the stated marker share within the affected group.`,
        ],
        trap: 'Multiplying the two probabilities and reporting the joint probability — the classic base-rate error.',
        transfer: 'Diagnostic tests, spam filters and screening programmes are all evaluated with this conditioning logic.',
      },
      verification: { solver: 'stat.bayes_counts', payload: { n_outcome: affected, n_both: both, n_total: total } },
      tags: ['exact'],
    },
    rng,
  );
}

/* ================================================================== */
/* D05 — physics fundamentals                                          */
/* ================================================================== */

export function genWorkPower(rng: Rng): Question {
  const f = rng.pick([20, 40, 50, 100, 200, 250]);
  const d = rng.pick([2, 4, 5, 10, 20, 25]);
  const t = rng.pick([2, 4, 5, 8, 10, 20]);
  const askPower = rng.chance(0.5);
  const work = f * d;
  const power = work / t;
  const context = rng.pick([
    ['A winch', 'lifts a load'],
    ['A conveyor', 'moves material'],
    ['A pump', 'raises water'],
  ]);
  return assemble(
    {
      id: makeId('workpower', rng),
      domainId: 'D05',
      conceptIds: ['C05.energy'],
      label: 'PREPARATION_EXTENSION',
      stem:
        `${context[0]} ${context[1]} with a constant force of ${f} N over a distance of ${d} m. The process takes ${t} s. ` +
        (askPower ? 'What is the average power delivered?' : 'How much work is done?'),
      options: askPower
        ? [
            { text: `${num(power, 2)} W`, errorTag: 'none', rationale: 'Correct: work divided by time.', correct: true },
            { text: `${num(work, 2)} W`, errorTag: 'question_misread', rationale: 'This is the work done, not the power; power is work per unit time.' },
            { text: `${num(f / t, 2)} W`, errorTag: 'rule_misapplication', rationale: 'The distance was omitted: work is force × distance before dividing by time.' },
            { text: `${num(work * t, 2)} W`, errorTag: 'rule_misapplication', rationale: 'The time was multiplied instead of divided — power falls when the same work takes longer.' },
          ]
        : [
            { text: `${num(work, 2)} J`, errorTag: 'none', rationale: 'Correct: work = force × distance.', correct: true },
            { text: `${num(power, 2)} J`, errorTag: 'concept_confusion', rationale: 'This is the power (work per second), not the work.' },
            { text: `${num(f + d, 2)} J`, errorTag: 'rule_misapplication', rationale: 'Force and distance were added rather than multiplied.' },
            { text: `${num(work * t, 2)} J`, errorTag: 'rule_misapplication', rationale: 'The time was included although work does not depend on how long the process takes.' },
          ],
      difficulty: 2,
      reasoningType: 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Work = force × distance along the direction of the force.', 'Power = work ÷ time.'],
      explanation: {
        testing: askPower ? 'Separating work from power and using the time correctly.' : 'Recognising that work does not depend on duration.',
        matters: `Force (${f} N), distance (${d} m)${askPower ? `, time (${t} s)` : ''}.`,
        irrelevant: askPower ? undefined : `The duration (${t} s) is irrelevant for the work itself; it would matter for the power.`,
        concept: 'W = F·d and P = W/t.',
        why: 'Work measures transferred energy; power measures the rate of transfer, so it needs a time.',
        steps: [
          `$W = F \\cdot d = ${f} \\cdot ${d} = ${num(work, 2)}$ J`,
          askPower
            ? `$P = W/t = ${num(work, 2)}/${t} = ${num(power, 2)}$ W`
            : `Unit check: work is measured in joules, so the duration ${t} s does not enter this quantity.`,
        ],
        trap: 'Mixing up the two quantities, or including the time in the work calculation.',
        transfer: 'The same distinction governs electricity bills (energy) versus connection ratings (power).',
      },
      verification: askPower
        ? { solver: 'physics.power', payload: { energy_J: work, time_s: t } }
        : { solver: 'physics.work', payload: { force_N: f, distance_m: d } },
    },
    rng,
  );
}

export function genEfficiency(rng: Rng): Question {
  const input = rng.pick([200, 400, 500, 800, 1000, 2000]);
  const lossPct = rng.pick([10, 20, 25, 30, 40]);
  const useful = input * (1 - lossPct / 100);
  return assemble(
    {
      id: makeId('eff', rng),
      domainId: 'D07',
      conceptIds: ['C07.efficiency'],
      label: 'PREPARATION_EXTENSION',
      stem: `A motor takes ${input} J of electrical energy and delivers ${num(useful, 0)} J of mechanical work. Which statement about its efficiency is correct?`,
      options: [
        { text: `The efficiency is ${num((useful / input) * 100, 1)} %; the rest is lost mainly as heat.`, errorTag: 'none', rationale: 'Correct: efficiency is the useful output divided by the input, and the difference is dissipated.', correct: true },
        { text: `The efficiency is ${num(lossPct, 1)} %; the rest is lost as heat.`, errorTag: 'concept_confusion', rationale: 'This reports the loss share as the efficiency — the two are complementary percentages.' },
        { text: `The efficiency is ${num((input / useful) * 100, 1)} %, which is above 100 %.`, errorTag: 'ratio_error', rationale: 'The ratio was inverted, which would describe input per output and produce a value above 100 % — impossible for a passive device.' },
        { text: `The efficiency cannot be stated because the type of energy changes.`, errorTag: 'wrong_assumption', rationale: 'Efficiency is precisely a comparison of energy forms; the conversion is its purpose.' },
      ],
      difficulty: 2,
      reasoningType: 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Efficiency = useful output ÷ total input.', 'The missing energy is not destroyed — it leaves as waste heat.'],
      explanation: {
        testing: 'Applying the efficiency definition and interpreting the remainder physically.',
        matters: `The input (${input} J) and the useful output (${num(useful, 0)} J).`,
        concept: 'η = useful/input, always below 1 for real devices.',
        why: 'Energy is conserved, so whatever is not delivered as useful work must appear elsewhere, usually as heat.',
        steps: [`$\\eta = ${num(useful, 0)}/${input} = ${num(useful / input, 3)}$ ⇒ ${num((useful / input) * 100, 1)} %`, `Losses: $${input} - ${num(useful, 0)} = ${num(input - useful, 0)}$ J`],
        trap: 'Reporting the loss percentage as the efficiency, or inverting the ratio.',
        transfer: 'The same bookkeeping applies to light bulbs, engines, data centres and human organisations: find where the difference goes.',
      },
      verification: { solver: 'physics.efficiency', payload: { useful_J: useful, input_J: input } },
    },
    rng,
  );
}

export function genGasLaw(rng: Rng): Question {
  const p1 = rng.pick([1, 2, 3, 4, 5]);
  const p2 = p1 * rng.pick([2, 3, 4, 5]);
  const v1 = rng.pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20, 24, 30, 36]);
  const v2 = (p1 * v1) / p2;
  return assemble(
    {
      id: makeId('gas', rng),
      domainId: 'D05',
      conceptIds: ['C05.gas'],
      label: 'PREREQUISITE',
      stem: `A fixed amount of gas is held at constant temperature in a container of volume ${v1} litres at a pressure of ${p1} bar. The pressure is raised to ${p2} bar. What is the new volume?`,
      options: [
        { text: `${num(v2, 2)} litres`, errorTag: 'none', rationale: 'Correct: at constant temperature, pressure and volume are inversely proportional.', correct: true },
        { text: `${num(v1 * (p2 / p1), 2)} litres`, errorTag: 'ratio_error', rationale: 'The ratio was applied the wrong way round: a pressure increase must shrink the volume.' },
        { text: `${num(v1, 2)} litres`, errorTag: 'concept_confusion', rationale: 'The volume is claimed to be unchanged, but compressing a gas at constant temperature changes its volume.' },
        { text: `${num(v1 * (1 + (p2 - p1) / p1), 2)} litres`, errorTag: 'rule_misapplication', rationale: 'The pressure increase was applied to the volume as if it were a proportional increase instead of compressing the gas.' },
      ],
      difficulty: 3,
      reasoningType: 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['At constant temperature p₁V₁ = p₂V₂.', 'Decide first whether the volume must grow or shrink.'],
      explanation: {
        testing: 'Using inverse proportionality for a gas under isothermal compression.',
        matters: `The initial pair (p₁ = ${p1} bar, V₁ = ${v1} l) and the new pressure.`,
        concept: 'Boyle’s law p₁V₁ = p₂V₂.',
        why: 'Squeezing the same number of molecules into a smaller space requires a proportionally higher pressure, so volume and pressure move in opposite directions.',
        steps: [`$p_1V_1 = ${p1} \\cdot ${v1} = ${p1 * v1}$`, `$V_2 = ${p1 * v1}/${p2} = ${num(v2, 2)}$ litres`],
        trap: 'Applying the pressure factor in the wrong direction (a very common slip) or forgetting to use the ratio.',
        transfer: 'The same inverse relation explains compressed-air tanks, syringes with a blocked outlet, and the air pocket item in the official hydrostatics exercise.',
      },
      verification: { solver: 'physics.gas_ratio', payload: { p1, p2, v1 } },
    },
    rng,
  );
}

/* ================================================================== */
/* D07 — mechanics & engineering reasoning                            */
/* ================================================================== */

/**
 * Levers and moments — three item shapes, because the concept has three separable ideas:
 *
 *   moment   : the turning effect itself (F · arm)                     → C07.moment, level 2
 *   balance  : equilibrium by equal moments at unequal forces/arms     → C07.moment, level 3
 *   advantage: the mechanical advantage, a pure ratio                  → C07.lever, level 2
 *
 * The earlier single-shape version was unusable: its third distractor simplified algebraically to
 * the correct answer (loadArm + loadArm·(load−effort)/effort = loadArm·load/effort), so every draw
 * was rejected as a duplicate option. Distractors here are the mistakes students actually make —
 * the wrong arm, the inverted ratio, the extra length instead of the total.
 */
export function genLever(rng: Rng): Question {
  const shape: 'moment' | 'balance' | 'advantage' = rng.pick(['moment', 'balance', 'advantage']);

  if (shape === 'moment') {
    const load = rng.pick([60, 80, 120, 150, 200, 240, 300, 400, 500]);
    const barLength = rng.pick([2, 2.4, 3, 3.6, 4]);
    // 0.5 and 1 are excluded: they would make "load · barLength" or "load" coincide with the
    // correct moment for some draws, and two options that denote the same value are a defect.
    const pivotFromLeft = rng.pick([0.4, 0.6, 0.8, 1.2, 1.5]);
    if (pivotFromLeft >= barLength) return genLever(rng);
    const moment = load * pivotFromLeft;
    return assemble(
      {
        id: makeId('moment', rng),
        domainId: 'D07',
        conceptIds: ['C07.moment'],
        label: 'PREPARATION_EXTENSION',
        stem: `A uniform bar ${num(barLength, 2)} m long rests horizontally on a pivot placed ${num(pivotFromLeft, 2)} m from its left end. A load of ${load} N hangs from the left end. What is the moment of this load about the pivot?`,
        figure: { kind: 'lever', loadArm: pivotFromLeft, effortArm: barLength - pivotFromLeft, load },
        options: [
          { text: `${num(moment, 2)} N·m`, errorTag: 'none', rationale: 'Correct: the moment is the force multiplied by the perpendicular distance from the pivot.', correct: true },
          { text: `${num(load * barLength, 2)} N·m`, errorTag: 'irrelevant_data_used', rationale: `The full bar length was used (${num(barLength, 2)} m) instead of the distance from the load to the pivot (${num(pivotFromLeft, 2)} m).` },
          { text: `${num(load, 2)} N·m`, errorTag: 'concept_confusion', rationale: 'The force was reported unchanged — that is the force, not its turning effect, and it is not even in the right unit.' },
          { text: `${num(load / pivotFromLeft, 2)} N·m`, errorTag: 'ratio_error', rationale: 'The force was divided by the distance; the moment is a product, so dividing shrinks it when the arm is short.' },
        ],
        difficulty: 2,
        reasoningType: 'rule_application',
        cognitiveMove: 'execute_rule',
        style: 'numeric_direct',
        hints: ['A moment is force × perpendicular distance from the pivot.', 'Only the distance from the *pivot* to the force matters, not the length of the bar.'],
        explanation: {
          testing: 'Identifying the moment of a force and picking the correct lever arm.',
          matters: `The load (${load} N) and its distance from the pivot (${num(pivotFromLeft, 2)} m).`,
          irrelevant: `The total bar length (${num(barLength, 2)} m) — it looks relevant but the moment uses the distance to the pivot.`,
          concept: 'Moment of a force: $M = F \\cdot d$, with $d$ perpendicular to the force.',
          why: 'A force turns a body more effectively the further from the pivot it acts; the product measures that turning effect.',
          steps: [`$M = F \\cdot d = ${load} \\cdot ${num(pivotFromLeft, 2)}$`, `$M = ${num(moment, 2)}$ N·m`],
          trap: 'Using the whole bar length as the lever arm, or dividing instead of multiplying.',
          transfer: 'The same product decides whether a crane tips, how a wheelbarrow feels and why a long spanner loosens a tight bolt.',
        },
        verification: { solver: 'physics.moment', payload: { force_N: load, arm_m: pivotFromLeft } },
      },
      rng,
    );
  }

  if (shape === 'advantage') {
    const loadArm = rng.pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.8, 1]);
    const ratio = rng.pick([2, 3, 4, 5, 6, 8]);
    const effortArm = loadArm * ratio;
    const advantage = effortArm / loadArm;
    return assemble(
      {
        id: makeId('advantage', rng),
        domainId: 'D07',
        conceptIds: ['C07.lever'],
        label: 'PREPARATION_EXTENSION',
        stem: `A lever has a load arm of ${num(loadArm, 2)} m and an effort arm of ${num(effortArm, 2)} m. What is its mechanical advantage (the factor by which it multiplies the applied effort)?`,
        figure: { kind: 'lever', loadArm, effortArm, load: 100 },
        options: [
          { text: `${num(advantage, 2)}`, errorTag: 'none', rationale: 'Correct: the mechanical advantage is the ratio of the arms, which equals the ratio of the forces.', correct: true },
          { text: `${num(1 / advantage, 2)}`, errorTag: 'ratio_error', rationale: 'The ratio was inverted; this value would describe a lever that makes the work *harder*.' },
          { text: `${num(advantage * advantage, 2)}`, errorTag: 'linearity_assumption', rationale: 'The ratio was squared, as if both arms were multiplied instead of related by a single ratio.' },
          { text: `${num((loadArm + effortArm) / 2, 2)}`, errorTag: 'concept_confusion', rationale: 'The arms were averaged; an average of metres cannot be the dimensionless factor that multiplies a force.' },
        ],
        difficulty: 2,
        reasoningType: 'conceptual_discrimination',
        cognitiveMove: 'general_case',
        style: 'numeric_direct',
        hints: ['Mechanical advantage compares how far you push with how far the load moves — that is the ratio of the arms.', 'It is a pure number with no unit.'],
        explanation: {
          testing: 'The mechanical advantage of a lever as a ratio, and its unitlessness.',
          matters: `Both arm lengths (${num(loadArm, 2)} m and ${num(effortArm, 2)} m).`,
          concept: 'Mechanical advantage: $MA = \\dfrac{\\text{effort arm}}{\\text{load arm}} = \\dfrac{\\text{load}}{\\text{effort}}$.',
          why: 'Energy is conserved, so a longer effort arm means a smaller force over a longer path; the ratio of the arms fixes that factor.',
          steps: [`$MA = ${num(effortArm, 2)} / ${num(loadArm, 2)}$`, `$MA = ${num(advantage, 2)}$ — pushing ${num(advantage, 2)} times as hard as the load per unit of force applied`],
          trap: 'Inverting the ratio (which would describe a lever that makes the task harder) or reporting an average of the two arm lengths.',
          transfer: 'The same ratio describes pulley systems, gear trains and hydraulic presses: in every case the force multiple mirrors a distance penalty.',
        },
        verification: { solver: 'physics.mechanical_advantage', payload: { loadArm_m: loadArm, effortArm_m: effortArm } },
      },
      rng,
    );
  }

  const load = rng.pick([80, 100, 120, 150, 200, 240, 250, 300, 360, 400, 450, 500, 600, 750, 900]);
  const loadArm = rng.pick([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 1.8, 2, 2.5]);
  // ratio 2 is excluded: the "extra length" distractor (ratio − 1) would then equal the load arm.
  const ratio = rng.pick([3, 4, 5, 6, 8]);
  const effortArm = loadArm * ratio;
  const effort = (load * loadArm) / effortArm;
  const shortArm = (loadArm * (load - effort)) / effort;
  return assemble(
    {
      id: makeId('lever', rng),
      domainId: 'D07',
      conceptIds: ['C07.moment', 'C07.lever'],
      label: 'PREPARATION_EXTENSION',
      stem: `A uniform bar of negligible mass rests on a pivot. A load of ${load} N acts at a distance of ${num(loadArm, 2)} m from the pivot. At what distance from the pivot must a downward effort of ${num(effort, 2)} N be applied to keep the bar horizontal?`,
      figure: { kind: 'lever', loadArm, effortArm, load },
      options: [
        { text: `${num(effortArm, 2)} m`, errorTag: 'none', rationale: 'Correct: the moments must balance, so the smaller force needs the longer arm.', correct: true },
        { text: `${num(loadArm, 2)} m`, errorTag: 'concept_confusion', rationale: 'Equal arms would only balance equal forces; here the effort is the smaller force.' },
        { text: `${num(shortArm, 2)} m`, errorTag: 'linearity_assumption', rationale: 'The *additional* length beyond the load arm was computed instead of the total arm from the pivot.' },
        { text: `${num((loadArm * effort) / load, 2)} m`, errorTag: 'ratio_error', rationale: 'The force ratio was applied in the wrong direction; a smaller effort needs the longer arm.' },
      ],
      difficulty: 3,
      reasoningType: 'multi_step_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Balance the moments: force × arm must be equal on both sides.', 'A smaller force needs a proportionally longer arm.'],
      explanation: {
        testing: 'Applying the moment balance and using the inverse relation between force and arm length.',
        matters: `The load (${load} N) and its arm (${num(loadArm, 2)} m).`,
        concept: 'Equilibrium of moments: $F_1 a_1 = F_2 a_2$.',
        why: 'A moment measures the turning effect of a force; equilibrium requires equal turning effects in opposite directions.',
        steps: [`Moment of the load: $${load} \\cdot ${num(loadArm, 2)} = ${num(load * loadArm, 0)}$ N·m`, `Required arm: $${num(load * loadArm, 0)}/${num(effort, 2)} = ${num(effortArm, 2)}$ m`],
        trap: 'Setting the forces equal instead of the moments, which ignores the whole point of a lever.',
        transfer: 'The same balance explains wheelbarrows, crowbars, crane counterweights and the stability item in the official hydrostatics exercise.',
      },
      // The question asks for the *arm*, so it must be checked by the solver that solves for the
      // arm. (Handing the arm to the force-solver rejected every draw of this shape.)
      verification: { solver: 'physics.lever_arm', payload: { load_N: load, loadArm_m: loadArm, effort_N: effort } },
    },
    rng,
  );
}

/**
 * Pressure from force and area, and the reverse — the concept the official hydrostatics exercise
 * assumes (the force on a surface is the pressure multiplied by the area it acts on).
 */
export function genForcePressure(rng: Rng): Question {
  const force = rng.pick([40, 60, 120, 240, 480, 600, 900, 1200, 1500, 2400]);
  const area = rng.pick([0.005, 0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5]);
  const areaCm2 = Math.round(area * 10000);
  const shape = rng.pick(['pressure', 'force'] as const);

  if (shape === 'force') {
    const pressureBar = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]);
    const pressurePa = pressureBar * 100000;
    const resultingForce = pressurePa * area;
    const kN = resultingForce / 1000;
    return assemble(
      {
        id: makeId('forcept', rng),
        domainId: 'D05',
        conceptIds: ['C05.force'],
        label: 'PREREQUISITE',
        stem: `A flat plate of area ${num(area, 3)} m² is exposed to a uniform pressure of ${num(pressureBar, 2)} bar. What force does the pressure exert on the plate, in kN? (1 bar = ${num(100000, 0)} Pa = ${num(100000, 0)} N/m²)`,
        options: [
          { text: `${num(kN, 2)} kN`, errorTag: 'none', rationale: 'Correct: force is pressure multiplied by area, with the pressure converted to N/m² first.', correct: true },
          { text: `${num(resultingForce, 2)} kN`, errorTag: 'unit_conversion', rationale: 'The force in newtons was reported as kilonewtons, so the answer is 1000 times too large.' },
          { text: `${num(pressureBar / area / 1000, 4)} kN`, errorTag: 'ratio_error', rationale: 'The pressure was divided by the area; pressure × area gives force, not pressure ÷ area.' },
          { text: `${num(kN / 10, 2)} kN`, errorTag: 'unit_conversion', rationale: '1 bar is 100 000 Pa, not 10 000 Pa; the centimetre-to-metre factor was applied to the area a second time.' },
        ],
        difficulty: 3,
        reasoningType: 'multi_step_application',
        cognitiveMove: 'execute_rule',
        style: 'numeric_direct',
        hints: ['Convert bar into N/m² first: 1 bar = 100 000 Pa.', 'Then force = pressure × area; divide by 1000 to express the result in kN.'],
        explanation: {
          testing: 'The relation between force, pressure and area, combined with a unit conversion.',
          matters: `The pressure (${num(pressureBar, 2)} bar) and the area (${num(area, 3)} m²).`,
          concept: 'Pressure is force per unit area, so $F = p \\cdot A$.',
          why: 'Pressure is defined as the force spread over an area; multiplying back by the area recovers the total force.',
          steps: [
            `$p = ${num(pressureBar, 2)} \\cdot 100\\,000 = ${num(pressurePa, 0)}$ N/m²`,
            `$F = p \\cdot A = ${num(pressurePa, 0)} \\cdot ${num(area, 3)} = ${num(resultingForce, 0)}$ N`,
            `$F = ${num(kN, 2)}$ kN`,
          ],
          trap: 'Forgetting that bar must be converted to N/m², or losing the factor 1000 between N and kN.',
          transfer: 'The same product gives the force on a dam wall, the load a hydraulic press can raise and the thrust a tyre exerts on the road.',
        },
        verification: { solver: 'physics.force_from_pressure', payload: { pressure_bar: pressureBar, area_m2: area } },
      },
      rng,
    );
  }

  const pressurePa = force / area;
  const pressureKPa = pressurePa / 1000;
  const pressureBar = pressurePa / 100000;
  return assemble(
    {
      id: makeId('press', rng),
      domainId: 'D05',
      conceptIds: ['C05.force'],
      label: 'PREREQUISITE',
      stem: `A force of ${num(force, 0)} N acts uniformly on a surface of ${num(areaCm2, 0)} cm². What pressure does it produce?`,
      options: [
        { text: `${num(pressureKPa, 2)} kPa`, errorTag: 'none', rationale: 'Correct: the area is converted to m² and the force is divided by it.', correct: true },
        { text: `${num(force / areaCm2, 4)} kPa`, errorTag: 'unit_conversion', rationale: 'The area in cm² was used without converting to m², so the result is 10 000 times too large.' },
        { text: `${num(force * area, 2)} kPa`, errorTag: 'ratio_error', rationale: 'The area was multiplied instead of divided; pressure falls as the area grows.' },
        { text: `${num(pressureBar, 4)} kPa`, errorTag: 'unit_conversion', rationale: 'The value in bar was labelled kPa: 1 bar is 100 kPa, so the two units differ by a factor of 100.' },
      ],
      difficulty: 2,
      reasoningType: 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Pressure = force ÷ area.', 'Convert cm² into m² first: 1 m² = 10 000 cm².'],
      explanation: {
        testing: 'Computing pressure and handling an area given in cm².',
        matters: `The force (${num(force, 0)} N) and the area (${num(areaCm2, 0)} cm² = ${num(area, 4)} m²).`,
        concept: '$p = F / A$, with consistent units.',
        why: 'The same force concentrated on a smaller area produces a larger pressure — the reason a nail works and a knife edge cuts.',
        steps: [`$A = ${num(areaCm2, 0)} \\text{cm}^2 = ${num(area, 4)}\\ \\text{m}^2$`, `$p = ${num(force, 0)} / ${num(area, 4)} = ${num(pressurePa, 0)}$ Pa $= ${num(pressureKPa, 2)}$ kPa`],
        trap: 'Dividing by the area in cm² — a factor-10 000 error — or multiplying instead of dividing.',
        transfer: 'The same conversion trap appears in every hydraulics item, and in the official hydrostatics exercise when a depth in metres is turned into a pressure in bar.',
      },
      verification: { solver: 'physics.pressure_from_force', payload: { force_N: force, area_m2: area } },
    },
    rng,
  );
}

export function genFlowContinuity(rng: Rng): Question {
  const a1 = rng.pick([4, 6, 8, 10, 12]);
  const v1 = rng.pick([1, 2, 3, 4, 5]);
  const factor = rng.pick([2, 3, 4]);
  const a2 = a1 / factor;
  const v2 = (a1 * v1) / a2;
  return assemble(
    {
      id: makeId('flow', rng),
      domainId: 'D07',
      conceptIds: ['C07.flow'],
      label: 'PREPARATION_EXTENSION',
      stem: `Water flows through a pipe of cross-section ${a1} cm² at a speed of ${v1} m/s. The pipe narrows to ${num(a2, 2)} cm². What is the flow speed in the narrow section?`,
      options: [
        { text: `${num(v2, 2)} m/s`, errorTag: 'none', rationale: 'Correct: the same volume must pass every cross-section per second, so a smaller area means a higher speed.', correct: true },
        { text: `${num(v1 / factor, 2)} m/s`, errorTag: 'inequality_direction', rationale: 'The direction is inverted: narrowing a pipe speeds the flow up, it does not slow it down.' },
        { text: `${num(v1, 2)} m/s`, errorTag: 'concept_confusion', rationale: 'The speed is claimed to be unchanged, which would make the volume flow rate inconsistent between the two sections.' },
        { text: `${num(v1 * factor * factor, 2)} m/s`, errorTag: 'linearity_assumption', rationale: 'The area ratio was applied twice; the relation is linear in the areas.' },
      ],
      difficulty: 3,
      reasoningType: 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['The volume flowing per second is the same in both sections: A₁v₁ = A₂v₂.', 'A narrower pipe forces the same volume through a smaller opening.'],
      explanation: {
        testing: 'Applying a conservation law (constant flow rate) and handling inverse proportionality.',
        matters: `The two cross-sections and the incoming speed.`,
        concept: 'Continuity: A₁v₁ = A₂v₂ for an incompressible fluid.',
        why: 'Liquid neither accumulates nor disappears in a rigid pipe, so the volume crossing each section per second is identical.',
        steps: [`Flow rate: $${a1} \\cdot ${v1} = ${num(a1 * v1, 2)}$ cm²·m/s`, `Speed in the narrow section: $${num(a1 * v1, 2)}/${num(a2, 2)} = ${num(v2, 2)}$ m/s`],
        trap: 'Assuming the speed stays the same, or scaling in the wrong direction.',
        transfer: 'The same reasoning covers traffic flow at a narrowing, blood flow in arteries, and queue throughput in operations.',
      },
      verification: { solver: 'physics.flow_continuity', payload: { area1: a1, velocity1: v1, area2: a2 } },
    },
    rng,
  );
}

/* ================================================================== */
/* D08 — computational & algorithmic reasoning                        */
/* ================================================================== */

export function genBinary(rng: Rng): Question {
  let bits = '';
  do {
    bits = Array.from({ length: rng.int(4, 8) }, () => (rng.chance(0.5) ? '1' : '0')).join('');
  } while (bits === bits.split('').reverse().join('') || !bits.includes('1'));
  const value = parseInt(bits, 2);
  const reversed = bits.split('').reverse().join('');
  const reversedValue = parseInt(reversed, 2);
  return assemble(
    {
      id: makeId('bin', rng),
      domainId: 'D08',
      conceptIds: ['C08.binary'],
      label: 'PREPARATION_EXTENSION',
      stem: `In binary notation, a sensor reports the value $${bits}_2$. What is this value in decimal notation?`,
      options: [
        { text: `${value}`, errorTag: 'none', rationale: 'Correct: each position is a power of two, counted from the right.', correct: true },
        { text: `${reversedValue === value ? value + 1 : reversedValue}`, errorTag: 'component_confusion', rationale: 'The bits were read from the wrong end: place values are assigned starting at the right-hand bit.' },
        { text: `${bits.split('').filter((b) => b === '1').length}`, errorTag: 'concept_confusion', rationale: 'This counts the number of ones, which is not a binary-to-decimal conversion.' },
        { text: `${value * 2}`, errorTag: 'calculation_slip', rationale: 'This is the value of the same bit pattern with one extra trailing zero.' },
      ],
      difficulty: 2,
      reasoningType: 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['The rightmost bit has place value 1, then 2, 4, 8, …', 'Add the place values of all positions containing a 1.'],
      explanation: {
        testing: 'Understanding positional notation — the conceptual basis of binary, decimal and any other base.',
        matters: 'The position of each bit counted from the right.',
        concept: 'Place-value representation.',
        why: 'A base defines what each position is worth; reading bits from the wrong end silently produces a different number.',
        steps: [`Bits: $${bits}$`, `Place values from the right: 1, 2, 4, 8, …`, `Sum of the positions holding a 1: $${value}$`],
        trap: 'Reading the string left-to-right as if the leftmost bit were the least significant.',
        transfer: 'The same positional logic underlies base conversion, digital ranges (n bits give 2ⁿ values) and hexadecimal notation.',
      },
      verification: { solver: 'comp.binary_to_decimal', payload: { bits } },
    },
    rng,
  );
}

export function genLoopTrace(rng: Rng): Question {
  const start = rng.pick([1, 2, 3, 5, 10]);
  const step = rng.pick([2, 3, 5, 10]);
  const iterations = rng.int(3, 6);
  const op = rng.chance(0.5) ? 'add' : 'multiply';
  let value = start;
  const trace: number[] = [];
  for (let i = 0; i < iterations; i++) {
    value = op === 'add' ? value + step : value * step;
    trace.push(value);
  }
  const offByOne = op === 'add' ? start + step * (iterations - 1) : trace[Math.max(0, iterations - 2)];
  return assemble(
    {
      id: makeId('loop', rng),
      domainId: 'D08',
      conceptIds: ['C08.trace'],
      label: 'PREPARATION_EXTENSION',
      stem:
        `Consider the following procedure:\n\n` +
        `\`\`\`\nvalue ← ${start}\nrepeat ${iterations} times:\n    value ← value ${op === 'add' ? '+' : '×'} ${step}\noutput value\n\`\`\`\n\nWhat does the procedure output?`,
      options: [
        { text: `${value}`, errorTag: 'none', rationale: `Correct: the loop body runs exactly ${iterations} times, giving ${trace.join(' → ')}.`, correct: true },
        { text: `${offByOne}`, errorTag: 'calculation_slip', rationale: `This corresponds to ${iterations - 1} iterations instead of ${iterations} — the classic off-by-one error.` },
        { text: `${op === 'add' ? start + step : start * step}`, errorTag: 'question_misread', rationale: 'Only the first iteration was performed; the loop repeats.' },
        { text: `${start}`, errorTag: 'concept_confusion', rationale: 'This is the initial value; the loop modifies it before the output.' },
      ],
      difficulty: 2,
      reasoningType: 'multi_step_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Trace the value after each pass through the loop and write the intermediate values down.', 'Count the passes carefully: "repeat n times" means exactly n executions.'],
      explanation: {
        testing: 'Tracing a simple iterative procedure exactly, including the number of repetitions.',
        matters: `The initial value, the operation and the number of iterations.`,
        concept: 'Deterministic loop execution (state update per iteration).',
        why: 'Each pass replaces the variable with the result of the operation applied to its previous value, so the sequence is a recurrence.',
        steps: [`Iteration values: ${trace.join(', ')}`, `Output: ${value}`],
        trap: 'Off-by-one: performing one iteration too few (or too many), which produces a value that looks plausible.',
        transfer: 'Loop tracing is the basis of algorithm reading, spreadsheet recalculation and compound-growth formulas.',
      },
      verification: { solver: 'comp.loop_trace', payload: { start, step, iterations, op } },
    },
    rng,
  );
}

export function genComplexity(rng: Rng): Question {
  const n = rng.pick([1000, 10000, 100000]);
  const kind = rng.pick(['linear', 'quadratic', 'log', 'nlog'] as const);
  const log2n = Math.round(Math.log2(n));
  const values = {
    linear: n,
    quadratic: n * n,
    log: log2n,
    nlog: Math.round(n * Math.log2(n)),
  };
  const fmt = (x: number) => (x >= 1e6 ? x.toExponential(1).replace('e+', ' · 10^') : `${x}`);
  const why: Record<typeof kind, string> = {
    linear: 'A single pass over n items performs n operations.',
    quadratic: 'A nested loop over n items performs about n² operations.',
    log: 'Repeated halving needs about log₂(n) steps.',
    nlog: 'A pass over the data plus a divide-and-conquer step needs about n log n operations.',
  };
  const rationale: Record<typeof kind, string> = {
    linear: 'That would be the quadratic figure — a nested loop, not a single pass.',
    quadratic: 'That is the linear figure — a single pass, which is far cheaper than a nested loop.',
    log: 'That is the linear figure: halving does not visit every item.',
    nlog: 'That is the linear figure: the divide-and-conquer overhead is missing.',
  };
  const names: Record<typeof kind, string> = { linear: 'linear', quadratic: 'quadratic', log: 'logarithmic', nlog: 'linear in n log n' };
  // Wrong options are the other three growth classes, as numbers. They are guaranteed to be
  // distinct because the classes differ by more than an order of magnitude for n ≥ 1000 — and the
  // option texts contain no stray numbers that the ambiguity scan could read as a coincidence.
  const wrong = (Object.keys(values) as (keyof typeof values)[]).filter((k) => k !== kind);
  const correct = `${fmt(values[kind])} steps`;
  const wrongTexts = wrong.map((k) => `${fmt(values[k])} steps`);
  if (new Set([correct, ...wrongTexts]).size !== 4) return genComplexity(rng);
  return assemble(
    {
      id: makeId('complex', rng),
      domainId: 'D08',
      conceptIds: ['C08.growth'],
      label: 'PREPARATION_EXTENSION',
      stem: `An algorithm processes a data set of ${n} items. Its running time grows ${names[kind]}. Approximately how many basic steps does it perform?`,
      options: [
        { text: correct, errorTag: 'none', rationale: `Correct: ${why[kind]}`, correct: true },
        { text: wrongTexts[0], errorTag: 'linearity_assumption', rationale: rationale[wrong[0] as typeof kind] },
        { text: wrongTexts[1], errorTag: 'concept_confusion', rationale: rationale[wrong[1] as typeof kind] },
        { text: wrongTexts[2], errorTag: 'rule_misapplication', rationale: rationale[wrong[2] as typeof kind] },
      ],
      difficulty: 3,
      reasoningType: 'estimation_scaling',
      cognitiveMove: 'effect_of_change',
      style: 'numeric_direct',
      hints: ['Substitute the size into the growth expression rather than guessing a magnitude.', 'log₂(1000) ≈ 10, log₂(10 000) ≈ 13, log₂(100 000) ≈ 17.'],
      explanation: {
        testing: 'Reading a growth class as an arithmetic prediction, with only order-of-magnitude accuracy required.',
        matters: `The size of the input (${n}) and the growth class.`,
        concept: 'Growth classes: constant, logarithmic, linear, n log n, quadratic.',
        why: 'The growth class, not the constant factor, decides whether an approach remains feasible as the data grows — quadratic behaviour becomes impossible long before linear behaviour notices.',
        steps: [`Growth class: ${names[kind]}`, why[kind], `Result: about ${fmt(values[kind])} steps`],
        trap: 'Confusing the classes (especially linear with quadratic) or forgetting that logarithms grow extremely slowly.',
        transfer: 'The same reasoning predicts database performance, the feasibility of simulations and why sorting is preferred over naive pairwise comparison.',
      },
    },
    rng,
  );
}

export function genBreakEven(rng: Rng): Question {
  const fixed = rng.pick([2000, 4000, 5000, 8000, 10000, 20000]);
  const price = rng.pick([20, 25, 40, 50, 80]);
  const margin = rng.pick([5, 10, 15, 20, 25, 40]);
  const variable = Math.max(1, price - margin);
  const contribution = price - variable; // always positive by construction
  const breakEven = fixed / contribution;
  return assemble(
    {
      id: makeId('breakeven', rng),
      domainId: 'D10',
      conceptIds: ['C10.breakeven'],
      label: 'PREPARATION_EXTENSION',
      stem:
        `A small manufacturer has fixed costs of €${fixed} per month. Each unit sells for €${price} and causes variable costs of €${variable}. ` +
        'How many units must be sold per month to break even?',
      options: [
        { text: `${num(breakEven, 1)} units`, errorTag: 'none', rationale: 'Correct: the fixed costs are covered by the contribution margin of each unit.', correct: true },
        { text: `${num(fixed / price, 1)} units`, errorTag: 'model_assumption_error', rationale: 'The variable costs were ignored, which overstates the coverage per unit and understates the required quantity.' },
        { text: `${num(fixed / variable, 1)} units`, errorTag: 'rule_misapplication', rationale: 'The fixed costs were divided by the variable cost per unit, which is not a contribution margin.' },
        { text: `${num(fixed / (price + variable), 1)} units`, errorTag: 'sign_error', rationale: 'Costs per unit were added to the price instead of being subtracted from it.' },
      ],
      difficulty: 3,
      reasoningType: 'optimisation_reasoning',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Each unit contributes (price − variable cost) towards the fixed costs.', 'Divide the fixed costs by this contribution.'],
      explanation: {
        testing: 'Break-even reasoning: covering a fixed block of costs with a per-unit margin.',
        matters: `Fixed costs (€${fixed}), price (€${price}) and variable cost (€${variable}).`,
        concept: 'Break-even quantity = fixed costs divided by the contribution margin per unit.',
        why: 'Below this quantity the contribution cannot cover the fixed block; above it every additional unit adds profit.',
        steps: [`Contribution per unit: $${price} - ${variable} = ${contribution}$ €`, `Break-even: $${fixed}/${contribution} = ${num(breakEven, 1)}$ units`],
        trap: 'Dividing by the price instead of the margin — a mistake that understates the required volume substantially.',
        transfer: 'The same structure answers "how many subscriptions cover platform costs?" and "how many inspections justify a new hire?".',
      },
      verification: { solver: 'finance.breakeven', payload: { fixedCost: fixed, price, variableCost: variable } },
    },
    rng,
  );
}

export function genOpportunityCost(rng: Rng): Question {
  const tuition = rng.pick([0, 500, 1000, 2000]);
  const materials = rng.pick([200, 300, 500, 800]);
  const forgone = rng.pick([9000, 12000, 15000, 18000, 24000]);
  const total = tuition + materials + forgone;
  return assemble(
    {
      id: makeId('oppcost', rng),
      domainId: 'D10',
      conceptIds: ['C10.opportunity'],
      label: 'PREPARATION_EXTENSION',
      stem:
        `A student considers a one-year full-time programme. Tuition is €${tuition}, materials cost €${materials}, and taking the programme means giving up a job that would have paid €${forgone} that year. ` +
        'What is the economic (opportunity) cost of the year of study?',
      options: [
        { text: `€${num(total, 0)}`, errorTag: 'none', rationale: 'Correct: economic cost includes the explicit outlays plus the value of the best alternative forgone.', correct: true },
        { text: `€${num(tuition + materials, 0)}`, errorTag: 'concept_confusion', rationale: 'This counts only the explicit payments and ignores the forgone income — the largest component here.' },
        { text: `€${num(forgone, 0)}`, errorTag: 'concept_confusion', rationale: 'This counts only the forgone income and omits the cash outlays.' },
        { text: `€${num(tuition + materials + forgone * 2, 0)}`, errorTag: 'rule_misapplication', rationale: 'The forgone income was counted twice.' },
      ],
      difficulty: 3,
      reasoningType: 'conceptual_discrimination',
      cognitiveMove: 'classify_situation',
      style: 'numeric_direct',
      hints: ['Economic cost = money actually spent + the value of what you give up.', 'The salary is not paid out, but it is still the largest part of the cost.'],
      explanation: {
        testing: 'Distinguishing accounting cost (cash outflows) from economic cost (including the best forgone alternative).',
        matters: `All cash outlays (${tuition} + ${materials}) and the forgone salary (${forgone}).`,
        concept: 'Opportunity cost = explicit cost + value of the best alternative forgone.',
        why: 'A decision costs what you give up by making it; the salary is given up even though no invoice is issued.',
        steps: [`Explicit: $${tuition} + ${materials} = ${tuition + materials}$ €`, `Plus forgone income: $${forgone}$ €`, `Economic cost: $${total}$ €`],
        trap: 'Reporting only the visible costs — the standard mistake in personal-finance and business-case reasoning.',
        transfer: 'Opportunity cost also governs the inventory model (capital tied up in stock) and any "use it or sell it" decision.',
      },
      verification: { solver: 'econ.opportunity_cost', payload: { explicit: [tuition, materials], bestForgone: forgone } },
    },
    rng,
  );
}

export function genElasticityDirection(rng: Rng): Question {
  const pct = rng.pick([5, 10, 15, 20, 25]);
  const elasticity = rng.pick([0.5, 0.8, 1.2, 1.5, 2]);
  const change = Math.abs(elasticity * pct);
  const elastic = elasticity > 1;
  return assemble(
    {
      id: makeId('elastic', rng),
      domainId: 'D10',
      conceptIds: ['C10.elasticity'],
      label: 'PREPARATION_EXTENSION',
      stem: `The price of a product rises by ${pct} %. The price elasticity of demand (in absolute value) is ${num(elasticity, 1)}. What happens to the quantity demanded, and what happens to total revenue if the estimate is accurate?`,
      options: [
        {
          text: `The quantity falls by about ${num(change, 1)} %, and total revenue ${elastic ? 'falls because demand is elastic' : 'rises because demand is inelastic'}.`,
          errorTag: 'none',
          rationale: 'Correct: the percentage change is the elasticity times the price change, and the revenue direction is decided by whether demand is elastic or inelastic.',
          correct: true,
        },
        {
          text: `The quantity falls by about ${num(change, 1)} %, and total revenue rises in every case because the price is higher.`,
          errorTag: 'concept_confusion',
          rationale: 'Revenue is price × quantity: a higher price only raises revenue if the quantity does not fall proportionally more.',
        },
        {
          text: `The quantity rises by about ${num(change, 1)} %, following the price rise.`,
          errorTag: 'causal_direction_reversed',
          rationale: 'Higher prices reduce demanded quantity (for ordinary goods); the direction is reversed here.',
        },
        {
          text: `The quantity changes by about ${num(pct, 1)} %, because the price change carries over one to one.`,
          errorTag: 'irrelevant_data_used',
          rationale: 'The elasticity is the multiplier that translates a price change into a quantity change; ignoring it (using a factor of 1) discards the information given.',
        },
      ],
      difficulty: 4,
      reasoningType: 'causal_reasoning',
      cognitiveMove: 'effect_of_change',
      style: 'effect_direction',
      hints: ['Quantity change = elasticity × price change (in absolute value), in the opposite direction.', 'Revenue moves with price only if demand is inelastic (elasticity below 1).'],
      explanation: {
        testing: 'Translating an elasticity statement into a predicted quantity change and a revenue consequence.',
        matters: `The price change (${pct} %) and the elasticity (${num(elasticity, 1)}).`,
        concept: 'Elasticity = %Δquantity / %Δprice; elastic demand (|η| > 1) means revenue falls when price rises.',
        why: 'Elasticity is a proportional relation: it converts a relative price change into a relative quantity change, and the revenue effect is the product of the two opposing movements.',
        steps: [
          `Quantity change: $${pct} \\\\% \\times ${num(elasticity, 1)} = ${num(change, 1)}\\\\%$ in the opposite direction`,
          `${elastic ? 'Elastic demand (|η| > 1): the quantity falls proportionally more than the price rises, so revenue falls.' : 'Inelastic demand (|η| < 1): the quantity falls proportionally less than the price rises, so revenue rises.'}`,
        ],
        trap: 'Assuming a price rise always increases revenue, or applying the price change one-to-one to the quantity.',
        transfer: 'Elasticity reasoning guides pricing, tax incidence and the effect of a subsidy in any market description.',
      },
      verification: { solver: 'econ.elasticity_direction', payload: { priceChangePct: pct, elasticity } },
    },
    rng,
  );
}

/* ================================================================== */
/* D13 — scaling and model assumptions (numeric support)              */
/* ================================================================== */

export function genScaling(rng: Rng): Question {
  const factor = rng.pick([2, 3, 4]);
  const kind = rng.pick(['area', 'volume', 'square_law', 'inverse_square'] as const);
  const map: Record<typeof kind, { text: string; answer: string; why: string; wrongs: [string, string][] }> = {
    area: {
      text: `A rectangle’s sides are both scaled by a factor of ${factor}. By what factor does its area change?`,
      answer: `by a factor of ${factor * factor}`,
      why: 'Area scales with the product of two lengths.',
      wrongs: [[`by a factor of ${factor}`, 'This treats area as if it were a length.'], ['it stays the same', 'Both dimensions change, so the area must change.'], [`by a factor of ${factor ** 3}`, 'That is the scaling of a volume, which has three length dimensions.']],
    },
    volume: {
      text: `A cube is scaled up by a factor of ${factor} in all three dimensions. By what factor does its volume change?`,
      answer: `by a factor of ${factor ** 3}`,
      why: 'Volume scales with the product of three lengths.',
      wrongs: [[`by a factor of ${factor}`, 'A single length factor is not enough for a volume.'], [`by a factor of ${factor * factor}`, 'That is the scaling of a surface, not of a volume.'], ['it stays the same', 'All three dimensions change.']],
    },
    square_law: {
      text: `A model is built at a scale of 1 : ${factor}. The strength of a component in the model is proportional to its cross-sectional area. If the real component must carry ${factor ** 2} times the model load, what can be said about the stress (force per area)?`,
      answer: 'the stress is the same, because both force and area scale with the square of the length',
      why: 'When force and area scale with the same factor, the ratio — the stress — is unchanged; this is the basis of scaling laws.',
      wrongs: [['the stress doubles with each scale factor', 'Stress is a ratio of force to area; scaling both leaves the ratio unchanged.'], ['the stress becomes one quarter', 'That would require the area to grow faster than the force.'], ['stress cannot be compared across scales', 'Comparability is exactly what scaling laws establish, provided all dimensions scale together.']],
    },
    inverse_square: {
      text: `A quantity spreads uniformly from a point source. If the distance is multiplied by ${factor}, by what factor does the intensity (amount per unit area) change?`,
      answer: `it falls by a factor of ${factor * factor}`,
      why: 'The same amount is spread over an area that grows with the square of the distance.',
      wrongs: [[`it falls by a factor of ${factor}`, 'The area grows with the square of the distance, not linearly.'], ['it stays the same', 'Spreading over a larger area dilutes the intensity.'], [`it rises by a factor of ${factor * factor}`, 'The direction is inverted: moving away reduces intensity.']],
    },
  };
  const m = map[kind];
  return assemble(
    {
      id: makeId('scaling', rng),
      domainId: 'D13',
      conceptIds: ['C13.scaling'],
      label: 'PREPARATION_EXTENSION',
      stem: m.text,
      options: [
        { text: m.answer, errorTag: 'none', rationale: `Correct: ${m.why}`, correct: true },
        { text: m.wrongs[0][0], errorTag: 'linearity_assumption', rationale: m.wrongs[0][1] },
        { text: m.wrongs[1][0], errorTag: 'concept_confusion', rationale: m.wrongs[1][1] },
        { text: m.wrongs[2][0], errorTag: 'rule_misapplication', rationale: m.wrongs[2][1] },
      ],
      difficulty: 4,
      reasoningType: 'conceptual_discrimination',
      cognitiveMove: 'general_case',
      style: 'statement_compare',
      hints: ['Count how many length dimensions the quantity involves.', 'Areas use two lengths, volumes three; an intensity per unit area uses the inverse of an area.'],
      explanation: {
        testing: 'Scaling laws: recognising how a quantity built from lengths behaves when the length scale changes.',
        matters: 'The number of length dimensions in the definition of the quantity.',
        concept: 'Areas scale with the square, volumes with the cube, intensities per area with the inverse square of the distance.',
        why: 'Every length in a product contributes one factor, so the total factor is the scale factor raised to the number of lengths involved.',
        steps: [`Scale factor: $${factor}$`, `Number of length dimensions in the quantity: ${kind === 'area' ? 2 : kind === 'volume' ? 3 : kind === 'square_law' ? 2 : '−2'}`, `Result: ${m.answer}`],
        trap: 'Treating areas, volumes and intensities as if they scaled like plain lengths — a rich source of exam distractors.',
        transfer: 'Why insects can lift many times their weight, why large animals need thicker bones, and why a model test tank cannot simply be scaled up are all consequences of this reasoning.',
      },
    },
    rng,
  );
}
