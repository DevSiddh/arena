# Curriculum map — 15 preparation domains, with confidence labels

Labels (used identically in the app UI, in the lesson pages and in every question's metadata):

| Label | Meaning |
|---|---|
| `OFFICIAL_SAMPLE` | Directly demonstrated by one of the four official sample exercises |
| `OFFICIAL_FIELD_LIST` | The official instructions name this area as potentially covered, but show no sample |
| `PREREQUISITE` | Needed to understand a demonstrated concept |
| `PREPARATION_EXTENSION` | Our reasoned extension; **not** a claim about the dMAT syllabus |
| `EXCLUDED_SPECULATIVE` | Deliberately not taught as exam preparation; recorded so the boundary is explicit |

Official wording behind `OFFICIAL_FIELD_LIST` (PDF p. 33): *"The possible topics of the tasks in the actual exam cover a variety of areas including mathematics, computational sciences, natural sciences, engineering, business administration, economics, social sciences and humanities."*

---

## A. The four official domains (deep treatment)

### D02 · Vector & quantitative mathematics — `OFFICIAL_SAMPLE`
*Official evidence:* Exercise 1, 8 questions, taught through a coordinate figure and a formula table (scalar, vector and triple product).
*Prerequisite chain:* number & sign sense → coordinate plane → Pythagoras → (vector) components, magnitude, add/subtract, scalar multiple → dot product → angle & perpendicularity → cross product → area → triple product → coplanarity.
*Why it belongs:* it is the only mathematics domain the official material demonstrates in full.
*Excluded as unnecessary:* unit-vector/basis notation, projection formula as a separate object, matrix algebra, abstract vector spaces, linear independence proofs.

### D06 · Hydrostatics & fluid concepts — `OFFICIAL_SAMPLE`
*Official evidence:* Exercise 2, 6 questions, with the law `p = ρgh + p₀`, the 1 bar/10 m simplification, buoyancy balance `F_G = F_B`, and two figures.
*Prerequisite chain:* force/area/pressure → mass/density/weight → pressure grows with depth → gauge vs. total pressure → buoyancy as pressure difference → displaced volume & mass → floating/submerged equilibrium → (extension) gas compressibility, suction lift, stability.
*Why it belongs:* demonstrated, and unusually transfer-friendly (a single law explains ships, submarines, pumps, bubbles).

### D09 · Business mathematics & optimisation (EOQ) — `OFFICIAL_SAMPLE`
*Official evidence:* Exercise 3, 7 questions, with the assumption list, the cost structure, `Q* = √(2DS/H)`, the parameter-scaling item and the cost-curve figure.
*Prerequisite chain:* rate × time thinking → inventory as a sawtooth → average of a linear fall = Q/2 → order frequency D/Q → cost terms → trade-off → balance point → square-root scaling.
*Extension inside the same domain (labelled):* economic order interval, reorder points, quantity-discount break-even reasoning, sensitivity of total cost to non-optimal Q (the flat-bottom property).
*Excluded:* stochastic inventory models, safety stock formulas, MRP — beyond a "know it exists" note.

### D11 · Research methodology — `OFFICIAL_SAMPLE`
*Official evidence:* Exercise 4, 6 questions, entirely conceptual.
*Prerequisite chain:* description vs. explanation → factor/outcome → relationship vs. mechanism → deduction vs. induction → standardised vs. open procedures → sample vs. case → generalisation vs. transferability → documentation & phase order.
*Why it belongs:* the only social-science domain demonstrated; also the test's clearest example of *pure concept discrimination* items.

## B. Officially named fields beyond the samples

### D01 · Mathematical & quantitative reasoning — `OFFICIAL_FIELD_LIST` (mathematics) + `PREREQUISITE`
Ratios, percentages, proportional reasoning, rates, mental arithmetic, estimation, unit conversion, rounding, order-of-magnitude sanity checks. *Justification:* every official item requires it (e.g. 10,000 m → 1,000 bar; 1800·50/2 → 300), and the no-notes rule makes mental arithmetic part of the construct.

### D03 · Data interpretation, tables & graphs — `OFFICIAL_FIELD_LIST` (mathematics/computational sciences) + `PREREQUISITE`
Reading values, gradients, intercepts, break-even points, misreading axes, per-capita vs. absolute, log-vs-linear intuition, table arithmetic. *Justification:* official questions are built on figures (grid diagram, cost curves, hull sketch) and the instructions say tables and figures may appear.

### D04 · Probability & statistics foundations — `OFFICIAL_FIELD_LIST` (mathematics) + `PREREQUISITE`
Mean/median/spread, base rates, conditional framing, sampling, significance vs. effect size, correlation vs. causation. *Justification:* required by the official research-methods text (sample size, statistical significance) and a natural source of transfer items.

### D05 · Physics fundamentals — `OFFICIAL_FIELD_LIST` (natural sciences) + `PREREQUISITE`
Units and dimensional consistency, force, work/energy/power, density, pressure basics, ideal-gas intuition, efficiency. *Justification:* direct prerequisite of D06 and of the pump/gas items.

### D07 · Mechanics & engineering reasoning — `OFFICIAL_FIELD_LIST` (engineering) + `PREPARATION_EXTENSION`
Levers and moments, equilibrium, centre of gravity, stability, stress/load intuition, simple machines, flow rate/continuity, gear and ratio reasoning. *Justification:* the official stability item and pump sketch already demand static-equilibrium reasoning; the official field list names engineering.

### D08 · Computational & algorithmic reasoning — `OFFICIAL_FIELD_LIST` (computational sciences) + `PREPARATION_EXTENSION`
Following an algorithm, tracing loops, complexity intuition (growth of n vs. n log n), pseudocode reading, binary/decimal, error detection in procedures, simple recursion. *Justification:* officially named area; questions can be presented in the same input+questions format without requiring programming.

### D10 · Economics fundamentals — `OFFICIAL_FIELD_LIST` (economics) + `PREPARATION_EXTENSION`
Opportunity cost, marginal reasoning, supply/demand shifts, elasticity intuition, cost/revenue/profit, break-even, inflation/real-vs-nominal, comparative advantage basics. *Justification:* officially named, and business-administration content is one of the officially named areas; also supports the EOQ domain's "why" questions.

### D12 · Social-science reasoning & causal inference — `OFFICIAL_FIELD_LIST` (social sciences) + `PREPARATION_EXTENSION`
Confounders, selection effects, ecologic vs. individual reasoning, mechanism vs. effect, validity, operationalisation, theory use. *Justification:* extends the demonstrated research-methods domain into the scenarios the official Exercise 4 question 4 already uses.

### D13 · Scientific reasoning, models & estimation — `OFFICIAL_FIELD_LIST` (natural sciences) + `PREPARATION_EXTENSION`
Model assumptions and their violation, idealisation, proportionality and scaling laws, orders of magnitude, Fermi estimation, falsifiability, precision vs. accuracy. *Justification:* the official hydrostatics solution explicitly reasons about "a simplified model" vs. "a precise calculation", and the EOQ text is an exercise in model assumptions.

### D14 · Experimental & evidence-based reasoning — `OFFICIAL_FIELD_LIST` (natural sciences / social sciences) + `PREPARATION_EXTENSION`
Controls, randomisation, blinding, placebo, sample size vs. precision, replication, evidence hierarchies, interpreting conflicting studies. *Justification:* the natural partner to the demonstrated research-methods domain; both official texts reason about what data can and cannot show.

### D15 · Argument & text reasoning (humanities style) — `OFFICIAL_FIELD_LIST` (humanities) + `PREPARATION_EXTENSION`
Main claim vs. support, necessary/sufficient conditions, quantifier precision ("all/at least one/only"), inference validity, straw-man detection, comparing two positions. *Justification:* the official material explicitly includes humanities, and the official "which statement is correct for all possible cases" item (Ex1 Q8) is exactly this skill in mathematical clothing.

## C. Deliberately excluded (kept visible)

`EXCLUDED_SPECULATIVE`: Core Module subtests (figure sequences, mathematical equations, Latin squares) as *exam content* — out of Subject-Module scope; German-language skills; discipline-specific advanced syllabi (organic chemistry, circuit theory, machine learning maths, financial derivatives pricing); memorised fact banks (dates, definitions, constants beyond ρ_water, g, 1 bar ≈ 10 m); any claim about how many questions of each topic appear in the real test.
