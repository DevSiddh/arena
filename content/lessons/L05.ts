import { f, fig, intuition, lesson, mis, p, practice, sec, steps, t } from './helpers';

export const L05 = lesson(
  'L05',
  'D05',
  'Physics fundamentals that hydrostatics and mechanics sit on',
  'Force, pressure, density, weight, energy and the ideal gas — the six definitions behind the official engineering questions.',
  ['OFFICIAL_FIELD_LIST', 'PREREQUISITE'],
  50,
  [
    sec('what_is_it', [
      p(
        'Six definitions carry almost the whole of the official technical material: **force** (how hard something is pushed, in newtons), **pressure** (force spread over an area), **density** (mass per volume), **weight** (the force gravity exerts on a mass), **work and energy** (force along a distance, joules), and the **ideal-gas relation** $pV = \\text{const}$ for a trapped amount of air.',
      ),
      p('The official hydrostatics and pump items need nothing beyond these six, but they need them with unit discipline: bar versus newton per square metre, kilogram versus newton, metre of water column versus pascal.'),
    ]),
    sec('why_it_matters', [
      p(
        'Every hydrostatic item is a two-step calculation in these definitions: pressure from depth, then force from pressure and area; or displaced volume from density and mass, then buoyancy. In the order-quantity domain the same discipline appears as cost per unit — the same *per* structure.',
      ),
      mis('“Pressure and force are basically the same thing.”', 'Force is a push; pressure is that push spread over an area. Doubling the area at constant force halves the pressure — that is why a wide hull floats a heavy ship and a narrow heel sinks.'),
    ]),
    sec('prerequisites', [
      p('Units and conversions (L01) are decisive here: 1 bar = 100 000 Pa, 1 N = 1 kg·m/s², 1 L = 0,001 m³, and the useful water rule 10 m of water column ≈ 1 bar.'),
      t(
        ['Quantity', 'Symbol', 'Unit', 'Definition'],
        [
          ['Force', 'F', 'N (kg·m/s²)', 'mass × acceleration; weight = m·g with g ≈ 9,81 m/s²'],
          ['Pressure', 'p', 'Pa = N/m²; 1 bar = 10⁵ Pa', 'p = F / A'],
          ['Density', 'ρ', 'kg/m³', 'ρ = m / V; water ≈ 1000 kg/m³'],
          ['Work / energy', 'W, E', 'J = N·m', 'W = F · d'],
          ['Power', 'P', 'W = J/s', 'P = E / t'],
          ['Efficiency', 'η', '– (0…1)', 'useful energy ÷ input energy'],
        ],
        'The whole unit vocabulary of the official engineering material.',
      ),
    ]),
    sec('core_knowledge', [
      f('p = \\frac{F}{A},\\qquad \\rho = \\frac{m}{V},\\qquad F_G = m g,\\qquad W = F d,\\qquad P = \\frac{E}{t},\\qquad \\eta = \\frac{E_{\\text{useful}}}{E_{\\text{input}}}'),
      p('**Trapped gas.** For a fixed amount of gas at constant temperature, pressure and volume are inversely proportional. Doubling the absolute pressure halves the volume — the relation behind every diving and flooding question:'),
      f('p_1 V_1 = p_2 V_2'),
      p('**Absolute versus gauge pressure.** The gas law uses *absolute* pressure (measured from vacuum). Atmospheric pressure is about 1 bar, so a vessel under 2 bar of gauge pressure holds gas at about 3 bar absolute.'),
      p('**The water rule.** Because $\\rho_{\\text{water}} g \\approx 10^4\\ \\text{N/m}^3$, every 10 m of water adds about 1 bar:'),
      f('p(h) = p_0 + \\rho g h \\;\\approx\\; p_0 + h\\,[\\text{m}] \\cdot 0{,}1\\ \\text{bar}'),
      p('**Continuity of flow.** For an incompressible fluid through a pipe of changing cross-section, the volume passing per second is constant, so velocity rises where the area falls:'),
      f('A_1 v_1 = A_2 v_2'),
      p('**Levers.** A small force on a long arm balances a large force on a short arm: $F_1 a_1 = F_2 a_2$. The product force × distance is the moment.'),
    ]),
    sec('visual_intuition', [
      fig(
        { kind: 'lever', loadArm: 1, effortArm: 3, load: 600 },
        'A 600 N load one metre from the pivot is held by 200 N three metres away. Moment in = moment out — the definition of "mechanical advantage".',
      ),
      intuition(
        'Picture the same force concentrated on the point of a needle versus spread over a palm. That is pressure. Now picture mass as *stuff* and weight as the *downward pull on that stuff*: a kilogram is always a kilogram, but its weight in newtons depends on g. Trapped air behaves like a spring: squeeze it into half the volume and it pushes back twice as hard (absolute pressure).',
      ),
      fig(
        { kind: 'suction_pump', h: 8, t: 1 },
        'A pump does not "suck" water — it lowers the pressure, and the atmosphere pushes the water up. The maximum theoretical lift is therefore about 10 m at 1 bar.',
      ),
    ]),
    sec('worked_example', [
      p('A pump lifts water from a well. The pump can create a vacuum of 0,8 bar. What is the theoretical maximum height of the water column, and what limits it?'),
      steps([
        'The lifting force comes from the *difference* between atmospheric pressure on the well surface and the pressure inside the pipe.',
        'Using the water rule, 1 bar ≈ 10 m of water column, so 0,8 bar ≈ 8 m.',
        'Interpret: the limit is not the pump’s power but the atmosphere — with a perfect vacuum of 1 bar the limit is about 10 m, and at high altitude the limit falls because $p_0$ falls.',
        'Check the unit chain: bar × 10 m/bar = m. If the answer had come out in newtons, the conversion would be wrong.',
      ]),
      mis('“A stronger pump can lift water 50 m.”', 'Beyond about 10 m at sea level no pump can pull water up a tube by suction, however powerful: the atmosphere sets the ceiling. Above that, water must be pushed.'),
    ]),
    practice('guided_practice', [p('One definition per item: name it (pressure, density, weight, work, power, efficiency, gas law) before computing, and write the unit next to every number.')], ['C05.force', 'C05.density'], [1, 2]),
    practice('independent_practice', [p('Two-step items where you must choose the path: mass → weight → force → pressure, or volume → displaced mass → buoyancy.')], ['C05.force', 'C05.density', 'C05.energy'], [2, 3]),
    practice('transfer', [p('The same definitions inside unfamiliar equipment: pumps, pipes, levers, balloons and containers with changing cross-sections.')], ['C05.energy', 'C05.gas', 'C05.force'], [4, 5]),
    practice('dmat_style', [p('Exam-style combinations with a plausible but wrong unit distractor — for example an answer in newton when the question asked for bar.')], ['C05.force', 'C05.density', 'C05.gas', 'C05.energy'], [5, 6]),
    sec('trick_misconception', [
      mis('Using gauge pressure in $p_1V_1 = p_2V_2$.', 'The gas law counts from vacuum. Add 1 bar to a gauge reading before using it.'),
      mis('Mixing kilograms and newtons.', 'Mass is a property of the object; weight is a force that depends on g. Only forces balance forces.'),
      mis('“Efficiency can exceed 100 %.”', 'Efficiency is useful output ÷ input; a machine that appears to give more out than in is either measuring different quantities or losing you marks.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool over the six definitions with a unit-error check on every item. Target 80 %, no unit error, and the definition named correctly in each solution.')],
      ['C05.force', 'C05.density', 'C05.energy', 'C05.gas'],
      [1, 2, 3, 4, 5, 6],
    ),
  ],
);
