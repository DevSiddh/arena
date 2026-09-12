import { f, fig, intuition, lesson, mis, official, p, practice, sec, steps, t } from './helpers';

export const L02 = lesson(
  'L02',
  'D02',
  'Vectors: components, magnitudes, products and what each one measures',
  'The one mathematics domain the official material develops in full — taught from components to coplanarity.',
  ['OFFICIAL_SAMPLE', 'PREREQUISITE'],
  75,
  [
    sec('what_is_it', [
      p(
        'A **scalar** is a single number: a temperature, a mass, a price. A **vector** is an ordered list of numbers with a direction: $\\vec{a} = (a_1, a_2)$ in the plane, $\\vec{a} = (a_1, a_2, a_3)$ in space. ' +
          'The entries are called **components**. In the official material vectors appear both as coordinate pairs read off a figure and as pure component lists, and every question is a manipulation of those components.',
      ),
      p(
        'Three products are defined, and the whole exercise turns on telling them apart. The **scalar product** $\\vec{a}\\cdot\\vec{b}$ returns a number. The **vector product** $\\vec{a}\\times\\vec{b}$ returns a vector, perpendicular to both. The **triple product** $(\\vec{a}\\times\\vec{b})\\cdot\\vec{c}$ returns a number again — the signed volume of the parallelepiped spanned by the three vectors.',
      ),
      official('EX1', 'The official exercise states that a scalar has one component and a vector has n components, then moves through magnitude, addition, scalar multiplication, the three products, the parallelogram area and coplanarity. Every item below is built on exactly that list.'),
    ]),
    sec('why_it_matters', [
      p(
        'Vectors are the one topic where the official material shows its full expectation: a definition table, worked solutions, and eight questions that are marked as samples. It is also the most transferable tool in the module — the same component arithmetic that adds forces adds displacements, price-and-quantity bundles and image features.',
      ),
      p('Two official question patterns are worth naming because they recur in the practice pool: a **numeric** item (compute a magnitude, an area, a determinant) and a **result-type** item (which of the three products is a vector, a scalar, or zero?). The second pattern punishes learners who memorised formulas without keeping track of meaning.'),
    ]),
    sec('prerequisites', [
      p('You must be able to: read coordinates from a grid; apply Pythagoras; multiply and add negative numbers reliably; and compute a $2\\times 2$ determinant $\\begin{vmatrix} a_1 & b_1 \\\\ a_2 & b_2 \\end{vmatrix} = a_1 b_2 - a_2 b_1$.'),
      p('If any of those is shaky, work lesson L01 first — the traps in vector items are almost always sign, order or component errors, not geometric ones.'),
    ]),
    sec('core_knowledge', [
      p('**Magnitude** (length) comes from Pythagoras, extended to three dimensions:'),
      f('|\\vec{a}| = \\sqrt{a_1^2 + a_2^2}\\qquad |\\vec{a}| = \\sqrt{a_1^2 + a_2^2 + a_3^2}', 'The magnitude is a scalar and is never negative.'),
      p('**Addition and subtraction** act component by component. **Scalar multiplication** scales every component, so the direction stays the same and only the length changes by $|k|$ (with a reversal of direction when $k<0$):'),
      f('\\vec{a}+\\vec{b} = (a_1+b_1,\\ a_2+b_2),\\qquad k\\vec{a} = (k a_1,\\ k a_2)'),
      p('**Scalar (dot) product** — multiplication followed by addition; the result is a single number:'),
      f('\\vec{a}\\cdot\\vec{b} = a_1b_1 + a_2b_2 (+a_3b_3),\\qquad \\vec{a}\\cdot\\vec{b} = |\\vec{a}|\\,|\\vec{b}|\\cos\\varphi'),
      p('**Vector (cross) product** — a determinant built from the unit vectors $\\vec{e}_1,\\vec{e}_2,\\vec{e}_3$; the result is a vector perpendicular to both, and its magnitude is the area of the parallelogram spanned:'),
      f('\\vec{a}\\times\\vec{b} = \\big(a_2b_3-a_3b_2,\\ a_3b_1-a_1b_3,\\ a_1b_2-a_2b_1\\big),\\qquad |\\vec{a}\\times\\vec{b}| = |\\vec{a}|\\,|\\vec{b}|\\sin\\varphi'),
      p('**Triple product** — the determinant of the three vectors; it equals the signed volume of the parallelepiped, and it is zero exactly when the three vectors lie in one plane (coplanar):'),
      f('(\\vec{a}\\times\\vec{b})\\cdot\\vec{c} = \\det(\\vec{a},\\vec{b},\\vec{c})'),
      t(
        ['Expression', 'Result', 'What it measures', 'Zero when'],
        [
          ['$\\vec{a}\\cdot\\vec{b}$', 'scalar', 'alignment: $|\\vec{a}||\\vec{b}|\\cos\\varphi$', 'perpendicular'],
          ['$\\vec{a}\\times\\vec{b}$', 'vector', 'a vector perpendicular to both, length $|\\vec{a}||\\vec{b}|\\sin\\varphi$', 'parallel'],
          ['$(\\vec{a}\\times\\vec{b})\\cdot\\vec{c}$', 'scalar', 'signed volume of the parallelepiped', 'coplanar'],
          ['$|\\vec{a}\\times\\vec{b}|$', 'scalar', 'area of the spanned parallelogram', '— (parallel vectors)'],
        ],
        'The official table of the three products, in the form that makes the result type obvious.',
      ),
    ]),
    sec('visual_intuition', [
      fig(
        {
          kind: 'vector_grid',
          vectors: [
            { label: 'a', to: [3, 1], color: '#2563eb' },
            { label: 'b', to: [1, 3], color: '#059669' },
          ],
          showResultant: { label: 'a+b', to: [4, 4], color: '#b45309' },
          xRange: [0, 5],
          yRange: [0, 5],
        },
        'Addition walks the arrows head to tail: four units across, four units up. The parallelogram spanned by a and b has area $|\\vec{a}\\times\\vec{b}| = |3\\cdot3 - 1\\cdot1| = 8$.',
      ),
      intuition(
        'Read the dot product as a *shadow*: how much of $\\vec{b}$ lies along $\\vec{a}$. Right angle — no shadow, zero. Same direction — full shadow, maximal. Read the cross product as a *swept area*: two vectors sweep out a parallelogram whose area is largest when they are perpendicular and vanishes when they are parallel. ' +
          'Volume of a parallelepiped is the area of the base times the height; that is exactly why the triple product is zero when the third vector adds no height — coplanar.',
      ),
      fig(
        {
          kind: 'vector_grid',
          vectors: [
            { label: 'a', to: [3, 0], color: '#2563eb' },
            { label: 'c', to: [1, 2], color: '#7c3aed' },
            { label: 'b', to: [0, 2], color: '#059669' },
          ],
          xRange: [-1, 4],
          yRange: [-1, 3],
        },
        'Dot-product geometry: the projection of b onto a has length $\\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}|}$. Here the shadow of b on a is zero — the vectors are perpendicular.',
      ),
    ]),
    sec('worked_example', [
      p('Given $\\vec{a} = (2, -1, 3)$ and $\\vec{b} = (1, 4, -2)$, find $\\vec{a}+\\vec{b}$, $|\\vec{a}|$, $\\vec{a}\\cdot\\vec{b}$ and $\\vec{a}\\times\\vec{b}$.'),
      steps([
        'Add component by component: $\\vec{a}+\\vec{b} = (2+1,\\ -1+4,\\ 3-2) = (3, 3, 1)$.',
        'Magnitude: $|\\vec{a}| = \\sqrt{4+1+9} = \\sqrt{14} \\approx 3{,}74$ — one number, not a vector.',
        'Dot product: $2\\cdot1 + (-1)\\cdot4 + 3\\cdot(-2) = 2 - 4 - 6 = -8$. Negative, so the angle is obtuse (larger than 90°).',
        'Cross product, first component: $a_2b_3 - a_3b_2 = (-1)(-2) - (3)(4) = 2 - 12 = -10$.',
        'Second component: $a_3b_1 - a_1b_3 = (3)(1) - (2)(-2) = 3 + 4 = 7$.',
        'Third component: $a_1b_2 - a_2b_1 = (2)(4) - (-1)(1) = 8 + 1 = 9$.',
        'So $\\vec{a}\\times\\vec{b} = (-10, 7, 9)$ — a vector. Check perpendicularity to $\\vec{a}$: $2(-10) + (-1)(7) + 3(9) = -20 - 7 + 27 = 0$. The check passes, which is far faster than re-deriving the determinant.',
      ]),
      mis(
        'Writing the cross product in the order of the dot product.',
        'The determinant is cyclic: the first component uses the 2nd and 3rd entries, the second uses the 3rd and 1st, the third uses the 1st and 2nd — and the middle component has a reversed sign. Swapping $\\vec{a}$ and $\\vec{b}$ flips the sign of the whole vector.',
      ),
    ]),
    practice(
      'guided_practice',
      [p('Compute with the formulas in front of you. For every item, first say out loud whether the result should be a scalar or a vector — that single habit removes most errors before any arithmetic.')],
      ['C02.magnitude', 'C02.addsub', 'C02.scalar'],
      [1, 2],
    ),
    practice(
      'independent_practice',
      [p('Now the products. Keep the perpendicularity check in reserve: if the dot product of your cross-product result with either input is not zero, you have made an error, and you will find it in ten seconds instead of two minutes.')],
      ['C02.dot', 'C02.cross', 'C02.angle'],
      [2, 3],
    ),
    practice(
      'transfer',
      [p('The same components appear as forces, displacements, areas and volumes. Ask what the result *measures* before computing it: an area is a magnitude of a cross product, a volume is a triple product, an angle comes from the dot product.')],
      ['C02.area', 'C02.triple', 'C02.coplanar', 'C02.angle'],
      [4, 5],
    ),
    practice(
      'dmat_style',
      [p('Official-style items: a statement about magnitudes or angles to judge, a result-type question, or a reverse question that gives the answer and asks for the parameter that produces it.')],
      ['C02.resulttype', 'C02.coplanar', 'C02.magnitude', 'C02.dot'],
      [5, 6],
    ),
    sec('trick_misconception', [
      mis('$|\\vec{a}+\\vec{b}| = |\\vec{a}| + |\\vec{b}|$.', 'Only when the vectors point the same way. In general $|\\vec{a}+\\vec{b}|^2 = |\\vec{a}|^2 + 2\\vec{a}\\cdot\\vec{b} + |\\vec{b}|^2$ — the cross term is where the geometry lives.'),
      mis('“A zero dot product means one vector is zero.”', 'It means they are perpendicular — or that one of them is zero. Zero is the special case, perpendicular is the rule.'),
      mis('“The triple product equals the volume.”', 'It equals the *signed* volume: a negative value means the three vectors form a left-handed system. The magnitude is the volume.'),
      mis('“The cross product is just a determinant to memorise.”', 'It is a direction too. That is why the order matters and why the result is perpendicular to both inputs — properties the official questions exploit.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool over the whole lesson, including the hard items. Mastery means: correct result type every time, sign errors rare, and the geometric interpretation available without effort. Target 85 % with at least one level 6 item correct.')],
      ['C02.coords', 'C02.magnitude', 'C02.addsub', 'C02.scalar', 'C02.dot', 'C02.angle', 'C02.cross', 'C02.area', 'C02.triple', 'C02.coplanar', 'C02.resulttype'],
      [1, 2, 3, 4, 5, 6, 7],
    ),
  ],
);
