import type { Rng } from '../rng';
import type {
  CognitiveMove,
  Difficulty,
  ErrorTag,
  Explanation,
  Figure,
  ItemStyle,
  Question,
  ReasoningType,
  Verification,
  ConfidenceLabel,
} from '../types';

export interface Opt {
  text: string;
  errorTag: ErrorTag;
  rationale: string;
  correct?: boolean;
}

export interface GenSpec {
  id: string;
  domainId: string;
  conceptIds: string[];
  label: ConfidenceLabel;
  stem: string;
  figure?: Figure;
  options: Opt[];
  difficulty: Difficulty;
  reasoningType: ReasoningType;
  cognitiveMove: CognitiveMove;
  style: ItemStyle;
  hints: string[];
  explanation: Omit<Explanation, 'distractorWhy'>;
  verification?: Verification;
  tags?: string[];
  stimulusId?: string;
}

/**
 * Assemble a question: shuffle options, record which one is correct, and derive the
 * per-distractor "why this is wrong" list from the option rationales.
 */
export function assemble(spec: GenSpec, rng: Rng): Question {
  const correctIdxBefore = spec.options.findIndex((o) => o.correct);
  if (correctIdxBefore < 0) throw new Error(`generator ${spec.id}: no correct option marked`);
  if (spec.options.length !== 4) throw new Error(`generator ${spec.id}: ${spec.options.length} options instead of 4`);
  const texts = new Set(spec.options.map((o) => o.text));
  if (texts.size !== 4) throw new Error(`generator ${spec.id}: duplicate option text`);
  if (spec.options.filter((o) => o.correct).length !== 1) throw new Error(`generator ${spec.id}: more than one correct option`);
  const order = rng.shuffle(spec.options.map((_, i) => i));
  const options = order.map((i) => spec.options[i]);
  const correctIndex = order.indexOf(correctIdxBefore);
  const distractorWhy = options.map((o) => o.rationale);
  return {
    id: spec.id,
    domainId: spec.domainId,
    conceptIds: spec.conceptIds,
    label: spec.label,
    stimulusId: spec.stimulusId,
    stem: spec.stem,
    figure: spec.figure,
    options,
    correctIndex,
    difficulty: spec.difficulty,
    reasoningType: spec.reasoningType,
    cognitiveMove: spec.cognitiveMove,
    style: spec.style,
    hints: spec.hints,
    explanation: { ...spec.explanation, distractorWhy },
    verification: spec.verification,
    provenance: 'generated',
    tags: spec.tags ?? [],
  };
}

/** Format a number for display in an option: no thousand separators (mental arithmetic). */
export function num(x: number, decimals = 2): string {
  if (!Number.isFinite(x)) return '∞';
  const r = Math.abs(x) < 1e-9 ? 0 : x;
  let s = r.toFixed(decimals);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s === '-0' ? '0' : s;
}

/** Pick up to n distinct options from a pool, skipping texts already used. */
export function distinctOpts(pool: Opt[], used: string[], n: number): Opt[] {
  const seen = new Set(used);
  const out: Opt[] = [];
  for (const o of pool) {
    if (seen.has(o.text)) continue;
    seen.add(o.text);
    out.push(o);
    if (out.length === n) break;
  }
  return out;
}

export function pickNonZeroInt(rng: Rng, absMax: number, excludeZero = true): number {
  let v = 0;
  while (v === 0 || (excludeZero && Math.abs(v) < 1)) v = rng.int(-absMax, absMax);
  return v;
}

/** Randomised realistic scenario names, used to vary surface context. */
export const SCENARIOS = {
  companies: ['Nordlicht Logistik', 'BlueKite Retail', 'HanseWerk Supplies', 'Rheinbach Elektronik', 'Campus Books', 'Alpenblick Sport', 'Meridian Parts', 'Stadtmöbel GmbH'],
  fluids: ['sea water', 'a freshwater reservoir', 'a ballast tank', 'a cooling basin', 'a canal lock'],
  people: ['a research group', 'a doctoral candidate', 'a survey team', 'a student working group', 'a municipal statistics office'],
  goods: ['industrial bearings', 'printer cartridges', 'bottled juice', 'spare filters', 'laboratory gloves', 'bicycle tyres'],
};

export function pickScenario<T>(rng: Rng, arr: readonly T[]): T {
  return rng.pick(arr);
}

/**
 * Build the "effect direction" style stem ending used by many generators, choosing a
 * random phrasing so that wording cannot be pattern-matched.
 */
export function effectPhrasings(rng: Rng, subject: string, verb: string): string {
  const forms = [
    `How does ${subject} ${verb}?`,
    `What happens to ${subject} if this change is made?`,
    `Which change in ${subject} follows from the modification described?`,
    `Determine how ${subject} ${verb}.`,
  ];
  return rng.pick(forms);
}

/** Convenience for a "which statement is correct" item body. */
export function statementOptions(items: { text: string; tag: ErrorTag; why: string; correct?: boolean }[]): Opt[] {
  return items.map((i) => ({ text: i.text, errorTag: i.tag, rationale: i.why, correct: i.correct }));
}
