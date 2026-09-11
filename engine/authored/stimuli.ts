import type { Stimulus } from '../types';

/**
 * Stimulus blocks — the "input" half of the official two-part item anatomy
 * (a typically subject-related problem as input, plus single-choice questions).
 *
 * Each block supplies the relations a student needs in order to work through the
 * questions that follow it, exactly as the official exercises do. All texts are written
 * for this project; none is copied from the official material. The `officialExercise`
 * marker only records which official exercise demonstrates the same domain.
 */

export const STIMULI: Stimulus[] = [
  /* ---------------------------------------------------------------- */
  /* Vectors                                                           */
  /* ---------------------------------------------------------------- */
  {
    id: 'S-vec-1',
    title: 'Vectors in two and three dimensions',
    label: 'OFFICIAL_SAMPLE',
    officialExercise: 'EX1',
    domainIds: ['D02'],
    body: [
      'A scalar consists of a single number (for example $a = 2$). A vector is formed from several numbers and can define a point in an $n$-dimensional vector space through its $n$ components. Here we consider vectors in two and three dimensions.',
      '',
      'Two vectors are added or subtracted **component by component**. Multiplying a vector by a scalar $k$ multiplies every component by $k$: if $|k| > 1$ the vector becomes longer, if $0 < |k| < 1$ it becomes shorter, and a negative $k$ reverses its direction. The length of a vector follows from the generalised Pythagorean theorem:',
      '',
      '$$|\\vec{a}| = \\sqrt{a_x^2 + a_y^2 + a_z^2}$$',
      '',
      'Two products are defined between vectors, and they produce different types of results:',
      '',
      '| Name | Notation | Rule | Further relation |',
      '|---|---|---|---|',
      '| Scalar product | $\\vec{a}\\cdot\\vec{b}$ | $a_xb_x + a_yb_y + a_zb_z$ | $\\vec{a}\\cdot\\vec{b} = \\lvert\\vec{a}\\rvert\\,\\lvert\\vec{b}\\rvert\\cos\\varphi$ |',
      '| Vector product | $\\vec{a}\\times\\vec{b}$ | $(a_yb_z - a_zb_y,\\; a_zb_x - a_xb_z,\\; a_xb_y - a_yb_x)$ | $\\lvert\\vec{a}\\times\\vec{b}\\rvert = \\lvert\\vec{a}\\rvert\\,\\lvert\\vec{b}\\rvert\\sin\\varphi$, $0 \\le \\varphi \\le \\pi$ |',
      '| Triple product | $[\\vec{a}\\,\\vec{b}\\,\\vec{c}]$ | $\\vec{a}\\cdot(\\vec{b}\\times\\vec{c})$ | equals the spanned volume |',
      '',
      'Geometric readings that matter for problems: the scalar product is a **number** (it can be negative, and it is $0$ exactly when the vectors are perpendicular); the vector product is a **vector** perpendicular to both inputs whose magnitude equals the **area of the parallelogram** they span; the triple product is a **number** whose magnitude is the **volume** of the parallelepiped the three vectors span, and it is $0$ exactly when they lie in one plane.',
    ].join('\n'),
  },
  {
    id: 'S-vec-2',
    title: 'Reading vectors off a coordinate figure',
    label: 'OFFICIAL_SAMPLE',
    officialExercise: 'EX1',
    domainIds: ['D02'],
    body: [
      'A vector drawn in the Cartesian plane is read by looking at how far its tip lies to the right and upwards from its base. A vector from the origin to the point $(3, -2)$ has components $a_x = 3$ and $a_y = -2$; the signs are part of the components and must not be dropped.',
      '',
      'Two operations are frequently combined in a single question: forming a **linear combination** such as $\\vec{s} = \\vec{a} + \\vec{b} - \\vec{c}$ and interpreting the result geometrically. Because addition and subtraction act component by component, each component of $\\vec{s}$ can be computed on its own; a negative sign in front of a vector flips the signs of that vector\'s components.',
      '',
      'The same figure can be used to determine other quantities:',
      '',
      '- the length of a single vector, $\\sqrt{a_x^2 + a_y^2}$;',
      '- the angle between two vectors, from $\\cos\\varphi = \\dfrac{\\vec{a}\\cdot\\vec{b}}{\\lvert\\vec{a}\\rvert\\,\\lvert\\vec{b}\\rvert}$;',
      '- the area of the parallelogram spanned by two vectors, $\\lvert a_xb_y - a_yb_x\\rvert$ for vectors in the plane (this is the vector product with both $z$-components set to zero).',
      '',
      'A useful check: the result of a linear combination must be a *vector* (two components here), while a length, an angle cosine and an area are *numbers*.',
    ].join('\n'),
  },

  /* ---------------------------------------------------------------- */
  /* Hydrostatics                                                      */
  /* ---------------------------------------------------------------- */
  {
    id: 'S-hyd-1',
    title: 'Pressure in a liquid and the floating of bodies',
    label: 'OFFICIAL_SAMPLE',
    officialExercise: 'EX2',
    domainIds: ['D06'],
    body: [
      'In an incompressible fluid the pressure increases **linearly with depth**: the column of fluid above a point has a weight that grows with its height, and because the fluid cannot be compressed away, this weight acts at the point in every direction. The pressure at a point therefore depends only on its vertical distance below the surface and on the density of the fluid:',
      '',
      '$$p(h) = \\rho \\cdot g \\cdot h + p_0$$',
      '',
      'where $\\rho$ is the density of the fluid, $g$ the acceleration due to gravity, $h$ the depth below the liquid surface and $p_0$ the pressure at the surface, for example the atmospheric pressure.',
      '',
      'For estimates the following simplifications are used: $\\rho_{\\text{water}} = 1000\\ \\text{kg/m}^3$ and $g \\approx 10\\ \\text{N/kg}$. This gives a pressure increase of about $10^5\\ \\text{Pa}$, that is **1 bar, for every 10 m of water depth**; the atmosphere contributes about 1 bar as well.',
      '',
      'Bodies swim or float because of pressure differences inside the liquid: the pressure acts on the underside more strongly than on the top. Summed over the whole surface this results in an upward **buoyant force** $F_B$ whose magnitude equals the weight of the fluid that the body displaces. For a body floating in equilibrium the buoyant force and the weight force balance:',
      '',
      '$$F_G - F_B = 0$$',
      '',
      'Consequences that solve most problems: the **mass of the displaced fluid equals the mass of the body**; the weight force acts at the centre of gravity of the body $G$, the buoyant force at the centre of gravity of the *submerged* part $B$; and only the *submerged volume* of a body displaces fluid, no matter how deep the body sits.',
    ].join('\n'),
    figure: { kind: 'tank_points', points: [{ label: 'A', depth: 3 }, { label: 'B', depth: 7 }], fluid: 'water', depthsScaleMax: 9 },
  },
  {
    id: 'S-hyd-2',
    title: 'Trapped air, suction and stability',
    label: 'OFFICIAL_SAMPLE',
    officialExercise: 'EX2',
    domainIds: ['D06', 'D05', 'D07'],
    body: [
      'Fluids are treated as incompressible, but **gases are not**. If air is trapped in a space that water enters, the air is compressed until its pressure equals the water pressure at the entry point. For an isothermal process (constant temperature) pressure and volume are inversely proportional:',
      '',
      '$$p_1 V_1 = p_2 V_2$$',
      '',
      'In the simplified model the pressure doubles at a depth of 10 m, so the trapped air occupies half of its original volume. A precise calculation must additionally account for the pressure of the risen water column itself; the exact water level then lies slightly lower than the simplified estimate. Recognising the direction and the order of magnitude of the effect is normally enough.',
      '',
      '**Suction.** A pump that "sucks" water actually removes pressure, and the atmosphere pushes the water up the pipe. The maximum lift therefore follows from the available pressure difference, $h_{\\max} = \\Delta p /(\\rho g)$: a perfect vacuum supports about 10 m of water. The submerged length of the pipe is irrelevant to this limit, because water below the surface is already under pressure.',
      '',
      '**Stability.** When a floating body is tilted, its submerged volume shifts sideways and the centre of buoyancy $B$ moves with it. The resulting pair of forces (weight at $G$, buoyancy at $B$) creates a restoring moment. For the same tilting moment, a body with a **wider** waterplane restores itself with a smaller rotation than a narrow one, so a narrow hull tilts further.',
      '',
      '**Densities.** A homogeneous body floats if its density is below that of the fluid, and the fraction of its volume below the surface equals the ratio of the densities, $\\rho_{\\text{body}}/\\rho_{\\text{fluid}}$.',
    ].join('\n'),
  },

  /* ---------------------------------------------------------------- */
  /* EOQ                                                               */
  /* ---------------------------------------------------------------- */
  {
    id: 'S-eoq-1',
    title: 'The optimal order quantity model',
    label: 'OFFICIAL_SAMPLE',
    officialExercise: 'EX3',
    domainIds: ['D09'],
    body: [
      'The optimal order quantity minimises the total cost of holding inventory and of placing orders. Holding costs ($H$ per unit per year) cover storage, capital tied up in stock, insurance and risk; **fixed ordering costs** ($S$ per order) arise with every single order and do not depend on the quantity ordered.',
      '',
      'The model rests on four assumptions:',
      '',
      '1. **Constant demand**: demand is known and evenly distributed over the year. Between two orders the inventory therefore falls steadily from $Q$ to $0$.',
      '2. **No quantity discounts**: the unit price of the goods does not depend on the order quantity.',
      '3. **No capital or storage limits**: enough money and space are available to order and store any quantity.',
      '4. **Cost minimisation**: the only objective is to minimise the sum of ordering and holding costs.',
      '',
      'The two cost components per year are',
      '',
      '$$\\text{ordering cost} = \\frac{D}{Q}\\,S \\qquad \\text{holding cost} = \\frac{Q}{2}\\,H$$',
      '',
      'where $D$ is the annual demand, $Q$ the order quantity, $S$ the fixed cost per order and $H$ the holding cost per unit per year. The term $Q/2$ appears because inventory falls linearly from $Q$ to $0$ within each cycle, so the **average** stock level is $Q/2$.',
      '',
      'The total cost $\\text{TC}(Q) = \\frac{D}{Q}S + \\frac{Q}{2}H$ is the sum of a falling and a rising term, so it has a single minimum. At that minimum the two components are **equal**, which yields',
      '',
      '$$Q^* = \\sqrt{\\frac{2DS}{H}}$$',
      '',
      'Because $Q^*$ depends on the square root of the ratio, the response to parameter changes is damped: quadrupling $S$ doubles $Q^*$, and quadrupling $H$ halves it. Ordering costs fall as $Q$ grows (fewer orders), holding costs rise (more stock on average) — which is why the cost curve is flat near the optimum and a non-optimal order quantity costs far less than a proportional error would suggest.',
    ].join('\n'),
    figure: { kind: 'eoq_curves', D: 1800, S: 50, H: 2, qMax: 600, highlight: 'optimal' },
  },

  /* ---------------------------------------------------------------- */
  /* Research methodology                                              */
  /* ---------------------------------------------------------------- */
  {
    id: 'S-res-1',
    title: 'Qualitative and quantitative research strategies',
    label: 'OFFICIAL_SAMPLE',
    officialExercise: 'EX4',
    domainIds: ['D11', 'D12'],
    body: [
      'Empirical social research distinguishes between qualitative and quantitative strategies, and both contribute to explaining social action. Two aspects of explanation can be separated. First, one can investigate whether a factor is **related** to an outcome (a causal relationship) — for instance whether a higher degree of education relates to a higher income. Second, one can investigate **how** such an outcome arises (a causal mechanism): the process between cause and result, for example that better education opens better professional opportunities.',
      '',
      'The **quantitative** (theory-testing, deductive) strategy aims at causal relationships. It uses standardised data collection and statistical tests, for which a sample of appropriate size is central to statistical significance. The **qualitative** (theory-generating, inductive) strategy aims at causal mechanisms. It works with one case or a few cases, which also reveals the individual conditions under which a mechanism operates — but it provides no information about how widespread these conditions are.',
      '',
      'The research process is divided into four phases: (1) identifying a research problem and formulating a research question, (2) specifying the research design — the period of the investigation, the units and the collection methods, (3) collecting and analysing data, (4) processing the material into a report or publication.',
      '',
      'Quantitative projects follow an ideal-typical **linear** procedure: the design fixes hypotheses, measurement instruments, sample and methods, and the conceptual, theoretical, methodological and empirical steps are kept separate. Later modifications are not excluded, but they must be documented clearly and taken into account in the analysis; changes to instruments, samples or collection methods can limit the significance or comparability of the results.',
      '',
      'Qualitative projects may include **circular** elements: phases need not be separated or processed in a fixed order, and preconceptions or the methodological approach may be modified during the process — as long as the changes are clearly explained and documented.',
    ].join('\n'),
  },
  {
    id: 'S-res-2',
    title: 'Evidence, comparison and what a study can claim',
    label: 'PREPARATION_EXTENSION',
    domainIds: ['D14', 'D12', 'D11'],
    body: [
      'A study design determines which conclusions the data can support. Two questions must be separated: *what was compared with what*, and *what is being claimed*.',
      '',
      'A **comparison group** supplies the counterfactual — what would have happened without the intervention. Without one, a before/after difference mixes the intervention with everything else that changed in the same period. Where groups are formed by choice rather than by chance, they may differ systematically, so an observed difference can reflect who entered the group rather than what happened in it.',
      '',
      'Several devices serve distinct purposes: **randomisation** decides how units enter the groups, **blinding** decides who knows the allocation, and a **placebo or sham condition** controls for the expectation of being treated. Confusing them leads to the wrong conclusion about what a study has shown.',
      '',
      'Claims come in different strengths. An association says that two quantities co-vary; a causal claim needs the association plus a defensible comparison; and a claim about **prevalence** needs a sample that represents the population. An association measured between groups (for example countries or districts) does not automatically transfer to individuals within those groups.',
      '',
      'Finally, evidence accumulates: a single result — especially from a small sample — is an estimate with uncertainty, and surprising findings from small studies occur by chance. Replication and an explanation for discrepancies are what turn a result into knowledge.',
    ].join('\n'),
  },

  /* ---------------------------------------------------------------- */
  /* Cross-domain blocks for the other officially named areas          */
  /* ---------------------------------------------------------------- */
  {
    id: 'S-data-1',
    title: 'Reading tables, rates and charts',
    label: 'OFFICIAL_FIELD_LIST',
    domainIds: ['D03', 'D01', 'D04'],
    body: [
      'Data interpretation is about choosing the right operation for the question that is asked:',
      '',
      '- **Share** of a whole: divide the part by the total, then express the result as a percentage of *that* total. Comparing with the largest category instead of the total is a frequent error.',
      '- **Rate of change (gradient)**: divide the change in the vertical quantity by the change *in the horizontal quantity* — not by the sum, not by the value itself. A gradient is a ratio of two differences.',
      '- **Marginal quantity**: the change of a total over one additional unit of input; it is a ratio of differences, whereas an average divides a total by a level.',
      '- **Percentage change**: divide the change by the *original* value. Percentages combine multiplicatively, so a 20 % fall followed by a 5 % rise does not return to the starting value (they combine as $0.8 \\times 1.05 = 0.84$).',
      '- **Summary statistics**: the mean uses every value (and is therefore sensitive to extremes), while the median uses only the middle position of the ordered list (and is robust).',
      '',
      'Charts add a second layer of interpretation: the axis range matters, because bar length encodes magnitude *relative to the plotted range*. An axis starting at 95 makes a difference of 2 units look dramatic even though it is tiny relative to the values. Percentages on a secondary axis, absolute-versus-relative comparisons and truncated axes are the standard sources of misreading.',
    ].join('\n'),
  },
  {
    id: 'S-phys-1',
    title: 'Energy, power, flow and simple machines',
    label: 'OFFICIAL_FIELD_LIST',
    domainIds: ['D05', 'D07'],
    body: [
      'A few relations cover most engineering-flavoured reasoning that appears alongside fluid problems:',
      '',
      '| Quantity | Relation | Reading |',
      '|---|---|---|',
      '| Work | $W = F \\cdot s$ | force along the direction of displacement, independent of how long the process takes |',
      '| Power | $P = W / t$ | work per unit time; the same work done faster needs more power |',
      '| Efficiency | $\\eta = W_{\\text{useful}} / E_{\\text{input}}$ | the remainder is not destroyed but leaves as waste heat |',
      '| Moment | $M = F \\cdot a$ | force times its perpendicular distance from the pivot |',
      '| Equilibrium of moments | $F_1 a_1 = F_2 a_2$ | a smaller force needs a longer arm |',
      '| Continuity (incompressible flow) | $A_1 v_1 = A_2 v_2$ | the same volume per second passes every cross-section |',
      '| Isothermal gas | $p_1 V_1 = p_2 V_2$ | halving the volume doubles the pressure |',
      '',
      'Two habits make such problems manageable. First, check the **type** of the requested quantity: a force, an energy, a power or an efficiency each has its own unit, and options with the wrong unit can often be eliminated immediately. Second, check the **direction** of an effect before calculating: a narrowing pipe must speed the flow up, and a larger arm must reduce the required force.',
      '',
      'Scaling is a third habit. Areas scale with the square of a length scale and volumes with the cube, so a model at a scale of 1 : 100 has a volume ratio of $10^{-6}$. Quantities defined per unit area or per unit volume therefore behave differently from the quantities they are built from.',
    ].join('\n'),
  },
  {
    id: 'S-comp-1',
    title: 'Procedures, growth and representation',
    label: 'OFFICIAL_FIELD_LIST',
    domainIds: ['D08', 'D13', 'D15'],
    body: [
      'Algorithmic reasoning asks what a precisely stated procedure does — without a computer:',
      '',
      '```\ntotal ← 0\nrepeat n times:\n    total ← total + value\noutput total\n```',
      '',
      'Reading such a procedure requires three checks: the **initial state** (what is true before the loop), the **update** (what each pass changes) and the **number of repetitions** (a loop repeated $n$ times executes its body exactly $n$ times — an off-by-one error changes the result).',
      '',
      'Beyond single traces, the question is how the work grows with the size of the input. Constants do not matter for that judgement; the growth class does. Doubling the input roughly doubles a linear procedure, multiplies a quadratic one by four, and barely changes a logarithmic one — which is why $n \\log n$ sorting methods remain feasible when a naive pairwise comparison does not.',
      '',
      'Two representation habits transfer to other domains. **Quantifier precision**: "all", "some", "at least one" and "only" describe different claims, and a universal claim ("every project that used the tool finished on time") is refuted by a single counterexample. **Assumption checks**: a procedure, model or definition applies only where its premises hold, so the first question about any prediction is whether its conditions are satisfied here.',
    ].join('\n'),
  },
  {
    id: 'S-econ-1',
    title: 'Costs, margins and incentives',
    label: 'OFFICIAL_FIELD_LIST',
    domainIds: ['D10', 'D09', 'D01'],
    body: [
      'Economic reasoning is mostly about what a decision *changes*:',
      '',
      '- **Opportunity cost**: the value of the best alternative forgone belongs to the cost of a decision, even when no invoice is issued. A year of full-time study costs the tuition *plus* the income not earned.',
      '- **Fixed and variable costs**: fixed costs do not change with volume; variable costs do. Break-even occurs where the total contribution of the units sold equals the fixed costs, so the break-even quantity is fixed cost divided by the **contribution margin** (price minus variable cost).',
      '- **Marginal reasoning**: once fixed costs are covered, additional business is worthwhile if the price exceeds the *variable* cost, even if it is below the average cost. Requiring every order to cover average cost rejects profitable additional volume.',
      '- **Elasticity**: the relative change in quantity divided by the relative change in price. Demand is elastic when the quantity reacts proportionally more than the price, in which case a price rise *reduces* total revenue; it is inelastic when the quantity reacts less, in which case revenue rises.',
      '',
      'Two structural ideas recur alongside these: a total cost made of one falling and one rising component has a flat minimum where the components balance (the order-quantity model), and percentages combine multiplicatively rather than additively.',
    ].join('\n'),
  },
];
