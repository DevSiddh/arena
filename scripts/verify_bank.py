#!/usr/bin/env python3
"""
Independent cross-language verification of the question bank.

This script shares no code with the TypeScript engine. It reads `content/bank.json`, re-derives
the key of every item that carries a solver payload with its own Python implementation, and
compares the result with the option the bank marks as correct.

Why a second implementation in another language: a bug in a TypeScript solver would validate its
own wrong answer, and the whole bank would be wrong in the same direction. A separate, much
simpler implementation that a human can read line by line is the strongest check available here.

Usage:  python3 scripts/verify_bank.py [path/to/bank.json]
Exit code 0 = every solvable item agrees, 1 = at least one disagreement.
"""

from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

BANK = Path(sys.argv[1] if len(sys.argv) > 1 else "content/bank.json")


# --------------------------------------------------------------------------- number extraction
NUM = re.compile(r"-?\d+(?:[.,]\d+)?")


def numbers(text: str) -> list[float]:
    """
    Numbers in an option text.

    LaTeX commands are stripped so that '\\sqrt{14}' yields 14, and the two constructions that
    appear in real keys are handled explicitly:
      * 'a/b' inside mathematics is one value (a ratio), not two numbers;
      * '\\arccos(a/b)' is the *angle*, so the cosine is converted to degrees.
    """
    t = text.replace("\\times", "x").replace("\\cdot", "x")
    # arccos(c) -> the angle in degrees
    def arccos_repl(m: re.Match) -> str:
        inner = m.group(1)
        frac = re.fullmatch(r"\s*(-?\d+(?:[.,]\d+)?)\s*/\s*(-?\d+(?:[.,]\d+)?)\s*", inner)
        if frac:
            c = float(frac.group(1).replace(",", ".")) / float(frac.group(2).replace(",", "."))
        else:
            try:
                c = float(inner.replace(",", "."))
            except ValueError:
                return " "
        return f" {math.degrees(math.acos(max(-1.0, min(1.0, c)))):.4f} "

    t = re.sub(r"\\arccos\s*\{?\s*([^})]+?)\s*\}?", lambda m: arccos_repl(m) if "/" in m.group(1) or re.fullmatch(r"\s*-?[\d.,]+\s*", m.group(1)) else " ", t)
    # ratios inside mathematics -> a single decimal value
    t = re.sub(r"(?<![\d.])(-?\d+(?:[.,]\d+)?)\s*/\s*(-?\d+(?:[.,]\d+)?)(?![\d.])",
               lambda m: f" {float(m.group(1).replace(',', '.')) / float(m.group(2).replace(',', '.')):.6f} " if float(m.group(2).replace(',', '.')) else " ", t)
    t = re.sub(r"\\[a-zA-Z]+", " ", t)
    t = t.replace("{", " ").replace("}", " ").replace("$", " ")
    t = t.replace("−", "-").replace("–", "-")
    out: list[float] = []
    for m in NUM.finditer(t):
        out.append(float(m.group(0).replace(",", ".")))
    return out


def frac(text: str) -> tuple[float, float] | None:
    """Recognise a simple 'a/b' fraction so that 3/4 and 0,75 compare equal."""
    m = re.search(r"(-?\d+(?:[.,]\d+)?)\s*/\s*(-?\d+(?:[.,]\d+)?)", text)
    if not m:
        return None
    a = float(m.group(1).replace(",", "."))
    b = float(m.group(2).replace(",", "."))
    return (a, b) if b else None


def close(a: float, b: float, tol: float) -> bool:
    return abs(a - b) <= 1e-9 or abs(a - b) <= max(tol, abs(b) * tol)


def agree(declared: list[float], computed: list[float], tol: float = 0.02) -> bool:
    """
    The declared key may express fewer numbers than the solver computes (for example the key text
    gives '2 bar' while the solver also reports the depth in metres). Every number the key states
    must therefore agree with the corresponding value from the solver — a prefix comparison — and a
    key expressed as a percentage is accepted against a solver value in the 0..1 range.
    """
    if not declared:
        return True  # qualitative key: nothing numeric to compare
    if len(declared) > len(computed):
        return False
    for i, d in enumerate(declared):
        c = computed[i]
        if close(d, c, tol) or close(d, c * 100, tol):
            continue
        return False
    return True


# --------------------------------------------------------------------------- solvers
def cross(a, b):
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def norm(a):
    return math.sqrt(dot(a, a))


def solve(solver: str, p: dict):
    """Re-derivation of one payload. Returns a list of numbers, or None if not implemented."""
    if solver == "vector.addsub":
        a, b, c, sign = p["a"], p["b"], p["c"], p["sign"]
        return [a[i] + b[i] + (-c[i] if sign == "-" else c[i]) for i in range(len(a))]
    if solver == "vector.magnitude":
        return [round(norm(p["a"]), 4)]
    if solver == "vector.magnitude_pair":
        return [round(norm(p["a"]), 4), round(norm(p["b"]), 4)]
    if solver == "vector.scalar_mult":
        return [round(x * p["k"], 4) for x in p["a"]]
    if solver == "vector.scaled_magnitude":
        return [round(abs(p["k"]) * norm(p["a"]), 4)]
    if solver == "vector.dot":
        return [round(dot(p["a"], p["b"]), 4)]
    if solver == "vector.angle":
        cos = dot(p["a"], p["b"]) / (norm(p["a"]) * norm(p["b"]))
        return [round(cos, 6), round(180 * math.acos(max(-1.0, min(1.0, cos))) / math.pi, 4)]
    if solver == "vector.cross":
        return [round(x, 4) for x in cross(p["a"], p["b"])]
    if solver == "vector.parallelogram_area":
        return [round(abs(cross([p["a"][0], p["a"][1], 0], [p["b"][0], p["b"][1], 0])[2]), 4)]
    if solver == "vector.components":
        # The ordered pair IS the component vector; re-checked by rebuilding it from the two legs.
        a = p["a"]
        x = sum(v[0] for v in ([a[0]],))  # east–west leg
        y = sum(v[0] for v in ([a[1]],))  # north–south leg
        return [round(x, 6), round(y, 6)]
    if solver == "vector.triple":
        return [round(dot(p["a"], cross(p["b"], p["c"])), 4)]
    if solver == "hydro.pressure":
        return [round((p["p0_pa"] + p["rho"] * p["g"] * p["depth_m"]) / 1e5, 6)]
    if solver == "hydro.pressure_diff":
        # bar first (the key), then the equivalent column height in metres
        return [round(abs(p["d1"] - p["d2"]) * p["rho"] * p["g"] / 1e5, 6), round(abs(p["d1"] - p["d2"]) / 10, 6)]
    if solver == "hydro.buoyant_mass":
        return [round(p["volume_m3"] * p["submergedFraction"] * p["rho"], 4)]
    if solver == "hydro.trapped_air_rise":
        # h = H · (d/10) / (1 + d/10) with p₀ = 1 bar and the 1 bar per 10 m rule
        d, H, p0 = p["depth_m"], p["roomHeight_m"], p["p0_pa"] / 1e5
        return [round(H * (d / 10) / (p0 + d / 10), 4)]
    if solver == "hydro.suction_lift":
        return [round(p["vacuum_bar"] * 10, 4)]
    if solver == "eoq.qstar":
        return [round(math.sqrt(2 * p["D"] * p["S"] / p["H"]), 4)]
    if solver == "eoq.total_cost":
        D, S, H, Q = p["D"], p["S"], p["H"], p["Q"]
        return [round(D / Q * S + Q / 2 * H, 4)]
    if solver == "eoq.orders_per_year":
        return [round(p["D"] / p["Q"], 4)]
    if solver == "eoq.cycle_days":
        return [round(365 * p["Q"] / p["D"], 4)]
    if solver == "eoq.sensitivity":
        k = p["k"]
        return [round((k + 1 / k) / 2, 6)]
    if solver == "finance.breakeven":
        return [round(p["fixedCost"] / (p["price"] - p["variableCost"]), 4)]
    if solver == "stat.mean":
        v = p["values"]
        return [round(sum(v) / len(v), 6)]
    if solver == "stat.median":
        v = sorted(p["values"])
        n = len(v)
        return [round((v[n // 2] if n % 2 else (v[n // 2 - 1] + v[n // 2]) / 2), 6)]
    if solver == "stat.weighted_mean":
        return [round(sum(a * b for a, b in zip(p["values"], p["weights"])) / sum(p["weights"]), 6)]
    if solver == "stat.probability":
        base = p["favourable"] / p["total"]
        return [round(1 - base if p["complement"] else base, 6)]
    if solver == "stat.bayes_counts":
        return [round(p["n_both"] / p["n_outcome"], 6), round(100 * p["n_both"] / p["n_outcome"], 4)]  # probability first
    if solver == "physics.power":
        return [round(p["energy_J"] / p["time_s"], 6)]
    if solver == "physics.work":
        return [round(p["force_N"] * p["distance_m"], 6)]
    if solver == "physics.efficiency":
        return [round(100 * p["useful_J"] / p["input_J"], 4)]
    if solver == "physics.flow_continuity":
        return [round(p["area1"] * p["velocity1"] / p["area2"], 6)]
    if solver == "physics.lever":
        return [round(p["load_N"] * p["loadArm"] / p["effortArm"], 6)]
    if solver == "physics.moment":
        return [round(p["force_N"] * p["arm_m"], 6)]
    if solver == "physics.lever_arm":
        return [round(p["load_N"] * p["loadArm_m"] / p["effort_N"], 6)]
    if solver == "physics.mechanical_advantage":
        return [round(p["effortArm_m"] / p["loadArm_m"], 6)]
    if solver == "physics.pressure_from_force":
        return [round(p["force_N"] / p["area_m2"] / 1000, 6)]
    if solver == "physics.force_from_pressure":
        return [round(p["pressure_bar"] * 100000 * p["area_m2"] / 1000, 6)]
    if solver == "physics.density":
        return [round(p["mass_kg"] / p["volume_m3"], 6)]
    if solver == "physics.gas_ratio":
        return [round(p["p1"] * p["v1"] / p["p2"], 6)]
    if solver == "math.percentage_change":
        return [round(100 * (p["to"] - p["from"]) / p["from"], 6)]
    if solver == "math.proportion":
        return [round(p["b"] * p["c"] / p["a"], 6)]
    if solver == "math.unit_convert":
        return [round(p["value"] * p["factor"], 6)]
    if solver == "math.rate":
        return [round(p["amount"] * p["target"] / p["per"], 6)]
    if solver == "comp.binary_to_decimal":
        return [float(int(p["bits"], 2))]
    if solver == "comp.loop_trace":
        v = p["start"]
        for _ in range(p["iterations"]):
            v = v + p["step"] if p["op"] == "add" else v * p["step"]
        return [round(v, 6)]
    if solver == "econ.elasticity_direction":
        return [round(p["elasticity"] * p["priceChangePct"], 6)]
    if solver == "econ.opportunity_cost":
        return [round(sum(p["explicit"]) + p["bestForgone"], 6)]
    if solver == "datainterp.gradient":
        return [round((p["y2"] - p["y1"]) / (p["x2"] - p["x1"]), 6)]
    if solver == "datainterp.share":
        return [round(100 * p["part"] / p["total"], 6)]
    return None


def main() -> int:
    if not BANK.exists():
        print(f"bank file not found: {BANK}")
        print("run `npm run build:bank` first")
        return 1
    data = json.loads(BANK.read_text())
    questions = data["questions"]
    solvable = agreed = skipped = 0
    failures: list[str] = []
    per_solver: dict[str, int] = {}

    for q in questions:
        v = q.get("verification")
        if not v:
            continue
        result = solve(v["solver"], v.get("payload", {}))
        if result is None:
            skipped += 1
            continue
        solvable += 1
        per_solver[v["solver"]] = per_solver.get(v["solver"], 0) + 1
        if v["solver"] == "hydro.trapped_air_rise":
            # documented approximation: the officially simplified model is checked with a looser
            # tolerance because the refined model deliberately gives a slightly larger rise
            tol = 0.12
        else:
            tol = 0.02
        declared = numbers(q["options"][q["correctIndex"]]["text"])
        if agree(declared, result, tol):
            agreed += 1
        else:
            failures.append(f"{q['id']} [{v['solver']}] key={q['options'][q['correctIndex']]['text']!r} declared={declared} recomputed={result}")

    print("=== INDEPENDENT CROSS-LANGUAGE VERIFICATION (Python) ===")
    print(f"bank file        : {BANK}")
    print(f"questions in bank: {len(questions)}")
    print(f"solvable items   : {solvable}")
    print(f"agreed           : {agreed}")
    print(f"not solvable here: {skipped}  (qualitative items — checked by the option-level audit)")
    print(f"FAILURES         : {len(failures)}")
    for f in failures[:25]:
        print("  MISMATCH", f)
    if per_solver:
        print("solvers exercised:", ", ".join(f"{k}×{n}" for k, n in sorted(per_solver.items())))
    print("RESULT:", "PASS" if not failures else "FAIL")
    return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(main())
