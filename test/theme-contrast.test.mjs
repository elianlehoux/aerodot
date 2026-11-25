import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

function tokens(selector) {
  const start = css.indexOf(`${selector}{`);
  assert.notEqual(start, -1, `no existe el bloque ${selector}`);
  const block = css.slice(start, css.indexOf('}', start));
  const out = {};
  for (const [, name, hex] of block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{3,6})\b/g)) out[name] = hex;
  return out;
}

function luminance(hex) {
  const full = hex.length === 4 ? [...hex.slice(1)].map((c) => c + c).join('') : hex.slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const PAIRS = [
  ['ink', 'paper'], ['graphite', 'paper'], ['muted', 'paper'], ['ash', 'paper'], ['accent', 'paper'],
  ['ink', 'card'], ['muted', 'taupe'], ['ink', 'quiet'], ['action-text', 'action'], ['accent-ink', 'accent'],
];

const dark = tokens(':root');
const light = tokens('html[data-theme="light"]');

for (const [name, theme] of [['claro', light], ['oscuro', dark]]) {
  test(`tema ${name}: contraste AA`, () => {
    for (const [text, bg] of PAIRS) {
      assert.ok(theme[text] && theme[bg], `faltan --${text} o --${bg}`);
      const ratio = contrast(theme[text], theme[bg]);
      assert.ok(ratio >= 4.5, `--${text} sobre --${bg}: ${ratio.toFixed(2)}:1`);
    }
  });
}

test('los dos temas definen los tokens de la carta', () => {
  for (const theme of [light, dark]) {
    assert.ok(theme.relief, 'falta --relief');
    assert.ok(theme['chart-blue'], 'falta --chart-blue');
  }
});

test('los dos temas definen los mismos tokens de color', () => {
  assert.deepEqual(Object.keys(light).sort(), Object.keys(dark).sort());
});
