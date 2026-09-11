# Source Analysis — official dMAT preparatory PDF

**Source file:** `260902_dMAT_General-Academic-Module_Preparatoy-Materials_EN.pdf`
**Publisher:** g.a.s.t. — Gesellschaft für Akademische Studienvorbereitung und Testentwicklung e.V. / TestDaF-Institut, Bochum
**Document date (on every page footer):** "as at: 02.09.2026"
**PDF metadata:** author `Podlaha, Thomas`, produced with Microsoft Word 2016, creation date `2026-09-04`
**Scope inspected:** all 57 pages. Part A = Core Module (pp. 6–31). Part B = **Subject Module (pp. 32–56)**, which is the subject of this project.
**Extraction artefacts:** `research/official_dmat_source.txt` (page-tagged text, produced with PyMuPDF), `research/pages/*.png` (rendered pages used to read diagrams and figures that do not survive text extraction).

Everything quoted below is verbatim from the PDF unless marked *(paraphrase)*. Page numbers are the PDF page number; the printed page number differs by 1 (printed page = PDF page − 1).

---

## 1. What the official material says about the Subject Module (evidence)

### 1.1 General instructions — PDF p. 33 (printed p. 32)

| Official wording (verbatim) | What it fixes for us |
|---|---|
| "In this task type you see a text and a number of questions which you have to answer. There are 4 answer options for each question." | Input text + question set; **exactly 4 options** |
| "For each question, there is only one correct solution." | **Exactly one correct answer** |
| "The text, the questions and the answer options may contain figures, tables and formulas." | Diagrams, tables and formulas are first-class question material |
| "For working on the entire subject test in the exam, you have 90 minutes in total." | **90 minutes** for the whole Subject Module |
| "If you do not know an answer, please guess which answer might be correct." | No negative marking is implied; guessing is advised |
| "You are not allowed to take notes in the exam." | No scratchpad in exam mode |
| "Please note that the sample questions do not necessarily reflect the difficulty level of the questions on the actual test." | Sample **difficulty is not the calibration target** |
| "Furthermore, the questions represent only a selection of the possible topics that may be covered." | The 4 samples are **not** the syllabus |
| "The possible topics of the tasks in the actual exam cover a variety of areas including **mathematics, computational sciences, natural sciences, engineering, business administration, economics, social sciences and humanities**." | Official **field list** — the only official statement about breadth |

### 1.2 Structure — PDF pp. 5–6

- "The dMAT consists of two parts: A Core Module that tests general cognitive and analytical skills, and a Subject Module that tests the ability to apply these cognitive and analytical skills to academic problem solving."
- "The duration of the exam itself is about three hours with a break of 30 minutes between the two parts of the exam."
- "The tasks in the Subject Module are knowledge-based and consist of a combination of a typical subject-related problem (input) and corresponding single-choice questions. **The dMAT therefore requires developed transfer and application skills, rather than memorised factual knowledge.**"
- Core Module subtests (context only): Figure Sequences (25 min / 20 series), Mathematical Equations (25 min / 20 systems, letters are integers 1–20), Latin Squares. The **Core Module is out of scope for this project**; the product targets the Subject Module.

### 1.3 Import from the wider rollout (external context, *not* from the PDF)

The PDF itself never mentions India or APS. Public information about the Indian rollout (APS India / d-mat.de announcements of 29 June 2026, widely reported) establishes: for the summer-semester-2027 intake onwards, applicants whose previous degree is in engineering, commerce, accounting, finance, economics, business or management take the dMAT with the **General Academic Module** as the subject module. The preparatory PDF inspected here *is* that General Academic Module material. This project therefore builds for the **General Academic Module**, which is the module this official PDF documents.

**Fidelity rule adopted:** claims about test content come from the PDF only. APS/India process facts are kept out of the learning content except in the onboarding screen, where they are marked as external context.

---

## 2. The four official sample exercises — full inventory

Each exercise = one input text (teaching the domain) + a set of single-choice questions with an official solution block. The official answers and the reasoning style of every official solution are recorded below, because these are the authority for the curriculum.

### Exercise 1 — Vector Calculations (PDF pp. 34–39)

**Input text teaches:** scalars vs. vectors; n components; focus on 2D/3D; Figure 1 = a 2D vector with length computed by Pythagoras; component-wise addition and subtraction; scalar multiplication (|scalar| > 1 lengthens, 0 < |scalar| < 1 shortens); length via Pythagoras / its generalisation; Table 1 gives scalar product (component form + `|a||b|cos φ`), vector product (determinant-style rule + `|a×b| = |a||b| sin φ, 0 ≤ φ ≤ π`), and triple product `[a b c] = a·(b×c)`.

**Questions (official answers in bold):**

| # | Stem (abridged) | Options | Official answer | Skills demanded |
|---|---|---|---|---|
| 1 | `s = a + b − c` for vectors read **off a coordinate diagram** (a=(1,3), b=(5,1), c=(1,−2)) | (5,6) / (7,2) / (5,2) / (7,6) | **A** | read a graph → extract components → component-wise arithmetic with a **subtracted** negative |
| 2 | "What statement is true when a vector is multiplied by the number −2?" | 4 combos of {length doubles/halves} × {direction same/reversed} | **C** | interpret |scalar| for magnitude and sign for direction |
| 3 | Which statement about result *types* is correct? | 4 combos of scalar/vector results | **B** | know the **type** of each product (scalar·scalar, vector·vector, scalar) |
| 4 | Scalar product of (1,2,3) and (4,5,6) | 21 / 32 / √14+√77 / 126 | **B** | execute the rule; distractors = |a|+|b|-style and |a||b|-style errors |
| 5 | Angle between (1,2) and (2,1) expressed as arccos(...) | arccos(4/5), arccos(4/√5), arccos(5/4), arccos(4/√3) | **A** | rearrange `a·b=|a||b|cos φ`; recognise the shared factor √5 |
| 6 | Vector product of (3,2,1) and (6,5,4) | (3,6,3) / (3,−6,3) / (9,7,5) / (18,10,4) | **B** | execute the cross-product rule with **sign tracking** |
| 7 | Area of a parallelogram drawn on a grid, given `|a×b|` = area | √5 / 5 / √10 / 10 | **D** | the official note says the 3D formula may be used with z = 0, i.e. 2×2 determinant; answer from `|3·(−2) − 4·1| = 10` |
| 8 | What is true **in all cases** when the triple product is 0? | coplanar / pairwise perpendicular / two parallel / sum is zero | **A** | distinguish a *generally true* implication from sufficient-but-not-necessary special cases (c and d are sufficient but not "all possible cases") |

**Observations that shape the curriculum.** Q1 is a *representation-transfer* item (picture → symbols). Q2, Q3, Q8 are *concept/statement* items requiring no calculation. Q5 asks for the **answer form** `arccos(...)` — i.e. re-arrangement literacy, not a decimal. Q7 needs the geometric meaning of a product. Q8 is a logic-of-quantifiers item ("all possible cases") — exactly the style the student must be trained for. Distractor design is visible: each wrong option corresponds to a specific procedural error (wrong component order, lost sign, using |a||b| instead of the dot product, forgetting the square root).

### Exercise 2 — Hydrostatics (PDF pp. 40–47)

**Input text teaches:** incompressible fluid → pressure grows **linearly with depth**; the water column's weight force; counteracting force → pressure acts equally in all directions; **pressure depends only on vertical distance below the surface and fluid density**; external pressure adds (atmospheric ≈ 102,325 hPa ≈ 1 bar — *the PDF prints "102,325 hPa"*); **`p(h) = ρ·g·h + p0`**; simplification `ρ_water = 1000 kg/m³`, `g ≈ 10 N` *(sic — the unit is printed as "N"; read as 10 N/kg)*; "water pressure increas[es] by about 10⁵ Pa, which is 1 bar, every 10 m"; floating/submerged equilibrium; **mass of displaced fluid = mass of body**; weight force at centre of gravity G, buoyant force at the centre of gravity of the submerged part B; **F_G − F_B = 0**; Figure 2 shows a fully submerged body (1) and a partially submerged body (2) with pressure arrows, h₁/h₂ marking depth and B/G positions.

| # | Stem (abridged) | Official answer | Skills demanded |
|---|---|---|---|
| 1 | Submarine at 10,000 m: approximate hull pressure? (1/10/100/1000 bar) | **D** | apply the 1 bar per 10 m rule and scale by 1000 |
| 2 | Body of volume 2 m³ floats with top edge 3 m and bottom edge 4 m below the surface; mass? (1000/2000/3000/4000 kg) | **B** | displaced mass = body mass; the **irrelevant** 3 m/4 m must be ignored; the depth figures only establish *full submersion* |
| 3 | Hull tear 10 m below the waterline, space R of height 2.4 m sealed (air cannot escape), tear 0.2 m high: what happens? | **B** — water rises to about 1.2 m | ideal-gas compression by doubled absolute pressure; the official solution also gives the refined ≈1.13 m and states that "it is sufficient to recognise the simplified physical conditions" |
| 4 | Sealed vessel, pressure applied via membrane, floating object open at the bottom containing an **air bubble**: what happens? | **A** — it sinks, because the bubble compresses and buoyancy falls | recognise *which* volume is compressible; distinguish "water density changes" (wrong) from "displaced volume changes" (right) |
| 5 | Pump: suction port h above sea level, intake t below; which limit statement is correct? | **B** — h ≤ ~10 m | suction is limited by atmospheric pressure, **not** by the intake depth or total length; requires knowing what a vacuum-driven lift can achieve |
| 6 | Three ships, same mass, different hull cross-sections; identical box moved by d; which tilts most? | **A** — the narrowest ship | qualitative stability reasoning: equal tipping moment, least restoring effect for the smallest waterplane/width; the figure defines G_S, B, G_K |

**Observations.** The set moves from one-line rule application (Q1, Q2) to multi-constraint physical reasoning (Q3, Q4), to a *boundary-condition* question (Q5) and a *comparative* question (Q6). Q2 deliberately contains numbers that are irrelevant to the answer — anti-memorisation design is already present in the official material. Q3/Q4 combine **ideal-gas behaviour with buoyancy**, i.e. cross-concept questions. Q6 is answered by *relative* reasoning, not by numbers at all.

### Exercise 3 — Optimal Order Quantity (PDF pp. 48–52)

**Input text teaches:** EOQ minimises total of holding + fixed ordering costs; fixed ordering costs are constant per order and independent of quantity; **explicit key assumptions** — (i) constant, known demand with inventory falling linearly from Q to 0, (ii) no quantity discounts, (iii) no capital or storage limits, (iv) objective is solely cost minimisation; formula `Q* = √(2DS/H)` with D = annual demand (units), S = fixed ordering cost per order, H = holding cost per unit per year; H depends on storage costs and the value of goods held.

| # | Stem (abridged) | Official answer | Skills demanded |
|---|---|---|---|
| 1 | Which statement describes a central assumption? | **A** — demand is forecastable and stable | recognise the model's premises, not its formula |
| 2 | What could explain an **increase** in Q*? | **A** — a reduction in holding cost per unit per year | reason about the direction of influence of each parameter (asymmetry: lower H → higher Q*) |
| 3 | Why is holding cost = (Q/2)·H? | **B** — Q/2 is the average inventory level between two orders | understand the *derivation*, not the formula |
| 4 | D = 1800, S = 50, H = 2 → Q*? (150/300/450/600) | **B** — 300 | substitute correctly; distractors are the ÷2 / ×2 / squared variants |
| 5 | S is doubled, everything else fixed: Q* changes how? | **D** — factor √2 | **parameter-scaling reasoning**, not arithmetic |
| 6 | The unit value of the stored product rises: effect on Q*? | **A** — it could decrease, because annual holding cost per unit may increase | connect a *business* fact to a *model parameter* (value → H) |
| 7 | Cost curves A–D vs. order quantity, vertical line D at Q* = 100: which line is the annual total **fixed ordering** cost? | **B** (the decreasing curve) | read a cost curve and identify each curve by its functional form |

**Observations.** Parameter-direction questions (2, 5, 6) dominate over substitution (only Q4 is a calculation). The official figure shows A = U-shaped total cost, B = decreasing ordering cost, C = increasing holding cost, D = vertical line at the optimum. Note a **wording defect in the official solution to Q7**: it states "Total fixed ordering costs = annual demand Q × fixed cost per order", which should be (D/Q)·S. The correct relationship is taught in our lesson; the official wording is flagged as an erratum rather than copied.

### Exercise 4 — Research Strategies in Social Sciences (PDF pp. 53–56)

**Input text teaches:** empirical social research distinguishes qualitative and quantitative strategies; two aspects of explanation — **causal relationship** (does a factor relate to an outcome? example: education → income) vs. **causal mechanism** (how does the outcome arise? the process between cause and result: education opens better professional opportunities); quantitative = *theory testing / deductive*, standardised data collection + statistical tests, adequate sample size for significance, aims at causal relationships; qualitative = *inductive / theory generating*, single or few cases, aims at causal mechanisms, reveals individual necessary conditions but says nothing about how widespread they are; **four research phases** (1 research problem + question, 2 specification of the research design: period, units, collection methods, 3 data collection + analysis, 4 processing/publication); **quantitative = ideal-typical linear procedure**, design fixes hypotheses, measurement instruments, sample, methods; conceptual/theoretical/methodological/empirical steps strongly separated; later modifications are **not excluded** but must be documented clearly and considered in analyses, and some changes reduce significance or comparability; **qualitative = may include circular elements**, phases need not be separated or ordered; preconceptions and the methodological approach may change if clearly explained and documented.

| # | Stem (abridged) | Official answer | Skills demanded |
|---|---|---|---|
| 1 | Complete: "The deductive research strategy…" | **C** — examines the relation between factors and effects | map a label to its defining goal (relationship ≠ mechanism) |
| 2 | Which statement applies to the inductive strategy? | **B** — it examines *in which way* factors have consequences | mechanism, not spread/transferability |
| 3 | Which statement about conducting projects is true? | **A** — in a qualitative project the research question may be reformulated during the process | separate the two procedures' rules (documentation, phase order, sample changes) |
| 4 | Which approach **most clearly contradicts** the ideal-typical quantitative process? | **C** — adapting the hypothesis retrospectively to fit the results | evaluate four realistic scenarios; note C is deliberately *not* the only flawed scenario (d is borderline-legitimate because it is pre-planned and documented) → "most clearly" |
| 5 | Doctoral student needs *why* young people use the library (mechanism) **and** *what* literature they read (distribution); mixed approach: which data collection fits? | **A** — 1,000 anonymous borrowing records + semi-structured interviews with 4 young people | match each sub-question to its strategy and pick the combination that actually covers both |
| 6 | Master's student starts from an existing psychological theory and tests how far it transfers using statistics | **A** — deductive approach | recognise a description of theory testing without using the word "hypothesis" |

**Observations.** This exercise is entirely **conceptual/verbal**: no numbers, no formulas. It requires distinguishing near-synonyms (deductive vs. inductive, theory testing vs. theory generating, causal relationship vs. causal mechanism, linear vs. circular, transferability vs. mechanism, documenting vs. forbidding change). Q4 is a "most clearly" discriminator; Q5 requires *designing* a study rather than naming a label; Q6 describes an approach without naming it. This is the style to replicate in the social-science track.

---

## 3. Cross-cutting analysis of the official reasoning style

1. **Two-part item anatomy.** Every item = *input* (a compact teaching text, possibly with figure/table/formula) + *questions*. The input supplies all needed domain content; the student must read it as a resource. Our engine must therefore generate **inputs** (stimulus blocks), not isolated MCQs.
2. **Knowledge is assumed, not tested as recall.** The official items never ask "what is the formula for X" in isolation; they ask what it *implies*, *why* it holds, or what happens when a parameter changes.
3. **Six recurring cognitive moves** across the 32 official Subject Module questions:
   * execute a taught rule (Ex1 Q4, Q6; Ex3 Q4),
   * interpret a representation (Ex1 Q1, Q7; Ex3 Q7; Ex2 figure reading),
   * reason about **direction/effect of change** (Ex3 Q2, Q5, Q6),
   * state the **general/necessary** case, rejecting sufficient-but-not-necessary options (Ex1 Q8; Ex2 Q5),
   * explain or critique a mechanism, including detecting a plausible-but-wrong explanation (Ex2 Q4; Ex4 Q4),
   * classify a described situation into the correct conceptual category (Ex1 Q3; Ex4 Q1, Q2, Q6).
4. **Distractors encode specific misconceptions.** Official wrong options are derivable by a *named* error (component confusion, sign loss, wrong magnitude rule, wrong causal direction, correlation-of-parameters mistake, scenario/strategy mismatch). Our diagnostics depend on this: every distractor carries an error-mechanism tag.
5. **Difficulty comes from reasoning load, not big numbers.** All official arithmetic is mental arithmetic (10,000 m → 1 bar/10 m; 1800·50/2 → 300). No calculator is usable, so quantities are chosen to be mentally tractable — a hard constraint on our generators.
6. **Some stems are meta-level** ("why does the model use Q/2 · H?", "which statement about result types is correct?") — proof that the module tests *understanding of the model itself*.
7. **Figures carry information that words do not** (grid diagrams, hull cross-sections, cost curves, ship stability sketch). Our question engine must be able to emit original SVG figures.

## 4. Explicit fidelity limits (what the PDF does **not** say)

| Tempting claim | Status |
|---|---|
| "The exam contains vectors, hydrostatics, EOQ and research methods." | **Not supported.** Only that these are *sample* exercises and that the four are "only a selection". |
| "Difficulty is the same as the samples." | **Contradicted**: "the sample questions do not necessarily reflect the difficulty level of the questions on the actual test." |
| Number of questions in the real Subject Module | **Not stated anywhere in the PDF.** Our 90-minute simulation therefore uses a self-chosen composition (see architecture §9) and says so. |
| Weighting of fields in the real exam | **Not stated.** Our simulation weights follow the officially named field list, not claimed exam weights. |
| Scoring / partial credit / negative marking | **Not stated.** Guessing is advised, so our exam scoring uses raw correct answers. |
| Whether a formula sheet is provided | **Not stated.** We teach all needed relations in the input texts, matching the samples' self-contained style. |
| Core Module content (figure sequences, mathematical equations, Latin squares) | Present in the PDF but **outside the Subject Module**; excluded from the product scope, mentioned only for orientation. |

## 5. Consequences for the design (architecture inputs)

* Teach the **input-reading habit**: every practice item supplies its own stimulus, and training mode teaches how to mine a stimulus for the relevant relations (Ex2 Q2 shows how to *discard* data).
* Build the four official domains to full depth (foundation → transfer → exam style), because they are the only *demonstrated* concepts.
* Build the remaining breadth from the officially named field list, each domain labelled with its confidence level.
* Replicate the six cognitive moves in the question taxonomy; every generated item is tagged with one of them.
* Encode distractor error-mechanisms as first-class data for diagnostics.
* Keep all arithmetic mental (generators constrain numbers to "nice" values).
* Never present an extension as official.
