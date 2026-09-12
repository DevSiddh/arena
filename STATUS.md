# Build status

Last updated: 2026-09-11 (working branch `arena/01a0907e-arena`).

## Done

| Area | Artifact | State |
|---|---|---|
| Source study | `research/official_dmat_source.txt` (57-page extraction), `research/pages/*.png` | complete |
| Source analysis | `docs/01_SOURCE_ANALYSIS.md` — page-by-page evidence, all 32 official Subject Module questions inventoried with official answers and the reasoning move each demands, plus an explicit list of what the PDF does **not** claim | complete |
| Architecture | `docs/00_ARCHITECTURE.md` — the 10 required design sections | complete |
| Curriculum map | `docs/02_CURRICULUM_MAP.md` — 15 domains with justification and confidence label, plus a "deliberately excluded" list | complete |
| Data model | `engine/types.ts` — item schema, 7-level difficulty, error tags, 12-step lesson schema, validation stats | complete |
| Curriculum graph | `engine/curriculum.ts` — 15 domains, 60+ concepts with prerequisite edges, `OFFICIAL_EXAMPLES` study records | complete |
| Solver layer | `engine/solvers.ts` — independent solvers, each with an alternative method, `altComparable` flag for documented approximations | complete |
| Generators | `engine/generators/{vector,hydro,eoq,misc}.ts` — 44 parametric families across the 15 domains, multiple item styles | complete |
| Authored items | `engine/authored/{helpers,stimuli,conceptual,methodology,reasoning,advanced}.ts` — conceptual, methodology, experimental, argument and level 6–7 exam-style sets, plus 11 stimulus blocks | complete |
| Validation | `engine/validators.ts` — structural checks, ambiguity scan (numeric-gated), exact-duplicate signatures, template-variant cap, distractor-equals-answer scan; rejected items preserved in `Bank.meta.failures` | complete |
| Bank build | `engine/bank.ts` + `scripts/build-bank.ts` — 12-attempt per-slot retry, generator-retry table in the report, writes `content/bank.json` and `docs/03_VALIDATION_REPORT.md` | complete |
| Independent re-verification | `scripts/verify_bank.py` — separate Python solvers re-derive every numeric item; 381/381 agree | complete |
| Diagnosis model | `engine/evidence.ts` — attempt evidence, error-tag → cause taxonomy (prerequisite / conceptual / calculation / unit / misread / transfer / pacing / blank), prerequisite-graph root cause analysis, study plan | complete |
| Exam mode | `engine/exam.ts` — 40-item / 90-minute blueprint, guaranteed coverage of the four official domains, text-block items, countdown session API, flag/navigate, unanswered policy, score + breakdown + diagnosis, post-exam review, `leakCheck()` proving no answer key reaches the student view; self-tested in the build | complete |
| Exam documentation | `docs/04_EXAM_FORM.md` — generated blueprint, achieved coverage, self-test table, feasibility check | complete |

**Current bank** (seed 20260902, 14 variants per family): generated 660 · valid 638 · rejected 22 · ambiguity 0.00 % · duplicates 2.42 % (16 exact-signature) · answer-key failures 0 · solver disagreements 0 of 381. Rejections are all in the expected classes (16 duplicate, 6 template-cap; some overlap). Independent Python re-check: 381/381 agree.

**Exam self-test** (seed 20260926): 40 items from 14 domains, 2 text blocks, every blueprint target met, no answer leak, perfect sitting 40/40, blank sitting 0/40 with an "items left blank" diagnosis, systematically wrong sitting produces causes and a study plan.

## Not yet built

1. `content/lessons/L01–L15.ts` — the 12-step lessons per domain (currently an empty directory). Practice steps draw their items from the bank by concept + difficulty band.
2. `engine/diagnostics.ts` — the mastery model on top of `engine/evidence.ts`: per-concept mastery estimates, prerequisite-gap-aware adaptive item picking, spaced-repetition-style review queue, training-mode progression gates.
3. The React UI (`app/src/**`): Home, Learn, Practice, Exam, Report, Method/Provenance; KaTeX rendering; original SVG figures for the declared `Figure` data.
4. `npm run dev` preview wiring and the final full validation run in one command chain.

## Fixed defects worth remembering

* `num()` trailing-zero stripping, `assemble()` strictness (exactly 4 options, unique texts, one key) — fixed.
* Random duplicate options in `genParallelogramArea` / `genEOQTotalCost` and friends — fixed by pooled distractors via `distinctOpts` plus the per-slot retry layer.
* Validator false positives on prose numbers and near-equal numeric options — fixed by gating the ambiguity and distractor-equals-answer scans to numeric options (`isNumericOption`) and by keeping numbers in the duplicate signature.
* Solver false alarm on the trapped-air item (official simplified vs. refined model) — resolved with `altComparable` and both models re-derived independently in Python.
* Stimulus blocks had attached every question of a domain (a 1714-character "block" with 150 questions). Now a block carries at most 5 questions, chosen for specificity and balanced across blocks, and questions carry their block back-reference.
