import { buildBank } from '../engine/bank';
import { normaliseText } from '../engine/validators';
const { report } = buildBank({ seed: 20260902, variantsPerFamily: 14, targetCandidates: 660 });
const byFam: Record<string, number> = {};
const samples: Record<string, string[]> = {};
for (const r of report.rejected) {
  for (const p of r.result.problems) {
    const key = p.startsWith('duplicate option') ? 'dup-option' : p.startsWith('options ') ? 'same-value' : p.startsWith('distractor ') ? 'distractor-eq' : p.startsWith('duplicate item') ? 'dup-item' : p.startsWith('template') ? 'template' : 'other';
    const fam = r.question.id.split('-').slice(0, 2).join('-');
    byFam[`${fam}|${key}`] = (byFam[`${fam}|${key}`] ?? 0) + 1;
    if (key !== 'dup-item' && (samples[`${fam}|${key}`]?.length ?? 0) < 1) {
      samples[`${fam}|${key}`] = [r.question.options.map(o => o.text).join('  ||  ') + '   [key: ' + r.question.options[r.question.correctIndex].text + ']'];
    }
  }
}
for (const [k, v] of Object.entries(byFam).sort((a, b) => b[1] - a[1]).slice(0, 14)) {
  console.log(v, k, '\n    ', (samples[k]?.[0] ?? '').slice(0, 230));
}
