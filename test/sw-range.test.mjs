import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const scope = {};
vm.runInNewContext(readFileSync(new URL('../public/sw-range.js', import.meta.url), 'utf8'), { self: scope, Response });
const { rangeResponse } = scope;

const cached = () => new Response(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), { headers: { 'Content-Type': 'audio/mpeg' } });
const req = (range) => ({ headers: new Headers(range ? { Range: range } : {}) });
const bytes = async (res) => [...new Uint8Array(await res.arrayBuffer())];

test('sin Range devuelve el cuerpo completo', async () => {
  const res = await rangeResponse(req(), cached());
  assert.equal(res.status, 200);
  assert.equal((await bytes(res)).length, 10);
});

test('bytes=2-5 devuelve 206 con ese tramo', async () => {
  const res = await rangeResponse(req('bytes=2-5'), cached());
  assert.equal(res.status, 206);
  assert.deepEqual(await bytes(res), [2, 3, 4, 5]);
  assert.equal(res.headers.get('Content-Range'), 'bytes 2-5/10');
  assert.equal(res.headers.get('Content-Length'), '4');
});

test('bytes=4- llega hasta el final y bytes=0-1 es el comienzo', async () => {
  assert.deepEqual(await bytes(await rangeResponse(req('bytes=4-'), cached())), [4, 5, 6, 7, 8, 9]);
  assert.deepEqual(await bytes(await rangeResponse(req('bytes=0-1'), cached())), [0, 1]);
});

test('sufijo bytes=-3 devuelve los últimos 3 y uno mayor al total devuelve todo', async () => {
  assert.deepEqual(await bytes(await rangeResponse(req('bytes=-3'), cached())), [7, 8, 9]);
  assert.equal((await bytes(await rangeResponse(req('bytes=-500'), cached()))).length, 10);
});

test('un fin mayor al tamaño se recorta y un inicio fuera de rango da 416', async () => {
  assert.deepEqual(await bytes(await rangeResponse(req('bytes=8-99'), cached())), [8, 9]);
  const res = await rangeResponse(req('bytes=50-60'), cached());
  assert.equal(res.status, 416);
  assert.equal(res.headers.get('Content-Range'), 'bytes */10');
});

test('una cabecera ilegible se ignora', async () => {
  assert.equal((await rangeResponse(req('items=1-2'), cached())).status, 200);
});

test('bytes=0-0 devuelve solo el primer byte', async () => {
  const res = await rangeResponse(req('bytes=0-0'), cached());
  assert.equal(res.status, 206);
  assert.deepEqual(await bytes(res), [0]);
  assert.equal(res.headers.get('Content-Range'), 'bytes 0-0/10');
});

test('rangos insatisfacibles dan 416: bytes=-0, bytes=10- y bytes=5-2', async () => {
  for (const range of ['bytes=-0', 'bytes=10-', 'bytes=5-2']) {
    const res = await rangeResponse(req(range), cached());
    assert.equal(res.status, 416, range);
    assert.equal(res.headers.get('Content-Range'), 'bytes */10', range);
  }
});

test('Range vacío o múltiple devuelve el cuerpo completo sin fallar', async () => {
  for (const range of ['', 'bytes=-', 'bytes=0-1,4-5']) {
    const res = await rangeResponse({ headers: new Headers({ Range: range }) }, cached());
    assert.equal(res.status, 200, range);
    assert.equal((await bytes(res)).length, 10, range);
  }
});

test('sin Content-Type guardado usa audio/mpeg', async () => {
  const bare = new Response(new Uint8Array([0, 1, 2, 3]));
  bare.headers.delete('Content-Type');
  const res = await rangeResponse(req('bytes=1-2'), bare);
  assert.equal(res.status, 206);
  assert.equal(res.headers.get('Content-Type'), 'audio/mpeg');
  assert.deepEqual(await bytes(res), [1, 2]);
});

test('la unidad del rango no distingue mayúsculas', async () => {
  const res = await rangeResponse(req('Bytes=2-3'), cached());
  assert.equal(res.status, 206);
  assert.deepEqual(await bytes(res), [2, 3]);
});
