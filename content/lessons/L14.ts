import { fig, intuition, lesson, mis, p, practice, sec, steps, t } from './helpers';

export const L14 = lesson(
  'L14',
  'D14',
  'Experimental and scientific reasoning: controls, bias and the strength of evidence',
  'How an experiment earns a conclusion — and which conclusions a described study has not earned.',
  ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
  45,
  [
    sec('what_is_it', [
      p(
        'An experiment is a comparison with a purpose: one group experiences the condition, another does not, and everything else is kept as equal as the design allows. This lesson covers the four devices that make such a comparison meaningful — a control group, randomisation, blinding, and replication — and the reading skill of saying exactly what the resulting data establishes.',
      ),
      p('"Natural sciences" and "engineering" are named on the official field list, and the official material requires interpreting technical setups. The reasoning here is the same as in the demonstrated critique items, applied to experiments.'),
    ]),
    sec('why_it_matters', [
      p(
        'Level 5 and 6 items very often present a described procedure and ask which criticism is justified. Being able to distinguish "the design cannot show this" from "the design is bad" is the discriminating skill — the first is a limitation, the second is a judgement the evidence rarely supports alone.',
      ),
      mis('“An experiment without randomisation is worthless.”', 'It is weaker evidence, not no evidence. Quasi-experiments with matched groups can still support conclusions — with an explicit caveat.'),
    ]),
    sec('prerequisites', [
      p('Confounding and selection (L12) and sampling language (L04).'),
      t(
        ['Device', 'What it protects against', 'What it does not fix'],
        [
          ['Control group', 'the passage of time and external trends', 'unmatched differences between the groups'],
          ['Randomisation', 'selection differences, known and unknown', 'small samples, measurement error'],
          ['Blinding', 'expectation effects', 'an unrepresentative sample'],
          ['Replication', 'chance results in a single run', 'a systematically biased procedure'],
        ],
      ),
    ]),
    sec('core_knowledge', [
      p('**Controls.** The comparison group must differ from the treatment group *only* in the treatment. Anything else that differs is a candidate explanation for the result.'),
      p('**Randomisation** is the design device that makes the groups comparable in expectation — including with respect to factors nobody thought to measure. This is why it is stronger than matching, which only controls the factors you knew about.'),
      p('**Blinding and placebo effects.** When participants or assessors know who received the treatment, expectations can move the measurements themselves. Blinding (single or double) removes that pathway from the explanation.'),
      p('**Replication.** A single measurement cannot distinguish an effect from an accident. Repetition on independent material is what turns a result into evidence; a "reproduction" that reuses the same data or the same laboratory adds much less.'),
      p('**The weight of evidence.** Strong conclusions require: a comparison, a plausible mechanism, a consistent pattern across replications, and an effect larger than measurement noise. Each missing element weakens the wording the report is allowed to use — this is the judgement most level 6 items test.'),
      p('**Measurement caveat.** Measurement error attenuates relationships: a noisy instrument makes a real effect look smaller, not larger. So "no effect found" may reflect a blunt instrument rather than an absent effect.'),
    ]),
    sec('visual_intuition', [
      fig(
        {
          kind: 'table',
          title: 'What each design can claim',
          headers: ['Design', 'Comparison', 'Reasonable claim'],
          rows: [
            ['before / after (one group)', 'same group over time', 'the value changed — nothing about why'],
            ['two groups, not randomised', 'between groups', 'the groups differ — with caveats about selection'],
            ['randomised controlled trial', 'random groups', 'the treatment plausibly caused the difference'],
            ['repeated independent trials', 'across studies', 'the effect is reproducible, not a chance result'],
          ],
        },
        'The claim column is the examinable content: each design earns a different verb (changed / differ / caused / reproducible).',
      ),
      intuition(
        'Think of each design device as closing one door through which a sceptical explanation could enter. A control closes the "things change anyway" door; randomisation closes the "the groups were different to begin with" door; blinding closes the "people expected it" door; replication closes the "it was luck" door. An item that asks for the strongest criticism is asking which door is still open.',
      ),
    ]),
    sec('worked_example', [
      p('A team tests a new fertiliser: 30 plants receive it, 30 plants of the same species receive nothing, and all are grown in the same greenhouse. The fertilised plants grow on average 12 % taller. The report claims: "the fertiliser increases plant height, and will increase yields in the field by about 12 %." Which criticism is strongest?'),
      steps([
        'Assess the design: there is a control group and a shared environment, so the greenhouse comparison is reasonably strong.',
        'Ask what the comparison supports: a difference in height between treated and untreated plants under these conditions.',
        'Inspect the second claim: a 12 % height change in a greenhouse does not imply a 12 % *yield* change in field conditions, where soil, pests, weather and spacing differ.',
        'Name the failure precisely: the report transferred a result to a new context and to a different quantity, beyond the design’s scope.',
        'Keep what is defensible: the height difference in this trial is evidence of an effect on height; yield in the field requires its own trial.',
      ]),
      mis('Criticising the sample size when the real problem is the scope of the claim.', 'Sample size affects precision. The claim here over-reaches to a new context and a new quantity — the stronger criticism.'),
    ]),
    practice('guided_practice', [p('Identify the control group and the single thing that differs in short descriptions. If you cannot name them, the description is not an experiment.')], ['C14.control', 'C14.replicate'], [1, 2]),
    practice('independent_practice', [p('Randomisation, blinding and measurement-error items. Say which door each device closes, and which remains open.')], ['C14.bias', 'C14.control'], [2, 3]),
    practice('transfer', [p('Claim-strength items: given a study and four conclusions of different strength, pick the one the design earned.')], ['C14.conclude', 'C14.bias'], [4, 5]),
    practice('dmat_style', [p('Exam-style items where two criticisms are true but one is stronger — judged by whether it invalidates the *stated* conclusion.')], ['C14.control', 'C14.replicate', 'C14.conclude'], [5, 6]),
    sec('trick_misconception', [
      mis('“The result was statistically significant, so the effect is large.”', 'Significance is about detectability, not size. Always ask for the effect size.'),
      mis('“Repeating the measurement in the same run is replication.”', 'Replication means an independent repetition — new material, ideally a new setting or team.'),
      mis('“A control group proves causation.”', 'It removes some alternative explanations. Whether causation is established depends on the whole design, including randomisation.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool. Target 80 %: in every item, identify the comparison and the claim, then decide which criticism would actually change the conclusion.')],
      ['C14.control', 'C14.bias', 'C14.replicate', 'C14.conclude'],
      [1, 2, 3, 4, 5, 6],
    ),
  ],
);
