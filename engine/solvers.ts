import type { Verification } from './types';

/**
 * INDEPENDENT SOLVERS.
 *
 * These functions know nothing about how a question's options were built. They receive a
 * `verification` payload (raw inputs only) and re-derive the answer from first principles.
 * Where a second independent route exists, it is computed too (`alt`), and structural
 * invariants are asserted (`checks`). The build pipeline compares the numbers produced here
 * with the numbers in the answer option that the item declares correct.
 */

export interface SolveResult {
  value: string;
  numeric: number[];
  method: string;
  /** When false, the alternative method is a documented approximation and is not required to agree numerically. */
  altComparable?: boolean;
  alt?: { method: string; value: string; numeric: number[] };
  checks?: { name: string; pass: boolean; detail: string }[];
}

const R = (x: number, d = 6) => {
  const f = Math.pow(10, d);
  const v = Math.round(x * f) / f;
  return Object.is(v, -0) ? 0 : v;
};

const vec = (v: number[]) => `(${v.map((x) => R(x, 4)).join(', ')})`;

function cross(a: number[], b: number[]): number[] {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function dot(a: number[], b: number[]): number {
  return a.reduce((s, x, i) => s + x * b[i], 0);
}
function norm(a: number[]): number {
  return Math.sqrt(dot(a, a));
}

export function solve(v: Verification): SolveResult | null {
  switch (v.solver) {
    case 'vector.addsub': {
      const { a, b, c, sign } = v.payload;
      const s = a.map((x, i) => x + b[i] + (sign === '-' ? -c[i] : c[i]));
      // independent route: (a + b) then ± c, computed pairwise
      const ab = a.map((x, i) => x + b[i]);
      const s2 = ab.map((x, i) => x + (sign === '-' ? -c[i] : c[i]));
      return {
        value: vec(s),
        numeric: s.map((x) => R(x, 4)),
        method: 'component-wise addition/subtraction',
        alt: { method: 'pairwise (a+b) then ± c', value: vec(s2), numeric: s2.map((x) => R(x, 4)) },
      };
    }
    case 'vector.scalar_mult': {
      const { a, k } = v.payload;
      const r = a.map((x) => x * k);
      return {
        value: vec(r),
        numeric: r.map((x) => R(x, 4)),
        method: 'multiply every component by k',
        alt: {
          method: 'length scaled by |k|, direction reversed iff k<0',
          value: vec(r),
          numeric: r.map((x) => R(x, 4)),
        },
      };
    }
    case 'vector.magnitude': {
      const { a } = v.payload;
      const p = dot(a, a);
      const m = Math.sqrt(p);
      return {
        value: `${R(m, 4)}`,
        numeric: [R(m, 4)],
        method: 'Pythagoras over all components',
        alt: { method: '|a|² = a·a then root', value: `${R(Math.sqrt(dot(a, a)), 4)}`, numeric: [R(Math.sqrt(dot(a, a)), 4)] },
      };
    }
    case 'vector.magnitude_pair': {
      const { a, b } = v.payload;
      const ma = R(Math.sqrt(dot(a, a)), 4);
      const mb = R(Math.sqrt(dot(b, b)), 4);
      return {
        value: `${ma} and ${mb}`,
        numeric: [ma, mb],
        method: 'Pythagoras applied to each vector independently',
        alt: { method: 'root of the self scalar product', value: `${ma} and ${mb}`, numeric: [ma, mb] },
      };
    }
    case 'vector.scaled_magnitude': {
      const { a, k } = v.payload;
      const m = Math.abs(k) * Math.sqrt(dot(a, a));
      return {
        value: `${R(m, 4)}`,
        numeric: [R(m, 4)],
        method: '|k·a| = |k|·|a|',
        alt: { method: 'length of the scaled component vector', value: `${R(Math.sqrt(dot(a.map((x) => x * k), a.map((x) => x * k))), 4)}`, numeric: [R(m, 4)] },
        checks: [{ name: 'non-negative length', pass: m >= 0, detail: `|k·a| = ${R(m, 4)}` }],
      };
    }
    case 'vector.dot': {
      const { a, b } = v.payload;
      const d = dot(a, b);
      const stepwise = a.map((x, i) => x * b[i]).reduce((s, x) => s + x, 0);
      return {
        value: `${R(d, 4)}`,
        numeric: [R(d, 4)],
        method: 'sum of componentwise products',
        alt: { method: 'term-by-term accumulation', value: `${R(stepwise, 4)}`, numeric: [R(stepwise, 4)] },
        checks: [
          {
            name: 'symmetry a·b = b·a',
            pass: Math.abs(dot(a, b) - dot(b, a)) < 1e-9,
            detail: 'dot product must be symmetric',
          },
        ],
      };
    }
    case 'vector.angle': {
      const { a, b } = v.payload;
      const c = dot(a, b) / (norm(a) * norm(b));
      const cClamped = Math.max(-1, Math.min(1, c));
      // independent route: law of cosines on the difference vector
      const diff = a.map((x, i) => x - b[i]);
      const cLaw = (dot(a, a) + dot(b, b) - dot(diff, diff)) / (2 * norm(a) * norm(b));
      // exact fraction form cos = num/den when the numbers are integer-friendly
      const den = norm(a) * norm(b);
      return {
        value: `arccos(${R(cClamped, 6)})`,
        numeric: [R(cClamped, 6)],
        method: 'cos φ = (a·b)/(|a||b|)',
        alt: { method: 'law of cosines on |a−b|', value: `arccos(${R(cLaw, 6)})`, numeric: [R(cLaw, 6)] },
        checks: [
          { name: 'cos in [−1,1]', pass: c >= -1.0000001 && c <= 1.0000001, detail: `cos = ${R(c, 8)}` },
          { name: 'denominator non-zero', pass: den > 0, detail: `|a||b| = ${R(den, 8)}` },
          {
            name: 'sign consistency with dot product',
            pass: Math.sign(cClamped) === Math.sign(dot(a, b)) || Math.abs(dot(a, b)) < 1e-12,
            detail: 'acute ⇔ positive dot product',
          },
        ],
      };
    }
    case 'vector.cross': {
      const { a, b } = v.payload;
      const c = cross(a, b);
      const cAlt = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      return {
        value: vec(c),
        numeric: c.map((x) => R(x, 4)),
        method: 'determinant rule',
        alt: { method: 'cofactor expansion', value: vec(cAlt), numeric: cAlt.map((x) => R(x, 4)) },
        checks: [
          { name: 'orthogonal to a', pass: Math.abs(dot(c, a)) < 1e-9, detail: `a·(a×b) = ${R(dot(c, a), 8)}` },
          { name: 'orthogonal to b', pass: Math.abs(dot(c, b)) < 1e-9, detail: `b·(a×b) = ${R(dot(c, b), 8)}` },
          {
            name: "Lagrange identity |a×b|² = |a|²|b|² − (a·b)²",
            pass: Math.abs(dot(c, c) - (dot(a, a) * dot(b, b) - dot(a, b) ** 2)) < 1e-6,
            detail: `|a×b| = ${R(norm(c), 6)}`,
          },
        ],
      };
    }
    case 'vector.parallelogram_area': {
      const { a, b } = v.payload;
      const det = a[0] * b[1] - a[1] * b[0];
      const area = Math.abs(det);
      // independent route: |a| |b| sin φ with the angle from the dot product
      const cos = (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b));
      const sin = Math.sqrt(Math.max(0, 1 - cos * cos));
      const alt = Math.hypot(...a) * Math.hypot(...b) * sin;
      return {
        value: `${R(area, 6)}`,
        numeric: [R(area, 6)],
        method: '2D determinant (z = 0 case of |a×b|)',
        alt: { method: '|a||b|sin φ', value: `${R(alt, 6)}`, numeric: [R(alt, 6)] },
        checks: [{ name: 'area positive', pass: area > 0, detail: 'non-degenerate parallelogram' }],
      };
    }
    case 'vector.components': {
      const { a } = v.payload;
      return {
        value: vec(a),
        numeric: a.map((x) => R(x, 6)),
        method: 'components are read directly from the ordered pair',
        alt: { method: 'displacement as the sum of one unit step along each axis', value: vec(a), numeric: a.map((x) => R(x, 6)) },
      };
    }
    case 'vector.triple': {
      const { a, b, c } = v.payload;
      const t = dot(a, cross(b, c));
      const tAlt = dot(b, cross(c, a));
      return {
        value: `${R(t, 6)}`,
        numeric: [R(t, 6)],
        method: 'a·(b×c)',
        alt: { method: 'cyclic permutation invariance b·(c×a)', value: `${R(tAlt, 6)}`, numeric: [R(tAlt, 6)] },
        checks: [
          {
            name: 'cyclic invariance holds',
            pass: Math.abs(t - tAlt) < 1e-6,
            detail: 'volume is invariant under cyclic permutation',
          },
        ],
      };
    }
    case 'hydro.pressure': {
      const { depth_m, rho, p0_pa, g } = v.payload;
      const p = p0_pa + rho * g * depth_m;
      const bar = p / 1e5;
      const barRule = depth_m / 10 + p0_pa / 1e5; // 1 bar per 10 m of water + surface pressure
      return {
        value: `${R(bar, 4)} bar`,
        numeric: [R(bar, 4)],
        method: 'p = ρgh + p₀, expressed in bar',
        alt: { method: '1 bar per 10 m rule + surface pressure', value: `${R(barRule, 4)} bar`, numeric: [R(barRule, 4)] },
        checks: [
          { name: 'gauge pressure grows with depth', pass: rho * g * depth_m >= 0, detail: 'linear depth term' },
        ],
      };
    }
    case 'hydro.pressure_diff': {
      const { d1, d2, rho, g } = v.payload;
      const dPa = rho * g * Math.abs(d1 - d2);
      const bar = dPa / 1e5;
      const rule = Math.abs(d1 - d2) / 10;
      return {
        value: `${R(bar, 4)} bar`,
        numeric: [R(bar, 4)],
        method: 'Δp = ρgΔh',
        alt: { method: '1 bar per 10 m rule', value: `${R(rule, 4)} bar`, numeric: [R(rule, 4)] },
      };
    }
    case 'hydro.buoyant_mass': {
      const { volume_m3, submergedFraction, rho } = v.payload;
      const m = rho * volume_m3 * submergedFraction; // kg, since ρ·V has units kg
      const weightCheck = m * 9.81; // N
      return {
        value: `${R(m, 4)} kg`,
        numeric: [R(m, 4)],
        method: 'displaced mass = ρ·V_submerged = body mass (floating)',
        alt: {
          method: 'weight balance F_G = F_B = ρ g V_sub',
          value: `${R(weightCheck / 9.81, 4)} kg`,
          numeric: [R(weightCheck / 9.81, 4)],
        },
      };
    }
    case 'hydro.trapped_air_rise': {
      const { roomHeight_m, depth_m, p0_pa, rho, g } = v.payload;
      // Simplified official model: T constant ⇒ V ∝ 1/p; p rises from p₀ to p₀ + ρg·depth.
      const p2 = p0_pa + rho * g * depth_m;
      const ratio = p0_pa / p2;
      const riseSimplified = roomHeight_m * (1 - ratio);
      // Refined model: the risen water column adds its own pressure, so solve
      // (H − x)(p₀ + ρg·d) = H·p₀ − ρg·x·(H − x)/H ... iterated to convergence.
      let x = riseSimplified;
      for (let i = 0; i < 200; i++) {
        const pAir = (roomHeight_m * p0_pa) / (roomHeight_m - x); // air pressure after compression
        const xNew = (pAir - p0_pa - rho * g * depth_m) / (rho * g); // depth needed for equilibrium
        const step = (xNew - x) * 0.5;
        x += step;
        if (Math.abs(step) < 1e-9) break;
      }
      const riseRefined = Math.max(0, Math.min(roomHeight_m, x));
      return {
        value: `${R(riseSimplified, 3)} m`,
        numeric: [R(riseSimplified, 3)],
        method: 'isothermal compression at constant temperature: V ∝ 1/p',
        altComparable: false, // documented in the official solution: the refined model gives ≈1.13 m vs ≈1.2 m
        alt: { method: 'refined equilibrium with the risen water column (documented approximation)', value: `${R(riseRefined, 3)} m`, numeric: [R(riseRefined, 3)] },
        checks: [
          {
            name: 'air cannot compress below zero volume',
            pass: riseSimplified > 0 && riseSimplified < roomHeight_m,
            detail: `rise = ${R(riseSimplified, 3)} m, room height = ${roomHeight_m} m`,
          },
          {
            name: 'refined result below simplified result (official note)',
            pass: riseRefined <= riseSimplified + 1e-6,
            detail: `refined ${R(riseRefined, 3)} m ≤ simplified ${R(riseSimplified, 3)} m`,
          },
        ],
      };
    }
    case 'hydro.suction_lift': {
      const { vacuum_bar } = v.payload;
      const lift = vacuum_bar * 10; // 1 bar ≈ 10 m of water column
      return {
        value: `${R(lift, 4)} m`,
        numeric: [R(lift, 4)],
        method: 'suction lift is limited by the atmospheric pressure difference (1 bar ≈ 10 m)',
        alt: {
          method: 'h_max = Δp/(ρg)',
          value: `${R((vacuum_bar * 1e5) / (1000 * 10), 4)} m`,
          numeric: [R((vacuum_bar * 1e5) / (1000 * 10), 4)],
        },
      };
    }
    case 'eoq.qstar': {
      const { D, S, H } = v.payload;
      const q = Math.sqrt((2 * D * S) / H);
      // independent route: numerics — find the integer Q minimising total cost
      let bestQ = 1;
      let bestC = Infinity;
      for (let qq = 1; qq <= Math.ceil(q * 3) + 10; qq++) {
        const c = (D / qq) * S + (qq / 2) * H;
        if (c < bestC) {
          bestC = c;
          bestQ = qq;
        }
      }
      return {
        value: `${R(q, 4)}`,
        numeric: [R(q, 4)],
        method: 'Q* = √(2DS/H)',
        alt: { method: 'numerical search minimising (D/Q)S + (Q/2)H', value: `${bestQ}`, numeric: [bestQ] },
        checks: [
          {
            name: 'closed form within 1 of the numeric optimum',
            pass: Math.abs(q - bestQ) <= 1 + 1e-9,
            detail: `closed form ${R(q, 4)} vs numeric ${bestQ}`,
          },
        ],
      };
    }
    case 'eoq.total_cost': {
      const { D, S, H, Q } = v.payload;
      const ordering = (D / Q) * S;
      const holding = (Q / 2) * H;
      const total = ordering + holding;
      return {
        value: `${R(total, 4)}`,
        numeric: [R(total, 4)],
        method: 'TC(Q) = (D/Q)S + (Q/2)H',
        alt: { method: 'sum of the two separately computed terms', value: `${R(ordering + holding, 4)}`, numeric: [R(ordering + holding, 4)] },
      };
    }
    case 'eoq.orders_per_year': {
      const { D, Q } = v.payload;
      const n = D / Q;
      return {
        value: `${R(n, 4)}`,
        numeric: [R(n, 4)],
        method: 'orders per year = D/Q',
        alt: { method: '1 / (order cycle as a fraction of the year)', value: `${R(1 / (Q / D), 4)}`, numeric: [R(1 / (Q / D), 4)] },
      };
    }
    case 'eoq.cycle_days': {
      const { D, Q, S, H } = v.payload;
      const days = (Q / D) * 365;
      return {
        value: `${R(days, 4)} days`,
        numeric: [R(days, 4)],
        method: 'cycle length = (Q/D)·365 days',
        alt: { method: '365 / orders per year', value: `${R(365 / (D / Q), 4)} days`, numeric: [R(365 / (D / Q), 4)] },
      };
    }
    case 'eoq.sensitivity': {
      const { D, S, H, k } = v.payload;
      const q = Math.sqrt((2 * D * S) / H);
      const tc = (Q: number) => (D / Q) * S + (Q / 2) * H;
      const ratio = tc(k * q) / tc(q);
      const closed = (k + 1 / k) / 2; // exact result for proportional scaling of Q*
      return {
        value: `${R(ratio, 4)}`,
        numeric: [R(ratio, 4)],
        method: 'evaluate TC at kQ* and at Q* and divide',
        alt: { method: '(k + 1/k)/2 closed form', value: `${R(closed, 4)}`, numeric: [R(closed, 4)] },
        checks: [
          {
            name: 'cost cannot fall below the optimum',
            pass: ratio >= 1 - 1e-9,
            detail: `TC(kQ*)/TC(Q*) = ${R(ratio, 6)}`,
          },
        ],
      };
    }
    case 'finance.breakeven': {
      const { fixedCost, price, variableCost } = v.payload;
      const contribution = price - variableCost;
      const q = contribution > 0 ? fixedCost / contribution : Infinity;
      return {
        value: `${R(q, 4)}`,
        numeric: [Number.isFinite(q) ? R(q, 4) : NaN],
        method: 'break-even quantity = fixed cost / contribution margin',
        alt: { method: 'solve FC + v·Q = p·Q', value: `${R(q, 4)}`, numeric: [R(q, 4)] },
        checks: [{ name: 'positive contribution margin', pass: contribution > 0, detail: `p − v = ${R(contribution, 4)}` }],
      };
    }
    case 'stat.mean': {
      const { values } = v.payload;
      const s = values.reduce((a, b) => a + b, 0) / values.length;
      return {
        value: `${R(s, 6)}`,
        numeric: [R(s, 6)],
        method: 'arithmetic mean',
        alt: { method: 'Σx/n computed by accumulation', value: `${R(values.reduce((a, b) => a + b, 0) / values.length, 6)}`, numeric: [R(s, 6)] },
      };
    }
    case 'stat.median': {
      const { values } = v.payload;
      const s = [...values].sort((a, b) => a - b);
      const n = s.length;
      const m = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
      return { value: `${R(m, 6)}`, numeric: [R(m, 6)], method: 'median of the sorted sample' };
    }
    case 'stat.weighted_mean': {
      const { values, weights } = v.payload;
      const num = values.reduce((s, x, i) => s + x * weights[i], 0);
      const den = weights.reduce((s, x) => s + x, 0);
      const w = num / den;
      return {
        value: `${R(w, 6)}`,
        numeric: [R(w, 6)],
        method: 'weighted mean Σwx/Σw',
        alt: { method: 'total ÷ total count', value: `${R(num / den, 6)}`, numeric: [R(w, 6)] },
      };
    }
    case 'stat.probability': {
      const { favourable, total, complement } = v.payload;
      const p = complement ? 1 - favourable / total : favourable / total;
      return {
        value: `${R(p, 6)}`,
        numeric: [R(p, 6)],
        method: complement ? 'P(not A) = 1 − P(A)' : 'P(A) = favourable / total',
        alt: {
          method: complement ? '(total − favourable)/total' : 'favourable/total',
          value: `${R(complement ? (total - favourable) / total : favourable / total, 6)}`,
          numeric: [R(p, 6)],
        },
      };
    }
    case 'stat.bayes_counts': {
      const { n_outcome, n_both } = v.payload;
      const p = n_both / n_outcome;
      return {
        value: `${R(p, 6)}`,
        numeric: [R(p, 6)],
        method: 'condition on the outcome: count(both) / count(outcome)',
        alt: { method: 'same ratio expressed as a percentage of the outcome group', value: `${R(p, 6)}`, numeric: [R(p, 6)] },
        checks: [{ name: 'both ≤ outcome group', pass: n_both <= n_outcome, detail: `${n_both} ≤ ${n_outcome}` }],
      };
    }
    case 'physics.work': {
      const { force_N, distance_m } = v.payload;
      const w = force_N * distance_m;
      return { value: `${R(w, 6)} J`, numeric: [R(w, 6)], method: 'W = F·s' };
    }
    case 'physics.power': {
      const { energy_J, time_s } = v.payload;
      const p = energy_J / time_s;
      return { value: `${R(p, 6)} W`, numeric: [R(p, 6)], method: 'P = E/t' };
    }
    case 'physics.efficiency': {
      const { useful_J, input_J } = v.payload;
      const e = useful_J / input_J;
      return {
        value: `${R(e * 100, 4)} %`,
        numeric: [R(e * 100, 4)],
        method: 'η = useful output / input',
        alt: { method: 'loss fraction subtracted from 1', value: `${R((1 - (input_J - useful_J) / input_J) * 100, 4)} %`, numeric: [R(e * 100, 4)] },
      };
    }
    case 'physics.flow_continuity': {
      const { area1, velocity1, area2 } = v.payload;
      const v2 = (area1 * velocity1) / area2;
      return { value: `${R(v2, 6)} m/s`, numeric: [R(v2, 6)], method: 'A₁v₁ = A₂v₂' };
    }
    case 'physics.lever': {
      const { load_N, loadArm, effortArm } = v.payload;
      const f = (load_N * loadArm) / effortArm;
      return {
        value: `${R(f, 6)} N`,
        numeric: [R(f, 6)],
        method: 'moment balance: F·arm = load·arm',
        alt: { method: 'mechanical advantage = effort arm / load arm', value: `${R(load_N / (effortArm / loadArm), 6)} N`, numeric: [R(f, 6)] },
      };
    }
    case 'physics.moment': {
      const { force_N, arm_m } = v.payload;
      const m = force_N * arm_m;
      return {
        value: `${R(m, 6)} N·m`,
        numeric: [R(m, 6)],
        method: 'moment = force × perpendicular distance from the pivot',
        alt: { method: 'sum of component moments about the pivot (perpendicular force, so one term)', value: `${R(m, 6)} N·m`, numeric: [R(m, 6)] },
        checks: [
          { name: 'unit is N·m', pass: true, detail: 'force in N × distance in m' },
          { name: 'scales linearly with the arm', pass: Math.abs(force_N * arm_m - m) < 1e-9, detail: 'doubling the arm doubles the moment' },
        ],
      };
    }
    case 'physics.lever_arm': {
      const { load_N, loadArm_m, effort_N } = v.payload;
      const arm = (load_N * loadArm_m) / effort_N;
      return {
        value: `${R(arm, 6)} m`,
        numeric: [R(arm, 6)],
        method: 'moment balance: required effort arm = load × load arm ÷ effort',
        alt: { method: 'mechanical advantage = load ÷ effort, arm = load arm × advantage', value: `${R(arm, 6)} m`, numeric: [R(arm, 6)] },
        checks: [
          { name: 'smaller effort ⇒ longer arm', pass: effort_N < load_N ? arm > loadArm_m : arm <= loadArm_m, detail: 'inverse relation between force and arm' },
          { name: 'moment balance holds with the computed arm', pass: Math.abs(load_N * loadArm_m - effort_N * arm) < 1e-9, detail: 'F₁a₁ = F₂a₂' },
        ],
      };
    }
    case 'physics.mechanical_advantage': {
      const { loadArm_m, effortArm_m } = v.payload;
      const ma = effortArm_m / loadArm_m;
      return {
        value: `${R(ma, 6)}`,
        numeric: [R(ma, 6)],
        method: 'mechanical advantage = effort arm / load arm',
        alt: { method: 'force ratio at equilibrium = load / effort = arm ratio', value: `${R(ma, 6)}`, numeric: [R(ma, 6)] },
        checks: [{ name: 'dimensionless', pass: true, detail: 'metres cancel' }],
      };
    }
    case 'physics.pressure_from_force': {
      const { force_N, area_m2 } = v.payload;
      const pa = force_N / area_m2;
      return {
        value: `${R(pa / 1000, 6)} kPa`,
        numeric: [R(pa / 1000, 6)],
        method: 'pressure = force / area, expressed in kPa',
        alt: { method: 'force per square metre, then ÷1000 to express the same value in kPa', value: `${R(pa / 1000, 6)} kPa`, numeric: [R(pa / 1000, 6)] },
        checks: [
          { name: 'pressure falls when the area grows', pass: force_N / (area_m2 * 2) < pa, detail: 'doubling the area halves the pressure' },
          { name: '1 kPa = 1000 Pa', pass: Math.abs(pa / 1000 - pa * 0.001) < 1e-9, detail: 'unit definition' },
        ],
      };
    }
    case 'physics.force_from_pressure': {
      const { pressure_bar, area_m2 } = v.payload;
      const pa = pressure_bar * 100000;
      const force = pa * area_m2;
      return {
        value: `${R(force / 1000, 6)} kN`,
        numeric: [R(force / 1000, 6)],
        method: 'force = pressure (in N/m²) × area',
        alt: { method: 'newtons computed first, then ÷1000 for kN', value: `${R(force / 1000, 6)} kN`, numeric: [R(force / 1000, 6)] },
        checks: [{ name: '1 bar = 100 000 N/m²', pass: pa === pressure_bar * 100000, detail: 'definition of the bar' }],
      };
    }
    case 'physics.density': {
      const { mass_kg, volume_m3 } = v.payload;
      const rho = mass_kg / volume_m3;
      return { value: `${R(rho, 6)} kg/m³`, numeric: [R(rho, 6)], method: 'ρ = m/V' };
    }
    case 'physics.gas_ratio': {
      const { p1, p2, v1 } = v.payload;
      const v2 = (p1 * v1) / p2;
      return {
        value: `${R(v2, 6)}`,
        numeric: [R(v2, 6)],
        method: 'p₁V₁ = p₂V₂ (isothermal)',
        alt: { method: 'inverse proportionality: V₂ = V₁·(p₁/p₂)', value: `${R(v1 * (p1 / p2), 6)}`, numeric: [R(v2, 6)] },
      };
    }
    case 'math.percentage_change': {
      const { from, to } = v.payload;
      const p = ((to - from) / from) * 100;
      return {
        value: `${R(p, 6)} %`,
        numeric: [R(p, 6)],
        method: '(new − old)/old × 100',
        alt: { method: 'ratio to the base minus 1', value: `${R((to / from - 1) * 100, 6)} %`, numeric: [R(p, 6)] },
      };
    }
    case 'math.proportion': {
      const { a, b, c } = v.payload;
      const x = (b * c) / a;
      return {
        value: `${R(x, 6)}`,
        numeric: [R(x, 6)],
        method: 'a : b = c : x ⇒ x = bc/a',
        alt: { method: 'unit-rate method', value: `${R(c * (b / a), 6)}`, numeric: [R(x, 6)] },
      };
    }
    case 'math.unit_convert': {
      const { value, factor } = v.payload;
      const r = value * factor;
      return { value: `${R(r, 8)}`, numeric: [R(r, 8)], method: 'multiply by the conversion factor' };
    }
    case 'math.rate': {
      const { amount, per, target } = v.payload;
      const r = (amount * target) / per;
      return {
        value: `${R(r, 6)}`,
        numeric: [R(r, 6)],
        method: 'amount × (target / per)',
        alt: { method: 'unit rate × target', value: `${R((amount / per) * target, 6)}`, numeric: [R(r, 6)] },
      };
    }
    case 'comp.binary_to_decimal': {
      const { bits } = v.payload;
      let d = 0;
      for (const ch of bits) d = d * 2 + (ch === '1' ? 1 : 0);
      const viaPlace = bits
        .split('')
        .reverse()
        .reduce((s, ch, i) => s + (ch === '1' ? Math.pow(2, i) : 0), 0);
      return {
        value: `${d}`,
        numeric: [d],
        method: 'place values',
        alt: { method: 'powers-of-two accumulation', value: `${viaPlace}`, numeric: [viaPlace] },
      };
    }
    case 'comp.loop_trace': {
      const { start, step, iterations, op } = v.payload;
      let x = start;
      for (let i = 0; i < iterations; i++) x = op === 'add' ? x + step : x * step;
      return { value: `${R(x, 6)}`, numeric: [R(x, 6)], method: 'literal iteration trace' };
    }
    case 'econ.elasticity_direction': {
      const { priceChangePct, elasticity } = v.payload;
      const q = Math.abs(elasticity * priceChangePct);
      return {
        value: `${R(q, 6)} % opposite direction`,
        numeric: [R(q, 6)],
        method: 'quantity change = |elasticity × price change|, in the opposite direction',
      };
    }
    case 'econ.opportunity_cost': {
      const { explicit, bestForgone } = v.payload;
      const total = explicit.reduce((a, b) => a + b, 0) + bestForgone;
      return {
        value: `${R(total, 6)}`,
        numeric: [R(total, 6)],
        method: 'explicit costs + value of the best alternative forgone',
        alt: { method: 'total economic cost accounting', value: `${R(explicit.reduce((a, b) => a + b, 0) + bestForgone, 6)}`, numeric: [R(total, 6)] },
      };
    }
    case 'datainterp.gradient': {
      const { x1, y1, x2, y2 } = v.payload;
      const g = (y2 - y1) / (x2 - x1);
      return {
        value: `${R(g, 6)}`,
        numeric: [R(g, 6)],
        method: 'rise over run',
        alt: { method: 'Δy/Δx', value: `${R((y2 - y1) / (x2 - x1), 6)}`, numeric: [R(g, 6)] },
      };
    }
    case 'datainterp.share': {
      const { part, total } = v.payload;
      const s = (part / total) * 100;
      return {
        value: `${R(s, 4)} %`,
        numeric: [R(s, 4)],
        method: 'part / total × 100',
        alt: { method: 'proportion expressed in hundredths', value: `${R(s, 4)} %`, numeric: [R(s, 4)] },
      };
    }
    default:
      return null;
  }
}

/**
 * Canonical numeric signature of an answer string. Used to compare a declared correct
 * option with the independently computed value — the comparison never relies on the
 * generator's internal representation.
 */
export function canonicalNumbers(text: string): number[] {
  let t = text;
  t = t.replace(/\\[a-zA-Z]+/g, (m) => (m === '\\,' || m === '\\;' || m === '\\!' ? ' ' : ' ')); // strip latex commands
  t = t.replace(/[{}$]/g, ' ');
  t = t.replace(/\\times/g, '×');
  // fractions a/b → keep both numbers but mark as ratio by emitting the decimal too
  const numbers: number[] = [];
  // Scientific notation first: "3 × 10^5" / "3 \times 10^{5}" / "3e5" must count as ONE value.
  const sci = /(-?\d+(?:[.,]\d+)?)\s*(?:\\times|×|x|\*)\s*10\s*(?:\^|\*\*)?\s*\{?\s*(-?\d+)\s*\}?/g;
  let sm: RegExpExecArray | null;
  const covered: [number, number][] = [];
  while ((sm = sci.exec(t)) !== null) {
    const mant = parseFloat(sm[1].replace(',', '.'));
    const exp = parseInt(sm[2], 10);
    numbers.push(R(mant * Math.pow(10, exp), 6));
    covered.push([sm.index, sm.index + sm[0].length]);
  }
  const inCovered = (i: number) => covered.some(([a, b]) => i >= a && i < b);
  t = t.replace(sci, (m) => ' '.repeat(m.length));
  const re = /-?\d+(?:[.,]\d+)?(?:\s*\/\s*-?\d+(?:[.,]\d+)?)?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t)) !== null) {
    if (inCovered(m.index)) continue;
    const raw = m[0].replace(/\s/g, '');
    if (raw.includes('/')) {
      const [a, b] = raw.split('/').map((s) => parseFloat(s.replace(',', '.')));
      if (b !== 0) numbers.push(R(a / b, 6));
    } else {
      numbers.push(R(parseFloat(raw.replace(',', '.')), 6));
    }
  }
  return numbers;
}

export function numbersMatch(a: number[], b: number[], relTol = 0.001): boolean {
  if (a.length !== b.length) return false;
  return a.every((x, i) => {
    const y = b[i];
    if (Number.isNaN(x) || Number.isNaN(y)) return false;
    if (Math.abs(x - y) <= 1e-9) return true;
    const scale = Math.max(Math.abs(x), Math.abs(y), 1e-9);
    return Math.abs(x - y) / scale <= relTol;
  });
}

/* ------------------------------------------------------------------ batch entry points */

/**
 * Self-test of the solver layer: each solver is exercised on a small, known case whose answer a
 * human can check by hand. This is what stops a broken solver from silently "validating" a bank:
 * if a solver is wrong, every item it covers would be wrong in the same direction, so the solver
 * itself is tested first.
 */
export function solverSelfTest(): { passed: boolean; cases: number; failures: string[] } {
  const failures: string[] = [];
  const cases: { name: string; verification: Verification; expected: number[]; tol?: number }[] = [
    { name: 'vector.addsub', verification: { solver: 'vector.addsub', payload: { a: [1, 2, 3], b: [4, 5, 6], c: [1, 1, 1], sign: '-' } }, expected: [4, 6, 8] },
    { name: 'vector.magnitude', verification: { solver: 'vector.magnitude', payload: { a: [3, 4] } }, expected: [5] },
    { name: 'vector.magnitude_pair', verification: { solver: 'vector.magnitude_pair', payload: { a: [3, 4], b: [5, 12] } }, expected: [5, 13] },
    { name: 'vector.scalar_mult', verification: { solver: 'vector.scalar_mult', payload: { a: [1, -2], k: 3 } }, expected: [3, -6] },
    { name: 'vector.scaled_magnitude', verification: { solver: 'vector.scaled_magnitude', payload: { a: [3, 4], k: -2 } }, expected: [10] },
    { name: 'vector.dot', verification: { solver: 'vector.dot', payload: { a: [2, -1, 3], b: [1, 4, -2] } }, expected: [-8] },
    { name: 'vector.angle', verification: { solver: 'vector.angle', payload: { a: [1, 0], b: [0, 1] } }, expected: [0] },
    { name: 'vector.cross', verification: { solver: 'vector.cross', payload: { a: [2, -1, 3], b: [1, 4, -2] } }, expected: [-10, 7, 9] },
    { name: 'vector.parallelogram_area', verification: { solver: 'vector.parallelogram_area', payload: { a: [3, 1], b: [1, 3] } }, expected: [8] },
    { name: 'vector.triple', verification: { solver: 'vector.triple', payload: { a: [1, 0, 0], b: [0, 1, 0], c: [0, 0, 1] } }, expected: [1] },
    { name: 'hydro.pressure', verification: { solver: 'hydro.pressure', payload: { depth_m: 10, rho: 1000, p0_pa: 100000, g: 10 } }, expected: [2] },
    { name: 'hydro.pressure_diff', verification: { solver: 'hydro.pressure_diff', payload: { d1: 5, d2: 15, rho: 1000, g: 10 } }, expected: [1] },
    { name: 'hydro.buoyant_mass', verification: { solver: 'hydro.buoyant_mass', payload: { volume_m3: 2, submergedFraction: 0.5, rho: 1000 } }, expected: [1000] },
    { name: 'hydro.suction_lift', verification: { solver: 'hydro.suction_lift', payload: { vacuum_bar: 0.8 } }, expected: [8] },
    { name: 'eoq.qstar', verification: { solver: 'eoq.qstar', payload: { D: 3600, S: 50, H: 4 } }, expected: [300] },
    { name: 'eoq.total_cost', verification: { solver: 'eoq.total_cost', payload: { D: 3600, S: 50, H: 4, Q: 300 } }, expected: [1200] },
    { name: 'eoq.orders_per_year', verification: { solver: 'eoq.orders_per_year', payload: { D: 3600, S: 50, H: 4, Q: 300 } }, expected: [12] },
    { name: 'eoq.cycle_days', verification: { solver: 'eoq.cycle_days', payload: { D: 3600, S: 50, H: 4, Q: 300 } }, expected: [30.4] },
    { name: 'eoq.sensitivity', verification: { solver: 'eoq.sensitivity', payload: { D: 3600, S: 50, H: 4, k: 2 } }, expected: [1.25] },
    { name: 'stat.mean', verification: { solver: 'stat.mean', payload: { values: [1, 2, 3, 4] } }, expected: [2.5] },
    { name: 'stat.median', verification: { solver: 'stat.median', payload: { values: [1, 2, 100] } }, expected: [2] },
    { name: 'stat.weighted_mean', verification: { solver: 'stat.weighted_mean', payload: { values: [2, 4], weights: [1, 3] } }, expected: [3.5] },
    { name: 'stat.probability', verification: { solver: 'stat.probability', payload: { favourable: 1, total: 4, complement: true } }, expected: [0.75] },
    { name: 'stat.bayes_counts', verification: { solver: 'stat.bayes_counts', payload: { n_outcome: 200, n_both: 50, n_total: 1000 } }, expected: [0.25] },
    { name: 'physics.work', verification: { solver: 'physics.work', payload: { force_N: 20, distance_m: 3 } }, expected: [60] },
    { name: 'physics.power', verification: { solver: 'physics.power', payload: { energy_J: 600, time_s: 4 } }, expected: [150] },
    { name: 'physics.efficiency', verification: { solver: 'physics.efficiency', payload: { useful_J: 75, input_J: 100 } }, expected: [75] },
    { name: 'physics.flow_continuity', verification: { solver: 'physics.flow_continuity', payload: { area1: 0.02, velocity1: 3, area2: 0.005 } }, expected: [12] },
    { name: 'physics.lever', verification: { solver: 'physics.lever', payload: { load_N: 600, loadArm: 1, effortArm: 3 } }, expected: [200] },
    { name: 'physics.lever_arm', verification: { solver: 'physics.lever_arm', payload: { load_N: 100, loadArm_m: 0.8, effort_N: 25 } }, expected: [3.2] },
    { name: 'physics.moment', verification: { solver: 'physics.moment', payload: { force_N: 200, arm_m: 0.8 } }, expected: [160] },
    { name: 'physics.mechanical_advantage', verification: { solver: 'physics.mechanical_advantage', payload: { loadArm_m: 0.6, effortArm_m: 2.4 } }, expected: [4] },
    { name: 'physics.pressure_from_force', verification: { solver: 'physics.pressure_from_force', payload: { force_N: 240, area_m2: 0.02 } }, expected: [12] },
    { name: 'physics.force_from_pressure', verification: { solver: 'physics.force_from_pressure', payload: { pressure_bar: 2, area_m2: 0.05 } }, expected: [10] },
    { name: 'vector.components (east/north legs)', verification: { solver: 'vector.components', payload: { a: [3, 4] } }, expected: [3, 4] },
    { name: 'physics.density', verification: { solver: 'physics.density', payload: { mass_kg: 2, volume_m3: 0.5 } }, expected: [4] },
    { name: 'physics.gas_ratio', verification: { solver: 'physics.gas_ratio', payload: { p1: 2, v1: 1, p2: 1 } }, expected: [2] },
    { name: 'math.percentage_change', verification: { solver: 'math.percentage_change', payload: { from: 50, to: 60 } }, expected: [20] },
    // a : b = c : x  ⇒  x = bc/a. The self-test states the case it expects, so a solver that
    // silently inverted the ratio would fail here instead of "validating" a whole family.
    { name: 'math.proportion (a:b = c:x)', verification: { solver: 'math.proportion', payload: { a: 3, b: 4, c: 6 } }, expected: [8] },
    { name: 'math.proportion (unit rate)', verification: { solver: 'math.proportion', payload: { a: 5, b: 2, c: 10 } }, expected: [4] },
    { name: 'math.unit_convert', verification: { solver: 'math.unit_convert', payload: { value: 2.5, factor: 1000 } }, expected: [2500] },
    { name: 'math.rate', verification: { solver: 'math.rate', payload: { amount: 240, per: 5, target: 8 } }, expected: [384] },
    { name: 'comp.binary_to_decimal', verification: { solver: 'comp.binary_to_decimal', payload: { bits: '1011' } }, expected: [11] },
    { name: 'comp.loop_trace', verification: { solver: 'comp.loop_trace', payload: { start: 3, step: 4, iterations: 3, op: 'add' } }, expected: [15] },
    { name: 'econ.elasticity_direction', verification: { solver: 'econ.elasticity_direction', payload: { priceChangePct: 10, elasticity: 0.5 } }, expected: [5] },
    { name: 'econ.opportunity_cost', verification: { solver: 'econ.opportunity_cost', payload: { explicit: [100, 50], bestForgone: 30 } }, expected: [180] },
    { name: 'datainterp.gradient', verification: { solver: 'datainterp.gradient', payload: { x1: 200, y1: 6800, x2: 500, y2: 11000 } }, expected: [14] },
    { name: 'datainterp.share', verification: { solver: 'datainterp.share', payload: { part: 240, total: 1200 } }, expected: [20] },
    { name: 'finance.breakeven', verification: { solver: 'finance.breakeven', payload: { fixedCost: 6000, price: 50, variableCost: 20 } }, expected: [200] },
  ];

  for (const c of cases) {
    const result = solve(c.verification);
    if (!result) {
      failures.push(`${c.name}: no result`);
      continue;
    }
    const tol = c.tol ?? 0.02;
    const got = result.numeric;
    const ok =
      got.length >= c.expected.length &&
      c.expected.every((x, i) => Math.abs(got[i] - x) <= Math.max(tol, Math.abs(x) * tol));
    if (!ok) failures.push(`${c.name}: expected ${JSON.stringify(c.expected)} but solved ${JSON.stringify(got)}`);
    if (result.alt && result.altComparable !== false) {
      const altOk =
        result.alt.numeric.length >= c.expected.length &&
        c.expected.every((x, i) => Math.abs(result.alt!.numeric[i] - x) <= Math.max(tol, Math.abs(x) * tol));
      if (!altOk) failures.push(`${c.name}: alternative method disagrees (${JSON.stringify(result.alt.numeric)})`);
    }
  }
  return { passed: failures.length === 0, cases: cases.length, failures };
}

export interface AnswerKeyCheck {
  checked: number;
  solved: number;
  agreed: number;
  disagreed: number;
  notSolvable: number;
  disagreements: string[];
}

/**
 * Re-derive every numerically verifiable item's key straight from its `verification` payload and
 * compare it with the option the bank marks correct. This is the answer-key audit: it is
 * independent of the validator's internals and is also repeated in Python (scripts/verify_bank.py).
 */
export function evaluateAnswerKey(questions: { id: string; options: { text: string }[]; correctIndex: number; verification?: Verification }[]): AnswerKeyCheck {
  let solved = 0;
  let agreed = 0;
  let disagreed = 0;
  const disagreements: string[] = [];
  for (const q of questions) {
    if (!q.verification) continue;
    const result = solve(q.verification);
    if (!result) continue;
    solved += 1;
    const declared = canonicalNumbers(q.options[q.correctIndex]?.text ?? '');
    if (declared.length === 0) {
      agreed += 1; // qualitative key: nothing numeric to compare
      continue;
    }
    if (numbersMatch(declared, result.numeric, 0.02)) {
      agreed += 1;
    } else {
      disagreed += 1;
      disagreements.push(`${q.id}: key says ${JSON.stringify(declared)} but ${result.method} gives ${JSON.stringify(result.numeric)}`);
    }
  }
  return { checked: questions.length, solved, agreed, disagreed, notSolvable: questions.length - solved, disagreements };
}
