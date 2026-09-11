import type { ConceptDef, ConfidenceLabel, DomainDef, OfficialExampleStudy } from './types';

/**
 * Domain registry. Every domain carries a justification (required by the brief) and its
 * official-provenance labels. Nothing here invents a syllabus: labels distinguish what the
 * official material demonstrates, what it names as a possible area, what is a prerequisite,
 * and what is our own extension.
 */
export const DOMAINS: DomainDef[] = [
  {
    id: 'D01',
    title: 'Mathematical & Quantitative Reasoning',
    short: 'Math reasoning',
    labels: ['OFFICIAL_FIELD_LIST', 'PREREQUISITE'],
    justification:
      'The official instructions name "mathematics" as a possible topic area, and every official sample item demands quantitative fluency under a no-notes rule (10,000 m → 1,000 bar; 1800·50/2 → 300). Mental arithmetic, proportional reasoning and unit sense are therefore prerequisites rather than optional extras.',
    officialEvidence: 'PDF p. 33 field list; implicit in every official calculation.',
  },
  {
    id: 'D02',
    title: 'Vector & Quantitative Mathematics',
    short: 'Vectors',
    labels: ['OFFICIAL_SAMPLE', 'PREREQUISITE'],
    justification:
      'Directly demonstrated by official Exercise 1 (8 questions). It is the only mathematics domain the official material develops in full, and it supplies the geometric reasoning (area, volume, coplanarity) that transfers to other quantitative items.',
    officialEvidence: 'PDF pp. 34–39: component form, magnitude, addition, scalar multiplication, dot/vector/triple product table, 8 questions with official solutions.',
  },
  {
    id: 'D03',
    title: 'Data Interpretation, Tables & Graphs',
    short: 'Data & graphs',
    labels: ['OFFICIAL_FIELD_LIST', 'PREREQUISITE'],
    justification:
      'The official instructions state that questions and answer options "may contain figures, tables and formulas", and official items require reading a coordinate grid, a cost-curve figure and a technical sketch. The official field list includes mathematics and computational sciences, both of which lean on data reading.',
    officialEvidence: 'PDF p. 33 (figures/tables/formulas); Exercise 1 Q1/Q7, Exercise 3 Q7.',
  },
  {
    id: 'D04',
    title: 'Probability & Statistics Foundations',
    short: 'Probability & statistics',
    labels: ['OFFICIAL_FIELD_LIST', 'PREREQUISITE'],
    justification:
      'The official research-methods input requires understanding "sample of appropriate size", "statistical significance" and what a single case can and cannot show. Probability and statistics supply the conceptual vocabulary for those distinctions and are named indirectly through the mathematics field.',
    officialEvidence: 'PDF p. 53 (sample size / statistical significance); field list p. 33.',
  },
  {
    id: 'D05',
    title: 'Physics Fundamentals',
    short: 'Physics basics',
    labels: ['OFFICIAL_FIELD_LIST', 'PREREQUISITE'],
    justification:
      'Prerequisite for the demonstrated hydrostatics questions (force, area, pressure, density, weight, gas behaviour), and "natural sciences" is named on the official field list.',
    officialEvidence: 'PDF pp. 40–47 require p = F/A, density, weight force and compressible air.',
  },
  {
    id: 'D06',
    title: 'Hydrostatics & Fluid Concepts',
    short: 'Hydrostatics',
    labels: ['OFFICIAL_SAMPLE', 'PREREQUISITE'],
    justification:
      'Directly demonstrated by official Exercise 2 (6 questions) with the law p = ρgh + p₀, the 1 bar per 10 m simplification, buoyancy balance and two explanatory figures.',
    officialEvidence: 'PDF pp. 40–47.',
  },
  {
    id: 'D07',
    title: 'Mechanics & Engineering Reasoning',
    short: 'Mechanics & engineering',
    labels: ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
    justification:
      'Officially named area ("engineering"). It is justified because the official stability question and the pump sketch already require static-equilibrium and centre-of-gravity reasoning, so this domain extends demonstrated reasoning rather than guessing at content.',
    officialEvidence: 'PDF pp. 43–47: pump sketch, buoyancy/stability figure, tilting comparison.',
  },
  {
    id: 'D08',
    title: 'Computational & Algorithmic Reasoning',
    short: 'Computational reasoning',
    labels: ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
    justification:
      'Officially named area ("computational sciences"). Algorithm tracing, growth-rate intuition and procedure checking can be examined in the same input-plus-questions format without any programming environment, which makes the domain compatible with the demonstrated item anatomy.',
    officialEvidence: 'PDF p. 33 field list only — no sample question is published.',
  },
  {
    id: 'D09',
    title: 'Business Mathematics & Optimisation',
    short: 'Business maths (EOQ)',
    labels: ['OFFICIAL_SAMPLE', 'PREREQUISITE'],
    justification:
      'Directly demonstrated by official Exercise 3 (7 questions) on the optimal order quantity model, including its assumptions, its cost structure and parameter-scaling reasoning. Business administration is also named on the official field list.',
    officialEvidence: 'PDF pp. 48–52.',
  },
  {
    id: 'D10',
    title: 'Economics Fundamentals',
    short: 'Economics',
    labels: ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
    justification:
      'Officially named area ("economics"). It is included because the demonstrated inventory model is an economic trade-off, so opportunity cost, marginal reasoning and elasticity intuition supply the "why" behind the formula the official material presents.',
    officialEvidence: 'PDF p. 33 field list; p. 48 names economic cost reasoning.',
  },
  {
    id: 'D11',
    title: 'Research Methodology & Design',
    short: 'Research methodology',
    labels: ['OFFICIAL_SAMPLE'],
    justification:
      'Directly demonstrated by official Exercise 4 (6 questions), entirely conceptual: quantitative/qualitative strategies, causal relationship vs. mechanism, research phases, linear vs. circular processes and documentation duties.',
    officialEvidence: 'PDF pp. 53–56.',
  },
  {
    id: 'D12',
    title: 'Social-Science Reasoning & Causal Inference',
    short: 'Social-science reasoning',
    labels: ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
    justification:
      'Officially named area ("social sciences"), and the official Exercise 4 Q4 already asks the student to judge realistic study scenarios. Confounders, selection effects and operationalisation are the natural transfer surface for that demonstrated skill.',
    officialEvidence: 'PDF pp. 53–56.',
  },
  {
    id: 'D13',
    title: 'Scientific Reasoning, Models & Estimation',
    short: 'Scientific reasoning',
    labels: ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
    justification:
      'Officially named area ("natural sciences"). The official hydrostatics solution reasons explicitly about a "simplified model" versus a "precise calculation", and the EOQ text is an exercise in model assumptions, so reasoning about models and approximations is demonstrated reasoning rather than guesswork.',
    officialEvidence: 'PDF p. 45 (simplified vs. precise calculation), pp. 48 (assumption list).',
  },
  {
    id: 'D14',
    title: 'Experimental & Evidence-Based Reasoning',
    short: 'Experimental reasoning',
    labels: ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
    justification:
      'The official field list names natural and social sciences; the demonstrated research-methods input distinguishes what one case can show from what a sample can show, which is exactly the evidence-evaluation skill extended here (controls, replication, precision vs. accuracy).',
    officialEvidence: 'PDF p. 53 (case vs. sample, significance).',
  },
  {
    id: 'D15',
    title: 'Argument & Text Reasoning (humanities style)',
    short: 'Argument analysis',
    labels: ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
    justification:
      'Officially named area ("humanities"). It is justified because the official Exercise 1 Q8 — "which statement is correct for all possible cases" — is a quantifier-precision item in mathematical clothing, and Exercise 4 items require distinguishing near-synonymous definitions in prose.',
    officialEvidence: 'PDF pp. 37 (Q8), 53–56 (conceptual discrimination items).',
  },
];

export const DOMAIN_BY_ID: Record<string, DomainDef> = Object.fromEntries(DOMAINS.map((d) => [d.id, d]));

/**
 * Concept graph. `prereq` drives prerequisite-gap diagnosis.
 */
export const CONCEPTS: ConceptDef[] = [
  // D01
  { id: 'C01.ratio', domainId: 'D01', title: 'Ratio, proportion and percentage', prereq: [], label: 'PREREQUISITE', lessonId: 'L01' },
  { id: 'C01.units', domainId: 'D01', title: 'Units and conversion', prereq: [], label: 'PREREQUISITE', lessonId: 'L01' },
  { id: 'C01.rate', domainId: 'D01', title: 'Rates and proportional scaling', prereq: ['C01.ratio'], label: 'PREREQUISITE', lessonId: 'L01' },
  { id: 'C01.estimate', domainId: 'D01', title: 'Estimation and order of magnitude', prereq: ['C01.rate'], label: 'PREREQUISITE', lessonId: 'L01' },
  // D02
  { id: 'C02.coords', domainId: 'D02', title: 'Coordinates and components', prereq: [], label: 'PREREQUISITE', lessonId: 'L02' },
  { id: 'C02.magnitude', domainId: 'D02', title: 'Vector magnitude (Pythagoras)', prereq: ['C02.coords'], label: 'OFFICIAL_SAMPLE', lessonId: 'L02' },
  { id: 'C02.addsub', domainId: 'D02', title: 'Vector addition and subtraction', prereq: ['C02.coords'], label: 'OFFICIAL_SAMPLE', lessonId: 'L02' },
  { id: 'C02.scalar', domainId: 'D02', title: 'Scalar multiplication: magnitude and direction', prereq: ['C02.magnitude'], label: 'OFFICIAL_SAMPLE', lessonId: 'L02' },
  { id: 'C02.dot', domainId: 'D02', title: 'Scalar (dot) product', prereq: ['C02.addsub'], label: 'OFFICIAL_SAMPLE', lessonId: 'L02' },
  { id: 'C02.angle', domainId: 'D02', title: 'Angle between vectors, perpendicularity', prereq: ['C02.dot', 'C02.magnitude'], label: 'OFFICIAL_SAMPLE', lessonId: 'L02' },
  { id: 'C02.cross', domainId: 'D02', title: 'Vector (cross) product', prereq: ['C02.dot'], label: 'OFFICIAL_SAMPLE', lessonId: 'L02' },
  { id: 'C02.area', domainId: 'D02', title: 'Parallelogram area from |a×b|', prereq: ['C02.cross'], label: 'OFFICIAL_SAMPLE', lessonId: 'L02' },
  { id: 'C02.triple', domainId: 'D02', title: 'Triple product and volume', prereq: ['C02.cross'], label: 'OFFICIAL_SAMPLE', lessonId: 'L02' },
  { id: 'C02.coplanar', domainId: 'D02', title: 'Coplanarity and zero triple product', prereq: ['C02.triple'], label: 'OFFICIAL_SAMPLE', lessonId: 'L02' },
  { id: 'C02.resulttype', domainId: 'D02', title: 'Result type of each product', prereq: ['C02.dot', 'C02.cross', 'C02.triple'], label: 'OFFICIAL_SAMPLE', lessonId: 'L02' },
  // D03
  { id: 'C03.read', domainId: 'D03', title: 'Reading values from tables and charts', prereq: [], label: 'PREREQUISITE', lessonId: 'L03' },
  { id: 'C03.gradient', domainId: 'D03', title: 'Gradients, intercepts and break-even', prereq: ['C03.read', 'C01.rate'], label: 'PREREQUISITE', lessonId: 'L03' },
  { id: 'C03.distort', domainId: 'D03', title: 'Misleading axes, absolute vs. relative', prereq: ['C03.read'], label: 'PREPARATION_EXTENSION', lessonId: 'L03' },
  // D04
  { id: 'C04.mean', domainId: 'D04', title: 'Mean, median and spread', prereq: [], label: 'PREREQUISITE', lessonId: 'L04' },
  { id: 'C04.prob', domainId: 'D04', title: 'Probability, complements and expected counts', prereq: ['C01.ratio'], label: 'PREREQUISITE', lessonId: 'L04' },
  { id: 'C04.conditional', domainId: 'D04', title: 'Conditional probability and base rates', prereq: ['C04.prob'], label: 'PREREQUISITE', lessonId: 'L04' },
  { id: 'C04.sampling', domainId: 'D04', title: 'Sampling, bias and significance', prereq: ['C04.mean'], label: 'PREREQUISITE', lessonId: 'L04' },
  // D05
  { id: 'C05.force', domainId: 'D05', title: 'Force, area and pressure', prereq: ['C01.units'], label: 'PREREQUISITE', lessonId: 'L05' },
  { id: 'C05.density', domainId: 'D05', title: 'Mass, volume, density, weight', prereq: ['C01.units'], label: 'PREREQUISITE', lessonId: 'L05' },
  { id: 'C05.energy', domainId: 'D05', title: 'Work, energy, power, efficiency', prereq: ['C05.force'], label: 'PREPARATION_EXTENSION', lessonId: 'L05' },
  { id: 'C05.gas', domainId: 'D05', title: 'Ideal gas: p·V = constant', prereq: ['C05.force'], label: 'PREREQUISITE', lessonId: 'L05' },
  // D06
  { id: 'C06.depth', domainId: 'D06', title: 'Pressure grows linearly with depth', prereq: ['C05.force', 'C05.density'], label: 'OFFICIAL_SAMPLE', lessonId: 'L06' },
  { id: 'C06.atm', domainId: 'D06', title: 'Atmospheric pressure and p₀', prereq: ['C06.depth'], label: 'OFFICIAL_SAMPLE', lessonId: 'L06' },
  { id: 'C06.bar', domainId: 'D06', title: 'The 1 bar per 10 m mental model', prereq: ['C06.depth'], label: 'OFFICIAL_SAMPLE', lessonId: 'L06' },
  { id: 'C06.buoy', domainId: 'D06', title: 'Buoyancy as a pressure difference', prereq: ['C06.depth'], label: 'OFFICIAL_SAMPLE', lessonId: 'L06' },
  { id: 'C06.displaced', domainId: 'D06', title: 'Displaced mass = body mass (floating)', prereq: ['C06.buoy', 'C05.density'], label: 'OFFICIAL_SAMPLE', lessonId: 'L06' },
  { id: 'C06.trapped', domainId: 'D06', title: 'Trapped air, compression and flooding', prereq: ['C06.depth', 'C05.gas'], label: 'OFFICIAL_SAMPLE', lessonId: 'L06' },
  { id: 'C06.suction', domainId: 'D06', title: 'Suction lift limited by atmospheric pressure', prereq: ['C06.atm'], label: 'OFFICIAL_SAMPLE', lessonId: 'L06' },
  { id: 'C06.stability', domainId: 'D06', title: 'Tilting, restoring effect and hull width', prereq: ['C06.buoy'], label: 'OFFICIAL_SAMPLE', lessonId: 'L06' },
  // D07
  { id: 'C07.moment', domainId: 'D07', title: 'Moments, levers and equilibrium', prereq: ['C05.force'], label: 'PREPARATION_EXTENSION', lessonId: 'L07' },
  { id: 'C07.lever', domainId: 'D07', title: 'Mechanical advantage of simple machines', prereq: ['C07.moment'], label: 'PREPARATION_EXTENSION', lessonId: 'L07' },
  { id: 'C07.flow', domainId: 'D07', title: 'Continuity of flow (A₁v₁ = A₂v₂)', prereq: ['C01.rate'], label: 'PREPARATION_EXTENSION', lessonId: 'L07' },
  { id: 'C07.efficiency', domainId: 'D07', title: 'Energy efficiency of a process', prereq: ['C05.energy'], label: 'PREPARATION_EXTENSION', lessonId: 'L07' },
  // D08
  { id: 'C08.trace', domainId: 'D08', title: 'Tracing an algorithm step by step', prereq: [], label: 'PREPARATION_EXTENSION', lessonId: 'L08' },
  { id: 'C08.growth', domainId: 'D08', title: 'Growth rates and complexity intuition', prereq: ['C08.trace', 'C01.rate'], label: 'PREPARATION_EXTENSION', lessonId: 'L08' },
  { id: 'C08.binary', domainId: 'D08', title: 'Binary representation and place values', prereq: [], label: 'PREPARATION_EXTENSION', lessonId: 'L08' },
  { id: 'C08.debug', domainId: 'D08', title: 'Finding the error in a procedure', prereq: ['C08.trace'], label: 'PREPARATION_EXTENSION', lessonId: 'L08' },
  // D09
  { id: 'C09.assume', domainId: 'D09', title: 'Assumptions of the order-quantity model', prereq: [], label: 'OFFICIAL_SAMPLE', lessonId: 'L09' },
  { id: 'C09.avg', domainId: 'D09', title: 'Average inventory Q/2', prereq: ['C09.assume'], label: 'OFFICIAL_SAMPLE', lessonId: 'L09' },
  { id: 'C09.cost', domainId: 'D09', title: 'Ordering vs. holding cost terms', prereq: ['C09.avg'], label: 'OFFICIAL_SAMPLE', lessonId: 'L09' },
  { id: 'C09.qstar', domainId: 'D09', title: 'Q* = √(2DS/H)', prereq: ['C09.cost'], label: 'OFFICIAL_SAMPLE', lessonId: 'L09' },
  { id: 'C09.balance', domainId: 'D09', title: 'Optimum where the two costs balance', prereq: ['C09.qstar'], label: 'OFFICIAL_SAMPLE', lessonId: 'L09' },
  { id: 'C09.scaling', domainId: 'D09', title: 'Parameter scaling (√ law)', prereq: ['C09.qstar'], label: 'OFFICIAL_SAMPLE', lessonId: 'L09' },
  { id: 'C09.curve', domainId: 'D09', title: 'Reading the cost curves', prereq: ['C09.cost'], label: 'OFFICIAL_SAMPLE', lessonId: 'L09' },
  { id: 'C09.value', domainId: 'D09', title: 'Unit value → holding cost → Q*', prereq: ['C09.qstar'], label: 'OFFICIAL_SAMPLE', lessonId: 'L09' },
  { id: 'C09.sensitivity', domainId: 'D09', title: 'Flat-bottom: cost of a non-optimal Q', prereq: ['C09.balance'], label: 'PREPARATION_EXTENSION', lessonId: 'L09' },
  // D10
  { id: 'C10.opportunity', domainId: 'D10', title: 'Opportunity cost', prereq: [], label: 'PREPARATION_EXTENSION', lessonId: 'L10' },
  { id: 'C10.marginal', domainId: 'D10', title: 'Marginal reasoning', prereq: ['C10.opportunity'], label: 'PREPARATION_EXTENSION', lessonId: 'L10' },
  { id: 'C10.breakeven', domainId: 'D10', title: 'Break-even and contribution margin', prereq: ['C01.rate'], label: 'PREPARATION_EXTENSION', lessonId: 'L10' },
  { id: 'C10.elasticity', domainId: 'D10', title: 'Demand response and elasticity direction', prereq: ['C01.ratio'], label: 'PREPARATION_EXTENSION', lessonId: 'L10' },
  { id: 'C10.real', domainId: 'D10', title: 'Real vs. nominal quantities', prereq: ['C01.ratio'], label: 'PREPARATION_EXTENSION', lessonId: 'L10' },
  // D11
  { id: 'C11.qtypes', domainId: 'D11', title: 'Quantitative vs. qualitative strategy', prereq: [], label: 'OFFICIAL_SAMPLE', lessonId: 'L11' },
  { id: 'C11.dedind', domainId: 'D11', title: 'Deductive vs. inductive reasoning', prereq: ['C11.qtypes'], label: 'OFFICIAL_SAMPLE', lessonId: 'L11' },
  { id: 'C11.relmech', domainId: 'D11', title: 'Causal relationship vs. causal mechanism', prereq: ['C11.qtypes'], label: 'OFFICIAL_SAMPLE', lessonId: 'L11' },
  { id: 'C11.phases', domainId: 'D11', title: 'The four research phases', prereq: [], label: 'OFFICIAL_SAMPLE', lessonId: 'L11' },
  { id: 'C11.linear', domainId: 'D11', title: 'Linear vs. circular process', prereq: ['C11.phases'], label: 'OFFICIAL_SAMPLE', lessonId: 'L11' },
  { id: 'C11.document', domainId: 'D11', title: 'Documentation and design changes', prereq: ['C11.linear'], label: 'OFFICIAL_SAMPLE', lessonId: 'L11' },
  { id: 'C11.general', domainId: 'D11', title: 'Generalisation vs. transferability', prereq: ['C11.qtypes'], label: 'OFFICIAL_SAMPLE', lessonId: 'L11' },
  { id: 'C11.mixed', domainId: 'D11', title: 'Designing a mixed-methods study', prereq: ['C11.relmech', 'C11.general'], label: 'OFFICIAL_SAMPLE', lessonId: 'L11' },
  // D12
  { id: 'C12.confound', domainId: 'D12', title: 'Confounding and alternative explanations', prereq: ['C11.relmech'], label: 'PREPARATION_EXTENSION', lessonId: 'L12' },
  { id: 'C12.selection', domainId: 'D12', title: 'Selection and survivorship effects', prereq: ['C12.confound'], label: 'PREPARATION_EXTENSION', lessonId: 'L12' },
  { id: 'C12.operational', domainId: 'D12', title: 'Operationalisation of concepts', prereq: ['C11.phases'], label: 'PREPARATION_EXTENSION', lessonId: 'L12' },
  { id: 'C12.level', domainId: 'D12', title: 'Individual vs. aggregate (ecological) reasoning', prereq: ['C04.sampling'], label: 'PREPARATION_EXTENSION', lessonId: 'L12' },
  // D13
  { id: 'C13.model', domainId: 'D13', title: 'Model assumptions and idealisation', prereq: [], label: 'PREPARATION_EXTENSION', lessonId: 'L13' },
  { id: 'C13.scaling', domainId: 'D13', title: 'Proportionality and scaling laws', prereq: ['C01.rate'], label: 'PREPARATION_EXTENSION', lessonId: 'L13' },
  { id: 'C13.estimate', domainId: 'D13', title: 'Order-of-magnitude estimation', prereq: ['C01.estimate'], label: 'PREPARATION_EXTENSION', lessonId: 'L13' },
  { id: 'C13.precision', domainId: 'D13', title: 'Precision vs. accuracy', prereq: [], label: 'PREPARATION_EXTENSION', lessonId: 'L13' },
  // D14
  { id: 'C14.control', domainId: 'D14', title: 'Controls and comparison groups', prereq: [], label: 'PREPARATION_EXTENSION', lessonId: 'L14' },
  { id: 'C14.bias', domainId: 'D14', title: 'Randomisation, blinding, placebo effects', prereq: ['C14.control'], label: 'PREPARATION_EXTENSION', lessonId: 'L14' },
  { id: 'C14.replicate', domainId: 'D14', title: 'Replication and evidence strength', prereq: ['C14.control'], label: 'PREPARATION_EXTENSION', lessonId: 'L14' },
  { id: 'C14.conclude', domainId: 'D14', title: 'What a data set can and cannot establish', prereq: ['C14.control', 'C04.sampling'], label: 'PREPARATION_EXTENSION', lessonId: 'L14' },
  // D15
  { id: 'C15.claim', domainId: 'D15', title: 'Claim, support and conclusion', prereq: [], label: 'PREPARATION_EXTENSION', lessonId: 'L15' },
  { id: 'C15.quantifier', domainId: 'D15', title: 'All / some / only: quantifier precision', prereq: ['C15.claim'], label: 'PREPARATION_EXTENSION', lessonId: 'L15' },
  { id: 'C15.necessary', domainId: 'D15', title: 'Necessary vs. sufficient conditions', prereq: ['C15.quantifier'], label: 'PREPARATION_EXTENSION', lessonId: 'L15' },
  { id: 'C15.inference', domainId: 'D15', title: 'Valid vs. invalid inference', prereq: ['C15.claim'], label: 'PREPARATION_EXTENSION', lessonId: 'L15' },
];

export const CONCEPT_BY_ID: Record<string, ConceptDef> = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));

/** Walk the prerequisite graph upward (transitive closure). */
export function prerequisitesOf(conceptId: string, seen = new Set<string>()): string[] {
  const c = CONCEPT_BY_ID[conceptId];
  if (!c) return [];
  for (const p of c.prereq) {
    if (!seen.has(p)) {
      seen.add(p);
      prerequisitesOf(p, seen);
    }
  }
  return [...seen];
}

export interface LessonRef {
  id: string;
  domainId: string;
  title: string;
}

/** Lessons in curriculum order: domain D01 → L01 … D15 → L15 (one lesson per domain). */
export function LESSONS_BY_DOMAIN_ORDER(): LessonRef[] {
  return DOMAINS.map((d, i) => ({ id: `L${String(i + 1).padStart(2, '0')}`, domainId: d.id, title: d.title }));
}

export const LESSON_ORDER: string[] = LESSONS_BY_DOMAIN_ORDER().map((l) => l.id);

export function conceptsOfDomain(domainId: string): ConceptDef[] {
  return CONCEPTS.filter((c) => c.domainId === domainId);
}

export function labelOfConcept(conceptId: string): ConfidenceLabel {
  return CONCEPT_BY_ID[conceptId]?.label ?? 'PREPARATION_EXTENSION';
}

/**
 * The four official exercises, studied as exercises (never as copied question text):
 * what each teaches, which reasoning moves it demands, and what we train beyond it.
 */
export const OFFICIAL_EXAMPLES: OfficialExampleStudy[] = [
  {
    id: 'EX1',
    title: 'Exercise 1 — Vector Calculations',
    domainId: 'D02',
    teaches: [
      'Scalars have one number; vectors have n components (the material works in 2D and 3D).',
      'Components can be read off a coordinate figure and then manipulated symbolically.',
      'Addition and subtraction are component-wise; scalar multiplication scales every component.',
      'Length comes from Pythagoras, generalised to more components.',
      'Three products are defined: scalar product (scalar), vector product (vector), triple product (scalar).',
      'The magnitude of the vector product equals the area of the parallelogram spanned.',
      'A zero triple product means the spanned volume is zero — the vectors lie in one plane.',
    ],
    moves: [
      'read a figure, convert it into components, then compute',
      'interpret the effect of a negative scalar on length and direction',
      'compare result *types* of operations without computing',
      'compute a dot product and reject magnitude-based distractors',
      'rearrange a·b = |a||b|cos φ and keep the answer in arccos form',
      'execute the cross product while tracking signs',
      'use the geometric meaning of |a×b| for an area',
      'decide which statement holds in *all* cases (coplanarity)',
    ],
    keyInsight:
      'The exercise is not about memorising three formulas: it is about knowing what each operation produces, what it means geometrically, and how changing an input changes the output.',
    beyondSample: [
      'Perpendicularity and obtuse/acute angle tests as statement items.',
      'Reverse questions: given the cross product or the area, recover an unknown component.',
      'Effect-direction items (double one vector, rotate a component): how do dot, cross and area change?',
      'Critique items: a student claims a calculation is right — which step fails?',
      'Disguised contexts: work done by a force along a displacement (dot product), torque and area of a deck (cross product), coplanarity of a rigid structure.',
    ],
  },
  {
    id: 'EX2',
    title: 'Exercise 2 — Hydrostatics',
    domainId: 'D06',
    teaches: [
      'In an incompressible fluid, pressure increases linearly with depth.',
      'The reason: the weight of the fluid column above a point, which acts in every direction.',
      'Pressure at a point depends only on vertical depth below the surface and on fluid density.',
      'An external pressure (atmosphere) adds to the pressure inside the fluid: p = ρgh + p₀.',
      'Simplification used for estimation: ρ_water = 1000 kg/m³, g ≈ 10 N/kg ⇒ about 1 bar per 10 m.',
      'A floating body displaces fluid whose mass equals its own mass; F_G − F_B = 0.',
      'Weight acts at the centre of gravity, buoyancy at the centre of gravity of the submerged part.',
    ],
    moves: [
      'scale a per-10-m rule to a large depth and choose the right order of magnitude',
      'decide which given data are irrelevant and which establish submersion',
      'combine trapped-air compression with the flooding of a sealed compartment',
      'identify which volume is compressible to decide how buoyancy changes',
      'reason about a physical limit imposed by the atmosphere instead of by geometry',
      'compare restoring effects qualitatively to determine which hull tilts furthest',
    ],
    keyInsight:
      'One law explains ships, submarines, pumps and bubbles. The exam tests whether you can apply that single law to a situation you have never seen, and whether you know which quantities cancel out.',
    beyondSample: [
      'Statements about gauge vs. total pressure at different depths (the classic "twice as deep" trap).',
      'Buoyancy with partially submerged bodies described by a submerged fraction.',
      'Effect-direction items: change density, change depth, change the trapped-gas volume.',
      'Relevance-filter items where several realistic numbers are decoys.',
      'Engineering contexts: hydraulic press, U-tube, ballast tank, suction dredge.',
    ],
  },
  {
    id: 'EX3',
    title: 'Exercise 3 — Optimal Order Quantity',
    domainId: 'D09',
    teaches: [
      'The model minimises the sum of holding costs and fixed ordering costs.',
      'Fixed ordering cost is constant per order because the work does not depend on the quantity.',
      'Key assumptions: constant known demand, no quantity discounts, no capital or storage limits, cost minimisation as the only objective.',
      'Between orders, inventory falls steadily from Q to 0, so average inventory is Q/2.',
      'Q* = √(2DS/H), with D = annual demand, S = cost per order, H = holding cost per unit per year.',
      'H depends on storage (rent) and on the value of the stored good (capital and risk costs).',
    ],
    moves: [
      'recognise which statement is an assumption of the model (and which is a violation of it)',
      'reason about the *direction* of an effect instead of calculating',
      'explain why the average inventory term is Q/2 rather than Q',
      'substitute into Q* with mentally tractable numbers',
      'apply scaling logic: doubling S multiplies Q* by √2, not by 2',
      'translate a business fact (higher unit value) into a model parameter (higher H) and then into an effect on Q*',
      'identify which cost curve is which and where the minimum lies',
    ],
    keyInsight:
      'The formula is a consequence of a cost trade-off. Questions are built on the trade-off, not on the formula, so parameter reasoning beats substitution.',
    beyondSample: [
      'Total relevant cost at Q* and the fact that the two cost terms are equal there.',
      'The flat-bottom property: ordering 2Q* raises total cost only 25 %.',
      'Orders per year, cycle length and reorder timing.',
      'Quantity-discount break-even reasoning (extension, labelled).',
      'Critique items where a manager\'s stated reason for a bigger order is checked against the model.',
    ],
  },
  {
    id: 'EX4',
    title: 'Exercise 4 — Research Strategies in Social Sciences',
    domainId: 'D11',
    teaches: [
      'Both strategies explain social action, but weight two aspects differently.',
      'Aspect 1 — causal relationship: does a factor relate to an outcome? (does education relate to income?)',
      'Aspect 2 — causal mechanism: how does the outcome come about? (education opens professional opportunities)',
      'Quantitative = theory testing = deductive: standardised collection plus statistical tests, adequate sample size for significance.',
      'Qualitative = theory generating = inductive: one or a few cases, reveals mechanisms and their individual conditions, but says nothing about how widespread those conditions are.',
      'Four phases: formulating the problem/question, specifying the research design, collecting and analysing data, processing the material.',
      'Quantitative projects proceed linearly and separate conceptual, theoretical, methodological and empirical steps; changes are possible but must be documented and can reduce comparability.',
      'Qualitative projects may include circular elements: phases are not strictly separated and preconceptions or methods may change if clearly documented.',
    ],
    moves: [
      'complete a definition of the deductive strategy (relationship, not mechanism)',
      'map the inductive strategy to its true goal (how and why, not how widely)',
      'decide which design change is permitted in which tradition',
      'judge which of four realistic scenarios most clearly violates the ideal-typical quantitative process',
      'build a mixed design by matching each sub-question to a suitable data source',
      'recognise a deductive study described without the words "deductive" or "hypothesis"',
    ],
    keyInsight:
      'The items never reward reciting definitions; they reward a clean mental model of two research logics and of the obligations that come with each (documentation, phase order, transferability).',
    beyondSample: [
      'Systematic contrast pairs: relationship vs. mechanism, deductive vs. inductive, generalisation vs. transferability, linear vs. circular, permitting change vs. documenting change.',
      'Scenario judgement in social-science reasoning: confounders, selection effects, operationalisation.',
      'Design-repair items: what would have to be added for the claim to be defensible?',
      'Text-reasoning items on quantifier precision ("only", "all", "at least one").',
    ],
  },
];
