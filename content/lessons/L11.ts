import { f, fig, intuition, lesson, mis, official, p, practice, sec, steps, t } from './helpers';

export const L11 = lesson(
  'L11',
  'D11',
  'Research methodology: strategies, phases and design decisions',
  'The official Exercise 4 domain — what quantitative and qualitative research can each show, and how a project is actually built.',
  ['OFFICIAL_SAMPLE', 'PREREQUISITE'],
  75,
  [
    sec('what_is_it', [
      p(
        'The official research-methods input describes how empirical work is done: a research question, a strategy (quantitative or qualitative), a research design, data collection, analysis, and the reporting of results. It also describes an ideal-typical *linear* process with four phases and warns that the real process is often *circular* — you go back and revise.',
      ),
      p(
        'The questions on it are not about statistics. They ask you to classify a described study, to decide which strategy fits a stated question, to judge whether a design change is permissible, and to say what a result can and cannot claim. That is why this lesson is verbal: the skill is precise reading, not calculation.',
      ),
      official('EX4', 'The official exercise on strategies and phases, including the four phases of a research project, the deductive/inductive contrast, the linear-versus-circular distinction, and the note that modifications to a quantitative project are permissible but may damage comparability.'),
    ]),
    sec('why_it_matters', [
      p(
        'This is a demonstrated domain with a lot of official text, which means the examiners consider it central. It is also the domain where language precision pays most: statements that differ by one word ("deduce" versus "derive", "generalise" versus "transfer", "cause" versus "mechanism") are the entire question.',
      ),
      t(
        ['Question asked', 'Strategy that fits', 'Why'],
        [
          ['How many / how strongly / does X affect Y?', 'quantitative', 'measurement and comparison'],
          ['Why, how, in whose words?', 'qualitative', 'meaning and mechanism'],
          ['Which route does X take to Y?', 'both — mixed design', 'effect plus mechanism'],
          ['Does a rule from theory hold here?', 'deductive', 'theory first, then test'],
          ['What rule emerges from this material?', 'inductive', 'observation first, then rule'],
        ],
        'Matching question to strategy is the most frequently tested judgement in this domain.',
      ),
    ]),
    sec('prerequisites', [
      p('Sampling and significance vocabulary (L04) and the ability to read a passage for qualifiers. Precision words to watch: *all, some, only, must, may, always, generalisable, transferable*.'),
    ]),
    sec('core_knowledge', [
      p('**Quantitative strategy.** Works with numbers and standardised instruments; aims at measuring, comparing and (where the design allows) explaining by testing hypotheses. Its output is a measured difference or relation, with an assessment of whether it exceeds chance variation.'),
      p('**Qualitative strategy.** Works with text, images, interviews or observation; aims at understanding processes, meanings and mechanisms. Its output is a described pattern or mechanism, valid for the cases studied — not a frequency claim about a population.'),
      p('**Deductive and inductive.** Deductive research derives a testable expectation from an existing theory and then confronts it with data. Inductive research starts from the material and develops concepts or rules from it.'),
      f('\\text{theory} \\rightarrow \\text{hypothesis} \\rightarrow \\text{data} \\quad\\text{(deductive)} \\qquad \\text{data} \\rightarrow \\text{pattern} \\rightarrow \\text{theory} \\quad\\text{(inductive)}'),
      p('**Linear ideal versus circular practice.** The ideal-typical project runs through four phases in order: (1) formulate the problem and questions, (2) plan the design and instruments, (3) collect the data, (4) analyse and report. In practice the process loops — analysis reveals a gap in phase 1 or 2, and the researcher goes back.'),
      p('**Causal relationship versus causal mechanism.** A relationship answers *whether* two quantities move together (and how strongly); a mechanism answers *why* — through which steps the effect passes. A quantitative design is strong on the first; a qualitative design is strong on the second; a mixed design is needed for both.'),
      p('**Design changes.** The official material states that changes during a quantitative project are permissible but can damage the significance or comparability of the results. The methodological demand is therefore: document the change, and report the consequence. Blanket rejection of any change is over-strict; hiding it is worse.'),
      p('**Generalisation versus transferability.** Quantitative results claim generalisation to a population defined by the sampling; qualitative findings are transferable to similar cases, with the reader judging how similar the new context is. Using the wrong word is the standard distractor.'),
    ]),
    sec('visual_intuition', [
      fig(
        {
          kind: 'flowchart',
          title: 'The four phases of a research project',
          steps: [
            '1 · problem and questions (what exactly is to be found out?)',
            '2 · design and instruments (how will it be measured or explored?)',
            '3 · collection (who, when, how many?)',
            '4 · analysis and report (what follows, and what does not?)',
          ],
        },
        'The official four phases. A circular process is one where the arrows also run backwards — from analysis back to the questions. Neither is a mistake; they serve different aims.',
      ),
      fig(
        {
          kind: 'blob_diagram',
          caption: 'Where each strategy is strong',
          nodes: [
            { id: 'q', label: 'question', x: 10, y: 50 },
            { id: 'quant', label: 'quantitative: how much?', x: 50, y: 20 },
            { id: 'qual', label: 'qualitative: why?', x: 50, y: 80 },
            { id: 'rel', label: 'relationship (whether)', x: 88, y: 20 },
            { id: 'mech', label: 'mechanism (how)', x: 88, y: 80 },
          ],
          edges: [
            { from: 'q', to: 'quant', label: 'measure' },
            { from: 'q', to: 'qual', label: 'understand' },
            { from: 'quant', to: 'rel' },
            { from: 'qual', to: 'mech' },
            { from: 'rel', to: 'mech', label: 'mixed design links them', dashed: true },
          ],
        },
        'The dashed link is the point of a mixed design: the survey establishes the relationship, the interviews open the mechanism, and neither alone answers both parts of the question.',
      ),
      intuition(
        'Read every methodology stem twice, once for the *question* and once for the *claim*. Most wrong options are not absurd; they are claims that would be right for a different question — a prevalence claim from an interview study, or a mechanism claim from a correlation.',
      ),
    ]),
    sec('worked_example', [
      p('A researcher wants to know whether a mentoring programme raises the proportion of apprentices who complete their training, and *how* mentors influence that decision. She plans a survey of 800 apprentices with a matched comparison group, plus interviews with 20 apprentices. Which description of this project is methodologically correct?'),
      steps([
        'Separate the two questions: "whether / how many" (completion rate) and "how" (the influence process).',
        'Match strategies: the survey with a comparison group addresses the rate question; the interviews address the mechanism question.',
        'Name the design: it is mixed, and the sequencing (survey then interviews) makes it an explanatory sequential design in which the qualitative part explains the quantitative result.',
        'Check the claims the design supports: the survey supports statements about the completion rate in the sampled population (with the usual caveat about the comparison group); the interviews support statements about mechanisms in those cases, not about prevalence.',
        'Reject options that swap those two claim types, or that call the interviews a weakness — they are part of the answer to the second question.',
      ]),
      mis('“A mixed design is just two unrelated studies.”', 'A mixed design is justified precisely when the question has both a rate and a mechanism component. The distractor built from the words "two unrelated studies" is wrong.'),
    ]),
    practice(
      'guided_practice',
      [p('Classify short scenarios: quantitative, qualitative, deductive, inductive. For each, name the single word in the stem that decided it.')],
      ['C11.qtypes', 'C11.dedind'],
      [1, 2],
    ),
    practice(
      'independent_practice',
      [p('Phases, linear versus circular, and documentation. These items turn on whether a described change is *documented and reported* — not on whether a change happened.')],
      ['C11.phases', 'C11.linear', 'C11.document'],
      [2, 3],
    ),
    practice(
      'transfer',
      [p('Relationship versus mechanism, generalisation versus transferability, and mixed designs. Decide what the described result can support before reading the options.')],
      ['C11.relmech', 'C11.general', 'C11.mixed'],
      [4, 5],
    ),
    practice(
      'dmat_style',
      [p('Exam-style methodology items: a proposal to assess, several defensible-sounding judgements, and exactly one that respects both the question and the design.')],
      ['C11.qtypes', 'C11.mixed', 'C11.general', 'C11.document', 'C11.relmech'],
      [5, 6],
    ),
    sec('trick_misconception', [
      mis('“Qualitative research is unscientific.”', 'It answers a different question with a different logic. It is the wrong tool for a prevalence claim, and the right tool for a mechanism claim.'),
      mis('“Any change to a study invalidates it.”', 'Documented changes with reported consequences are permitted; hidden changes are the methodological failure.'),
      mis('“A correlation proves a cause.”', 'It establishes a relationship. Causality needs the design to exclude alternatives, and the mechanism needs the process evidence.'),
      mis('“Generalisation and transferability are synonyms.”', 'Generalisation is a claim about a population defined statistically; transferability is a reasoned judgement about similarity to another context.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool over the whole domain, including at least two level 6 items. Mastery: strategy matched to question, claim strength matched to design, and no swapped vocabulary. Target 85 %.')],
      ['C11.qtypes', 'C11.dedind', 'C11.relmech', 'C11.phases', 'C11.linear', 'C11.document', 'C11.general', 'C11.mixed'],
      [1, 2, 3, 4, 5, 6, 7],
    ),
  ],
);
