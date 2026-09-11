import type { Rng } from '../rng';
import type { Question } from '../types';
import { assemble, distinctOpts, num, SCENARIOS, type GenSpec, type Opt } from './helpers';

/**
 * Optimal order quantity generators — official Exercise 3 domain (D09).
 *
 * Every numeric item is built from a pre-screened pool of parameter triples for which
 * Q* = √(2DS/H) is an exact integer, so the arithmetic stays mental (no notes, no calculator).
 */

const D_POOL = [600, 900, 1200, 1500, 1600, 1800, 2000, 2400, 2700, 3600, 4500, 4800, 5000, 7200, 8000, 12000, 16000];
const S_POOL = [10, 20, 25, 40, 50, 80, 100, 120, 200, 250, 300, 500];
const H_POOL = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25];

interface Triple {
  D: number;
  S: number;
  H: number;
  q: number;
}
const TRIPLES: Triple[] = (() => {
  const out: Triple[] = [];
  for (const D of D_POOL)
    for (const S of S_POOL)
      for (const H of H_POOL) {
        const v = (2 * D * S) / H;
        const r = Math.sqrt(v);
        if (Number.isInteger(r) && r >= 20 && r <= 1500 && Number.isInteger((D * S * 2) / H)) out.push({ D, S, H, q: r });
      }
  return out;
})();

function makeId(tag: string, rng: Rng): string {
  return `gen-${tag}-${rng.int(100000, 999999)}`;
}
function pickTriple(rng: Rng): Triple {
  return rng.pick(TRIPLES);
}

/* ------------------------------------------------------------------ */
/* 1. compute Q*                                                       */
/* ------------------------------------------------------------------ */
export function genEOQCalculate(rng: Rng): Question {
  const t = pickTriple(rng);
  const company = rng.pick(SCENARIOS.companies);
  const goods = rng.pick(SCENARIOS.goods);
  const variant = rng.pick(['standard', 'missing-days', 'inverted-direction'] as const);

  if (variant === 'inverted-direction') {
    return assemble(
      {
        id: makeId('eoq-inv', rng),
        domainId: 'D09',
        conceptIds: ['C09.qstar'],
        label: 'OFFICIAL_SAMPLE',
        stem:
          `${company} currently orders ${goods} in batches of ${t.q} units, and the parameters are D = ${t.D} units per year, S = €${t.S} per order and H = €${t.H} per unit per year. ` +
          'The purchasing manager wants to know whether this batch size is the cost-minimising one. What is the optimal order quantity?',
        options: [
          { text: `$${t.q}$ units`, errorTag: 'none', rationale: 'Correct: substitution into $Q^*=\\sqrt{2DS/H}$ gives exactly this value — the current batch size happens to be optimal.', correct: true },
          { text: `$${num(t.q * 2, 0)}$ units`, errorTag: 'square_root_scaling', rationale: 'Doubling Q* is the error pattern produced by forgetting the square root in √(2DS/H).' },
          { text: `$${num(t.q / 2, 0)}$ units`, errorTag: 'ratio_error', rationale: 'Halving Q* corresponds to dividing by 4 inside the root, i.e. mis-handling the factor 2.' },
          { text: `$${num((2 * t.D * t.S) / t.H, 0)}$ units`, errorTag: 'square_root_scaling', rationale: 'This is the value *inside* the square root (2DS/H), not Q* itself.' },
        ],
        difficulty: 3,
        reasoningType: 'multi_step_application',
        cognitiveMove: 'execute_rule',
        style: 'numeric_direct',
        hints: ['Substitute the three parameters into $Q^*=\\sqrt{2DS/H}$.', 'The numbers were chosen so that the root is exact — check your arithmetic by squaring the result.'],
        explanation: {
          testing: 'Executing the order-quantity formula and verifying the suggestion of a colleague against the model.',
          matters: `D = ${t.D}, S = ${t.S}, H = ${t.H}; the unit is irrelevant as long as D and H refer to the same period.`,
          concept: 'Q* balances ordering cost (D/Q)·S against holding cost (Q/2)·H.',
          why: 'Total cost is a sum of a falling and a rising term, so it has a single minimum where the two terms are equal.',
          steps: [
            `$Q^* = \\sqrt{\\dfrac{2 \\cdot ${t.D} \\cdot ${t.S}}{${t.H}}} = \\sqrt{${(2 * t.D * t.S) / t.H}}$`,
            `$Q^* = ${t.q}$ units`,
            `Check: ordering cost $= ${num((t.D / t.q) * t.S, 2)}$ €/year, holding cost $= ${num((t.q / 2) * t.H, 2)}$ €/year — equal, as required at the optimum.`,
          ],
          trap: 'Leaving the square root out, or mixing up which parameter sits in the denominator (H).',
          transfer: 'The square-root structure appears whenever a fixed cost per transaction trades off against a cost proportional to volume — batch sizes in production, cash withdrawal amounts, and even the size of a file chunk.',
        },
        verification: { solver: 'eoq.qstar', payload: { D: t.D, S: t.S, H: t.H } },
        tags: ['exact'],
      },
      rng,
    );
  }

  return assemble(
    {
      id: makeId('eoq', rng),
      domainId: 'D09',
      conceptIds: ['C09.qstar'],
      label: 'OFFICIAL_SAMPLE',
      stem:
        `${company} sells ${t.D} units of ${goods} per year. Each order costs €${t.S} regardless of the quantity, and holding one unit for one year costs €${t.H}. ` +
        'Which order quantity minimises the total of ordering and holding costs?',
      options: [
        { text: `$${t.q}$ units`, errorTag: 'none', rationale: 'Correct: substitution into the model formula.', correct: true },
        { text: `$${num(t.D / t.q, 0)}$ units`, errorTag: 'question_misread', rationale: 'This is the number of orders per year (D/Q*), not the order quantity.' },
        { text: `$${num((2 * t.D * t.S) / t.H, 0)}$ units`, errorTag: 'square_root_scaling', rationale: 'This is the expression under the root; the square root was not taken.' },
        { text: `$${num(t.q / 2, 0)}$ units`, errorTag: 'concept_confusion', rationale: 'This is half the optimal quantity — the average inventory level in the optimal cycle, not the order size.' },
      ],
      difficulty: 2,
      reasoningType: 'multi_step_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Use $Q^*=\\sqrt{2DS/H}$ with D = annual demand, S = cost per order, H = holding cost per unit per year.', 'Keep track of the units: € per unit per year for H, € per order for S.'],
      explanation: {
        testing: 'Substituting into the order-quantity model and distinguishing the order size from related quantities such as the number of orders or the average stock.',
        matters: `D = ${t.D}, S = ${t.S}, H = ${t.H}.`,
        irrelevant: 'The product name and the company name — the model only needs the three parameters.',
        concept: 'Q* = √(2DS/H): the optimal order quantity balances both cost components.',
        why: 'The optimal quantity equalises the two cost components; solving (D/Q)S = (Q/2)H for Q gives the square-root formula.',
        steps: [
          `$\\dfrac{2DS}{H} = \\dfrac{2 \\cdot ${t.D} \\cdot ${t.S}}{${t.H}} = ${(2 * t.D * t.S) / t.H}$`,
          `$Q^* = ${t.q}$ units`,
          `Resulting cost: $${num((t.D / t.q) * t.S + (t.q / 2) * t.H, 2)}$ € per year, split equally between ordering and holding.`,
        ],
        trap: 'Answering with D/Q (orders per year) or with the expression inside the root; both appear plausible at a glance.',
        transfer: 'Whenever a model result is a square root, the "inside" quantity is a tempting distractor — check the units: only Q* carries the unit of the order size.',
      },
      verification: { solver: 'eoq.qstar', payload: { D: t.D, S: t.S, H: t.H } },
      tags: ['exact'],
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 2. total cost                                                       */
/* ------------------------------------------------------------------ */
export function genEOQTotalCost(rng: Rng): Question {
  const t = pickTriple(rng);
  const atOptimum = rng.chance(0.6);
  const Q = atOptimum ? t.q : Math.round(t.q / 2);
  const ordering = (t.D / Q) * t.S;
  const holding = (Q / 2) * t.H;
  const total = ordering + holding;
  return assemble(
    {
      id: makeId('eoq-tc', rng),
      domainId: 'D09',
      conceptIds: ['C09.cost', 'C09.qstar'],
      label: 'OFFICIAL_SAMPLE',
      stem:
        `A business has an annual demand of D = ${t.D} units, ordering costs of S = €${t.S} per order and holding costs of H = €${t.H} per unit per year. ` +
        `It orders in batches of Q = ${Q} units. What are the total relevant costs (ordering plus holding) per year?`,
      options: [
        ...(() => {
          const pool: Opt[] = [
            { text: `€${num(ordering, 2)}`, errorTag: 'concept_confusion', rationale: 'This counts only the ordering cost; the holding cost for the stock carried is missing.' },
            { text: `€${num(holding, 2)}`, errorTag: 'concept_confusion', rationale: 'This counts only the holding cost; the cost of placing the orders is missing.' },
            { text: `€${num((t.D / (2 * Q)) * t.S + ((2 * Q) / 2) * t.H, 2)}`, errorTag: 'model_assumption_error', rationale: 'Both terms were evaluated at twice the order quantity, which is not the situation described.' },
            { text: `€${num(total + t.S, 2)}`, errorTag: 'calculation_slip', rationale: 'One extra order cost was added, as if an additional order were placed during the year.' },
            { text: `€${num(total * 2, 2)}`, errorTag: 'calculation_slip', rationale: 'The two annual cost terms were counted twice.' },
            { text: `€${num((t.D / Q) * t.S + Q * t.H, 2)}`, errorTag: 'model_assumption_error', rationale: 'The holding cost was computed on the full order quantity Q instead of the average stock Q/2.' },
          ];
          const picked = distinctOpts(pool, [`€${num(total, 2)}`], 3);
          if (picked.length < 3) throw new Error('genEOQTotalCost: not enough distinct distractors');
          return picked;
        })(),
        { text: `€${num(total, 2)}`, errorTag: 'none', rationale: 'Correct: add the two annual cost terms.', correct: true },
      ],
      difficulty: 3,
      reasoningType: 'multi_step_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: [
        'Annual ordering cost = (number of orders per year) × (cost per order) = (D/Q)·S.',
        'Annual holding cost = (average inventory) × (holding cost per unit per year) = (Q/2)·H.',
      ],
      explanation: {
        testing: 'Assembling the total relevant cost from the two components and using the average-inventory idea.',
        matters: `D, S, H and the chosen order quantity Q = ${Q}.`,
        concept: 'TC(Q) = (D/Q)·S + (Q/2)·H.',
        why: 'Each order cycle runs through the whole stock from Q down to 0, so the stock level averages Q/2; and D/Q orders are placed per year.',
        steps: [
          `Orders per year: $${t.D}/${Q} = ${num(t.D / Q, 2)}$ ⇒ ordering cost $${num(t.D / Q, 2)} \\cdot ${t.S} = €${num(ordering, 2)}$`,
          `Average inventory: $${Q}/2 = ${num(Q / 2, 2)}$ ⇒ holding cost $${num(Q / 2, 2)} \\cdot ${t.H} = €${num(holding, 2)}$`,
          `Total: $€${num(total, 2)}$ per year.`,
        ],
        trap: 'Reporting a single cost component, or using Q instead of Q/2 as the average stock.',
        transfer: 'The same "fixed part over a rate plus variable part" structure appears in machine setup costs, subscription models and subscription-versus-usage decisions.',
      },
      verification: { solver: 'eoq.total_cost', payload: { D: t.D, S: t.S, H: t.H, Q } },
      tags: ['exact'],
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 3. orders per year and cycle length                                 */
/* ------------------------------------------------------------------ */
export function genEOQFrequency(rng: Rng): Question {
  const t = pickTriple(rng);
  const useOpt = rng.chance(0.7);
  const Q = useOpt ? t.q : Math.round(t.q / 3);
  const orders = t.D / Q;
  const days = 365 / orders;
  const askDays = rng.chance(0.5);
  return assemble(
    {
      id: makeId('eoq-freq', rng),
      domainId: 'D09',
      conceptIds: ['C09.cost', 'C09.avg'],
      label: 'OFFICIAL_SAMPLE',
      stem: askDays
        ? `A company with an annual demand of ${t.D} units orders ${Q} units at a time. How long does one order cycle last on average (assume 365 days per year)?`
        : `A company with an annual demand of ${t.D} units orders ${Q} units at a time. How many orders does it place per year?`,
      options: askDays
        ? [
            { text: `about ${num(days, 1)} days`, errorTag: 'none', rationale: 'Correct: the cycle covers the time in which Q units are consumed.', correct: true },
            { text: `about ${num(365 / (t.D / (2 * t.q)), 1)} days`, errorTag: 'irrelevant_data_used', rationale: 'The cycle length was computed with a different order quantity (twice Q*), not with the quantity actually used here.' },
            { text: `about ${num(orders, 1)} days`, errorTag: 'question_misread', rationale: 'This is the number of orders per year, not a duration.' },
            { text: `about ${num(365 / Q, 1)} days`, errorTag: 'rule_misapplication', rationale: 'The days per year were divided by the order quantity; the demand rate (D per 365 days) must be used instead.' },
          ]
        : [
            { text: `about ${num(orders, 1)} orders`, errorTag: 'none', rationale: 'Correct: orders per year = annual demand / order quantity.', correct: true },
            { text: `about ${num(orders * 2, 1)} orders`, errorTag: 'calculation_slip', rationale: 'The demand was divided by half the order quantity, which doubles the number of orders.' },
            { text: `about ${num(Q / t.D, 2)} orders`, errorTag: 'ratio_error', rationale: 'The ratio was inverted: Q/D understates the number of orders by many times.' },
            { text: `about ${num(365 / orders, 1)} orders`, errorTag: 'question_misread', rationale: 'This is the length of one order cycle in days, not a number of orders.' },
          ],
      difficulty: 3,
      reasoningType: 'multi_step_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Annual demand divided by the order quantity gives the number of orders in a year.', 'One cycle covers exactly the time needed to consume one order of Q units.'],
      explanation: {
        testing: 'Translating between order quantity, order frequency and cycle time — the practical reading of an inventory model.',
        matters: `The demand rate (${t.D} units per year) and the actual order quantity (${Q} units).`,
        irrelevant: `The ordering cost S = ${t.S} and the holding cost H = ${t.H}: the timing follows from demand and quantity alone.`,
        concept: 'Number of orders per year = D/Q; cycle length = 1/(D/Q) years = 365·Q/D days.',
        why: 'Because demand is constant and known, each batch is consumed at a steady rate and every cycle looks identical.',
        steps: [
          `Orders per year: $${t.D}/${Q} = ${num(orders, 2)}$`,
          `Cycle length: $365/${num(orders, 2)} = ${num(days, 1)}$ days`,
        ],
        trap: 'Using the optimal Q* from the formula when a different order quantity is described, and confusing a duration with a count.',
        transfer: 'The same translation is used for delivery schedules, maintenance intervals and subscription renewals.',
      },
      verification: askDays ? { solver: 'eoq.cycle_days', payload: { D: t.D, Q, S: t.S, H: t.H } } : { solver: 'eoq.orders_per_year', payload: { D: t.D, S: t.S, H: t.H, Q } },
      tags: ['exact'],
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 4. parameter scaling                                                */
/* ------------------------------------------------------------------ */
export function genEOQScaling(rng: Rng): Question {
  const cases: { text: string; answer: string; why: string; wrong: [string, string][] }[] = [
    {
      text: 'the ordering cost per order S is quadrupled',
      answer: 'Q* doubles',
      why: '$Q^* \\propto \\sqrt{S}$: a factor of 4 under the root gives a factor of 2 outside it.',
      wrong: [
        ['Q* quadruples', 'The proportionality is with the square root of S, so a factor of 4 in S gives a factor of 2 in Q*, not 4.'],
        ['Q* is halved', 'The direction is inverted: higher ordering costs make larger, less frequent orders attractive.'],
        ['Q* stays the same', 'Q* depends on S through the square root, so any change in S changes Q*.'],
      ],
    },
    {
      text: 'the annual demand D is quadrupled',
      answer: 'Q* doubles',
      why: '$Q^* \\propto \\sqrt{D}$: four times the demand means twice the optimal batch size — not four times.',
      wrong: [
        ['Q* quadruples', 'A factor of 4 applies to D, but Q* depends on √D.'],
        ['Q* is halved', 'Higher demand increases the optimal batch size; the direction is inverted here.'],
        ['Q* stays the same', 'Demand appears explicitly in the formula, so it cannot cancel out.'],
      ],
    },
    {
      text: 'the holding cost per unit per year H is quadrupled',
      answer: 'Q* halves',
      why: 'H appears in the denominator: $Q^* \\propto 1/\\sqrt{H}$, so quadrupling H halves Q*.',
      wrong: [
        ['Q* doubles', 'The direction is inverted: more expensive storage should lead to smaller, more frequent orders.'],
        ['Q* quarters', 'The square root applies to H as well, so the effect on Q* is a factor of 2, not 4.'],
        ['Q* stays the same', 'H is part of the formula and cannot be ignored.'],
      ],
    },
    {
      text: 'the annual demand D is quadrupled and simultaneously the holding cost H is quadrupled',
      answer: 'Q* stays the same',
      why: 'Both changes enter as √4 = 2 in opposite directions (D in the numerator, H in the denominator), so they cancel exactly.',
      wrong: [
        ['Q* doubles', 'Only the demand effect was considered; the holding cost rises in exactly the same proportion.'],
        ['Q* halves', 'Only the holding-cost effect was considered.'],
        ['Q* quadruples', 'The two effects partially cancel; the result is unchanged, not multiplied by 4.'],
      ],
    },
  ];
  const c = rng.pick(cases);
  return assemble(
    {
      id: makeId('eoq-scale', rng),
      domainId: 'D09',
      conceptIds: ['C09.scaling', 'C09.qstar'],
      label: 'OFFICIAL_SAMPLE',
      stem: `In the order-quantity model, ${c.text}, while all other parameters remain unchanged. How does the optimal order quantity Q* change?`,
      options: [
        { text: c.answer, errorTag: 'none', rationale: `Correct: ${c.why}`, correct: true },
        ...c.wrong.map(([text, rationale]) => ({
          text,
          errorTag: /inverted|direction/i.test(rationale) ? ('inequality_direction' as const) : ('square_root_scaling' as const),
          rationale,
        })),
      ],
      difficulty: 4,
      reasoningType: 'parameter_reasoning',
      cognitiveMove: 'effect_of_change',
      style: 'effect_direction',
      hints: [
        'Look at where the parameter sits in $Q^*=\\sqrt{2DS/H}$ and whether it is inside the root.',
        'A factor $k$ inside the square root becomes $\\sqrt{k}$ outside it.',
      ],
      explanation: {
        testing: 'Reasoning about the square-root structure of the model instead of recomputing it — the exact style of the official parameter questions.',
        matters: 'The position of the parameter in the formula (numerator or denominator) and the fact that the root halves the effect.',
        concept: '$Q^* = \\sqrt{2DS/H}$, so $Q^* \\propto \\sqrt{D}\\sqrt{S}/\\sqrt{H}$.',
        why: 'The optimum equalises two cost terms; because each term is linear in Q while the balance involves the product of the two, the resulting quantity depends on the square root of the ratio.',
        steps: [
          'Write the parameter change as a factor in the formula.',
          'Take the square root of that factor to obtain the effect on Q*.',
          'Check the direction: a parameter in the numerator pushes Q* up, a parameter in the denominator pushes it down.',
        ],
        trap: 'Applying the parameter factor directly to Q* (forgetting the square root) or ignoring the direction of a denominator parameter.',
        transfer: 'The square-root law is the signature of balance models; recognising it is faster than recomputing and far more robust in an exam without notes.',
      },
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 5. which change increases Q*? (statement)                           */
/* ------------------------------------------------------------------ */
export function genEOQDirection(rng: Rng): Question {
  const kind = rng.pick(['increase', 'decrease'] as const);
  const increase = kind === 'increase';
  return assemble(
    {
      id: makeId('eoq-dir', rng),
      domainId: 'D09',
      conceptIds: ['C09.scaling', 'C09.value'],
      label: 'OFFICIAL_SAMPLE',
      stem: `Which single change would ${increase ? 'increase' : 'decrease'} the optimal order quantity Q*?`,
      options: [
        increase
          ? { text: 'An increase in the fixed ordering cost per order S', errorTag: 'none', rationale: 'Correct: higher fixed costs per order make it worthwhile to order more, less often.', correct: true }
          : { text: 'An increase in the holding cost per unit per year H', errorTag: 'none', rationale: 'Correct: more expensive storage makes smaller, more frequent orders attractive.', correct: true },
        increase
          ? { text: 'An increase in the holding cost per unit per year H', errorTag: 'inequality_direction', rationale: 'H sits in the denominator: more expensive storage reduces the optimal quantity — the opposite direction.' }
          : { text: 'An increase in the annual demand D', errorTag: 'inequality_direction', rationale: 'Higher demand increases the optimal quantity, since more units must pass through inventory.' },
        increase
          ? { text: 'A decrease in the annual demand D', errorTag: 'inequality_direction', rationale: 'Lower demand reduces the optimal batch size, because fewer units have to be ordered in total.' }
          : { text: 'An increase in the ordering cost per order S', errorTag: 'inequality_direction', rationale: 'Costlier orders encourage larger batches — that increases Q*.' },
        increase
          ? { text: 'An increase in the value of the stored product', errorTag: 'model_assumption_error', rationale: 'A higher unit value raises the holding cost H (capital tied up, insurance, risk), and H is in the denominator, so Q* falls.' }
          : { text: 'A decrease in the value of the stored product', errorTag: 'model_assumption_error', rationale: 'A lower unit value lowers H, and a lower H makes larger batches attractive, so Q* rises.' },
      ],
      difficulty: 4,
      reasoningType: 'parameter_reasoning',
      cognitiveMove: 'effect_of_change',
      style: 'statement_compare',
      hints: ['Decide for each parameter whether it sits in the numerator or the denominator of 2DS/H.', 'Ask which direction of change makes big batches more (or less) attractive.'],
      explanation: {
        testing: 'The economic logic behind the formula: each parameter pushes the optimum in a definite direction.',
        matters: 'Numerator (D, S) versus denominator (H) and the business meaning of each parameter.',
        concept: 'Q* grows with demand D and ordering cost S, and falls with holding cost H.',
        why: 'Larger batches save ordering costs but lock up more capital, so anything that makes ordering expensive or storage cheap favours big batches.',
        steps: [
          'D ↑ ⇒ Q* ↑ (more units to move).',
          'S ↑ ⇒ Q* ↑ (each order costs more, so order less often).',
          'H ↑ ⇒ Q* ↓ (each unit in stock costs more, so hold less).',
        ],
        trap: 'Treating the formula as a black box and reasoning "more cost ⇒ bigger order" without checking where the parameter sits.',
        transfer: 'This is comparative-statics reasoning: asking how an optimum moves when a parameter changes is more valuable than recomputing it, and it transfers to every optimisation model.',
      },
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 6. curve identification                                             */
/* ------------------------------------------------------------------ */
export function genEOQCurve(rng: Rng): Question {
  const t = pickTriple(rng);
  const ask = rng.pick(['ordering', 'holding', 'total', 'minimum'] as const);
  const stemByAsk: Record<typeof ask, string> = {
    ordering: 'Which curve represents the total fixed ordering cost per year as a function of the order quantity Q?',
    holding: 'Which curve represents the total holding cost per year as a function of the order quantity Q?',
    total: 'Which curve represents the total relevant cost (ordering plus holding) as a function of the order quantity Q?',
    minimum: 'Which line marks the order quantity at which the total relevant cost is minimal?',
  };
  const correct: Record<typeof ask, string> = {
    ordering: 'Curve B — it falls as Q grows',
    holding: 'Curve C — it rises as Q grows',
    total: 'Curve A — it is U-shaped with a minimum',
    minimum: 'Line D — the vertical line at Q*',
  };
  const others: Record<typeof ask, [string, string][]> = {
    ordering: [
      ['Curve A — it falls as Q grows', 'Curve A is the U-shaped total cost; it first falls and then rises.'],
      ['Curve C — it rises as Q grows', 'Curve C rises with Q because more stock is held on average — that is the holding cost.'],
      ['Line D — the vertical line at Q*', 'The vertical line marks the optimal quantity, not a cost curve.'],
    ],
    holding: [
      ['Curve A — it rises as Q grows', 'Curve A is the total cost, which is U-shaped rather than steadily rising.'],
      ['Curve B — it falls as Q grows', 'Curve B falls because larger orders mean fewer orders per year — that is the ordering cost.'],
      ['Line D — the vertical line at Q*', 'The vertical line marks the optimal quantity, not a cost curve.'],
    ],
    total: [
      ['Curve B — it falls as Q grows', 'Curve B keeps falling: it is the ordering cost alone.'],
      ['Curve C — it rises as Q grows', 'Curve C rises steadily: it is the holding cost alone.'],
      ['Line D — the vertical line at Q*', 'The vertical line marks a quantity, not the total cost.'],
    ],
    minimum: [
      ['Curve A — its lowest point', 'The lowest point of curve A gives the minimal cost value, but the question asks which line marks the *quantity* Q*.'],
      ['Curve B — where it crosses curve C', 'The crossing point of the two cost curves lies at the same Q, but the crossing identifies the equality of the two costs; the marked quantity is shown by a vertical line.'],
      ['Curve C — its starting point', 'The starting point of the holding cost corresponds to Q → 0, which is the opposite of the optimum.'],
    ],
  };
  return assemble(
    {
      id: makeId('eoq-curve', rng),
      domainId: 'D09',
      conceptIds: ['C09.curve', 'C09.balance'],
      label: 'OFFICIAL_SAMPLE',
      stem: stemByAsk[ask],
      figure: { kind: 'eoq_curves', D: t.D, S: t.S, H: t.H, qMax: Math.round(t.q * 2.4), highlight: ask === 'minimum' ? 'optimal' : (ask as 'ordering' | 'holding' | 'total') },
      options: (() => {
        const pool = others[ask]
          .filter(([text]) => text !== correct[ask])
          .map(([text, rationale]) => ({ text, errorTag: 'graph_misread' as const, rationale }));
        const picked = distinctOpts(pool, [correct[ask]], 3);
        if (picked.length < 3) throw new Error('genEOQCurve: not enough distinct distractors');
        return [...picked, { text: correct[ask], errorTag: 'none' as const, rationale: 'Correct: the shape of the curve identifies its role.', correct: true }];
      })(),
      difficulty: ask === 'minimum' ? 4 : 3,
      reasoningType: 'representation_transfer',
      cognitiveMove: 'interpret_representation',
      style: 'graph_choice',
      hints: [
        'Ordering cost per year is (D/Q)·S — falling with Q.',
        'Holding cost is (Q/2)·H — rising with Q. Their sum must therefore be U-shaped.',
      ],
      explanation: {
        testing: 'Connecting the algebraic cost terms to their graphical shapes and identifying the optimum on a chart.',
        matters: 'The functional form of each term: one falls like 1/Q, one rises linearly, their sum is U-shaped.',
        irrelevant: 'The exact parameter values: the shapes are determined by the structure of the terms.',
        concept: 'TC(Q) = (D/Q)S + (Q/2)H with the optimum where the two terms are equal.',
        why: 'Large orders reduce the number of orders but increase average stock, so the total cost curve has a single minimum where the two opposing effects balance.',
        steps: [
          'Ordering cost (D/Q)S ⇒ decreasing, convex ⇒ the curve that falls steeply at first.',
          'Holding cost (Q/2)H ⇒ a straight line through the origin with slope H/2.',
          'Their sum ⇒ U-shaped curve whose minimum lies at the intersection of the two components, marked by the vertical line at Q*.',
        ],
        trap: 'Matching curves by habit rather than by shape, and confusing the vertical line (a quantity) with a cost curve.',
        transfer: 'Reading off optima from a chart is a general skill: the minimum of a sum of a decreasing and an increasing function always lies where they cross.',
      },
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 7. the Q/2 question (understanding the derivation)                  */
/* ------------------------------------------------------------------ */
export function genEOQHalf(rng: Rng): Question {
  return assemble(
    {
      id: makeId('eoq-half', rng),
      domainId: 'D09',
      conceptIds: ['C09.avg'],
      label: 'OFFICIAL_SAMPLE',
      stem: 'In the total-cost expression of the model, the holding cost appears as (Q/2)·H. What is the reason for the factor Q/2?',
      options: [
        { text: 'Inventory falls steadily from Q to 0 within each cycle, so Q/2 is the average stock level.', errorTag: 'none', rationale: 'Correct: with constant demand the stock declines linearly, and the average of a linear decline is the midpoint.', correct: true },
        { text: 'Only half of the ordered units are ever stored; the other half is sold immediately.', errorTag: 'wrong_assumption', rationale: 'The model assumes constant demand, so all units pass through storage — nothing is sold instantly.' },
        { text: 'The factor 2 corrects for the square root in the formula for Q*.', errorTag: 'model_assumption_error', rationale: 'The two are separate: √(2DS/H) is the result of the optimisation, while Q/2 comes from the average stock level.' },
        { text: 'H is defined per pair of units, so the quantity must be divided by two.', errorTag: 'definition_misuse', rationale: 'H is defined per unit per year; no such redefinition takes place.' },
      ],
      difficulty: 3,
      reasoningType: 'conceptual_discrimination',
      cognitiveMove: 'explain_or_critique',
      style: 'critique_reasoning',
      hints: ['Sketch the stock level over one cycle: it starts at Q and ends at 0.', 'What is the average of a quantity that decreases at a constant rate from Q to 0?'],
      explanation: {
        testing: 'Understanding the derivation of the cost expression rather than memorising it — the official exercise asks exactly this kind of "why" question.',
        matters: 'The sawtooth pattern of the stock level implied by constant demand.',
        concept: 'Average inventory = Q/2 under constant demand.',
        why: 'The stock level, averaged over one cycle, is the midpoint of a linear decline from Q to 0.',
        steps: [
          'Immediately after a delivery the stock is Q; just before the next delivery it is 0.',
          'With constant demand the decline is linear, so the average is (Q + 0)/2 = Q/2.',
          'Multiplying by H (cost per unit per year) gives the annual holding cost.',
        ],
        trap: 'Treating the formula as arbitrary; also confusing the average stock with the maximum stock.',
        transfer: 'The average-of-a-linear-decline argument appears in queueing, in cash-balance models and in any situation with a linear ramp.',
      },
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 8. non-optimality penalty (sensitivity, extension)                  */
/* ------------------------------------------------------------------ */
export function genEOQSensitivity(rng: Rng): Question {
  const t = pickTriple(rng);
  const tc = (Q: number) => (t.D / Q) * t.S + (Q / 2) * t.H;
  const opt = tc(t.q);
  const doubleQ = tc(2 * t.q);
  const ratio = doubleQ / opt;
  return assemble(
    {
      id: makeId('eoq-sens', rng),
      domainId: 'D09',
      conceptIds: ['C09.sensitivity', 'C09.balance'],
      label: 'PREPARATION_EXTENSION',
      stem: `A company orders twice the optimal quantity (2Q*). By what factor does the total relevant cost (ordering plus holding) increase compared with the cost at the optimum?`,
      options: (() => {
        const pool = [
          { text: 'By a factor of 2', errorTag: 'linearity_assumption' as const, rationale: 'The cost terms move in opposite directions, so the total grows far less than the order quantity does.' },
          { text: 'It stays exactly the same', errorTag: 'concept_confusion' as const, rationale: 'Only at the optimum is the total minimal; any other quantity costs more.' },
          { text: 'By a factor of 4', errorTag: 'linearity_assumption' as const, rationale: 'Doubling a quantity does not quadruple the cost; the two terms offset each other strongly.' },
          { text: 'By a factor of 1.5', errorTag: 'ratio_error' as const, rationale: `The correct factor is ${num(ratio, 3)}: at 2Q* one cost component halves while the other doubles.` },
          { text: 'By a factor of 1.1', errorTag: 'calculation_slip' as const, rationale: `The correct factor is ${num(ratio, 3)}; this value underestimates the effect on the total.` },
        ];
        const picked = distinctOpts(pool, ['By a factor of 1.25'], 3);
        if (picked.length < 3) throw new Error('genEOQSensitivity: not enough distinct distractors');
        return [...picked, { text: 'By a factor of 1.25', errorTag: 'none' as const, rationale: 'Correct: at 2Q* the ordering cost falls to half the optimal value while the holding cost doubles, giving 1.25 times the minimal total.', correct: true }];
      })(),
      difficulty: 6,
      reasoningType: 'optimisation_reasoning',
      cognitiveMove: 'general_case',
      style: 'effect_direction',
      hints: [
        'At Q* the two cost terms are equal. What happens to each of them when Q doubles?',
        'Ordering cost is proportional to 1/Q; holding cost is proportional to Q.',
      ],
      explanation: {
        testing: 'Understanding how flat the cost curve is around the optimum — the practical reason why approximate order quantities are acceptable.',
        matters: 'The fact that at the optimum the two cost terms are equal, and the way each term scales with Q.',
        concept: 'The cost curve around Q* is flat; the penalty for a wrong quantity grows only linearly and asymmetrically.',
        why: 'Doubling Q halves the ordering term and doubles the holding term; starting from two equal terms, the sum becomes 0.5 + 2 = 2.5 times one term, compared with 2 times one term at the optimum — a ratio of 1.25.',
        steps: [
          `At the optimum both terms are equal: each is $€${num(opt / 2, 2)}$ per year, so the minimum total is $€${num(opt, 2)}$.`,
          `At 2Q* the ordering cost halves ($${num(t.S, 2)} \\cdot ${t.D}/(2 \\cdot ${t.q}) = €${num((t.D / (2 * t.q)) * t.S, 2)}$) while the holding cost doubles ($${num(2 * t.q, 0)}/2 \\cdot ${t.H} = €${num(t.q * t.H, 2)}$).`,
          `New total $= €${num(doubleQ, 2)}$, which is $${num(ratio, 3)}$ times the minimum.`,
        ],
        trap: 'Assuming costs scale linearly with quantity, which would predict a factor of 2 or more.',
        transfer: 'Flat minima are why real businesses can round order quantities and why over-precision in optimisation is unnecessary — the same holds in engineering tolerances and tax planning.',
      },
      verification: { solver: 'eoq.sensitivity', payload: { D: t.D, S: t.S, H: t.H, k: 2 } },
      tags: ['extension', 'exact'],
    },
    rng,
  );
}
