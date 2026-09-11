import type { Rng } from '../rng';
import type { ErrorTag, Question } from '../types';
import { assemble, distinctOpts, num, type GenSpec, type Opt } from './helpers';

/**
 * Vector generators — official Exercise 1 domain (D02).
 *
 * Coverage: components, magnitude, addition/subtraction, scalar multiplication, dot product,
 * angle & perpendicularity, cross product, parallelogram area, triple product, coplanarity,
 * result types, and effect-direction (parameter) reasoning.
 *
 * Numbers are chosen so that everything is mentally computable (no-notes exam condition).
 */

const PYTHAGOREAN_2D: [number, number][] = [
  [3, 4],
  [6, 8],
  [5, 12],
  [9, 12],
  [8, 15],
  [7, 24],
  [20, 21],
  [12, 16],
  [10, 24],
];
const PYTHAGOREAN_3D: [number, number, number][] = [
  [1, 2, 2],
  [2, 3, 6],
  [2, 6, 9],
  [1, 4, 8],
  [4, 4, 7],
  [3, 4, 12],
  [2, 10, 11],
  [6, 6, 7],
  [1, 2, 2],
  [3, 6, 6],
];

function randSign(rng: Rng, v: number[]): number[] {
  return v.map((x) => (rng.chance(0.5) ? x : -x));
}

function vecText(v: number[]): string {
  if (v.length === 2) return `$(${v[0]},\\,${v[1]})$`;
  return `$(${v[0]},\\,${v[1]},\\,${v[2]})$`;
}

function makeId(tag: string, rng: Rng): string {
  return `gen-${tag}-${rng.int(100000, 999999)}`;
}

/* ------------------------------------------------------------------ */
/* 1. addition / subtraction, with and without the coordinate figure   */
/* ------------------------------------------------------------------ */
export function genVectorAddSub(rng: Rng): Question {
  const threeD = rng.chance(0.35);
  if (!threeD) {
    const a = [rng.int(-5, 5), rng.int(-5, 5)];
    const b = [rng.int(-5, 5), rng.int(-5, 5)];
    const c = [rng.int(-5, 5), rng.int(-5, 5)];
    const sign: '+' | '-' = rng.chance(0.5) ? '+' : '-';
    const s = a.map((x, i) => x + b[i] + (sign === '-' ? -c[i] : c[i]));
    const withFigure = rng.chance(0.7) && a.every((x) => Math.abs(x) <= 5);
    const stem = withFigure
      ? `The figure shows three vectors in the coordinate plane. Which vector results from the operation $\\vec{s} = \\vec{a} + \\vec{b} ${sign} \\vec{c}$?`
      : `Given $\\vec{a} = ${vecText(a)}$, $\\vec{b} = ${vecText(b)}$ and $\\vec{c} = ${vecText(c)}$, which vector results from $\\vec{s} = \\vec{a} + \\vec{b} ${sign} \\vec{c}$?`;
    const wrong: Opt[] = [
      {
        text: `$\\vec{s} = ${vecText(a.map((x, i) => x + b[i] + (sign === '-' ? c[i] : -c[i])))}`,
        errorTag: 'sign_error',
        rationale: `A sign was applied to $\\vec{c}$ in the wrong direction: the operation is ${sign === '-' ? 'a subtraction' : 'an addition'} of $\\vec{c}$.`,
      },
      {
        text: `$\\vec{s} = ${vecText(a.map((x, i) => x - b[i] + (sign === '-' ? -c[i] : c[i])))}`,
        errorTag: 'component_confusion',
        rationale: `The components of $\\vec{b}$ were subtracted instead of added — each vector keeps its own sign, only $\\vec{c}$ carries the ${sign === '-' ? 'minus' : 'plus'} of the stated operation.`,
      },
      {
        text: `$\\vec{s} = ${vecText([s[1], s[0]])}`,
        errorTag: 'component_confusion',
        rationale: 'The x- and y-components were swapped, which produces a different vector (a reflection, not the sum).',
      },
    ];
    const spec: GenSpec = {
      id: makeId('vaddsub', rng),
      domainId: 'D02',
      conceptIds: ['C02.addsub'],
      label: 'OFFICIAL_SAMPLE',
      stem,
      figure: withFigure
        ? {
            kind: 'vector_grid',
            vectors: [
              { label: 'a', to: [a[0], a[1]] },
              { label: 'b', to: [b[0], b[1]] },
              { label: 'c', to: [c[0], c[1]] },
            ],
            xRange: [-6, 6],
            yRange: [-6, 6],
          }
        : undefined,
      options: [
        ...wrong,
        {
          text: `$\\vec{s} = ${vecText(s)}`,
          errorTag: 'none',
          rationale: 'Correct: add (or subtract) component by component.',
          correct: true,
        },
      ],
      difficulty: withFigure ? 3 : 2,
      reasoningType: withFigure ? 'representation_transfer' : 'rule_application',
      cognitiveMove: withFigure ? 'interpret_representation' : 'execute_rule',
      style: 'numeric_direct',
      hints: [
        'Vectors are combined component by component: treat x and y separately.',
        `Subtracting $\\vec{c}$ means adding $-\\vec{c}$, i.e. flipping every sign of $\\vec{c}$.`,
      ],
      explanation: {
        testing: 'Component-wise addition and subtraction of vectors, including the effect of a minus sign in front of a vector.',
        matters: `The components of $\\vec{a}$, $\\vec{b}$ and $\\vec{c}$ (from the figure or the notation) and the operation to be performed.`,
        irrelevant: withFigure ? 'The arrows themselves and their lengths are irrelevant: only the endpoint coordinates enter the calculation.' : undefined,
        concept: 'Vector addition/subtraction in the component representation.',
        why: 'Each coordinate axis is independent, so the operation acts on each component separately and the result is again a vector.',
        steps: [
          `x-components: $${a[0]} + ${b[0]} ${sign} ${sign === '-' ? `(${-c[0]})` : c[0]} = ${s[0]}$`,
          `y-components: $${a[1]} + ${b[1]} ${sign} ${sign === '-' ? `(${-c[1]})` : c[1]} = ${s[1]}$`,
          `Result: $\\vec{s} = ${vecText(s)}$`,
        ],
        trap: 'The most common error is to drop the sign of the subtracted vector, or to subtract the wrong vector.',
        transfer: 'Any linear combination (e.g. $2\\vec{a} - 3\\vec{b}$) is handled the same way: treat each component as its own one-dimensional problem.',
      },
      verification: { solver: 'vector.addsub', payload: { a, b, c, sign } },
    };
    return assemble(spec, rng);
  }

  const a = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
  const b = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
  const c = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
  const s = a.map((x, i) => x + b[i] - c[i]);
  const spec: GenSpec = {
    id: makeId('vaddsub3', rng),
    domainId: 'D02',
    conceptIds: ['C02.addsub'],
    label: 'OFFICIAL_SAMPLE',
    stem: `In three dimensions, $\\vec{a} = ${vecText(a)}$, $\\vec{b} = ${vecText(b)}$ and $\\vec{c} = ${vecText(c)}$. Which vector equals $\\vec{a} + \\vec{b} - \\vec{c}$?`,
    options: [
      {
        text: vecText(a.map((x, i) => x + b[i] + c[i])),
        errorTag: 'sign_error',
        rationale: '$\\vec{c}$ was added although the operation subtracts it.',
      },
      {
        text: vecText([s[0], s[2], s[1]]),
        errorTag: 'component_confusion',
        rationale: 'The y- and z-components were interchanged.',
      },
      {
        text: vecText(a.map((x, i) => x - b[i] - c[i])),
        errorTag: 'component_confusion',
        rationale: '$\\vec{b}$ was subtracted as well, but the operation adds $\\vec{b}$.',
      },
      { text: vecText(s), errorTag: 'none', rationale: 'Correct component-wise combination.', correct: true },
    ],
    difficulty: 2,
    reasoningType: 'rule_application',
    cognitiveMove: 'execute_rule',
    style: 'numeric_direct',
    hints: ['Work one component at a time: x, then y, then z.', 'A subtracted vector contributes with flipped signs.'],
    explanation: {
      testing: 'Whether the component-wise rule is applied correctly in three dimensions, where the order of components matters.',
      matters: 'The three coordinate positions of each vector and the signs in the expression.',
      concept: 'Component-wise addition and subtraction.',
      why: 'The axes are independent directions, so each component is an ordinary number problem.',
      steps: s.map((v, i) => `Component ${i + 1}: $${a[i]} + ${b[i]} - (${c[i]}) = ${v}$`),
      trap: 'Mixing up the order of the components produces a vector that looks plausible but is a reflection or permutation.',
      transfer: 'The same procedure works for any dimension — the number of components only changes how many separate sums you perform.',
    },
    verification: { solver: 'vector.addsub', payload: { a, b, c, sign: '-' } },
  };
  return assemble(spec, rng);
}

/* ------------------------------------------------------------------ */
/* 2. magnitude                                                        */
/* ------------------------------------------------------------------ */
export function genVectorMagnitude(rng: Rng): Question {
  const threeD = rng.chance(0.5);
  const triple = threeD ? rng.pick(PYTHAGOREAN_3D) : null;
  const pair = threeD ? null : randSign(rng, rng.pick(PYTHAGOREAN_2D));
  const a = (threeD ? randSign(rng, triple!) : pair!) as number[];
  const mag = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
  const style = rng.pick(['numeric_direct', 'reverse_question', 'statement_compare'] as const);

  if (style === 'reverse_question') {
    const k = rng.int(2, 4);
    const styleSpec: GenSpec = {
      id: makeId('vmagrev', rng),
      domainId: 'D02',
      conceptIds: ['C02.magnitude', 'C02.scalar'],
      label: 'OFFICIAL_SAMPLE',
      stem: `A vector $\\vec{a}$ has length ${num(mag, 4)}. What is the length of $${k}\\vec{a}$?`,
      options: [
        { text: `${num(mag * k, 4)}`, errorTag: 'none', rationale: 'Correct: multiplying by a scalar multiplies the length by its absolute value.', correct: true },
        { text: `${num(mag, 4)}`, errorTag: 'concept_confusion', rationale: 'The length was left unchanged; only direction is unaffected by a positive scalar, not length.' },
        { text: `${num(mag * k * k, 4)}`, errorTag: 'linearity_assumption', rationale: 'The length was scaled by the square of the factor, which would be the behaviour of a squared quantity, not of a vector length.' },
        { text: `${num(mag / k, 4)}`, errorTag: 'ratio_error', rationale: 'The factor was inverted although the vector is multiplied by a number larger than 1.' },
      ],
      difficulty: 2,
      reasoningType: 'parameter_reasoning',
      cognitiveMove: 'effect_of_change',
      style: 'reverse_question',
      hints: ['A scalar multiplies every component, so the length changes by the same factor.', 'Only the size of the factor matters for the length; its sign affects direction.'],
      explanation: {
        testing: 'The effect of scalar multiplication on vector length.',
        matters: 'The scalar factor and the original length.',
        concept: 'Scalar multiplication scales each component, hence scales the length.',
        why: 'Each component is multiplied by the same number, so the Pythagorean sum is multiplied by the absolute value of that number.',
        steps: [`$|k\\vec{a}| = |k|\\,|\\vec{a}|$`, `$|${k}\\vec{a}| = ${k} \\cdot ${num(mag, 4)} = ${num(mag * k, 4)}$`],
        trap: 'Squaring the factor, or forgetting that the factor multiplies the length at all.',
        transfer: 'The same scaling appears whenever a quantity is proportional to a vector magnitude — speed from a velocity vector, force from a force vector.',
      },
    };
    return assemble(styleSpec, rng);
  }

  if (style === 'statement_compare') {
    const other = randSign(rng, threeD ? rng.pick(PYTHAGOREAN_3D) : rng.pick(PYTHAGOREAN_2D)) as number[];
    const otherMag = Math.sqrt(other.reduce((s, x) => s + x * x, 0));
    const same = Math.abs(otherMag - mag) < 1e-9;
    return assemble(
      {
        id: makeId('vmagcmp', rng),
        domainId: 'D02',
        conceptIds: ['C02.magnitude'],
        label: 'OFFICIAL_SAMPLE',
        stem: `Two vectors are given: $\\vec{a} = ${vecText(a)}$ and $\\vec{b} = ${vecText(other)}$. Which statement about their lengths is correct?`,
        options: [
          {
            text: `$|\\vec{a}| = ${num(mag, 4)}$ and $|\\vec{b}| = ${num(otherMag, 4)}$`,
            errorTag: 'none',
            rationale: 'Correct: both lengths follow from Pythagoras over the components.',
            correct: true,
          },
          {
            text: `$|\\vec{a}| = ${num(mag, 4)}$ and $|\\vec{b}| = ${num(other.reduce((s, x) => s + Math.abs(x), 0), 4)}$`,
            errorTag: 'rule_misapplication',
            rationale: 'For $\\vec{b}$ the absolute values of the components were added instead of the squares being summed and rooted (that is a taxicab length, not the Euclidean length).',
          },
          {
            text: `$|\\vec{a}| = ${num(a.reduce((s, x) => s + Math.abs(x), 0), 4)}$ and $|\\vec{b}| = ${num(otherMag, 4)}$`,
            errorTag: 'rule_misapplication',
            rationale: 'For $\\vec{a}$ the components were added directly; a length combines them through squares.',
          },
          {
            text: `$|\\vec{a}| = ${num(a.reduce((s, x) => s + x * x, 0), 4)}$ and $|\\vec{b}| = ${num(other.reduce((s, x) => s + x * x, 0), 4)}$`,
            errorTag: 'square_root_scaling',
            rationale: 'These are the squared lengths: the square root was not taken.',
          },
        ],
        difficulty: same ? 1 : 2,
        reasoningType: 'rule_application',
        cognitiveMove: 'execute_rule',
        style: 'statement_compare',
        hints: ['Length means Euclidean length.', 'Sum the squares of the components, then take the root.'],
        explanation: {
          testing: 'Computing vector length from components and distinguishing it from other quantities built from the components.',
          matters: 'All components of both vectors.',
          concept: 'Length via Pythagoras, generalised to n components.',
          why: 'The components are perpendicular displacements, so their combined displacement is the hypotenuse of a right triangle (in 3D, applied twice).',
          steps: [
            `$|\\vec{a}| = \\sqrt{${a.map((x) => `${x}^2`).join(' + ')}} = ${num(mag, 4)}$`,
            `$|\\vec{b}| = \\sqrt{${other.map((x) => `${x}^2`).join(' + ')}} = ${num(otherMag, 4)}$`,
          ],
          trap: 'Adding the components instead of combining their squares — this is the single most common error with lengths.',
          transfer: 'Any quantity defined as the Euclidean norm (distance, error magnitude, resultant force) uses the same construction.',
        },
        verification: { solver: 'vector.magnitude_pair', payload: { a, b: other } },
      },
      rng,
    );
  }

  const spec: GenSpec = {
    id: makeId('vmag', rng),
    domainId: 'D02',
    conceptIds: ['C02.magnitude'],
    label: 'OFFICIAL_SAMPLE',
    stem: `What is the length (magnitude) of the vector $\\vec{a} = ${vecText(a)}$?`,
    options: [
      { text: `${num(mag, 4)}`, errorTag: 'none', rationale: 'Correct: root of the sum of squared components.', correct: true },
      {
        text: `${num(a.reduce((s, x) => s + Math.abs(x), 0), 4)}`,
        errorTag: 'rule_misapplication',
        rationale: 'This is the sum of the absolute component values, not the Euclidean length.',
      },
      {
        text: `${num(a.reduce((s, x) => s + x * x, 0), 4)}`,
        errorTag: 'square_root_scaling',
        rationale: 'This is the squared length; the square root has not been taken.',
      },
      {
        text: `${num(Math.max(...a.map(Math.abs)), 4)}`,
        errorTag: 'concept_confusion',
        rationale: 'This is only the largest single component — the other components also contribute to the length.',
      },
    ],
    difficulty: a.length === 2 ? 1 : 2,
    reasoningType: 'rule_application',
    cognitiveMove: 'execute_rule',
    style: 'numeric_direct',
    hints: ['Use Pythagoras: sum the squares of all components and take the square root.', 'In three dimensions the same formula applies with one more square.'],
    explanation: {
      testing: 'Applying the generalised Pythagorean theorem to a vector in 2D or 3D.',
      matters: 'Every component, including its sign — negative components contribute through their squares.',
      concept: 'Magnitude of a vector.',
      why: 'Components are perpendicular, so their combined displacement is a hypotenuse.',
      steps: [
        `$|\\vec{a}| = \\sqrt{${a.map((x) => `(${x})^2`).join(' + ')}}$`,
        `$= \\sqrt{${a.reduce((s, x) => s + x * x, 0)}} = ${num(mag, 4)}$`,
      ],
      trap: 'Signs are irrelevant for the length but not for the direction; and the root must not be forgotten.',
      transfer: 'Distance between two points is the length of the difference vector — the identical computation.',
    },
    verification: { solver: 'vector.magnitude', payload: { a } },
  };
  return assemble(spec, rng);
}

/* ------------------------------------------------------------------ */
/* 3. scalar multiplication: statement / effect styles                 */
/* ------------------------------------------------------------------ */
export function genScalarMultiplication(rng: Rng): Question {
  const a = [rng.int(-5, 5), rng.int(-5, 5)];
  const k = rng.pick([-3, -2, -0.5, 0.5, 2, 3]);
  const mag = Math.hypot(...a);
  const newMag = Math.abs(k) * mag;
  const reversed = k < 0;
  const spec: GenSpec = {
    id: makeId('vscalar', rng),
    domainId: 'D02',
    conceptIds: ['C02.scalar'],
    label: 'OFFICIAL_SAMPLE',
    stem: `A vector $\\vec{a} = ${vecText(a)}$ is multiplied by the number ${num(k, 2)}. Which statement is correct?`,
    options: [
      {
        text: `The length changes to ${num(newMag, 4)} and the direction is ${reversed ? 'reversed' : 'unchanged'}.`,
        errorTag: 'none',
        rationale: 'Correct: the absolute value of the factor changes the length, the sign decides whether the direction flips.',
        correct: true,
      },
      {
        text: `The length changes to ${num(newMag, 4)} and the direction is ${reversed ? 'unchanged' : 'reversed'}.`,
        errorTag: 'sign_error',
        rationale: `The sign of the factor ${reversed ? 'does' : 'does not'} reverse the direction, so this statement gets the direction wrong.`,
      },
      {
        text: `The length changes to ${num(mag, 4)} and the direction is ${reversed ? 'reversed' : 'unchanged'}.`,
        errorTag: 'concept_confusion',
        rationale: 'The length is claimed to stay the same, but multiplying by a factor whose absolute value is not 1 always changes the length.',
      },
      {
        text: `The length changes to ${num(mag / Math.abs(k), 4)} and the direction is ${k < 0 ? 'reversed' : 'unchanged'}.`,
        errorTag: 'ratio_error',
        rationale: 'The factor was inverted: dividing by |k| instead of multiplying.',
      },
    ],
    difficulty: 2,
    reasoningType: 'conceptual_discrimination',
    cognitiveMove: 'classify_situation',
    style: 'statement_compare',
    hints: ['Separate the two effects of a scalar: its size and its sign.', 'A negative factor points the vector the opposite way, but the length only grows or shrinks with |k|.'],
    explanation: {
      testing: 'The two independent effects of multiplying a vector by a scalar: change of magnitude and possible reversal of direction.',
      matters: 'The absolute value of the factor (length) and its sign (direction).',
      irrelevant: 'The individual components are not needed — the effect can be read from the factor alone, though they allow the check.',
      concept: 'Scalar multiplication.',
      why: 'Every component is multiplied by the same number, so the resulting arrow lies on the same line through the origin, at a distance scaled by $|k|$.',
      steps: [
        `$|k| = ${num(Math.abs(k), 2)}$ ⇒ length becomes $${num(Math.abs(k), 2)} \\cdot ${num(mag, 4)} = ${num(newMag, 4)}$`,
        `${reversed ? 'The factor is negative ⇒ the arrow points in the opposite direction.' : 'The factor is positive ⇒ the arrow keeps its direction.'}`,
      ],
      trap: 'Assuming a factor of 2 "doubles everything" including direction, or that a factor of −2 halves the length.',
      transfer: 'In physics the same distinction separates speed (a magnitude) from velocity (magnitude plus direction); in data work it separates effect size from sign.',
    },
    verification: { solver: 'vector.scaled_magnitude', payload: { a, k } },
  };
  return assemble(spec, rng);
}

/* ------------------------------------------------------------------ */
/* 4. dot product                                                      */
/* ------------------------------------------------------------------ */
export function genDotProduct(rng: Rng): Question {
  const threeD = rng.chance(0.5);
  const a = threeD ? [rng.int(-4, 5), rng.int(-4, 5), rng.int(-4, 5)] : [rng.int(-6, 6), rng.int(-6, 6)];
  const b = threeD ? [rng.int(-4, 5), rng.int(-4, 5), rng.int(-4, 5)] : [rng.int(-6, 6), rng.int(-6, 6)];
  const d = a.reduce((s, x, i) => s + x * b[i], 0);
  const magProduct = Math.hypot(...a) * Math.hypot(...b);
  const sumAbs = a.reduce((s, x, i) => s + Math.abs(x * b[i]), 0);
  const distractorPool: Opt[] = [
    {
      text: `${num(sumAbs, 4)}`,
      errorTag: 'sign_error',
      rationale: 'The absolute values of the products were added. A scalar product can be smaller than that — or negative — because the signs of the components matter.',
    },
    {
      text: `${num(magProduct, 4)}`,
      errorTag: 'concept_confusion',
      rationale: 'This is the product of the two lengths, which equals the scalar product only when the vectors are parallel ($\\cos\\varphi = 1$).',
    },
    {
      text: `${num(magProduct * (d === 0 ? 1 : Math.sign(d)), 4)}`,
      errorTag: 'rule_misapplication',
      rationale: 'This uses the magnitude relation $|\\vec{a}||\\vec{b}|$ with a sign attached instead of weighting it by $\\cos\\varphi$.',
    },
    {
      text: `${d + a.length}`,
      errorTag: 'calculation_slip',
      rationale: `One extra unit per component was added; the correct sum of the products is ${d}.`,
    },
    {
      text: `${num(-magProduct, 4)}`,
      errorTag: 'rule_misapplication',
      rationale: 'The negative product of the two lengths has no basis in the definition: the scalar product is a sum of signed products, not a signed product of lengths.',
    },
  ];
  const distractors = distinctOpts(distractorPool, [String(d)], 3);
  if (distractors.length < 3) throw new Error('genDotProduct: not enough distinct distractors');
  const spec: GenSpec = {

    id: makeId('vdot', rng),
    domainId: 'D02',
    conceptIds: ['C02.dot'],
    label: 'OFFICIAL_SAMPLE',
    stem: `Compute the scalar product $\\vec{a} \\cdot \\vec{b}$ for $\\vec{a} = ${vecText(a)}$ and $\\vec{b} = ${vecText(b)}$.`,
    options: [...distractors, { text: `${d}`, errorTag: 'none', rationale: 'Correct: multiply matching components and add the products.', correct: true }],
    difficulty: threeD ? 2 : 1,
    reasoningType: 'rule_application',
    cognitiveMove: 'execute_rule',
    style: 'numeric_direct',
    hints: ['Pair the corresponding components and multiply, then add.', 'The result is a single number, not a vector.'],
    explanation: {
      testing: 'Executing the scalar product and recognising that the result is a scalar that can be negative.',
      matters: 'The pairing of corresponding components and the signs of the products.',
      concept: 'Scalar (dot) product.',
      why: 'It measures how much of one vector points along the other; the signs of the components decide whether the contributions add up or cancel.',
      steps: [
        `$\\vec{a}\\cdot\\vec{b} = ${a.map((x, i) => `(${x})(${b[i]})`).join(' + ')}$`,
        `$= ${d}$`,
      ],
      trap: 'Forgetting that only matching components multiply, or dropping a minus sign in one product.',
      transfer: 'The same operation computes work ($W = \\vec{F}\\cdot\\vec{s}$) and appears in the angle formula — it is the arithmetic core of the whole exercise.',
    },
    verification: { solver: 'vector.dot', payload: { a, b } },
  };
  return assemble(spec, rng);
}

/* ------------------------------------------------------------------ */
/* 5. angle & perpendicularity                                         */
/* ------------------------------------------------------------------ */
export function genAngle(rng: Rng): Question {
  const style = rng.pick(['cos_value', 'angle_from_cos', 'perpendicularity'] as const);

  /**
   * Table of integer right triangles, so the cosine of the angle is an exact fraction of integers.
   * Pythagorean triples are the only way to keep the lengths whole numbers, which is what makes the
   * answer options readable without a calculator.
   */
  const triples: [number[], number[]][] = [
    [[3, 4], [4, 3]],
    [[5, 12], [12, 5]],
    [[8, 15], [15, 8]],
    [[20, 21], [21, 20]],
    [[9, 12], [12, 9]],
  ];

  if (style === 'perpendicularity') {
    const a = [rng.int(-5, 5), rng.int(-5, 5)];
    if (a[0] === 0 && a[1] === 0) return genAngle(rng);
    const k = rng.pick([-2, -1, 1, 2, 3]);
    const perp = [k * a[1], -k * a[0]];
    const notPerp1 = [a[1], a[0]];
    const notPerp2 = [-a[0], -a[1]];
    const notPerp3 = [a[0] + 1, a[1]];
    const texts = new Set([vecText(perp), vecText(notPerp1), vecText(notPerp2), vecText(notPerp3)]);
    if (texts.size !== 4) return genAngle(rng); // components coincide for some draws; redraw
    return assemble(
      {
        id: makeId('vperp', rng),
        domainId: 'D02',
        conceptIds: ['C02.angle', 'C02.dot'],
        label: 'OFFICIAL_SAMPLE',
        stem: `Which of the following vectors is perpendicular to $\\vec{a} = ${vecText(a)}$?`,
        options: [
          { text: vecText(perp), errorTag: 'none', rationale: `Correct: $\\vec{a}\\cdot\\vec{b} = 0$, so the vectors are perpendicular.`, correct: true },
          { text: vecText(notPerp1), errorTag: 'concept_confusion', rationale: `Swapping the components gives $\\vec{a}\\cdot\\vec{b} = ${a[0] * notPerp1[0] + a[1] * notPerp1[1]} \\neq 0$ — a swap is a reflection, not a 90° rotation.` },
          { text: vecText(notPerp2), errorTag: 'sign_error', rationale: `This is $-\\vec{a}$, the antiparallel vector: the angle is 180°, not 90°.` },
          { text: vecText(notPerp3), errorTag: 'rule_misapplication', rationale: `Adding 1 to a component does not create a right angle: $\\vec{a}\\cdot\\vec{b} = ${a[0] * notPerp3[0] + a[1] * notPerp3[1]} \\neq 0$.` },
        ],
        difficulty: 3,
        reasoningType: 'conceptual_discrimination',
        cognitiveMove: 'classify_situation',
        style: 'statement_compare',
        hints: ['Perpendicular means the scalar product is zero.', 'A 90° rotation turns $(x, y)$ into $(-y, x)$ (or $(y, -x)$) — that is not the same as swapping the components.'],
        explanation: {
          testing: 'Using the scalar product as a perpendicularity test rather than computing an explicit angle.',
          matters: 'Both components of each candidate vector; only their products with the components of $\\vec{a}$ matter.',
          concept: 'Perpendicularity ⇔ scalar product zero.',
          why: '$\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\varphi$ vanishes exactly when $\\cos\\varphi = 0$, i.e. $\\varphi = 90°$ (for non-zero vectors).',
          steps: [
            `Rotate by 90°: $(x, y) \\to (-y, x) = ${vecText(perp)}$`,
            `Check: $${a[0]}\\cdot${perp[0]} + ${a[1]}\\cdot${perp[1]} = 0$ ⇒ perpendicular`,
            'The other candidates give non-zero scalar products, so none of them is perpendicular.',
          ],
          trap: 'Swapping the components instead of rotating: $(x, y) \\to (y, x)$ is a reflection, which generally keeps the angle acute.',
          transfer: 'The same test decides whether two forces are independent, whether a displacement is perpendicular to a force (no work done) and whether vectors span a plane.',
        },
      },
      rng,
    );
  }

  const [baseA, baseB] = rng.pick(triples);
  const sign = rng.pick([1, -1]);
  const a = [baseA[0], baseA[1]];
  const b = [baseB[0] * sign, baseB[1]]; // one sign flip changes the cosine without ugly numbers
  const dot = a[0] * b[0] + a[1] * b[1];
  const na = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
  const nb = Math.sqrt(b[0] * b[0] + b[1] * b[1]);
  const den = na * nb;
  const cosValue = dot / den;
  if (Math.abs(den - Math.round(den)) > 1e-9) return genAngle(rng);
  const D = Math.round(den);

  if (style === 'angle_from_cos') {
    const round = (x: number) => Math.round(x * 10) / 10;
    const angle = (Math.acos(Math.max(-1, Math.min(1, cosValue))) * 180) / Math.PI;
    const candidates: { text: string; tag: ErrorTag; why: string }[] = [
      { text: `about ${round(angle)}°`, tag: 'none', why: 'Correct: the angle whose cosine is the given value.' },
      { text: `about ${round(90 - angle)}°`, tag: 'concept_confusion', why: 'This is the complement of the angle (the sine relation), not the angle whose cosine was given.' },
      { text: `about ${round(180 - angle)}°`, tag: 'rule_misapplication', why: 'This is the supplementary angle; it has the same sine but the opposite cosine.' },
      { text: `about ${round(cosValue * 100)}°`, tag: 'concept_confusion', why: 'The cosine value was read as if it were the angle in degrees; a cosine is a ratio between −1 and 1.' },
    ];
    const values = candidates.map((c) => c.text);
    if (new Set(values).size !== 4 || Math.abs(angle - 45) < 1) return genAngle(rng);
    return assemble(
      {
        id: makeId('vangle', rng),
        domainId: 'D02',
        conceptIds: ['C02.angle', 'C02.dot'],
        label: 'OFFICIAL_SAMPLE',
        stem: `For two vectors $\\vec{a}$ and $\\vec{b}$ the cosine of the enclosed angle is $\\cos\\varphi = ${num(dot, 4)}/${D}$. What is the angle $\\varphi$ (to the nearest degree)?`,
        options: candidates.map((c, i) => ({ text: c.text, errorTag: c.tag, rationale: c.why, correct: i === 0 })),
        difficulty: 3,
        reasoningType: 'multi_step_application',
        cognitiveMove: 'interpret_representation',
        style: 'numeric_direct',
        hints: ['$\\varphi = \\arccos(\\cos\\varphi)$ — the inverse function turns the ratio back into an angle.', 'A cosine of about 0.96 belongs to a small angle, not to 96°.'],
        explanation: {
          testing: 'Turning a cosine value into an angle and recognising the plausible wrong angles.',
          matters: `The cosine value $${num(dot, 4)}/${D} \\approx ${num(cosValue, 4)}$.`,
          concept: 'The cosine is a ratio between −1 and 1; the angle follows from the inverse function $\\arccos$.',
          why: 'The scalar product gives the cosine directly, so the angle is recovered by the inverse cosine, not by reading the ratio as an angle.',
          steps: [`$\\cos\\varphi = ${num(cosValue, 4)}$`, `$\\varphi = \\arccos(${num(cosValue, 4)}) \\approx ${round(angle)}°$`],
          trap: 'Reporting the cosine itself as the angle, or using the complement or supplement by mistake.',
          transfer: 'The same conversion is needed whenever a scalar product is used to find a direction — in statics, in work calculations and in machine-learning similarity measures.',
        },
      },
      rng,
    );
  }

  // style === 'cos_value': ask for the cosine itself, with distractors that are other wrong ratios
  const firstTerm = a[0] * b[0];
  const secondTerm = a[1] * b[1];
  const alternatives: { n: number; tag: ErrorTag; why: string }[] = [
    { n: firstTerm, tag: 'component_confusion', why: `Only the first product was used ($${a[0]} \\cdot ${b[0]}$); the scalar product sums both products.` },
    { n: firstTerm - secondTerm, tag: 'sign_error', why: 'The two products were subtracted; the scalar product adds them.' },
    { n: a[0] + a[1] + b[0] + b[1], tag: 'rule_misapplication', why: 'The components were added instead of the products of corresponding components.' },
  ];
  const chosen = alternatives.filter(
    (alt, i) =>
      ![dot, ...alternatives.slice(0, i).map((x) => x.n)].some((x) => Math.abs(x - alt.n) < 1e-9),
  );
  if (chosen.length < 3) return genAngle(rng);
  return assemble(
    {
      id: makeId('vangle', rng),
      domainId: 'D02',
      conceptIds: ['C02.angle', 'C02.dot'],
      label: 'OFFICIAL_SAMPLE',
      stem: `With the scalar product, the angle between two vectors can be determined. What is $\\cos\\varphi$ for $\\vec{a} = ${vecText(a)}$ and $\\vec{b} = ${vecText(b)}$?`,
      options: [
        { text: `$\\cos\\varphi = ${num(dot, 4)}/${D}$`, errorTag: 'none', rationale: 'Correct: the cosine is the scalar product divided by the product of the two lengths.', correct: true },
        ...chosen.map((c) => ({ text: `$\\cos\\varphi = ${num(c.n, 4)}/${D}$`, errorTag: c.tag, rationale: c.why })),
      ],
      difficulty: 3,
      reasoningType: 'multi_step_application',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['$\\cos\\varphi = \\dfrac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}|\\,|\\vec{b}|}$', `Here $|\\vec{a}| = ${num(na, 4)}$ and $|\\vec{b}| = ${num(nb, 4)}$.`],
      explanation: {
        testing: 'Assembling the cosine formula: scalar product, both lengths, and the order of the operations.',
        matters: 'Both vectors completely — every component contributes to the scalar product and to the length.',
        concept: 'Cosine of the enclosed angle: $\\cos\\varphi = \\dfrac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}||\\vec{b}|}$.',
        why: 'The scalar product measures the alignment of the two vectors, and dividing by both lengths removes the influence of their sizes so that only the angle remains.',
        steps: [
          `$\\vec{a}\\cdot\\vec{b} = ${a[0]}\\cdot${b[0]} + ${a[1]}\\cdot${b[1]} = ${dot}$`,
          `$|\\vec{a}| = ${num(na, 4)}$, $|\\vec{b}| = ${num(nb, 4)}$, product $= ${D}$`,
          `$\\cos\\varphi = ${num(dot, 4)}/${D} \\approx ${num(cosValue, 4)}$`,
        ],
        trap: 'Forgetting one of the two lengths, subtracting the component products, or inverting the fraction.',
        transfer: 'The same formula decides whether two forces act in the same direction, whether a projection is large, and how similar two data vectors are.',
      },
    },
    rng,
  );
}

export function genCrossProduct(rng: Rng): Question {
  const a = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
  const b = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
  const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const crossPool: Opt[] = [
    {
      text: vecText([a[1] * b[2] - a[2] * b[1], a[0] * b[2] - a[2] * b[0], a[0] * b[1] - a[1] * b[0]]),
      errorTag: 'rule_misapplication',
      rationale: 'The middle component uses the wrong subtraction order (a common slip in the determinant expansion).',
    },
    {
      text: vecText([-c[0], -c[1], -c[2]]),
      errorTag: 'sign_error',
      rationale: 'This is $\\vec{b}\\times\\vec{a}$: reversing the order of the factors reverses the direction of the result.',
    },
    {
      text: vecText([a[0] * b[0], a[1] * b[1], a[2] * b[2]]),
      errorTag: 'concept_confusion',
      rationale: 'Component-wise multiplication is not a vector product; the vector product is not obtained by multiplying matching components.',
    },
    {
      text: vecText([a[0] + b[0], a[1] + b[1], a[2] + b[2]]),
      errorTag: 'concept_confusion',
      rationale: 'This is the sum of the two vectors, which is a different operation entirely.',
    },
    {
      text: vecText([c[1], c[0], c[2]]),
      errorTag: 'component_confusion',
      rationale: 'The first two components were swapped after the calculation, which changes the direction of the resulting vector.',
    },
  ];
  const crossDistractors = distinctOpts(crossPool, [vecText(c)], 3);
  if (crossDistractors.length < 3) throw new Error('genCrossProduct: not enough distinct distractors');

  const spec: GenSpec = {
    id: makeId('vcross', rng),
    domainId: 'D02',
    conceptIds: ['C02.cross'],
    label: 'OFFICIAL_SAMPLE',
    stem: `Which vector results from the vector product $\\vec{a} \\times \\vec{b}$ with $\\vec{a} = ${vecText(a)}$ and $\\vec{b} = ${vecText(b)}$?`,
    options: [...crossDistractors, { text: vecText(c), errorTag: 'none', rationale: 'Correct: the components follow the determinant rule with the correct order and signs.', correct: true }],
    difficulty: 3,
    reasoningType: 'multi_step_application',
    cognitiveMove: 'execute_rule',
    style: 'numeric_direct',
    hints: [
      'First component: $a_yb_z - a_zb_y$; the pattern cycles through the components.',
      'The result must be perpendicular to both input vectors — check one scalar product as a sanity test.',
    ],
    explanation: {
      testing: 'Executing the vector product with correct component order and signs.',
      matters: 'The order of the factors (it decides the direction) and the signs inside each subtraction.',
      concept: 'Vector (cross) product.',
      why: 'The rule is the determinant expansion along the first row; each component is a 2×2 determinant of the remaining components.',
      steps: [
        `$c_x = ${a[1]}\\cdot${b[2]} - ${a[2]}\\cdot${b[1]} = ${c[0]}$`,
        `$c_y = ${a[2]}\\cdot${b[0]} - ${a[0]}\\cdot${b[2]} = ${c[1]}$`,
        `$c_z = ${a[0]}\\cdot${b[1]} - ${a[1]}\\cdot${b[0]} = ${c[2]}$`,
        `Sanity check: $\\vec{a}\\cdot\\vec{c} = 0$ and $\\vec{b}\\cdot\\vec{c} = 0$.`,
      ],
      trap: 'Losing track of which component goes with which sign — the middle component has the "reversed" subtraction order.',
      transfer: 'The vector product measures rotation and area: torque, angular momentum and surface normals all use it, and it is the fastest way to test whether two vectors are parallel.',
    },
    verification: { solver: 'vector.cross', payload: { a, b } },
  };
  return assemble(spec, rng);
}

/* ------------------------------------------------------------------ */
/* 7. parallelogram area                                               */
/* ------------------------------------------------------------------ */
export function genParallelogramArea(rng: Rng): Question {
  const a: [number, number] = [rng.int(-5, 5), rng.int(-5, 5)];
  const b: [number, number] = [rng.int(-5, 5), rng.int(-5, 5)];
  const det = Math.abs(a[0] * b[1] - a[1] * b[0]);
  const dotV = a[0] * b[0] + a[1] * b[1];
  const lenProduct = Math.hypot(...a) * Math.hypot(...b);
  const style = rng.pick(['numeric_direct', 'graph_choice'] as const);
  const spec: GenSpec = {
    id: makeId('varea', rng),
    domainId: 'D02',
    conceptIds: ['C02.area', 'C02.cross'],
    label: 'OFFICIAL_SAMPLE',
    stem:
      style === 'graph_choice'
        ? `The figure shows two vectors in the coordinate plane. The parallelogram spanned by them is indicated by the dashed lines. What is its area? (Use the three-dimensional formula with the z-components set to zero.)`
        : `Two vectors span a parallelogram: $\\vec{a} = ${vecText(a)}$ and $\\vec{b} = ${vecText(b)}$. What is the area of that parallelogram?`,
    figure:
      style === 'graph_choice'
        ? {
            kind: 'vector_grid',
            vectors: [
              { label: 'a', to: [a[0], a[1]] },
              { label: 'b', to: [b[0], b[1]] },
            ],
            showResultant: { label: 'a+b', to: [a[0] + b[0], a[1] + b[1]], color: '#a61b5c' },
            xRange: [-6, 6],
            yRange: [-6, 6],
          }
        : undefined,
    options: (() => {
      const pool: Opt[] = [
        { text: `$${Math.abs(dotV)}$ square units`, errorTag: 'concept_confusion', rationale: `This is the absolute scalar product ($${Math.abs(dotV)}$), which measures alignment, not area.` },
        { text: `$${num(det / 2, 4)}$ square units`, errorTag: 'rule_misapplication', rationale: 'Halving the determinant gives the area of the *triangle* enclosed by the two vectors, not of the parallelogram.' },
        { text: `$${num(lenProduct, 4)}$ square units`, errorTag: 'rule_misapplication', rationale: `This is the product of the two lengths ($${num(lenProduct, 4)}$), which is the area only if the vectors are perpendicular.` },
        { text: `$${num(det * 2, 4)}$ square units`, errorTag: 'calculation_slip', rationale: 'The determinant was doubled; the parallelogram area equals the determinant exactly once.' },
        { text: `$${Math.abs(a[0] * b[0] - a[1] * b[1])}$ square units`, errorTag: 'component_confusion', rationale: 'The components were paired in the wrong order, which computes a different expression.' },
      ];
      const picked = distinctOpts(pool, [`$${det}$ square units`], 3);
      if (picked.length < 3) throw new Error('genParallelogramArea: not enough distinct distractors');
      return [...picked, { text: `$${det}$ square units`, errorTag: 'none' as const, rationale: 'Correct: the area is the absolute value of the 2×2 determinant (the z = 0 case of $|\\vec{a}\\times\\vec{b}|$).', correct: true }];
    })(),
    difficulty: style === 'graph_choice' ? 3 : 3,
    reasoningType: 'multi_step_application',
    cognitiveMove: style === 'graph_choice' ? 'interpret_representation' : 'execute_rule',
    style,
    hints: [
      'Area of the spanned parallelogram $= |\\vec{a}\\times\\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\varphi$.',
      'In two dimensions the cross product reduces to $a_xb_y - a_yb_x$ (set all z-components to zero).',
    ],
    explanation: {
      testing: 'Connecting the geometric meaning of the vector product (area) with the 2D determinant, and rejecting the dot-product alternative.',
      matters: `The two component pairs; the *difference* $a_xb_y - a_yb_x$ is the decisive quantity.`,
      concept: 'Area of the spanned parallelogram equals the magnitude of the vector product.',
      why: 'The cross product measures the perpendicular part of one vector relative to the other, and that perpendicular part times the base is exactly the area.',
      steps: [
        `$\\vec{a}\\times\\vec{b} = (0, 0, ${a[0] * b[1] - a[1] * b[0]})$ using z = 0`,
        `$|\\vec{a}\\times\\vec{b}| = ${det}$`,
        `Hence the area is $${det}$ square units.`,
      ],
      trap: 'Using the scalar product, or halving the result because a triangle formula is remembered — the parallelogram is two such triangles.',
      transfer: 'The same determinant decides whether two vectors are parallel (area 0) and appears again in the triple product, where it plays the role of a base area.',
    },
    verification: { solver: 'vector.parallelogram_area', payload: { a, b } },
  };
  return assemble(spec, rng);
}

/* ------------------------------------------------------------------ */
/* 8. triple product & coplanarity                                     */
/* ------------------------------------------------------------------ */
export function genTripleProduct(rng: Rng): Question {
  const style = rng.pick(['compute', 'coplanar_statement', 'reverse_k'] as const);
  const a = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
  const b = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];

  if (style === 'compute') {
    const c = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
    const cx = [b[1] * c[2] - b[2] * c[1], b[2] * c[0] - b[0] * c[2], b[0] * c[1] - b[1] * c[0]];
    const t = a[0] * cx[0] + a[1] * cx[1] + a[2] * cx[2];
    return assemble(
      {
        id: makeId('vtriple', rng),
        domainId: 'D02',
        conceptIds: ['C02.triple'],
        label: 'OFFICIAL_SAMPLE',
        stem: `Compute the triple product $[\\vec{a}\\ \\vec{b}\\ \\vec{c}] = \\vec{a}\\cdot(\\vec{b}\\times\\vec{c})$ for $\\vec{a} = ${vecText(a)}$, $\\vec{b} = ${vecText(b)}$ and $\\vec{c} = ${vecText(c)}$.`,
        options: [
          { text: `$${t}$`, errorTag: 'none', rationale: 'Correct: first the vector product, then the scalar product with $\\vec{a}$.', correct: true },
          {
            text: `$${-t}$`,
            errorTag: 'sign_error',
            rationale: 'The sign arises from a permutation of the factors; the value $\\vec{a}\\cdot(\\vec{b}\\times\\vec{c})$ is fixed by the stated order.',
          },
          {
            text: `$${Math.abs(cx[0]) + Math.abs(cx[1]) + Math.abs(cx[2])}$`,
            errorTag: 'rule_misapplication',
            rationale: 'This adds the components of the intermediate vector product instead of forming the scalar product with $\\vec{a}$.',
          },
          {
            text: vecText(cx),
            errorTag: 'concept_confusion',
            rationale: 'This is only the intermediate result $\\vec{b}\\times\\vec{c}$ — a vector, whereas the triple product is a scalar.',
          },
        ],
        difficulty: 4,
        reasoningType: 'multi_step_application',
        cognitiveMove: 'execute_rule',
        style: 'numeric_direct',
        hints: ['The triple product is a combination: vector product first, scalar product second.', 'The final result must be a single number — if you have a vector, you are only halfway.'],
        explanation: {
          testing: 'Executing a two-stage combination of products and respecting the order of operations.',
          matters: 'The order of the three vectors inside the triple product; swapping two of them changes the sign.',
          concept: 'Triple product = a·(b×c), the signed volume spanned by the three vectors.',
          why: 'The inner vector product produces a vector perpendicular to $\\vec{b}$ and $\\vec{c}$; projecting $\\vec{a}$ onto it measures how far $\\vec{a}$ leaves the plane of the other two.',
          steps: [
            `$\\vec{b}\\times\\vec{c} = ${vecText(cx)}$`,
            `$\\vec{a}\\cdot(\\vec{b}\\times\\vec{c}) = ${a.map((x, i) => `(${x})(${cx[i]})`).join(' + ')} = ${t}$`,
          ],
          trap: 'Stopping at the intermediate vector, or losing a sign when the order is changed.',
          transfer: 'Zero is the coplanarity test; the absolute value is the volume of the parallelepiped. Both readings are used in the next item type.',
        },
        verification: { solver: 'vector.triple', payload: { a, b, c } },
      },
      rng,
    );
  }

  if (style === 'reverse_k') {
    const az = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
    const bz = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
    const k = rng.pick([1, -1, 2, -2, 3]);
    const cz = [az[0] + k * bz[0], az[1] + k * bz[1], az[2] + k * bz[2]];
    // For which multiplier λ is a + λb coplanar with a and b? Always — so ask for a zero triple product instead:
    const cx = [bz[1] * cz[2] - bz[2] * cz[1], bz[2] * cz[0] - bz[0] * cz[2], bz[0] * cz[1] - bz[1] * cz[0]];
    const t = az[0] * cx[0] + az[1] * cx[1] + az[2] * cx[2];
    return assemble(
      {
        id: makeId('vtriple-rev', rng),
        domainId: 'D02',
        conceptIds: ['C02.coplanar', 'C02.triple'],
        label: 'OFFICIAL_SAMPLE',
        stem: `Two vectors are given: $\\vec{a} = ${vecText(az)}$ and $\\vec{b} = ${vecText(bz)}$. Which value of $\\lambda$ makes the three vectors $\\vec{a}$, $\\vec{b}$ and $\\vec{a} + \\lambda\\vec{b}$ coplanar?`,
        options: [
          {
            text: 'Every value of $\\lambda$',
            errorTag: 'none',
            rationale: 'Correct: $\\vec{a} + \\lambda\\vec{b}$ is a linear combination of $\\vec{a}$ and $\\vec{b}$, so it always lies in their plane and the triple product is always 0.',
            correct: true,
          },
          { text: `$\\lambda = 0$ only`, errorTag: 'scope_error', rationale: 'Only the case $\\lambda = 0$ is considered, but the property holds for every value — this limits the answer too much.' },
          { text: `$\\lambda = ${num(-1, 2)}$ only`, errorTag: 'scope_error', rationale: 'This is just one special value; the coplanarity does not depend on the multiplier.' },
          { text: 'No value of $\\lambda$', errorTag: 'concept_confusion', rationale: 'Coplanarity is claimed to be impossible, which contradicts the fact that a sum of two vectors never leaves their plane.' },
        ],
        difficulty: 5,
        reasoningType: 'logical_deduction',
        cognitiveMove: 'general_case',
        style: 'reverse_question',
        hints: [
          'A vector built from $\\vec{a}$ and $\\vec{b}$ by scaling and adding lies in the same plane.',
          'Coplanarity means the triple product is zero — ask yourself whether any of the three vectors could leave the plane.',
        ],
        explanation: {
          testing: 'Understanding coplanarity structurally instead of computing determinants for each candidate.',
          matters: 'The fact that the third vector is constructed from the first two.',
          irrelevant: 'The concrete components and the value of $\\lambda$ are irrelevant; they cannot change the geometric situation.',
          concept: 'A zero triple product means the three vectors lie in one plane; any linear combination of two vectors lies in their plane.',
          why: 'Scaling and adding vectors cannot produce a component perpendicular to the plane they span.',
          steps: [
            'Recognise the structure: $\\vec{c} = \\vec{a} + \\lambda\\vec{b}$ is a linear combination of $\\vec{a}$ and $\\vec{b}$.',
            'A linear combination stays inside the plane spanned by the two vectors.',
            'Therefore the spanned volume is zero for every $\\lambda$, i.e. the vectors are always coplanar.',
          ],
          trap: 'Substituting particular values instead of using the structure — a computation cannot prove a statement about *all* values, but the geometry can.',
          transfer: 'The same reasoning shows why three vectors are always coplanar when one of them is a combination of the others, and why two parallel vectors force a zero volume.',
        },
        verification: { solver: 'vector.triple', payload: { a: az, b: bz, c: cz } },
      },
      rng,
    );
  }

  // coplanarity statement — the official question type, with newly invented options
  const c = [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  return assemble(
    {
      id: makeId('vcoplanar', rng),
      domainId: 'D02',
      conceptIds: ['C02.coplanar'],
      label: 'OFFICIAL_SAMPLE',
      stem: `The triple product of three vectors has the value 0. Which statement is correct for *all* possible cases?`,
      options: [
        { text: 'The three vectors lie in one plane (they are linearly dependent).', errorTag: 'none', rationale: 'Correct: a zero volume means the parallelepiped is flat, so all three vectors lie in a common plane.', correct: true },
        { text: 'The three vectors are pairwise perpendicular.', errorTag: 'sufficient_necessary_confusion', rationale: 'Perpendicular vectors would be a special case with a large volume, not a zero volume — this is neither necessary nor typical.' },
        { text: 'At least two of the vectors must be parallel to each other.', errorTag: 'sufficient_necessary_confusion', rationale: 'Two parallel vectors *do* give a zero triple product, but they are not the only way to get one: three coplanar vectors that are pairwise non-parallel also give 0.' },
        { text: 'The three vectors add up to the zero vector.', errorTag: 'sufficient_necessary_confusion', rationale: 'Three vectors summing to zero are coplanar, so this is a sufficient condition — but it is not necessary, and the question asks what holds in all cases.' },
      ],
      difficulty: 5,
      reasoningType: 'logical_deduction',
      cognitiveMove: 'general_case',
      style: 'statement_compare',
      hints: [
        'The triple product measures a volume — what does a volume of zero look like geometrically?',
        'Ask of every option: is this true in *every* case, or only in some cases?',
      ],
      explanation: {
        testing: 'Distinguishing a necessary consequence from sufficient-but-not-necessary special cases, using the geometric meaning of the triple product.',
        matters: 'The geometric interpretation of the value 0 as zero volume.',
        concept: 'Triple product = spanned volume; zero ⇔ coplanar vectors.',
        why: 'A parallelepiped with zero volume is flat, and a flat parallelepiped is exactly a parallelogram spanned by three coplanar vectors.',
        steps: [
          'Volume 0 ⇒ the three vectors do not span three dimensions.',
          'Hence they all lie in one plane (a 2D subspace).',
          'Parallel vectors or a zero-sum triple would *force* volume 0, but they are not the only possibilities, so they cannot be the general statement.',
        ],
        trap: 'Choosing a statement that is *sufficient* (a special cause of zero volume) instead of one that is *necessary* and complete — the official item style tests exactly this distinction.',
        transfer: 'Whenever an answer claims "in all cases", test it against a counterexample that satisfies the condition but not the option. The same discipline applies to equity, mechanics and methodology statements.',
      },
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 9. effect-direction / parameter reasoning on products               */
/* ------------------------------------------------------------------ */
export function genVectorEffect(rng: Rng): Question {
  const kind = rng.pick(['dot_double', 'cross_double', 'perp_scale', 'area_halve', 'dot_sign'] as const);
  if (kind === 'dot_double') {
    return assemble(
      {
        id: makeId('veff-dot', rng),
        domainId: 'D02',
        conceptIds: ['C02.dot'],
        label: 'OFFICIAL_SAMPLE',
        stem: `Two vectors have a scalar product of 12 and an angle of 60° between them. Vector $\\vec{b}$ is replaced by $3\\vec{b}$, while $\\vec{a}$ stays the same. What is the new scalar product?`,
        options: [
          { text: '36', errorTag: 'none', rationale: 'Correct: the scalar product is linear in each factor, so tripling one vector triples the product.', correct: true },
          { text: '12', errorTag: 'concept_confusion', rationale: 'The scalar product is claimed to be unchanged, but it is proportional to the length of each factor.' },
          { text: '4', errorTag: 'ratio_error', rationale: 'The factor 3 was divided instead of multiplied.' },
          { text: '108', errorTag: 'rule_misapplication', rationale: 'This triples the product three times over — the factor applies once, not twice.' },
        ],
        difficulty: 3,
        reasoningType: 'parameter_reasoning',
        cognitiveMove: 'effect_of_change',
        style: 'effect_direction',
        hints: ['$\\vec{a}\\cdot(k\\vec{b}) = k(\\vec{a}\\cdot\\vec{b})$ — the scalar product is linear in each argument.', 'The angle does not change when a vector is scaled by a positive number, so only the length factor matters.'],
        explanation: {
          testing: 'Linearity of the scalar product under scaling of one factor.',
          matters: 'The scaling factor of the changed vector; the angle stays the same for a positive factor.',
          concept: '$\\vec{a}\\cdot(k\\vec{b}) = k\\,(\\vec{a}\\cdot\\vec{b})$.',
          why: 'Scaling a vector scales each of its components, and every product in the sum therefore carries the same factor.',
          steps: ['$\\vec{a}\\cdot(3\\vec{b}) = 3\\,(\\vec{a}\\cdot\\vec{b})$', '$= 3 \\cdot 12 = 36$'],
          trap: 'Applying the factor twice (once for each vector) or forgetting it entirely.',
          transfer: 'The same linearity explains why doubling a force doubles the work for the same displacement, and why scaling a quantity of goods scales the total cost.',
        },
      },
      rng,
    );
  }
  if (kind === 'cross_double') {
    return assemble(
      {
        id: makeId('veff-cross', rng),
        domainId: 'D02',
        conceptIds: ['C02.cross', 'C02.area'],
        label: 'OFFICIAL_SAMPLE',
        stem: `The area of the parallelogram spanned by two vectors is $A$. Both vectors are now doubled in length while the angle between them is kept unchanged. What is the new area?`,
        options: [
          { text: '$4A$', errorTag: 'none', rationale: 'Correct: the area is proportional to both lengths, so doubling each multiplies the area by $2 \\times 2 = 4$.', correct: true },
          { text: '$2A$', errorTag: 'linearity_assumption', rationale: 'Only one of the two factors was accounted for; the area depends on the lengths of both vectors.' },
          { text: '$A$', errorTag: 'concept_confusion', rationale: 'The area is claimed to be invariant, but scaling the vectors changes the spanned region.' },
          { text: '$8A$', errorTag: 'rule_misapplication', rationale: 'This multiplies by the cube of the factor, which does not match the two-dimensional nature of an area.' },
        ],
        difficulty: 4,
        reasoningType: 'parameter_reasoning',
        cognitiveMove: 'effect_of_change',
        style: 'effect_direction',
        hints: ['$A = |\\vec{a}||\\vec{b}|\\sin\\varphi$ — the area is proportional to each of the two lengths.', 'Track the factor for each vector separately.'],
        explanation: {
          testing: 'How a product formula behaves when both of its length factors change, while the angle is held fixed.',
          matters: 'The area formula $|\\vec{a}||\\vec{b}|\\sin\\varphi$ and the fact that $\\sin\\varphi$ is unchanged.',
          concept: 'Area of the spanned parallelogram = $|\\vec{a}||\\vec{b}|\\sin\\varphi$.',
          why: 'The area grows with the base and with the height; doubling both lengths doubles base and height.',
          steps: ['$A_{\\text{new}} = (2|\\vec{a}|)(2|\\vec{b}|)\\sin\\varphi$', '$= 4\\,|\\vec{a}||\\vec{b}|\\sin\\varphi = 4A$'],
          trap: 'Treating an area as a linear quantity; areas scale with the product of two lengths.',
          transfer: 'The same reasoning gives the scaling of surfaces (paint needed), of map regions, and of the drag force that an area produces.',
        },
      },
      rng,
    );
  }
  if (kind === 'perp_scale') {
    return assemble(
      {
        id: makeId('veff-perp', rng),
        domainId: 'D02',
        conceptIds: ['C02.angle', 'C02.dot'],
        label: 'OFFICIAL_SAMPLE',
        stem: `Two non-zero vectors are perpendicular. Vector $\\vec{a}$ is multiplied by $-5$ and vector $\\vec{b}$ by $2$. What is the angle between the two new vectors?`,
        options: [
          { text: '90°', errorTag: 'none', rationale: 'Correct: scaling only changes lengths (the negative sign reverses one direction), but a right angle stays a right angle.', correct: true },
          { text: '180°', errorTag: 'sign_error', rationale: 'A factor of −5 reverses one vector, which would give 180° only if the vectors had originally been parallel in opposite directions.' },
          { text: '0°', errorTag: 'concept_confusion', rationale: 'Parallelism is claimed, but perpendicular vectors stay perpendicular under scaling.' },
          { text: 'It cannot be determined without the lengths.', errorTag: 'prerequisite_gap', rationale: 'The lengths are indeed unknown, but they do not enter: perpendicularity is independent of magnitude.' },
        ],
        difficulty: 4,
        reasoningType: 'conceptual_discrimination',
        cognitiveMove: 'general_case',
        style: 'effect_direction',
        hints: ['Check the scalar product of the new vectors: $(-5\\vec{a})\\cdot(2\\vec{b}) = -10\\,(\\vec{a}\\cdot\\vec{b})$.', 'If the original scalar product is zero, what is −10 times zero?'],
        explanation: {
          testing: 'Recognising which properties of vectors survive scaling and which do not.',
          matters: 'The zero scalar product of perpendicular vectors and the linearity of the scalar product.',
          irrelevant: 'The scalar factors −5 and 2 are irrelevant except for the fact that they are non-zero.',
          concept: 'Scaling changes length and possibly orientation, never the angle class (0°/90°/180°) between two vectors.',
          why: 'The scalar product of the scaled vectors is a non-zero multiple of the original scalar product, and a non-zero multiple of zero is still zero.',
          steps: [
            '$\\vec{a}\\cdot\\vec{b} = 0$ because the vectors are perpendicular.',
            '$(-5\\vec{a})\\cdot(2\\vec{b}) = -10\\,(\\vec{a}\\cdot\\vec{b}) = 0$.',
            'Zero scalar product ⇒ the angle is again 90°.',
          ],
          trap: 'Assuming that a negative factor such as −5 changes the angle to 180°; it only reverses one of the two vectors, and a right angle is unaffected.',
          transfer: 'In physics, scaling a force or a displacement changes work linearly, but perpendicularity (and thus whether work is zero) is preserved.',
        },
      },
      rng,
    );
  }
  if (kind === 'area_halve') {
    return assemble(
      {
        id: makeId('veff-area-halve', rng),
        domainId: 'D02',
        conceptIds: ['C02.area'],
        label: 'OFFICIAL_SAMPLE',
        stem: `The two vectors spanning a parallelogram are halved in length, and the angle between them is doubled from 30° to 60°. By what factor does the area change?`,
        options: [
          { text: 'It is multiplied by about 0.43', errorTag: 'none', rationale: 'Correct: the length effect contributes $\\tfrac14$ and the angle effect contributes $\\sin 60°/\\sin 30° \\approx 1.73$, so $\\tfrac14 \\times 1.73 \\approx 0.43$.', correct: true },
          { text: 'It is multiplied by about 0.25', errorTag: 'concept_confusion', rationale: 'Only the length effect was applied; the angle also changes, which increases the area by a factor of about 1.73.' },
          { text: 'It is multiplied by about 0.87', errorTag: 'irrelevant_data_used', rationale: 'This is the value of $\\sin 60°$ alone: the two halvings of the lengths were left out of the calculation.' },
          { text: 'It is unchanged', errorTag: 'linearity_assumption', rationale: 'Both the lengths and the angle change, so the area cannot stay the same.' },
        ],
        difficulty: 5,
        reasoningType: 'parameter_reasoning',
        cognitiveMove: 'effect_of_change',
        style: 'effect_direction',
        hints: ['Compute the factor from the lengths and from $\\sin\\varphi$ separately, then multiply.', '$\\sin 30° = 0.5$, $\\sin 60° \\approx 0.866$.'],
        explanation: {
          testing: 'Combining two independent effects (length scaling and angle change) in a multiplicative formula.',
          matters: 'Both length factors and the two sine values.',
          concept: 'Area = $|\\vec{a}||\\vec{b}|\\sin\\varphi$: the changes multiply.',
          why: 'Each factor in the product acts independently, so the total factor is the product of the individual factors.',
          steps: [
            'Length effect: $(\\tfrac12)(\\tfrac12) = \\tfrac14$.',
            'Angle effect: $\\sin 60° / \\sin 30° = 0.866/0.5 \\approx 1.73$.',
            'Total factor: $\\tfrac14 \\times 1.73 \\approx 0.43$.',
          ],
          trap: 'Adding the effects instead of multiplying them, or forgetting that both lengths are halved.',
          transfer: 'Multiplicative bookkeeping governs every product formula: area, work at an angle, gas laws and interest calculations.',
        },
        tags: ['multi-effect'],
      },
      rng,
    );
  }
  // dot_sign
  return assemble(
    {
      id: makeId('veff-sign', rng),
      domainId: 'D02',
      conceptIds: ['C02.dot', 'C02.angle'],
      label: 'OFFICIAL_SAMPLE',
      stem: `Two non-zero vectors have a negative scalar product. What can be concluded about the angle $\\varphi$ between them?`,
      options: [
        { text: '$\\varphi$ is obtuse (greater than 90° and at most 180°).', errorTag: 'none', rationale: 'Correct: a negative scalar product means $\\cos\\varphi < 0$, i.e. an obtuse angle.', correct: true },
        { text: '$\\varphi$ is acute (less than 90°).', errorTag: 'inequality_direction', rationale: 'An acute angle gives $\\cos\\varphi > 0$ and therefore a positive scalar product — the opposite of what is observed.' },
        { text: '$\\varphi$ is exactly 90°.', errorTag: 'concept_confusion', rationale: 'At 90° the scalar product is exactly zero, not negative.' },
        { text: 'Nothing can be concluded without the lengths.', errorTag: 'prerequisite_gap', rationale: 'Lengths only scale the value: $\\cos\\varphi$ alone decides the sign, because both lengths are positive.' },
      ],
      difficulty: 4,
      reasoningType: 'conceptual_discrimination',
      cognitiveMove: 'classify_situation',
      style: 'statement_compare',
      hints: ['Write down $\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\varphi$ and look at which factors can be negative.', 'Both lengths are positive, so the sign comes only from the cosine.'],
      explanation: {
        testing: 'Using the sign of the scalar product as a qualitative angle test.',
        matters: 'The fact that the lengths are positive and therefore cannot cause the negative sign.',
        concept: 'Sign of the scalar product ⇔ cosine of the enclosed angle.',
        why: 'The scalar product factorises into two positive lengths and $\\cos\\varphi$, so the sign of the whole product equals the sign of the cosine.',
        steps: [
          '$\\vec{a}\\cdot\\vec{b} < 0 \\Rightarrow |\\vec{a}||\\vec{b}|\\cos\\varphi < 0$',
          'Since $|\\vec{a}|,|\\vec{b}| > 0$, it follows that $\\cos\\varphi < 0$',
          'Hence $90° < \\varphi \\le 180°$.',
        ],
        trap: 'Believing the lengths could flip the sign, or confusing "negative scalar product" with "perpendicular".',
        transfer: 'The same qualitative test shows when work is negative (force partly opposing the motion) and when two variables move in opposite directions.',
      },
    },
    rng,
  );
}

/* ------------------------------------------------------------------ */
/* 10. result-type item (official question type)                       */
/* ------------------------------------------------------------------ */
/**
 * Coordinates and components (C02.coords) — the reading-off skill the rest of the vector domain
 * assumes: a described movement on a grid becomes an ordered pair, and a pair is read back as
 * components along the axes. Kept separate from addition (C02.addsub) because the error mechanisms
 * are different: here students swap the axes, flip a sign, or add the magnitudes.
 */
export function genVectorComponents(rng: Rng): Question {
  const east = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
  const north = rng.pick([1, 2, 3, 4, 5, 6, 7, 8]);
  const shape = rng.pick(['describe', 'read'] as const);

  if (shape === 'read') {
    // The key must be a signed ordered pair: the solver re-derives the components, so an option
    // written only as words ("4 units east") cannot be checked against it — the validator would
    // rightly reject such an item as unverifiable.
    const ax = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    const ay = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    if (ax > 0 && ay > 0) return genVectorComponents(rng); // keep the "signs dropped" distractor wrong
    if (Math.abs(ax) === Math.abs(ay)) return genVectorComponents(rng); // keep the swap a different pair
    const pairText = (pair: number[]) => `$(${pair[0]},\\ ${pair[1]})$`;
    return assemble(
      {
        id: makeId('vcomp-read', rng),
        domainId: 'D02',
        conceptIds: ['C02.coords'],
        label: 'PREREQUISITE',
        stem: `A point $P$ has the coordinates $P(${ax}, ${ay})$ in a Cartesian system whose $x$-axis points east and whose $y$-axis points north. Which ordered pair gives the components of the position vector $\\overrightarrow{OP}$ (first component east–west, second component north–south)?`,
        options: [
          { text: pairText([ax, ay]), errorTag: 'none', rationale: 'Correct: the coordinates of the point *are* the components of its position vector, signs included.', correct: true },
          { text: pairText([ay, ax]), errorTag: 'component_confusion', rationale: 'The two components were swapped; the first entry belongs to the east–west axis.' },
          { text: pairText([Math.abs(ax), Math.abs(ay)]), errorTag: 'sign_error', rationale: 'A sign was dropped, so the direction information is lost — the pair no longer points at $P$.' },
          { text: pairText([ax + ay, ax + ay]), errorTag: 'concept_confusion', rationale: 'The two coordinates were added together and put into both slots; components are not sums of each other.' },
        ],
        difficulty: 1,
        reasoningType: 'recall_structure',
        cognitiveMove: 'interpret_representation',
        style: 'description_choice',
        hints: ['A position vector points from the origin to the point, so its components are the coordinates.', 'A negative coordinate means the component points west or south.'],
        explanation: {
          testing: 'Reading a point as a position vector, signs included.',
          matters: `The pair (${ax}, ${ay}) and the orientation of the axes.`,
          concept: 'The components of $\\overrightarrow{OP}$ are the coordinates of $P$.',
          why: `Travelling from the origin to $P$ means moving ${ax} along the $x$-axis and ${ay} along the $y$-axis; those two moves are exactly the components.`,
          steps: [`$x$-component: $${ax}$ (${ax < 0 ? 'west' : 'east'})`, `$y$-component: $${ay}$ (${ay < 0 ? 'south' : 'north'})`, `$\\overrightarrow{OP} = (${ax},\\ ${ay})$`],
          trap: 'Swapping the axes or dropping a sign — both change the vector, not just its description.',
          transfer: 'Every later calculation keeps the two components separate and signed; this is the reading step of the whole vector domain.',
        },
        verification: { solver: 'vector.components', payload: { a: [ax, ay] } },
      },
      rng,
    );
  }

  return assemble(
    {
      id: makeId('vcomp', rng),
      domainId: 'D02',
      conceptIds: ['C02.coords'],
      label: 'PREREQUISITE',
      stem: `A surveyor walks ${east} km east and then ${north} km north. Which ordered pair gives the components of the displacement from the starting point, in km (first component east, second component north)?`,
      figure: { kind: 'vector_grid', vectors: [{ label: 'east', to: [east, 0] }, { label: 'north', to: [0, north] }] },
      options: [
        { text: `$(${east},\\ ${north})$`, errorTag: 'none', rationale: 'Correct: the eastward leg is the first component and the northward leg the second.', correct: true },
        { text: `$(${north},\\ ${east})$`, errorTag: 'component_confusion', rationale: 'The components were swapped; the first entry belongs to the east–west axis.', correct: false },
        { text: `$(${east + north},\\ ${east + north})$`, errorTag: 'concept_confusion', rationale: 'The path length was added up and entered in both slots; components are not path lengths.' },
        { text: `$(${east},\\ ${-north})$`, errorTag: 'sign_error', rationale: 'Walking north increases the second component; the negative sign points south.' },
      ],
      difficulty: 1,
      reasoningType: 'recall_structure',
      cognitiveMove: 'execute_rule',
      style: 'numeric_direct',
      hints: ['Read the pair in the order the question fixes: (east, north).', 'The two legs do not need Pythagoras — that would give the length, not the components.'],
      explanation: {
        testing: 'Writing a two-leg journey as a component pair.',
        matters: `The eastward leg (${east} km) and the northward leg (${north} km).`,
        concept: 'Components of a displacement are the separate movements along each axis.',
        why: 'Kinematically, a displacement along an axis is unaffected by movement along the perpendicular axis, so the two legs are independent components.',
        steps: [`east–west component: $+${east}$ km`, `north–south component: $+${north}$ km`, `displacement vector: $\\vec{d} = (${east},\\ ${north})$ km`],
        trap: 'Adding the legs together, swapping the order, or computing the straight-line length when the components were asked for.',
        transfer: 'The same decomposition turns any description in words — wind, forces, current — into a vector that can be computed with.',
      },
      verification: { solver: 'vector.components', payload: { a: [east, north] } },
    },
    rng,
  );
}

export function genResultType(rng: Rng): Question {
  const asked = rng.pick(['dot', 'cross', 'triple', 'all'] as const);
  if (asked === 'all') {
    return assemble(
      {
        id: makeId('vtype', rng),
        domainId: 'D02',
        conceptIds: ['C02.resulttype'],
        label: 'OFFICIAL_SAMPLE',
        stem: 'The three vector operations – scalar product, vector product and triple product – do not always produce the same type of result. Which statement is correct?',
        options: [
          {
            text: 'The scalar product yields a scalar, the vector product yields a vector, and the triple product yields a scalar.',
            errorTag: 'none',
            rationale: 'Correct: the triple product is a scalar product of a vector with a vector product, so the vector result is converted into a number.',
            correct: true,
          },
          {
            text: 'The scalar product yields a scalar, the vector product yields a vector, and the triple product yields a vector.',
            errorTag: 'definition_misuse',
            rationale: 'The triple product cannot be a vector: the final operation in $\\vec{a}\\cdot(\\vec{b}\\times\\vec{c})$ is a scalar product.',
          },
          {
            text: 'The scalar product yields a vector, the vector product yields a vector, and the triple product yields a scalar.',
            errorTag: 'definition_misuse',
            rationale: 'The scalar product is defined as a sum of products of numbers, so it is a scalar — never a vector.',
          },
          {
            text: 'All three operations yield scalars.',
            errorTag: 'definition_misuse',
            rationale: 'The vector product cannot be a scalar: its result has a direction, which is its defining feature.',
          },
        ],
        difficulty: 1,
        reasoningType: 'recall_structure',
        cognitiveMove: 'classify_situation',
        style: 'statement_compare',
        hints: ['Look at the last operation performed in each definition.', 'A product of two vectors can be defined in two different ways — with different types of results.'],
        explanation: {
          testing: 'Knowing what type of object each operation produces, which decides what further operations are possible.',
          matters: 'The final step of each definition.',
          concept: 'Result types: scalar product → scalar, vector product → vector, triple product → scalar.',
          why: 'The scalar product sums products of numbers; the vector product builds a new direction; the triple product ends with a scalar product.',
          steps: [
            'Scalar product: $a_xb_x + a_yb_y + a_zb_z$ — one number.',
            'Vector product: a three-component result with direction.',
            'Triple product: $\\vec{a}\\cdot(\\vec{b}\\times\\vec{c})$ — a scalar product, so a single number.',
          ],
          trap: 'Assuming "product of vectors" always means the same type of result; the two products deliberately differ.',
          transfer: 'Distinguishing result types is what makes it legitimate to write $|\\vec{a}\\times\\vec{b}|$ (a length) but not $\\vec{a}\\cdot\\vec{b} = \\vec{c}$ — dimensional and type consistency checks use the same habit.',
        },
      },
      rng,
    );
  }
  const kindText = asked === 'dot' ? 'scalar product $\\vec{a}\\cdot\\vec{b}$' : asked === 'cross' ? 'vector product $\\vec{a}\\times\\vec{b}$' : 'triple product $[\\vec{a}\\,\\vec{b}\\,\\vec{c}]$';
  const correctText = asked === 'cross' ? 'a vector' : 'a scalar';
  const other = asked === 'cross' ? 'a scalar' : 'a vector';
  return assemble(
    {
      id: makeId('vtype-single', rng),
      domainId: 'D02',
      conceptIds: ['C02.resulttype'],
      label: 'OFFICIAL_SAMPLE',
      stem: `What type of result does the ${kindText} produce?`,
      options: [
        { text: correctText, errorTag: 'none', rationale: `Correct: the ${kindText} produces ${correctText}.`, correct: true },
        { text: other, errorTag: 'definition_misuse', rationale: `The ${kindText} cannot produce ${other}.` },
        { text: 'Always a length, i.e. a positive number.', errorTag: 'concept_confusion', rationale: 'A length is a special case of a scalar; the result can also be negative or zero, so this is too narrow.' },
        { text: 'It depends on the dimension of the vectors involved.', errorTag: 'concept_confusion', rationale: 'The dimension changes the number of components but not the type of the result.' },
      ],
      difficulty: 1,
      reasoningType: 'recall_structure',
      cognitiveMove: 'classify_situation',
      style: 'statement_compare',
      hints: ['Ask: can the result have a direction?', 'Only one of the three operations builds a new direction.'],
      explanation: {
        testing: 'The type signature of the vector operations — the prerequisite for using their results in further calculations.',
        matters: 'Whether the definition ends with a sum of numbers or with a new multi-component object.',
        concept: 'Scalar vs. vector results.',
        why: 'The type of the result determines which operations may follow (a vector cannot be added to a scalar, and only a vector has a direction).',
        steps: ['Recall the definition of the operation.', 'Count the components of the result: one number ⇒ scalar; several components with direction ⇒ vector.'],
        trap: 'Judging by the names of the inputs instead of the structure of the definition.',
        transfer: 'Type checking appears in every quantitative discipline: units in physics, data types in programming, and dimensional consistency in engineering.',
      },
    },
    rng,
  );
}
