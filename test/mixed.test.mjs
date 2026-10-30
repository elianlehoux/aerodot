import test from 'node:test';
import assert from 'node:assert/strict';
import { hasUnmatchedMarker, splitMixed } from '../src/scripts/mixed.js';

test('splitMixed: sin marcas devuelve un solo trozo en español', () => {
  assert.deepEqual(splitMixed('Pedí que repitan.'), [{ text: 'Pedí que repitan.', en: false }]);
});

test('splitMixed: un par de asteriscos marca el inglés', () => {
  assert.deepEqual(splitMixed('Se dice *say again*.'), [
    { text: 'Se dice ', en: false },
    { text: 'say again', en: true },
    { text: '.', en: false },
  ]);
});

test('splitMixed: dos pares, también al principio y al final', () => {
  assert.deepEqual(splitMixed('*Roger* no es *wilco*'), [
    { text: 'Roger', en: true },
    { text: ' no es ', en: false },
    { text: 'wilco', en: true },
  ]);
});

test('splitMixed: un asterisco sin pareja queda como texto', () => {
  assert.deepEqual(splitMixed('Se dice *say again* y 5 * 3'), [
    { text: 'Se dice ', en: false },
    { text: 'say again', en: true },
    { text: ' y 5 * 3', en: false },
  ]);
  assert.deepEqual(splitMixed('a * b'), [{ text: 'a * b', en: false }]);
});

test('splitMixed: texto vacío o ausente no da trozos', () => {
  assert.deepEqual(splitMixed(''), []);
  assert.deepEqual(splitMixed(undefined), []);
});

test('hasUnmatchedMarker cuenta los asteriscos', () => {
  assert.equal(hasUnmatchedMarker('*a* y *b*'), false);
  assert.equal(hasUnmatchedMarker('sin marcas'), false);
  assert.equal(hasUnmatchedMarker('*a'), true);
});
