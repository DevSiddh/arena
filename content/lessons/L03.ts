import { f, fig, intuition, lesson, mis, p, practice, sec, steps, t } from './helpers';

export const L03 = lesson(
  'L03',
  'D03',
  'Tables, charts and graphs: reading the quantity that was asked for',
  'Charts that lie politely, gradients that mean a rate, and the discipline of reading the axis before the bars.',
  ['OFFICIAL_FIELD_LIST', 'PREREQUISITE'],
  50,
  [
    sec('what_is_it', [
      p(
        'The official instructions state that questions and answer options may contain figures, tables and formulas. In practice that means a table of values, a bar or line chart, or a technical sketch with numbers on it — and the item asks for a quantity that is *not* printed directly: a gradient, a share, a difference, or the point where two curves cross.',
      ),
      p('Data interpretation is therefore not "reading a number". It is choosing the right arithmetic for a quantity that the figure only implies.'),
    ]),
    sec('why_it_matters', [
      p(
        'Every quantitative domain in the module is presented in a figure-and-text format. A student who computes correctly but reads the wrong row, the wrong year or the wrong axis loses the mark just as surely, and — more dangerously — does not notice, because the arithmetic looks right.',
      ),
      p('The official order-quantity exercise supplies a cost-curve figure and asks questions about the minimum and about the behaviour of the two cost components. That is data interpretation and optimisation at the same time, which is exactly the item type this lesson prepares for.'),
    ]),
    sec('prerequisites', [
      p('You need proportional reasoning (L01) and the definition of a rate, because a gradient *is* a rate: the change in the vertical quantity per unit change of the horizontal quantity.'),
      t(
        ['Question wording', 'Quantity asked for', 'Operation'],
        [
          ['“rose by 5 % of the total”', 'absolute change', 'share × total'],
          ['“per additional unit”', 'gradient', 'Δy / Δx'],
          ['“twice as large as”', 'ratio', 'divide the two values'],
          ['“the same years”', 'comparison', 'align the two series first'],
        ],
      ),
    ]),
    sec('core_knowledge', [
      p('**Gradient of a straight line.** The additional cost per unit, the speed, the marginal price — all are gradients:'),
      f('m = \\frac{y_2 - y_1}{x_2 - x_1}', 'Subtract in the same order in numerator and denominator; a sign error here is a reversed conclusion.'),
      p('**Share of a total.** "A produced 240 of 1 200 units" is a ratio: $\\tfrac{240}{1200} = 20\\ \\%$. Watch for a *part of a part*: a share of the 2026 value is not a share of the 2025 total.'),
      p('**Index/relative reasoning.** When only relative changes are given, work with factors: cost index 1,30 and output index 1,60 give a unit-cost index of $\\tfrac{1{,}30}{1{,}60} = 0{,}8125$.'),
      p('**Misleading axes.** A bar chart with a vertical axis starting at 95 exaggerates differences: a change from 96 to 100 looks like a doubling of the visible bar while it is +4 %. Always ask where the axis starts and whether the comparison is absolute or relative.'),
      p('**Interpolation and break-even.** Where two lines cross, the two quantities are equal: set the expressions equal and solve. With a fixed cost $F$, a price $p$ and a variable cost $v$, break-even output is'),
      f('Q_{\\text{BE}} = \\frac{F}{p - v}', 'Only defined when p > v — otherwise no output can ever recover the fixed cost.'),
    ]),
    sec('visual_intuition', [
      fig(
        {
          kind: 'bar_chart',
          title: 'Two charts, one dataset',
          xLabel: 'plant',
          yLabel: 'output',
          categories: ['A', 'B', 'C', 'D'],
          series: [
            { name: 'output', values: [96, 97, 99, 100], color: '#2563eb' },
          ],
        },
        'Values 96 to 100. With an axis starting at 0 the story is "almost equal"; with an axis starting at 95 the same data looks like a steep rise. The data has not changed — the framing has.',
      ),
      intuition(
        'Before computing, answer three questions in one second each: *what* is on each axis, *which* unit, and *which* direction is "better". Gradients turn numbers into meaning; the axis tells you whether a difference is material.',
      ),
      fig(
        {
          kind: 'line_chart',
          title: 'Total cost of two machine settings',
          xLabel: 'output (units)',
          yLabel: 'total cost (€)',
          x: [100, 200, 300, 400],
          series: [
            { name: 'setting 1', values: [4000, 5200, 6400, 7600], color: '#2563eb' },
            { name: 'setting 2', values: [6000, 6800, 7600, 8400], color: '#b45309' },
          ],
        },
        'Setting 2 has the higher fixed cost but the lower gradient. Read on: at some output it becomes the cheaper setting — the crossing point is the answer to a whole family of exam questions.',
      ),
    ]),
    sec('worked_example', [
      p('A table reports total operating cost and total output for five machine settings. The lowest setting produces 200 units at €6 800; the highest produces 500 units at €11 000. What is the additional cost of producing one extra unit between these two settings?'),
      steps([
        'Gradient = Δ(cost) / Δ(output).',
        'Δ(cost) = 11 000 − 6 800 = 4 200 €.',
        'Δ(output) = 500 − 200 = 300 units.',
        'Gradient = $\\tfrac{4200}{300} = 14$ € per unit.',
        'Interpret before answering: the average unit cost at the high setting is $\\tfrac{11000}{500} = 22$ €, so a marginal cost of 14 € is plausible — it must be *below* the average when the average is falling. If your gradient had been 30 €, the average cost would have to rise; the sanity check would have caught it.',
      ]),
      mis('Dividing total cost by total output when the question asks for the *additional* cost of one more unit.', 'Total/output is an average; additional-per-unit is a gradient. Both appear in items, and the wording is the only signal.'),
    ]),
    practice('guided_practice', [p('Read each table twice: once for the axis/unit, once for the quantity asked. Write the operation (share, gradient, ratio, difference) before touching the numbers.')], ['C03.read'], [1, 2]),
    practice('independent_practice', [p('Mixed items where the requested quantity changes from item to item: share, gradient, difference, ratio. Do not assume the pattern from the previous item continues.')], ['C03.read', 'C03.gradient'], [2, 3]),
    practice('transfer', [p('Charts with break-even, index comparisons and a deliberately misleading axis start. Ask “absolute or relative?” and “where does the axis start?” every single time.')], ['C03.gradient', 'C03.distort', 'C01.ratio'], [4, 5]),
    practice('dmat_style', [p('Full exam-style data items: several plausible readings, one defensible answer, and a distractor built from using the wrong quantity.')], ['C03.read', 'C03.gradient', 'C03.distort'], [5, 6]),
    sec('trick_misconception', [
      mis('“The tallest bar is what the question wants.”', 'The question asks for a *computed* quantity. Identify the operation first; only then look at which bars you need.'),
      mis('“Percentages of percentages can be subtracted.”', 'Convert to factors and divide. A share of a share is a product of factors, not a difference of percentages.'),
      mis('“A steep-looking line means a large change.”', 'Steepness depends on the axis scale and on where the axis starts. Always read the tick values.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool. Target 80 %, and every answer accompanied by the operation you chose (share / gradient / ratio / difference). If the operation was wrong, the item is not mastered even when the option matched by luck.')],
      ['C03.read', 'C03.gradient', 'C03.distort'],
      [1, 2, 3, 4, 5, 6],
    ),
  ],
);
