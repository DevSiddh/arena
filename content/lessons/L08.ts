import { f, fig, intuition, lesson, mis, p, practice, sec, steps, t } from './helpers';

export const L08 = lesson(
  'L08',
  'D08',
  'Computational and algorithmic reasoning without a computer',
  'Trace a procedure, read a growth rate, spot the wrong step — the reasoning the official field list implies for computational sciences.',
  ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
  45,
  [
    sec('what_is_it', [
      p(
        'Computational reasoning in a no-computer test is three skills: **tracing** a short procedure step by step, **judging growth** (how the effort of a method changes as the input grows), and **debugging by reading** (which line violates the intention?). Binary place value belongs here too, because it is the smallest complete example of a positional number system.',
      ),
      p('**Label:** [OFFICIAL FIELD LIST]. The official instructions name "computational sciences" as a possible field, but no sample question is published for it. This lesson therefore trains generic algorithmic reasoning in the demonstrated item format and is a preparation extension, not a syllabus claim.'),
    ]),
    sec('why_it_matters', [
      p(
        'The demonstrated reasoning moves include *execute a rule* and *explain or critique*. Tracing a small algorithm is the purest form of both: the rule is given, the state must be tracked, and a critique item asks which step breaks the rule. These moves are examinable in a text-only format, which is why the domain is included.',
      ),
    ]),
    sec('prerequisites', [
      p('Careful arithmetic with negative numbers, and the willingness to make a small table instead of tracking values in your head.'),
      t(
        ['Task', 'What you produce', 'Why a table helps'],
        [
          ['Trace a loop', 'the value after n iterations', 'each column is one execution of the body'],
          ['Compare growth', 'which method scales better', 'one row per input size removes intuition bias'],
          ['Find the error', 'the first step that contradicts the goal', 'the last correct state is the error’s location'],
          ['Convert bases', 'the decimal value', 'write place values above the digits'],
        ],
      ),
    ]),
    sec('core_knowledge', [
      p('**Binary place values.** Each position counts a power of two, and each digit is 0 or 1:'),
      f('1011_2 = 1\\cdot 8 + 0\\cdot 4 + 1\\cdot 2 + 1\\cdot 1 = 11_{10}'),
      p('Halving is a shift right, doubling is a shift left — which is why binary appears wherever a doubling process does.'),
      p('**Growth rates.** For an input of size $n$, the effort of common procedures grows as:'),
      t(
        ['Pattern', 'Effort', 'Example', 'If n doubles'],
        [
          ['constant', '1', 'reading one value', 'unchanged'],
          ['linear', 'n', 'one pass through the data', '×2'],
          ['quadratic', 'n²', 'all pairs', '×4'],
          ['logarithmic', 'log n', 'halving a sorted list', '+1 step'],
        ],
        'Sorting the growth classes is usually enough — exact constants rarely matter in these items.',
      ),
      p('**Tracing discipline.** An iterative procedure is a recurrence: whatever is true after the body repeats, stays true after another repetition. This is why one worked row of a table makes the whole trace trustworthy.'),
      p('**Error localisation.** To find the wrong step, compute what the *intended* rule would give at each step and compare with the stated procedure: the first divergence is the bug.'),
    ]),
    sec('visual_intuition', [
      fig(
        {
          kind: 'flowchart',
          title: 'A trace as a table',
          steps: ['start value 3, step "add 4"', 'after 1 iteration: 7', 'after 2 iterations: 11', 'after 3 iterations: 15', 'after n iterations: 3 + 4n'],
        },
        'Three rows are enough to see the closed form. Once you see it, the item becomes a substitution — and the reason a table beats mental tracking.',
      ),
      intuition(
        'Think of a loop as a factory conveyor: each iteration is one pass, and the state is the item on the belt. For growth, think of a phone book: linear search flips pages one by one, halving search cuts the book in half each time, and a quadratic procedure compares every page with every other page.',
      ),
      fig(
        {
          kind: 'line_chart',
          title: 'Growth of effort',
          xLabel: 'input size n',
          yLabel: 'operations',
          x: [1, 2, 4, 8, 16],
          series: [
            { name: 'linear', values: [1, 2, 4, 8, 16], color: '#2563eb' },
            { name: 'quadratic', values: [1, 4, 16, 64, 256], color: '#b45309' },
          ],
        },
        'Doubling the input doubles a linear procedure’s work and quadruples a quadratic one’s. Two points are enough to classify a growth curve.',
      ),
    ]),
    sec('worked_example', [
      p('A procedure starts with $x = 5$ and repeats the body "double $x$, then subtract 2" three times. What is the final value, and what would the value be after $n$ iterations if the rule were "add 6" instead?'),
      steps([
        'Trace literally, one line per iteration: $x_1 = 2\\cdot5 - 2 = 8$; $x_2 = 2\\cdot8 - 2 = 14$; $x_3 = 2\\cdot14 - 2 = 26$.',
        'Answer to the first part: 26. Note the order of operations — double first, then subtract.',
        'For the second part, use a table: after 0 iterations 5, after 1: 11, after 2: 17, after 3: 23 — a constant increase of 6 per iteration.',
        'Closed form: $x_n = 5 + 6n$.',
        'Substitute if a specific $n$ is asked for, instead of tracing long loops. Tracing 50 iterations by hand is a design error, not a skill.',
      ]),
      mis('Applying "subtract 2" before doubling because it is written second in the sentence.', 'Follow the stated order exactly; in a trace, order of operations is the whole question.'),
    ]),
    practice('guided_practice', [p('One loop, one table. Write the state after each iteration in a column — do not do it in your head, and do not skip iterations.')], ['C08.trace'], [1, 2]),
    practice('independent_practice', [p('Binary place value and short traces combined: convert, then trace, then convert back. Keep the place values written above the digits.')], ['C08.binary', 'C08.trace'], [2, 3]),
    practice('transfer', [p('Growth-rate items and error-finding items. For growth, classify (constant / linear / quadratic / logarithmic) before computing; for errors, find the first divergent step.')], ['C08.growth', 'C08.debug'], [4, 5]),
    practice('dmat_style', [p('Exam-style computational items: a procedure described in words, a claim about its result, and distractors that come from off-by-one traces or from confusing the growth class.')], ['C08.trace', 'C08.growth', 'C08.debug', 'C08.binary'], [5, 6]),
    sec('trick_misconception', [
      mis('Off-by-one: counting the loop body’s first execution as iteration 0 (or the reverse).', 'Write the iteration numbers explicitly in the table header. One extra row costs five seconds and saves the item.'),
      mis('“Quadratic is always slower.”', 'For *small* inputs a quadratic method can be faster because of constant factors. The comparison matters for large inputs — and the item wording usually says so.'),
      mis('“Binary is base 2, so digits can be 0, 1 or 2.”', 'Only 0 and 1. The digit limit is one less than the base.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool. Target 80 %, with the trace table written for every procedural item and the growth class named for every comparison item.')],
      ['C08.trace', 'C08.growth', 'C08.binary', 'C08.debug'],
      [1, 2, 3, 4, 5, 6],
    ),
  ],
);
