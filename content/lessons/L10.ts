import { f, fig, intuition, lesson, mis, p, practice, sec, steps, t } from './helpers';

export const L10 = lesson(
  'L10',
  'D10',
  'Business and economic reasoning: break-even, opportunity cost, demand response',
  'Decisions under constraint — the marginal way of thinking that business and economics items test.',
  ['OFFICIAL_FIELD_LIST', 'PREPARATION_EXTENSION'],
  50,
  [
    sec('what_is_it', [
      p(
        'Four ideas, all of them count-based: the **break-even point** (how much must be sold before the fixed costs are covered), the **contribution margin** (price minus variable cost, the money each unit contributes towards fixed cost), **opportunity cost** (the value of the best alternative you gave up), and **demand response** (by how much quantity falls when the price rises).',
      ),
      p('The official field list names business administration and economics; the official order-quantity exercise already uses marginal cost language, so this lesson extends a demonstrated mode of reasoning rather than inventing a topic.'),
    ]),
    sec('why_it_matters', [
      p(
        'Business items in aptitude tests almost always test *marginal* thinking: not "what is the total?" but "what changes if we do one more?" That is the same move as the EOQ optimum (one more unit of Q) and as the hydrostatic effect-of-change items — a structure the module rewards repeatedly.',
      ),
      mis('“Sunk costs should influence the decision.”', 'They cannot be changed by any decision. Only future costs and benefits matter; a report that argues from money already spent is the classic distractor.'),
    ]),
    sec('prerequisites', [
      p('Ratio, proportion and percentage reasoning (L01). Every quantity in this lesson is either a per-unit amount or a comparison of two totals.'),
      t(
        ['Concept', 'Formula', 'Reading'],
        [
          ['Contribution margin', '$p - v$', 'money per unit towards fixed cost'],
          ['Break-even quantity', '$Q_{BE} = F/(p - v)$', 'units needed to cover fixed cost'],
          ['Break-even revenue', '$p \\cdot Q_{BE}$', 'the turnover at that point'],
          ['Opportunity cost', 'best forgone alternative', 'a cost even when no invoice exists'],
          ['Elasticity (direction)', 'higher price ⇒ lower quantity', 'the *size* of the change needs the elasticity value'],
        ],
      ),
    ]),
    sec('core_knowledge', [
      p('**Break-even.** Total revenue equals total cost when $pQ = F + vQ$, which rearranges to:'),
      f('Q_{\\text{BE}} = \\frac{F}{p - v}, \\qquad \\text{contribution margin} = p - v > 0'),
      p('The condition $p > v$ is not cosmetic: with $p \\le v$ the margin is zero or negative and no quantity can ever cover the fixed cost. A common exam-style distractor is a "break-even quantity" computed from such data — recognising that it cannot exist is the correct answer.'),
      p('**Profit at a given quantity** is the margin times the units sold beyond break-even:'),
      f('\\text{Profit}(Q) = (p - v)\\,Q - F'),
      p('**Opportunity cost.** The true cost of a choice is the best *alternative* it rules out. Deciding to use a machine for product A means the profit from product B is part of the cost of A — even though no invoice shows it.'),
      p('**Demand response.** For most goods, raising the price lowers the quantity demanded. The relative change is governed by the price elasticity of demand $E$ (reported as a positive magnitude in most textbooks):'),
      f('\\text{quantity change } \\% \\approx -E \\cdot \\text{price change } \\%'),
      p('If $E > 1$, a price rise reduces revenue (the quantity effect dominates); if $E < 1$, revenue rises (the price effect dominates). **Real versus nominal** belongs to the same counting discipline: comparing amounts from different years requires deflating them by the price level.'),
    ]),
    sec('visual_intuition', [
      fig(
        {
          kind: 'line_chart',
          title: 'Revenue and total cost crossing at break-even',
          xLabel: 'units sold',
          yLabel: '€',
          x: [0, 100, 200, 300, 400],
          series: [
            { name: 'total cost (F = 6000, v = 20)', values: [6000, 8000, 10000, 12000, 14000], color: '#b45309' },
            { name: 'revenue (p = 50)', values: [0, 5000, 10000, 15000, 20000], color: '#2563eb' },
          ],
        },
        'Cost starts at the fixed cost and rises with slope v; revenue starts at zero and rises with slope p. Break-even is the crossing point — here at 200 units, because $6000/(50-20) = 200$.',
      ),
      intuition(
        'Every unit sold carries a small envelope of cash (the margin) towards a fixed wall of cost. Break-even is the moment the envelopes have paid for the wall; beyond it, every envelope is profit. This picture is why the numbers behave the way the formula says.',
      ),
    ]),
    sec('worked_example', [
      p('A café has fixed costs of €6 000 per month, sells a drink for €4,50 and pays €1,50 per drink in ingredients and staff time. It currently sells 1 800 drinks per month. What is the break-even quantity, the current profit, and what happens if it raises the price by 10 % in a month when the quantity falls by 15 %?'),
      steps([
        'Contribution margin: $p - v = 4{,}50 - 1{,}50 = 3{,}00$ € per drink.',
        'Break-even: $Q_{BE} = \\tfrac{6000}{3} = 2000$ drinks per month.',
        'Current result: $(3{,}00)(1800) - 6000 = 5400 - 6000 = -600$ € — a loss of 600 €.',
        'Price rise of 10 %: new price 4,95 €, margin 3,45 €. Quantity falls 15 %: $0{,}85 \\cdot 1800 = 1530$ drinks.',
        'New result: $(3{,}45)(1530) - 6000 = 5278{,}50 - 6000 = -721{,}50$ € — the loss *grows*.',
        'Interpretation: the price increase does not pay because the quantity is sensitive (elastic-ish) at this margin. This is exactly the "effect of a change" reasoning the official items use.',
      ]),
      mis('Computing break-even with the price instead of the margin.', 'Fixed costs are covered by the *contribution* per unit ($p - v$), not by the turnover per unit.'),
    ]),
    practice('guided_practice', [p('Break-even items: write margin, then divide. If the margin is not positive, stop and say so — that is the answer.')], ['C10.breakeven', 'C10.marginal'], [1, 2]),
    practice('independent_practice', [p('Opportunity cost and profit-at-quantity items. List the alternatives before computing; then convert the forgone benefit into a number.')], ['C10.opportunity', 'C10.marginal'], [2, 3]),
    practice('transfer', [p('Demand-response items and real-versus-nominal comparisons. Decide the *direction* first, then the size.')], ['C10.elasticity', 'C10.real'], [4, 5]),
    practice('dmat_style', [p('Exam-style business items that mix a table with a decision: a scenario, several plausible actions, and distractors built from ignoring a constraint or adding sunk costs.')], ['C10.breakeven', 'C10.opportunity', 'C10.elasticity'], [5, 6]),
    sec('trick_misconception', [
      mis('Ignoring the condition for break-even to exist.', 'With price ≤ variable cost there is no break-even quantity. Saying so is often the correct exam answer.'),
      mis('Treating a large fixed cost as a reason to continue.', 'Fixed costs are sunk once incurred. The question is whether the margin still contributes.'),
      mis('“A price rise always increases revenue.”', 'Only if demand is inelastic. Otherwise the quantity effect wins.'),
      mis('Comparing amounts from different years directly.', 'Deflate with the price level first; otherwise part of the "growth" is just the measuring stick changing.'),
    ]),
    practice(
      'mastery_check',
      [p('Mixed pool. Target 80 %, with the margin written explicitly in every break-even item and the direction stated before any elasticity computation.')],
      ['C10.opportunity', 'C10.marginal', 'C10.breakeven', 'C10.elasticity', 'C10.real'],
      [1, 2, 3, 4, 5, 6],
    ),
  ],
);
