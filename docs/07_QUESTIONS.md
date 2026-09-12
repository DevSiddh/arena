# 07 — Question documentation

Every item in the bank (665 items) with its evaluation section (task type, skill, setting), difficulty, reasoning type, cognitive move, source family and confidence label. Full worked solutions and the complete rationale for each distractor are in `content/bank.json` and are rendered in the app; this document is the audit view — the item's id, what it demands and where it came from.

## Official example studies (how the four sample exercises are used)

### Exercise 1 — Vector Calculations — D02

- Scalars have one number; vectors have n components (the material works in 2D and 3D).
- Components can be read off a coordinate figure and then manipulated symbolically.
- Addition and subtraction are component-wise; scalar multiplication scales every component.
- Length comes from Pythagoras, generalised to more components.
- Three products are defined: scalar product (scalar), vector product (vector), triple product (scalar).
- The magnitude of the vector product equals the area of the parallelogram spanned.
- A zero triple product means the spanned volume is zero — the vectors lie in one plane.

*Key insight:* The exercise is not about memorising three formulas: it is about knowing what each operation produces, what it means geometrically, and how changing an input changes the output.

*Beyond the sample:* Perpendicularity and obtuse/acute angle tests as statement items. Reverse questions: given the cross product or the area, recover an unknown component. Effect-direction items (double one vector, rotate a component): how do dot, cross and area change? Critique items: a student claims a calculation is right — which step fails? Disguised contexts: work done by a force along a displacement (dot product), torque and area of a deck (cross product), coplanarity of a rigid structure.

### Exercise 2 — Hydrostatics — D06

- In an incompressible fluid, pressure increases linearly with depth.
- The reason: the weight of the fluid column above a point, which acts in every direction.
- Pressure at a point depends only on vertical depth below the surface and on fluid density.
- An external pressure (atmosphere) adds to the pressure inside the fluid: p = ρgh + p₀.
- Simplification used for estimation: ρ_water = 1000 kg/m³, g ≈ 10 N/kg ⇒ about 1 bar per 10 m.
- A floating body displaces fluid whose mass equals its own mass; F_G − F_B = 0.
- Weight acts at the centre of gravity, buoyancy at the centre of gravity of the submerged part.

*Key insight:* One law explains ships, submarines, pumps and bubbles. The exam tests whether you can apply that single law to a situation you have never seen, and whether you know which quantities cancel out.

*Beyond the sample:* Statements about gauge vs. total pressure at different depths (the classic "twice as deep" trap). Buoyancy with partially submerged bodies described by a submerged fraction. Effect-direction items: change density, change depth, change the trapped-gas volume. Relevance-filter items where several realistic numbers are decoys. Engineering contexts: hydraulic press, U-tube, ballast tank, suction dredge.

### Exercise 3 — Optimal Order Quantity — D09

- The model minimises the sum of holding costs and fixed ordering costs.
- Fixed ordering cost is constant per order because the work does not depend on the quantity.
- Key assumptions: constant known demand, no quantity discounts, no capital or storage limits, cost minimisation as the only objective.
- Between orders, inventory falls steadily from Q to 0, so average inventory is Q/2.
- Q* = √(2DS/H), with D = annual demand, S = cost per order, H = holding cost per unit per year.
- H depends on storage (rent) and on the value of the stored good (capital and risk costs).

*Key insight:* The formula is a consequence of a cost trade-off. Questions are built on the trade-off, not on the formula, so parameter reasoning beats substitution.

*Beyond the sample:* Total relevant cost at Q* and the fact that the two cost terms are equal there. The flat-bottom property: ordering 2Q* raises total cost only 25 %. Orders per year, cycle length and reorder timing. Quantity-discount break-even reasoning (extension, labelled). Critique items where a manager's stated reason for a bigger order is checked against the model.

### Exercise 4 — Research Strategies in Social Sciences — D11

- Both strategies explain social action, but weight two aspects differently.
- Aspect 1 — causal relationship: does a factor relate to an outcome? (does education relate to income?)
- Aspect 2 — causal mechanism: how does the outcome come about? (education opens professional opportunities)
- Quantitative = theory testing = deductive: standardised collection plus statistical tests, adequate sample size for significance.
- Qualitative = theory generating = inductive: one or a few cases, reveals mechanisms and their individual conditions, but says nothing about how widespread those conditions are.
- Four phases: formulating the problem/question, specifying the research design, collecting and analysing data, processing the material.
- Quantitative projects proceed linearly and separate conceptual, theoretical, methodological and empirical steps; changes are possible but must be documented and can reduce comparability.
- Qualitative projects may include circular elements: phases are not strictly separated and preconceptions or methods may change if clearly documented.

*Key insight:* The items never reward reciting definitions; they reward a clean mental model of two research logics and of the obligations that come with each (documentation, phase order, transferability).

*Beyond the sample:* Systematic contrast pairs: relationship vs. mechanism, deductive vs. inductive, generalisation vs. transferability, linear vs. circular, permitting change vs. documenting change. Scenario judgement in social-science reasoning: confounders, selection effects, operationalisation. Design-repair items: what would have to be added for the claim to be defensible? Text-reasoning items on quantifier precision ("only", "all", "at least one").

## D01 — Mathematical & Quantitative Reasoning (51 items)

**Official status:** OFFICIAL_FIELD_LIST, PREREQUISITE — evidence: PDF p. 33 field list; implicit in every official calculation.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| adv-mixed-01 | 6 | Argumentation | Model critique | Everyday context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_FIELD_LIST | authored (advanced) | — |
| ac01-01 | 5 | Argumentation | Model critique | Everyday context | conceptual_discrimination | explain_or_critique | critique_reasoning | PREREQUISITE | authored | S-data-1 |
| ac01-02 | 3 | Argumentation | Routine procedure | Everyday context | conceptual_discrimination | explain_or_critique | critique_reasoning | PREREQUISITE | authored | S-econ-1 |
| gen-pct-490785 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-179021 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-774002 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-908684 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-pct-373803 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-712008 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-688069 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-262760 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-pct-896731 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-173651 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-599507 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-950819 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-pct-755549 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-692447 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-703190 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-839920 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-pct-563001 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-100286 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-367651 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-711097 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-pct-511162 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-689916 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-802695 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-328556 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-pct-941394 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-384121 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-663494 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-428157 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-pct-592773 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-996192 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-576336 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-766546 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-pct-150288 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-904927 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-772917 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-492466 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-pct-534413 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-337896 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-410436 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-169464 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-pct-980464 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-578299 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-595720 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-364860 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-pct-610814 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prop-568236 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-unit-368149 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-est-723368 | 3 | Estimation & order of magnitude | Quantitative literacy | Everyday context | estimation_scaling | execute_rule | numeric_direct | PREREQUISITE | generated | — |

## D02 — Vector & Quantitative Mathematics (136 items)

**Official status:** OFFICIAL_SAMPLE, PREREQUISITE — evidence: PDF pp. 34–39: component form, magnitude, addition, scalar multiplication, dot/vector/triple product table, 8 questions with official solutions.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| adv-vec-01 | 6 | Analysis | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | statement_compare | OFFICIAL_SAMPLE | authored (advanced) | S-vec-2 |
| ac02-01 | 5 | Argumentation | Model critique | Technical context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-vec-1 |
| ac02-02 | 4 | Argumentation | Routine procedure | Technical context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-vec-2 |
| ac02-03 | 5 | Argumentation | Model critique | Technical context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-vec-1 |
| ac02-04 | 4 | Argumentation | Routine procedure | Technical context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-vec-1 |
| gen-vaddsub3-626795 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vmagrev-140995 | 2 | Formula transformation | Transfer | Technical context | parameter_reasoning | effect_of_change | reverse_question | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-965936 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-167667 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vangle-573765 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-733277 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-186928 | 3 | Graph interpretation | Quantitative literacy | Technical context | multi_step_application | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-vtriple-448055 | 4 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-veff-sign-752912 | 4 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vtype-single-884425 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-402443 | 1 | Calculation | Basic recall | Technical context | recall_structure | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-vaddsub-746471 | 3 | Calculation | Transfer | Technical context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vmagrev-440369 | 2 | Formula transformation | Transfer | Technical context | parameter_reasoning | effect_of_change | reverse_question | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-952062 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-153962 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vangle-350524 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-554663 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-201457 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vtriple-rev-709688 | 5 | Formula transformation | Reasoning under uncertainty | Technical context | logical_deduction | general_case | reverse_question | OFFICIAL_SAMPLE | generated | — |
| gen-veff-perp-449780 | 4 | Model assessment (effect of a change) | Routine procedure | Technical context | conceptual_discrimination | general_case | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-vtype-single-453828 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-122278 | 1 | Calculation | Basic recall | Technical context | recall_structure | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-vaddsub3-875839 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vmag-690336 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-112625 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-210562 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vperp-961983 | 3 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-372649 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-334117 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vcoplanar-274683 | 5 | Analysis | Reasoning under uncertainty | Technical context | logical_deduction | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-veff-dot-805582 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-vtype-single-693175 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-read-896835 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | interpret_representation | description_choice | PREREQUISITE | generated | — |
| gen-vaddsub-433166 | 3 | Calculation | Transfer | Technical context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_SAMPLE | generated | S-vec-2 |
| gen-vmagcmp-169747 | 1 | Analysis | Routine procedure | Technical context | rule_application | execute_rule | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-611607 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-962220 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vperp-229978 | 3 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-489428 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-812660 | 3 | Graph interpretation | Quantitative literacy | Technical context | multi_step_application | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-vtriple-216950 | 4 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-veff-perp-159109 | 4 | Model assessment (effect of a change) | Routine procedure | Technical context | conceptual_discrimination | general_case | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-vtype-single-939720 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-398774 | 1 | Calculation | Basic recall | Technical context | recall_structure | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-vaddsub3-178941 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vmagrev-518804 | 2 | Formula transformation | Transfer | Technical context | parameter_reasoning | effect_of_change | reverse_question | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-794441 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-467749 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vangle-896785 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | interpret_representation | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-481092 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-861185 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vtriple-900203 | 4 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-veff-dot-606839 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-vtype-825058 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-read-600933 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | interpret_representation | description_choice | PREREQUISITE | generated | — |
| gen-vaddsub-301069 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | S-vec-1 |
| gen-vmag-839474 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-974064 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-596274 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vperp-443613 | 3 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-880257 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-809017 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vcoplanar-995296 | 5 | Analysis | Reasoning under uncertainty | Technical context | logical_deduction | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-veff-perp-227889 | 4 | Model assessment (effect of a change) | Routine procedure | Technical context | conceptual_discrimination | general_case | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-vtype-single-568919 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-read-933230 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | interpret_representation | description_choice | PREREQUISITE | generated | — |
| gen-vaddsub-177445 | 3 | Calculation | Transfer | Technical context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_SAMPLE | generated | S-vec-2 |
| gen-vmag-877610 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-839723 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-194721 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vangle-612818 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-813504 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-220923 | 3 | Graph interpretation | Quantitative literacy | Technical context | multi_step_application | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-vcoplanar-348642 | 5 | Analysis | Reasoning under uncertainty | Technical context | logical_deduction | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-veff-perp-610505 | 4 | Model assessment (effect of a change) | Routine procedure | Technical context | conceptual_discrimination | general_case | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-vtype-single-520329 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-read-687785 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | interpret_representation | description_choice | PREREQUISITE | generated | — |
| gen-vaddsub-321668 | 3 | Calculation | Transfer | Technical context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_SAMPLE | generated | S-vec-2 |
| gen-vmag-757465 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-587079 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-657305 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vperp-240355 | 3 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-891004 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-639897 | 3 | Graph interpretation | Quantitative literacy | Technical context | multi_step_application | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-vtriple-rev-821323 | 5 | Formula transformation | Reasoning under uncertainty | Technical context | logical_deduction | general_case | reverse_question | OFFICIAL_SAMPLE | generated | — |
| gen-veff-dot-325230 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-vtype-single-773067 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-691091 | 1 | Calculation | Basic recall | Technical context | recall_structure | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-vaddsub-464943 | 3 | Calculation | Transfer | Technical context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vmag-559716 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-625866 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-582021 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vperp-725727 | 3 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-551789 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-257146 | 3 | Graph interpretation | Quantitative literacy | Technical context | multi_step_application | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-vtriple-331966 | 4 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-veff-perp-524102 | 4 | Model assessment (effect of a change) | Routine procedure | Technical context | conceptual_discrimination | general_case | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-vtype-single-979526 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-279877 | 1 | Calculation | Basic recall | Technical context | recall_structure | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-vaddsub-334934 | 3 | Calculation | Transfer | Technical context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_SAMPLE | generated | S-vec-1 |
| gen-vmag-181108 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-804740 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-478597 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vangle-672362 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-344458 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-422995 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vcoplanar-687684 | 5 | Analysis | Reasoning under uncertainty | Technical context | logical_deduction | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-veff-cross-195210 | 4 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-vtype-single-836703 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-342313 | 1 | Calculation | Basic recall | Technical context | recall_structure | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-vaddsub3-636534 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vmagcmp-516346 | 2 | Analysis | Routine procedure | Technical context | rule_application | execute_rule | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-248452 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-833390 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vangle-719154 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | interpret_representation | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-800280 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-542226 | 3 | Graph interpretation | Quantitative literacy | Technical context | multi_step_application | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-vcoplanar-339757 | 5 | Analysis | Reasoning under uncertainty | Technical context | logical_deduction | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-veff-area-halve-348677 | 5 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated (multi-effect) | — |
| gen-vtype-single-223666 | 1 | Classification of a case | Basic recall | Technical context | recall_structure | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-861425 | 1 | Calculation | Basic recall | Technical context | recall_structure | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-vaddsub3-282998 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vmagcmp-447727 | 2 | Analysis | Routine procedure | Technical context | rule_application | execute_rule | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vscalar-594153 | 2 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vdot-171713 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vangle-608576 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-vcross-609951 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-varea-902674 | 3 | Graph interpretation | Quantitative literacy | Technical context | multi_step_application | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-vtriple-rev-612945 | 5 | Formula transformation | Reasoning under uncertainty | Technical context | logical_deduction | general_case | reverse_question | OFFICIAL_SAMPLE | generated | — |
| gen-veff-sign-974067 | 4 | Classification of a case | Routine procedure | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-vcomp-890870 | 1 | Calculation | Basic recall | Technical context | recall_structure | execute_rule | numeric_direct | PREREQUISITE | generated | — |

## D03 — Data Interpretation, Tables & Graphs (29 items)

**Official status:** OFFICIAL_FIELD_LIST, PREREQUISITE — evidence: PDF p. 33 (figures/tables/formulas); Exercise 1 Q1/Q7, Exercise 3 Q7.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| adv-data-01 | 6 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | authored (advanced) | — |
| acov-distort-01 | 2 | Argumentation | Transfer | Everyday context | representation_transfer | interpret_representation | critique_reasoning | PREPARATION_EXTENSION | authored | S-data-1 |
| acov-distort-02 | 4 | Argumentation | Transfer | Everyday context | representation_transfer | interpret_representation | critique_reasoning | PREPARATION_EXTENSION | authored | S-data-1 |
| ac03-01 | 3 | Argumentation | Routine procedure | Everyday context | conceptual_discrimination | explain_or_critique | critique_reasoning | PREPARATION_EXTENSION | authored | S-data-1 |
| ac03-02 | 3 | Argumentation | Routine procedure | Everyday context | conceptual_discrimination | explain_or_critique | critique_reasoning | PREPARATION_EXTENSION | authored | S-data-1 |
| gen-share-923472 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-324885 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |
| gen-share-474662 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-777444 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |
| gen-share-122481 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-313408 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |
| gen-share-748391 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-491012 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |
| gen-share-214101 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-880841 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |
| gen-share-303617 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-897837 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |
| gen-share-878806 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-991564 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |
| gen-share-536544 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-532993 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |
| gen-share-555658 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-184536 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |
| gen-share-421931 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-636955 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |
| gen-share-609641 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-573907 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |
| gen-share-283311 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | numeric_direct | OFFICIAL_FIELD_LIST | generated | — |
| gen-grad-815768 | 2 | Graph interpretation | Transfer | Everyday context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_FIELD_LIST | generated | — |

## D04 — Probability & Statistics Foundations (36 items)

**Official status:** OFFICIAL_FIELD_LIST, PREREQUISITE — evidence: PDF p. 53 (sample size / statistical significance); field list p. 33.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| acov-sampling-01 | 2 | Argumentation | Evidence judgement | Everyday context | evidence_evaluation | classify_situation | critique_reasoning | PREPARATION_EXTENSION | authored | — |
| acov-sampling-02 | 4 | Argumentation | Evidence judgement | Everyday context | evidence_evaluation | explain_or_critique | critique_reasoning | PREPARATION_EXTENSION | authored | — |
| gen-stat-550356 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prob-397498 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-baserate-590840 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | interpret_representation | statement_compare | PREREQUISITE | generated (exact) | — |
| gen-stat-681504 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prob-765523 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-baserate-551365 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | interpret_representation | statement_compare | PREREQUISITE | generated (exact) | — |
| gen-stat-758083 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prob-292609 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-baserate-736680 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | interpret_representation | statement_compare | PREREQUISITE | generated (exact) | — |
| gen-stat-730277 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prob-638397 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-baserate-116042 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | interpret_representation | statement_compare | PREREQUISITE | generated (exact) | — |
| gen-stat-601449 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prob-967895 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-baserate-587752 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | interpret_representation | statement_compare | PREREQUISITE | generated (exact) | — |
| gen-stat-contrast-311586 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | general_case | statement_compare | PREREQUISITE | generated | — |
| gen-prob-280613 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-baserate-775999 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | interpret_representation | statement_compare | PREREQUISITE | generated (exact) | — |
| gen-stat-792213 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prob-733224 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-baserate-389091 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | interpret_representation | statement_compare | PREREQUISITE | generated (exact) | — |
| gen-stat-contrast-758959 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | general_case | statement_compare | PREREQUISITE | generated | — |
| gen-prob-570275 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-baserate-657732 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | interpret_representation | statement_compare | PREREQUISITE | generated (exact) | — |
| gen-stat-221173 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prob-461223 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-baserate-264578 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | interpret_representation | statement_compare | PREREQUISITE | generated (exact) | — |
| gen-stat-161465 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prob-545269 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-stat-865191 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prob-825104 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-baserate-738753 | 4 | Analysis | Routine procedure | Everyday context | conceptual_discrimination | interpret_representation | statement_compare | PREREQUISITE | generated (exact) | — |
| gen-stat-651998 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-prob-360254 | 2 | Calculation | Routine procedure | Everyday context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |

## D05 — Physics Fundamentals (26 items)

**Official status:** OFFICIAL_FIELD_LIST, PREREQUISITE — evidence: PDF pp. 40–47 require p = F/A, density, weight force and compressible air.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| acov-density-01 | 1 | Argumentation | Basic recall | Scientific context | recall_structure | execute_rule | critique_reasoning | PREREQUISITE | authored | S-hyd-2 |
| acov-density-02 | 3 | Argumentation | Quantitative literacy | Scientific context | multi_step_application | execute_rule | critique_reasoning | PREREQUISITE | authored | S-phys-1 |
| gen-workpower-792495 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-forcept-239168 | 3 | Calculation | Quantitative literacy | Scientific context | multi_step_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-workpower-885923 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-press-835067 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-workpower-413185 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-forcept-352714 | 3 | Calculation | Quantitative literacy | Scientific context | multi_step_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-workpower-100344 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-forcept-957415 | 3 | Calculation | Quantitative literacy | Scientific context | multi_step_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-workpower-172415 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-press-715625 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-workpower-304384 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-forcept-294748 | 3 | Calculation | Quantitative literacy | Scientific context | multi_step_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-workpower-949615 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-forcept-525510 | 3 | Calculation | Quantitative literacy | Scientific context | multi_step_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-workpower-676632 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-forcept-341563 | 3 | Calculation | Quantitative literacy | Scientific context | multi_step_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-workpower-424136 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-forcept-418174 | 3 | Calculation | Quantitative literacy | Scientific context | multi_step_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-workpower-182345 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-press-850754 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-workpower-643772 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-press-704737 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |
| gen-workpower-823964 | 2 | Calculation | Routine procedure | Scientific context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-forcept-593163 | 3 | Calculation | Quantitative literacy | Scientific context | multi_step_application | execute_rule | numeric_direct | PREREQUISITE | generated | — |

## D06 — Hydrostatics & Fluid Concepts (112 items)

**Official status:** OFFICIAL_SAMPLE, PREREQUISITE — evidence: PDF pp. 40–47.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| adv-hyd-01 | 6 | Classification of a case | Model critique | Technical context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored (advanced) | S-hyd-1 |
| ac06-01 | 5 | Argumentation | Model critique | Technical context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-hyd-1 |
| ac06-02 | 5 | Argumentation | Model critique | Technical context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-hyd-1 |
| ac06-03 | 5 | Argumentation | Model critique | Technical context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-hyd-2 |
| ac06-04 | 4 | Argumentation | Routine procedure | Technical context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-hyd-1 |
| gen-hydrop-860427 | 2 | Calculation | Quantitative literacy | Technical context | estimation_scaling | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrostmt-524432 | 4 | Analysis | Routine procedure | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydromass-721583 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-hydroair-167929 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrosuction-380507 | 5 | Selecting relevant information | Model critique | Technical context | conceptual_discrimination | general_case | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrodens-630750 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-374454 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrobubble-536218 | 5 | Argumentation | Reasoning under uncertainty | Technical context | causal_reasoning | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-press-201028 | 3 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | interpret_representation | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrop-963834 | 2 | Calculation | Quantitative literacy | Technical context | estimation_scaling | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrodiff-369423 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydromass-330362 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-hydroair-350556 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrosuction-num-481473 | 4 | Calculation | Quantitative literacy | Technical context | estimation_scaling | effect_of_change | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrodens-301964 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-792183 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrobubble-902189 | 5 | Argumentation | Reasoning under uncertainty | Technical context | causal_reasoning | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-press-122409 | 3 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | interpret_representation | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrop-735268 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrostmt-846941 | 4 | Analysis | Routine procedure | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydromass-934405 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-hydroair-243380 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrosuction-463492 | 5 | Selecting relevant information | Model critique | Technical context | conceptual_discrimination | general_case | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrodens-671036 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-131982 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrobubble-995054 | 5 | Argumentation | Reasoning under uncertainty | Technical context | causal_reasoning | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-press-723472 | 3 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | interpret_representation | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrop-589055 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrostmt-774237 | 4 | Analysis | Routine procedure | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydromass-137786 | 2 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-hydroair-227091 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrosuction-509681 | 5 | Selecting relevant information | Model critique | Technical context | conceptual_discrimination | general_case | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrodens-853022 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-763620 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrobubble-250886 | 5 | Argumentation | Reasoning under uncertainty | Technical context | causal_reasoning | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-press-321076 | 3 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | interpret_representation | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrop-398280 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrodiff-316800 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydromass-321099 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-hydroair-551506 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrosuction-810468 | 5 | Selecting relevant information | Model critique | Technical context | conceptual_discrimination | general_case | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrodens-876678 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-171468 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrobubble-868118 | 5 | Argumentation | Reasoning under uncertainty | Technical context | causal_reasoning | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-press-998956 | 3 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | interpret_representation | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrop-992290 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrodiff-547776 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydromass-493011 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-hydroair-641216 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrosuction-num-874132 | 4 | Calculation | Quantitative literacy | Technical context | estimation_scaling | effect_of_change | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrodens-356338 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-191897 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrobubble-290679 | 5 | Argumentation | Reasoning under uncertainty | Technical context | causal_reasoning | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-frac-589001 | 4 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | classify_situation | missing_information | OFFICIAL_SAMPLE | generated | — |
| gen-hydrop-249131 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrostmt-998746 | 4 | Analysis | Routine procedure | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydromass-445582 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (irrelevant-data) | — |
| gen-hydroair-578492 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrosuction-num-488935 | 4 | Calculation | Quantitative literacy | Technical context | estimation_scaling | effect_of_change | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrodens-298016 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-339244 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-press-499484 | 3 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | interpret_representation | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrop-815349 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrostmt-350236 | 4 | Analysis | Routine procedure | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydromass-713450 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (irrelevant-data) | — |
| gen-hydroair-697889 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrosuction-num-825873 | 4 | Calculation | Quantitative literacy | Technical context | estimation_scaling | effect_of_change | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrodens-188625 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-579672 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrobubble-233015 | 5 | Argumentation | Reasoning under uncertainty | Technical context | causal_reasoning | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-frac-678846 | 4 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | classify_situation | missing_information | OFFICIAL_SAMPLE | generated | — |
| gen-hydrop-998706 | 1 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrodiff-586468 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydromass-191118 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated | — |
| gen-hydroair-178809 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrosuction-997536 | 5 | Selecting relevant information | Model critique | Technical context | conceptual_discrimination | general_case | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrodens-680008 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-225143 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrobubble-361715 | 5 | Argumentation | Reasoning under uncertainty | Technical context | causal_reasoning | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-mass-175974 | 4 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | interpret_representation | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrop-552126 | 2 | Calculation | Quantitative literacy | Technical context | estimation_scaling | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydrostmt-592086 | 4 | Analysis | Routine procedure | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydromass-609165 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (irrelevant-data) | — |
| gen-hydroair-640667 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrosuction-629014 | 5 | Selecting relevant information | Model critique | Technical context | conceptual_discrimination | general_case | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrodens-966047 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-316065 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrobubble-302610 | 5 | Argumentation | Reasoning under uncertainty | Technical context | causal_reasoning | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-mass-457185 | 4 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | interpret_representation | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrop-630189 | 2 | Calculation | Quantitative literacy | Technical context | estimation_scaling | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrodiff-207409 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-hydromass-266311 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (irrelevant-data) | — |
| gen-hydroair-143120 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | S-hyd-1 |
| gen-hydrosuction-124670 | 5 | Selecting relevant information | Model critique | Technical context | conceptual_discrimination | general_case | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrodens-303368 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-555937 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrobubble-274501 | 5 | Argumentation | Reasoning under uncertainty | Technical context | causal_reasoning | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-frac-842632 | 4 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | classify_situation | missing_information | OFFICIAL_SAMPLE | generated | — |
| gen-hydrop-273221 | 2 | Calculation | Quantitative literacy | Technical context | estimation_scaling | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrostmt-502837 | 4 | Analysis | Routine procedure | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydromass-518921 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (irrelevant-data) | — |
| gen-hydroair-972228 | 5 | Calculation | Quantitative literacy | Technical context | multi_step_application | explain_or_critique | numeric_direct | OFFICIAL_SAMPLE | generated (approx) | — |
| gen-hydrosuction-350447 | 5 | Selecting relevant information | Model critique | Technical context | conceptual_discrimination | general_case | relevance_filter | OFFICIAL_SAMPLE | generated | — |
| gen-hydrodens-209630 | 3 | Model assessment (effect of a change) | Transfer | Technical context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-hydrostab-446426 | 5 | Analysis | Model critique | Technical context | conceptual_discrimination | general_case | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-hydrobubble-213984 | 5 | Argumentation | Reasoning under uncertainty | Technical context | causal_reasoning | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-hydrorel-frac-613375 | 4 | Selecting relevant information | Routine procedure | Technical context | conceptual_discrimination | classify_situation | missing_information | OFFICIAL_SAMPLE | generated | — |

## D07 — Mechanics & Engineering Reasoning (35 items)

**Official status:** OFFICIAL_FIELD_LIST, PREPARATION_EXTENSION — evidence: PDF pp. 43–47: pump sketch, buoyancy/stability figure, tilting comparison.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| gen-eff-583438 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-lever-800330 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-flow-181395 | 3 | Calculation | Quantitative literacy | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-eff-261831 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-lever-297840 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-flow-600702 | 3 | Calculation | Quantitative literacy | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-eff-358596 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-lever-390000 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-flow-670758 | 3 | Calculation | Quantitative literacy | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-eff-678449 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-advantage-516180 | 2 | Calculation | Routine procedure | Technical context | conceptual_discrimination | general_case | numeric_direct | PREPARATION_EXTENSION | generated | S-phys-1 |
| gen-flow-956223 | 3 | Calculation | Quantitative literacy | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-eff-298167 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-moment-501524 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-flow-422009 | 3 | Calculation | Quantitative literacy | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-eff-416352 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-advantage-475906 | 2 | Calculation | Routine procedure | Technical context | conceptual_discrimination | general_case | numeric_direct | PREPARATION_EXTENSION | generated | S-phys-1 |
| gen-flow-116705 | 3 | Calculation | Quantitative literacy | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-eff-251671 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | S-hyd-2 |
| gen-lever-487715 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-flow-368424 | 3 | Calculation | Quantitative literacy | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-eff-948025 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-lever-524328 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-flow-708750 | 3 | Calculation | Quantitative literacy | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-eff-183361 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | S-hyd-2 |
| gen-advantage-959841 | 2 | Calculation | Routine procedure | Technical context | conceptual_discrimination | general_case | numeric_direct | PREPARATION_EXTENSION | generated | S-hyd-2 |
| gen-flow-515009 | 3 | Calculation | Quantitative literacy | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-eff-353328 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-lever-933411 | 3 | Calculation | Quantitative literacy | Technical context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-flow-842984 | 3 | Calculation | Quantitative literacy | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-eff-920544 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-advantage-102396 | 2 | Calculation | Routine procedure | Technical context | conceptual_discrimination | general_case | numeric_direct | PREPARATION_EXTENSION | generated | S-phys-1 |
| gen-eff-252451 | 2 | Calculation | Routine procedure | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-advantage-567045 | 2 | Calculation | Routine procedure | Technical context | conceptual_discrimination | general_case | numeric_direct | PREPARATION_EXTENSION | generated | S-phys-1 |
| gen-flow-818080 | 3 | Calculation | Quantitative literacy | Technical context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |

## D08 — Computational & Algorithmic Reasoning (36 items)

**Official status:** OFFICIAL_FIELD_LIST, PREPARATION_EXTENSION — evidence: PDF p. 33 field list only — no sample question is published.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| adv-comp-01 | 6 | Argumentation | Quantitative literacy | Computational context | estimation_scaling | general_case | critique_reasoning | PREPARATION_EXTENSION | authored (advanced, extension) | — |
| acov-debug-01 | 3 | Argumentation | Routine procedure | Computational context | conceptual_discrimination | explain_or_critique | critique_reasoning | PREPARATION_EXTENSION | authored | — |
| acov-debug-02 | 4 | Argumentation | Transfer | Computational context | parameter_reasoning | effect_of_change | critique_reasoning | PREPARATION_EXTENSION | authored | — |
| gen-bin-847700 | 2 | Calculation | Routine procedure | Computational context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-946615 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-complex-371416 | 3 | Calculation | Quantitative literacy | Computational context | estimation_scaling | effect_of_change | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-bin-901343 | 2 | Calculation | Routine procedure | Computational context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-454063 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-complex-904820 | 3 | Calculation | Quantitative literacy | Computational context | estimation_scaling | effect_of_change | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-bin-203645 | 2 | Calculation | Routine procedure | Computational context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-549298 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-complex-471981 | 3 | Calculation | Quantitative literacy | Computational context | estimation_scaling | effect_of_change | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-bin-661048 | 2 | Calculation | Routine procedure | Computational context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-336422 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-complex-414720 | 3 | Calculation | Quantitative literacy | Computational context | estimation_scaling | effect_of_change | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-bin-695939 | 2 | Calculation | Routine procedure | Computational context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-278580 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-complex-863165 | 3 | Calculation | Quantitative literacy | Computational context | estimation_scaling | effect_of_change | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-bin-383928 | 2 | Calculation | Routine procedure | Computational context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-811097 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-complex-117168 | 3 | Calculation | Quantitative literacy | Computational context | estimation_scaling | effect_of_change | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-bin-530091 | 2 | Calculation | Routine procedure | Computational context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-508089 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-complex-684530 | 3 | Calculation | Quantitative literacy | Computational context | estimation_scaling | effect_of_change | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-bin-400298 | 2 | Calculation | Routine procedure | Computational context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-249697 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-complex-587869 | 3 | Calculation | Quantitative literacy | Computational context | estimation_scaling | effect_of_change | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-bin-683339 | 2 | Calculation | Routine procedure | Computational context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-935497 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-bin-598109 | 2 | Calculation | Routine procedure | Computational context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-208117 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-complex-809419 | 3 | Calculation | Quantitative literacy | Computational context | estimation_scaling | effect_of_change | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-128810 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-complex-464042 | 3 | Calculation | Quantitative literacy | Computational context | estimation_scaling | effect_of_change | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-bin-177537 | 2 | Calculation | Routine procedure | Computational context | rule_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-loop-353694 | 2 | Calculation | Quantitative literacy | Computational context | multi_step_application | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |

## D09 — Business Mathematics & Optimisation (95 items)

**Official status:** OFFICIAL_SAMPLE, PREREQUISITE — evidence: PDF pp. 48–52.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| adv-eoq-01 | 7 | Analysis | Model critique | Economic context | optimisation_reasoning | general_case | statement_compare | OFFICIAL_SAMPLE | authored (advanced, multi-concept) | — |
| acov-assume-01 | 3 | Argumentation | Routine procedure | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-eoq-1 |
| acov-assume-02 | 5 | Argumentation | Transfer | Economic context | parameter_reasoning | effect_of_change | critique_reasoning | OFFICIAL_SAMPLE | authored | S-econ-1 |
| ac09-01 | 5 | Argumentation | Model critique | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-eoq-1 |
| ac09-02 | 5 | Argumentation | Model critique | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-eoq-1 |
| ac09-03 | 5 | Argumentation | Model critique | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-eoq-1 |
| ac09-04 | 5 | Argumentation | Model critique | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | authored | S-eoq-1 |
| gen-eoq-inv-668380 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-880336 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-600168 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-219118 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-dir-214002 | 4 | Analysis | Transfer | Economic context | parameter_reasoning | effect_of_change | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-543390 | 3 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-half-723330 | 3 | Argumentation | Routine procedure | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-sens-363073 | 6 | Model assessment (effect of a change) | Model critique | Economic context | optimisation_reasoning | general_case | effect_direction | PREPARATION_EXTENSION | generated (extension, exact) | — |
| gen-eoq-859349 | 2 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-124885 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-876802 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-547327 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-dir-272770 | 4 | Analysis | Transfer | Economic context | parameter_reasoning | effect_of_change | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-472160 | 3 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-half-525797 | 3 | Argumentation | Routine procedure | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-sens-147729 | 6 | Model assessment (effect of a change) | Model critique | Economic context | optimisation_reasoning | general_case | effect_direction | PREPARATION_EXTENSION | generated (extension, exact) | — |
| gen-eoq-inv-743249 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-910383 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-996485 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-237492 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-dir-375839 | 4 | Analysis | Transfer | Economic context | parameter_reasoning | effect_of_change | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-701682 | 3 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-half-418793 | 3 | Argumentation | Routine procedure | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-sens-314954 | 6 | Model assessment (effect of a change) | Model critique | Economic context | optimisation_reasoning | general_case | effect_direction | PREPARATION_EXTENSION | generated (extension, exact) | — |
| gen-eoq-565702 | 2 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-752208 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-932651 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-217525 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-dir-249037 | 4 | Analysis | Transfer | Economic context | parameter_reasoning | effect_of_change | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-577519 | 4 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-sens-207122 | 6 | Model assessment (effect of a change) | Model critique | Economic context | optimisation_reasoning | general_case | effect_direction | PREPARATION_EXTENSION | generated (extension, exact) | — |
| gen-eoq-152408 | 2 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-426437 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-552137 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-668729 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-dir-834779 | 4 | Analysis | Transfer | Economic context | parameter_reasoning | effect_of_change | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-240131 | 3 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-half-167374 | 3 | Argumentation | Routine procedure | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-sens-542351 | 6 | Model assessment (effect of a change) | Model critique | Economic context | optimisation_reasoning | general_case | effect_direction | PREPARATION_EXTENSION | generated (extension, exact) | — |
| gen-eoq-668316 | 2 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-914180 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-330853 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-655849 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-dir-511368 | 4 | Analysis | Transfer | Economic context | parameter_reasoning | effect_of_change | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-461766 | 3 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-half-613672 | 3 | Argumentation | Routine procedure | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-sens-888112 | 6 | Model assessment (effect of a change) | Model critique | Economic context | optimisation_reasoning | general_case | effect_direction | PREPARATION_EXTENSION | generated (extension, exact) | — |
| gen-eoq-inv-895442 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-286821 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-293209 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-300211 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-dir-734451 | 4 | Analysis | Transfer | Economic context | parameter_reasoning | effect_of_change | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-971858 | 3 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-half-291184 | 3 | Argumentation | Routine procedure | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-sens-865828 | 6 | Model assessment (effect of a change) | Model critique | Economic context | optimisation_reasoning | general_case | effect_direction | PREPARATION_EXTENSION | generated (extension, exact) | — |
| gen-eoq-664757 | 2 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-718951 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-524266 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-852252 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-dir-739844 | 4 | Analysis | Transfer | Economic context | parameter_reasoning | effect_of_change | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-967116 | 3 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-sens-154740 | 6 | Model assessment (effect of a change) | Model critique | Economic context | optimisation_reasoning | general_case | effect_direction | PREPARATION_EXTENSION | generated (extension, exact) | — |
| gen-eoq-296639 | 2 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-607792 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-576932 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-422666 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-111999 | 3 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-258182 | 2 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-352623 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-308641 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-345373 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-dir-122773 | 4 | Analysis | Transfer | Economic context | parameter_reasoning | effect_of_change | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-132727 | 3 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-sens-278644 | 6 | Model assessment (effect of a change) | Model critique | Economic context | optimisation_reasoning | general_case | effect_direction | PREPARATION_EXTENSION | generated (extension, exact) | — |
| gen-eoq-559927 | 2 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-345465 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-441484 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-400772 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-dir-267520 | 4 | Analysis | Transfer | Economic context | parameter_reasoning | effect_of_change | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-792052 | 4 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-half-409347 | 3 | Argumentation | Routine procedure | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-inv-549265 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-tc-471664 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-freq-313192 | 3 | Calculation | Quantitative literacy | Economic context | multi_step_application | execute_rule | numeric_direct | OFFICIAL_SAMPLE | generated (exact) | — |
| gen-eoq-scale-983328 | 4 | Model assessment (effect of a change) | Transfer | Economic context | parameter_reasoning | effect_of_change | effect_direction | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-dir-706349 | 4 | Analysis | Transfer | Economic context | parameter_reasoning | effect_of_change | statement_compare | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-curve-836255 | 3 | Graph interpretation | Transfer | Economic context | representation_transfer | interpret_representation | graph_choice | OFFICIAL_SAMPLE | generated | — |
| gen-eoq-half-469018 | 3 | Argumentation | Routine procedure | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | OFFICIAL_SAMPLE | generated | — |

## D10 — Economics Fundamentals (41 items)

**Official status:** OFFICIAL_FIELD_LIST, PREPARATION_EXTENSION — evidence: PDF p. 33 field list; p. 48 names economic cost reasoning.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| adv-econ-01 | 7 | Argumentation | Model critique | Economic context | optimisation_reasoning | classify_situation | critique_reasoning | PREPARATION_EXTENSION | authored (advanced, extension) | — |
| acov-real-01 | 2 | Argumentation | Routine procedure | Economic context | conceptual_discrimination | interpret_representation | critique_reasoning | PREPARATION_EXTENSION | authored | — |
| acov-real-02 | 4 | Argumentation | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | critique_reasoning | PREPARATION_EXTENSION | authored | — |
| acov-marginal-01 | 3 | Argumentation | Reasoning under uncertainty | Economic context | causal_reasoning | classify_situation | critique_reasoning | PREPARATION_EXTENSION | authored | S-econ-1 |
| acov-marginal-02 | 5 | Argumentation | Transfer | Economic context | parameter_reasoning | effect_of_change | critique_reasoning | PREPARATION_EXTENSION | authored | S-econ-1 |
| ac10-01 | 5 | Argumentation | Model critique | Economic context | conceptual_discrimination | explain_or_critique | critique_reasoning | PREPARATION_EXTENSION | authored | S-econ-1 |
| gen-breakeven-105008 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-150614 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-elastic-692255 | 4 | Model assessment (effect of a change) | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | effect_direction | PREPARATION_EXTENSION | generated | — |
| gen-breakeven-435558 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-801114 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-elastic-638567 | 4 | Model assessment (effect of a change) | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | effect_direction | PREPARATION_EXTENSION | generated | — |
| gen-breakeven-103965 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-767004 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-elastic-764038 | 4 | Model assessment (effect of a change) | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | effect_direction | PREPARATION_EXTENSION | generated | — |
| gen-breakeven-436019 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-796271 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-breakeven-174053 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-170422 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-elastic-837413 | 4 | Model assessment (effect of a change) | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | effect_direction | PREPARATION_EXTENSION | generated | — |
| gen-breakeven-679864 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-187166 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-elastic-306518 | 4 | Model assessment (effect of a change) | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | effect_direction | PREPARATION_EXTENSION | generated | — |
| gen-breakeven-273361 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-643792 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-elastic-751363 | 4 | Model assessment (effect of a change) | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | effect_direction | PREPARATION_EXTENSION | generated | — |
| gen-breakeven-494980 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-581621 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-elastic-515643 | 4 | Model assessment (effect of a change) | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | effect_direction | PREPARATION_EXTENSION | generated | — |
| gen-breakeven-596178 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-890437 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-elastic-527965 | 4 | Model assessment (effect of a change) | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | effect_direction | PREPARATION_EXTENSION | generated | — |
| gen-breakeven-177228 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-744644 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-elastic-571688 | 4 | Model assessment (effect of a change) | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | effect_direction | PREPARATION_EXTENSION | generated | — |
| gen-breakeven-570404 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-318097 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-elastic-253255 | 4 | Model assessment (effect of a change) | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | effect_direction | PREPARATION_EXTENSION | generated | — |
| gen-breakeven-561007 | 3 | Calculation | Quantitative literacy | Economic context | optimisation_reasoning | execute_rule | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-oppcost-111196 | 3 | Calculation | Routine procedure | Economic context | conceptual_discrimination | classify_situation | numeric_direct | PREPARATION_EXTENSION | generated | — |
| gen-elastic-445328 | 4 | Model assessment (effect of a change) | Reasoning under uncertainty | Economic context | causal_reasoning | effect_of_change | effect_direction | PREPARATION_EXTENSION | generated | — |

## D11 — Research Methodology & Design (15 items)

**Official status:** OFFICIAL_SAMPLE — evidence: PDF pp. 53–56.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| adv-res-01 | 7 | Argumentation | Evidence judgement | Social-science context | evidence_evaluation | general_case | critique_reasoning | OFFICIAL_SAMPLE | authored (advanced, multi-concept) | — |
| acov-phases-01 | 1 | Argumentation | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | critique_reasoning | OFFICIAL_SAMPLE | authored | — |
| acov-phases-02 | 3 | Argumentation | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | critique_reasoning | OFFICIAL_SAMPLE | authored | — |
| a11-01 | 1 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-res-1 |
| a11-02 | 1 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-res-1 |
| a11-03 | 2 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-res-1 |
| a11-04 | 4 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-res-1 |
| a11-05 | 3 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-res-1 |
| a11-06 | 3 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-res-2 |
| a11-07 | 1 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-res-2 |
| a11-08 | 4 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-res-2 |
| a11-09 | 3 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-res-2 |
| a11-10 | 3 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-res-2 |
| a11-11 | 3 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-arg-1 |
| a11-12 | 2 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | S-arg-1 |

## D12 — Social-Science Reasoning & Causal Inference (13 items)

**Official status:** OFFICIAL_FIELD_LIST, PREPARATION_EXTENSION — evidence: PDF pp. 53–56.

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| acov-level-01 | 2 | Argumentation | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | critique_reasoning | OFFICIAL_FIELD_LIST | authored | — |
| acov-level-02 | 4 | Argumentation | Evidence judgement | Social-science context | evidence_evaluation | general_case | critique_reasoning | OFFICIAL_FIELD_LIST | authored | — |
| a12-01 | 4 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | PREPARATION_EXTENSION | authored | — |
| a12-02 | 3 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | PREPARATION_EXTENSION | authored | — |
| a12-03 | 3 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | PREPARATION_EXTENSION | authored | — |
| a12-04 | 5 | Classification of a case | Model critique | Social-science context | conceptual_discrimination | classify_situation | statement_compare | PREPARATION_EXTENSION | authored | — |
| a12-05 | 5 | Classification of a case | Model critique | Social-science context | conceptual_discrimination | classify_situation | statement_compare | PREPARATION_EXTENSION | authored | — |
| a12-06 | 2 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | — |
| a12-07 | 4 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | PREPARATION_EXTENSION | authored | — |
| a12-08 | 5 | Classification of a case | Model critique | Social-science context | conceptual_discrimination | classify_situation | statement_compare | PREPARATION_EXTENSION | authored | — |
| a12-09 | 3 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | PREPARATION_EXTENSION | authored | — |
| a12-10 | 2 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | OFFICIAL_SAMPLE | authored | — |
| a12-11 | 4 | Classification of a case | Routine procedure | Social-science context | conceptual_discrimination | classify_situation | statement_compare | PREPARATION_EXTENSION | authored | — |

## D13 — Scientific Reasoning, Models & Estimation (23 items)

**Official status:** OFFICIAL_FIELD_LIST, PREPARATION_EXTENSION — evidence: PDF p. 45 (simplified vs. precise calculation), pp. 48 (assumption list).

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| adv-sci-01 | 7 | Model assessment (effect of a change) | Quantitative literacy | Scientific context | estimation_scaling | effect_of_change | effect_direction | PREPARATION_EXTENSION | authored (advanced, extension) | — |
| acov-precision-01 | 2 | Argumentation | Routine procedure | Scientific context | conceptual_discrimination | interpret_representation | critique_reasoning | OFFICIAL_FIELD_LIST | authored | — |
| acov-precision-02 | 5 | Argumentation | Quantitative literacy | Scientific context | estimation_scaling | general_case | critique_reasoning | OFFICIAL_FIELD_LIST | authored | — |
| a13-01 | 4 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | S-comp-1 |
| a13-02 | 5 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | S-comp-1 |
| a13-03 | 4 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | S-comp-1 |
| a13-04 | 4 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | S-comp-1 |
| a13-05 | 5 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | S-comp-1 |
| a13-06 | 5 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |
| a13-07 | 4 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |
| a13-08 | 4 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |
| gen-scaling-607790 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |
| gen-scaling-450580 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |
| gen-scaling-314027 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |
| gen-scaling-906249 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |
| gen-scaling-825237 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |
| gen-scaling-276808 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |
| gen-scaling-294667 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |
| gen-scaling-209772 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |
| gen-scaling-622335 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |
| gen-scaling-319285 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |
| gen-scaling-917947 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |
| gen-scaling-635073 | 4 | Analysis | Routine procedure | Scientific context | conceptual_discrimination | general_case | statement_compare | PREPARATION_EXTENSION | generated | — |

## D14 — Experimental & Evidence-Based Reasoning (8 items)

**Official status:** OFFICIAL_FIELD_LIST, PREPARATION_EXTENSION — evidence: PDF p. 53 (case vs. sample, significance).

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| acov-replicate-01 | 2 | Argumentation | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | critique_reasoning | OFFICIAL_FIELD_LIST | authored | — |
| acov-replicate-02 | 4 | Argumentation | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | critique_reasoning | OFFICIAL_FIELD_LIST | authored | — |
| a14-01 | 3 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |
| a14-02 | 3 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |
| a14-03 | 4 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |
| a14-04 | 4 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |
| a14-05 | 4 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |
| a14-06 | 3 | Analysis | Evidence judgement | Scientific context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |

## D15 — Argument & Text Reasoning (humanities style) (9 items)

**Official status:** OFFICIAL_FIELD_LIST, PREPARATION_EXTENSION — evidence: PDF pp. 37 (Q8), 53–56 (conceptual discrimination items).

| Id | Lvl | Activity | Skill | Setting | Reasoning | Move | Style | Label | Family | Official example |
|---|---|---|---|---|---|---|---|---|---|---|
| adv-arg-01 | 6 | Formula transformation | Reasoning under uncertainty | Social-science context | logical_deduction | general_case | reverse_question | PREPARATION_EXTENSION | authored (advanced, extension) | — |
| acov-claim-01 | 2 | Argumentation | Evidence judgement | Social-science context | evidence_evaluation | general_case | critique_reasoning | OFFICIAL_FIELD_LIST | authored | — |
| acov-claim-02 | 5 | Argumentation | Evidence judgement | Social-science context | evidence_evaluation | general_case | critique_reasoning | OFFICIAL_FIELD_LIST | authored | — |
| a15-01 | 2 | Analysis | Evidence judgement | Social-science context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | S-arg-1 |
| a15-02 | 5 | Analysis | Evidence judgement | Social-science context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | S-arg-1 |
| a15-03 | 4 | Analysis | Evidence judgement | Social-science context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | S-arg-1 |
| a15-04 | 3 | Analysis | Evidence judgement | Social-science context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |
| a15-05 | 2 | Analysis | Evidence judgement | Social-science context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |
| a15-06 | 4 | Analysis | Evidence judgement | Social-science context | evidence_evaluation | explain_or_critique | statement_compare | PREPARATION_EXTENSION | authored | — |
