import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chapters } from '../src/data/library-course.js';
import { getLibraryOrder } from '../src/data/library-nav.js';
import { lessonSlugs, legacyAnchorMap } from '../src/data/lesson-anchors.js';
import { parseParagraph, lessonDiagrams } from '../src/data/lesson-blocks.js';

const diagramSource = readFileSync(new URL('../src/components/StudyDiagram.astro', import.meta.url), 'utf8');
const drawn = new Set([...diagramSource.matchAll(/\{type === '([\w-]+)'/g)].map((m) => m[1]));
const block = (name) => diagramSource.slice(diagramSource.indexOf(`const ${name} = {`), diagramSource.indexOf('};', diagramSource.indexOf(`const ${name} = {`)));
const keys = (text) => new Set([...text.matchAll(/^ {2}'?([\w-]+)'?: /gm)].map((m) => m[1]));
const captioned = keys(block('captions'));
const titled = keys(block('title'));

test('cada capítulo tiene slugs de lección únicos', () => {
  for (const chapter of chapters) {
    const slugs = lessonSlugs(chapter.lessons);
    assert.equal(new Set(slugs).size, slugs.length, chapter.slug);
    slugs.forEach((slug) => assert.match(slug, /^[a-z0-9-]+$/));
  }
});

test('los enlaces viejos #leccion-N apuntan a una lección que existe', () => {
  for (const chapter of chapters) {
    const map = legacyAnchorMap(chapter);
    const slugs = lessonSlugs(chapter.lessons);
    Object.values(map).forEach((slug) => assert.ok(slugs.includes(slug), `${chapter.slug}: ${slug}`));
    Object.keys(map).forEach((anchor) => assert.ok(!slugs.includes(anchor), `${chapter.slug}: ${anchor} choca con un slug`));
  }
});

test('el orden de la biblioteca incluye cada capítulo una vez', () => {
  const order = getLibraryOrder();
  const ids = order.map((chapter) => chapter.id ?? chapter);
  assert.equal(new Set(ids).size, chapters.length);
});

test('cada diagrama usado tiene dibujo, título y pie', () => {
  for (const chapter of chapters) {
    for (const lesson of chapter.lessons) {
      for (const type of lessonDiagrams(lesson)) {
        assert.ok(drawn.has(type), `${chapter.slug} · ${lesson[0]}: falta el dibujo de ${type}`);
        assert.ok(captioned.has(type), `${type}: falta el pie`);
        assert.ok(titled.has(type), `${type}: falta el título`);
      }
    }
  }
});

test('tablas y listas se leen como tales', () => {
  assert.deepEqual(parseParagraph('TABLA: A | B\n1 | 2'), { kind: 'table', head: ['A', 'B'], rows: [['1', '2']] });
  assert.deepEqual(parseParagraph('Pasos:\n1. uno\n2. dos'), { kind: 'list', lead: 'Pasos:', ordered: true, items: ['uno', 'dos'] });
  assert.deepEqual(parseParagraph('- a\n- b'), { kind: 'list', lead: null, ordered: false, items: ['a', 'b'] });
  assert.equal(parseParagraph('Texto suelto.').kind, 'text');
  assert.throws(() => parseParagraph('TABLA: A | B\n1'));
  for (const chapter of chapters) {
    for (const lesson of chapter.lessons) lesson[1].split(/\n\n+/).forEach((paragraph) => parseParagraph(paragraph));
  }
});
