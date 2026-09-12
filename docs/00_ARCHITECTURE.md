# Internal Architecture — dMAT Subject Module (General Academic Module) Mastery System

This document is the design that precedes the implementation. Evidence for every claim about the official test lives in `docs/01_SOURCE_ANALYSIS.md`; the topic-by-topic map lives in `docs/02_CURRICULUM_MAP.md`.

---

## 1. What the official Subject Module actually tests

From the official instructions and the 32 sample questions (see source analysis §1.3 and §3):

> It tests the ability to **apply cognitive and analytical skills to academic problem solving**: a compact academic *input* (text, usually with a figure, table or formula) plus single-choice questions with exactly four options and exactly one correct answer, 90 minutes in total, no notes allowed.

Operationally, the module is a **reading-and-reasoning-under-time-pressure test in which academic knowledge is the raw material and transfer is the product.** The four sample exercises prove that the same test can carry mathematics, physics, business models and methodology. The official text adds that the samples are *a selection only* and names mathematics, computational sciences, natural sciences, engineering, business administration, economics, social sciences and humanities as the areas that "may be covered", and warns that sample difficulty is *not* the exam difficulty.

**Design consequence.** The product is not a quiz bank. It is a three-layer machine:

| Layer | Job | Where it lives |
|---|---|---|
| **Teaching layer** | Turn "I don't know this topic" into usable knowledge (12-step lesson per concept, prerequisite-ordered) | `content/lessons`, rendered by the Learn view |
| **Practice layer** | Convert knowledge into application/transfer by escalating reasoning load while varying surface form | `engine/generators`, `engine/authored`, Training view |
| **Assessment layer** | Measure real capability (not recall), diagnose *why* a student fails, simulate the exam honestly | `engine/diagnostics`, `engine/exam`, Exam view |

## 2. The four official sample domains (directly demonstrated)

| Domain | Demonstrated concepts (from the official items) | Official item count |
|---|---|---|
| **Vector Calculations** | component reading from a figure; vector addition/subtraction; scalar multiplication (magnitude and direction); magnitude via Pythagoras; result *types* of dot/cross/triple product; dot product computation; angle via `cos φ = (a·b)/(|a||b|)`; right-hand-rule cross product with sign tracking; `|a×b|` = parallelogram area (2D via determinant); triple product = 0 ⇔ coplanar | 8 |
| **Hydrostatics** | linear pressure–depth law `p = ρgh + p0`; bar-per-10-m mental rule; pressure acts equally in all directions; displaced-mass = body-mass for floating bodies; full vs. partial submersion; trapped-air compression (Boyle) interacting with buoyancy; suction lift limited by atmospheric pressure; tilting/restoring behaviour vs. hull width | 6 |
| **Optimal Order Quantity** | model assumptions; the cost structure (ordering vs. holding); `Q* = √(2DS/H)`; *why* average inventory is Q/2; parameter-direction reasoning (H↓ ⇒ Q*↑; S×2 ⇒ Q*×√2); value of goods → H; identifying cost curves | 7 |
| **Research Strategies in Social Sciences** | quantitative/deductive/theory-testing vs. qualitative/inductive/theory-generating; causal *relationship* vs. causal *mechanism*; sample size and significance; single/few cases; the four research phases; linear vs. circular process; documenting design changes; transferability limits; designing a mixed design | 6 |

Each of these four becomes a **deep module**: prerequisite chain → 12-step lesson → level-1→7 ladder → mixed practice → simulation items. Nothing is added to them that the official material does not support, except where explicitly labelled as prerequisite or extension.

## 3. Prerequisite knowledge per official domain

Prerequisite chains are declared as data (`engine/curriculum.ts`) so the diagnostic engine can detect gaps rather than just wrong answers.

* **Vectors** — scalars & numbers → the coordinate plane and ordered pairs → sign/orientation → Pythagoras → (then vectors) components, magnitude, addition, scalar multiplication → dot product → angle & perpendicularity → cross product → area → triple product → coplanarity. *Deliberately excluded*: unit vectors/basis notation, Gram–Schmidt, projections beyond the angle relation, matrix theory, vector spaces/linear independence — none are needed by the official items and they would dilute the transfer training.
* **Hydrostatics** — force, area, pressure `p = F/A` → mass, density, weight `F_G = mg` → why pressure grows with depth (column of fluid above a point) → `p = ρgh + p0` → bar-per-10-m mental model → buoyancy as the net result of pressure differences → displaced volume/mass → float vs. submerge equilibrium → (extension) compressibility of gases, suction lift limit, stability.
* **EOQ** — demand over time, inventory level, the sawtooth pattern → average inventory → order frequency `D/Q` → holding cost `(Q/2)H` and ordering cost `(D/Q)S` → total relevant cost → the U-shaped total cost curve → optimisation by balancing the two cost terms → the square-root law and parameter scaling. *Excluded*: calculus-derivative machinery (the balance argument is enough and matches the official derivation-free presentation), discounts, safety stock, stochastic demand.
* **Research strategies** — the everyday notions of *why* vs. *how much* → variable/outcome/factor → relationship vs. mechanism → deductive vs. inductive reasoning → standardisation vs. openness of data collection → sample vs. case → generalisation vs. transferability → documentation of changes.

## 4. Broader preparation map — 15 domains with confidence labels

Full justification, per-domain prerequisite chains and lesson content: `docs/02_CURRICULUM_MAP.md`.

Labels used everywhere in the product (never blurred):

| Label | Meaning |
|---|---|
| `[OFFICIAL SAMPLE]` | Directly demonstrated by an official sample exercise |
| `[OFFICIAL FIELD LIST]` | Named by the official instructions as a possible topic area, but with no sample question shown |
| `[PREREQUISITE]` | Needed in order to understand a demonstrated concept |
| `[PREPARATION EXTENSION]` | Our reasoned extension for practice; **not** a dMAT syllabus claim |
| `[EXCLUDED / SPECULATIVE]` | Content we deliberately do **not** teach as exam preparation (listed so the boundary is visible) |

The 15 domains: (1) mathematical & quantitative reasoning `[FIELD LIST: mathematics][PREREQUISITE]`, (2) vector & quantitative mathematics `[OFFICIAL SAMPLE]`, (3) data interpretation, tables & graphs `[FIELD LIST][PREREQUISITE]`, (4) probability & statistics foundations `[FIELD LIST][PREREQUISITE]`, (5) physics fundamentals `[FIELD LIST: natural sciences][PREREQUISITE]`, (6) hydrostatics & fluids `[OFFICIAL SAMPLE]`, (7) mechanics & engineering reasoning `[FIELD LIST: engineering][EXTENSION]`, (8) computational & algorithmic reasoning `[FIELD LIST: computational sciences][EXTENSION]`, (9) business mathematics & optimisation `[OFFICIAL SAMPLE]`, (10) economics fundamentals `[FIELD LIST: economics][EXTENSION]`, (11) research methodology `[OFFICIAL SAMPLE]`, (12) social-science reasoning & causal inference `[FIELD LIST: social sciences][EXTENSION]`, (13) scientific reasoning, models & estimation `[FIELD LIST: natural sciences][EXTENSION]`, (14) experimental & evidence-based reasoning `[FIELD LIST][EXTENSION]`, (15) argument & text reasoning (humanities style) `[FIELD LIST: humanities][EXTENSION]`.

## 5. Curriculum progression (the spine of the whole product)

Every concept follows the official pipeline, and the UI enforces the order rather than dumping MCQs first:

```
OFFICIAL EXAMPLE (studied, dissected, with the official solution)
   ↓ CONCEPT EXTRACTION      (what move does this item require?)
   ↓ PREREQUISITE KNOWLEDGE  (declared chain; checkable)
   ↓ FOUNDATION LESSON       (steps 1–4 of the lesson structure)
   ↓ INTUITION               (step 2/5: why the relation must be true)
   ↓ FORMULAS / RULES        (step 4, always with meaning + units)
   ↓ WORKED EXAMPLE          (step 6: full reasoning, not just algebra)
   ↓ GUIDED APPLICATION      (step 7: hints available, scaffolds shown)
   ↓ INDEPENDENT APPLICATION (step 8: no hints)
   ↓ TRANSFER                (step 9: same principle, new surface)
   ↓ DIFFICULT APPLICATION   (level 6–7)
   ↓ MIXED SUBJECT PRACTICE  (interleaving, unknown domain — mirrors the exam)
   ↓ 90-MINUTE SIMULATION
```

The 12-step lesson structure required by the brief (What? Why? Prerequisites, Core knowledge, Visual intuition, Worked example, Guided, Independent, Transfer, dMAT-style, Trick/misconception, Mastery check) is stored as structured lesson data (`LessonSection` kinds), not as prose blobs, so each step can link to its practice items and the mastery check can be graded.

## 6. Question-generation architecture

**Three productions paths, one item schema:**

1. `engine/authored/*` — original, hand-written questions in the official style, for conceptual/verbal domains (research methods, social science, economics, scientific reasoning, humanities, and the conceptual half of vectors/hydrostatics/EOQ). Each carries full explanations and per-distractor error tags.
2. `engine/generators/*` — parametric families for numeric domains. A generator receives a `Rng` and a target `ItemStyle` and returns a *complete* item, including: mental-arithmetic-checked numbers, computed correct answer, **distractors derived from named misconceptions**, worked solution, and a `verification` payload for the independent solver.
3. `engine/authored/seeds.ts` — official-style *stimulus blocks* (input text + 3–6 questions) used for both training and the simulation, so the student practises the two-part item anatomy of the real test.

**Item schema (abridged):** `id, domainId, conceptIds[], label (confidence), stem, stimulusId?, options[4], correctIndex, difficulty(1–7), cognitiveMove, reasoningType, transferContext, figure?, hints[], explanation{testing, matters, irrelevant, concept, why, steps[], distractorWhy{}, trap, transfer}, errorTags[4], verification?, provenance('authored'|'generated'), audit{...}`.

**Anti-memorisation rules encoded in the engine**

* Number randomisation with *mental-arithmetic* constraints (divisible quantities, round depth/bar values).
* Multiple **item styles** per concept: `numeric_direct`, `statement_compare`, `effect_direction`, `graph_choice`, `critique_student_reasoning`, `relevance_filter`, `missing_information`, `reverse_question` ("what change would produce X?").
* Irrelevant information injected into a defined share of items (as the official Q2/hydrostatics does).
* Question direction flipped (given the result, find the input).
* Representation switched (text ⇄ table ⇄ graph ⇄ figure).
* Concept combination (e.g. pressure + gas compression + buoyancy, as in official Ex2 Q4).
* Contrast pairs: the misconception item that tests the *same* concept with a subtly different setup is generated alongside its correct counterpart, so pattern matching on surface features fails.
* "Disguise" pass: a share of items hides the domain vocabulary entirely (no words like "pressure", "vector", "optimal order quantity" in the stem).

## 7. Validation architecture (independent, not optional)

Two-stage, with an independent second implementation:

**Stage A — structural & semantic audit (`engine/validators`)**: exactly 4 options; exactly one correct; no duplicate options; non-empty explanation with all ten components; distractor rationale present for every option; banned option phrasings ("all of the above" in exam items); stem does not leak the answer; numeric options must be distinct and (for distances) away from the correct value by a relative tolerance; figure presence consistent with the stem reference; duplicate detection by normalised stem signature + answer-set signature + concept.

**Stage B — independent solving (`engine/solvers`)**. Every generated numeric item carries a `verification` payload *without* the answer, e.g. `{kind:'vector.cross', a:[...], b:[...]}`. A separate solver module — which knows nothing about how distractors were built — recomputes the answer, and a **second, independent method** is used where one exists:

| Concept | Method 1 | Method 2 (cross-check) |
|---|---|---|
| dot/cross/triple product, area | direct rule | determinant expansion with sign cofactor, or `|a||b|sin φ`, or 2D shoelace area |
| angle | `arccos((a·b)/(|a||b|))` | law of cosines on |a−b| |
| hydrostatic pressure | `ρgh + p0` | bar-per-10-m rule ⇒ ratio test |
| buoyancy/mass | displaced mass = ρ·V_sub | weight balance `F_G = F_B` |
| trapped air | Boyle `p₁V₁ = p₂V₂` + column equilibrium (quadratic) | iterative fixed-point solve of the same equations |
| EOQ | closed form `√(2DS/H)` | grid/ternary search minimising `(D/Q)S + (Q/2)H` |
| total cost, reorder count, cycle length | formula | direct simulation over the cycle |
| percentage/statistics/economics | formula | recomputation from first principles (e.g. sum/count) |

Additionally, `scripts/verify_bank.py` re-checks every numeric item **in a different language** (Python) from the exported `bank.json`, which catches generator/solver shared bugs and serialisation errors.

**Reporting** (`docs/03_VALIDATION_REPORT.md`, auto-generated): generated, valid, rejected, rejection reasons, ambiguity rate, duplicate rate, answer-key failures, solver disagreements, per-domain and per-difficulty coverage. Nothing is hidden: rejected items are listed with reasons, and known official-text errata are recorded separately.

## 8. Training mode

* Topic → subtopic → lesson (12 steps) → graded practice ladder (levels 1→7, ordered, unlocked progressively but never locked away from a determined student).
* Hints are *staged* (recall → representation → method) and record how much scaffolding was used; hint-dependence is a reported metric, because "right answer with three hints" ≠ mastery.
* Immediate rich feedback (all ten explanation components), retry, concept review links, misconception cards for the specific distractor chosen.
* Session-level adaptation: after each item the engine updates per-concept mastery (a Bayesian-style score with evidence weight per difficulty level) and picks the next item from the weakest *prerequisite-adequate* concept.
* Unmissable label: `TRAINING MODE` — hints/feedback/elimination allowed here and only here.

## 9. Exam mode

* Structure: 90:00 countdown, fixed mixed-subject form (default 33 questions over 8 stimulus blocks, composition proportional to the officially named field list — and this composition is disclosed in the UI as *our* choice, since the real composition is not published), 4 options, one correct, no notes (no scratchpad UI at all), no feedback until submission, no hints, no elimination, no difficulty or topic labels before answering, no streaks/XP.
* Navigation: question grid with answered/unanswered/flagged states, jump-to-question, flag-for-review, ability to change an answer until submission, explicit warning when submitting with unanswered items.
* After submission: score, accuracy, time used vs. budget, per-domain and per-cognitive-move breakdown, unanswered/mis-flagged analysis, weakest concepts, and a **diagnostic report** (see §10) — not just a percentage.

## 10. Mastery & diagnostic system

**Four capability scores per concept (0–100)**, computed from the response log rather than a single tally:

* *Foundation* (levels 1–2), *Application* (3–4), *Transfer* (5–7), *Exam-readiness* (mixed, timed, unlabelled items) — plus `hintDependence` and `speedAccuracyTradeoff`.

**Failure-cause classifier** — each wrong answer is attributed using (a) the error tag of the chosen distractract, (b) whether the correct option was reachable in the given time, (c) the concept's prerequisites, (d) the answer's numerical distance from the truth:

| Diagnosis | Trigger |
|---|---|
| prerequisite gap | failure concentrated in a concept whose prerequisites are unmastered |
| conceptual misunderstanding | distractor tagged with a concept-level misconception |
| formula/procedure recall problem | correct concept identified but the rule misapplied |
| calculation error | answer equals the correct value scaled by a unit/place error |
| unit error | distractor equals the value with a wrong unit conversion |
| graph/representation error | failure on representation-transfer items with correct core items passed |
| misread question | wrong option consistent with the *negation* of the stem or the other quantity asked |
| wrong assumption | distractor from an assumption the model does not make |
| misapplied transfer | passes direct items, fails disguised/new-context items of the same concept |
| careless / under time pressure | fast wrong answers on low levels, but correct answers on high levels |
| guessing | below-chance time on item, option pattern inconsistent with capability, chance-level accuracy |

**70 % is not one number.** The report separates *performance* (share correct) from *capability* (transfer and unlabelled performance, hint dependence, time-normalised accuracy) and explicitly warns when high score + low transfer index indicates formula memorisation rather than understanding.

**Anti-gaming**: training hints are logged; exam items include disguised and unlabelled variants; concept-level mastery decays with time since last success; duplicated concepts are re-tested with different surface forms.

---

## Implementation map

| Concern | Files |
|---|---|
| Types, item schema, labels | `engine/types.ts` |
| Deterministic RNG | `engine/rng.ts` |
| Domains, concepts, prerequisite graph, official example catalogue | `engine/curriculum.ts` |
| 12-step lessons (all 15 domains, deep for the 4 official ones) | `content/lessons/*.ts` |
| Authored questions (official-style + conceptual) | `engine/authored/*.ts` |
| Stimulus blocks (input + question sets) | `engine/authored/stimuli.ts` |
| Parametric families, styles, distractors | `engine/generators/*.ts` |
| Independent solvers | `engine/solvers.ts` |
| Structural/semantic validation, ambiguity & duplicate detection | `engine/validators.ts` |
| Bank assembly + audit report | `engine/bank.ts`, `scripts/build-bank.ts` |
| Independent Python re-verification | `scripts/verify_bank.py` |
| Diagnostics, mastery model, adaptive picker | `engine/diagnostics.ts` |
| Exam engine (form assembly, timing, scoring, breakdowns) | `engine/exam.ts` |
| UI: Home, Learn, Practice, Exam, Report, Method/Provenance | `app/src/**` |
