/**
 * Arma public/flowdot/ejemplo-boeing-737.flowdot: la cabina de ejemplo de Flowdot con dos flujos.
 * Foto: "Boeing 737-300 Cockpit", Weatherhistory, CC0 (dominio público), en Wikimedia Commons:
 * https://commons.wikimedia.org/wiki/File:Boeing_737-300_Cockpit.jpg
 * La foto está en scripts/flowdot-ejemplo/boeing-737-300.webp, achicada a 2560 px y sin metadatos.
 * Las posiciones son fracciones de la foto, medidas sobre una grilla; cada control está identificado a la vista.
 * Correr: node scripts/build-flowdot-example.mjs
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { exportFlowdot } from '../src/flowdot/file.js';

const step = (id, label, x, y) => ({ id, label, x, y });

const cabin = {
  id: 'ejemplo-boeing-737',
  name: 'Boeing 737-300 (ejemplo)',
  image: { blob: new Blob([await readFile(new URL('./flowdot-ejemplo/boeing-737-300.webp', import.meta.url))], { type: 'image/webp' }), type: 'image/webp', width: 2560, height: 2380 },
};

const flows = [
  {
    id: 'ejemplo-instrumentos-capitan',
    name: 'Instrumentos del capitán',
    steps: [
      step('ejemplo-1-1', 'Velocímetro', 0.101, 0.2),
      step('ejemplo-1-2', 'Horizonte artificial (EADI)', 0.184, 0.185),
      step('ejemplo-1-3', 'Altímetro', 0.259, 0.2),
      step('ejemplo-1-4', 'Variómetro', 0.264, 0.26),
      step('ejemplo-1-5', 'Indicador de situación horizontal (EHSI)', 0.19, 0.287),
      step('ejemplo-1-6', 'Horizonte de reserva', 0.379, 0.178),
    ],
  },
  {
    id: 'ejemplo-antes-del-despegue',
    name: 'Antes del despegue (práctica)',
    steps: [
      step('ejemplo-2-1', 'Flaps, posición de despegue', 0.585, 0.37),
      step('ejemplo-2-2', 'Speedbrake, abajo', 0.425, 0.36),
      step('ejemplo-2-3', 'Compensador, unidades de despegue', 0.395, 0.545),
      step('ejemplo-2-4', 'MCP, velocidad V2', 0.411, 0.022),
      step('ejemplo-2-5', 'MCP, rumbo de la pista', 0.461, 0.022),
      step('ejemplo-2-6', 'MCP, altitud autorizada', 0.518, 0.022),
      step('ejemplo-2-7', 'Palancas de empuje, listas', 0.5, 0.42),
    ],
  },
];

const text = await exportFlowdot([{ cabin, flows }], new Date('2026-11-16T12:00:00Z'));
await mkdir(new URL('../public/flowdot/', import.meta.url), { recursive: true });
await writeFile(new URL('../public/flowdot/ejemplo-boeing-737.flowdot', import.meta.url), text);
console.log(`ejemplo-boeing-737.flowdot: ${(text.length / 1024).toFixed(0)} KB`);
