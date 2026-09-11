import { makeRng } from '../engine/rng';
import * as V from '../engine/generators/vector';
import * as H from '../engine/generators/hydro';
import * as E from '../engine/generators/eoq';
import { canonicalNumbers, numbersMatch, solve } from '../engine/solvers';

const gens = [
  ...Object.entries(V).map(([n, f]) => ['vector/' + n, f] as const),
  ...Object.entries(H).map(([n, f]) => ['hydro/' + n, f] as const),
  ...Object.entries(E).map(([n, f]) => ['eoq/' + n, f] as const),
];
let ok = 0, bad = 0, solved = 0, agree = 0; const reasons: Record<string, number> = {};
for (let i = 0; i < 400; i++) {
  const rng = makeRng(1000 + i);
  const [name, f] = gens[i % gens.length];
  try {
    const q = (f as any)(rng) as any;
    if (q.options.length !== 4) throw new Error('not 4 options');
    if (q.options.filter((o: any) => o.errorTag === 'none').length !== 1) throw new Error('not exactly one key');
    if (new Set(q.options.map((o: any) => o.text)).size !== 4) throw new Error('duplicate option text');
    if (q.verification) {
      solved++;
      const r = solve(q.verification);
      if (!r) throw new Error('no solver for ' + q.verification.solver);
      const key = canonicalNumbers(q.options[q.correctIndex].text);
      if (!numbersMatch(key, r.numeric, 0.02)) throw new Error(`solver ${JSON.stringify(r.numeric)} vs key ${JSON.stringify(key)} :: ${q.options[q.correctIndex].text}`);
      if (r.checks && r.checks.some((c: any) => !c.pass)) throw new Error('solver check failed: ' + JSON.stringify(r.checks.filter((c:any)=>!c.pass)));
      agree++;
    }
    ok++;
  } catch (e: any) {
    bad++; const key = (e.message || 'error').slice(0, 46); reasons[key] = (reasons[key] || 0) + 1;
    if (bad <= 6) console.log('BAD', name, '::', e.message);
  }
}
console.log({ ok, bad, solved, agree, solverMismatches: solved - agree });
console.log(reasons);
