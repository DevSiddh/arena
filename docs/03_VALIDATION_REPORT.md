# Validation report

Generated: 2026-09-11T16:10:44.797Z · seed `20260902` · independent re-verification: `scripts/verify_bank.py`

## Summary

| Metric | Value |
|---|---|
| Questions generated | 682 |
| Questions valid (shown to students) | 665 |
| Questions rejected | 17 |
| Rejection rate | 2.49 % |
| Ambiguity rate (two options denoting the same value) | 0.00 % |
| Duplicate rate (identical item signature) | 2.05 % (14 items) |
| Template repetition rate (variant cap applied) | 0.44 % |
| Answer-key failures (solver vs. declared key) | 0 |
| Solver disagreements (all) | 0 |
| Numeric items independently solved | 387 |
| Structural failures | 0 |

## Rejection reasons

| Reason | Count |
|---|---|
| duplicate item (exact signature) | 14 |
| template repetition (variant cap reached) | 3 |

## Coverage by domain

| Domain | Generated | Valid | Levels present |
|---|---|---|---|
| D01 | 51 | 51 | 2, 3, 5, 6 |
| D02 | 137 | 136 | 1, 2, 3, 4, 5, 6 |
| D03 | 29 | 29 | 2, 3, 4, 6 |
| D04 | 38 | 36 | 2, 4 |
| D05 | 26 | 26 | 1, 2, 3 |
| D06 | 113 | 112 | 1, 2, 3, 4, 5, 6 |
| D07 | 36 | 35 | 2, 3 |
| D08 | 39 | 36 | 2, 3, 4, 6 |
| D09 | 103 | 95 | 2, 3, 4, 5, 6, 7 |
| D10 | 42 | 41 | 2, 3, 4, 5, 7 |
| D11 | 15 | 15 | 1, 2, 3, 4, 7 |
| D12 | 13 | 13 | 2, 3, 4, 5 |
| D13 | 23 | 23 | 2, 4, 5, 7 |
| D14 | 8 | 8 | 2, 3, 4 |
| D15 | 9 | 9 | 2, 3, 4, 5, 6 |

## Coverage by difficulty level

| Level | Items |
|---|---|
| 1 | 43 |
| 2 | 211 |
| 3 | 205 |
| 4 | 113 |
| 5 | 74 |
| 6 | 15 |
| 7 | 4 |

## Rejected items (nothing hidden)

| Item | Domain | Reason | Detail |
|---|---|---|---|
| `gen-eoq-half-329336` | D09 | duplicate item (exact signature) | duplicate of gen-eoq-half-418793 |
| `gen-elastic-239622` | D10 | duplicate item (exact signature) | duplicate of gen-elastic-692255 |
| `gen-hydrobubble-782029` | D06 | duplicate item (exact signature) | duplicate of gen-hydrobubble-868118 |
| `gen-eoq-half-209131` | D09 | duplicate item (exact signature) | duplicate of gen-eoq-half-613672 |
| `gen-eoq-dir-744058` | D09 | duplicate item (exact signature) | duplicate of gen-eoq-dir-739844 |
| `gen-eoq-half-284891` | D09 | duplicate item (exact signature) | duplicate of gen-eoq-half-418793 |
| `gen-eoq-sens-934287` | D09 | duplicate item (exact signature) | duplicate of gen-eoq-sens-363073 |
| `gen-complex-328192` | D08 | duplicate item (exact signature) | duplicate of gen-complex-371416 |
| `gen-eoq-half-116524` | D09 | duplicate item (exact signature) | duplicate of gen-eoq-half-723330 |
| `gen-baserate-408611` | D04 | template repetition (variant cap reached) | template repetition: 6. variant of the same template (cap 5) — kept the first 5 |
| `gen-eoq-sens-756782` | D09 | duplicate item (exact signature) | duplicate of gen-eoq-sens-542351 |
| `gen-flow-920181` | D07 | duplicate item (exact signature) | duplicate of gen-flow-600702 |
| `gen-bin-191992` | D08 | template repetition (variant cap reached) | template repetition: 6. variant of the same template (cap 5) — kept the first 5 |
| `gen-vtype-single-692427` | D02 | duplicate item (exact signature) | duplicate of gen-vtype-single-884425 |
| `gen-eoq-sens-517638` | D09 | duplicate item (exact signature) | duplicate of gen-eoq-sens-314954 |
| `gen-baserate-968222` | D04 | template repetition (variant cap reached) | template repetition: 6. variant of the same template (cap 5) — kept the first 5 |
| `gen-complex-796023` | D08 | duplicate item (exact signature) | duplicate of gen-complex-414720 |

## Generator-level retries

Option sets rejected inside the generators (fresh random values were drawn):

| Family | Rejected draws |
|---|---|
| physics/gas | 144 |
| math/percentage | 1 |
| vector/area | 1 |
| physics/force-pressure | 1 |
| math/proportion | 1 |
| economics/break-even | 1 |
| computing/binary | 1 |

## Concept coverage

Concepts in the curriculum: **80**. Concepts with at least one item: **80**.

| Domain | Concepts | Items | Concepts with 0 items |
|---|---|---|---|
| D01 Math reasoning | 4 | 55 | — |
| D02 Vectors | 11 | 180 | — |
| D03 Data & graphs | 3 | 33 | — |
| D04 Probability & statistics | 4 | 41 | — |
| D05 Physics basics | 4 | 54 | — |
| D06 Hydrostatics | 8 | 177 | — |
| D07 Mechanics & engineering | 4 | 41 | — |
| D08 Computational reasoning | 4 | 37 | — |
| D09 Business maths (EOQ) | 9 | 171 | — |
| D10 Economics | 5 | 47 | — |
| D11 Research methodology | 8 | 41 | — |
| D12 Social-science reasoning | 4 | 17 | — |
| D13 Scientific reasoning | 4 | 28 | — |
| D14 Experimental reasoning | 4 | 14 | — |
| D15 Argument analysis | 4 | 14 | — |

Concepts with **no items at all**: none. Every taught concept has practice material.

Practice steps whose thinnest concept has fewer items than the step requests (the lesson shows a shortfall note instead of inventing items):

- L03 transfer: thinnest concept has 5 item(s) (a five-item step needs 5, the mastery check 8)
- L03 dmat_style: thinnest concept has 5 item(s) (a five-item step needs 5, the mastery check 8)
- L03 mastery_check: thinnest concept has 5 item(s) (a five-item step needs 5, the mastery check 8)
- L04 transfer: thinnest concept has 6 item(s) (a five-item step needs 5, the mastery check 8)
- L04 dmat_style: thinnest concept has 6 item(s) (a five-item step needs 5, the mastery check 8)
- L04 mastery_check: thinnest concept has 6 item(s) (a five-item step needs 5, the mastery check 8)
- L05 guided_practice: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L05 independent_practice: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L05 dmat_style: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L05 mastery_check: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L07 guided_practice: thinnest concept has 7 item(s) (a five-item step needs 5, the mastery check 8)
- L07 dmat_style: thinnest concept has 7 item(s) (a five-item step needs 5, the mastery check 8)
- L07 mastery_check: thinnest concept has 7 item(s) (a five-item step needs 5, the mastery check 8)
- L08 transfer: thinnest concept has 2 item(s) (a five-item step needs 5, the mastery check 8)
- L08 dmat_style: thinnest concept has 2 item(s) (a five-item step needs 5, the mastery check 8)
- L08 mastery_check: thinnest concept has 2 item(s) (a five-item step needs 5, the mastery check 8)
- L09 guided_practice: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L09 mastery_check: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L10 guided_practice: thinnest concept has 5 item(s) (a five-item step needs 5, the mastery check 8)
- L10 independent_practice: thinnest concept has 5 item(s) (a five-item step needs 5, the mastery check 8)
- L10 transfer: thinnest concept has 2 item(s) (a five-item step needs 5, the mastery check 8)
- L10 mastery_check: thinnest concept has 2 item(s) (a five-item step needs 5, the mastery check 8)
- L11 guided_practice: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L11 independent_practice: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L11 transfer: thinnest concept has 5 item(s) (a five-item step needs 5, the mastery check 8)
- L11 dmat_style: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L11 mastery_check: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L12 guided_practice: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
- L12 independent_practice: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L12 transfer: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
- L12 dmat_style: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L12 mastery_check: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
- L13 guided_practice: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L13 transfer: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L13 dmat_style: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L13 mastery_check: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L14 guided_practice: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
- L14 independent_practice: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
- L14 transfer: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
- L14 dmat_style: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
- L14 mastery_check: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
- L15 guided_practice: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
- L15 independent_practice: thinnest concept has 4 item(s) (a five-item step needs 5, the mastery check 8)
- L15 transfer: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
- L15 dmat_style: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
- L15 mastery_check: thinnest concept has 3 item(s) (a five-item step needs 5, the mastery check 8)
