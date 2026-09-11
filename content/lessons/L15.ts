import { f, fig, intuition, lesson, mis, p, practice, sec, steps, t } from './helpers';

export const L15 = lesson(
  'L15',
  'D15',
  'Argument and inference: quantifiers, necessary and sufficient conditions',
  'The logical skeleton of a claim — the domain where one word decides the answer.',
  ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
  45,
  [
    sec('what_is_it', [
      p(
        'An argument has a claim, support, and a conclusion. Judging it needs three skills: reading quantifiers exactly (*all, some, none, only*), separating **necessary** from **sufficient** conditions, and telling a **valid** inference from a merely suggestive one. "Social sciences and humanities" are named on the official field list, and the official methodology items already demand this precision.',
      ),
    ]),
    sec('why_it_matters', [
      p(
        'In a text-only module, several items are decided by one word. A student who reads "some" as "most", or who confuses "only if" with "if", loses a mark that no amount of arithmetic can recover. This domain trains the reading, not the mathematics.',
      ),
      mis('“This is just word play.”', 'Quantifier logic is how specifications, standards and laws are written. Reading it precisely is a professional skill in every field the module names.'),
    ]),
    sec('prerequisites', [
      p('Nothing beyond careful reading. But you must be willing to write the claim in symbols — that is what makes the ambiguity visible.'),
      t(
        ['Wording', 'Symbolic form', 'Consequence'],
        [
          ['all A are B', 'A ⇒ B', 'being A guarantees B (sufficient)'],
          ['only A are B', 'B ⇒ A', 'being A is required for B (necessary)'],
          ['some A are B', '∃ A ∧ B', 'says nothing about the rest'],
          ['no A are B', 'A ⇒ ¬B', 'A excludes B entirely'],
        ],
      ),
    ]),
    sec('core_knowledge', [
      p('**Sufficient condition.** If A is sufficient for B, then A guarantees B. Finding one counterexample (A without B) refutes the claim.'),
      p('**Necessary condition.** If A is necessary for B, then B cannot occur without A. A counterexample is B without A. Necessity and sufficiency are independent: a condition can be one, both, or neither.'),
      f('A \\text{ sufficient for } B: A \\Rightarrow B \\qquad A \\text{ necessary for } B: B \\Rightarrow A'),
      p('**Quantifier precision.** "All" is refuted by a single exception; "some" is satisfied by a single case and says nothing about the majority. "Only" reverses the implication, and that reversal is the most common trap in the domain.'),
      p('**Valid versus strong.** A valid inference follows with certainty from the premises. A strong inference is merely well supported. Options often blend the two words, and the item asks which is accurate.'),
      p('**Common inferential errors.** Reversing an implication ("if A then B, so if B then A"), generalising from a case ("this firm succeeded, so it will always work"), and confusing absence of evidence with evidence of absence.'),
      p('**Reading a standard or a rule.** Statements like "every firm holding a licence must file annually" are one-directional: they say nothing about firms that do file, and nothing about what licence-holders may do at other times. Precision here is exactly what policy and requirements texts demand.'),
    ]),
    sec('visual_intuition', [
      fig(
        {
          kind: 'blob_diagram',
          caption: 'Sufficient, necessary, and both',
          nodes: [
            { id: 'a', label: 'A', x: 20, y: 50 },
            { id: 'b', label: 'B', x: 80, y: 50 },
          ],
          edges: [
            { from: 'a', to: 'b', label: 'A ⇒ B: A sufficient, B necessary' },
          ],
        },
        'One arrow, two readings. Every necessary/sufficient item is a question about which way the arrow points — and the wording is the only clue.',
      ),
      intuition(
        'Draw two circles and an arrow. "Sufficient" means the arrow leaves A and arrives in B; "necessary" means B cannot be reached without passing through A. When an option mixes the two, the picture resolves it in seconds — which is faster and safer than arguing with the sentence.',
      ),
    ]),
    sec('worked_example', [
      p('“Every report that is peer-reviewed is also proofread by a specialist. Some proofread reports are not peer-reviewed. Therefore, being peer-reviewed is not necessary for being proofread.” Is this reasoning valid, and what exactly does the evidence establish?'),
      steps([
        'Write the claims symbolically: peer-reviewed ⇒ specialist-proofread (P ⇒ S), and some S are not P ($\\exists S \\wedge \\neg P$).',
        'Test necessity: is P necessary for S? Necessity would mean S ⇒ P, i.e. every proofread report is peer-reviewed.',
        'The second premise is a direct counterexample to that: there exist proofread (S) reports that are not peer-reviewed (¬P).',
        'So P is indeed not necessary for S — the conclusion follows from the premises.',
        'Now test sufficiency for completeness: P ⇒ S says P is sufficient for S, which the premises assert and none contradict.',
        'Answer precisely: the reasoning is valid, and P is sufficient but not necessary for S.',
      ]),
      mis('Reading "some proofread reports are not peer-reviewed" as "most are not".', '"Some" says at least one. Any option that quantifies it further is making a claim the premise does not contain.'),
    ]),
    practice('guided_practice', [p('Translate each claim into an arrow before reading the options. Write "A ⇒ B" or "B ⇒ A" — the direction is the entire question.')], ['C15.claim', 'C15.quantifier'], [1, 2]),
    practice('independent_practice', [p('Necessary and sufficient items: for each option, ask whether it reverses the arrow, weakens the quantifier, or changes the scope.')], ['C15.necessary', 'C15.quantifier'], [2, 3]),
    practice('transfer', [p('Inference items drawn from rules and specifications: decide what the stated rule permits, requires and leaves open.')], ['C15.inference', 'C15.necessary'], [4, 5]),
    practice('dmat_style', [p('Exam-style argument items with options that differ only in quantifier or direction — the pattern that punishes fast reading.')], ['C15.claim', 'C15.quantifier', 'C15.necessary', 'C15.inference'], [5, 6]),
    sec('trick_misconception', [
      mis('Reversing "only if".', '"A only if B" means A ⇒ B, so B is necessary. The reverse (B ⇒ A) is a different, unstated claim.'),
      mis('Treating "some" as "most" or as "few".', '"Some" only asserts existence.'),
      mis('“Valid means true.”', 'Validity is about the step from premises to conclusion. A valid argument can have a false premise.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool. Target 80 %, with the arrow written for every item. If the arrow was wrong, the item is not mastered even when the option matched.')],
      ['C15.claim', 'C15.quantifier', 'C15.necessary', 'C15.inference'],
      [1, 2, 3, 4, 5, 6, 7],
    ),
  ],
);
