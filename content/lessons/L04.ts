import { f, fig, intuition, lesson, mis, p, practice, sec, steps, t } from './helpers';

export const L04 = lesson(
  'L04',
  'D04',
  'Probability and statistics: what a sample can and cannot show',
  'Averages that hide outliers, complements that simplify, and base rates that everybody forgets.',
  ['OFFICIAL_FIELD_LIST', 'PREREQUISITE'],
  55,
  [
    sec('what_is_it', [
      p(
        'Probability answers "how often, in the long run?" and statistics answers "what can I conclude from this sample?". The official research-methods material uses both ideas without naming formulas: it speaks of a sample of appropriate size, of statistical significance, and of what a single case can show. This lesson supplies the vocabulary underneath those phrases.',
      ),
      t(
        ['Idea', 'One-line meaning', 'Typical item'],
        [
          ['Relative frequency', 'favourable outcomes ÷ all outcomes', 'wind speed above 5 m/s in a month'],
          ['Complement', 'probability that it does *not* happen = 1 − p', 'at least one, none, not'],
          ['Base rate', 'the share of the whole population with a property', 'marker present in 4 % of the population'],
          ['Conditional', 'restrict the denominator to the relevant subgroup', 'among those with the condition, 80 % show the marker'],
          ['Mean / median', 'balance point vs. middle value', 'a wage table with one extreme value'],
          ['Significance', 'a difference larger than plausible chance', 'is 52 % vs 48 % a real difference?'],
        ],
      ),
    ]),
    sec('why_it_matters', [
      p(
        'Misreading a conditional probability is the single most common reasoning error in quantitative aptitude tests, and it is exactly the error the official methodology exercise punishes when it asks about sample size and significance. Base-rate neglect also produces confident, wrong conclusions in reports — which is what level 5 and 6 items test with critique-style questions.',
      ),
      mis('“80 % of people with the condition test positive, so 80 % of positives have the condition.”', 'Those are two different denominators. Reverse the conditioning by counting, never by swapping the numbers.'),
    ]),
    sec('prerequisites', [
      p('Ratio and percentage reasoning (L01), and the ability to read counts from a table (L03). Probability is counting with a denominator; if ratios are shaky, nothing here will be stable.'),
    ]),
    sec('core_knowledge', [
      p('**Relative frequency**: the probability of an event is the count of favourable outcomes divided by the count of all equally likely outcomes.'),
      f('P(A) = \\frac{\\text{favourable outcomes}}{\\text{all outcomes}}, \\qquad P(\\text{not } A) = 1 - P(A)'),
      p('**Complement shortcut**: for "at least one", compute the probability of "none" and subtract from 1. This is almost always faster than adding the cases.'),
      p('**Conditional probability in counts.** For $P(A \\mid B)$ — the probability of A, given that B happened — the denominator is the number of B cases, not the whole population:'),
      f('P(A \\mid B) = \\frac{n(A \\text{ and } B)}{n(B)}'),
      p('**Natural frequencies beat percentages.** If 4 000 people are examined, 5 % carry a condition and 80 % of those show a marker: 200 carry it, 160 show the marker. Any question about the marker is answered by writing these counts next to each other.'),
      p('**Mean, median, spread.** The mean is the balance point and is pulled by extreme values; the median is the middle value and is not. A single outlier can leave the median almost unchanged — that is why the two together describe a distribution better than either alone.'),
      p('**Sampling and significance, as reasoning rather than formula.** A sample can support a conclusion only for the population it was drawn from; a difference between two groups is "significant" when it is larger than chance variation could plausibly produce. Increasing the sample size shrinks chance variation but does **not** repair a biased selection — a point the official material makes indirectly when it asks what a case study can show.'),
    ]),
    sec('visual_intuition', [
      fig(
        {
          kind: 'table',
          title: 'Counting first, percentages second',
          headers: ['Group', 'Count', 'of which marker present'],
          rows: [
            ['has the condition', 200, 160],
            ['does not have it', 3800, 190],
            ['total', 4000, 350],
          ],
        },
        'A 2 × 2 count table makes reversal errors almost impossible: the row for "marker present" has 350 people, of whom 160 have the condition — about 46 %, not 80 %.',
      ),
      fig(
        {
          kind: 'bar_chart',
          title: 'Where probability questions hide',
          xLabel: 'outcome',
          yLabel: 'reported value',
          categories: ['P(A)', 'P(not A)', 'P(A|B)'],
          series: [{ name: 'example', values: [0.3, 0.7, 0.45], color: '#7c3aed' }],
        },
        'The three quantities are structurally different: a probability, its complement, and a probability restricted to a subgroup. Reading which one the stem asks for is the whole skill.',
      ),
      intuition(
        'Imagine a room of 4 000 people. Probability questions stop being abstract the moment you draw the sub-group as an actual group of people, and "given that" becomes "walk over to this group and stand in it". The denominator is the room you are standing in.',
      ),
    ]),
    sec('worked_example', [
      p('In a study population of 4 000 people, 5 % have a condition. Among those with the condition, 80 % show a marker. A person is chosen at random and shows the marker. A report claims: "80 % of people with the marker have the condition." Is that right?'),
      steps([
        'Count the condition group: $0{,}05 \\cdot 4000 = 200$ people.',
        'Marker among them: $0{,}8 \\cdot 200 = 160$.',
        'The remaining $3800$ people do not have the condition; suppose the marker is present in 5 % of them: $0{,}05\\cdot3800 = 190$.',
        'Everyone with the marker: $160 + 190 = 350$.',
        '$P(\\text{condition} \\mid \\text{marker}) = \\tfrac{160}{350} \\approx 46\\ \\%$, not 80 %.',
        'Read the conclusion back: the report reversed the conditioning. With a rare condition, most marker-carrying people do not have it — the base rate dominates.',
      ]),
      mis('Swapping $P(A\\mid B)$ and $P(B\\mid A)$ as if they were the same number.', 'They share a numerator but not a denominator. Write the two counts; the difference is visible immediately.'),
    ]),
    practice('guided_practice', [p('Work with counts, not percentages. For every item, write the two numbers (favourable, total) before dividing, and use the complement whenever the stem says "at least one" or "none".')], ['C04.prob', 'C04.conditional'], [1, 2]),
    practice('independent_practice', [p('Now with the mean/median contrast: check for an extreme value first, then decide whether the mean or the median answers the question.')], ['C04.mean', 'C04.prob'], [2, 3]),
    practice('transfer', [p('Sampling, bias and significance items: these are verbal, so the work is reading precisely. Ask “what population was sampled?” and “what would chance alone produce?” before judging a claim.')], ['C04.sampling', 'C04.conditional'], [4, 5]),
    practice('dmat_style', [p('Exam-style items that combine a count table with a claim about the result — the pattern of the official data-and-methods questions.')], ['C04.mean', 'C04.prob', 'C04.conditional', 'C04.sampling'], [5, 6]),
    sec('trick_misconception', [
      mis('“The mean is the typical value.”', 'With an extreme value the mean is nobody’s value. Report the median when the distribution is skewed — and always look at the outlier before choosing.'),
      mis('“A bigger sample makes any study valid.”', 'Size reduces chance variation; it cannot fix a biased selection. A large biased sample is confidently wrong.'),
      mis('“Independence means unrelated.”', 'Independence is a precise statement about probabilities: the conditional probability equals the unconditional one.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool, including one base-rate item and one sampling-judgement item. Mastery: no reversed-conditioning error and no outlier-blind choice of average. Target 80 %.')],
      ['C04.mean', 'C04.prob', 'C04.conditional', 'C04.sampling'],
      [1, 2, 3, 4, 5, 6, 7],
    ),
  ],
);
