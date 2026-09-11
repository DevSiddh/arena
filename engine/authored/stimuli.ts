/**
 * Stimulus blocks — the official two-part item anatomy: a short input text (with any needed
 * formulas) followed by several questions about it.
 *
 * IMPORTANT: none of these texts reproduce the official preparatory material. Each block
 * *summarises* the relations the official exercises presuppose and states them in our own words,
 * so that an item can be answered from the block itself. `officialExercise` records which official
 * exercise demonstrates the same reasoning; it never quotes it.
 */

import type { Stimulus } from '../types';

export const STIMULI: Stimulus[] = [
  {
    id: 'S-vec-1',
    title: 'Input — components and products of vectors',
    label: 'OFFICIAL_SAMPLE',
    domainIds: ['D02'],
    officialExercise: 'Exercise 1 (Vector Calculations)',
    conceptIds: ['C02.coords', 'C02.magnitude', 'C02.addsub', 'C02.scalar', 'C02.dot', 'C02.cross', 'C02.triple'],
    body:
      'A scalar carries one component; a vector in the plane carries two, in space three. Components are the coordinates of the arrow.\n\n' +
      '- Magnitude: $|\\vec{a}| = \\sqrt{a_1^2 + a_2^2}$ (in space with the third component squared added).\n' +
      '- Addition and subtraction act component by component; multiplication by a scalar $k$ scales every component, so the length changes by $|k|$ and the direction reverses for $k<0$.\n' +
      '- Scalar product: $\\vec{a}\\cdot\\vec{b} = a_1b_1 + a_2b_2$ (plus $a_3b_3$), a number. It is zero exactly when the vectors are perpendicular, and $\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\varphi$.\n' +
      '- Vector product: a vector, perpendicular to both inputs, with $|\\vec{a}\\times\\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\varphi$. Its magnitude is the area of the parallelogram spanned by the two vectors. Changing the order reverses the direction.\n' +
      '- Triple product: $(\\vec{a}\\times\\vec{b})\\cdot\\vec{c}$, a number equal to the signed volume of the parallelepiped spanned by the three vectors. It is zero exactly when the three vectors lie in one plane.',
    figure: {
      kind: 'table',
      title: 'The three products at a glance',
      headers: ['Expression', 'Result', 'Measures', 'Zero when'],
      rows: [
        ['$\\vec{a}\\cdot\\vec{b}$', 'scalar', 'alignment ($\\cos\\varphi$)', 'perpendicular'],
        ['$\\vec{a}\\times\\vec{b}$', 'vector', 'perpendicular direction, area ($\\sin\\varphi$)', 'parallel'],
        ['$(\\vec{a}\\times\\vec{b})\\cdot\\vec{c}$', 'scalar', 'signed volume', 'coplanar'],
      ],
    },
  },
  {
    id: 'S-vec-2',
    title: 'Input — reading vectors off a coordinate figure',
    label: 'OFFICIAL_SAMPLE',
    domainIds: ['D02'],
    officialExercise: 'Exercise 1 (Vector Calculations)',
    conceptIds: ['C02.coords', 'C02.addsub', 'C02.magnitude', 'C02.area'],
    body:
      'Vectors can be given as component lists or drawn as arrows in a coordinate system. In a figure, the components of an arrow are read as the horizontal and vertical distances from its tail to its head; a vector that starts at the origin is identified with the coordinates of its head.\n\n' +
      'Two useful consequences:\n\n' +
      '1. Adding two arrows is the same as adding their components — in a figure this is the "head to tail" construction, and the sum is the arrow from the first tail to the last head.\n' +
      '2. The area of the parallelogram spanned by two plane vectors $(a_1,a_2)$ and $(b_1,b_2)$ is the absolute value of $a_1b_2 - a_2b_1$, which is the magnitude of their vector product.',
    figure: {
      kind: 'vector_grid',
      vectors: [
        { label: 'a', to: [3, 1], color: '#1f4e79' },
        { label: 'b', to: [1, 3], color: '#1d6f42' },
      ],
      showResultant: { label: 'a+b', to: [4, 4], color: '#8a5300' },
      xRange: [0, 5],
      yRange: [0, 5],
    },
  },
  {
    id: 'S-hyd-1',
    title: 'Input — pressure in a fluid at rest',
    label: 'OFFICIAL_SAMPLE',
    domainIds: ['D06'],
    officialExercise: 'Exercise 2 (Hydrostatics)',
    conceptIds: ['C06.depth', 'C06.atm', 'C06.bar', 'C06.buoy', 'C06.displaced'],
    body:
      'In a fluid at rest, pressure grows with depth because each layer of fluid carries the weight of the layers above it. With the atmospheric pressure $p_0$ acting on the surface:\n\n' +
      '$p(h) = p_0 + \\rho g h$\n\n' +
      'For water ($\\rho \\approx 1000\\ \\text{kg/m}^3$) this gives the mental rule used in the official material: **10 m of water column ≈ 1 bar** (more precisely 1 bar = 100 000 Pa). Pressure at a given depth therefore has two parts: the atmosphere, which is already about 1 bar at the surface, and the water column above the point.\n\n' +
      'A body in the fluid experiences an upward force equal to the weight of the fluid it displaces. For a floating body the two forces balance, which yields the useful statement: **a floating body displaces its own mass in water**, not its own volume.',
    figure: {
      kind: 'pressure_depth',
      lines: [{ label: 'water (ρ ≈ 1000 kg/m³)', rho: 1000, p0: 1, color: '#1f4e79' }],
      hMax: 30,
      markedDepths: [10, 20, 30],
    },
  },
  {
    id: 'S-hyd-2',
    title: 'Input — trapped air, buoyancy and stability',
    label: 'OFFICIAL_SAMPLE',
    domainIds: ['D06', 'D05', 'D07'],
    officialExercise: 'Exercise 2 (Hydrostatics)',
    conceptIds: ['C06.trapped', 'C06.suction', 'C06.stability', 'C05.gas'],
    body:
      'When a gas is trapped in a container, the surrounding water cannot simply push it aside: the gas is compressed. For a fixed amount of gas at constant temperature:\n\n' +
      '$p_1 V_1 = p_2 V_2$\n\n' +
      'Here $p$ is the **absolute** pressure (measured from vacuum), never the gauge reading: air under 1 bar of gauge pressure is at about 2 bar absolute. Because the volume of the trapped air determines how much water the container displaces, pressure and buoyancy are coupled: compressing the trapped air reduces the displaced volume and therefore the buoyant force.\n\n' +
      'The same atmospheric pressure limits how high water can be lifted by suction: a pump cannot create more than a vacuum, so about 10 m is the ceiling at sea level. And a floating body tips until its weight and the buoyant force line up; a wider hull moves the displaced water sideways faster when it tilts and therefore produces a larger restoring effect.',
    figure: {
      kind: 'flooded_room',
      roomHeight: 4,
      leakDepth: 9,
      leakHeight: 1,
      riseFraction: 0.35,
    },
  },
  {
    id: 'S-eoq-1',
    title: 'Input — the order-quantity model',
    label: 'OFFICIAL_SAMPLE',
    domainIds: ['D09'],
    officialExercise: 'Exercise 3 (Optimal order quantity)',
    conceptIds: ['C09.assume', 'C09.avg', 'C09.cost', 'C09.qstar', 'C09.scaling'],
    body:
      'A business needs a constant annual demand $D$. Every order costs a fixed amount $S$; holding one unit in stock for a year costs $H$. With steady demand the stock level falls from $Q$ to zero in a straight line, so the average stock is $Q/2$ and the two annual cost terms are:\n\n' +
      '$C_{\\text{order}}(Q) = \\dfrac{D}{Q}S$ — the number of orders per year times the cost per order\n\n' +
      '$C_{\\text{hold}}(Q) = \\dfrac{Q}{2}H$ — average stock times holding cost per unit\n\n' +
      'The total cost $C(Q) = \\tfrac{D}{Q}S + \\tfrac{Q}{2}H$ has a minimum where the two terms are equal, at $Q^{*} = \\sqrt{2DS/H}$. The model assumes constant demand, constant costs per order and per unit, instantaneous replenishment and no stock-outs. Because the optimum is a square root, a doubling of $D$ increases $Q^{*}$ by the factor $\\sqrt{2}$, not by 2.',
    figure: {
      kind: 'eoq_curves',
      D: 3600,
      S: 50,
      H: 4,
      qMax: 900,
      highlight: 'optimal',
    },
  },
  {
    id: 'S-data-1',
    title: 'Input — reading quantitative information from tables and charts',
    label: 'OFFICIAL_FIELD_LIST',
    domainIds: ['D03', 'D01', 'D04'],
    conceptIds: ['C03.read', 'C03.gradient', 'C01.ratio', 'C04.mean'],
    body:
      'Quantitative items in the Subject Module are presented as text, tables, figures and formulas. Three reading rules prevent most mistakes:\n\n' +
      '1. **Identify the quantity asked for before computing.** A share is a part of a total, a gradient is a change per unit of another quantity, a difference is an absolute change, and a ratio compares two quantities. The wording decides which;\n\n' +
      '2. **Check the axes and the base.** A bar chart whose axis starts at 95 shows the same data as one starting at 0, but looks completely different. Percentages also need their base: a 5 % fall after a 20 % rise is not a 15 % fall;\n\n' +
      '3. **Look for what a single number hides.** A mean is pulled by extreme values, a median is not; a total says nothing about the distribution inside it.',
    figure: {
      kind: 'table',
      title: 'Two summaries of the same five values',
      headers: ['Values', 'Mean', 'Median'],
      rows: [
        ['12, 14, 15, 16, 18', '15,0', '15'],
        ['12, 14, 15, 16, 118', '35,0', '15'],
      ],
    },
  },
  {
    id: 'S-phys-1',
    title: 'Input — energy, power and machines',
    label: 'OFFICIAL_FIELD_LIST',
    domainIds: ['D05', 'D07'],
    conceptIds: ['C05.energy', 'C05.force', 'C07.lever', 'C07.flow', 'C07.efficiency'],
    body:
      'Work is force acting along a distance: $W = F\\,d$, measured in joules (1 J = 1 N·m). Power is energy per time: $P = E/t$, measured in watts (1 W = 1 J/s). Efficiency compares the useful output with the input:\n\n' +
      '$\\eta = \\dfrac{E_{\\text{useful}}}{E_{\\text{input}}}$\n\n' +
      'A lever in equilibrium satisfies $F_1 a_1 = F_2 a_2$: a small force on a long arm balances a large force on a short arm, and the price paid is distance, not energy. For an incompressible fluid flowing through a pipe of changing cross-section, the volume per second is constant, $A_1 v_1 = A_2 v_2$, so halving the cross-section doubles the velocity.',
    figure: {
      kind: 'lever',
      loadArm: 1,
      effortArm: 3,
      load: 600,
    },
  },
  {
    id: 'S-comp-1',
    title: 'Input — procedures, growth and error finding',
    label: 'OFFICIAL_FIELD_LIST',
    domainIds: ['D08', 'D13', 'D15'],
    conceptIds: ['C08.trace', 'C08.growth', 'C08.debug', 'C13.model', 'C15.quantifier'],
    body:
      'A procedure can be described in words and traced by hand. Write the state of every variable after each repetition in a table; one correctly filled row makes the whole trace trustworthy, and an obvious pattern lets you jump to a closed form instead of tracing every step.\n\n' +
      'The effort of a procedure as its input size $n$ grows is described by its growth class: constant (the effort does not change), linear (effort grows with $n$), quadratic (effort grows with $n^2$ — all pairs) and logarithmic (effort grows by one step whenever $n$ doubles). To find an error in a stated procedure, compute what the intended rule would produce at each step: the first step where the stated value and the intended value differ is the error.\n\n' +
      'Claims about such procedures are read with the same care as any other claim: "every value", "some value" and "exactly one value" are different statements, and an example that satisfies one of them usually refutes the others.',
    figure: {
      kind: 'line_chart',
      title: 'Growth of effort with input size',
      xLabel: 'input size n',
      yLabel: 'operations',
      x: [1, 2, 4, 8, 16],
      series: [
        { name: 'linear', values: [1, 2, 4, 8, 16], color: '#1f4e79' },
        { name: 'quadratic', values: [1, 4, 16, 64, 256], color: '#8a5300' },
      ],
    },
  },
  {
    id: 'S-econ-1',
    title: 'Input — cost, margin and demand response',
    label: 'OFFICIAL_FIELD_LIST',
    domainIds: ['D10', 'D09', 'D01'],
    conceptIds: ['C10.breakeven', 'C10.marginal', 'C10.elasticity', 'C09.cost'],
    body:
      'Total cost splits into a fixed part $F$ that does not depend on the output and a variable part $v$ per unit. Revenue is the price $p$ per unit times the quantity $Q$. The **contribution margin** $p - v$ is what each unit contributes towards the fixed cost, so the break-even quantity is\n\n' +
      '$Q_{\\text{BE}} = \\dfrac{F}{p - v}$\n\n' +
      'which exists only if $p > v$. Profit at a given quantity is $(p-v)Q - F$.\n\n' +
      'Decisions are made at the margin: costs already incurred cannot be changed by any later decision, while the profit of the best alternative that is given up is a real cost of the chosen option. When the price changes, the quantity demanded usually moves in the opposite direction; if the quantity reacts proportionally more than the price, total revenue falls.',
    figure: {
      kind: 'line_chart',
      title: 'Revenue and total cost',
      xLabel: 'units',
      yLabel: '€',
      x: [0, 100, 200, 300, 400],
      series: [
        { name: 'total cost (F = 6000, v = 20)', values: [6000, 8000, 10000, 12000, 14000], color: '#8a5300' },
        { name: 'revenue (p = 50)', values: [0, 5000, 10000, 15000, 20000], color: '#1f4e79' },
      ],
    },
  },
  {
    id: 'S-res-1',
    title: 'Input — research strategies and the course of a project',
    label: 'OFFICIAL_SAMPLE',
    domainIds: ['D11', 'D12'],
    officialExercise: 'Exercise 4 (Research methods)',
    conceptIds: ['C11.qtypes', 'C11.dedind', 'C11.phases', 'C11.linear', 'C11.document', 'C11.general'],
    body:
      'Empirical work begins with a question and chooses a strategy that can answer it. A **quantitative** strategy measures and compares; a **qualitative** strategy interprets material in order to understand processes and meanings. Deductive work starts from theory and tests a derived expectation; inductive work develops concepts from the material itself.\n\n' +
      'The ideal-typical project runs through four phases in order: (1) formulate the problem and the questions, (2) design the procedure and the instruments, (3) collect the data, (4) analyse and report. Real projects are often **circular**: analysis exposes a gap in an earlier phase and the researcher returns to it. Both courses are legitimate — they serve different aims.\n\n' +
      'Modifications during a project are permissible but may reduce the significance or comparability of the results; what matters methodologically is that the change is documented and its consequences reported. Results can be generalised to a population only within the limits of the sampling; qualitative findings are instead transferable to comparable cases, and the reader judges how comparable they are.',
    figure: {
      kind: 'flowchart',
      title: 'Phases of a research project',
      steps: [
        '1 · problem and questions',
        '2 · design and instruments',
        '3 · data collection',
        '4 · analysis and reporting',
        '(circular practice: analysis may reopen an earlier phase)',
      ],
    },
  },
  {
    id: 'S-res-2',
    title: 'Input — evidence, controls and what a result can support',
    label: 'OFFICIAL_SAMPLE',
    domainIds: ['D14', 'D12', 'D11'],
    officialExercise: 'Exercise 4 (Research methods)',
    conceptIds: ['C14.control', 'C14.bias', 'C14.conclude', 'C12.confound', 'C12.selection'],
    body:
      'A comparison supports a causal reading only to the extent that the groups differ in nothing but the condition under study. A **control group** removes changes that would have happened anyway; **randomisation** makes the groups comparable in expectation, including with respect to factors nobody measured; **blinding** prevents expectations from moving the measurements; **replication** distinguishes an effect from an accident of one run.\n\n' +
      'Where these devices are missing, an observed difference remains a relationship that still needs an explanation: a third factor related to both quantities (a confounder), a group that is special in a relevant way (selection), or a measure that records something other than the concept it names. A careful report therefore states the size of the difference, the population it was observed in, and the limits of the design — and a sentence is over-strong when it drops any of the three.',
    figure: {
      kind: 'table',
      title: 'Design and the claim it earns',
      headers: ['Design', 'Comparison', 'Reasonable claim'],
      rows: [
        ['one group, before and after', 'same group over time', 'the value changed'],
        ['two groups, not randomised', 'between groups', 'the groups differ (with caveats)'],
        ['randomised controlled trial', 'random groups', 'the treatment plausibly caused the difference'],
        ['independent repetitions', 'across studies', 'the effect is reproducible'],
      ],
    },
  },
  {
    id: 'S-arg-1',
    title: 'Input — claims, quantifiers and conditions',
    label: 'OFFICIAL_FIELD_LIST',
    domainIds: ['D15', 'D11'],
    conceptIds: ['C15.claim', 'C15.quantifier', 'C15.necessary', 'C15.inference'],
    body:
      'An argument consists of a claim, the support offered for it and a conclusion. Two distinctions decide most judgements about arguments:\n\n' +
      '- **Quantifiers.** "All A are B" is refuted by a single A that is not B. "Some A are B" asserts only that at least one such case exists and says nothing about the rest. "Only A are B" reverses the direction of the implication compared with "all A are B".\n' +
      '- **Necessary and sufficient conditions.** If A is sufficient for B, then A guarantees B ($A \\Rightarrow B$). If A is necessary for B, then B cannot occur without A ($B \\Rightarrow A$). A condition can be sufficient, necessary, both or neither, and mixing the two up is the most common error.\n\n' +
      'An inference is valid when the conclusion follows with certainty from the premises, whatever the facts may be; a conclusion that is merely well supported is strong but not valid. Rules and standards are read the same way: "every licence holder must file annually" says nothing about those who do not hold a licence, and nothing about filings at other times.',
    figure: {
      kind: 'blob_diagram',
      caption: 'One arrow, two readings',
      nodes: [
        { id: 'a', label: 'A', x: 22, y: 50 },
        { id: 'b', label: 'B', x: 78, y: 50 },
      ],
      edges: [{ from: 'a', to: 'b', label: 'A ⇒ B' }],
    },
  },
];
