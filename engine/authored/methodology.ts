import { Q, statements, type AuthoredSpec } from './helpers';
import type { Question } from '../types';

/**
 * Authored questions for the two verbal domains:
 *   D11 Research Methodology & Design      — OFFICIAL_SAMPLE (Exercise 4, 6 questions)
 *   D12 Social-Science Reasoning & Causal Inference — OFFICIAL_FIELD_LIST + extension
 *
 * None of the official question texts is reproduced. The items below train the same
 * reasoning moves with new content: label↔definition mapping, relationship vs. mechanism,
 * permitted vs. forbidden design changes, scenario judgement, mixed-design construction,
 * and recognising a design description without its label.
 */

/** Small helper for the near-identical explanation skeletons of this domain. */
function method(id: string, opts: {
  stem: string;
  options: AuthoredSpec['options'];
  correct: AuthoredSpec['correct'];
  difficulty: AuthoredSpec['difficulty'];
  concept: string[];
  testing: string;
  matters: string;
  irrelevant?: string;
  why: string;
  steps: string[];
  trap: string;
  transfer: string;
  hints: string[];
  style?: AuthoredSpec['style'];
  move?: AuthoredSpec['cognitiveMove'];
  reasoning?: AuthoredSpec['reasoningType'];
  label?: AuthoredSpec['label'];
  tags?: string[];
  figure?: AuthoredSpec['figure'];
}): Question {
  return Q({
    id,
    domainId: id.startsWith('a12') ? 'D12' : 'D11',
    conceptIds: opts.concept,
    label: opts.label ?? 'OFFICIAL_SAMPLE',
    stem: opts.stem,
    options: opts.options,
    correct: opts.correct,
    difficulty: opts.difficulty,
    reasoningType: opts.reasoning ?? 'conceptual_discrimination',
    cognitiveMove: opts.move ?? 'classify_situation',
    style: opts.style ?? 'statement_compare',
    hints: opts.hints,
    figure: opts.figure,
    tags: opts.tags,
    explanation: {
      testing: opts.testing,
      matters: opts.matters,
      irrelevant: opts.irrelevant,
      concept: `Concept: ${opts.concept.join(', ')}`,
      why: opts.why,
      steps: opts.steps,
      distractorWhy: opts.options.map((o) => o.why),
      trap: opts.trap,
      transfer: opts.transfer,
    },
  });
}

/* ================================================================== */
/* D11 — definitions and labels (the official Exercise 4 territory)   */
/* ================================================================== */

const a11_01 = method('a11-01', {
  stem: 'How can the following sentence be completed correctly? “The deductive research strategy …”',
  options: statements(
    [
      { text: '… requires a fixed sample size that is the same in every research design.', tag: 'overprecision', why: 'Sample size depends on the methodological parameters and the statistical procedure; nothing in the strategy fixes a number.' },
      { text: '… focuses on identifying causal mechanisms, that is, the process between cause and outcome.', tag: 'label_confusion', why: 'Mechanisms are the territory of the inductive/qualitative strategy; the deductive strategy is concerned with relationships between factors.' },
      { text: '… examines the relation between factors and outcomes.', why: 'Correct: the deductive (quantitative, theory-testing) strategy asks whether a factor relates to an outcome.' },
      { text: '… shows how and why certain conditions influence causes and effects in single cases.', tag: 'label_confusion', why: 'This describes single-case, mechanism-oriented work — the inductive strategy.' },
    ],
    2,
  ).options,
  correct: 2,
  difficulty: 1,
  concept: ['C11.dedind', 'C11.relmech'],
  testing: 'Attaching the right goal to the label “deductive”.',
  matters: 'The pairing: deductive = quantitative = theory testing = relationships between factors and outcomes.',
  why: 'A deductive design starts from a general expectation (a theory or hypothesis) and tests it against data, which is why its target is the relationship itself.',
  steps: [
    'Recall the official pairing: quantitative ↔ deductive ↔ theory testing ↔ causal relationship.',
    'Contrast it with qualitative ↔ inductive ↔ theory generating ↔ causal mechanism.',
    'Option C states a relationship claim and nothing more, so it matches the deductive strategy.',
  ],
  trap: 'Mixing up the two labels because both are described with the words “cause” and “effect”.',
  transfer: 'Whenever a text says “deductive”, “quantitative”, “theory testing”, “hypothesis”, or “significance”, the same cluster of expectations applies.',
  hints: ['Ask what this strategy wants to establish, not how it collects data.', 'Mechanism questions (“how?”) belong to the other strategy.'],
});

const a11_02 = method('a11-02', {
  stem: 'Which statement applies to the inductive research strategy?',
  options: statements(
    [
      { text: 'It is crucial to make statistically proven statements about how widely results are transferable.', tag: 'scope_error', why: 'Statistical statements about spread are exactly what this strategy cannot deliver: single or few cases say nothing about how common a mechanism is.' },
      { text: 'It is crucial to examine in which way certain factors bring about certain outcomes.', why: 'Correct: the inductive strategy aims at causal mechanisms — the process between cause and outcome.' },
      { text: 'It can only ever examine a single case; two or more cases are excluded by definition.', tag: 'overprecision', why: 'Single-case studies are typical, but a few cases are equally admissible; the strategy is not defined by an absolute limit of one.' },
      { text: 'It provides proof of how widespread the mechanisms it finds actually are.', tag: 'scope_error', why: 'This inverts the weakness of the strategy: it explains a mechanism but cannot quantify its prevalence.' },
    ],
    1,
  ).options,
  correct: 1,
  difficulty: 1,
  concept: ['C11.dedind', 'C11.relmech', 'C11.general'],
  testing: 'The defining purpose of the inductive/qualitative strategy, and the boundary of what it can claim.',
  matters: 'The mechanism orientation and the explicit limit (“does not provide information about how widespread these conditions are”).',
  why: 'The strategy generates theory from close observation of one or a few cases; the price of that depth is the loss of statements about distribution.',
  steps: [
    'Match “inductive/qualitative” with “how and why something happens”.',
    'Check every option against the known limitation: no prevalence claims.',
    'Option B states the mechanism goal without over-claiming spread.',
  ],
  trap: 'Two distractors look attractive because they sound rigorous — but statistical transferability is precisely what this strategy lacks.',
  transfer: 'The same boundary applies in qualitative social research, in case-study engineering reports and in single-patient medical case studies.',
  hints: ['Separate “how does it happen?” from “how often does it happen?”.', 'One of the four options claims more than the strategy can deliver.'],
});

const a11_03 = method('a11-03', {
  stem: 'A research team studies how job seekers interpret rejection letters. During the interviews the first respondents turn out to be unusually confident about their prospects, and this changes what the team is interested in. Which statement about proceeding is correct?',
  options: statements(
    [
      { text: 'In a qualitative project the research question may be reformulated during the process, provided the changes are documented.', why: 'Correct: qualitative projects may include circular elements, so questions and preconceptions can be revised if the revision is recorded.' },
      { text: 'In a qualitative project changes are permitted but never have to be documented, because the process is open by design.', tag: 'definition_misuse', why: 'Openness is not the same as transparency-free: the official text requires changes to be clearly explained and documented in both traditions.' },
      { text: 'The team must keep the original question unchanged, otherwise the study is not qualitative.', tag: 'label_confusion', why: 'Refusing change would impose the linear logic of the quantitative strategy onto a qualitative project.' },
      { text: 'The team may change the question, but the change means the study automatically becomes quantitative.', tag: 'definition_misuse', why: 'One design decision does not convert a study from one tradition into the other; the two differ in a whole cluster of decisions.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 2,
  concept: ['C11.linear', 'C11.document'],
  testing: 'What a circular research process permits, and which obligation survives the permission.',
  matters: 'The two facts together: change is allowed, and documentation is mandatory.',
  why: 'Circularity means phases may be revisited, so shifting the question mid-study is legitimate; documentation is what keeps the study assessable.',
  steps: [
    'Identify the tradition: interviews with a few respondents and revised interest ⇒ qualitative.',
    'Recall the rule for that tradition: circular elements, changes allowed if documented.',
    'The only option containing both parts of the rule is the correct one.',
  ],
  trap: 'Choosing a statement that either forbids change (imposing quantitative logic) or waives documentation (over-applying openness).',
  transfer: 'The same pair — permission plus documentation duty — recurs in agile engineering processes, clinical protocols and audit trails.',
  hints: ['Look for the option that grants the freedom and keeps the obligation.', 'Which of the four options would a reviewer accept as an audit trail?'],
});

const a11_04 = method('a11-04', {
  stem: 'Which approach most clearly contradicts the ideal-typical process of a quantitative research project?',
  options: statements(
    [
      { text: 'A survey is planned with 600 randomly chosen respondents; after the first wave the researchers document that a subgroup is under-represented and specify in advance how the second wave will correct this.', tag: 'sufficient_necessary_confusion', why: 'This is a documented, pre-specified change and therefore does not contradict the ideal-typical process.' },
      { text: 'During a quantitative study the hypothesis is reformulated *after* seeing the results, so that it fits the data.', why: 'Correct: in the ideal-typical quantitative process hypotheses are fixed before analysis; retrofitting them to the data destroys the logic of testing.' },
      { text: 'A quantitative project is extended by one additional measurement instrument that the design already provided for.', tag: 'sufficient_necessary_confusion', why: 'Using a planned instrument is normal practice, not a contradiction.' },
      { text: 'A quantitative study reports its changes to the sample in the methods section.', tag: 'sufficient_necessary_confusion', why: 'Documenting changes is exactly what the official text demands, so it is compliant behaviour.' },
    ],
    1,
  ).options,
  correct: 1,
  difficulty: 4,
  concept: ['C11.linear', 'C11.document', 'C11.phases'],
  testing: 'Judging realistic scenarios against the ideal-typical quantitative sequence, with the phrase “most clearly”.',
  matters: 'The timing of the hypothesis relative to the data: before analysis (procedural) versus after the results (retrofit).',
  why: 'A hypothesis tested on the data that produced it can no longer be falsified by those data, which removes the point of the quantitative procedure.',
  steps: [
    'Reduce each option to its decisive property: when was the decision taken, and was it documented?',
    'Changes that are documented and pre-specified are permitted; changes made to accommodate results are not.',
    'Only option B adjusts the core claim after seeing the outcome.',
  ],
  trap: 'Being distracted by the size or complexity of a scenario instead of asking when the decision was made.',
  transfer: 'The same test applies to pre-registration discussions in empirical economics, A/B test peeking in industry, and audit sampling in accounting.',
  hints: ['Ask what “contradicts” means here: which action would a reviewer call data-fitting?', 'Documented, pre-planned changes are not the problem — timing is.'],
});

const a11_05 = method('a11-05', {
  stem:
    'A doctoral researcher wants to answer two questions about the largest city library: *why* young people use it, and *what* literature they are interested in. She chooses a mixed qualitative-quantitative approach. Which combination of data collections fits her two questions best?',
  options: statements(
    [
      { text: 'A discussion group with three young users and an interview with the library director.', tag: 'scope_error', why: 'Both sources are qualitative, so the question about *what literature* (a distribution) remains unanswered; the director’s view is also not the users’ literature.' },
      { text: 'An analysis of the titles in 1 000 anonymous borrowing records plus semi-structured interviews with four young users.', why: 'Correct: the records give the quantitative distribution of literature, the interviews reveal the reasons behind usage.' },
      { text: 'A count of all books borrowed (without titles) over ten days plus an interview with the largest publisher in the city.', tag: 'irrelevant_data_used', why: 'A count without titles cannot describe *which* literature; the publisher is not part of the user population being explained.' },
      { text: 'A count of the young people entering the library plus the municipal population statistics.', tag: 'irrelevant_data_used', why: 'Both sources are quantitative and neither addresses the reasons for use; population statistics describe a different population.' },
    ],
    1,
  ).options,
  correct: 1,
  difficulty: 3,
  concept: ['C11.mixed', 'C11.relmech', 'C11.general'],
  testing: 'Matching each sub-question to the strategy that can answer it, and combining them into a mixed design.',
  matters: 'Two questions with different natures: a “why” question needs mechanism data, a “what/which” question needs distributional data.',
  why: 'A mixed design is justified only when each part answers the question it is suited to; otherwise one sub-question remains unanswered regardless of the effort spent.',
  steps: [
    'Classify question 1 (“why”) as a mechanism question ⇒ qualitative data.',
    'Classify question 2 (“what literature, how many”) as a distributional question ⇒ quantitative data.',
    'Only the combination of borrowing records (distribution) and interviews (reasons) covers both.',
  ],
  trap: 'Choosing an option that merely “looks broad” — two qualitative sources or two quantitative sources cannot cover both questions.',
  transfer: 'Designing mixed studies, product research and evaluation reports all require this matching of question type to evidence type.',
  hints: ['First label each of the two research questions.', 'Then check whether the proposed data actually speaks to that label.'],
});

const a11_06 = method('a11-06', {
  stem:
    'A master’s student wants to investigate whether certain student behaviours affect productivity in seminar groups. He takes an established psychological theory as his starting point and wants to evaluate with statistical methods how far that approach applies and transfers. Which statement applies?',
  options: statements(
    [
      { text: 'The student has chosen a deductive approach.', why: 'Correct: starting from an existing theory and testing its applicability statistically is the textbook description of the deductive/quantitative strategy.' },
      { text: 'The student must above all design his study to discover causal mechanisms.', tag: 'label_confusion', why: 'Mechanism discovery is the qualitative aim; his stated interest is the scope and transferability of an existing explanation.' },
      { text: 'The student should conduct targeted individual interviews on campus instead.', tag: 'label_confusion', why: 'Interviews would serve a mechanism question; they cannot establish how far a theory holds across cases statistically.' },
      { text: 'The student cannot use statistical tests because seminar groups differ from one another.', tag: 'wrong_assumption', why: 'Heterogeneity between groups is precisely what statistical methods are designed to handle; it is not a prohibition.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 3,
  concept: ['C11.dedind', 'C11.qtypes'],
  testing: 'Recognising a deductive design from its description, without the words “deductive” or “hypothesis” appearing.',
  matters: 'The two structural features: an existing theory is the starting point, and statistical evaluation is the method.',
  why: 'Theory first, data second, and generalisation judged statistically — this ordering defines the deductive strategy.',
  steps: [
    'Note the starting point: a pre-existing theory (not one to be generated).',
    'Note the evaluation: statistical assessment of applicability.',
    'Conclude: deductive/quantitative, not inductive/qualitative.',
  ],
  trap: 'Being misled by the everyday word “behaviour”, which sounds like the psychology of individuals and therefore like qualitative work.',
  transfer: 'The same recognition exercise appears whenever a project description must be classified — in reviews, funding applications and exam scenarios.',
  hints: ['Where does the theory come from — before the study or out of it?', 'Which method is proposed for evaluation?'],
});

const a11_07 = method('a11-07', {
  stem: 'Which sequence corresponds to the four phases of a research project as described in the official preparation material?',
  options: statements(
    [
      { text: 'Data collection and analysis → research problem and question → research design → publication.', tag: 'definition_misuse', why: 'The question must come first; analysis cannot precede the design that produced the data.' },
      { text: 'Research problem and question → specification of the research design → data collection and analysis → processing (report or publication).', why: 'Correct: this is the stated order of the four phases.' },
      { text: 'Research design → research question → publication → data collection.', tag: 'definition_misuse', why: 'Publication cannot precede data collection, and a design requires a question to design for.' },
      { text: 'Research question → data collection → research design → analysis.', tag: 'definition_misuse', why: 'The design must be specified before data are collected; otherwise the collection has no sampling or instrument definition.' },
    ],
    1,
  ).options,
  correct: 1,
  difficulty: 1,
  concept: ['C11.phases'],
  testing: 'The canonical order of the four research phases.',
  matters: 'The logical dependencies: a question before a design, a design before collection, collection before processing.',
  why: 'Each phase determines a decision that the next phase executes, so reversing them breaks the justification chain of the study.',
  steps: ['Recall the four phases in order.', 'Check each option for a violated dependency.', 'The correct option preserves all three dependencies.'],
  trap: 'Treating the phases as a list to memorise rather than as a dependency chain; the distractors are orderings that were never plausible.',
  transfer: 'The same dependency logic applies to project plans, audits and software requirements engineering.',
  hints: ['Ask of each step: what must already exist before it can be done?', 'Two of the four phases are clearly reversed in every wrong option.'],
});

const a11_08 = method('a11-08', {
  stem: 'A research report states: “Our interviews with nine small firms show that trust between partners determines whether a joint venture succeeds.” Which criticism is methodologically most appropriate?',
  options: statements(
    [
      { text: 'The sample is too small for any conclusion about joint ventures.', tag: 'overprecision', why: 'A small qualitative sample can support mechanism conclusions; the problem is not the size as such.' },
      { text: 'The study can explain a mechanism, but it cannot support a claim about how widely trust determines success.', why: 'Correct: a few cases reveal how something works, not how common or influential it is across the population.' },
      { text: 'The study is worthless because it did not use statistical tests.', tag: 'sufficient_necessary_confusion', why: 'Statistical testing is a feature of the quantitative strategy, not a universal requirement for valid research.' },
      { text: 'The interviews should have been repeated after the joint ventures ended.', tag: 'wrong_assumption', why: 'Timing might matter for a specific question, but it does not address the actual weakness here, which is scope.' },
    ],
    1,
  ).options,
  correct: 1,
  difficulty: 4,
  concept: ['C11.general', 'C11.relmech'],
  testing: 'Separating a legitimate mechanism claim from an illegitimate scope claim.',
  matters: 'The wording “determines whether … succeeds” versus what nine interviews can establish.',
  why: 'Qualitative evidence supports statements about how a process works; prevalence or effect size requires a sample designed for that purpose.',
  steps: [
    'Classify the study: qualitative, nine cases ⇒ mechanism territory.',
    'Identify the claim actually made: a general determining relation.',
    'The mismatch is scope, not method quality.',
  ],
  trap: 'Criticising the method (“too small”, “no statistics”) instead of the mismatch between evidence and claim.',
  transfer: 'The same discipline applies to case studies in engineering, medical case reports and pilot evaluations before roll-out decisions.',
  hints: ['What exactly does the report claim?', 'Which kind of evidence would be needed for that exact claim?'],
});

const a11_09 = method('a11-09', {
  stem: 'Which change to a *quantitative* project is described in the official material as permissible but potentially damaging to the significance or comparability of the results?',
  options: statements(
    [
      { text: 'Changing the research question before any data are collected.', tag: 'irrelevant_data_used', why: 'At that stage nothing has been measured, so no comparability is at stake.' },
      { text: 'Modifying the measurement instrument, the sample or the collection method during the study.', why: 'Correct: such changes are not generally excluded, but they must be documented and can limit the significance or comparability of the data.' },
      { text: 'Documenting the changes made to the design.', tag: 'definition_misuse', why: 'Documentation is the requirement, not the risk.' },
      { text: 'Publishing the results of the study.', tag: 'irrelevant_data_used', why: 'Publication is the fourth phase, not a modification of the design.' },
    ],
    1,
  ).options,
  correct: 1,
  difficulty: 3,
  concept: ['C11.linear', 'C11.document'],
  testing: 'Understanding that in the quantitative tradition changes are allowed but carry a methodological price.',
  matters: 'The distinction between “permitted” and “harmless”: the official text allows changes while warning about consequences.',
  why: 'Instruments and samples define what the data mean; changing them mid-study makes parts of the data set non-comparable.',
  steps: [
    'Recall the official wording: modifications “are not generally excluded” but must be documented and considered in the analysis.',
    'Identify which option names a modification of instruments, sample or collection.',
    'Recognise that the same option is the one with the comparability risk.',
  ],
  trap: 'Believing that quantitative research forbids all changes — the material explicitly permits them.',
  transfer: 'This is the reasoning behind protocol amendments in clinical trials and change control in quality management.',
  hints: ['Which option could make two parts of a data set describe different things?', 'Which option does the official text explicitly allow?'],
});

const a11_10 = method('a11-10', {
  stem: 'A study wants to establish whether a higher degree of education *contributes to* higher income, and by which route. Which pairing of question and strategy is correct?',
  options: statements(
    [
      { text: 'The relation between education and income is a mechanism question; the route is a relationship question.', tag: 'label_confusion', why: 'The two labels are swapped: relations are about whether factor and outcome co-vary, mechanisms about the process between them.' },
      { text: 'The relation is examined deductively with a sample and statistical tests; the route is examined inductively through a few detailed cases.', why: 'Correct: this matches the official description of education → income and its mechanism.' },
      { text: 'Both questions must be answered with the same data set, otherwise the study is invalid.', tag: 'overprecision', why: 'No methodological rule states this; mixed designs routinely draw on different data sources for different sub-questions.' },
      { text: 'Neither question can be studied empirically, because income has many causes.', tag: 'wrong_assumption', why: 'Multiple causes are the normal condition of social research; they complicate, but do not preclude, empirical study.' },
    ],
    1,
  ).options,
  correct: 1,
  difficulty: 3,
  concept: ['C11.relmech', 'C11.dedind', 'C11.mixed'],
  testing: 'Applying the relationship/mechanism distinction to the example used in the official text.',
  matters: 'Two distinct questions: does a factor relate to an outcome, and how does the outcome come about.',
  why: 'The strategies differ in what they can show: statistical co-variation for the relation, detailed case analysis for the mechanism.',
  steps: [
    'Label the first question: relationship (whether).',
    'Label the second: mechanism (how).',
    'Assign the appropriate strategy to each, as the official material does.',
  ],
  trap: 'Assuming that a serious study must answer both questions with one method — mixing is a design choice, not a validity requirement.',
  transfer: 'Programme evaluation, policy analysis and clinical effectiveness research all separate “does it work?” from “why does it work?”.',
  hints: ['“Whether” and “how” are different questions with different evidence.', 'Which pair of strategies matches the two questions?'],
});

/* ================================================================== */
/* D12 — social-science reasoning and causal inference                */
/* ================================================================== */

const a12_01 = method('a12-01', {
  stem:
    'A study finds that employees who work from home report higher job satisfaction than employees who work in the office. A manager concludes: “Working from home causes higher satisfaction — let us make it mandatory.” Which criticism is methodologically strongest?',
  options: statements(
    [
      { text: 'The comparison may be confounded: employees who are allowed to work from home differ systematically from those who are not.', why: 'Correct: selection into the two groups is unlikely to be random, so the difference may reflect who gets to work from home rather than the effect of doing so.' },
      { text: 'Satisfaction is a subjective measure and therefore cannot be studied at all.', tag: 'overprecision', why: 'Subjective measures are used throughout empirical social research; the problem here is confounding, not subjectivity.' },
      { text: 'The study should have interviewed all employees instead of surveying them.', tag: 'irrelevant_data_used', why: 'Interviewing everyone would not remove the systematic difference between the two groups.' },
      { text: 'Remote work cannot cause satisfaction because satisfaction is a mental state.', tag: 'wrong_assumption', why: 'Mental states are routinely treated as outcomes of working conditions; the objection is not methodological.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 4,
  concept: ['C12.confound', 'C12.selection'],
  label: 'PREPARATION_EXTENSION',
  testing: 'Identifying confounding/selection as the threat to a causal conclusion from observational comparison.',
  matters: 'Who ends up in each group, and what else differs between them.',
  why: 'A difference between groups supports a causal claim only if the groups are otherwise comparable; systematic selection breaks that comparability.',
  steps: [
    'Note that the groups were not formed at random.',
    'Ask what types of employees choose or are granted remote work.',
    'Conclude that the observed difference may be explained by those prior differences.',
  ],
  trap: 'Criticising the measurement (subjectivity, sample size) rather than the comparison itself.',
  transfer: 'The same reasoning underlies health studies (volunteers are healthier), school comparisons and product analytics on self-selected users.',
  hints: ['How did employees get into the two groups?', 'What else might differ between those groups?'],
});

const a12_02 = method('a12-02', {
  stem: 'A city reports that districts with more libraries also have higher average reading scores. Which conclusion is defensible?',
  options: statements(
    [
      { text: 'More libraries raise reading scores.', tag: 'correlation_causation', why: 'The pattern is a correlation between districts; nothing in the statement rules out other explanations for both facts.' },
      { text: 'Districts with more libraries also tend to have higher reading scores; the cause cannot be established from this information alone.', why: 'Correct: the description is supported, and the causal interpretation is left open pending further evidence.' },
      { text: 'Reading scores determine the number of libraries, so the direction is reversed.', tag: 'causal_direction_reversed', why: 'The reverse direction is equally unproven; asserting it swaps one unfounded causal claim for another.' },
      { text: 'The comparison is invalid because districts differ in size.', tag: 'irrelevant_data_used', why: 'Size differences may matter for interpretation, but they do not invalidate the reported association.' },
    ],
    1,
  ).options,
  correct: 1,
  difficulty: 3,
  concept: ['C12.confound', 'C12.level'],
  label: 'PREPARATION_EXTENSION',
  testing: 'Distinguishing a defensible descriptive claim from an unsupported causal claim.',
  matters: 'The unit of analysis (districts, not individuals) and the absence of information about other district differences such as income or parental education.',
  why: 'Aggregate associations can arise from many mechanisms, including third factors that influence both the number of libraries and reading performance.',
  steps: [
    'State the association precisely: more libraries ↔ higher average scores.',
    'List rival explanations: wealthier districts may provide both.',
    'Conclude that only the association is established by the given information.',
  ],
  trap: 'Treating “which conclusion is defensible” as asking for the most interesting conclusion; defensibility, not plausibility, is the criterion.',
  transfer: 'The same standard applies to regional statistics, hospital rankings and spending-performance comparisons.',
  hints: ['What is the unit being compared?', 'Which option stays within what the data can show?'],
});

const a12_03 = method('a12-03', {
  stem: 'A questionnaire measures “digital competence” with the single item: “How good are you with computers?” What is the main methodological concern?',
  options: statements(
    [
      { text: 'Operationalisation: a single self-assessment item is a weak measure of a multi-dimensional concept, and answers depend on respondents’ self-image.', why: 'Correct: the concept-to-measurement link is the weak point.' },
      { text: 'Sampling: single items cannot be used in samples above 100 people.', tag: 'overprecision', why: 'No such sample-size rule exists; the problem is the measurement, not the sample.' },
      { text: 'Causality: the item cannot establish a causal relationship.', tag: 'irrelevant_data_used', why: 'The item is not intended to establish causality, so this observation misses the point.' },
      { text: 'Documentation: the item is invalid unless the questionnaire is published in full.', tag: 'irrelevant_data_used', why: 'Transparency is desirable, but it is not what makes a single self-rating problematic.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 3,
  concept: ['C12.operational', 'C04.sampling'],
  label: 'PREPARATION_EXTENSION',
  testing: 'Recognising operationalisation as the link between a theoretical concept and its measurement.',
  matters: 'What the item actually captures compared with what the concept claims to mean.',
  why: 'Complex concepts need several observable indicators; a single subjective question measures self-perception as much as ability.',
  steps: [
    'Name the concept: digital competence (multi-dimensional).',
    'Name the indicator: one self-assessment question.',
    'Identify the gap and the measurement bias it introduces.',
  ],
  trap: 'Attacking the sample or the design when the instrument itself is the issue.',
  transfer: 'The same judgement is needed for “employee engagement” indices, ESG scores and happiness rankings.',
  hints: ['What exactly is being measured, and what is claimed to be measured?', 'Which element of the study does the question describe?'],
});

const a12_04 = method('a12-04', {
  stem: 'A researcher documents that in a company, teams with more internal chat messages deliver projects later than teams with fewer messages. She concludes that communication slows projects down. Which alternative explanation is most plausible methodologically?',
  options: statements(
    [
      { text: 'Difficult projects generate more coordination needs, so the project difficulty causes both the heavier communication and the delay.', why: 'Correct: a common cause explains the association without claiming that communication itself causes the delay.' },
      { text: 'Chat messages are not a valid measure of communication because they are digital.', tag: 'overprecision', why: 'Digital media are a legitimate object of study; the medium does not by itself invalidate a measure.' },
      { text: 'Delays cause teams to chat more, never the other way round.', tag: 'causal_direction_reversed', why: 'A reversed direction is only one possibility; here the shared cause (difficult projects) explains the pattern more directly.' },
      { text: 'The result must be caused by the messenger software.', tag: 'wrong_assumption', why: 'Nothing in the description points to the software; this invents a cause rather than explaining the pattern.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 5,
  concept: ['C12.confound', 'C11.relmech'],
  label: 'PREPARATION_EXTENSION',
  testing: 'Generating the most plausible rival explanation for an observed association, in a workplace context.',
  matters: 'The possibility of a common cause that drives both variables.',
  why: 'When two variables co-vary, a third factor can explain both; identifying it converts a causal claim into a testable competing hypothesis.',
  steps: [
    'Restate the association.',
    'Ask what could make teams chat more *and* finish later.',
    'Project complexity is the natural candidate; it acts before both.',
  ],
  trap: 'Choosing a direction-reversal or measurement objection when a common cause is available and more plausible.',
  transfer: 'The same reasoning defuses claims such as “overtime causes low quality” or “meetings reduce productivity”.',
  hints: ['Look for a factor that influences both observed variables.', 'Which explanation does not require the chat messages themselves to cause anything?'],
});

const a12_05 = method('a12-05', {
  stem: 'A survey of 1 200 students finds that those who attend more optional tutorials also achieve higher grades. A department wants to make tutorials compulsory. Which consideration is methodologically most important before deciding?',
  options: statements(
    [
      { text: 'Students who attend voluntarily may already be more motivated; compulsory attendance would change the composition of the group and may not reproduce the effect.', why: 'Correct: the effect estimated on self-selected attendees need not hold under compulsory attendance.' },
      { text: 'The sample of 1 200 is too small to say anything.', tag: 'overprecision', why: 'The size is adequate for the association studied; the difficulty lies in interpretation, not precision.' },
      { text: 'Grades are an invalid outcome because they are awarded by the same institution that runs the tutorials.', tag: 'wrong_assumption', why: 'That is a potential bias worth noting, but it does not address whether the effect would survive compulsory attendance.' },
      { text: 'Making tutorials compulsory is a change of policy, so no evidence can inform it.', tag: 'overprecision', why: 'Evidence from observational studies can inform policy; it must be interpreted with the right caveats.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 5,
  concept: ['C12.selection', 'C12.confound', 'C14.conclude'],
  label: 'PREPARATION_EXTENSION',
  testing: 'Transferring an observed effect to a changed policy — the selection problem in applied form.',
  matters: 'The process that placed students in the “high attendance” group (self-selection).',
  why: 'An association produced by self-selection is not automatically produced by compulsion, because compulsion changes who attends and why.',
  steps: [
    'Identify the treatment: attending tutorials.',
    'Identify the assignment mechanism: voluntary choice.',
    'Ask whether a compulsory regime would produce the same group and the same behaviour.',
  ],
  trap: 'Reporting the statistical result as if it were a policy effect; the design determines what the number means.',
  transfer: 'This is the core question in evaluating tutoring schemes, wellness programmes and mandatory training.',
  hints: ['Who chose to attend, and who will be attending after the change?', 'Which option addresses the change in the mechanism of attendance?'],
});

const a12_06 = method('a12-06', {
  stem: 'Which statement about the relationship between qualitative and quantitative social research is correct?',
  options: statements(
    [
      { text: 'They aim at different aspects of explanation: relationships between factors versus the mechanisms that produce outcomes.', why: 'Correct: this is the distinction the official material sets out.' },
      { text: 'Quantitative research explains mechanisms, qualitative research tests relationships.', tag: 'label_confusion', why: 'The two assignments are reversed.' },
      { text: 'Only quantitative research is empirical, because it uses data.', tag: 'definition_misuse', why: 'Qualitative research is equally empirical; it collects and analyses data, just of a different kind.' },
      { text: 'The two strategies cannot be combined in one study.', tag: 'overprecision', why: 'Mixed designs exist precisely because the strategies address different questions.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 2,
  concept: ['C11.relmech', 'C11.qtypes'],
  testing: 'The division of explanatory labour between the two traditions.',
  matters: 'Two aspects of explanation: whether factors relate, and how outcomes come about.',
  why: 'The strategies weight these aspects differently, which is why both contribute to explaining social action.',
  steps: [
    'Recall the official framing: both strategies explain social action, with different emphases.',
    'Match the emphasis to each label.',
    'Reject options that deny either strategy empirical status or deny combination outright.',
  ],
  trap: 'Turning a difference of emphasis into a hierarchy (“only one of them is real research”).',
  transfer: 'The same balanced framing prevents dismissive reviews of case studies or of purely statistical work.',
  hints: ['Which pair of aspects of explanation is being distinguished?', 'One option denies something the official text explicitly affirms.'],
});

const a12_07 = method('a12-07', {
  stem:
    'A researcher wants to test whether a training programme improves negotiation outcomes. Budget allows either (a) detailed observation of four negotiation rounds with interviews, or (b) a standardised test before and after the training with 200 participants. The research question is: “Does the programme improve outcomes, and how do participants apply the techniques?” Which design decision is most appropriate?',
  options: statements(
    [
      { text: 'Use the standardised test with 200 participants to answer the “does it work” part, and add a few observed rounds with interviews for the “how” part.', why: 'Correct: each sub-question is matched to the strategy suited to it.' },
      { text: 'Use the four observed rounds only, because depth matters more than numbers.', tag: 'scope_error', why: 'Depth cannot establish whether outcomes improved across participants; the first part of the question remains unanswered.' },
      { text: 'Use the 200-participant test only, and infer the application process from the score changes.', tag: 'scope_error', why: 'A score change shows that something changed, not how participants apply the techniques.' },
      { text: 'Randomly assign participants to the two designs.', tag: 'wrong_assumption', why: 'Designs are not allocated to participants; randomisation is a tool within a design (e.g. treatment vs. control).' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 4,
  concept: ['C11.mixed', 'C12.operational', 'C14.conclude'],
  label: 'PREPARATION_EXTENSION',
  testing: 'Building a mixed design that actually answers a two-part question.',
  matters: 'The two sub-questions and the evidence type each requires.',
  why: 'Effect questions need many comparable observations; process questions need detailed observation of a few cases.',
  steps: [
    'Split the research question into “does it work” and “how does it work”.',
    'Assign sample-based testing to the first and case-based observation to the second.',
    'Combine them, keeping the two evidence streams distinguishable.',
  ],
  trap: 'Believing that one method must be sacrificed, or mistaking randomisation for a way of choosing methods.',
  transfer: 'The same structure appears in pilot evaluations, medical effectiveness studies with process evaluation, and product experiments with user research.',
  hints: ['Two questions, two kinds of evidence — can both be collected?', 'What does randomisation actually randomise?'],
});

const a12_08 = method('a12-08', {
  stem: 'A qualitative study of three bankrupt firms concludes that “insufficient digital marketing causes business failure”. Which reformulation would make the claim methodologically defensible?',
  options: statements(
    [
      { text: 'In the three cases studied, weak digital marketing was one of the conditions under which failure occurred; how widespread this is cannot be judged from these cases.', why: 'Correct: the reformulation keeps the mechanism insight and removes the unwarranted general claim.' },
      { text: 'A different sample of three firms would justify the general claim.', tag: 'overprecision', why: 'A different small sample carries exactly the same limitation.' },
      { text: 'No reformulation is needed, because case studies can establish causes.', tag: 'scope_error', why: 'Case studies can establish mechanisms, not prevalence or general causal weight.' },
      { text: 'The claim becomes defensible if the firms are described in more detail.', tag: 'irrelevant_data_used', why: 'More detail about the same three cases still cannot support a statement about all firms.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 5,
  concept: ['C11.general', 'C12.confound'],
  label: 'PREPARATION_EXTENSION',
  testing: 'Repairing an over-general claim while preserving what the evidence can support.',
  matters: 'The difference between “occurred in these cases” and “causes failure in general”, and the absence of comparison cases (surviving firms) that failed to advertise yet survived.',
  why: 'A condition observed in failure cases is only a candidate cause until it is also shown to be absent (or rarer) in comparable non-failures.',
  steps: [
    'Identify the over-reach: a universal causal claim from three cases.',
    'Note the missing comparison group: firms that also did little digital marketing but survived.',
    'Restate the finding as a case-bound condition, which is what the data can carry.',
  ],
  trap: 'Strengthening the method (more detail, another sample) instead of narrowing the claim.',
  transfer: 'The same repair turns dramatic case-study conclusions into defensible risk factors — in finance, medicine and management.',
  hints: ['What is the comparison group that would be needed for a causal claim?', 'Which option narrows the claim instead of trying to strengthen the study?'],
});

const a12_09 = method('a12-09', {
  stem: 'A university wants to know how students experience an online examination format. Which combination of methods is best suited to producing findings that can guide the next round of exam design?',
  options: statements(
    [
      { text: 'A standardised survey of all participants, followed by interviews with a small number of students chosen to cover different experience profiles.', why: 'Correct: the survey establishes the distribution of experiences, and the interviews explain the reasons behind the extremes.' },
      { text: 'Interviews with five volunteers from the student union.', tag: 'scope_error', why: 'Volunteers from a union are unlikely to represent the range of experiences, and no distributional information emerges.' },
      { text: 'An analysis of the exam marks compared with last year’s marks.', tag: 'irrelevant_data_used', why: 'Marks say nothing about how students experienced the format.' },
      { text: 'A focus group with the teaching staff.', tag: 'irrelevant_data_used', why: 'Staff experience is not the object of the question.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 3,
  concept: ['C11.mixed', 'C12.operational', 'C04.sampling'],
  label: 'PREPARATION_EXTENSION',
  testing: 'Choosing instruments that match the object of study and the purpose (guiding redesign).',
  matters: 'Whose experience is being studied, and whether the design can reveal both prevalence and reasons.',
  why: 'Design decisions need to know what is common and why the uncommon cases matter, which requires both a distributional and a mechanism source.',
  steps: [
    'Identify the population: all participants in the format.',
    'Identify the purpose: improve the format ⇒ need frequency plus reasons.',
    'Match: broad standardised measurement plus selective in-depth interviews.',
  ],
  trap: 'Accepting a convenient qualitative source (volunteers, staff) for a question about a whole population.',
  transfer: 'The identical choice is made in usability testing, service evaluation and course evaluation.',
  hints: ['Who should be asked, and what relative weight do frequency and depth have here?', 'Which option covers both, from the right population?'],
});

const a12_10 = method('a12-10', {
  stem: 'Which of the following is an example of a causal *mechanism* question rather than a causal *relationship* question?',
  options: statements(
    [
      { text: 'Do students who use the library more often achieve better grades?', tag: 'label_confusion', why: 'This asks whether two factors co-vary — a relationship question.' },
      { text: 'How does the habit of visiting the library change the way students organise their revision?', why: 'Correct: the question targets the process that produces the outcome.' },
      { text: 'Is there a statistically significant link between library use and grade point average?', tag: 'label_confusion', why: 'Significance testing addresses the strength of a relationship, not its mechanism.' },
      { text: 'How many students use the library weekly?', tag: 'definition_misuse', why: 'This is a descriptive frequency question, not an explanatory one at all.' },
    ],
    1,
  ).options,
  correct: 1,
  difficulty: 2,
  concept: ['C11.relmech'],
  testing: 'Recognising the linguistic signature of a mechanism question (“how does X change the way Y happens?”).',
  matters: 'The verb: “do/co-vary” signals relationship; “how/why does it come about” signals mechanism; “how many” signals description.',
  why: 'Mechanism questions ask about the process between cause and outcome, which is a different object of study from the association itself.',
  steps: [
    'Classify each option by what it asks for: association, process, or frequency.',
    'Select the option asking for the process.',
  ],
  trap: 'Treating any question containing two variables as a relationship question.',
  transfer: 'The same reading skill separates process evaluation from impact evaluation in policy, and “how” from “whether” in any research brief.',
  hints: ['One of these asks how something works, not whether it happens.', 'Which option involves a process rather than a score or a count?'],
});

const a12_11 = method('a12-11', {
  stem: 'A study reports: “Participants in the mentoring programme were promoted 20 % more often within two years.” Which additional information is most important for judging whether the programme caused this difference?',
  options: statements(
    [
      { text: 'How participants were selected into the programme, and whether comparable non-participants existed.', why: 'Correct: without knowing the selection process and whether a comparable comparison group exists, the difference cannot be attributed to the programme.' },
      { text: 'The exact size of the promotion bonus.', tag: 'irrelevant_data_used', why: 'The size of the reward does not affect whether the programme caused the promotions.' },
      { text: 'The number of mentors who hold a doctorate.', tag: 'irrelevant_data_used', why: 'This is a description of the intervention, not of the comparison that would license a causal claim.' },
      { text: 'Whether participants were satisfied with the programme.', tag: 'irrelevant_data_used', why: 'Satisfaction is an outcome measure, not evidence about group comparability.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 4,
  concept: ['C12.selection', 'C12.confound', 'C14.control'],
  label: 'PREPARATION_EXTENSION',
  testing: 'Identifying the single piece of information that would most change the interpretation of an effect figure.',
  matters: 'The comparison structure behind the 20 % figure.',
  why: 'A rate difference between participants and non-participants is only causal if the two groups were comparable before the programme; selection is the usual reason they are not.',
  steps: [
    'Restate the claim: participation ⇒ 20 % more promotions.',
    'Ask what would be different if the programme had no effect at all.',
    'Recognise that group composition, not programme detail, decides this.',
  ],
  trap: 'Asking for more detail about the programme instead of asking how the comparison groups were formed.',
  transfer: 'The same question (“compared with what?”) is the first question of any evaluation, clinical trial or marketing claim.',
  hints: ['What comparison produced the 20 % figure?', 'Which option tells you whether that comparison is fair?'],
});

/* ---- D11/D12 mixed: contrast pairs (anti-pattern-matching) --------- */

const a11_11 = method('a11-11', {
  stem:
    'Two projects are described. **Project 1:** 400 firms are surveyed and the association between export activity and profitability is tested statistically. **Project 2:** four exporting firms are studied in depth to reconstruct how they entered foreign markets. Which statement is correct?',
  options: statements(
    [
      { text: 'Project 1 examines a relationship deductively; Project 2 examines a mechanism inductively.', why: 'Correct: the survey tests an association with statistical methods, while the case work reconstructs a process.' },
      { text: 'Project 1 examines a mechanism inductively; Project 2 examines a relationship deductively.', tag: 'label_confusion', why: 'Both labels are swapped relative to what the two projects actually do.' },
      { text: 'Both projects are deductive, because both use empirical data.', tag: 'definition_misuse', why: 'Using empirical data does not make a project deductive; the deductive/inductive distinction concerns the reasoning direction and goal.' },
      { text: 'Project 2 is quantitative in nature because it reconstructs measurable steps.', tag: 'label_confusion', why: 'Reconstructing steps in a few cases is qualitative analysis; measurability is not the criterion.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 3,
  concept: ['C11.dedind', 'C11.relmech', 'C11.qtypes'],
  testing: 'Classifying two compact project descriptions without relying on surface keywords such as “data” or “steps”.',
  matters: 'Number of cases, the goal (association vs. process) and the analysis method.',
  why: 'The strategies are defined by their goal and reasoning direction, not by whether numbers appear.',
  steps: [
    'Project 1: many cases, statistical test, association ⇒ quantitative/deductive/relationship.',
    'Project 2: few cases, process reconstruction ⇒ qualitative/inductive/mechanism.',
  ],
  trap: 'Classifying by the presence of numbers rather than by the research goal.',
  transfer: 'The same classification is applied when reviewing literature or judging whether a paper answers your question.',
  hints: ['Classify each project by its goal before looking at its method.', 'Which project reconstructs a process?'],
});

const a11_12 = method('a11-12', {
  stem: 'Which pair of descriptions is correctly matched?',
  options: statements(
    [
      { text: 'Quantitative: hypotheses are fixed before analysis and changes are documented. Qualitative: the research question may be refined during the process if the changes are documented.', why: 'Correct: this is the pairing the official material describes.' },
      { text: 'Quantitative: the research question may be refined during the process. Qualitative: hypotheses are fixed before analysis.', tag: 'label_confusion', why: 'The two practices are swapped.' },
      { text: 'Quantitative: no changes to the design are ever permitted. Qualitative: changes need not be documented.', tag: 'definition_misuse', why: 'Both halves misstate the rule: changes are permitted (with consequences) in quantitative work and must be documented in qualitative work.' },
      { text: 'Both traditions require an identical, fixed sequence of phases.', tag: 'definition_misuse', why: 'Only the quantitative process is described as linear; the qualitative process may include circular elements.' },
    ],
    0,
  ).options,
  correct: 0,
  difficulty: 2,
  concept: ['C11.linear', 'C11.document'],
  testing: 'Holding the two traditions’ rules apart on the single dimension of change and transparency.',
  matters: 'The exact rule for each tradition: permitted-with-documentation in both, but the *object* of permitted change differs (question/preconceptions vs. instruments/sample).',
  why: 'The two traditions differ in where flexibility is normal; both are held together by the documentation requirement.',
  steps: [
    'Recall the quantitative rule: changes allowed but documented; consequences for comparability.',
    'Recall the qualitative rule: circular elements allow refinement of question and approach if documented.',
    'Match the only option that respects both.',
  ],
  trap: 'Believing that “linear” means “rigid” and “circular” means “undocumented”.',
  transfer: 'This is the same tension that quality management resolves with change control plus a change log.',
  hints: ['Both traditions require documentation — what differs is what may change.', 'Reject options that forbid change or waive documentation entirely.'],
});

export const METHODOLOGY_AUTHORED: Question[] = [
  a11_01,
  a11_02,
  a11_03,
  a11_04,
  a11_05,
  a11_06,
  a11_07,
  a11_08,
  a11_09,
  a11_10,
  a11_11,
  a11_12,
  a12_01,
  a12_02,
  a12_03,
  a12_04,
  a12_05,
  a12_06,
  a12_07,
  a12_08,
  a12_09,
  a12_10,
  a12_11,
];
