import test from 'node:test';
import assert from 'node:assert/strict';
import { placeCard } from '../src/flowdot/screens/step-card.js';

const stage = { width: 800, height: 600 };
const card = { width: 260, height: 220 };

test('placeCard: un paso a la izquierda abre la tarjeta a su derecha', () => {
  const at = placeCard({ x: 100, y: 300 }, card, stage);
  assert.equal(at.side, 'right');
  assert.ok(at.left > 100);
  assert.equal(at.top, 300 - 110);
});

test('placeCard: un paso a la derecha la abre a su izquierda', () => {
  const at = placeCard({ x: 700, y: 300 }, card, stage);
  assert.equal(at.side, 'left');
  assert.ok(at.left + card.width < 700);
});

test('placeCard: nunca sale del escenario, ni arriba ni abajo', () => {
  for (const anchor of [{ x: 10, y: 5 }, { x: 790, y: 595 }, { x: 400, y: -50 }]) {
    const at = placeCard(anchor, card, stage);
    assert.ok(at.left >= 12 && at.left + card.width <= stage.width - 12, JSON.stringify(at));
    assert.ok(at.top >= 12 && at.top + card.height <= stage.height - 12, JSON.stringify(at));
  }
});

test('placeCard: con rx deja libre el ancho de lo marcado (una flecha)', () => {
  const at = placeCard({ x: 200, y: 300, rx: 80 }, card, stage);
  assert.equal(at.side, 'right');
  assert.ok(at.left >= 280 + 18);
  const left = placeCard({ x: 600, y: 300, rx: 80 }, card, stage);
  assert.ok(left.left + card.width <= 520 - 18);
});
