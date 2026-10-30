/**
 * Genera los ATIS grabados: voz del sistema (macOS `say`) con efecto de radio (ffmpeg).
 * Salida: public/audio/atis/atis-N.mp3 y src/data/atis-recorded.json (texto, datos y tiempos).
 * Se corre a mano cuando se quiere cambiar la tanda: node scripts/build-atis-audio.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { atisLines, makeAtis, seeded } from '../src/data/atis.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(root, 'public/audio/atis');
const work = mkdtempSync(join(tmpdir(), 'atis-'));
mkdirSync(outDir, { recursive: true });

// Voces del sistema y velocidad (palabras por minuto): un ATIS real se lee parejo y rápido.
const VOICES = [
  { name: 'Daniel', rate: 150 },
  { name: 'Samantha', rate: 155 },
  { name: 'Karen', rate: 150 },
  { name: 'Reed', rate: 150 },
  { name: 'Moira', rate: 150 },
  { name: 'Daniel', rate: 175 },
  { name: 'Samantha', rate: 175 },
  { name: 'Karen', rate: 175 },
];
const PAUSE = 0.55;
const LEAD = 0.5;
const SOUND = { three: 'tree', four: 'fower', five: 'fife', nine: 'niner' };
const forVoice = (text) => text
  .replace(/\bQNH\b/g, 'Q N H')
  .replace(/\bCAVOK\b/g, 'cav oh kay')
  .replace(/\b(three|four|five|nine)\b/gi, (word) => SOUND[word.toLowerCase()]);

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const duration = (file) => Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file]).trim());

const items = [];
VOICES.forEach((voice, index) => {
  const id = index + 1;
  const atis = makeAtis(seeded(Math.imul(id, 2654435761) + 12345));
  const lines = atisLines(atis);
  const files = [];
  const cues = [];
  let cursor = LEAD;
  lines.forEach((line, position) => {
    const file = join(work, `${id}-${position}.aiff`);
    run('say', ['-v', voice.name, '-r', String(voice.rate), '-o', file, forVoice(line.text)]);
    const length = duration(file);
    cues.push([Number(cursor.toFixed(2)), Number((cursor + length).toFixed(2))]);
    cursor += length + PAUSE;
    files.push(file);
  });
  // Concatena con silencios y le pone encima el efecto de radio.
  const inputs = [];
  const filters = [];
  inputs.push('-f', 'lavfi', '-t', String(LEAD), '-i', 'anullsrc=r=22050:cl=mono');
  filters.push('[0:a]aformat=sample_rates=22050:channel_layouts=mono[s0]');
  let label = 1;
  const order = ['[s0]'];
  files.forEach((file, position) => {
    inputs.push('-i', file);
    filters.push(`[${label}:a]aformat=sample_rates=22050:channel_layouts=mono[v${position}]`);
    order.push(`[v${position}]`);
    label += 1;
    inputs.push('-f', 'lavfi', '-t', String(PAUSE), '-i', 'anullsrc=r=22050:cl=mono');
    filters.push(`[${label}:a]aformat=sample_rates=22050:channel_layouts=mono[p${position}]`);
    order.push(`[p${position}]`);
    label += 1;
  });
  filters.push(`${order.join('')}concat=n=${order.length}:v=0:a=1,highpass=f=380,lowpass=f=2800,acompressor=threshold=-20dB:ratio=6:makeup=4,volume=1.4[voice]`);
  inputs.push('-f', 'lavfi', '-i', 'anoisesrc=color=pink:amplitude=0.012:r=22050');
  filters.push(`[${label}:a]highpass=f=300,lowpass=f=2800[noise]`);
  filters.push('[voice][noise]amix=inputs=2:duration=first:normalize=0[out]');
  const mixed = join(work, `${id}.wav`);
  const target = join(outDir, `atis-${id}.mp3`);
  run('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', filters.join(';'), '-map', '[out]', '-ac', '1', '-ar', '22050', mixed]);
  run('ffmpeg', ['-y', '-v', 'error', '-i', mixed, '-b:a', '48k', target]);
  items.push({ id, src: `/audio/atis/atis-${id}.mp3`, voice: voice.name, duration: Number(duration(target).toFixed(1)), atis, cues });
  console.log(`atis-${id}: ${voice.name} ${voice.rate} wpm, ${duration(target).toFixed(1)} s, ${atis.name} ${lines[0].value}`);
});

writeFileSync(join(root, 'src/data/atis-recorded.json'), `${JSON.stringify({ items }, null, 2)}\n`);
rmSync(work, { recursive: true, force: true });
