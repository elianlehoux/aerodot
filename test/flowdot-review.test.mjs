import test from 'node:test';
import assert from 'node:assert/strict';
import { choicesFor, createReview, criticalStepIds, gradeRun, reviewHint, reviewSummary, reviewTap } from '../src/flowdot/review.js';

const steps = [
  { id: 'id1', x: 0.1, y: 0.1, label: 'Uno' },
  { id: 'id2', x: 0.2, y: 0.2, label: 'Dos' },
  { id: 'id3', x: 0.3, y: 0.3, label: 'Tres' },
];

/** Toca el paso esperado (acierto) o uno que no es (error). */
const play = (state, moves) => moves.reduce((s, move) => {
  const target = move === 'hit' ? s.expectedIndex : (s.expectedIndex + 1) % steps.length;
  return reviewTap(s, move === 'miss-empty' ? -1 : target).state;
}, state);

test('acierto, error, acierto, acierto: 2 al primer intento y 1 error', () => {
  const state = play(createReview(steps, { mode: 'order' }), ['hit', 'miss', 'hit', 'hit']);
  assert.equal(state.done, true);
  assert.deepEqual(reviewSummary(state), { total: 3, firstTry: 2, errors: 1, hints: 0, missedStepIds: ['id2'] });
});

test('un error no avanza el paso', () => {
  const start = play(createReview(steps, { mode: 'order' }), ['hit']);
  const { state, result } = reviewTap(start, -1);
  assert.equal(result, 'miss');
  assert.equal(state.current, 1);
  assert.equal(state.expectedIndex, 1);
});

test('reviewTap devuelve hit al tocar el paso esperado', () => {
  const { result, state } = reviewTap(createReview(steps, { mode: 'order' }), 0);
  assert.equal(result, 'hit');
  assert.equal(state.current, 1);
});

test('la ayuda sube hasta 2 y se reinicia en el paso siguiente', () => {
  let state = createReview(steps, { mode: 'order' });
  state = reviewHint(reviewHint(state));
  assert.equal(state.hintLevel, 2);
  assert.equal(reviewHint(state).hintLevel, 2);
  state = reviewTap(state, 0).state;
  assert.equal(state.hintLevel, 0);
});

test('un paso con ayuda y sin error cuenta como ayuda y no como primer intento', () => {
  let state = createReview(steps, { mode: 'order' });
  state = reviewHint(state);
  state = play(state, ['hit', 'hit', 'hit']);
  assert.deepEqual(reviewSummary(state), { total: 3, firstTry: 2, errors: 0, hints: 1, missedStepIds: ['id1'] });
});

test('only repasa esos pasos en el orden original', () => {
  const state = createReview(steps, { mode: 'order', only: ['id3', 'id1'] });
  assert.equal(state.total, 2);
  assert.equal(state.expectedIndex, 0);
  assert.equal(reviewTap(state, 0).state.expectedIndex, 2);
});

test('dónde está mezcla el orden con los mismos pasos', () => {
  const random = () => 0;
  const state = createReview(steps, { mode: 'where', random });
  const order = [];
  let s = state;
  while (!s.done) {
    order.push(s.expectedIndex);
    s = reviewTap(s, s.expectedIndex).state;
  }
  assert.notDeepEqual(order, [0, 1, 2]);
  assert.deepEqual([...order].sort(), [0, 1, 2]);
});

test('un flujo sin pasos termina enseguida con todo en cero', () => {
  const state = createReview([], { mode: 'order' });
  assert.equal(state.done, true);
  assert.equal(state.total, 0);
  assert.deepEqual(reviewSummary(state), { total: 0, firstTry: 0, errors: 0, hints: 0, missedStepIds: [] });
  assert.equal(reviewTap(state, 0).state.done, true);
});

test('criticalStepIds da los críticos en orden y sirve como only', () => {
  const marked = [{ ...steps[0] }, { ...steps[1], critical: true }, { ...steps[2], critical: true }];
  assert.deepEqual(criticalStepIds(marked), ['id2', 'id3']);
  assert.deepEqual(criticalStepIds(steps), []);
  const state = createReview(marked, { mode: 'order', only: criticalStepIds(marked) });
  assert.equal(state.total, 2);
  assert.equal(state.expectedIndex, 1);
});

test('choicesFor: la correcta y hasta 3 distintas, sin vacías ni repetidas', () => {
  const options = choicesFor(['ON', 'OFF', 'SET', 'ON', '', '1+F', 'AUTO'], 'ON', () => 0);
  assert.equal(options.length, 4);
  assert.ok(options.includes('ON'));
  assert.equal(new Set(options).size, 4);
  assert.ok(!options.includes(''));
  assert.deepEqual(choicesFor(['ON', 'ON'], 'ON'), []);
  assert.deepEqual(choicesFor(['ON', 'OFF'], 'ON', () => 0.5).sort(), ['OFF', 'ON']);
});

test('gradeRun: en orden con la secuencia creciente más larga', () => {
  const run = gradeRun(5, [0, 1, 3, 2, 4]);
  assert.equal(run.inOrder, 4);
  assert.equal(run.outOfOrder.length, 1);
  assert.ok([2, 3].includes(run.outOfOrder[0]));
  assert.deepEqual(run.skipped, []);
  assert.equal(run.score, 80);
});

test('gradeRun: salteados, repetidos y toques sin control', () => {
  const run = gradeRun(4, [0, -1, 0, 2, 3]);
  assert.deepEqual(run.order, [0, 2, 3]);
  assert.deepEqual(run.skipped, [1]);
  assert.equal(run.stray, 1);
  assert.deepEqual(run.outOfOrder, []);
  assert.equal(run.score, 75);
  assert.equal(gradeRun(0, []).score, 0);
});
