import test from 'node:test';
import assert from 'node:assert/strict';
import { formatRoute, parseRoute } from '../src/flowdot/route.js';

test('ida y vuelta de un flujo en repaso', () => {
  const route = { screen: 'flow', cabinId: 'a', flowId: 'b', mode: 'repasar' };
  assert.equal(formatRoute(route), '#c/a/f/b/repasar');
  assert.deepEqual(parseRoute(formatRoute(route)), route);
});

test('vacío, # solo y basura llevan a la lista', () => {
  for (const hash of ['', '#', '#basura', '#c/a']) assert.deepEqual(parseRoute(hash), { screen: 'list' });
  assert.equal(formatRoute({ screen: 'list' }), '#');
});

test('sin modo o con modo desconocido es editar', () => {
  assert.equal(parseRoute('#c/a/f/b').mode, 'editar');
  assert.equal(parseRoute('#c/a/f/b/volar').mode, 'editar');
});

test('ids con caracteres especiales sobreviven la ida y vuelta', () => {
  const route = { screen: 'flow', cabinId: 'a/b c', flowId: 'ñ', mode: 'mirar' };
  assert.deepEqual(parseRoute(formatRoute(route)), route);
});
