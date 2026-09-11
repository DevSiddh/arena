import type { Rng } from '../rng';
import type { Question } from '../types';
import { assemble, num, SCENARIOS, type GenSpec, type Opt } from './helpers';

/**
 * Hydrostatics generators — official Exercise 2 domain (D06).
 *
 * The official simplification (ρ = 1000 kg/m³, g ≈ 10 N/kg ⇒ 1 bar per 10 m) is used
 * deliberately: it is what makes the quantities mentally computable, exactly as the
 * official items require, and it is what the official solutions themselves use.
 */

const RHO = 1000;
const G = 10;
const P0 = 100000; // 1 bar, the official rounding of the atmospheric pressure

function makeId(tag: string, rng: Rng): string {
  return `gen-${tag}-${rng.int(100000, 999999)}`;
}

const DEPTHS = [10, 20, 30, 40, 50, 100, 150, 200, 300, 500, 1000, 2000, 3000, 5000, 10000];

/* ------------------------------------------------------------------ */
/* 1. pressure at depth                                                */
/* ------------------------------------------------------------------ */
export function genPressureAtDepth(rng: Rng): Question {
  const depth = rng.pick(DEPTHS);
  const fluid = rng.pick(['sea water', 'a freshwater lake', 'a ballast tank filled with water', 'a deep reservoir']);
  const includeAtmosphere = rng.chance(0.4);
  const gaugeBar = depth / 10;
  const totalBar = gaugeBar + 1;
  const value = includeAtmosphere ? totalBar : gaugeBar;
  const wrongFactor10 = value * 10;
  const wrongFactorDiv10 = value / 10;
  const forgotBar = depth * 1000; // Pa mistaken for bar
  const magnitude = depth >= 1000 ? 'order of magnitude' : 'value';

  const options: Opt[] = [
    { text: `$${num(value, 2)}$ bar`, errorTag: 'none', rationale: 'Correct: 1 bar is added for every 10 m of water depth.', correct: true },
    {
      text: `$${num(wrongFactor10, 2)}$ bar`,
      errorTag: 'unit_error',
      rationale: `This multiplies by ten where the rule divides by ten: pressure grows by 1 bar per 10 m, so a depth of ${depth} m gives about ${num(gaugeBar, 2)} bar of water pressure.`,
    },
    {
      text: `$${num(wrongFactorDiv10, 2)}$ bar`,
      errorTag: 'unit_error',
      rationale: 'The rule was applied with the wrong unit: 1 bar corresponds to 10 m, not to 100 m.',
    },
    {
      text: `$${num(forgotBar, 2)}$ bar`,
      errorTag: 'unit_error',
      rationale: `This is the pressure in pascal, not in bar: $\\rho g h = ${num(RHO * G * depth, 2)}\\,\\text{Pa} = ${num(gaugeBar, 2)}\\,\\text{bar}$.`,
    },
  ];

  const spec: GenSpec = {
    id: makeId('hydrop', rng),
    domainId: 'D06',
    conceptIds: ['C06.depth', 'C06.bar'],
    label: 'OFFICIAL_SAMPLE',
    stem: includeAtmosphere
      ? `An instrument descends into ${fluid} to a depth of ${depth} m below the surface. What is the approximate *total* pressure at that depth, including the atmospheric pressure acting on the surface?`
      : `An instrument descends into ${fluid} to a depth of ${depth} m below the surface. By how much does the pressure exceed the pressure at the surface (the water pressure alone)?`,
    options,
    difficulty: depth >= 1000 ? 2 : 1,
    reasoningType: depth >= 1000 ? 'estimation_scaling' : 'rule_application',
    cognitiveMove: 'execute_rule',
    style: 'numeric_direct',
    hints: ['The simplified model gives 1 bar per 10 m of water.', includeAtmosphere ? 'The atmosphere adds about 1 bar on top of the water pressure.' : 'The question asks only for the water contribution.'],
    explanation: {
      testing: 'Applying the linear pressure–depth law with the official mental model (1 bar per 10 m).',
      matters: `The depth (${depth} m) and, for the total pressure, the surface pressure of about 1 bar.`,
      concept: 'p(h) = ρgh + p₀, evaluated with ρ = 1000 kg/m³ and g ≈ 10 N/kg.',
      why: 'The weight of the fluid column above the point grows in proportion to its height, and for an incompressible fluid the column height equals the depth.',
      steps: [
        `$\\rho g h = 1000 \\cdot 10 \\cdot ${depth} = ${RHO * G * depth}\\,\\text{Pa}$`,
        `$= ${num(gaugeBar, 2)}\\,\\text{bar}$ of water pressure`,
        ...(includeAtmosphere ? ['Add the surface pressure: $1\\,\\text{bar} + ' + num(gaugeBar, 2) + '\\,\\text{bar} = ' + num(totalBar, 2) + '\\,\\text{bar}$'] : []),
      ],
      trap: 'Confusing pascal with bar (a factor of 100 000) or inverting the 10 m ↔ 1 bar relation.',
      transfer: 'The same linear law gives the pressure on a diver, the load on a hull, and the force on any submerged surface once multiplied by its area.',
    },
    verification: {
      solver: 'hydro.pressure',
      payload: { depth_m: depth, rho: RHO, p0_pa: includeAtmosphere ? P0 : 0, g: G },
    },
    tags: includeAtmosphere ? ['approx'] : ['exact'],
  };
  return assemble(spec, rng);
}

/* ------------------------------------------------------------------ */
/* 2. pressure difference / comparison between two points              */
/* ------------------------------------------------------------------ */
export function genPressureComparison(rng: Rng): Question {
  const style = rng.pick(['difference', 'statement'] as const);
  const base = rng.pick([10, 20, 30, 50, 100]);
  const factor = rng.pick([2, 3, 4, 5]);
  const d1 = base;
  const d2 = base * factor;
  const diff = (d2 - d1) / 10;

  if (style === 'difference') {
    return assemble(
      {
        id: makeId('hydrodiff', rng),
        domainId: 'D06',
        conceptIds: ['C06.depth', 'C06.bar'],
        label: 'OFFICIAL_SAMPLE',
        stem: `Two points lie in water: point A at ${d1} m and point B at ${d2} m below the surface. How much greater is the pressure at B than at A?`,
        figure: {
          kind: 'tank_points',
          points: [
            { label: 'A', depth: d1 },
            { label: 'B', depth: d2 },
          ],
          fluid: 'water',
          depthsScaleMax: d2 * 1.2,
        },
        options: [
          { text: `about $${num(diff, 2)}$ bar`, errorTag: 'none', rationale: 'Correct: only the depth *difference* matters, and 1 bar corresponds to 10 m.', correct: true },
          { text: `about $${num(d2 / 10, 2)}$ bar`, errorTag: 'question_misread', rationale: `This is the total water pressure at B, not the difference between the two points.` },
          { text: `about $${num(d1 / 10, 2)}$ bar`, errorTag: 'question_misread', rationale: 'This is the water pressure at A alone.' },
          { text: `about $${num((d2 * d2 - d1 * d1) / 1000, 2)}$ bar`, errorTag: 'linearity_assumption', rationale: 'The squares of the depths were used, as if pressure grew quadratically; the growth is linear in depth.' },
        ],
        difficulty: 2,
        reasoningType: 'rule_application',
        cognitiveMove: 'execute_rule',
        style: 'numeric_direct',
        hints: ['Write both pressures as $\\rho g h + p_0$ and subtract.', 'The atmospheric term cancels — only the depth difference survives.'],
        explanation: {
          testing: 'Recognising that two pressure values share the same surface term, so only the depth difference survives the subtraction.',
          matters: `The two depths (${d1} m and ${d2} m); the absolute values of the pressures are not needed.`,
          concept: 'Δp = ρgΔh — pressure differences depend only on depth differences.',
          why: 'Both points sit under the same atmosphere, so the p₀ terms cancel; the remaining difference is the weight of the extra water column between the two depths.',
          steps: [
            `$p_B - p_A = \\rho g (h_B - h_A) = 1000 \\cdot 10 \\cdot ${d2 - d1}\\,\\text{Pa}$`,
            `$= ${num((d2 - d1) / 10, 2)}\\,\\text{bar}$`,
          ],
          trap: 'Adding the two depths or computing each pressure separately and then mis-subtracting; and using the depths instead of their difference.',
          transfer: 'The same cancellation explains why a pressure gauge measures relative pressure and why buoyancy depends on the *difference* of forces on the top and bottom of a body.',
        },
        verification: { solver: 'hydro.pressure_diff', payload: { d1, d2, rho: RHO, g: G } },
        tags: ['exact'],
      },
      rng,
    );
  }

  // statement style — the "twice as deep" trap
  return assemble(
    {
      id: makeId('hydrostmt', rng),
      domainId: 'D06',
      conceptIds: ['C06.depth', 'C06.atm'],
      label: 'OFFICIAL_SAMPLE',
      stem: `Point B lies ${factor} times as deep below the water surface as point A. Which statement is correct?`,
      options: [
        {
          text: `The water pressure above the surface pressure at B is ${factor} times as large as at A, but the total pressures are not in a ratio of ${factor} : 1.`,
          errorTag: 'none',
          rationale: 'Correct: only the depth-dependent part ρgh scales with depth; the atmospheric contribution is the same at both points.',
          correct: true,
        },
        {
          text: `The total pressure at B is exactly ${factor} times the total pressure at A.`,
          errorTag: 'wrong_assumption',
          rationale: 'This ignores the atmospheric term, which is added at both points and does not scale with depth.',
        },
        {
          text: 'The pressure is the same at both points because the water is incompressible.',
          errorTag: 'concept_confusion',
          rationale: 'Incompressibility is exactly why the pressure grows with depth: the deeper point carries the weight of more water above it.',
        },
        {
          text: `The pressure at B is ${factor * factor} times the pressure at A, because pressure grows with the square of depth.`,
          errorTag: 'linearity_assumption',
          rationale: 'The growth is linear, not quadratic: doubling the depth doubles the added pressure.',
        },
      ],
      difficulty: 4,
      reasoningType: 'conceptual_discrimination',
      cognitiveMove: 'general_case',
      style: 'statement_compare',
      hints: ['Split the pressure into the constant surface part and the depth-dependent part.', 'Ask which part of the pressure actually depends on the depth.'],
      explanation: {
        testing: 'Separating the constant surface pressure from the depth-dependent part of the hydrostatic pressure.',
        matters: 'The structure $p = p_0 + \\rho g h$: one term is constant, one term is proportional to depth.',
        concept: 'Linear depth law with an additive constant.',
        why: 'The atmosphere presses equally on every point of the water surface, so its contribution is identical everywhere; only the water column differs.',
        steps: [
          '$p_A = p_0 + \\rho g h_A$, $p_B = p_0 + \\rho g h_B$ with $h_B = ' + factor + 'h_A$',
          `Depth-dependent parts: $\\rho g h_A$ and $${factor}\\rho g h_A$ ⇒ ratio ${factor} : 1`,
          'The total pressures keep an extra $p_0$ each, so their ratio is smaller than ' + factor + ' : 1.',
        ],
        trap: 'Treating pressure as purely proportional to depth and forgetting the additive atmospheric term.',
        transfer: 'The same "linear plus constant" structure appears in cost models (fixed plus variable), in temperature scales and in any quantity with an offset.',
      },
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 3. buoyancy: mass of a floating body                                */
/* ------------------------------------------------------------------ */
export function genBuoyancyMass(rng: Rng): Question {
  const volume = rng.pick([1, 2, 3, 4, 5, 10, 0.5]);
  const fullySubmerged = rng.chance(0.5);
  const fraction = fullySubmerged ? 1 : rng.pick([0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);
  const mass = RHO * volume * fraction;
  const topDepth = rng.int(2, 8);
  const bottomDepth = topDepth + rng.int(1, 4);
  const includeDecoy = rng.chance(0.8);
  const object = rng.pick(['a sealed container', 'a wooden block with metal fittings', 'a buoy', 'an inspection float', 'a plastic pontoon']);
  const depthInfo = fullySubmerged
    ? `Its top edge is ${topDepth} m and its bottom edge is ${bottomDepth} m below the surface.`
    : `It floats so that ${num(fraction * 100, 0)} % of its volume is below the surface.`;

  return assemble(
    {
      id: makeId('hydromass', rng),
      domainId: 'D06',
      conceptIds: ['C06.displaced', 'C06.buoy'],
      label: 'OFFICIAL_SAMPLE',
      stem: `${object} of volume ${num(volume, 2)} m³ floats in water. ${depthInfo} What is the mass of the object?`,
      options: [
        { text: `$${num(mass, 0)}$ kg`, errorTag: 'none', rationale: 'Correct: a floating body displaces water whose mass equals its own mass.', correct: true },
        {
          text: fullySubmerged ? `$${num(RHO * volume * 2, 0)}$ kg` : `$${num(RHO * volume, 0)}$ kg`,
          errorTag: 'wrong_assumption',
          rationale: fullySubmerged
            ? 'Twice the submerged volume was used; the displaced volume equals the body volume once.'
            : 'This assumes the whole volume is submerged, but only the stated fraction is underwater.',
        },
        {
          text: `$${num(mass * G, 0)}$ N`,
          errorTag: 'unit_error',
          rationale: 'This is a weight force in newtons, not a mass in kilograms: the factor g was applied although the question asks for a mass.',
        },
        {
          text: `$${num(mass / 2, 0)}$ kg`,
          errorTag: 'rule_misapplication',
          rationale: 'The displaced mass was halved a second time; the submerged fraction has already been accounted for.',
        },
      ],
      difficulty: fullySubmerged && includeDecoy ? 3 : 2,
      reasoningType: fullySubmerged ? 'multi_step_application' : 'rule_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: [
        'Floating means the buoyant force equals the weight: the displaced water mass equals the body mass.',
        fullySubmerged ? 'Which numbers actually tell you how much water is displaced?' : 'Use the submerged fraction of the volume, not the whole volume.',
      ],
      explanation: {
        testing: 'Connecting the floating condition to the displaced volume, and ignoring depth information that does not affect the answer.',
        matters: `The volume (${num(volume, 2)} m³), the fact that the body floats, and ${fullySubmerged ? 'the fact that it is fully submerged' : `the submerged fraction (${num(fraction * 100, 0)} %)`}.`,
        irrelevant: fullySubmerged
          ? 'The absolute depths of the top and bottom edges: once the body is completely below the surface, they no longer influence the displaced volume.'
          : 'The exact geometry of the object.',
        concept: 'Archimedes’ principle in the floating case: displaced fluid mass = body mass.',
        why: 'The pressure forces on the body integrate to a buoyant force equal to the weight of the displaced water; equilibrium requires this to equal the body weight.',
        steps: [
          `Submerged volume: $V_s = ${num(volume, 2)} \\cdot ${num(fraction, 2)} = ${num(volume * fraction, 2)}\\,\\text{m}^3$`,
          `Displaced water mass: $${num(volume * fraction, 2)} \\cdot 1000 = ${num(mass, 0)}\\,\\text{kg}$`,
          'Since the body floats, this equals the body mass.',
        ],
        trap: 'Using the full volume when only part of the body is submerged, and being distracted by depth values that carry no information about mass.',
        transfer: 'The same balance determines how much cargo a ship can take, how deep a pontoon sits, and why a denser fluid lets a body float higher.',
      },
      verification: { solver: 'hydro.buoyant_mass', payload: { volume_m3: volume, submergedFraction: fraction, rho: RHO } },
      tags: fullySubmerged && includeDecoy ? ['irrelevant-data'] : [],
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 4. trapped air and the flooding of a sealed space                   */
/* ------------------------------------------------------------------ */
export function genTrappedAir(rng: Rng): Question {
  const roomHeight = rng.pick([2.4, 3, 4, 5, 6, 2]);
  const leakDepth = rng.pick([10, 5, 15, 20, 30]);
  const leakHeight = rng.pick([0.2, 0.3, 0.5]);
  const rise = (roomHeight * leakDepth) / (leakDepth + 10);
  const ratio = leakDepth / (leakDepth + 10);

  return assemble(
    {
      id: makeId('hydroair', rng),
      domainId: 'D06',
      conceptIds: ['C06.trapped', 'C05.gas'],
      label: 'OFFICIAL_SAMPLE',
      stem:
        `A ship’s hull is torn open ${leakDepth} m below the waterline. The damaged compartment is a rectangular space of height ${num(roomHeight, 2)} m whose surrounding doors were closed in time, so neither water nor air can escape through the compartment. ` +
        `The opening is ${num(leakHeight, 2)} m high and sits directly above the floor. To about what height above the floor will water enter the compartment?`,
      figure: {
        kind: 'flooded_room',
        roomHeight,
        leakDepth,
        leakHeight,
        riseFraction: ratio,
      },
      options: [
        { text: `about ${num(rise, 2)} m`, errorTag: 'none', rationale: 'Correct: the trapped air is compressed until its pressure balances the water pressure at the leak.', correct: true },
        { text: `about ${num(roomHeight, 2)} m (the compartment fills completely)`, errorTag: 'concept_confusion', rationale: 'Complete flooding would require the air to escape or to be compressed to nothing; the closed compartment prevents that.' },
        { text: `about ${num(leakHeight, 2)} m`, errorTag: 'irrelevant_data_used', rationale: 'The height of the opening limits the flow rate, not the final water level.' },
        { text: 'Nothing — water cannot enter because the air cannot escape.', errorTag: 'wrong_assumption', rationale: 'Air is compressible: water can enter while the air is compressed into a smaller volume, so entry is possible.' },
      ],
      difficulty: 5,
      reasoningType: 'multi_step_application',
      cognitiveMove: 'explain_or_critique',
      style: 'numeric_direct',
      hints: [
        'Water enters until the pressure of the compressed air equals the water pressure at the opening.',
        `In the simplified model the pressure doubles at 10 m depth, so here the compression factor is about ${num((leakDepth + 10) / 10, 2)}.`,
      ],
      explanation: {
        testing: 'Combining gas compression with hydrostatic pressure — the cross-concept reasoning of the official hydrostatics exercise.',
        matters: `The depth of the leak (${leakDepth} m), the height of the compartment (${num(roomHeight, 2)} m) and the fact that the air cannot escape.`,
        irrelevant: `The height of the opening (${num(leakHeight, 2)} m) — it affects how fast water flows, not how far the level rises.`,
        concept: 'The trapped air is compressed isothermally ($pV$ constant) until its pressure equals the water pressure at the leak.',
        why: 'Equilibrium requires equal pressures on both sides of the water surface inside the compartment; the air pressure rises as its volume falls.',
        steps: [
          `Water pressure at the leak: 1 bar (atmosphere) + ${num(leakDepth / 10, 1)} bar (water) = ${num(1 + leakDepth / 10, 1)} bar`,
          `Air compression factor: $p_0/p = 1/${num(1 + leakDepth / 10, 2)} = ${num(1 / (1 + leakDepth / 10), 3)}$`,
          `So the air occupies ${num(1 / (1 + leakDepth / 10) * 100, 1)} % of its original volume, and water rises to ${num(ratio, 3)} × ${num(roomHeight, 2)} m = ${num(rise, 2)} m`,
        ],
        trap: 'Assuming the compartment fills completely (as it would if the air could escape), or that water cannot enter at all.',
        transfer: 'The same reasoning explains why an upturned glass keeps water out, why air pockets form in flooded hulls, and how diving bells work.',
      },
      verification: { solver: 'hydro.trapped_air_rise', payload: { roomHeight_m: roomHeight, depth_m: leakDepth, p0_pa: P0, rho: RHO, g: G } },
      tags: ['approx'],
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 5. suction lift limit                                               */
/* ------------------------------------------------------------------ */
export function genSuctionLift(rng: Rng): Question {
  const style = rng.pick(['statement', 'numeric'] as const);
  const h = rng.int(3, 8);
  const t = rng.int(2, 12);

  if (style === 'numeric') {
    const vacuum = rng.pick([0.3, 0.4, 0.5, 0.6, 0.8]);
    const lift = vacuum * 10;
    return assemble(
      {
        id: makeId('hydrosuction-num', rng),
        domainId: 'D06',
        conceptIds: ['C06.suction', 'C06.atm'],
        label: 'OFFICIAL_SAMPLE',
        stem: `A pump creates a vacuum of ${num(vacuum, 1)} bar at its suction port (i.e. the pressure there is ${num(vacuum, 1)} bar below the ambient pressure). What is the maximum height above the water surface from which the pump can lift water?`,
        options: [
          { text: `about ${num(lift, 1)} m`, errorTag: 'none', rationale: 'Correct: 1 bar of pressure difference supports about 10 m of water column.', correct: true },
          { text: `about ${num(lift * 2, 1)} m`, errorTag: 'unit_error', rationale: 'This doubles the achievable lift; a pressure difference of 1 bar corresponds to roughly 10 m, not 20 m.' },
          { text: `about ${num(lift / 2, 1)} m`, errorTag: 'unit_error', rationale: 'This halves the lift, as if 1 bar corresponded to 20 m of water.' },
          { text: 'The maximum height is not limited by the vacuum, only by the pipe diameter.', errorTag: 'concept_confusion', rationale: 'Pipe geometry affects losses, not the fundamental pressure limit: no pump can suck water above the height supported by the available pressure difference.' },
        ],
        difficulty: 4,
        reasoningType: 'estimation_scaling',
        cognitiveMove: 'effect_of_change',
        style: 'numeric_direct',
        hints: ['A pump cannot pull water harder than the atmosphere pushes it.', 'Use the relation 1 bar ↔ about 10 m of water column.'],
        explanation: {
          testing: 'Understanding that a suction lift is driven by an external pressure difference and therefore has an absolute limit.',
          matters: 'The available vacuum in bar and the conversion 1 bar ≈ 10 m of water.',
          concept: 'Hydrostatic equilibrium of a lifted column: the pressure difference must support the weight of the column.',
          why: 'The atmospheric pressure pushes water up the pipe; a perfect vacuum could only support about 10 m of water, so any real vacuum supports less.',
          steps: [
            `Pressure difference: $${num(vacuum, 1)}\\,\\text{bar} = ${num(vacuum * 100000, 0)}\\,\\text{Pa}$`,
            `$h = \\Delta p/(\\rho g) = ${num(vacuum * 100000, 0)}/(1000 \\cdot 10) = ${num(lift, 1)}\\,\\text{m}$`,
          ],
          trap: 'Believing that a stronger pump can lift water arbitrarily high, or using the delivery pressure instead of the suction pressure.',
          transfer: 'The same limit explains the depth from which a hand pump can draw water and why submersible pumps are placed inside the water.',
        },
        verification: { solver: 'hydro.suction_lift', payload: { vacuum_bar: vacuum } },
        tags: ['exact'],
      },
      rng,
    );
  }

  return assemble(
    {
      id: makeId('hydrosuction', rng),
      domainId: 'D06',
      conceptIds: ['C06.suction', 'C06.atm'],
      label: 'OFFICIAL_SAMPLE',
      stem:
        `A pump draws water from a ${rng.pick(SCENARIOS.fluids)} basin. The suction port is installed h = ${h} m above the water surface and the intake opening reaches t = ${t} m below the surface. ` +
        'Ideal conditions are assumed (no friction losses, no leaks, the water does not boil). Which statement about the installation is correct?',
      figure: { kind: 'suction_pump', h, t },
      options: [
        { text: 'The height h must not exceed about 10 m, because the atmosphere is what pushes the water up the pipe.', errorTag: 'none', rationale: 'Correct: the suction lift is limited by the available pressure difference between the atmosphere and the vacuum.', correct: true },
        { text: 'The intake depth t must not exceed about 10 m, because the pump cannot reach deeper than that.', errorTag: 'wrong_assumption', rationale: 'The intake depth is almost irrelevant for the suction capability: the pipe can extend far below the surface, since the water there is under pressure.' },
        { text: 'The total vertical length h + t must stay below 20 m.', errorTag: 'wrong_assumption', rationale: 'Only the part of the pipe above the water surface has to be lifted against gravity; the submerged part is supported by buoyancy of the surrounding water.' },
        { text: 'h must not exceed t, otherwise the pump draws air instead of water.', errorTag: 'wrong_assumption', rationale: 'If h is large the pump may fail to lift water at all, but that limit is set by atmospheric pressure, not by the intake depth.' },
      ],
      difficulty: 5,
      reasoningType: 'conceptual_discrimination',
      cognitiveMove: 'general_case',
      style: 'relevance_filter',
      hints: [
        'Ask which part of the pipe requires the water to be *lifted*.',
        'A suction pump works by removing pressure; the maximum lifting height follows from the atmosphere.',
      ],
      explanation: {
        testing: 'Identifying the physical limit of a suction lift rather than assuming geometry determines it.',
        matters: 'The height h above the free surface, and the fact that the pump can at best create a near-vacuum.',
        irrelevant: 'The intake depth t (and therefore the total pipe length): water below the surface is pushed up by the surrounding water, so depth is not a lifting problem.',
        concept: 'The lifting limit of a suction pump is set by the pressure difference to the atmosphere (about 1 bar ≈ 10 m).',
        why: 'A column of water can only be "pulled" by a pressure difference; once the pipe is more than about 10 m above the surface, no achievable vacuum can hold the column.',
        steps: [
          'The maximum available pressure difference is the atmosphere (about 1 bar) minus the pressure in the suction line (approaching 0).',
          `$h_{\\max} = \\Delta p/(\\rho g) = 100000/(1000 \\cdot 10) = 10\\,\\text{m}$`,
          'Therefore h — and only h — is limited; the submerged length t is not.',
        ],
        trap: 'Assuming the *total* pipe length matters, or that a deeper intake puts the suction under additional strain — in fact a deeper intake increases the pressure at the intake, which helps.',
        transfer: 'Whenever a flow is driven by a pressure difference, the achievable head follows from $\\Delta p = \\rho g h$; the same reasoning sizes gravity-fed pipelines and surge tanks.',
      },
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 6. density / depth effect statements                                */
/* ------------------------------------------------------------------ */
export function genFluidProperties(rng: Rng): Question {
  const kind = rng.pick(['density', 'gravity', 'object_density'] as const);
  if (kind === 'object_density') {
    const rhoObject = rng.pick([600, 700, 800, 900, 1200, 1500]);
    const floats = rhoObject < RHO;
    return assemble(
      {
        id: makeId('hydroobjdens', rng),
        domainId: 'D06',
        conceptIds: ['C06.buoy', 'C06.displaced'],
        label: 'OFFICIAL_SAMPLE',
        stem: `A homogeneous body of density ${rhoObject} kg/m³ is placed in water (density 1000 kg/m³). Which statement is correct?`,
        options: [
          {
            text: floats
              ? 'The body floats and the fraction of its volume below the surface is ' + num(rhoObject / 10, 1) + ' %.'
              : 'The body sinks, because its density exceeds the density of water.',
            errorTag: 'none',
            rationale: floats
              ? 'Correct: the submerged fraction equals the density ratio ρ_body/ρ_water.'
              : 'Correct: with a density greater than water, the body cannot displace enough water to balance its weight.',
            correct: true,
          },
          {
            text: floats ? 'The body sinks because it always displaces its full volume.' : 'The body floats with most of its volume above the surface.',
            errorTag: 'concept_confusion',
            rationale: floats
              ? 'A floating body displaces only the water needed to balance its weight — not its full volume.'
              : 'A body denser than the fluid cannot float; there is no submerged fraction that balances its weight.',
          },
          {
            text: 'The body’s behaviour depends only on its weight, not on its density.',
            errorTag: 'wrong_assumption',
            rationale: 'Weight and displaced volume both matter; for a homogeneous body their ratio — the density — decides.',
          },
          {
            text: 'The body floats with exactly half its volume submerged in any fluid.',
            errorTag: 'linearity_assumption',
            rationale: 'The submerged fraction is the density ratio, which is only 50 % in a fluid of exactly the same density as the body.',
          },
        ],
        difficulty: 4,
        reasoningType: 'conceptual_discrimination',
        cognitiveMove: 'classify_situation',
        style: 'statement_compare',
        hints: ['Compare the density of the body with the density of the fluid.', 'The submerged fraction equals ρ_body / ρ_fluid.'],
        explanation: {
          testing: 'Deciding float vs. sink from densities, and quantifying the submerged fraction.',
          matters: 'The two densities and the fact that the body is homogeneous.',
          concept: 'Floating equilibrium: submerged fraction = ρ_body/ρ_fluid.',
          why: 'The body’s weight (ρ_body·V·g) must be balanced by the buoyant force (ρ_fluid·V_sub·g), so V_sub/V = ρ_body/ρ_fluid.',
          steps: [
            `Compare: ${rhoObject} kg/m³ vs. 1000 kg/m³`,
            floats
              ? `Submerged fraction $= ${rhoObject}/1000 = ${num(rhoObject / 1000, 2)}$ ⇒ ${num(rhoObject / 10, 1)} % of the volume is below the surface.`
              : 'The body is denser than water, so even full submersion gives less buoyancy than its weight: it sinks.',
          ],
          trap: 'Believing that a floating body always submerges half its volume, or that weight alone decides (a heavy steel ship floats because of its shape-driven displaced volume, a small steel ball does not).',
          transfer: 'The density ratio explains icebergs (≈ 90 % submerged), hydrometers, and why adding salt to water changes how a body floats.',
        },
      },
      rng,
    );
  }

  const depth = rng.pick([20, 50, 100, 200]);
  const factor = rng.pick([1.5, 2, 3]);
  return assemble(
    {
      id: makeId('hydrodens', rng),
      domainId: 'D06',
      conceptIds: ['C06.depth'],
      label: 'OFFICIAL_SAMPLE',
      stem:
        `At a depth of ${depth} m, a diver measures the water pressure in ${kind === 'density' ? 'a fluid of density ρ₁' : 'a location where gravity is 9.8 N/kg'}. ` +
        (kind === 'density'
          ? `The measurement is repeated at the same depth in a fluid whose density is ${num(factor, 1)} times as large. How does the *depth-dependent part* of the pressure change?`
          : 'How would the depth-dependent part of the pressure differ if the same dive were performed where g = 10 N/kg?'),
      options: [
        {
          text: kind === 'density' ? `It becomes ${num(factor, 1)} times as large.` : 'It becomes larger by about 2 %.',
          errorTag: 'none',
          rationale: 'Correct: the depth-dependent part is ρgh, so it is proportional to the density (or to g).',
          correct: true,
        },
        {
          text: 'It stays the same because the depth is unchanged.',
          errorTag: 'concept_confusion',
          rationale: 'The depth sets the column height, but the column’s weight depends on its density as well.',
        },
        {
          text: kind === 'density' ? 'It becomes larger by the square of the density factor.' : 'It becomes larger by the square of the g factor.',
          errorTag: 'linearity_assumption',
          rationale: 'The pressure term is linear in ρ and in g, not quadratic.',
        },
        {
          text: 'It becomes smaller, because a denser fluid (larger g) presses outward more evenly.',
          errorTag: 'inequality_direction',
          rationale: 'A heavier fluid column or a larger gravitational acceleration increases the pressure at a given depth.',
        },
      ],
      difficulty: 3,
      reasoningType: 'parameter_reasoning',
      cognitiveMove: 'effect_of_change',
      style: 'effect_direction',
      hints: ['Write the depth-dependent term as $\\rho g h$ and change one factor at a time.', 'Proportionality means the term changes by the same factor as the changed quantity.'],
      explanation: {
        testing: 'Reading the pressure law as a proportionality statement rather than a formula to substitute into.',
        matters: 'Which factor changes and the fact that the depth-dependent term is a simple product.',
        concept: 'The depth term ρgh is linear in each of its three factors.',
        why: 'The term is the weight of the fluid column per unit area, and weight is proportional to density, depth and gravity.',
        steps: [
          `$p_{\\text{depth}} = \\rho g h = ${num(RHO * G * depth, 0)}\\,\\text{Pa}$ for ρ = 1000 kg/m³, g = 10 N/kg`,
          kind === 'density'
            ? `With density $${num(factor, 1)}\\rho$: the term becomes $${num(factor, 1)}$ times as large.`
            : 'With g = 10 instead of 9.8: the term becomes 10/9.8 ≈ 1.02 times as large, i.e. about 2 % larger.',
        ],
        trap: 'Believing depth alone determines the pressure (it does not: the fluid matters), or assuming a quadratic response.',
        transfer: 'Proportionality reasoning is the fastest route through parameter questions — the same technique as in the order-quantity exercise.',
      },
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 7. stability / tilting comparison                                   */
/* ------------------------------------------------------------------ */
export function genStability(rng: Rng): Question {
  const beams = rng.shuffle([2, 4, 7]);
  const offset = rng.pick([1, 1.5, 2]);
  const labels = ['A', 'B', 'C'];
  const narrowest = labels[beams.indexOf(Math.min(...beams))];
  return assemble(
    {
      id: makeId('hydrostab', rng),
      domainId: 'D06',
      conceptIds: ['C06.stability', 'C06.buoy'],
      label: 'OFFICIAL_SAMPLE',
      stem:
        `Three pontoon hulls A, B and C float upright in water. All three have the same mass and therefore displace the same amount of water, but their hull widths are different: ` +
        `A = ${beams[0]} m, B = ${beams[1]} m, C = ${beams[2]} m (the length of the hull is the same for all three). ` +
        `An identical heavy crate is loaded below deck on each pontoon and is then shifted sideways by the same distance d. Which pontoon tilts the furthest?`,
      figure: {
        kind: 'ship_stability',
        ships: [
          { label: 'A', beam: beams[0], boxOffset: offset },
          { label: 'B', beam: beams[1], boxOffset: offset },
          { label: 'C', beam: beams[2], boxOffset: offset },
        ],
      },
      options: [
        { text: `Pontoon ${narrowest}`, errorTag: 'none', rationale: 'Correct: the narrowest hull has the smallest restoring effect against the same tipping moment, so it tilts the most.', correct: true },
        {
          text: `Pontoon ${labels[beams.indexOf(Math.max(...beams))]}`,
          errorTag: 'concept_confusion',
          rationale: 'The widest hull has the largest restoring effect, so it tilts the least — not the most.',
        },
        {
          text: `Pontoon ${labels[beams.indexOf([...beams].sort((x, y) => x - y)[1])]}`,
          errorTag: 'concept_confusion',
          rationale: 'The middle hull tilts by an intermediate angle; the question asks for the largest tilt.',
        },
        { text: 'All three tilt by the same angle because they displace the same amount of water.', errorTag: 'concept_confusion', rationale: 'Equal displaced volume means equal buoyancy, but the *restoring* effect depends on the hull width: a narrow hull must tilt further to shift its centre of buoyancy by the required amount.' },
      ],
      difficulty: 5,
      reasoningType: 'conceptual_discrimination',
      cognitiveMove: 'general_case',
      style: 'statement_compare',
      hints: [
        'The tipping moment is the same for all three pontoon designs.',
        'What differs is how much the hull must rotate before the buoyant force shifts far enough to restore equilibrium.',
      ],
      explanation: {
        testing: 'Comparing restoring effects qualitatively when an identical disturbing moment acts on hulls of different width.',
        matters: 'The equal mass and displaced volume (equal buoyancy) and the different hull widths.',
        irrelevant: 'The absolute value of the crate mass and the offset distance d: they are identical for all three pontoons and therefore cannot decide the comparison.',
        concept: 'Stability: for a given tipping moment, the resulting tilt depends on the restoring capacity, which grows with the hull width.',
        why: 'When a hull tilts, the submerged volume shifts sideways. A wide hull achieves the required sideways shift of the centre of buoyancy with a small rotation, so it rights itself over a smaller angle; a narrow hull must rotate much further.',
        steps: [
          'Same mass ⇒ same displaced volume ⇒ same buoyant force for all three.',
          'Same crate shifted by the same d ⇒ same tipping moment.',
          'Restoring effect ∝ hull width; the narrowest hull therefore tilts the most.',
        ],
        trap: 'Concluding "same displacement ⇒ same behaviour"; the geometry of the waterplane, not the displaced volume alone, controls the tilt.',
        transfer: 'The same reasoning explains why a wide catamaran is more stable than a narrow kayak, why a loaded canoe feels tippy, and how stabilisers work.',
      },
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 8. critique: the compressible-bubble reasoning                      */
/* ------------------------------------------------------------------ */
export function genBubbleCritique(rng: Rng): Question {
  const appliedPressure = rng.pick([0.5, 1, 2, 3]);
  return assemble(
    {
      id: makeId('hydrobubble', rng),
      domainId: 'D06',
      conceptIds: ['C06.buoy', 'C05.gas'],
      label: 'OFFICIAL_SAMPLE',
      stem:
        `A vessel is filled with water and sealed with a flexible membrane on top. Inside the water floats a downward-open container that traps an air bubble at its top. ` +
        `A pressure of ${num(appliedPressure, 1)} bar is now applied to the water through the membrane. What happens to the container, and why?`,
      options: [
        {
          text: 'It sinks, because the air bubble is compressed and the displaced water volume therefore becomes smaller.',
          errorTag: 'none',
          rationale: 'Correct: the buoyant force depends on the displaced volume, which shrinks when the trapped air is compressed.',
          correct: true,
        },
        {
          text: 'It rises, because the increased pressure makes the water denser and therefore increases the buoyant force.',
          errorTag: 'wrong_assumption',
          rationale: 'Water is treated as incompressible in this model, so its density does not change measurably; the buoyant force depends on the displaced volume, not on the applied pressure.',
        },
        {
          text: 'It stays in place, because pressure acts equally in all directions and therefore cancels out.',
          errorTag: 'concept_confusion',
          rationale: 'Equal action in all directions is what makes buoyancy a *net* force; it does not mean the net force is unchanged when the object’s volume changes.',
        },
        {
          text: 'It first moves down with the pressure wave and then returns to exactly its original position.',
          errorTag: 'wrong_assumption',
          rationale: 'The change is permanent while the pressure is applied: the air stays compressed, so the buoyant force stays reduced.',
        },
      ],
      difficulty: 5,
      reasoningType: 'causal_reasoning',
      cognitiveMove: 'explain_or_critique',
      style: 'critique_reasoning',
      hints: [
        'Ask which volume in the system *can* change when pressure is applied.',
        'Buoyant force = weight of the displaced fluid; the fluid density is constant here.',
      ],
      explanation: {
        testing: 'Locating the compressible element in a system and tracing its effect through to the buoyant force.',
        matters: 'The trapped air (compressible) and the fact that water is treated as incompressible.',
        irrelevant: 'The numerical value of the applied pressure: it only sets how much the bubble shrinks, not the direction of the effect.',
        concept: 'Buoyancy depends on the displaced volume; a gas pocket can change that volume, a liquid cannot.',
        why: 'Applying pressure compresses the gas, so the container displaces less water, so the buoyant force falls below the weight and the container sinks.',
        steps: [
          'Identify the compressible component: the air bubble.',
          'Pressure increases ⇒ bubble volume decreases (pV roughly constant).',
          'Displaced water volume decreases ⇒ buoyant force decreases ⇒ the object sinks until a new equilibrium is reached.',
        ],
        trap: 'Looking for an effect through the water density; the water is incompressible, so the effect must come through the gas.',
        transfer: 'The same logic explains why a submarine’s ballast tanks blow air to rise, why a diver’s buoyancy changes with a compressed wetsuit, and why a Cartesian diver responds to squeezing the bottle.',
      },
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 9. relevance filter: which information is not needed                */
/* ------------------------------------------------------------------ */
export function genRelevanceFilter(rng: Rng): Question {
  const variant = rng.pick(['mass_from_volume', 'pressure_from_depth', 'submerged_fraction'] as const);
  if (variant === 'mass_from_volume') {
    const volume = rng.pick([2, 3, 4, 5]);
    const t1 = rng.int(2, 6);
    const t2 = t1 + rng.int(1, 3);
    return assemble(
      {
        id: makeId('hydrorel-mass', rng),
        domainId: 'D06',
        conceptIds: ['C06.displaced', 'C05.density'],
        label: 'OFFICIAL_SAMPLE',
        stem:
          `A completely submerged float of volume ${volume} m³ floats in equilibrium in water. Its top edge lies ${t1} m below the surface, its bottom edge ${t2} m below the surface, and the water temperature is 15 °C. ` +
          'Which piece of information is *not* needed to determine the mass of the float?',
        options: [
          { text: 'The two depth values (and the water temperature)', errorTag: 'none', rationale: 'Correct: the float is fully submerged, so its mass equals the mass of the water it displaces, which follows from the volume alone — the absolute depths do not enter.', correct: true },
          { text: 'The volume of the float', errorTag: 'question_misread', rationale: 'The volume converts directly into displaced water mass: without it nothing can be computed.' },
          { text: 'The density of water', errorTag: 'question_misread', rationale: 'The displaced mass is density × volume, so the density is essential.' },
          { text: 'The fact that the float is in equilibrium (floating)', errorTag: 'prerequisite_gap', rationale: 'This is exactly the condition that lets us equate displaced mass and body mass; without it the problem is unsolvable.' },
        ],
        difficulty: 4,
        reasoningType: 'conceptual_discrimination',
        cognitiveMove: 'interpret_representation',
        style: 'relevance_filter',
        hints: ['Ask of each number: does it enter the relation “displaced mass = body mass”?', 'The float is fully submerged — does the absolute depth change the displaced volume?'],
        explanation: {
          testing: 'Separating physically relevant data from realistic-looking decoys, a design element the official hydrostatics set uses deliberately.',
          matters: 'The volume, the water density and the floating condition.',
          irrelevant: 'The depths (they only prove full submersion) and the temperature (water density is given as constant in this model).',
          concept: 'Floating equilibrium: m_body = ρ·V_displaced.',
          why: 'Only the displaced volume and the fluid density appear in the relation; where the object happens to sit vertically is irrelevant.',
          steps: [
            `Displaced mass $= 1000 \\cdot ${volume} = ${volume * 1000}$ kg`,
            'Equilibrium ⇒ body mass = displaced mass.',
            'The depth values never appear in this chain.',
          ],
          trap: 'Using every number in the text because it looks relevant — a habit that costs time and invites unit errors.',
          transfer: 'Real exam inputs often contain decoration; the discipline of asking "which quantities appear in the relation I need?" protects time and accuracy.',
        },
      },
      rng,
    );
  }
  if (variant === 'pressure_from_depth') {
    const depth = rng.pick([25, 40, 60, 80]);
    const area = rng.int(2, 9);
    return assemble(
      {
        id: makeId('hydrorel-press', rng),
        domainId: 'D06',
        conceptIds: ['C06.depth'],
        label: 'OFFICIAL_SAMPLE',
        stem:
          `A diver measures the water pressure at a depth of ${depth} m. On the boat above, a hatch of area ${area} m² is discussed. Which information is *not* needed to compute the water pressure at the diver’s depth?`,
        options: [
          { text: 'The area of the hatch', errorTag: 'none', rationale: 'Correct: pressure is force per unit area and does not depend on the size of any particular surface; the area would be needed to compute a force.', correct: true },
          { text: 'The density of the water', errorTag: 'question_misread', rationale: 'The pressure is ρgh + p₀, so the density is essential.' },
          { text: 'The gravitational acceleration', errorTag: 'question_misread', rationale: 'It appears in ρgh; without it the pressure cannot be evaluated.' },
          { text: 'The depth itself', errorTag: 'question_misread', rationale: 'The depth is the central quantity in the depth-dependent term.' },
        ],
        difficulty: 3,
        reasoningType: 'conceptual_discrimination',
        cognitiveMove: 'interpret_representation',
        style: 'relevance_filter',
        hints: ['Pressure is a property of the *point*, not of the object that happens to be there.', 'Which formula connects depth, density and gravity?'],
        explanation: {
          testing: 'Distinguishing pressure (a local quantity) from force (which requires an area).',
          matters: 'Depth, water density and gravity.',
          irrelevant: `The area of the hatch (${area} m²) — it multiplies the pressure to give a force, but does not change the pressure itself.`,
          concept: 'p = ρgh + p₀ is independent of the size of any surface.',
          why: 'Pressure is defined per unit area; doubling the area doubles the force but leaves the pressure the same.',
          steps: [
            '$p = \\rho g h + p_0$ contains no area term.',
            `With ρ = 1000 kg/m³ and g = 10 N/kg: $p = 1000 \\cdot 10 \\cdot ${depth} = ${RHO * G * depth}\\,\\text{Pa}$ (plus atmosphere)`,
            'The hatch area would only enter if a force $F = pA$ were asked for.',
          ],
          trap: 'Reaching for the area because "pressure needs a surface" — pressure at a point exists even without a surface.',
          transfer: 'The distinction recurs in mechanics (stress vs. force), in economics (per-unit vs. total) and in any rate-versus-amount question.',
        },
      },
      rng,
    );
  }
  const volume = rng.pick([2, 4, 6]);
  const fraction = rng.pick([0.25, 0.5, 0.75]);
  return assemble(
    {
      id: makeId('hydrorel-frac', rng),
      domainId: 'D06',
      conceptIds: ['C06.displaced'],
      label: 'OFFICIAL_SAMPLE',
      stem:
        `A body of volume ${volume} m³ floats in water with ${num(fraction * 100, 0)} % of its volume submerged. Which quantity is *sufficient* to determine the buoyant force, once the water density is known?`,
      options: [
        { text: 'The submerged volume alone', errorTag: 'none', rationale: 'Correct: the buoyant force equals the weight of the displaced water, i.e. ρ·g·V_submerged.', correct: true },
        { text: 'The total volume alone', errorTag: 'wrong_assumption', rationale: 'Only the submerged part displaces water; using the total volume would overstate the buoyant force.' },
        { text: 'The depth of the body below the surface', errorTag: 'concept_confusion', rationale: 'Depth determines the local pressure, not the net buoyant force, which depends on the displaced volume.' },
        { text: 'The depth of the centre of gravity below the water surface', errorTag: 'concept_confusion', rationale: 'The vertical position of an already floating body does not change the displaced volume, so the depth tells nothing about the buoyant force.' },
      ],
      difficulty: 4,
      reasoningType: 'conceptual_discrimination',
      cognitiveMove: 'classify_situation',
      style: 'missing_information',
      hints: ['Buoyant force = weight of the displaced fluid.', 'Which part of the body displaces water?'],
      explanation: {
        testing: 'Knowing exactly which volume enters the buoyant-force relation.',
        matters: `The submerged volume, here ${num(volume * fraction, 2)} m³ out of ${volume} m³.`,
        irrelevant: 'The absolute depth and the shape of the body.',
        concept: 'F_B = ρ_fluid · g · V_submerged.',
        why: 'The buoyant force is the net upward pressure force, which equals the weight of the fluid pushed aside.',
        steps: [
          `$V_s = ${volume} \\cdot ${num(fraction, 2)} = ${num(volume * fraction, 2)}\\,\\text{m}^3$`,
          `$F_B = 1000 \\cdot 10 \\cdot ${num(volume * fraction, 2)} = ${num(RHO * G * volume * fraction, 0)}\\,\\text{N}$`,
        ],
        trap: 'Using the total volume, or thinking that deeper submersion increases buoyancy (only the displaced volume counts).',
        transfer: 'The same discrimination is needed whenever a rate applies to a part of a whole — taxed income, submerged fraction, insured share.',
      },
    },
    rng,
  );
}
