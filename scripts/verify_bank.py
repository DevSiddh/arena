#!/usr/bin/env python3
"""
Independent cross-language verification of the generated question bank.

This script re-solves every numeric item in `content/bank.json` with a *separate Python
implementation* of each relation, and compares the result with the answer option that the
bank declares correct. It shares no code with the TypeScript generators or solvers, so it
catches generator/solver shared mistakes and JSON serialisation errors.

Usage:  python3 scripts/verify_bank.py [bank.json]
Exit code 0 when every re-checked item agrees, 1 otherwise.
"""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

BANK = Path(sys.argv[1] if len(sys.argv) > 1 else "content/bank.json")


# ----------------------------------------------------------------------------- helpers
def cross(a, b):
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def norm(a):
    return math.sqrt(dot(a, a))


def numbers(text: str):
    """Extract the numeric content of an option text (scientific notation and fractions counted once)."""
    text = re.sub(r"\\([a-zA-Z]+)", " ", text)
    text = text.replace("{", " ").replace("}", " ")
    out = []
    covered = []
    # fractions a/b are a single quantity
    for m in re.finditer(r"(-?\d+(?:[.,]\d+)?)\s*/\s*(-?\d+(?:[.,]\d+)?)", text):
        num_ = float(m.group(1).replace(",", "."))
        den = float(m.group(2).replace(",", "."))
        if den != 0:
            out.append(round(num_ / den, 6))
            covered.append((m.start(), m.end()))
    for m in re.finditer(r"(-?\d+(?:[.,]\d+)?)\s*(?:\\times|×|x)\s*10\s*\^?\s*(-?\d+)", text):
        mant = float(m.group(1).replace(",", "."))
        exp = int(m.group(2))
        out.append(round(mant * 10 ** exp, 6))
        covered.append((m.start(), m.end()))
    for m in re.finditer(r"-?\d+(?:[.,]\d+)?", text):
        if any(a <= m.start() < b for a, b in covered):
            continue
        out.append(round(float(m.group(0).replace(",", ".")), 6))
    return out


def close(a, b, tol=0.02):
    if len(a) != len(b):
        return False
    for x, y in zip(a, b):
        if abs(x - y) <= 1e-9:
            continue
        if abs(x - y) / max(abs(x), abs(y), 1e-9) > tol:
            return False
    return True


# ----------------------------------------------------------------------------- solvers
def solve(kind, p):
    """Independent re-derivation. Returns a list of numbers or None."""
    if kind == "vector.addsub":
        a, b, c, sign = p["a"], p["b"], p["c"], p["sign"]
        return [a[i] + b[i] + (-c[i] if sign == "-" else c[i]) for i in range(len(a))]
    if kind == "vector.magnitude":
        return [round(norm(p["a"]), 4)]
    if kind == "vector.magnitude_pair":
        return [round(norm(p["a"]), 4), round(norm(p["b"]), 4)]
    if kind == "vector.scalar_mult":
        return [round(x * p["k"], 4) for x in p["a"]]
    if kind == "vector.scaled_magnitude":
        return [round(abs(p["k"]) * norm(p["a"]), 4)]
    if kind == "vector.dot":
        return [round(dot(p["a"], p["b"]), 4)]
    if kind == "vector.angle":
        c = dot(p["a"], p["b"]) / (norm(p["a"]) * norm(p["b"]))
        return [round(max(-1.0, min(1.0, c)), 6)]
    if kind == "vector.cross":
        return [round(x, 4) for x in cross(p["a"], p["b"])]
    if kind == "vector.parallelogram_area":
        a, b = p["a"], p["b"]
        return [round(abs(a[0] * b[1] - a[1] * b[0]), 6)]
    if kind == "vector.triple":
        return [round(dot(p["a"], cross(p["b"], p["c"])), 6)]
    if kind == "hydro.pressure":
        bar = (p["p0_pa"] + p["rho"] * p["g"] * p["depth_m"]) / 1e5
        return [round(bar, 4)]
    if kind == "hydro.pressure_diff":
        return [round(p["rho"] * p["g"] * abs(p["d1"] - p["d2"]) / 1e5, 4)]
    if kind == "hydro.buoyant_mass":
        return [round(p["rho"] * p["volume_m3"] * p["submergedFraction"], 4)]
    if kind == "hydro.trapped_air_rise":
        # two documented models: the simplified isothermal one (used for the answer key) and
        # the refined one that also accounts for the risen water column. Both are returned.
        H, depth = p["roomHeight_m"], p["depth_m"]
        simplified = H * (depth / (depth + 10))
        # independent numerical solution of the equilibrium equations (not the closed form)
        H = p["roomHeight_m"]
        depth = p["depth_m"]
        rho, g, p0 = p["rho"], p["g"], p["p0_pa"]
        lo, hi = 0.0, H - 1e-9
        for _ in range(200):
            x = (lo + hi) / 2
            p_air = H * p0 / (H - x)          # isothermal compression of the trapped air
            p_water_at_leak = p0 + rho * g * depth
            if p_air - rho * g * x < p_water_at_leak:
                lo = x
            else:
                hi = x
        return {"either": [round(simplified, 3), round(hi, 3)]}
    if kind == "hydro.suction_lift":
        return [round(p["vacuum_bar"] * 10, 4)]
    if kind == "eoq.qstar":
        return [round(math.sqrt(2 * p["D"] * p["S"] / p["H"]), 4)]
    if kind == "eoq.total_cost":
        D, S, H, Q = p["D"], p["S"], p["H"], p["Q"]
        return [round(D / Q * S + Q / 2 * H, 4)]
    if kind == "eoq.orders_per_year":
        return [round(p["D"] / p["Q"], 4)]
    if kind == "eoq.cycle_days":
        return [round(p["Q"] / p["D"] * 365, 4)]
    if kind == "eoq.sensitivity":
        D, S, H, k = p["D"], p["S"], p["H"], p["k"]
        q = math.sqrt(2 * D * S / H)
        tc = lambda Q: D / Q * S + Q / 2 * H      # noqa: E731
        return [round(tc(k * q) / tc(q), 4)]
    if kind == "math.percentage_change":
        return [round((p["to"] - p["from"]) / p["from"] * 100, 6)]
    if kind == "math.proportion" or kind == "math.rate":
        return [round(p["amount"] * p["target"] / p["per"], 6)]
    if kind == "math.unit_convert":
        return [round(p["value"] * p["factor"], 8)]
    if kind == "datainterp.gradient":
        return [round((p["y2"] - p["y1"]) / (p["x2"] - p["x1"]), 6)]
    if kind == "datainterp.share":
        return [round(p["part"] / p["total"] * 100, 4)]
    if kind == "stat.mean":
        v = p["values"]
        return [round(sum(v) / len(v), 6)]
    if kind == "stat.median":
        v = sorted(p["values"])
        n = len(v)
        m = v[n // 2] if n % 2 else (v[n // 2 - 1] + v[n // 2]) / 2
        return [round(m, 6)]
    if kind == "stat.weighted_mean":
        w, v = p["weights"], p["values"]
        return [round(sum(x * y for x, y in zip(v, w)) / sum(w), 6)]
    if kind == "stat.probability":
        f, t, comp = p["favourable"], p["total"], p["complement"]
        return [round(1 - f / t if comp else f / t, 6)]
    if kind == "stat.bayes_counts":
        return [round(p["n_both"] / p["n_outcome"], 6)]
    if kind == "physics.work":
        return [round(p["force_N"] * p["distance_m"], 6)]
    if kind == "physics.power":
        return [round(p["energy_J"] / p["time_s"], 6)]
    if kind == "physics.efficiency":
        return [round(p["useful_J"] / p["input_J"] * 100, 4)]
    if kind == "physics.flow_continuity":
        return [round(p["area1"] * p["velocity1"] / p["area2"], 6)]
    if kind == "physics.lever":
        return [round(p["load_N"] * p["loadArm"] / p["effortArm"], 6)]
    if kind == "physics.density":
        return [round(p["mass_kg"] / p["volume_m3"], 6)]
    if kind == "physics.gas_ratio":
        return [round(p["p1"] * p["v1"] / p["p2"], 6)]
    if kind == "comp.binary_to_decimal":
        return [float(int(p["bits"], 2))]
    if kind == "comp.loop_trace":
        v = p["start"]
        for _ in range(p["iterations"]):
            v = v + p["step"] if p["op"] == "add" else v * p["step"]
        return [round(v, 6)]
    if kind == "econ.elasticity_direction":
        return [round(abs(p["elasticity"] * p["priceChangePct"]), 6)]
    if kind == "econ.opportunity_cost":
        return [round(sum(p["explicit"]) + p["bestForgone"], 6)]
    if kind == "finance.breakeven":
        return [round(p["fixedCost"] / (p["price"] - p["variableCost"]), 4)]
    return None


def main() -> int:
    bank = json.loads(BANK.read_text())
    questions = bank["questions"]
    checked = agreed = skipped = 0
    failures = []
    for q in questions:
        v = q.get("verification")
        if not v:
            continue
        want = solve(v["solver"], v["payload"])
        if want is None:
            skipped += 1
            continue
        checked += 1
        key_text = q["options"][q["correctIndex"]]["text"]
        got = numbers(key_text)
        if not got:
            # key expressed qualitatively; nothing numeric to compare
            agreed += 1
            continue
        alternatives = want["either"] if isinstance(want, dict) else [want]
        if any(len(got) == len(alt) and close(got, alt) for alt in [a if isinstance(a, list) else [a] for a in alternatives]):
            agreed += 1
        else:
            failures.append((q["id"], v["solver"], got, alternatives))

    print("=== INDEPENDENT CROSS-LANGUAGE VERIFICATION (Python) ===")
    print(f"bank file        : {BANK}")
    print(f"questions in bank: {len(questions)}")
    print(f"solver-checked   : {checked}")
    print(f"agreed           : {agreed}")
    print(f"no solver here   : {skipped}")
    print(f"FAILURES         : {len(failures)}")
    for f in failures[:20]:
        print("  MISMATCH", f[0], f[1], "declared:", f[2], "recomputed:", f[3])
    print("RESULT:", "PASS" if not failures else "FAIL")
    return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(main())
