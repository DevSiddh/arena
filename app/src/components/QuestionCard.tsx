import { useMemo, useState } from 'react';
import type { Evaluation, Question, Stimulus } from '../../../engine/types';
import { ACTIVITY_TEXT, SCENE, SKILL_TEXT } from '../../../engine/types';
import type { AttemptEvidence } from '../../../engine/evidence';
import { evidenceFromAttempt } from '../../../engine/evidence';
import { FigureView } from './FigureView';
import { MathBlock, RichText } from './Rich';

/**
 * One item in *training* mode.
 *
 * Training and exam behaviour are intentionally different implementations:
 *   - here the student may reveal staged hints, is told immediately whether the answer is right,
 *     reads the full explanation and can retry once; every hint and retry is recorded in the
 *     evidence so mastery stays honest.
 *   - exam mode uses `ExamView`, which renders no hints, no difficulty and no feedback, and
 *     reveals explanations only after submission.
 */
export function QuestionCard({
  question,
  mode = 'training',
  passage,
  onComplete,
  index,
  total,
}: {
  question: Question;
  mode?: 'training' | 'review';
  passage?: Stimulus;
  onComplete: (evidence: AttemptEvidence, correct: boolean) => void;
  index?: number;
  total?: number;
}): JSX.Element {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [spentMs, setSpentMs] = useState(0);

  const correct = selected !== null && selected === question.correctIndex;
  const retryAllowed = mode === 'training' && checked && !correct && wrongAttempts === 0;
  const finished = checked && (correct || !retryAllowed);

  const activity = question.evaluation?.activity ?? inferActivity(question);
  const skill = question.evaluation?.skill;

  const submit = () => {
    if (selected === null) return;
    setChecked(true);
    if (selected !== question.correctIndex) setWrongAttempts((n) => n + 1);
    setSpentMs(Date.now() - startedAt);
  };

  const finish = (retried: boolean) => {
    const ms = spentMs || Date.now() - startedAt;
    const evidence = evidenceFromAttempt(question, selected, ms, 'training', {
      usedHints: hintsShown,
      retried,
    });
    onComplete(evidence, selected === question.correctIndex);
    setSelected(null);
    setChecked(false);
    setHintsShown(0);
    setWrongAttempts(0);
    setSpentMs(0);
  };

  const explanation = question.explanation;
  const distractorOrder = useMemo(
    () => question.options.map((o, i) => ({ o, i })).filter(({ i }) => i !== question.correctIndex),
    [question],
  );

  return (
    <div className="card" data-item-id={question.id}>
      <div className="spread" style={{ marginBottom: 8 }}>
        <div className="row" style={{ gap: 6 }}>
          {typeof index === 'number' ? (
            <span className="badge">
              item {index + 1}
              {total ? ` of ${total}` : ''}
            </span>
          ) : null}
          <span className="badge official">{ACTIVITY_TEXT[activity]}</span>
          {skill ? <span className="badge">{SKILL_TEXT[skill]}</span> : null}
          {question.evaluation?.scene ? <span className="badge prereq">{SCENE[question.evaluation.scene]}</span> : null}
        </div>
        <span className="faint" style={{ fontSize: '0.8rem' }}>
          {question.id}
        </span>
      </div>

      {passage ? (
        <div className="passage">
          <strong>{passage.title}</strong>
          <RichText text={passage.body} />
          {passage.figure ? <FigureView figure={passage.figure} /> : null}
        </div>
      ) : null}

      <RichText text={question.stem} className="q-stem" />
      {question.figure ? (
        <div className="q-figure">
          <FigureView figure={question.figure} />
        </div>
      ) : null}

      <div className="options" role="radiogroup" aria-label="answer options">
        {question.options.map((o, i) => {
          const state = !checked
            ? selected === i
              ? 'selected'
              : ''
            : i === question.correctIndex
              ? 'correct'
              : selected === i
                ? 'wrong'
                : '';
          return (
            <button key={i} className={`option ${state}`} onClick={() => (!checked || retryAllowed) && setSelected(i)} disabled={checked && !retryAllowed}>
              <span className="key">{String.fromCharCode(65 + i)}</span>
              <span>
                <RichText text={o.text} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="row" style={{ marginTop: 8 }}>
        {!checked ? (
          <button className="btn" onClick={submit} disabled={selected === null}>
            Check answer
          </button>
        ) : retryAllowed ? (
          <button
            className="btn ghost"
            onClick={() => {
              setChecked(false);
              setSelected(null);
            }}
          >
            Try again
          </button>
        ) : (
          <button className="btn" onClick={() => finish(wrongAttempts > 0 && correct)}>
            Next
          </button>
        )}
        {mode === 'training' && !checked && hintsShown < question.explanation.steps.length ? (
          <button className="btn ghost small" onClick={() => setHintsShown((n) => n + 1)}>
            Reveal hint {hintsShown + 1}
          </button>
        ) : null}
        {answered_is_assisted(hintsShown, wrongAttempts) ? (
          <span className="badge warn">assisted — counts for less in the mastery estimate</span>
        ) : null}
      </div>

      {hintsShown > 0 ? (
        <div className="feedback" style={{ borderColor: '#d8a339' }}>
          <strong>Hints</strong>
          <ol>
            {question.hints.slice(0, hintsShown).map((h, i) => (
              <li key={i}>
                <RichText text={h} />
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {checked ? (
        <div className={`feedback ${correct ? 'ok' : 'bad'}`}>
          <strong>{correct ? 'Correct.' : retryAllowed ? 'Not yet — one retry is allowed.' : 'Incorrect.'}</strong>{' '}
          {correct ? 'Your reasoning matched the key.' : 'Read the explanation, then move on; the concept stays in the review queue.'}
          {!correct && selected !== null ? (
            <div className="muted" style={{ marginTop: 4 }}>
              Your option was built on: <em>{question.options[selected].errorTag.replace(/_/g, ' ')}</em>
            </div>
          ) : null}

          <div className="explain">
            <h4>What was tested</h4>
            <RichText text={explanation.testing} />
            <h4>What mattered</h4>
            <RichText text={explanation.matters} />
            {explanation.irrelevant ? (
              <>
                <h4>What was irrelevant (and why)</h4>
                <RichText text={explanation.irrelevant} />
              </>
            ) : null}
            <h4>Concept and why it applies</h4>
            <RichText text={`${explanation.concept} ${explanation.why}`} />
            <h4>Step by step</h4>
            <ol>
              {explanation.steps.map((s, i) => (
                <li key={i}>
                  <RichText text={s} />
                </li>
              ))}
            </ol>
            <h4>Why the other options fail</h4>
            {distractorOrder.map(({ o, i }) => (
              <div className="distractor" key={i}>
                <strong>{String.fromCharCode(65 + i)}.</strong> <RichText text={o.text} />{' '}
                <span className="faint">({o.errorTag.replace(/_/g, ' ')})</span>
                <div className="muted">
                  <RichText text={o.rationale} />
                </div>
              </div>
            ))}
            <div className="trap">
              <strong>Common trap.</strong> <RichText text={explanation.trap} />
            </div>
            <h4>What transfers</h4>
            <RichText text={explanation.transfer} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function answered_is_assisted(hints: number, wrong: number): boolean {
  return hints > 0 || wrong > 0;
}

function inferActivity(q: Question): NonNullable<Evaluation['activity']> {
  if (q.style === 'graph_choice' || q.figure) return 'graph_interpretation';
  if (q.style === 'critique_reasoning') return 'argumentation';
  if (q.style === 'effect_direction') return 'model_assessment';
  if (q.options.some((o) => o.text.includes('$')) || q.tags.includes('numeric')) return 'calculation';
  return 'analysis';
}

