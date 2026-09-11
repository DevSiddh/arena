import { fig, intuition, lesson, mis, p, practice, sec, steps, t } from './helpers';

export const L12 = lesson(
  'L12',
  'D12',
  'Social-science reasoning: confounding, selection and what a measure really measures',
  'Reading a study the way a reviewer reads it — alternative explanations first, claims second.',
  ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
  45,
  [
    sec('what_is_it', [
      p(
        'Three questions decide whether a social-science finding deserves belief: could something *else* explain the pattern (confounding)?, was the group studied a fair sample of the claim’s scope (selection)?, and does the measure actually capture the concept it names (operationalisation)?',
      ),
      p('A fourth question concerns level: does a pattern that holds for averages also hold for individuals? Very often it does not.'),
    ]),
    sec('why_it_matters', [
      p(
        'The official methodology exercise rewards exactly this habit: it asks what a described result can support and punishes claims that are wider than the design. Social sciences and humanities are named on the official field list, and this reasoning transfers to any passage-based item about a study.',
      ),
      mis('“If the study is small, the result is meaningless.”', 'Size limits precision, not necessarily validity. A small well-controlled study can establish that an effect exists; it cannot establish how large it is in a population.'),
    ]),
    sec('prerequisites', [
      p('Sampling and significance vocabulary (L04) and the relationship-versus-mechanism distinction from L11.'),
      t(
        ['Threat', 'What it looks like', 'The repair'],
        [
          ['Confounding', 'a third factor moves with both', 'control, match, or randomise'],
          ['Selection', 'the group is special in a relevant way', 'define and sample the population'],
          ['Survivorship', 'only the survivors are observed', 'include the drop-outs'],
          ['Operationalisation', 'the measure misses the concept', 'state what the number records'],
          ['Level confusion', 'aggregate pattern read as individual', 'ask what level the data is at'],
        ],
      ),
    ]),
    sec('core_knowledge', [
      p('**Confounding.** A confounder is a variable related to both the supposed cause and the outcome. If richer districts both adopt a programme and have higher graduation rates, the programme’s effect cannot be read off the comparison. The reasoning move is: *name a plausible third factor and check whether the design rules it out*.'),
      p('**Selection and survivorship.** Conclusions inherit the quirks of who was observed. Firms that survived a recession are not a random sample of firms; patients who completed a programme are not a random sample of patients. The repair is to define the population first and then sample it — not to describe the available data and hope.'),
      p('**Operationalisation.** Every concept becomes a measuable proxy: "well-being" becomes a survey score, "productivity" becomes output per hour. Two studies can disagree while both being correct, because their proxies differ. Items often ask which criticism a measure invites.'),
      p('**Level of analysis.** "Countries with more doctors have higher life expectancy" is a statement about countries. It does not license the statement that individuals with more doctors live longer — an individual’s life expectancy depends on the country system, not on a per-person count of doctors.'),
      p('**What follows from a finding.** A careful report states the effect size, the population, the design and the limits. A sentence is over-strong when it drops any of these — the most common error the official methodology questions punish.'),
    ]),
    sec('visual_intuition', [
      fig(
        {
          kind: 'blob_diagram',
          caption: 'A confounder bends the arrow',
          nodes: [
            { id: 'x', label: 'programme (X)', x: 12, y: 25 },
            { id: 'y', label: 'outcome (Y)', x: 78, y: 25 },
            { id: 'c', label: 'district wealth (confounder)', x: 45, y: 80 },
          ],
          edges: [
            { from: 'x', to: 'y', label: 'observed link' },
            { from: 'c', to: 'x', label: '' },
            { from: 'c', to: 'y', label: '' },
          ],
        },
        'The observed link between X and Y is real as a correlation, but part of it may be produced by C. Controlling for C is what turns a correlation into evidence about X.',
      ),
      intuition(
        'Before believing an effect, stand in the shoes of a sceptical reviewer and ask: "what else could produce this pattern with exactly the same data?" If you can name such a factor and the design cannot rule it out, the claim must be weakened — and that sentence is usually the correct option.',
      ),
    ]),
    sec('worked_example', [
      p('A survey finds that employees who attended a company training programme are promoted 40 % more often over three years than those who did not. The report concludes: "the programme increases promotion chances". Which assessment is methodologically strongest?'),
      steps([
        'Identify the design: an observational comparison of volunteers versus non-participants.',
        'Name the most plausible alternative explanations: motivation (those who attend may be ambitious anyway), role (some jobs offer more promotion routes), and supervisor selection (managers may nominate promising staff).',
        'Check what the design does: nothing here controls for any of them — the groups differ in ways that matter before the programme starts.',
        'Weaken the claim accordingly: the pattern is consistent with an effect of the programme but does not establish one; a matched comparison or a randomised design would be needed.',
        'Keep the strength in the wording of the answer: "not established" is the claim, not "the programme does nothing".',
      ]),
      mis('Answering “the study proves nothing”.', 'It shows an association, which is a legitimate finding. The error is the causal wording, not the data.'),
    ]),
    practice('guided_practice', [p('Name the threat in short scenarios: confounding, selection, survivorship, operationalisation or level. One sentence per item, with the variable that causes it.')], ['C12.confound', 'C12.selection'], [1, 2]),
    practice('independent_practice', [p('Operationalisation and level items. Ask what the number actually records, and about whom the conclusion is being drawn.')], ['C12.operational', 'C12.level'], [2, 3]),
    practice('transfer', [p('Mixed passages with two plausible threats; identify which one the design *cannot* rule out, and which the study has already handled.')], ['C12.confound', 'C12.selection', 'C12.level'], [4, 5]),
    practice('dmat_style', [p('Exam-style critique items: a study summary plus a claim, and options that vary only in the strength and scope of the conclusion.')], ['C12.confound', 'C12.operational', 'C12.level'], [5, 6]),
    sec('trick_misconception', [
      mis('Treating "no evidence of an effect" as "evidence of no effect".', 'An underpowered design cannot establish absence. The two statements are not symmetric.'),
      mis('Believing a control group removes every alternative explanation.', 'Controls handle the factors they were matched on; unmatched confounders remain.'),
      mis('Confusing statistical significance with practical importance.', 'A tiny effect can be statistically significant in a huge sample and irrelevant in practice.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool. Target 80 %, and in every critique item the answer must name the threat and the repair — not merely sound sceptical.')],
      ['C12.confound', 'C12.selection', 'C12.operational', 'C12.level'],
      [1, 2, 3, 4, 5, 6],
    ),
  ],
);
