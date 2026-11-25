import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, PASS, needsReview, passedLevel, progressKey, recordResult } from '../src/flowdot/progress.js';

const DAY = 24 * 60 * 60 * 1000;
const now = 100 * DAY;

test('recordResult guarda la mejor marca y la última', () => {
  let p = recordResult({}, 'lista', { ratio: 0.8 }, now);
  p = recordResult(p, 'lista', { ratio: 0.95 }, now + 1);
  assert.equal(p.levels.lista.best.ratio, 0.95);
  assert.equal(p.levels.lista.last.ratio, 0.95);
  p = recordResult(p, 'lista', { ratio: 0.5 }, now + 2);
  assert.equal(p.levels.lista.best.ratio, 0.95);
  assert.equal(p.levels.lista.last.ratio, 0.5);
  assert.equal(p.levels.lista.at, now + 2);
  assert.equal(p.lastLevel, 'lista');
  assert.deepEqual(LEVELS, ['lista', 'memoria', 'simulador']);
  assert.equal(PASS, 0.9);
});

test('recordResult en simulador: con la misma nota gana el menor tiempo', () => {
  let p = recordResult({}, 'simulador', { ratio: 1, score: 100, time: 90000 }, now);
  p = recordResult(p, 'simulador', { ratio: 1, score: 100, time: 60000 }, now);
  assert.equal(p.levels.simulador.best.time, 60000);
  p = recordResult(p, 'simulador', { ratio: 1, score: 100, time: 80000 }, now);
  assert.equal(p.levels.simulador.best.time, 60000);
});

test('passedLevel da el escalón más alto logrado', () => {
  let p = recordResult({}, 'lista', { ratio: 0.95 }, now);
  p = recordResult(p, 'memoria', { ratio: 0.7 }, now);
  assert.equal(passedLevel(p), 'lista');
  assert.equal(passedLevel({}), null);
  assert.equal(passedLevel(recordResult(p, 'simulador', { ratio: 0.9, score: 90, time: 1 }, now)), 'simulador');
});

test('needsReview: sin práctica, viejo o flojo', () => {
  assert.equal(needsReview(undefined, now, 5), true);
  assert.equal(needsReview(undefined, now, 0), false);
  const good = recordResult({}, 'memoria', { ratio: 0.95 }, now - DAY);
  assert.equal(needsReview(good, now, 5), false);
  assert.equal(needsReview(recordResult({}, 'memoria', { ratio: 0.95 }, now - 3 * DAY), now, 5), true);
  assert.equal(needsReview(recordResult(good, 'lista', { ratio: 0.5 }, now - 3600000), now, 5), true);
});

test('progressKey arma la clave de meta del flujo', () => {
  assert.equal(progressKey('f1'), 'progress:f1');
});
