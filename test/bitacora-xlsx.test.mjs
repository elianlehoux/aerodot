import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateRawSync } from 'node:zlib';
import { readXlsx } from '../src/bitacora/xlsx.js';
import { guessMapping, rowsToFlights } from '../src/bitacora/csv.js';

/** Un zip mínimo, como el que escribe Excel: cabecera local, directorio central y fin de directorio. */
function zip(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const [name, text] of Object.entries(files)) {
    const nameBytes = Buffer.from(name);
    const raw = Buffer.from(text);
    const data = deflateRawSync(raw);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(8, 8);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    locals.push(local, nameBytes, data);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(8, 10);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBytes);
    offset += 30 + nameBytes.length + data.length;
  }
  const dir = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 8);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(dir.length, 12);
  end.writeUInt32LE(offset, 16);
  const all = Buffer.concat([...locals, dir, end]);
  return all.buffer.slice(all.byteOffset, all.byteOffset + all.length);
}

const book = zip({
  'xl/workbook.xml': '<workbook><sheets><sheet name="Libro" sheetId="1" r:id="rId1"/></sheets></workbook>',
  'xl/_rels/workbook.xml.rels': '<Relationships><Relationship Id="rId1" Type="worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
  'xl/sharedStrings.xml': '<sst><si><t>Fecha</t></si><si><t>Matrícula</t></si><si><t>Desde</t></si><si><t>Hasta</t></si><si><t>Total</t></si><si><t>Aterrizajes</t></si><si><r><t>LV-</t></r><r><t>ABC</t></r></si><si><t>SADF</t></si><si><t>Viento &amp; ráfagas</t></si><si><t>Observaciones</t></si></sst>',
  'xl/styles.xml': '<styleSheet><numFmts count="1"><numFmt numFmtId="164" formatCode="[h]:mm"/></numFmts><cellXfs count="3"><xf numFmtId="0"/><xf numFmtId="14" applyNumberFormat="1"/><xf numFmtId="164" applyNumberFormat="1"/></cellXfs></styleSheet>',
  'xl/worksheets/sheet1.xml': `<worksheet><sheetData>
    <row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c><c r="C1" t="s"><v>2</v></c><c r="D1" t="s"><v>3</v></c><c r="E1" t="s"><v>4</v></c><c r="F1" t="s"><v>5</v></c><c r="G1" t="s"><v>9</v></c></row>
    <row r="2"><c r="A2" s="1"><v>46327</v></c><c r="B2" t="s"><v>6</v></c><c r="C2" t="s"><v>7</v></c><c r="D2" t="inlineStr"><is><t>SADP</t></is></c><c r="E2" s="2"><v>0.0625</v></c><c r="F2"><v>2</v></c><c r="G2" t="s"><v>8</v></c></row>
    <row r="3"><c r="A3" s="1"><v>46328</v></c><c r="B3" t="s"><v>6</v></c><c r="E3" s="2"><v>1.25</v></c><c r="F3"><v>1</v></c></row>
    <row r="4"></row>
  </sheetData></worksheet>`,
});

test('readXlsx lee textos compartidos, fechas, horas y celdas salteadas', async () => {
  const rows = await readXlsx(book);
  assert.deepEqual(rows, [
    ['Fecha', 'Matrícula', 'Desde', 'Hasta', 'Total', 'Aterrizajes', 'Observaciones'],
    ['2026-11-01', 'LV-ABC', 'SADF', 'SADP', '1:30', '2', 'Viento & ráfagas'],
    ['2026-11-02', 'LV-ABC', '', '', '30:00', '1', ''],
  ]);
});

test('las filas del Excel se convierten en vuelos como las del CSV', async () => {
  const [header, ...body] = await readXlsx(book);
  const flights = rowsToFlights(body, guessMapping(header));
  assert.equal(flights[0].date, '2026-11-01');
  assert.equal(flights[0].total, 90);
  assert.equal(flights[0].landingsDay, 2);
  assert.equal(flights[1].total, 1800);
});

test('un archivo que no es Excel da un error claro', async () => {
  const text = new TextEncoder().encode('Fecha,Total\n1/1/2026,1:00');
  await assert.rejects(readXlsx(text.buffer), /no es un Excel/);
});

test('el Excel exportado se vuelve a leer con los mismos vuelos', async () => {
  const { flightsToXlsx } = await import('../src/bitacora/xlsx-write.js');
  const original = [
    { date: '2026-11-01', reg: 'LV-ABC', type: 'C152', from: 'SADF', to: 'SADP', dep: '10:00', arr: '11:30', total: 90, role: 'pic', night: 0, ifr: 0, hood: 30, sim: false, landingsDay: 2, landingsNight: 0, remarks: 'Viento <fuerte> & "ráfagas"' },
    { date: '2026-11-02', reg: '', type: 'FTD', from: '', to: '', dep: '', arr: '', total: 1815, role: 'dual', night: 0, ifr: 0, hood: 60, sim: true, landingsDay: 0, landingsNight: 0, remarks: '' },
  ];
  const blob = flightsToXlsx(original);
  const [header, ...body] = await readXlsx(await blob.arrayBuffer());
  const flights = rowsToFlights(body, guessMapping(header));
  assert.equal(flights.length, 2);
  assert.equal(flights[0].date, '2026-11-01');
  assert.equal(flights[0].total, 90);
  assert.equal(flights[0].hood, 30);
  assert.equal(flights[0].remarks, 'Viento <fuerte> & "ráfagas"');
  assert.equal(flights[1].total, 1815);
  assert.equal(flights[1].sim, true);
  assert.equal(flights[1].role, 'dual');
});
