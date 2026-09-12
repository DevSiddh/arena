import { f, fig, intuition, lesson, mis, p, practice, sec, steps, t } from './helpers';

export const L13 = lesson(
  'L13',
  'D13',
  'Models, scaling and estimation: why things do not scale linearly',
  'Assumptions, square-cube effects, precision versus accuracy — reasoning about a model instead of inside it.',
  ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
  45,
  [
    sec('what_is_it', [
      p(
        'A model is a deliberate simplification: the order-quantity model ignores discounts, hydrostatics treats water as incompressible, a cost curve ignores capacity limits. This lesson is about the *meta* skills around models: knowing which assumption is load-bearing, predicting what happens when the size changes, estimating an answer to the right order of magnitude, and distinguishing precision from accuracy.',
      ),
    ]),
    sec('why_it_matters', [
      p(
        'Every demonstrated domain contains at least one effect-of-change or critique item, and the official material is explicit about the limits of its own simplifications. Items in this domain therefore test the move the examiners clearly value: not computing inside the model, but reasoning about the model.',
      ),
      mis('“A more detailed model is always better.”', 'More detail means more assumptions and less transparency. A model is good when it is *appropriate for the question* — and item wording usually says which question matters.'),
    ]),
    sec('prerequisites', [
      p('Ratio and scaling from L01, plus one domain where scaling bites: hydrostatics (buoyancy versus volume), the order-quantity model, or flow continuity.'),
      t(
        ['Scaling relation', 'When length scales by k', 'Consequence'],
        [
          ['length', '×k', '—'],
          ['area', '×k²', 'surface, cross-section, cost of paint'],
          ['volume and mass', '×k³', 'weight, cargo, heat capacity'],
          ['area-to-volume ratio', '×1/k', 'heat loss, mixing, diffusion get relatively harder'],
          ['square-root relations', '×√k', 'the EOQ response to a demand change'],
        ],
        'The square-cube table is the fastest way to answer a whole family of estimation items.',
      ),
    ]),
    sec('core_knowledge', [
      p('**Assumptions are load-bearing or decorative.** A load-bearing assumption is one whose failure changes the answer (constant demand in the order-quantity model); a decorative one does not (a tidy numbering of phases). An item that removes an assumption is really asking which kind it was.'),
      p('**Proportionality and its limits.** Two quantities are proportional when their ratio is constant. Surfaces scale with the square, volumes with the cube, and most processes that depend on transport (cooling, mixing, diffusion) scale in between — which is why neither a small model nor a scaled-up plant behaves exactly as a linear multiple of the other.'),
      p('**Estimation as a method.** Estimate by rounding to numbers that cancel, and carry the unit:'),
      f('\\text{estimate} \\approx \\frac{\\text{round}(A) \\cdot \\text{round}(B)}{\\text{round}(C)}'),
      p('A credible estimate is within a factor of about three, not within 1 %. Order-of-magnitude thinking is what separates "clearly too small" from "plausible" in a multiple-choice option list.'),
      p('**Precision versus accuracy.** Precision is how finely a number is reported; accuracy is how close it is to the truth. Reporting €1 483 726 for an estimate whose input was "about 1 500" is a precision error even if the arithmetic is perfect — the classic "overprecise answer" distractor.'),
      p('**Feedback and instability.** A process with feedback can amplify a small change (interest compounding, epidemics) or dampen it (thermostats, queueing). When an item says "the change feeds back", the answer is about the *amplification*, not the direct multiplication.'),
    ]),
    sec('visual_intuition', [
      fig(
        {
          kind: 'line_chart',
          title: 'Length, area and volume as size grows',
          xLabel: 'length scale k',
          yLabel: 'relative magnitude',
          x: [1, 2, 3, 4, 5],
          series: [
            { name: 'length (k)', values: [1, 2, 3, 4, 5], color: '#2563eb' },
            { name: 'area (k²)', values: [1, 4, 9, 16, 25], color: '#059669' },
            { name: 'volume (k³)', values: [1, 8, 27, 64, 125], color: '#b45309' },
          ],
        },
        'Double a shape and the area quadruples while the volume multiplies by eight. Every scaling trap in the module is a version of this picture.',
      ),
      intuition(
        'When a question says "the same model, but bigger", mentally multiply the linear dimensions and then ask which physical quantity is affected — a surface (×k²), a volume (×k³), or a ratio of the two (×1/k). The physics follows the geometry, not the other way round.',
      ),
    ]),
    sec('worked_example', [
      p('A chemical process that works well in a 1-litre laboratory vessel is to be run in a 1 000-litre reactor. The mixing power per litre is kept the same. What should be expected?'),
      steps([
        'Convert the volume ratio to a length ratio for a similar shape: $k = \\sqrt[3]{1000} = 10$.',
        'Surfaces (and therefore heat-exchange area) grow by $k^2 = 100$; the volume grows by 1 000.',
        'The area-to-volume ratio falls by a factor of 10 — heat removal per litre becomes ten times harder.',
        'Mixing must act over distances ten times longer, while the power per litre is unchanged: the mixing regime cannot be preserved.',
        'Conclusion: expect longer mixing times, worse temperature control and possibly a different product distribution. The scaling failure has two separate causes, and naming both is what distinguishes a strong answer.',
      ]),
      mis('Assuming that keeping an "intensive" quantity constant guarantees identical behaviour.', 'Intensive quantities do not control transport distances. That is why the pilot plant rarely predicts the full-scale plant exactly.'),
    ]),
    practice('guided_practice', [p('Assumption items: name the assumption and say what changes if it fails. One line for the assumption, one line for the consequence.')], ['C13.model'], [1, 2]),
    practice('independent_practice', [p('Scaling items. Write k, then k², then k³, and decide which one the question needs before computing.')], ['C13.scaling'], [2, 3]),
    practice('transfer', [p('Estimation and precision items: answer with the right order of magnitude and reject over-precise options immediately.')], ['C13.estimate', 'C13.precision'], [4, 5]),
    practice('dmat_style', [p('Exam-style critique items about a model, its limits and a described change — the pattern used by the official effect-of-change questions.')], ['C13.model', 'C13.scaling', 'C13.precision'], [5, 6]),
    sec('trick_misconception', [
      mis('Scaling a volume linearly with a length.', 'Volumes go with the cube; that is where most scaling distractors are built.'),
      mis('Believing that more decimal places means more accuracy.', 'Precision is reported, accuracy is earned. An overprecise answer is a distractor, not a sign of care.'),
      mis('“The model is wrong, so it is useless.”', 'A model is a tool for a question. Its limits are part of its specification, not a refutation.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool. Target 80 %: every scaling answer states the exponent, and every critique answer names which assumption is load-bearing.')],
      ['C13.model', 'C13.scaling', 'C13.estimate', 'C13.precision'],
      [1, 2, 3, 4, 5, 6, 7],
    ),
  ],
);
