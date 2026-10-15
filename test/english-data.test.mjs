import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { englishNeighbors, englishPhases, englishReadySlugs, englishSections, englishTopics } from '../src/data/english.js';

const root = new URL('../', import.meta.url);
const withHref = englishSections.filter((section) => section.href);

test('las fases son los seis pasos del recorrido, en orden', () => {
  assert.deepEqual(englishPhases.map((phase) => phase.id), ['base', 'comunicaciones', 'emergencias', 'anormal', 'comunicarla', 'historia']);
  assert.deepEqual(englishPhases.map((phase) => phase.step), [1, 2, 3, 4, 5, 6]);
  for (const phase of englishPhases) {
    assert.ok(phase.title, `${phase.id} sin título`);
    assert.ok(phase.lede, `${phase.id} sin lede`);
  }
});

test('toda sección tiene fase, título y bajada, y no tiene roles', () => {
  const ids = new Set(englishPhases.map((phase) => phase.id));
  for (const section of englishSections) {
    assert.ok(ids.has(section.phase), `fase inexistente: ${section.phase}`);
    assert.ok(section.title?.trim(), 'sección sin título');
    assert.ok(section.blurb?.trim(), `${section.title} sin bajada`);
    assert.equal('roles' in section, false, `${section.title} todavía tiene roles`);
  }
});

test('las secciones hechas tienen slug y su href es /ingles/<slug>; los slugs no se repiten', () => {
  for (const section of withHref) {
    assert.ok(section.slug, `${section.title} tiene href pero no slug`);
    assert.equal(section.href, `/ingles/${section.slug}`);
  }
  const slugs = englishSections.filter((section) => section.slug).map((section) => section.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('cada href tiene su página', () => {
  for (const section of withHref) {
    assert.ok(existsSync(new URL(`src/pages/ingles/${section.slug}.astro`, root)), `falta la página de ${section.slug}`);
  }
});

test('cada href está en precachePages', () => {
  const config = readFileSync(new URL('astro.config.mjs', root), 'utf8');
  for (const section of withHref) {
    assert.ok(config.includes(`'${section.href}'`), `${section.href} no está en precachePages`);
  }
});

test('englishNeighbors sigue el orden de englishTopics', () => {
  assert.ok(englishTopics.length > 1);
  const first = englishTopics[0];
  const last = englishTopics.at(-1);
  assert.equal(englishNeighbors(first.slug).previous, null);
  assert.equal(englishNeighbors(first.slug).next, englishTopics[1]);
  assert.equal(englishNeighbors(last.slug).next, null);
  assert.equal(englishNeighbors(last.slug).previous, englishTopics.at(-2));
});

test('englishReadySlugs son los slugs de englishTopics', () => {
  assert.deepEqual(englishReadySlugs, englishTopics.map((topic) => topic.slug));
});

test('Comunicaciones anuncia lo que falta después del circuito: en ruta y aproximación, y falla de comunicaciones', () => {
  const soon = englishSections.filter((section) => section.phase === 'comunicaciones' && !section.href).map((section) => section.title);
  assert.deepEqual(soon, ['En ruta y aproximación', 'Falla de comunicaciones']);
});
