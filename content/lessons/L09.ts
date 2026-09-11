import { f, fig, intuition, lesson, mis, official, p, practice, sec, steps, t } from './helpers';

export const L09 = lesson(
  'L09',
  'D09',
  'The order-quantity model: balancing ordering and holding costs',
  'The official Exercise 3 domain — why the optimum sits where two costs are equal, and how the answer moves when the inputs change.',
  ['OFFICIAL_SAMPLE', 'PREREQUISITE'],
  80,
  [
    sec('what_is_it', [
      p(
        'A business needs a fixed number of units per year. Ordering rarely means large orders and low ordering costs but high storage costs; ordering often means small orders, frequent paperwork and low storage. The **order-quantity model** finds the order size $Q$ that minimises the sum of the two annual costs.',
      ),
      p(
        'The official material develops this model in full — assumptions, the two cost terms, the square-root formula, a cost-curve figure, and questions about behaviour when a parameter changes. It also contains a known printing error in one solution (the phrase "total fixed ordering costs" is paired with the wrong expression), which we flag rather than copy: the correct annual ordering cost is $\\tfrac{D}{Q}S$, not $D \\cdot Q \\cdot S$.',
      ),
      official('EX3', 'Seven official questions on the optimal order quantity: the cost structure, the square-root relation, the cost curves and parameter scaling, including one published solution containing a typographical error that we explicitly correct in the lesson text.'),
    ]),
    sec('why_it_matters', [
      p(
        'Three examinable skills live in this single model: setting up a cost expression, finding and interpreting an optimum (where two opposing terms balance), and predicting how the optimum moves when one input changes. The last one is the *effect-of-change* move, and it is where careless formula-substitution fails: doubling demand increases $Q^*$ by a factor $\\sqrt{2} \\approx 1{,}41$, not by 2.',
      ),
      p('The same structure recurs in inventory, cash management, batch production and even server provisioning — which is why the domain carries weight in the broader preparation map.'),
    ]),
    sec('prerequisites', [
      p('Percentages and ratios (L01), reading a cost curve (L03), and square roots done without a calculator ($\\sqrt{2} \\approx 1{,}41$, $\\sqrt{3} \\approx 1{,}73$, $\\sqrt{10} \\approx 3{,}16$).'),
      t(
        ['Assumption', 'Meaning', 'What happens if it fails'],
        [
          ['constant demand D per year', 'the need is steady', 'optimum is only an approximation'],
          ['fixed cost S per order', 'ordering costs do not depend on size', 'quantity discounts create price regimes'],
          ['holding cost H per unit per year', 'storage is proportional to average stock', 'lumpy storage can break proportionality'],
          ['instant replenishment', 'no lead time, no stock-outs', 'safety stock must be added separately'],
        ],
        'The official material lists these assumptions; items often ask which of them a described situation violates.',
      ),
    ]),
    sec('core_knowledge', [
      p('**Average stock** with steady demand is $\\tfrac{Q}{2}$: the level falls from $Q$ to 0 in a straight line, so the average is half the order size.'),
      p('**The two annual costs.** Ordering cost falls as orders get bigger; holding cost rises:'),
      f('C_{\\text{order}}(Q) = \\frac{D}{Q}S \\quad\\text{(number of orders per year × cost per order)}'),
      f('C_{\\text{hold}}(Q) = \\frac{Q}{2}H \\quad\\text{(average stock × holding cost per unit)}'),
      p('**The optimum.** Total cost $C(Q) = \\tfrac{D}{Q}S + \\tfrac{Q}{2}H$ is minimised where the two terms are equal, which gives:'),
      f('Q^{*} = \\sqrt{\\frac{2DS}{H}}, \\qquad C(Q^{*}) = \\sqrt{2DSH}'),
      p('**Order frequency and cycle length** follow from $Q^*$: the number of orders per year is $\\tfrac{D}{Q^*}$, and one cycle lasts $\\tfrac{Q^*}{D}$ years (about $365\\cdot\\tfrac{Q^*}{D}$ days).'),
      p('**Scaling laws.** From $Q^{*} = \\sqrt{2DS/H}$: doubling $D$ multiplies $Q^*$ by $\\sqrt{2}$; doubling $S$ multiplies it by $\\sqrt{2}$; doubling $H$ divides it by $\\sqrt{2}$. Total cost at the optimum scales with $\\sqrt{D}$, $\\sqrt{S}$ and $\\sqrt{H}$ — sub-linearly in every case.'),
      p('**Robustness of the optimum.** Moving away from $Q^*$ costs surprisingly little: ordering twice the optimal quantity (or half of it) raises the total cost by exactly 25 %, because $\\tfrac{C(2Q^*)}{C(Q^*)} = \\tfrac{k + 1/k}{2}$ with $k = 2$. This "flat minimum" is a classic exam-style insight.'),
    ]),
    sec('visual_intuition', [
      fig(
        { kind: 'eoq_curves', D: 3600, S: 50, H: 4, qMax: 900, highlight: 'optimal' },
        'The official cost-curve figure, reconstructed: the ordering curve falls as $1/Q$, the holding curve rises linearly, and the total curve has a shallow minimum exactly where the two cross.',
      ),
      intuition(
        'Two curves, one going down and one going up, and a sum that must have a lowest point. At a minimum you cannot improve by moving either way; the only way that can be true of a falling and a rising curve is that they are balanced — that is *why* the optimum sits at their intersection, and that is the sentence to remember rather than the square root.',
      ),
      fig(
        { kind: 'eoq_curves', D: 3600, S: 50, H: 4, qMax: 900, highlight: 'total' },
        'Look at the flatness of the total curve near the minimum: a 20 % error in Q changes total cost by about 2 %. The model is robust, which is why exact optima matter less than the scaling behaviour.',
      ),
    ]),
    sec('worked_example', [
      p('$D = 3600$ units/year, $S = €50$ per order, $H = €4$ per unit per year. Find $Q^*$, the number of orders per year, and the annual total cost. Then state what happens to $Q^*$ if demand doubles.'),
      steps([
        'Check the units: D in units/year, S in €/order, H in €/(unit·year) — consistent, so the square root is meaningful.',
        'Substitute: $Q^{*} = \\sqrt{\\tfrac{2 \\cdot 3600 \\cdot 50}{4}} = \\sqrt{90000} = 300$ units.',
        'Orders per year: $\\tfrac{3600}{300} = 12$; one order per month, i.e. a cycle of about 30 days.',
        'Total cost at the optimum: $\\sqrt{2 \\cdot 3600 \\cdot 50 \\cdot 4} = \\sqrt{1\\,440\\,000} \\approx 1200$ € per year. Check by adding the terms: ordering $12 \\cdot 50 = 600$, holding $\\tfrac{300}{2}\\cdot4 = 600$ — equal, as the theory requires.',
        'Scaling: doubling $D$ gives $Q^{*} = \\sqrt{2}\\cdot 300 \\approx 424$ units, and the total cost rises by the factor $\\sqrt{2}$ to about 1697 €. Note that the *cost per unit* therefore falls: $\\tfrac{1697}{7200} \\approx 0{,}236$ € versus $\\tfrac{1200}{3600} \\approx 0{,}333$ €.',
      ]),
      mis('Multiplying $Q^*$ by 2 when demand doubles.', 'Only the square root scales: the factor is $\\sqrt{2} \\approx 1{,}41$. This single mistake generates most distractor options in Scaling items.'),
    ]),
    practice('guided_practice', [p('Cost-structure items: write both terms with their units before simplifying. Add-level questions ("what is the total annual cost at $Q = 200$?") are the foundation for the optimisation itself.')], ['C09.assume', 'C09.avg', 'C09.cost'], [1, 2]),
    practice('independent_practice', [p('Compute $Q^*$, then the frequency and the cycle length. Keep the square root exact where possible ($\\sqrt{90\\,000} = 300$) instead of rounding early.')], ['C09.qstar', 'C09.balance'], [2, 3]),
    practice('transfer', [p('Scaling and curve-reading items: no arithmetic is needed, only the direction and the factor. Say "factor $\\sqrt{k}$" or "no change" before computing anything.')], ['C09.scaling', 'C09.curve', 'C09.sensitivity'], [4, 5]),
    practice('dmat_style', [p('Exam-style items with the classic distractors: linear scaling, cost per unit at the optimum, the price-break decision, and a violated assumption to identify.')], ['C09.qstar', 'C09.scaling', 'C09.curve', 'C09.value'], [5, 6]),
    sec('trick_misconception', [
      mis('“Ordering twice as much doubles the total cost.”', 'It raises total cost by 25 %: the flat minimum absorbs large errors in $Q$.'),
      mis('“Minimise the ordering cost.”', 'Minimising one term pushes the other to infinity. Only the *sum* has a minimum, and it lies at their intersection.'),
      mis('“A quantity discount always pays.”', 'Compare full annual costs in both regimes: purchase cost included, ordering and holding costs recomputed at the discounted quantity.'),
      mis('“If demand doubles, cost per unit doubles.”', 'Total cost rises by $\\sqrt{2}$, so cost per unit *falls* by $\\sqrt{2}/2$ — the economy of scale hidden in the square root.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool, one scaling item and one assumption item mandatory. Mastery: $Q^*$ computed correctly, scaling factors $\\sqrt{k}$ answered without computing, and the balance-at-the-optimum sentence reproduced in your own words. Target 85 % with at least one level 6 item correct.')],
      ['C09.assume', 'C09.avg', 'C09.cost', 'C09.qstar', 'C09.balance', 'C09.scaling', 'C09.curve', 'C09.value'],
      [1, 2, 3, 4, 5, 6, 7],
    ),
  ],
);
