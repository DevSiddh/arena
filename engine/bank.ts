import { makeRng } from './rng';
import type { Bank, Lesson, Question } from './types';
import { buildAndValidate, formatReport, attachStimuli, type BuildReport } from './validators';
import { STIMULI } from './authored/stimuli';
import { METHODOLOGY_AUTHORED } from './authored/methodology';
import { ARGUMENT_AUTHORED, EXPERIMENT_AUTHORED, SCIENTIFIC_AUTHORED } from './authored/reasoning';
import { EOQ_CONCEPTUAL, HYDRO_CONCEPTUAL, MISC_CONCEPTUAL, VECTOR_CONCEPTUAL } from './authored/conceptual';
import { ADVANCED_AUTHORED } from './authored/advanced';
import * as V from './generators/vector';
import * as H from './generators/hydro';
import * as E from './generators/eoq';
import * as M from './generators/misc';

/**
 * Bank assembly.
 *
 * Candidates come from three sources:
 *   1. parametric generator families (numeric domains) — many variants per family,
 *   2. authored conceptual items (critique, statement, judgement),
 *   3. authored methodology/reasoning items (the verbal domains).
 *
 * Every candidate passes the independent validator; failures are retried with fresh random
 * values where the defect is regenerable, and otherwise reported.
 */

export type Family = { name: string; fn: (rng: ReturnType<typeof makeRng>) => Question };

export const FAMILIES: Family[] = [
  { name: 'vector/add-sub', fn: V.genVectorAddSub },
  { name: 'vector/magnitude', fn: V.genVectorMagnitude },
  { name: 'vector/scalar-mult', fn: V.genScalarMultiplication },
  { name: 'vector/dot', fn: V.genDotProduct },
  { name: 'vector/angle', fn: V.genAngle },
  { name: 'vector/cross', fn: V.genCrossProduct },
  { name: 'vector/area', fn: V.genParallelogramArea },
  { name: 'vector/triple', fn: V.genTripleProduct },
  { name: 'vector/effect', fn: V.genVectorEffect },
  { name: 'vector/result-type', fn: V.genResultType },
  { name: 'hydro/pressure-depth', fn: H.genPressureAtDepth },
  { name: 'hydro/pressure-compare', fn: H.genPressureComparison },
  { name: 'hydro/buoyancy-mass', fn: H.genBuoyancyMass },
  { name: 'hydro/trapped-air', fn: H.genTrappedAir },
  { name: 'hydro/suction', fn: H.genSuctionLift },
  { name: 'hydro/fluid-properties', fn: H.genFluidProperties },
  { name: 'hydro/stability', fn: H.genStability },
  { name: 'hydro/bubble-critique', fn: H.genBubbleCritique },
  { name: 'hydro/relevance', fn: H.genRelevanceFilter },
  { name: 'eoq/calculate', fn: E.genEOQCalculate },
  { name: 'eoq/total-cost', fn: E.genEOQTotalCost },
  { name: 'eoq/frequency', fn: E.genEOQFrequency },
  { name: 'eoq/scaling', fn: E.genEOQScaling },
  { name: 'eoq/direction', fn: E.genEOQDirection },
  { name: 'eoq/curve', fn: E.genEOQCurve },
  { name: 'eoq/half', fn: E.genEOQHalf },
  { name: 'eoq/sensitivity', fn: E.genEOQSensitivity },
  { name: 'math/percentage', fn: M.genPercentageChange },
  { name: 'math/proportion', fn: M.genProportion },
  { name: 'math/units', fn: M.genUnitConversion },
  { name: 'math/estimation', fn: M.genEstimation },
  { name: 'data/share', fn: M.genTableShare },
  { name: 'data/gradient', fn: M.genGradient },
  { name: 'stats/mean-median', fn: M.genMeanMedian },
  { name: 'stats/probability', fn: M.genProbability },
  { name: 'stats/base-rate', fn: M.genBaseRate },
  { name: 'physics/work-power', fn: M.genWorkPower },
  { name: 'physics/efficiency', fn: M.genEfficiency },
  { name: 'physics/gas', fn: M.genGasLaw },
  { name: 'engineering/lever', fn: M.genLever },
  { name: 'engineering/flow', fn: M.genFlowContinuity },
  { name: 'computing/binary', fn: M.genBinary },
  { name: 'computing/loop', fn: M.genLoopTrace },
  { name: 'computing/complexity', fn: M.genComplexity },
  { name: 'economics/break-even', fn: M.genBreakEven },
  { name: 'economics/opportunity-cost', fn: M.genOpportunityCost },
  { name: 'economics/elasticity', fn: M.genElasticityDirection },
  { name: 'science/scaling', fn: M.genScaling },
];

export const AUTHORED: Question[] = [
  ...ADVANCED_AUTHORED,
  ...METHODOLOGY_AUTHORED,
  ...SCIENTIFIC_AUTHORED,
  ...EXPERIMENT_AUTHORED,
  ...ARGUMENT_AUTHORED,
  ...VECTOR_CONCEPTUAL,
  ...HYDRO_CONCEPTUAL,
  ...EOQ_CONCEPTUAL,
  ...MISC_CONCEPTUAL,
];

export interface BuildOptions {
  seed?: number;
  /** Variants to request per generator family (before validation). */
  variantsPerFamily?: number;
  /** Total generated candidates target (applied on top of the authored items). */
  targetCandidates?: number;
  /** The lesson layer, supplied by the caller so that the engine core stays free of content. */
  lessons?: Lesson[];
}

export function buildBank(options: BuildOptions = {}): { bank: Bank; report: BuildReport; reportMarkdown: string } {
  const seed = options.seed ?? 20260902;
  const perFamily = options.variantsPerFamily ?? 14;
  const target = options.targetCandidates ?? 620;

  const candidates: Question[] = [];
  const familyOf = new Map<string, string>();

  // Authored items first — they are always part of the bank.
  for (const q of AUTHORED) {
    candidates.push(q);
    familyOf.set(q.id, 'authored');
  }

  // Generated items: round-robin over the families so that every family is represented,
  // with a regenerator that can produce a fresh variant for a failed slot.
  const counts = new Map<string, number>();
  const failureCounts = new Map<string, number>();
  let produced = true;
  let round = 0;
  while (produced && candidates.length < target) {
    produced = false;
    for (const f of FAMILIES) {
      const n = counts.get(f.name) ?? 0;
      if (n >= perFamily) continue;
      if (candidates.length >= target) break;
      counts.set(f.name, n + 1);
      let q: Question | null = null;
      for (let attempt = 0; attempt < 12 && !q; attempt++) {
        try {
          q = f.fn(makeRng(seed + round * 7919 + hash(f.name) + n * 104729 + attempt * 15485863));
        } catch {
          failureCounts.set(f.name, (failureCounts.get(f.name) ?? 0) + 1);
        }
      }
      if (!q) continue; // generator could not produce a valid option set for this slot
      candidates.push(q);
      familyOf.set(q.id, f.name);
      produced = true;
    }
    round++;
    if (round > 60) break;
  }

  const report = buildAndValidate({
    candidates,
    stimuli: STIMULI,
    seed,
    maxRetries: 8,
    regenerate: (q, attempt) => {
      const fam = familyOf.get(q.id);
      const family = FAMILIES.find((f) => f.name === fam);
      if (!family) return null;
      try {
        return family.fn(makeRng(seed * 31 + attempt * 7717 + hash(q.id)));
      } catch {
        return null;
      }
    },
  });

  const stimuli = attachStimuli(STIMULI, report.questions, { maxPerStimulus: 5 });

  // Back-reference the block onto the question so that exam assembly and the UI can group a
  // passage with exactly its own questions.
  const blockOf = new Map<string, string>();
  for (const s of stimuli) for (const id of s.questionIds ?? []) blockOf.set(id, s.id);
  for (const q of report.questions) {
    const block = blockOf.get(q.id);
    if (block) q.stimulusId = block;
    else delete q.stimulusId;
  }
  const bank: Bank = {
    questions: report.questions,
    stimuli,
    lessons: options.lessons ?? [],
    meta: {
      generatedAt: new Date().toISOString(),
      seed,
      counts: Object.fromEntries(
        Object.entries(report.stats.byDomain).map(([d, v]) => [d, v.valid]),
      ),
      failures: report.failures,
      stats: report.stats,
    },
  };

  const reportMarkdown = formatReport(report, { seed, generatedAt: bank.meta.generatedAt });
  const md =
    reportMarkdown +
    '\n## Generator-level retries\n\n' +
    (failureCounts.size === 0
      ? '_No generator produced an invalid option set._\n'
      : 'Option sets rejected inside the generators (fresh random values were drawn):\n\n| Family | Rejected draws |\n|---|---|\n' +
        [...failureCounts.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join('\n') +
        '\n');

  return { bank, report, reportMarkdown: md };
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
