# dMAT Subject Module — General Academic Module preparation system

A self-contained learning and preparation system for the **Subject Module of the dMAT**
(g.a.s.t., Digital Master Test) — the module taken by Indian applicants in the APS process
from summer semester 2027 onwards.

Everything in this repository is built from one authority: the official preparatory PDF
`260902_dMAT_General-Academic-Module_Preparatoy-Materials_EN.pdf` (as at 02.09.2026), which
ships in this repository and was inspected page by page before any code was written.

**Start here**

1. `docs/01_SOURCE_ANALYSIS.md` — what the official material actually says, item by item,
   including what it does *not* say (no question count, no weighting, no difficulty guarantee).
2. `docs/00_ARCHITECTURE.md` — the design: teaching layer, practice layer, assessment layer,
   question-generation architecture, independent validation, training mode, exam mode,
   diagnostics.
3. `docs/02_CURRICULUM_MAP.md` — 15 preparation domains, each labelled
   `OFFICIAL_SAMPLE` / `OFFICIAL_FIELD_LIST` / `PREREQUISITE` / `PREPARATION_EXTENSION`,
   with the justification for its inclusion and the content deliberately excluded.
4. `STATUS.md` — what is finished and what is still being built.

**Repository layout**

| Path | Contents |
|---|---|
| `research/` | page-tagged text extraction and rendered pages of the official PDF |
| `docs/` | source analysis, architecture, curriculum map, validation report |
| `engine/` | pure TypeScript core: types, curriculum graph, independent solvers, generators |
| `content/` | generated question bank (built by script) and lesson content |
| `app/` | the learning environment (Learn · Practice · Exam · Report · Method) |
| `scripts/` | bank builder, cross-language verification |

**Commands**

```bash
npm install
npm run build:bank   # generate + validate the bank (writes content/bank.json + validation report)
npm run verify:bank  # independent Python re-check of every numeric item
npm run typecheck
npm run dev          # learning environment on 0.0.0.0:5173
```

**Fidelity rule.** No content in this repository claims to be official beyond what the PDF
demonstrates. Every domain and every question carries a confidence label, and the four official
sample exercises are studied as exercises (what they teach and which reasoning moves they
demand) — their question texts are never copied.
