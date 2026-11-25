import test from 'node:test';
import assert from 'node:assert/strict';
import { bendFrom, classifyGesture, fitWithin, hitTest, routePath, routePoints, routeSegments, segmentAt, segmentMiddle, segmentsPath, shownSegments, toFraction, toScreen } from '../src/flowdot/geometry.js';

const plain = { scale: 1, tx: 0, ty: 0, width: 1000, height: 1000 };

test('toFraction y toScreen son inversas con zoom y desplazamiento', () => {
  const view = { scale: 1.75, tx: -120, ty: 40, width: 2560, height: 1707 };
  const { x, y } = toFraction(500, 300, view);
  const back = toScreen(x, y, view);
  assert.ok(Math.abs(back.px - 500) < 1e-9 && Math.abs(back.py - 300) < 1e-9);
});

test('toFraction: el centro de la imagen es 0,5 aunque haya zoom', () => {
  const view = { scale: 2, tx: 10, ty: 20, width: 400, height: 200 };
  assert.deepEqual(toFraction(410, 220, view), { x: 0.5, y: 0.5 });
});

test('hitTest: dos pasos dentro del radio, gana el más cercano', () => {
  const steps = [{ x: 0.1, y: 0.1 }, { x: 0.12, y: 0.1 }];
  assert.equal(hitTest(steps, 118, 100, plain), 1);
});

test('hitTest: el radio se mide en pantalla, no en la imagen', () => {
  const steps = [{ x: 0.5, y: 0.5 }];
  assert.equal(hitTest(steps, 527, 500, plain), 0);
  assert.equal(hitTest(steps, 529, 500, plain), -1);
  assert.equal(hitTest(steps, 1027, 1000, { ...plain, scale: 2 }), 0);
});

test('hitTest: sin pasos devuelve -1', () => {
  assert.equal(hitTest([], 10, 10, plain), -1);
});

test('classifyGesture: 9 px en 200 ms es toque; 10 px o 300 ms es arrastre', () => {
  assert.equal(classifyGesture(6, 6.9, 200), 'tap');
  assert.equal(classifyGesture(10, 0, 100), 'drag');
  assert.equal(classifyGesture(0, 0, 300), 'drag');
});

test('fitWithin: achica el lado mayor a 2560 y respeta la proporción', () => {
  assert.deepEqual(fitWithin(4032, 3024), { width: 2560, height: 1920 });
  assert.deepEqual(fitWithin(3024, 4032), { width: 1920, height: 2560 });
});

test('fitWithin: una foto chica no se agranda', () => {
  assert.deepEqual(fitWithin(1200, 800), { width: 1200, height: 800 });
});

test('routePath: vacío con menos de 2 puntos, empieza en el primero', () => {
  assert.equal(routePath([]), '');
  assert.equal(routePath([{ px: 1, py: 1 }]), '');
  const d = routePath([{ px: 10, py: 20 }, { px: 50, py: 60 }, { px: 90, py: 20 }]);
  assert.match(d, /^M10 20 C/);
  assert.equal((d.match(/C/g) || []).length, 2);
  assert.match(d, /90 20$/);
});

test('segmentMiddle: en una recta, la mitad y el ángulo de la recta', async () => {
  const { routeSegments, segmentMiddle } = await import('../src/flowdot/geometry.js');
  const [segment] = routeSegments([{ px: 0, py: 0 }, { px: 100, py: 0 }]);
  const middle = segmentMiddle(segment);
  assert.ok(Math.abs(middle.px - 50) < 1e-9 && Math.abs(middle.py) < 1e-9);
  assert.equal(middle.angle, 0);
});

test('routeSegments: con límites, la curva no sale de la imagen', async () => {
  const { routeSegments } = await import('../src/flowdot/geometry.js');
  // Tres puntos pegados al borde de arriba: sin límite, los controles quedan con y negativa.
  const points = [{ px: 100, py: 300 }, { px: 400, py: 5 }, { px: 700, py: 5 }, { px: 900, py: 300 }];
  const free = routeSegments(points).flat();
  assert.ok(free.some((p) => p.py < 0), 'sin límites la curva se sale');
  const bounded = routeSegments(points, { width: 1000, height: 600 }).flat();
  for (const p of bounded) {
    assert.ok(p.px >= 0 && p.px <= 1000 && p.py >= 0 && p.py <= 600, `${p.px},${p.py} fuera de la imagen`);
  }
});

const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

test('flecha arqueada: pasa por el puntito en su mitad, de un lado o del otro', () => {
  const up = segmentMiddle(routeSegments([{ px: 0, py: 0 }, { px: 100, py: 0, bend: 0.3 }])[0]);
  assert.ok(near(up.px, 50) && near(up.py, 30), JSON.stringify(up));
  const down = segmentMiddle(routeSegments([{ px: 0, py: 0 }, { px: 100, py: 0, bend: -0.3 }])[0]);
  assert.ok(near(down.px, 50) && near(down.py, -30), JSON.stringify(down));
});

test('flecha arqueada: la forma sigue al tramo cuando se mueve un paso', () => {
  const mid = segmentMiddle(routeSegments([{ px: 0, py: 0 }, { px: 0, py: 200, bend: 0.25 }])[0]);
  assert.ok(near(mid.px, -50) && near(mid.py, 100), JSON.stringify(mid));
});

test('bendFrom: el puntito da la curva y se recorta a 1', () => {
  const p1 = { px: 0, py: 0 };
  const p2 = { px: 100, py: 0 };
  assert.ok(near(bendFrom(p1, p2, { px: 50, py: 30 }), 0.3));
  assert.equal(bendFrom(p1, p2, { px: 50, py: 500 }), 1);
  assert.equal(bendFrom(p1, p2, { px: 50, py: -500 }), -1);
});

test('dos pasos en el mismo lugar: curva 0 y tramo sin NaN', () => {
  const p = { px: 10, py: 10 };
  assert.equal(bendFrom(p, p, { px: 40, py: 40 }), 0);
  const d = routePath([p, { ...p, bend: 0.5 }]);
  assert.doesNotMatch(d, /NaN/);
});

test('routePoints: la curva solo vale entre pasos seguidos', () => {
  const steps = [{ x: 0, y: 0 }, { x: 0.5, y: 0, bend: 0.2 }, { x: 1, y: 0, bend: 0.4 }];
  const all = routePoints(steps, 100, 100);
  assert.deepEqual(all.map((p) => p.bend), [undefined, 0.2, 0.4]);
  const gap = routePoints(steps, 100, 100, [0, 2]);
  assert.deepEqual(gap.map((p) => p.bend), [undefined, undefined]);
  assert.deepEqual(gap.map((p) => p.index), [0, 2]);
});

test('sin curvas, la ruta es la automática de siempre', () => {
  const points = [{ px: 0, py: 0 }, { px: 100, py: 50 }, { px: 200, py: 0 }];
  assert.equal(routePath(points), 'M0 0 C16.7 8.3 66.7 50 100 50 C133.3 50 183.3 8.3 200 0');
});

test('flecha arqueada contra el borde: los controles no salen de la foto', () => {
  const [[, c1, c2]] = routeSegments([{ px: 0, py: 5 }, { px: 100, py: 5, bend: -1 }], { width: 100, height: 100 });
  assert.ok(c1.py >= 0 && c2.py >= 0);
});

test('segmentAt: encuentra la flecha arqueada en su mitad y nada lejos', () => {
  const segments = routeSegments([{ px: 0, py: 0 }, { px: 100, py: 0, bend: 0.3 }, { px: 100, py: 100 }]);
  assert.equal(segmentAt(segments, 50, 30, 5), 0);
  assert.equal(segmentAt(segments, 100, 50, 10), 1);
  assert.equal(segmentAt(segments, 50, -40, 5), -1);
});

const zigzag = [{ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.2 }, { x: 0.3, y: 0.6 }, { x: 0.8, y: 0.9, bend: 0.2 }];

test('shownSegments con ahead: los tramos ya tienen la forma de la ruta completa', () => {
  const full = routeSegments(routePoints(zigzag, 1000, 1000), { width: 1000, height: 1000 });
  assert.deepEqual(shownSegments(zigzag, 1000, 1000, [0, 1, 2], 3), full.slice(0, 2));
  assert.deepEqual(shownSegments(zigzag, 1000, 1000, [0], 1), []);
});

test('shownSegments sin ahead, o con uno que no sirve, usa solo los pasos que se ven', () => {
  const own = routeSegments(routePoints(zigzag, 1000, 1000, [0, 1, 2]), { width: 1000, height: 1000 });
  assert.deepEqual(shownSegments(zigzag, 1000, 1000, [0, 1, 2]), own);
  assert.deepEqual(shownSegments(zigzag, 1000, 1000, [0, 1, 2], 2), own);
  assert.deepEqual(shownSegments(zigzag, 1000, 1000, [0, 1, 2], 9), own);
  assert.deepEqual(shownSegments(zigzag, 1000, 1000, undefined), routeSegments(routePoints(zigzag, 1000, 1000), { width: 1000, height: 1000 }));
});

test('segmentsPath dibuja los mismos tramos que routePath', () => {
  const points = routePoints(zigzag, 1000, 1000);
  assert.equal(segmentsPath(routeSegments(points)), routePath(points));
  assert.equal(segmentsPath([]), '');
});
