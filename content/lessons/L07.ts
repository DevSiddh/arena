import { f, fig, intuition, lesson, mis, p, practice, sec, steps, t } from './helpers';

export const L07 = lesson(
  'L07',
  'D07',
  'Mechanics and engineering reasoning: levers, flow, efficiency',
  'Static equilibrium, continuity and losses — the engineering ideas the official sketches already presuppose.',
  ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
  45,
  [
    sec('what_is_it', [
      p(
        'Three engineering ideas appear in the official technical figures and are needed to read them confidently: **moments** (a force acting at a distance turns things), **continuity of flow** (what enters a pipe must leave it, so a narrower section means faster flow), and **efficiency** (real processes deliver less than they are given).',
      ),
      p('None of this requires calculus or material science. All of it is arithmetic plus one conservation statement per idea.'),
    ]),
    sec('why_it_matters', [
      p(
        '"Engineering" is named on the official field list, and the official figures already show a pump, a buoyancy/stability sketch and a tilting comparison. Items in this domain are therefore a reasonable preparation extension: they use the same input-plus-question anatomy and the same "what happens if this changes?" move that the demonstrated items use.',
      ),
      mis('“Extension means guessing what will be examined.”', 'It means preparing the reasoning moves the official material demonstrates, applied to the field it names — never claiming a syllabus.'),
    ]),
    sec('prerequisites', [
      p('Force, pressure, energy and power from L05. Moments are force times distance; if force is unclear, nothing else works.'),
      t(
        ['Idea', 'Conserved quantity', 'Consequence'],
        [
          ['Lever / moment', 'moment (F·a)', 'small force on a long arm balances a large one on a short arm'],
          ['Flow continuity', 'volume per second (A·v)', 'narrower pipe ⇒ faster flow'],
          ['Energy balance', 'energy (J)', 'output ≤ input; losses appear as heat or friction'],
        ],
      ),
    ]),
    sec('core_knowledge', [
      p('**Moments and equilibrium.** For a body at rest, clockwise and anticlockwise moments balance:'),
      f('F_1 a_1 = F_2 a_2 \\qquad\\text{(equilibrium about a pivot)}'),
      p('The **mechanical advantage** is the ratio of the arms, $a_2/a_1$, and the price paid is distance: a small force must move a longer way. Energy is conserved, force is not.'),
      p('**Continuity of an incompressible flow.** The same amount of fluid passes every cross-section per second:'),
      f('A_1 v_1 = A_2 v_2 \\qquad\\Longrightarrow\\qquad v_2 = v_1\\frac{A_1}{A_2}'),
      p('**Efficiency.** Useful output divided by input, always below 1 in a real device:'),
      f('\\eta = \\frac{E_{\\text{useful}}}{E_{\\text{input}}}, \\qquad E_{\\text{lost}} = E_{\\text{input}} - E_{\\text{useful}}'),
      p('**Pressure in a connected fluid at rest** is equal at equal depth, which is why a hydraulic system can multiply force via different piston areas: the pressure is transmitted, and the larger piston therefore carries the larger force ($F = pA$).'),
    ]),
    sec('visual_intuition', [
      fig({ kind: 'lever', loadArm: 0.5, effortArm: 2, load: 800 }, 'Load 800 N half a metre from the pivot, effort two metres away: the effort needed is 200 N. Trade force for distance, never for energy.'),
      intuition(
        'A lever is a distance multiplier the wrong way round: you push lightly over a long arc, the load moves heavily over a short one. Continuity is the same bookkeeping for fluid: water is incompressible, so it must speed up through a narrow gate the way crowds speed up through a narrow doorway.',
      ),
      fig(
        {
          kind: 'flowchart',
          title: 'Where the energy goes',
          steps: ['input energy 100 J', 'friction and heat 25 J', 'useful output 75 J', 'efficiency = 75/100 = 75 %'],
        },
        'Efficiency questions are energy accounting. Write the balance line first; the division is trivial afterwards.',
      ),
    ]),
    sec('worked_example', [
      p('Water flows through a pipe of cross-section 0,02 m² at 3 m/s into a section of 0,005 m². What is the velocity in the narrow section, and what does the pressure there do?'),
      steps([
        'Apply continuity: $A_1v_1 = A_2v_2$.',
        'Compute the transported volume per second: $0{,}02 \\cdot 3 = 0{,}06\\ \\text{m}^3/\\text{s}$.',
        'Divide by the new area: $v_2 = \\tfrac{0{,}06}{0{,}005} = 12\\ \\text{m/s}$.',
        'Notice the ratio: the area fell by a factor of 4, so the velocity rose by a factor of 4 — no long computation was needed.',
        'Interpret the pressure: where the fluid accelerates, the static pressure drops. This is why a narrowing pipe is a measurement point, and it is the qualitative part many items ask for.',
      ]),
      mis('Applying continuity to distance instead of to *per-second* volume.', 'Continuity conserves the flow rate (volume per second), not the volume of a particular parcel of water.'),
    ]),
    practice('guided_practice', [p('Lever and moment items. Always write the two products (force × arm) explicitly on both sides before solving.')], ['C07.moment', 'C07.lever'], [1, 2]),
    practice('independent_practice', [p('Flow and efficiency items. State the conserved quantity (volume per second, energy) in the first line of your solution.')], ['C07.flow', 'C07.efficiency'], [2, 3]),
    practice('transfer', [p('Combinations: a pump lifting water with a given efficiency; a lever whose arm length changes; a pipe whose diameter doubles. Directions and factors matter more than exact numbers.')], ['C07.lever', 'C07.efficiency', 'C07.flow'], [4, 5]),
    practice('dmat_style', [p('Exam-style engineering items with distractors built from inverted ratios (area instead of velocity) and from forgetting the loss.')], ['C07.moment', 'C07.flow', 'C07.efficiency'], [5, 6]),
    sec('trick_misconception', [
      mis('“A lever creates energy.”', 'It redistributes force and distance. Work in equals work out (minus friction).'),
      mis('“Half the area means half the velocity.”', 'Area and velocity are inversely proportional: half the area means double the velocity.'),
      mis('“Efficiency is a property of the device alone.”', 'It also depends on the operating point: the same motor has different efficiencies at different loads.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool. Target 80 %, with each solution naming the conserved quantity it used. Ratios must come out in the right direction.')],
      ['C07.moment', 'C07.lever', 'C07.flow', 'C07.efficiency'],
      [1, 2, 3, 4, 5, 6],
    ),
  ],
);
