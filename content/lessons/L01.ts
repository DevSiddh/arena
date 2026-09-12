import { f, fig, intuition, lesson, mis, p, practice, sec, steps, t } from './helpers';

export const L01 = lesson(
  'L01',
  'D01',
  'Number sense: ratios, rates, units and estimation',
  'The arithmetic you must be able to do in your head, because the dMAT allows no notes and no calculator.',
  ['OFFICIAL_FIELD_LIST', 'PREREQUISITE'],
  50,
  [
    sec('what_is_it', [
      p(
        'This lesson is about the four moves that every quantitative dMAT item depends on: seeing a **ratio** (a comparison of two quantities), reading a **rate** (a ratio with different units, such as km/h or €/unit), converting **units** without losing track of them, and **estimating** an answer before computing it. ' +
          'Nothing here is advanced mathematics. The difficulty is doing it reliably, quickly, and without writing a page of working.',
      ),
      p(
        'The official material never prints a formula sheet, and its own worked solutions read like mental arithmetic: a depth of 10,000 m becomes "about 1,000 bar" through the rule 10 m ≈ 1 bar, and $\\tfrac{1800 \\cdot 50}{2}$ is recognised as $300$ before it is computed.',
      ),
    ]),
    sec('why_it_matters', [
      p(
        'Every demonstrated domain sits on top of this layer. In hydrostatics you convert metres of water column to bar; in the order-quantity model you form the ratio $\\sqrt{2DS/H}$ and reason about how it changes when one input doubles; in vector work you scale components and read magnitudes. If ratio, unit and estimation reasoning is shaky, the domain lessons will feel like memorisation instead of understanding.',
      ),
      mis(
        '“I will just do it exactly with a calculator later.”',
        'There is no calculator and no notes in the test. Precision comes from the structure of the numbers (cancelling, halving, factorising), not from long division. Practise the structural route until it is the default.',
      ),
    ]),
    sec('prerequisites', [
      p('You need: comfortable multiplication and division of decimals; converting between fractions, decimals and percentages; and the willingness to write down the unit of every number you compute.'),
      t(
        ['Quantity', 'Relation', 'Example'],
        [
          ['Ratio', 'compares two quantities of the same kind', '2 parts cement : 3 parts sand'],
          ['Rate', 'compares quantities of different kinds', '60 km per hour, 4 € per unit'],
          ['Percentage', 'a ratio with 100 as the second term', '15 % = 15/100 = 0,15'],
          ['Scale factor', 'the multiplier between two states', 'factor 1,5 = +50 %'],
        ],
        'The vocabulary is small; the traps live in the direction of each comparison.',
      ),
    ]),
    sec('core_knowledge', [
      p('**1. Percentages combine multiplicatively, not additively.** A change of +20 % then −20 % does not return to the start: $1{,}2 \\cdot 0{,}8 = 0{,}96$, so the net effect is −4 %.'),
      f('\\text{new} = \\text{old} \\cdot (1 + r),\\qquad r = \\frac{\\text{new} - \\text{old}}{\\text{old}}', 'Relative change r; a fall of 20 % is r = −0,2.'),
      p('**2. A ratio of changes divides.** If cost rises by 30 % while output rises by 60 %, the cost *per unit* changes by the factor $\\tfrac{1{,}30}{1{,}60} \\approx 0{,}81$, i.e. −19 %, not −30 %.'),
      p('**3. Units are algebra.** Convert by multiplying with a factor that equals 1, and cancel:'),
      f('\\frac{3\\ \\text{km}}{\\text{h}} \\cdot \\frac{1000\\ \\text{m}}{1\\ \\text{km}} \\cdot \\frac{1\\ \\text{h}}{3600\\ \\text{s}} = 0{,}83\\ \\frac{\\text{m}}{\\text{s}}'),
      p('**4. Estimation is a method, not a guess.** Round the quantities so that the calculation becomes exact: $\\tfrac{1800 \\cdot 50}{2}$ → $\\tfrac{2000 \\cdot 50}{2} = 50000$, so the answer must be near 45 000 — which immediately rules out options an order of magnitude away.'),
      t(
        ['Move', 'Instead of', 'Do this'],
        [
          ['Multiply by 0,5', '“divide by two, carefully”', 'halve it'],
          ['Multiply by 25', 'long multiplication', 'multiply by 100 and divide by 4'],
          ['Divide by 0,2', 'decimals', 'multiply by 5'],
          ['Percent of an amount', 'a formula', '10 % = shift the decimal, then scale'],
        ],
        'These are the exact shortcuts the official solutions use.',
      ),
    ]),
    sec('visual_intuition', [
      fig(
        { kind: 'table', title: 'The same change, three representations', headers: ['Representation', 'Before', 'After'], rows: [['fraction', '1', '1,2'], ['percentage', '100 %', '120 %'], ['scale factor', '1,00', '1,20']] },
        'Whenever a percentage appears, translate it into a scale factor in your head. Multiplication of factors is what chains changes together.',
      ),
      intuition(
        'Think of a rate as a dial that converts one kind of quantity into another. A price of 4 €/unit turns units into euros; a speed of 60 km/h turns hours into kilometres. If you know which way the dial turns, you can never multiply when you should divide — the units tell you.',
      ),
    ]),
    sec('worked_example', [
      p('Energy use per unit of output falls by 20 %, while **total** energy use rises by 5 %. What happened to output?'),
      steps([
        'Write the definition: energy per unit = total energy / output. So output = total energy / energy per unit.',
        'Translate to scale factors: total energy ×1,05; energy per unit ×0,80.',
        'Output factor = $\\tfrac{1{,}05}{0{,}80} = 1{,}3125$.',
        'Interpret: output rose by about 31 %.',
        'Sanity check: if output had stayed constant, total energy would have fallen by 20 %; it rose by 5 % instead, so output must have grown substantially — 31 % is consistent.',
      ]),
      mis('Subtracting the percentages (20 % − 5 % = 15 %).', 'Ratios of changes divide; a ratio of two scale factors is not a difference of two percentages.'),
    ]),
    practice(
      'guided_practice',
      [
        p('Work these with the factor method: convert every percentage into a scale factor before computing anything. If the worked example above felt mechanical rather than obvious, these foundation items are exactly the drill you need — accuracy of structure first, speed second.'),
      ],
      ['C01.ratio', 'C01.rate'],
      [1, 2, 3],
    ),
    practice('independent_practice', [p('Now the same concepts without the scaffold: mixed directions, some items give the total and ask for the share, others give the change and ask for the base.')], ['C01.ratio', 'C01.rate', 'C01.units'], [2, 3, 4]),
    practice('transfer', [p('These items hide the same arithmetic inside unit conversions, estimation and engineering contexts. The rule has not changed; the surface has.')], ['C01.units', 'C01.estimate', 'C01.rate'], [4, 5]),
    practice('dmat_style', [p('Exam-style demands: one reading, one structure, one answer under time pressure, with at least one distractingly precise option.')], ['C01.ratio', 'C01.units', 'C01.estimate'], [5, 6]),
    sec('trick_misconception', [
      mis('“Percentages add.”', 'They multiply. Chain them as factors.'),
      mis('“A unit conversion changes the quantity.”', 'It only renames it. If the numerical answer changed, you multiplied by the wrong factor — check by asking whether the new unit is bigger (fewer units) or smaller (more units).'),
      mis('“Estimation is for people who cannot compute.”', 'Estimation is how you catch a wrong button, a wrong unit and a wrong direction — the three most common causes of lost marks.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool across the whole lesson. Target: at least 80 % correct, with no unit error and no reversed direction among the mistakes. Until then, stay in this lesson — the domains that follow depend on it.')],
      ['C01.ratio', 'C01.rate', 'C01.units', 'C01.estimate'],
      [1, 2, 3, 4, 5, 6],
    ),
  ],
);
