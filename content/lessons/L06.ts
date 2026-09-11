import { f, fig, intuition, lesson, mis, official, p, practice, sec, steps, t } from './helpers';

export const L06 = lesson(
  'L06',
  'D06',
  'Hydrostatics: depth, buoyancy, trapped air and stability',
  'The official Exercise 2 domain — pressure with depth, why things float, and what happens when a container floods.',
  ['OFFICIAL_SAMPLE', 'PREREQUISITE'],
  80,
  [
    sec('what_is_it', [
      p(
        'Hydrostatics studies fluids that are not moving. Three ideas cover the whole domain: pressure grows linearly with depth, a body floats when the water it *displaces* weighs as much as the body, and the gas trapped in a container obeys $pV = \\text{const}$ as the surrounding water presses on it.',
      ),
      p(
        'The official material develops exactly this: a pressure-versus-depth relation with an atmospheric term, the mental conversion 10 m ≈ 1 bar, a figure of a container with trapped air and a rising water level, a buoyancy balance, and a stability comparison of two hull widths. It also states the limitation of models explicitly — a small rise of the water level inside the container is negligible in the simplified calculation, and the official solution says so.',
      ),
      official('EX2', 'Seven official questions on pressure with depth, buoyancy and trapped air, with two explanatory figures. The lesson below teaches each of those moves, then extends them to the same physics in new settings.'),
    ]),
    sec('why_it_matters', [
      p(
        'This is one of the four domains with published examples, so the item style is known: a described technical setup, one quantity asked for, and a distractor for each wrong model (forgetting $p_0$, using gauge pressure in the gas law, using volume instead of displaced volume, ignoring that a floating body displaces its own weight).',
      ),
      p('The reasoning also transfers directly to diving, ballast systems, weather and any question about "what happens when this changes?" — the *effect-of-change* move that appears throughout the official exercises.'),
    ]),
    sec('prerequisites', [
      p('Force, pressure, density, weight and the gas law from L05, plus the 10 m ≈ 1 bar rule. If you cannot state $p = F/A$ and $\\rho = m/V$ without hesitation, work L05 first — every hydrostatics error in practice traces back to one of those two definitions.'),
      t(
        ['Situation', 'What the water does', 'What it does **not** do'],
        [
          ['A body floating', 'displaces water equal to its own weight', 'displace a volume equal to its own volume'],
          ['A body submerged and sinking', 'displaced volume is the body’s volume', 'density plays no further role in buoyancy'],
          ['Gas in a closed container', 'compresses as pressure rises', 'change temperature appreciably in an isothermal model'],
        ],
      ),
    ]),
    sec('core_knowledge', [
      p('**Pressure with depth.** Pressure at depth $h$ is the atmospheric pressure plus the weight of the column above:'),
      f('p(h) = p_0 + \\rho g h \\qquad\\Longleftrightarrow\\qquad p(h)\\,[\\text{bar}] \\approx 1 + \\frac{h\\,[\\text{m}]}{10}'),
      p('The 10 m rule is exact enough for mental arithmetic and is the official simplification (1 bar ≈ 10 m of water column). Doubling the depth does **not** double the pressure: only the *gauge* part doubles.'),
      p('**Buoyancy.** The upward force equals the weight of the displaced water, $F_B = \\rho_{\\text{water}}\\, g\\, V_{\\text{displaced}}$. For a floating body, equilibrium gives the memorable statement:'),
      f('m_{\\text{body}} = \\rho_{\\text{water}} \\cdot V_{\\text{displaced}}', 'A ship floats because it displaces its own mass in water — hull shape changes the volume, not the mass.'),
      p('**Trapped air.** A container with a closed top holds air. Forcing it deeper (or pressurising the tank) compresses that air; the water level inside the container rises, which reduces the displaced volume and therefore the buoyancy:'),
      f('p_{\\text{air}} \\cdot V_{\\text{air}} = \\text{const},\\qquad V_{\\text{air}} = A \\cdot h_{\\text{air}}'),
      p('**Stability.** A floating body tips until its centre of gravity and the centre of buoyancy line up. A wider hull moves the displaced water sideways faster, creating a larger restoring moment: a catamaran is stable, an oil drum is tender.'),
      p('**Suction lift.** Because a pump can at best create a vacuum, the atmosphere limits how high water can be pulled:'),
      f('h_{\\max} \\approx \\frac{p_{\\text{atm}}}{\\rho g} \\approx 10\\ \\text{m at sea level}'),
    ]),
    sec('visual_intuition', [
      fig(
        {
          kind: 'pressure_depth',
          lines: [
            { label: 'water', rho: 1000, p0: 1, color: '#2563eb' },
            { label: 'seawater (ρ ≈ 1030)', rho: 1030, p0: 1, color: '#0891b2' },
          ],
          hMax: 30,
          markedDepths: [10, 20, 30],
        },
        'Absolute pressure against depth. Both lines start at 1 bar (the atmosphere) and rise by about 1 bar every 10 m — the vertical offset at the surface is the part that is easy to forget.',
      ),
      intuition(
        'Pressure is a stack of water: each metre of depth adds another layer on top of you, and the atmosphere is one extra layer above the surface. Buoyancy is the same stack read from below — deeper water pushes up harder than shallow water pushes down, and the difference is exactly the weight of the fluid you pushed out of the way.',
      ),
      fig(
        { kind: 'tank_points', points: [{ label: 'A', depth: 2 }, { label: 'B', depth: 6 }, { label: 'C', depth: 6 }], fluid: 'water', depthsScaleMax: 8 },
        'Points A, B and C. B and C are at the same depth, so the pressure is identical even though their positions differ — pressure in a still fluid depends on depth alone, not on the shape of the container.',
      ),
      fig(
        { kind: 'flooded_room', roomHeight: 4, leakDepth: 9, leakHeight: 1, riseFraction: 0.35 },
        'The classic official setup: a container with trapped air, an opening at the bottom, and water rising inside. The trapped air compresses as the water level rises, so pressure, volume and displaced water are coupled.',
      ),
      fig(
        { kind: 'ship_stability', ships: [{ label: 'narrow hull', beam: 3, boxOffset: 0.4 }, { label: 'wide hull', beam: 8, boxOffset: 0.4 }] },
        'Two hulls of equal mass and equal draft, one twice as wide. When they tilt, the wide hull shifts its displaced water sideways much further, producing a larger restoring moment — the official stability figure in one picture.',
      ),
    ]),
    sec('worked_example', [
      p('A sealed tank of water is pressurised to 1 bar above atmospheric at the water surface. A container floats in the tank with 1,0 m of trapped air inside it, and the container has a constant cross-section $A$. The tank is then opened to the atmosphere. What happens to the container?'),
      steps([
        'Identify the coupled quantities: air pressure, air volume, displaced water volume, buoyancy, weight.',
        'Before: absolute air pressure ≈ 1 bar + 1 bar = 2 bar. After opening: the surface returns to 1 bar absolute, but the trapped air is still compressed by the water above it — its pressure is set by the depth of the opening.',
        'Write the gas relation in ratios: $\\tfrac{p_1 V_1}{p_2 V_2} = 1$, so $V_2 = V_1 \\cdot \\tfrac{p_1}{p_2}$. With $p_1 = 2$ bar and $p_2 = 1$ bar (at the level of the trapped air), the volume doubles: the air pocket height doubles.',
        'A larger air pocket displaces more water, so buoyancy rises while the weight is unchanged.',
        'Conclusion: the container rises until the displaced volume matches the weight again. The mechanism is not "the water pushes less" — it is that the *displaced volume grew*.',
        'Sanity check with the official simplification: the change in water level inside the container is a second-order effect and is neglected in the official solution; the direction of the effect is unaffected by neglecting it.',
      ]),
      mis('Using gauge pressure in the gas law.', 'A tank at "2 bar" on a gauge holds gas at about 3 bar absolute; the ratio of absolute pressures is what compresses the air.'),
    ]),
    practice('guided_practice', [p('Pressure at a depth. For every item: write $p = p_0 + \\rho g h$, substitute with the 1 bar per 10 m rule, and state whether the answer is absolute or gauge.')], ['C06.depth', 'C06.atm', 'C06.bar'], [1, 2]),
    practice('independent_practice', [p('Buoyancy items: decide first whether the body floats (displaced mass = body mass) or is fully submerged (displaced volume = body volume). The two paths give different answers to the same numbers.')], ['C06.buoy', 'C06.displaced'], [2, 3]),
    practice('transfer', [p('Trapped air, suction lift and stability — situations where the answer is a *direction* or a *mechanism* rather than a number. Explain the coupling before computing anything.')], ['C06.trapped', 'C06.suction', 'C06.stability'], [4, 5]),
    practice('dmat_style', [p('Exam-style hydrostatics: a described setup, one asked quantity, and distractors built from the four classic mistakes (missing p₀, gauge/absolute confusion, volume instead of displaced volume, ignoring compression).')], ['C06.depth', 'C06.buoy', 'C06.trapped', 'C06.stability'], [5, 6]),
    sec('trick_misconception', [
      mis('“Pressure doubles when depth doubles.”', 'The *gauge* part doubles; the absolute pressure increases by less than 100 % because the atmosphere is already there. At 10 m: gauge 1 bar, absolute 2 bar. At 20 m: gauge 2 bar, absolute 3 bar.'),
      mis('“A floating object displaces its own volume.”', 'It displaces its own *mass* of water. Only a fully submerged body displaces its own volume.'),
      mis('“The container sinks because the water pressure pushes down harder.”', 'Water pressure pushes in all directions, including up. What decides floating is the displaced volume — and compressing the trapped air changes exactly that.'),
      mis('“Stability depends on the mass.”', 'It depends on the geometry: how far the displaced water moves sideways when the body tilts. A wide, light hull can be more stable than a narrow, heavy one.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool over the whole domain, including effect-of-change and critique items. Mastery: correct model chosen every time, absolute/gauge handled correctly, and no volume-versus-displaced-volume slip. Target 85 % with at least one level 6 item correct.')],
      ['C06.depth', 'C06.atm', 'C06.bar', 'C06.buoy', 'C06.displaced', 'C06.trapped', 'C06.suction', 'C06.stability'],
      [1, 2, 3, 4, 5, 6, 7],
    ),
  ],
);
