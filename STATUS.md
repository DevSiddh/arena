# Build status

Last updated: 2026-09-11 (working branch `arena/01a0907e-arena`).

## Done

| Area | Artifact | State |
|---|---|---|
| Source study | `research/official_dmat_source.txt` (57-page extraction), `research/pages/*.png` (rendered figures) | complete |
| Source analysis | `docs/01_SOURCE_ANALYSIS.md` — page-by-page evidence, all 32 official Subject Module questions inventoried with their official answers and the reasoning move each demands, official wording on structure (90 min, 4 options, one correct answer, no notes, samples are "only a selection"), and an explicit list of what the PDF does **not** claim | complete |
| Architecture | `docs/00_ARCHITECTURE.md` — the 10 required design sections (what the module tests, the 4 sample domains, prerequisite chains, 15-domain map, curriculum progression, generation/validation/training/exam/mastery architecture) | complete |
| Curriculum map | `docs/02_CURRICULUM_MAP.md` — 15 domains, each with a justification and a confidence label (`OFFICIAL_SAMPLE` / `OFFICIAL_FIELD_LIST` / `PREREQUISITE` / `PREPARATION_EXTENSION`), plus an explicit "deliberately excluded" list | complete |
| Data model | `engine/types.ts` — 30-field item schema, 7-level difficulty, 27 error tags, 12-step lesson schema, official-example study schema, validation stats | complete, type-checks |
| Solver layer | `engine/solvers.ts` — 40 independent solvers, each with an alternative method and invariants (Lagrange identity, cyclic triple-product invariance, law of cosines cross-check, numeric EOQ grid search, refined-vs-simplified trapped-air model, …) + canonical answer comparison | complete, type-checks |
| Generators — official domains | `engine/generators/{vector,hydro,eoq}.ts` — 27 parametric families covering all demonstrated concepts of Exercises 1–3, in multiple item styles (numeric, statement, effect-direction, graph, critique, relevance-filter, reverse) | written, smoke-tested: 369/400 clean, 187/191 numeric items agree with the independent solvers; residual defects are duplicate-option cases that the retry logic must absorb |

## Not yet built

1. `engine/validators.ts` — structural + semantic audit (ambiguity, duplicates, banned phrasings), retry-on-failure logic in the bank builder.
2. Generators for the remaining domains (D01, D03–D05, D07, D08, D10, D13).
3. `engine/authored/*` — the hand-written conceptual question sets (research methodology D11, social-science reasoning D12, experimental reasoning D14, argument analysis D15, plus the conceptual halves of vectors/hydrostatics/EOQ) and the official-style stimulus blocks.
4. `content/lessons/*` — the 12-step lessons for all 15 domains (official examples → foundations → transfer).
5. `engine/bank.ts` + `scripts/build-bank.ts` + `scripts/verify_bank.py` (independent cross-language re-verification) + `docs/03_VALIDATION_REPORT.md`.
6. `engine/diagnostics.ts` (mastery model, failure-cause classifier, adaptive picker) and `engine/exam.ts` (90-minute simulation).
7. The React UI (`app/src/**`): Home, Learn, Practice, Exam, Report, Method/Provenance; KaTeX rendering; original SVG figures.
8. Root `npm run dev` preview wiring and the final validation run reporting generated / valid / rejected / ambiguity rate / duplicate rate / answer-key failures / solver disagreements.

## Known defects found by the smoke test (to fix in the validator/retry layer)

* `num()` returned "4" for 400 (trailing-zero stripping) — **fixed**.
* `assemble()` now rejects a non-4-option set, a duplicate option text or a double key instead of emitting a bad item — **fixed**.
* Remaining duplicate-option cases arise when random numbers coincide (e.g. determinant equals scalar product in `genParallelogramArea`, two cost values coincide in `genEOQTotalCost`): the bank builder must retry these with a new seed and count the retries in the validation report.
* Items whose key text contains no number (e.g. "Every value of λ") must report `solverAgreement = null` rather than a mismatch.
