import type { Figure } from '../../../engine/types';

/**
 * Original SVG renderings of the declarative figures in the content layer.
 *
 * The data model stores figures as data (`Figure`), never as images: nothing here is copied from
 * the official PDF, and every figure is generated from the numbers in the item or lesson.
 */

const palette = ['#1f4e79', '#1d6f42', '#8a5300', '#7c3aed', '#0e7490', '#97231f'];
const color = (i: number, explicit?: string) => explicit ?? palette[i % palette.length];

function Frame({
  title,
  width,
  height,
  children,
}: {
  title?: string;
  width: number;
  height: number;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="svg-figure" role="img" aria-label={title ?? 'figure'}>
      {title ? (
        <text x={12} y={20} fontSize={13} fontWeight={600} fill="#14181f">
          {title}
        </text>
      ) : null}
      <g transform={title ? 'translate(0, 14)' : undefined}>{children}</g>
    </svg>
  );
}

function Axes({
  x0,
  y0,
  width,
  height,
  xLabel,
  yLabel,
  xTicks,
  yTicks,
}: {
  x0: number;
  y0: number;
  width: number;
  height: number;
  xLabel?: string;
  yLabel?: string;
  xTicks?: { at: number; label: string }[];
  yTicks?: { at: number; label: string }[];
}): JSX.Element {
  return (
    <g>
      <line x1={x0} y1={y0} x2={x0 + width} y2={y0} stroke="#9aa3ad" strokeWidth={1} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - height} stroke="#9aa3ad" strokeWidth={1} />
      {xTicks?.map((t, i) => (
        <g key={`x${i}`}>
          <line x1={t.at} y1={y0} x2={t.at} y2={y0 + 4} stroke="#9aa3ad" />
          <text x={t.at} y={y0 + 16} fontSize={10} fill="#4b5563" textAnchor="middle">
            {t.label}
          </text>
        </g>
      ))}
      {yTicks?.map((t, i) => (
        <g key={`y${i}`}>
          <line x1={x0 - 4} y1={t.at} x2={x0} y2={t.at} stroke="#9aa3ad" />
          <text x={x0 - 7} y={t.at + 3} fontSize={10} fill="#4b5563" textAnchor="end">
            {t.label}
          </text>
        </g>
      ))}
      {xLabel ? (
        <text x={x0 + width / 2} y={y0 + 32} fontSize={11} fill="#4b5563" textAnchor="middle">
          {xLabel}
        </text>
      ) : null}
      {yLabel ? (
        <text x={12} y={y0 - height / 2} fontSize={11} fill="#4b5563" transform={`rotate(-90 12 ${y0 - height / 2})`} textAnchor="middle">
          {yLabel}
        </text>
      ) : null}
    </g>
  );
}

export function FigureView({ figure }: { figure: Figure }): JSX.Element | null {
  switch (figure.kind) {
    case 'vector_grid': {
      const pts = figure.vectors.flatMap((v) => [v.to, ...(figure.showResultant && v === figure.vectors[0] ? [figure.showResultant.to] : [])]);
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const xr = figure.xRange ?? [Math.min(0, ...xs) - 1, Math.max(...xs) + 1];
      const yr = figure.yRange ?? [Math.min(0, ...ys) - 1, Math.max(...ys) + 1];
      const width = 460;
      const height = 300;
      const pad = 40;
      const sx = (x: number) => pad + ((x - xr[0]) / (xr[1] - xr[0])) * (width - pad - 20);
      const sy = (y: number) => height - pad - ((y - yr[0]) / (yr[1] - yr[0])) * (height - pad - 20);
      const arrows = [
        ...figure.vectors.map((v, i) => ({ label: v.label, to: v.to, color: color(i, v.color), dashed: false })),
        ...(figure.showResultant ? [{ label: figure.showResultant.label, to: figure.showResultant.to, color: color(9, figure.showResultant.color), dashed: true }] : []),
      ];
      return (
        <Frame width={width} height={height}>
          {[...Array(6)].map((_, i) => {
            const gx = xr[0] + ((xr[1] - xr[0]) * i) / 5;
            const gy = yr[0] + ((yr[1] - yr[0]) * i) / 5;
            return (
              <g key={i}>
                <line x1={sx(gx)} y1={sy(yr[0])} x2={sx(gx)} y2={sy(yr[1])} stroke="#eef1f4" />
                <line x1={sx(xr[0])} y1={sy(gy)} x2={sx(xr[1])} y2={sy(gy)} stroke="#eef1f4" />
              </g>
            );
          })}
          <Axes x0={sx(0)} y0={sy(0)} width={sx(xr[1]) - sx(0) || 1} height={sy(0) - sy(yr[1]) || 1} xLabel="x" yLabel="y" />
          {arrows.map((a, i) => (
            <g key={i}>
              <defs>
                <marker id={`ah${i}-${a.label.replace(/[^a-z0-9]/gi, '')}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill={a.color} />
                </marker>
              </defs>
              <line
                x1={sx(0)}
                y1={sy(0)}
                x2={sx(a.to[0])}
                y2={sy(a.to[1])}
                stroke={a.color}
                strokeWidth={2}
                strokeDasharray={a.dashed ? '5 3' : undefined}
                markerEnd={`url(#ah${i}-${a.label.replace(/[^a-z0-9]/gi, '')})`}
              />
              <text x={sx(a.to[0]) + 6} y={sy(a.to[1]) - 6} fontSize={12} fill={a.color} fontWeight={600}>
                {a.label}
              </text>
            </g>
          ))}
        </Frame>
      );
    }

    case 'pressure_depth': {
      const width = 460;
      const height = 300;
      const pad = 46;
      const hMax = figure.hMax;
      const maxBar = 7;
      const sx = (h: number) => pad + (h / hMax) * (width - pad - 24);
      const sy = (bar: number) => height - pad - (bar / maxBar) * (height - pad - 24);
      return (
        <Frame width={width} height={height} title="Absolute pressure against depth">
          <Axes
            x0={pad}
            y0={height - pad}
            width={width - pad - 24}
            height={height - pad - 24}
            xLabel="depth (m)"
            yLabel="pressure (bar)"
            xTicks={[0, 10, 20, 30].filter((d) => d <= hMax).map((d) => ({ at: sx(d), label: String(d) }))}
            yTicks={[1, 3, 5, 7].map((b) => ({ at: sy(b), label: String(b) }))}
          />
          {figure.lines.map((l, i) => {
            const at = (h: number) => 1 + (l.rho * h) / 10 / 1000;
            return (
              <g key={i}>
                <line x1={sx(0)} y1={sy(at(0))} x2={sx(hMax)} y2={sy(at(hMax))} stroke={color(i, l.color)} strokeWidth={2} />
                <text x={sx(hMax) - 4} y={sy(at(hMax)) - 6} fontSize={11} fill={color(i, l.color)} textAnchor="end">
                  {l.label}
                </text>
              </g>
            );
          })}
          {figure.markedDepths?.map((d, i) => (
            <line key={i} x1={sx(d)} y1={height - pad} x2={sx(d)} y2={height - pad + 4} stroke="#4b5563" strokeDasharray="3 2" />
          ))}
          <text x={pad} y={height - pad - 8} fontSize={11} fill="#6b7280">
            atmosphere = 1 bar at the surface
          </text>
        </Frame>
      );
    }

    case 'tank_points': {
      const width = 440;
      const height = 280;
      const pad = 40;
      const h = figure.depthsScaleMax ?? Math.max(...figure.points.map((p) => p.depth)) + 1;
      const tankW = 200;
      const tankX = 120;
      const surface = 60;
      const bottom = height - 50;
      const sy = (depth: number) => surface + (depth / h) * (bottom - surface);
      return (
        <Frame width={width} height={height} title={`Pressure at points in ${figure.fluid}`}>
          <rect x={tankX} y={surface} width={tankW} height={bottom - surface} fill="#eaf1f8" stroke="#9aa3ad" />
          <rect x={tankX} y={surface} width={tankW} height={bottom - surface} fill="url(#water)" opacity={0.35} />
          <text x={tankX + tankW / 2} y={surface - 8} fontSize={11} fill="#1f4e79" textAnchor="middle">
            surface (p = p₀)
          </text>
          {figure.points.map((p, i) => (
            <g key={p.label}>
              <line x1={tankX - 30} y1={sy(p.depth)} x2={tankX + tankW + 20} y2={sy(p.depth)} stroke="#c8d2dc" strokeDasharray="3 3" />
              <circle cx={tankX + tankW / 2 + (i % 2 === 0 ? -40 : 40)} cy={sy(p.depth)} r={5} fill={color(i)} />
              <text x={tankX + tankW / 2 + (i % 2 === 0 ? -40 : 40) + 9} y={sy(p.depth) + 4} fontSize={12} fill={color(i)} fontWeight={600}>
                {p.label} · {p.depth} m
              </text>
            </g>
          ))}
        </Frame>
      );
    }

    case 'eoq_curves': {
      const width = 480;
      const height = 320;
      const pad = 52;
      const qMax = figure.qMax;
      const qStar = Math.sqrt((2 * figure.D * figure.S) / figure.H);
      const at = (q: number) => (figure.D / q) * figure.S + (q / 2) * figure.H;
      const yMax = Math.max(at(5), at(qMax)) * 1.1;
      const sx = (q: number) => pad + (q / qMax) * (width - pad - 24);
      const sy = (c: number) => height - pad - (c / yMax) * (height - pad - 30);
      const samples = 60;
      const path = (fn: (q: number) => number) =>
        [...Array(samples + 1)]
          .map((_, i) => {
            const q = 1 + ((qMax - 1) * i) / samples;
            return `${i === 0 ? 'M' : 'L'}${sx(q).toFixed(1)},${sy(fn(q)).toFixed(1)}`;
          })
          .join(' ');
      return (
        <Frame width={width} height={height} title="Annual cost against order quantity">
          <Axes
            x0={pad}
            y0={height - pad}
            width={width - pad - 24}
            height={height - pad - 30}
            xLabel="order quantity Q"
            yLabel="annual cost"
            xTicks={[{ at: sx(qStar), label: `Q* = ${Math.round(qStar)}` }]}
          />
          <path d={path((q) => (figure.D / q) * figure.S)} stroke={color(0)} strokeWidth={2} fill="none" opacity={figure.highlight && figure.highlight !== 'ordering' ? 0.35 : 1} />
          <path d={path((q) => (q / 2) * figure.H)} stroke={color(1)} strokeWidth={2} fill="none" opacity={figure.highlight && figure.highlight !== 'holding' ? 0.35 : 1} />
          <path d={path(at)} stroke={color(3)} strokeWidth={2.5} fill="none" opacity={figure.highlight && figure.highlight !== 'total' ? 0.35 : 1} />
          <line x1={sx(qStar)} y1={height - pad} x2={sx(qStar)} y2={sy(at(qStar))} stroke="#97231f" strokeDasharray="4 3" />
          <circle cx={sx(qStar)} cy={sy(at(qStar))} r={4} fill="#97231f" />
          <g fontSize={11}>
            <text x={width - 130} y={70} fill={color(0)}>
              ordering (D/Q)·S
            </text>
            <text x={width - 130} y={88} fill={color(1)}>
              holding (Q/2)·H
            </text>
            <text x={width - 130} y={106} fill={color(3)}>
              total
            </text>
          </g>
        </Frame>
      );
    }

    case 'ship_stability': {
      const width = 460;
      const height = 250;
      const ships = figure.ships;
      return (
        <Frame width={width} height={height} title="Restoring effect grows with hull width">
          {ships.map((s, i) => {
            const w = 40 + s.beam * 12;
            const x = 40 + i * (width / ships.length) - w / 2 + 60;
            const y = 120;
            const h = 46;
            return (
              <g key={s.label} transform={`rotate(${8 * (i % 2 === 0 ? 1 : -1)} ${x + w / 2} ${y + h / 2})`}>
                <rect x={x} y={y} width={w} height={h} fill={color(i)} opacity={0.85} rx={4} />
                <line x1={0} y1={y + h} x2={width} y2={y + h} stroke="#9aa3ad" />
                <circle cx={x + w / 2} cy={y + h - 6} r={3} fill="#fff" />
                <text x={x + w / 2} y={y + h + 20} fontSize={11} fill="#4b5563" textAnchor="middle">
                  {s.label}
                </text>
                <text x={x + w / 2} y={y + h + 34} fontSize={10} fill="#6b7280" textAnchor="middle">
                  beam {s.beam} m
                </text>
              </g>
            );
          })}
        </Frame>
      );
    }

    case 'flooded_room': {
      const width = 420;
      const height = 300;
      const roomH = figure.roomHeight;
      const leak = figure.leakHeight;
      const scale = 200 / roomH;
      const x = 150;
      const w = 140;
      const top = 50;
      const surface = top + roomH * scale;
      const leakY = surface - leak * scale;
      const rise = (figure.riseFraction ?? 0.3) * roomH * scale;
      return (
        <Frame width={width} height={height} title="Trapped air, opening and rising water">
          <rect x={x} y={top} width={w} height={roomH * scale} fill="#fff" stroke="#9aa3ad" />
          <rect x={x} y={surface - rise} width={w} height={rise + (surface - (leakY - 4)) * 0 + (surface - surface)} fill="none" />
          <rect x={x} y={surface - rise} width={w} height={rise} fill="#dbe9f6" stroke="#9aa3ad" strokeDasharray="3 2" />
          <rect x={x} y={surface} width={w} height={figure.leakDepth * scale * 0.6} fill="#bcd6ef" opacity={0.85} />
          <line x1={x + w} y1={leakY} x2={x + w + 26} y2={leakY} stroke="#97231f" strokeWidth={3} />
          <text x={x + w + 30} y={leakY + 4} fontSize={11} fill="#97231f">
            opening ({figure.leakHeight} m)
          </text>
          <text x={x + w / 2} y={surface - rise - 8} fontSize={11} fill="#1f4e79" textAnchor="middle">
            trapped air
          </text>
          <text x={x + w / 2} y={surface + 16} fontSize={11} fill="#1f4e79" textAnchor="middle">
            water level {figure.leakDepth} m deep at the opening
          </text>
          <text x={x - 8} y={top + 12} fontSize={10} fill="#6b7280" textAnchor="end">
            room {figure.roomHeight} m
          </text>
          <line x1={x - 4} y1={top} x2={x - 4} y2={surface} stroke="#6b7280" />
        </Frame>
      );
    }

    case 'suction_pump': {
      const width = 340;
      const height = 300;
      const top = 40;
      const scale = 200 / Math.max(figure.h, figure.t);
      return (
        <Frame width={width} height={height} title="Suction lift limited by the atmosphere">
          <rect x={110} y={top} width={120} height={height - top - 30} fill="#f2f6fa" stroke="#9aa3ad" />
          <rect x={110} y={top + 12} width={120} height={46} fill="#fff" stroke="#c8d2dc" />
          <text x={170} y={top + 40} fontSize={11} fill="#4b5563" textAnchor="middle">
            pump (vacuum {figure.t} bar)
          </text>
          <line x1={170} y1={top + 58} x2={170} y2={top + 58 + figure.h * scale * 0.5} stroke="#1f4e79" strokeWidth={2} />
          <rect x={114} y={top + 58 + figure.h * scale * 0.5} width={112} height={figure.h * scale * 0.5} fill="#bcd6ef" />
          <text x={230} y={top + 80} fontSize={11} fill="#1f4e79">
            lift {figure.h} m ≈ {figure.t} bar × 10 m/bar
          </text>
          <text x={110} y={height - 16} fontSize={11} fill="#4b5563">
            the water column is held by the atmosphere, not pulled by the pump
          </text>
        </Frame>
      );
    }

    case 'bar_chart': {
      const width = 460;
      const height = 280;
      const pad = 50;
      const values = figure.series.flatMap((s) => s.values);
      const max = Math.max(...values);
      const min = Math.min(0, ...values);
      const groupW = (width - pad - 24) / figure.categories.length;
      const sy = (v: number) => height - pad - ((v - min) / (max - min)) * (height - pad - 34);
      return (
        <Frame width={width} height={height} title={figure.title}>
          <Axes
            x0={pad}
            y0={height - pad}
            width={width - pad - 24}
            height={height - pad - 34}
            xLabel={figure.xLabel}
            yLabel={figure.yLabel}
            yTicks={[min, (min + max) / 2, max].map((v) => ({ at: sy(v), label: String(Math.round(v)) }))}
          />
          {figure.categories.map((c, ci) => (
            <g key={c}>
              {figure.series.map((s, si) => {
                const barW = (groupW - 14) / figure.series.length;
                const v = s.values[ci] ?? 0;
                const top = v >= 0 ? sy(v) : sy(0);
                const h = Math.abs(sy(v) - sy(0));
                return (
                  <rect
                    key={s.name}
                    x={pad + ci * groupW + 8 + si * barW}
                    y={top}
                    width={barW - 3}
                    height={h}
                    fill={color(si, s.color)}
                    opacity={0.9}
                  />
                );
              })}
              <text x={pad + ci * groupW + groupW / 2} y={height - pad + 15} fontSize={11} fill="#4b5563" textAnchor="middle">
                {c}
              </text>
            </g>
          ))}
          <g fontSize={11}>
            {figure.series.map((s, si) => (
              <text key={s.name} x={width - 130} y={60 + si * 16} fill={color(si, s.color)}>
                {s.name}
              </text>
            ))}
          </g>
        </Frame>
      );
    }

    case 'line_chart': {
      const width = 460;
      const height = 280;
      const pad = 52;
      const xs = figure.x;
      const ys = figure.series.flatMap((s) => s.values);
      const yMin = Math.min(0, ...ys);
      const yMax = Math.max(...ys);
      const sx = (x: number) => pad + ((x - xs[0]) / (xs[xs.length - 1] - xs[0])) * (width - pad - 26);
      const sy = (y: number) => height - pad - ((y - yMin) / (yMax - yMin)) * (height - pad - 34);
      return (
        <Frame width={width} height={height} title={figure.title}>
          <Axes
            x0={pad}
            y0={height - pad}
            width={width - pad - 26}
            height={height - pad - 34}
            xLabel={figure.xLabel}
            yLabel={figure.yLabel}
            xTicks={xs.map((x) => ({ at: sx(x), label: String(x) }))}
            yTicks={[yMin, (yMin + yMax) / 2, yMax].map((v) => ({ at: sy(v), label: String(Math.round(v)) }))}
          />
          {figure.series.map((s, si) => (
            <g key={s.name}>
              <path
                d={s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${sx(xs[i]).toFixed(1)},${sy(v).toFixed(1)}`).join(' ')}
                fill="none"
                stroke={color(si, s.color)}
                strokeWidth={2}
              />
              {s.values.map((v, i) => (
                <circle key={i} cx={sx(xs[i])} cy={sy(v)} r={2.6} fill={color(si, s.color)} />
              ))}
              <text x={width - 150} y={60 + si * 16} fontSize={11} fill={color(si, s.color)}>
                {s.name}
              </text>
            </g>
          ))}
        </Frame>
      );
    }

    case 'table': {
      return (
        <div>
          {figure.title ? <h4 style={{ marginBottom: 6 }}>{figure.title}</h4> : null}
          <table className="tbl">
            <thead>
              <tr>
                {figure.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {figure.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'flowchart': {
      const width = 520;
      const stepH = 44;
      const height = figure.steps.length * stepH + 40 + (figure.title ? 16 : 0);
      return (
        <Frame width={width} height={height} title={figure.title}>
          {figure.steps.map((s, i) => (
            <g key={i}>
              <rect x={70} y={20 + i * stepH} width={380} height={30} rx={6} fill="#f7fafd" stroke="#c6d6e6" />
              <text x={84} y={39 + i * stepH} fontSize={12} fill="#14181f">
                {s}
              </text>
              {i < figure.steps.length - 1 ? <path d={`M260,${50 + i * stepH} L260,${52 + i * stepH}`} stroke="#9aa3ad" markerEnd="" /> : null}
            </g>
          ))}
        </Frame>
      );
    }

    case 'lever': {
      const width = 420;
      const height = 200;
      const total = figure.loadArm + figure.effortArm;
      const px = (d: number) => 30 + (d / total) * (width - 60);
      const beamY = 100;
      const pivotX = px(figure.loadArm);
      return (
        <Frame width={width} height={height} title="Moments about the pivot">
          <line x1={30} y1={beamY} x2={width - 30} y2={beamY} stroke="#4b5563" strokeWidth={4} />
          <polygon points={`${pivotX},${beamY} ${pivotX - 12},${beamY + 44} ${pivotX + 12},${beamY + 44}`} fill="#9aa3ad" />
          <rect x={px(0) - 14} y={beamY - 34} width={28} height={26} fill={color(0)} />
          <text x={px(0)} y={beamY - 42} fontSize={11} fill={color(0)} textAnchor="middle">
            {figure.load} N
          </text>
          <path d={`M${px(total)} ${beamY - 44} L${px(total)} ${beamY - 8}`} stroke={color(1)} strokeWidth={2} markerEnd="" />
          <text x={px(total)} y={beamY - 52} fontSize={11} fill={color(1)} textAnchor="middle">
            effort
          </text>
          <text x={px(figure.loadArm / 2)} y={beamY + 20} fontSize={10} fill="#6b7280" textAnchor="middle">
            {figure.loadArm} m
          </text>
          <text x={(px(figure.loadArm) + px(total)) / 2} y={beamY + 20} fontSize={10} fill="#6b7280" textAnchor="middle">
            {figure.effortArm} m
          </text>
        </Frame>
      );
    }

    case 'blob_diagram': {
      const width = 520;
      const height = 240;
      const at = (id: string) => figure.nodes.find((n) => n.id === id);
      const sx = (x: number) => 40 + (x / 100) * (width - 80);
      const sy = (y: number) => 30 + (y / 100) * (height - 70);
      return (
        <Frame width={width} height={height} title={figure.caption}>
          {figure.edges.map((e, i) => {
            const a = at(e.from);
            const b = at(e.to);
            if (!a || !b) return null;
            return (
              <g key={i}>
                <line
                  x1={sx(a.x)}
                  y1={sy(a.y)}
                  x2={sx(b.x)}
                  y2={sy(b.y)}
                  stroke="#9aa3ad"
                  strokeDasharray={e.dashed ? '5 4' : undefined}
                  markerEnd=""
                />
                {e.label ? (
                  <text x={(sx(a.x) + sx(b.x)) / 2} y={(sy(a.y) + sy(b.y)) / 2 - 5} fontSize={10} fill="#6b7280" textAnchor="middle">
                    {e.label}
                  </text>
                ) : null}
              </g>
            );
          })}
          {figure.nodes.map((n, i) => (
            <g key={n.id}>
              <rect x={sx(n.x) - 62} y={sy(n.y) - 14} width={124} height={28} rx={14} fill="#fff" stroke={color(i)} />
              <text x={sx(n.x)} y={sy(n.y) + 4} fontSize={11} fill={color(i)} textAnchor="middle">
                {n.label}
              </text>
            </g>
          ))}
        </Frame>
      );
    }

    default:
      return null;
  }
}
