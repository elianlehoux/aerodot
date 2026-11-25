/**
 * Editor de un flujo sobre su cabina, con tres modos: Editar (tocar para agregar pasos),
 * Mirar (la ruta se dibuja sola) y Repasar (en escalones: con la lista, de memoria y simulador).
 */
import { MAX_STEPS, addStep, bendStep, createHistory, editStep, moveStep, removeStep, reorderStep } from '../flow.js';
import { addChecklist, addPending, editChecklistItem, placePending, removeChecklistItem, removePending } from '../checklist.js';
import { askPaste } from './paste.js';
import { showGuide } from './guide.js';
import { HIT_RADIUS, bendFrom, hitTest, routePoints, segmentAt, segmentMiddle, shownSegments, toFraction, toScreen } from '../geometry.js';
import { choicesFor, createReview, criticalStepIds, gradeRun, reviewHint, reviewSummary, reviewTap } from '../review.js';
import { LEVELS, LEVEL_HINTS, LEVEL_LABELS, PASS, progressKey, recordResult } from '../progress.js';
import { createAutosave } from '../autosave.js';
import { createViewport } from '../viewport.js';
import { createOverlay } from '../overlay.js';
import { UNNAMED_CABIN, newFlow, pickCabinImage } from './list.js';
import { ask, askText, button, h, icon, menu, toast } from '../ui.js';
import { createNoteCard, createStepCard, placeCard } from './step-card.js';
import { MAX_NOTES, MAX_NOTE_TEXT, addNote, arrowPartAt, arrowSegment, noteAnchor, noteAt, removeNote, updateNote } from '../notes.js';

const SPEEDS = { lenta: 1400, normal: 800, rapida: 400 };
const MODE_LABELS = { editar: 'Editar', mirar: 'Mirar', repasar: 'Repasar' };
const DOUBLE_TAP = 350;

export async function mountEditor(root, ctx, route) {
  const { store, go, io, track } = ctx;
  const [cabin, stored] = await Promise.all([store.getCabin(route.cabinId), store.getFlow(route.flowId)]);
  if (!cabin || !stored || stored.cabinId !== cabin.id) {
    toast('Ese flujo ya no está en este dispositivo.');
    go({ screen: 'list' });
    return { unmount() {} };
  }

  let mode = route.mode;
  let selected = null;
  let dragFlow = null;
  // Flechas: `hover` es el tramo bajo el mouse (o el de la fila de la lista), `bendDrag` el que se arrastra.
  // El tramo k une el paso k con el k + 1, y su curva se guarda en el paso k + 1.
  let hover = -1;
  let bendDrag = -1;
  let lastHandleTap = null;
  // La tarjeta del paso marcado: abierta en Editar hasta Listo, Esc o cambiar de modo.
  let cardOpen = false;
  // Anotar: la marca elegida, la colocación en curso ({ type, start? }) y el arrastre de una marca.
  let selectedNote = null;
  let placing = null;
  let noteDrag = null;
  let lastNoteTap = null;
  // Ubicar: los pasos pegados se ponen de a uno tocando la foto. `from` es cuántos pasos había al empezar.
  let locating = null;
  let saveWarned = false;
  const history = createHistory(stored);
  const flow = () => dragFlow ?? history.current();
  const notes = () => flow().notes ?? [];
  const autosave = createAutosave((value) => store.putFlow(value), 400, () => {
    if (saveWarned) return;
    saveWarned = true;
    toast('No se pudo guardar en este dispositivo. No cierres esta pantalla y exportá el flujo desde el panel.');
  });

  // Estructura
  const imageUrl = URL.createObjectURL(cabin.image.blob);
  const img = h('img', { class: 'fd-photo', src: imageUrl, alt: `Cabina ${cabin.name}`, draggable: 'false' });
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'fd-overlay');
  svg.setAttribute('aria-hidden', 'true');
  const content = h('div', { class: 'fd-content' }, img, svg);
  const live = h('p', { class: 'fd-visually-hidden', 'aria-live': 'assertive' });
  const modeBar = h('div', { class: 'fd-modebar' });
  const tool = (name, label, onclick) => h('button', { type: 'button', class: 'fd-tool', 'aria-label': label, title: label, onclick }, icon(name));
  const undoButton = tool('undo', 'Deshacer', () => { settleEditing(); history.undo(); autosave.schedule(history.current()); renderAll(); });
  const redoButton = tool('redo', 'Rehacer', () => { settleEditing(); history.redo(); autosave.schedule(history.current()); renderAll(); });
  const historyTools = h('div', { class: 'fd-tools-group' }, undoButton, redoButton);
  const noteMenu = menu('Anotar', [
    { label: 'Flecha', hint: 'Señala algo sin sumar un paso. Tocá inicio y fin.', action: () => startPlacing('arrow') },
    { label: 'Etiqueta de zona', hint: 'Nombra una parte: Overhead, Pedestal.', action: () => startPlacing('label') },
  ], { text: [icon('pen'), h('span', { class: 'fd-note-label', text: 'Anotar' })], up: true });
  const noteTools = h('div', { class: 'fd-tools-group' }, noteMenu);
  const tools = h('div', { class: 'fd-tools' },
    noteTools,
    historyTools,
    h('div', { class: 'fd-tools-group' },
      tool('minus', 'Alejar', () => viewport.zoomBy(1 / 1.4)),
      tool('plus', 'Acercar', () => viewport.zoomBy(1.4)),
      tool('fit', 'Ver la cabina entera', () => viewport.fit())));
  const stage = h('div', { class: 'fd-stage' }, content, modeBar, tools, live);
  const list = h('ol', { class: 'fd-steps' });
  const panelToggle = h('button', { type: 'button', class: 'fd-panel-toggle', 'aria-expanded': 'false' });
  let showRoute = true;
  async function renameFlow() {
    const name = await askText({ title: 'Nombre del flujo', value: flow().name, label: 'Nombre del flujo' });
    if (name) commit({ ...history.current(), name, updatedAt: Date.now() });
  }
  async function renameCabin() {
    const name = await askText({ title: 'Nombre de la cabina', value: cabin.name === UNNAMED_CABIN ? '' : cabin.name, label: 'Nombre de la cabina' });
    if (!name || name === cabin.name) return;
    try {
      const fresh = await store.getCabin(cabin.id);
      await store.putCabin({ ...fresh, name, updatedAt: Date.now() });
      cabin.name = name;
      img.alt = `Cabina ${name}`;
      renderToolbar();
    } catch {
      toast('No se pudo guardar en este dispositivo.');
    }
  }
  const stepsMeta = h('span', { class: 'fd-sec-meta' });
  const pasteButton = h('button', { type: 'button', class: 'fd-mini-btn', 'aria-label': 'Pegar una lista', title: 'Pegar una lista', onclick: () => pasteList() }, icon('paste'));
  const verifyList = h('ol', { class: 'fd-steps fd-verify-list' });
  const verifySection = h('section', { class: 'fd-verify', 'aria-label': 'Checklist de verificación' },
    h('div', { class: 'fd-steps-head' }, h('span', { class: 'fd-steps-title', text: 'Checklist de verificación' })),
    h('div', { class: 'fd-steps-box' }, verifyList));
  const eyeButton = h('button', { type: 'button', class: 'fd-mini-btn', onclick: () => { showRoute = !showRoute; renderPanel(); paint(); } });
  const clearButton = h('button', { type: 'button', class: 'fd-mini-btn', 'aria-label': 'Borrar todos los pasos', onclick: clearSteps }, icon('trash'));
  const stepsHint = h('p', { class: 'fd-panel-hint' });
  const primaryButton = h('button', { type: 'button', class: 'fd-pbtn is-accent' });
  let exportList = (await store.getMeta('exportList').catch(() => undefined)) ?? true;
  // Avance de práctica del flujo (mejores marcas por escalón y el último usado), fuera del flujo.
  let progress = (await store.getMeta(progressKey(stored.id)).catch(() => undefined)) ?? {};
  const listSwitch = h('input', { type: 'checkbox', class: 'fd-switch', checked: exportList });
  listSwitch.addEventListener('change', () => { exportList = listSwitch.checked; store.setMeta('exportList', exportList).catch(() => {}); });
  // Compartir: el archivo, la imagen y la hoja para imprimir, con o sin la lista de pasos.
  const shareMenu = menu('Compartir', [
    { label: 'Archivo .flowdot', icon: 'file', action: () => { settleEditing(); io.shareFlow(cabin, flow()); } },
    { label: 'Imagen PNG', icon: 'image', action: () => io.downloadPng(cabin, flow(), { list: exportList }) },
    { label: 'PDF para imprimir', icon: 'download', action: () => io.printFlow(cabin, flow(), { list: exportList }) },
  ], {
    text: [icon('share'), h('span', { class: 'fd-share-label', text: 'Compartir' })],
    extra: h('label', { class: 'fd-switch-row fd-menu-switch' }, h('span', { text: 'Incluir la lista de pasos' }), listSwitch),
  });
  shareMenu.classList.add('fd-share');
  const panel = h('aside', { class: 'fd-panel', 'aria-label': 'Checklist del flujo' },
    panelToggle,
    h('div', { class: 'fd-panel-body' },
      h('div', { class: 'fd-steps-head' },
        h('span', { class: 'fd-steps-title' }, h('span', { class: 'fd-dot-mark', 'aria-hidden': 'true' }), 'Checklist'),
        stepsMeta, pasteButton, eyeButton, clearButton),
      h('div', { class: 'fd-steps-box' }, list),
      verifySection,
      stepsHint),
    h('div', { class: 'fd-panel-foot' }, primaryButton));
  const toolbar = h('div', { class: 'fd-toolbar' });
  const editor = h('div', { class: 'fd-editor' }, toolbar, h('div', { class: 'fd-work' }, stage, panel));
  root.replaceChildren(editor);
  panelToggle.addEventListener('click', () => {
    const open = panel.classList.toggle('is-open');
    panelToggle.setAttribute('aria-expanded', String(open));
  });

  await img.decode().catch(() => {});
  const overlay = createOverlay(svg);
  const card = createStepCard({
    onChange(changes, { live }) {
      if (!selected) return;
      const next = editStep(history.current(), selected, changes, { now: Date.now() });
      if (!live) { commit(next); return; }
      autosave.schedule(next);
      // La fila de la checklist sigue lo que se escribe; el historial recibe el cambio al salir del campo.
      const index = next.steps.findIndex((step) => step.id === selected);
      list.querySelector(`[data-id="${CSS.escape(selected)}"] .fd-check-line`)?.replaceWith(checkText(next.steps[index], index, false));
    },
    onDelete() {
      if (!selected) return;
      const id = selected;
      closeCard();
      selected = null;
      commit(removeStep(history.current(), id, { now: Date.now() }));
    },
    onClose: () => { closeCard(); paint(); },
    onPrev: () => stepBy(-1),
    onNext: () => stepBy(1),
  });
  const noteCard = createNoteCard({
    onText(text, { live }) {
      // Una etiqueta no queda vacía: si se borra todo, conserva el texto anterior.
      if (live || !selectedNote || !text.trim()) { if (!live) paint(); return; }
      commit(updateNote(history.current(), selectedNote, { text: text.trim() }, { now: Date.now() }));
    },
    onDelete() {
      if (!selectedNote) return;
      const id = selectedNote;
      selectedNote = null;
      commit(removeNote(history.current(), id, { now: Date.now() }));
    },
    onClose: () => selectNote(null),
  });
  stage.append(card.el, noteCard.el);
  let viewport = null;
  viewport = createViewport(stage, content, cabin.image, {
    onTap: (px, py) => modes[mode].tap?.(px, py),
    onDragStart: (px, py) => modes[mode].dragStart?.(px, py) ?? false,
    onDragMove: (px, py) => modes[mode].dragMove?.(px, py),
    onDragEnd: () => modes[mode].dragEnd?.(),
    onChange: () => paint(),
  });

  function paint() {
    if (!viewport) return;
    overlay.draw(flow().steps, viewport.view(), modes[mode].overlay());
    placeCards();
  }

  // Tarjeta del paso
  const asSheet = () => matchMedia('(max-width: 819px)').matches;
  function openStep(id, { reveal = false, focus = false } = {}) {
    selected = id;
    selectedNote = null;
    cardOpen = mode === 'editar';
    renderList();
    paint();
    list.querySelector(`[data-id="${CSS.escape(id)}"]`)?.scrollIntoView({ block: 'nearest' });
    if (reveal) revealStep(id);
    if (focus) card.focusName();
  }
  function closeCard() {
    cardOpen = false;
    card.hide();
    stage.classList.remove('is-card-open');
    viewport?.setInset(0);
  }
  function stepBy(delta) {
    const steps = flow().steps;
    const target = steps[steps.findIndex((step) => step.id === selected) + delta];
    if (target) openStep(target.id, { reveal: true });
  }
  /**
   * Ubica la tarjeta abierta (la del paso o la de la marca) junto a lo que edita. Se ocultan mientras
   * se arrastra y se cierran si lo que editaban ya no está (por ejemplo, al deshacer).
   */
  function placeCards() {
    const steps = flow().steps;
    const index = steps.findIndex((step) => step.id === selected);
    if (cardOpen && index < 0) cardOpen = false;
    const note = notes().find((item) => item.id === selectedNote);
    if (selectedNote && !note) selectedNote = null;
    const editing = mode === 'editar' && !dragFlow;
    const showStep = editing && cardOpen;
    const showNote = editing && !!note && !showStep;
    if (showStep) card.show(steps[index], index, steps.length); else card.hide();
    if (showNote) noteCard.show(note); else noteCard.hide();
    const open = showStep ? card : showNote ? noteCard : null;
    stage.classList.toggle('is-card-open', !!open);
    if (!open) {
      if (!dragFlow) viewport.setInset(0);
      return;
    }
    if (asSheet()) {
      open.el.style.left = '';
      open.el.style.top = '';
      viewport.setInset(open.el.offsetHeight);
      return;
    }
    viewport.setInset(0);
    const at = placeCard(showStep ? stepAnchor(steps[index]) : noteBox(note), { width: open.el.offsetWidth, height: open.el.offsetHeight }, { width: stage.clientWidth, height: stage.clientHeight });
    open.el.style.left = `${at.left}px`;
    open.el.style.top = `${at.top}px`;
    open.el.dataset.side = at.side;
  }

  function stepAnchor(step) {
    const { px, py } = toScreen(step.x, step.y, viewport.view());
    return { x: px, y: py };
  }
  /** Una marca en px del escenario: su centro y medio ancho, para que la tarjeta no la tape. */
  function noteBox(note) {
    const view = viewport.view();
    if (note.type === 'label') return { ...stepAnchor(note), rx: note.text.length * 3.7 + 9 };
    const ends = [toScreen(note.x1, note.y1, view), toScreen(note.x2, note.y2, view)];
    const middle = segmentMiddle(arrowSegment(note, view.width, view.height));
    const xs = [...ends.map((p) => p.px), middle.px * view.scale + view.tx];
    const left = Math.min(...xs);
    const right = Math.max(...xs);
    return { x: (left + right) / 2, y: toScreen(noteAnchor(note).x, noteAnchor(note).y, view).py, rx: (right - left) / 2 };
  }

  // Pegar una lista y ubicar sus pasos
  async function pasteList() {
    settleEditing();
    const result = await askPaste();
    if (!result || mode !== 'editar') return;
    const now = Date.now();
    const newId = () => crypto.randomUUID();
    if (result.target === 'checklist') {
      const next = addChecklist(history.current(), result.items, { newId, now });
      const added = (next.checklist?.length ?? 0) - (history.current().checklist?.length ?? 0);
      commit(next);
      if (added < result.items.length) toast(`Entraron ${added} de ${result.items.length}: una checklist tiene hasta 60 ítems.`);
      else toast(`Checklist de verificación: ${added === 1 ? '1 ítem' : `${added} ítems`}.`);
      return;
    }
    const next = addPending(history.current(), result.items, { newId, now });
    const added = (next.pending?.length ?? 0) - (history.current().pending?.length ?? 0);
    commit(next);
    if (added < result.items.length) toast(`Entraron ${added} de ${result.items.length}: un flujo tiene hasta ${MAX_STEPS} pasos.`);
    if (added) startLocating();
  }
  function startLocating() {
    if (!(flow().pending ?? []).length) return;
    if (placing) { placing = null; }
    closeCard();
    selectedNote = null;
    locating = { from: flow().steps.length };
    renderList();
    renderLocating();
    paint();
  }
  function stopLocating(message) {
    if (!locating) return;
    locating = null;
    modeBar.replaceChildren();
    renderList();
    if (message) toast(message);
  }
  function renderLocating() {
    if (!locating) return;
    const pending = flow().pending ?? [];
    if (!pending.length) { stopLocating(); return; }
    const done = Math.max(0, flow().steps.length - locating.from);
    const [first] = pending;
    modeBar.replaceChildren(
      h('p', { class: 'fd-ask' }, `Ubicá ${done + 1} de ${done + pending.length} · `, h('strong', { text: first.label }), first.action ? h('span', { class: 'fd-now', text: ` · ${first.action}` }) : null),
      button('Borrar este', () => commit(removePending(history.current(), first.id, { now: Date.now() })), { class: 'fd-btn is-quiet' }),
      button('Terminar después', () => stopLocating(), { class: 'fd-btn is-quiet' }));
  }
  function locateAt(px, py) {
    const { x, y } = toFraction(px, py, viewport.view());
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    const next = placePending(history.current(), x, y, { now: Date.now() });
    if (next === history.current()) { toast(`Un flujo puede tener hasta ${MAX_STEPS} pasos.`); stopLocating(); return; }
    selected = next.steps.at(-1).id;
    commit(next);
    list.querySelector(`[data-id="${CSS.escape(selected)}"]`)?.scrollIntoView({ block: 'nearest' });
    if (!(next.pending ?? []).length) stopLocating('Listo: todos los pasos están ubicados.');
    else announce(`Ubicado. Sigue ${next.pending[0].label}`);
  }

  // Checklist de verificación
  function renderVerify() {
    const items = mode === 'editar' ? flow().checklist ?? [] : [];
    verifySection.hidden = items.length === 0;
    verifyList.replaceChildren(...items.map((item, index) => h('li', { class: 'fd-step', tabindex: '0', 'data-check': item.id, onclick: (event) => { if (!event.target.closest('button')) editVerifyItem(item); }, onkeydown: (event) => { if (event.key === 'Enter' && event.target === event.currentTarget) editVerifyItem(item); } },
      h('span', { class: 'fd-step-num fd-verify-num', text: String(index + 1) }),
      checkText({ label: item.challenge, action: item.response }, index, false),
      h('button', { type: 'button', class: 'fd-icon-btn fd-step-del', 'aria-label': `Borrar «${item.challenge}»`, onclick: () => commit(removeChecklistItem(history.current(), item.id, { now: Date.now() })) }, '×'))));
  }
  async function editVerifyItem(item) {
    const challenge = h('input', { class: 'fd-input', type: 'text', value: item.challenge, maxlength: 120, 'aria-label': 'Pregunta' });
    const response = h('input', { class: 'fd-input', type: 'text', value: item.response, maxlength: 120, 'aria-label': 'Respuesta' });
    const ok = await ask({
      title: 'Ítem de la checklist',
      extra: h('div', { class: 'fd-fields' },
        h('label', {}, h('span', { text: 'Pregunta' }), challenge),
        h('label', {}, h('span', { text: 'Respuesta' }), response)),
      actions: [{ label: 'Cancelar', value: 'cancel' }, { label: 'Guardar', value: 'ok', primary: true }],
    });
    if (!ok || !challenge.value.trim()) return;
    commit(editChecklistItem(history.current(), item.id, { challenge: challenge.value.trim(), response: response.value.trim() }, { now: Date.now() }));
  }

  // Anotar
  function selectNote(id) {
    selectedNote = id;
    if (id) {
      closeCard();
      if (selected) { selected = null; renderList(); }
    }
    paint();
  }
  function startPlacing(type) {
    settleEditing();
    if (notes().length >= MAX_NOTES) { toast(`Un flujo puede tener hasta ${MAX_NOTES} marcas.`); return; }
    closeCard();
    selectedNote = null;
    if (locating) { locating = null; renderList(); }
    placing = { type };
    renderPlacing();
    paint();
  }
  function renderPlacing() {
    if (!placing) { modeBar.replaceChildren(); return; }
    const text = placing.type === 'label' ? 'Tocá dónde va la etiqueta'
      : placing.start ? 'Tocá dónde termina la flecha' : 'Tocá dónde empieza la flecha';
    modeBar.replaceChildren(h('p', { class: 'fd-ask', text }), button('Cancelar', cancelPlacing, { class: 'fd-btn is-quiet' }));
    announce(text);
  }
  function cancelPlacing() {
    placing = null;
    renderPlacing();
    paint();
  }
  /** Un toque mientras se coloca una marca. Fuera de la foto cancela. */
  async function placeAt(px, py) {
    const view = viewport.view();
    const { x, y } = toFraction(px, py, view);
    if (x < 0 || x > 1 || y < 0 || y > 1) { cancelPlacing(); return; }
    if (placing.type === 'arrow' && !placing.start) {
      placing = { ...placing, start: { x, y } };
      renderPlacing();
      paint();
      return;
    }
    const id = crypto.randomUUID();
    if (placing.type === 'arrow') {
      const { start } = placing;
      const from = toScreen(start.x, start.y, view);
      if (Math.hypot(from.px - px, from.py - py) < 12) return;
      placing = null;
      renderPlacing();
      commit(addNote(history.current(), { id, type: 'arrow', x1: start.x, y1: start.y, x2: x, y2: y }, { now: Date.now() }));
      selectNote(id);
      return;
    }
    placing = null;
    renderPlacing();
    paint();
    const text = await askText({ title: 'Etiqueta de zona', label: 'Texto de la etiqueta', max: MAX_NOTE_TEXT });
    if (!text || mode !== 'editar') return;
    commit(addNote(history.current(), { id, type: 'label', x, y, text }, { now: Date.now() }));
    selectNote(id);
  }
  /** La marca bajo el punto y qué parte: puntas de flecha primero, el medio solo en la elegida, después el cuerpo. */
  function noteUnder(px, py) {
    const view = viewport.view();
    const list = notes();
    for (let i = list.length - 1; i >= 0; i -= 1) {
      const part = arrowPartAt(list[i], px, py, view, { mid: list[i].id === selectedNote });
      if (part) return { id: list[i].id, part };
    }
    const index = noteAt(list, px, py, view);
    if (index < 0) return null;
    return { id: list[index].id, part: list[index].type === 'label' ? 'label' : 'line' };
  }

  /** Corre la foto si el paso quedó fuera de la vista o debajo de la hoja. */
  function revealStep(id) {
    const step = flow().steps.find((item) => item.id === id);
    if (!step) return;
    const { px, py } = toScreen(step.x, step.y, viewport.view());
    const margin = 48;
    const bottom = stage.clientHeight - (asSheet() && cardOpen ? card.el.offsetHeight : 0);
    const dx = px < margin ? margin - px : px > stage.clientWidth - margin ? stage.clientWidth - margin - px : 0;
    const dy = py < margin ? margin - py : py > bottom - margin ? bottom - margin - py : 0;
    if (dx || dy) viewport.panBy(dx, dy);
  }

  // Flechas
  const imagePoint = (px, py) => {
    const view = viewport.view();
    const { x, y } = toFraction(px, py, view);
    return { px: x * view.width, py: y * view.height };
  };
  /** Los tramos que se ven ahora, en px de la imagen. */
  function visibleSegments() {
    const options = modes[mode].overlay();
    if (!options.route) return [];
    const { width, height } = viewport.view();
    return shownSegments(flow().steps, width, height, options.shown, options.ahead);
  }
  /** Tramos con puntito en Editar: el del mouse, el que se arrastra y los que tocan al paso marcado. */
  function handleSegments() {
    if (mode !== 'editar' || !showRoute) return [];
    const count = flow().steps.length - 1;
    const at = flow().steps.findIndex((step) => step.id === selected);
    return [...new Set([hover, bendDrag, at - 1, at])].filter((k) => k >= 0 && k < count);
  }
  function handleAt(px, py) {
    const segments = visibleSegments();
    const scale = viewport.view().scale;
    const point = imagePoint(px, py);
    return handleSegments().find((k) => {
      const middle = segmentMiddle(segments[k]);
      return Math.hypot(middle.px - point.px, middle.py - point.py) * scale <= HIT_RADIUS;
    }) ?? -1;
  }
  function setHover(next) {
    if (next === hover) return;
    list.querySelectorAll('.fd-step.is-linked').forEach((row) => row.classList.remove('is-linked'));
    hover = next;
    if (hover >= 0) list.querySelectorAll('.fd-step')[hover + 1]?.classList.add('is-linked');
    paint();
  }
  const hovers = () => mode === 'editar' || mode === 'mirar';
  function onStageHover(event) {
    if (event.pointerType !== 'mouse' || event.buttons || !hovers()) return;
    const { px, py } = local(event);
    const overHandle = handleAt(px, py);
    const overNote = mode === 'editar' && !placing && overHandle < 0 ? noteUnder(px, py) : null;
    stage.classList.toggle('is-over-handle', overHandle >= 0 || (!!overNote && overNote.part !== 'line'));
    if (overHandle >= 0) { setHover(overHandle); return; }
    if (hitTest(flow().steps, px, py, viewport.view()) >= 0) { setHover(-1); return; }
    const point = imagePoint(px, py);
    setHover(segmentAt(visibleSegments(), point.px, point.py, HIT_RADIUS / viewport.view().scale));
  }
  const local = (event) => {
    const rect = stage.getBoundingClientRect();
    return { px: event.clientX - rect.left, py: event.clientY - rect.top };
  };
  stage.addEventListener('pointermove', onStageHover);
  stage.addEventListener('pointerleave', () => { stage.classList.remove('is-over-handle'); if (bendDrag < 0) setHover(-1); });

  /** Cierra la edición de un campo para que entre al historial antes de otra acción. */
  function settleEditing() {
    const active = document.activeElement;
    if (active?.classList?.contains('fd-card-field')) active.blur();
  }

  function commit(next) {
    if (next === history.current()) return;
    history.push(next);
    autosave.schedule(next);
    renderAll();
  }

  // Checklist: nombre, puntos y acción; "!" en los críticos.
  function checkText(step, index, hidden) {
    if (hidden) return h('span', { class: 'fd-check-line' });
    return h('span', { class: 'fd-check-line' },
      h('span', { class: 'fd-check-name', text: step.label || `Paso ${index + 1}` }),
      step.action ? [h('i', { class: 'fd-check-lead', 'aria-hidden': 'true' }), h('b', { class: 'fd-check-action', text: step.action })] : null,
      step.critical ? h('span', { class: 'fd-warn', title: 'Paso crítico', 'aria-label': 'Paso crítico', text: '!' }) : null);
  }

  function renderList() {
    const steps = flow().steps;
    const reveal = modes[mode].listReveal?.() ?? null;
    const done = modes[mode].listDone?.() ?? null;
    const current = modes[mode].current?.() ?? -1;
    const editing = mode === 'editar';
    list.replaceChildren(...steps.map((step, index) => {
      const hidden = reveal && !reveal.has(index);
      const li = h('li', {
        class: `fd-step${step.id === selected ? ' is-selected' : ''}${current === index ? ' is-current' : ''}${done?.has(index) ? ' is-done' : ''}`,
        tabindex: editing ? '0' : undefined, 'data-id': step.id,
      }, h('span', { class: 'fd-step-num', text: String(index + 1) }));
      li.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse' && hovers()) setHover(index - 1); });
      li.addEventListener('pointerleave', (event) => { if (event.pointerType === 'mouse' && hovers()) setHover(-1); });
      if (hover >= 0 && index === hover + 1) li.classList.add('is-linked');
      if (editing) {
        li.append(checkText(step, index, false),
          h('button', { type: 'button', class: 'fd-handle', 'aria-label': `Mover el paso ${index + 1}`, onpointerdown: (event) => startReorder(event, index) }, h('span', { 'aria-hidden': 'true', text: '⋮⋮' })),
          h('button', { type: 'button', class: 'fd-icon-btn fd-step-del', 'aria-label': `Borrar el paso ${index + 1}`, onclick: () => commit(removeStep(history.current(), step.id, { now: Date.now() })) }, '×'));
        li.addEventListener('click', (event) => {
          if (event.target.closest('button')) return;
          openStep(step.id, { reveal: true });
        });
        li.addEventListener('keydown', (event) => {
          if (event.target !== li) return;
          if (event.key === 'Enter') { event.preventDefault(); openStep(step.id, { reveal: true, focus: true }); }
          if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); commit(removeStep(history.current(), step.id, { now: Date.now() })); focusStep(Math.min(index, flow().steps.length - 1)); }
          if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
            event.preventDefault();
            const to = index + (event.key === 'ArrowUp' ? -1 : 1);
            if (to < 0 || to >= steps.length) return;
            commit(reorderStep(history.current(), index, to, { now: Date.now() }));
            focusStep(to);
          }
        });
      } else {
        li.append(checkText(step, index, hidden));
      }
      return li;
    }));
    const pending = editing ? flow().pending ?? [] : [];
    if (!steps.length && !pending.length && editing) {
      list.append(h('li', { class: 'fd-step-empty' }, 'Tocá la cabina sobre el primer control del flujo, o ',
        h('button', { type: 'button', class: 'fd-link', onclick: () => pasteList() }, 'pegá la lista de tu empresa'), '.'));
    }
    if (pending.length) {
      list.append(h('li', { class: 'fd-pending-head' },
        locating ? h('span', { text: 'Tocá la cabina para ubicar el primero.' })
          : button(`Ubicar ${pending.length === 1 ? 'el que falta' : `los ${pending.length} que faltan`}`, () => startLocating(), { class: 'fd-btn is-quiet fd-pending-go' })));
      pending.forEach((item, i) => list.append(h('li', { class: `fd-step is-pending${locating && i === 0 ? ' is-current' : ''}` },
        h('span', { class: 'fd-step-num fd-pending-num', 'aria-hidden': 'true', text: '·' }),
        checkText({ label: item.label, action: item.action }, steps.length + i, false),
        h('span', { class: 'fd-pending-tag', text: 'Sin ubicar' }),
        h('button', { type: 'button', class: 'fd-icon-btn fd-step-del', 'aria-label': `Borrar «${item.label}»`, onclick: () => commit(removePending(history.current(), item.id, { now: Date.now() })) }, '×'))));
    }
    renderVerify();
    const sel = steps.findIndex((step) => step.id === selected);
    panelToggle.textContent = sel >= 0 ? `${sel + 1}. ${steps[sel].label || `Paso ${sel + 1}`}` : (steps.length === 1 ? '1 paso' : `${steps.length} pasos`);
  }

  function renderPanel() {
    const current = flow();
    const count = current.steps.length;
    stepsMeta.textContent = count === 1 ? '1 paso' : `${count} pasos`;
    eyeButton.replaceChildren(icon(showRoute ? 'eye' : 'eyeOff'));
    eyeButton.setAttribute('aria-label', showRoute ? 'Ocultar la ruta' : 'Mostrar la ruta');
    eyeButton.setAttribute('aria-pressed', String(!showRoute));
    eyeButton.hidden = mode !== 'editar';
    clearButton.hidden = mode !== 'editar' || count === 0;
    pasteButton.hidden = mode !== 'editar';
    stepsHint.textContent = mode === 'editar' ? 'Tocá la cabina para agregar un paso. Tocá un paso para ponerle nombre y acción.' : mode === 'mirar' ? 'La ruta se dibuja paso por paso.' : modes[mode].panelHint?.() ?? '';
    const target = mode === 'repasar' ? 'editar' : 'repasar';
    primaryButton.replaceChildren(icon(target === 'repasar' ? 'play' : 'edit'), target === 'repasar' ? 'Repasar' : 'Volver a editar');
    primaryButton.onclick = () => go({ screen: 'flow', cabinId: cabin.id, flowId: current.id, mode: target });
  }

  async function clearSteps() {
    const ok = await ask({ title: 'Borrar todos los pasos', text: 'Podés deshacerlo con Deshacer.', actions: [{ label: 'Cancelar', value: 'cancel' }, { label: 'Borrar', value: 'ok', danger: true }] });
    if (ok) commit({ ...history.current(), steps: [], updatedAt: Date.now() });
  }

  async function replaceImage() {
    const ok = await ask({
      title: 'Cambiar la foto',
      text: 'Los pasos se conservan. Si la foto nueva tiene otro encuadre, los puntos pueden quedar corridos.',
      actions: [{ label: 'Cancelar', value: 'cancel' }, { label: 'Elegir foto', value: 'ok', primary: true }],
    });
    if (!ok) return;
    const image = await pickCabinImage();
    if (!image) return;
    try {
      await autosave.flush();
      await store.putCabin({ ...cabin, image, updatedAt: Date.now() });
    } catch {
      toast('No se pudo guardar en este dispositivo.');
      return;
    }
    ctx.remount();
  }

  const focusStep = (index) => list.querySelectorAll('.fd-step')[index]?.focus();

  function startReorder(event, from) {
    event.preventDefault();
    const items = [...list.querySelectorAll('.fd-step:not(.is-pending)')];
    const moving = items[from];
    moving.classList.add('is-moving');
    let to = from;
    const onMove = (e) => {
      to = items.findIndex((item) => { const rect = item.getBoundingClientRect(); return e.clientY < rect.top + rect.height / 2; });
      if (to === -1) to = items.length - 1;
      else if (to > from) to -= 1;
      items.forEach((item, i) => item.classList.toggle('is-drop', i === to && i !== from));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      moving.classList.remove('is-moving');
      if (to !== from) commit(reorderStep(history.current(), from, to, { now: Date.now() }));
      else renderList();
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  // Barra superior
  function renderToolbar() {
    const current = flow();
    const seg = h('div', { class: 'fd-seg', role: 'group', 'aria-label': 'Modo' },
      Object.entries(MODE_LABELS).map(([key, label]) => h('button', {
        type: 'button', 'aria-pressed': String(key === mode),
        onclick: () => go({ screen: 'flow', cabinId: cabin.id, flowId: current.id, mode: key }),
      }, label)));
    const modeHadFocus = !!document.activeElement?.closest?.('.fd-toolbar .fd-seg');
    undoButton.disabled = !history.canUndo();
    redoButton.disabled = !history.canRedo();
    historyTools.hidden = mode !== 'editar';
    noteTools.hidden = mode !== 'editar';
    toolbar.replaceChildren(...[
      h('a', { class: 'fd-icon-btn fd-back', href: '#', 'aria-label': 'Volver a tus cabinas' }, '‹'),
      h('div', { class: 'fd-title' }, h('strong', { text: current.name }), h('span', { text: `${cabin.name} · ${current.steps.length === 1 ? '1 paso' : `${current.steps.length} pasos`}` })),
      seg,
      shareMenu,
      h('button', { type: 'button', class: 'fd-icon-btn fd-panel-switch', 'aria-label': 'Mostrar u ocultar el panel', 'aria-pressed': String(editor.classList.contains('is-panel-hidden')), title: 'Panel', onclick: () => { editor.classList.toggle('is-panel-hidden'); renderToolbar(); requestAnimationFrame(() => viewport.fit()); } }, icon('panel')),
      menu('Opciones del flujo', [
        mode === 'editar' ? { label: 'Pegar una lista', action: pasteList } : null,
        { label: 'Renombrar flujo', action: renameFlow },
        { label: 'Renombrar cabina', action: renameCabin },
        { label: 'Cambiar foto de la cabina', action: replaceImage },
        { label: 'Duplicar', action: duplicateFlow },
        { label: 'Atajos de teclado', action: showShortcuts },
        { label: 'Cómo se usa', action: () => showGuide() },
        { label: 'Borrar flujo', action: deleteFlow, danger: true },
      ]),
    ].filter(Boolean));
    if (modeHadFocus) seg.querySelector('[aria-pressed="true"]')?.focus();
  }

  const MOD = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';
  const SHORTCUTS = [
    ['Editar', [[`${MOD} Z`, 'Deshacer'], [`${MOD} Shift Z`, 'Rehacer'], ['Supr', 'Borrar el paso marcado'], ['Esc', 'Cerrar la tarjeta o desmarcar el paso'], ['Enter', 'En la checklist, abrir el paso; en el nombre, pasar a la acción'], ['Alt ↑ ↓', 'Mover el paso en la lista']]],
    ['Mirar', [['Espacio', 'Reproducir o pausar'], ['← →', 'Paso anterior o siguiente']]],
  ];
  function showShortcuts() {
    ask({
      title: 'Atajos de teclado',
      extra: h('div', { class: 'fd-keys' }, SHORTCUTS.map(([group, rows]) => [
        h('h3', { text: group }),
        h('dl', {}, rows.map(([keys, what]) => [h('dt', {}, keys.split(' ').map((key) => h('kbd', { text: key }))), h('dd', { text: what })])),
      ])),
      actions: [{ label: 'Listo', value: 'ok', primary: true }],
    });
  }

  async function duplicateFlow() {
    await autosave.flush();
    const copy = { ...newFlow(cabin.id, `${flow().name} (copia)`.slice(0, 120)), steps: flow().steps.map((step) => ({ ...step, id: crypto.randomUUID() })) };
    if (flow().notes?.length) copy.notes = flow().notes.map((note) => ({ ...note, id: crypto.randomUUID() }));
    try {
      await store.putFlow(copy);
    } catch {
      toast('No se pudo guardar en este dispositivo.');
      return;
    }
    track('flowdot_flow_created');
    go({ screen: 'flow', cabinId: cabin.id, flowId: copy.id, mode: 'editar' });
  }

  async function deleteFlow() {
    const ok = await ask({ title: `Borrar «${flow().name}»`, text: 'No se puede deshacer.', actions: [{ label: 'Cancelar', value: 'cancel' }, { label: 'Borrar', value: 'ok', danger: true }] });
    if (!ok) return;
    try {
      await store.deleteFlow(flow().id);
    } catch {
      toast('No se pudo borrar el flujo.');
      return;
    }
    deleted = true;
    go({ screen: 'list' });
  }
  let deleted = false;

  const announce = (text) => { live.textContent = ''; requestAnimationFrame(() => { live.textContent = text; }); };

  // Modos
  const modes = {
    editar: {
      overlay: () => ({
        ...(showRoute ? { route: true, selected, hover, handles: handleSegments() } : { shown: [] }),
        notes: notes(), selectedNote, pendingNote: placing?.start,
      }),
      tap(px, py) {
        settleEditing();
        if (locating) { locateAt(px, py); return; }
        if (placing) { placeAt(px, py); return; }
        const index = hitTest(flow().steps, px, py, viewport.view());
        const handle = index < 0 ? handleAt(px, py) : -1;
        if (handle >= 0) {
          // Doble toque en el puntito: la flecha vuelve a la curva automática.
          const now = Date.now();
          if (lastHandleTap?.k === handle && now - lastHandleTap.time < DOUBLE_TAP) {
            lastHandleTap = null;
            commit(bendStep(history.current(), flow().steps[handle + 1].id, null, { now }));
          } else {
            lastHandleTap = { k: handle, time: now };
          }
          return;
        }
        if (index >= 0) {
          openStep(flow().steps[index].id, { reveal: true });
          return;
        }
        const hit = noteUnder(px, py);
        if (hit) {
          // Doble toque en el puntito del medio: la flecha vuelve a recta.
          const now = Date.now();
          if (hit.part === 'mid' && lastNoteTap?.id === hit.id && now - lastNoteTap.time < DOUBLE_TAP) {
            lastNoteTap = null;
            commit(updateNote(history.current(), hit.id, { bend: null }, { now }));
            return;
          }
          lastNoteTap = hit.part === 'mid' ? { id: hit.id, time: now } : null;
          selectNote(hit.id);
          return;
        }
        if (selectedNote) { selectNote(null); return; }
        const { x, y } = toFraction(px, py, viewport.view());
        if (x < 0 || x > 1 || y < 0 || y > 1) return;
        const current = history.current();
        const next = current.steps.length + (current.pending?.length ?? 0) >= MAX_STEPS ? current
          : addStep(current, x, y, { id: crypto.randomUUID(), now: Date.now() });
        if (next === current) { toast(`Un flujo puede tener hasta ${MAX_STEPS} pasos.`); return; }
        selected = next.steps.at(-1).id;
        cardOpen = true;
        commit(next);
        list.querySelector(`[data-id="${CSS.escape(selected)}"]`)?.scrollIntoView({ block: 'nearest' });
        revealStep(selected);
        card.focusName();
      },
      dragStart(px, py) {
        settleEditing();
        const index = hitTest(flow().steps, px, py, viewport.view());
        if (index < 0) {
          if (placing || locating) return false;
          const handle = handleAt(px, py);
          if (handle >= 0) {
            bendDrag = handle;
            dragFlow = history.current();
            return true;
          }
          const hit = noteUnder(px, py);
          if (!hit || hit.part === 'line') return false;
          const note = notes().find((item) => item.id === hit.id);
          const { x, y } = toFraction(px, py, viewport.view());
          noteDrag = { id: hit.id, part: hit.part, dx: hit.part === 'label' ? note.x - x : 0, dy: hit.part === 'label' ? note.y - y : 0 };
          closeCard();
          selectedNote = hit.id;
          dragFlow = history.current();
          return true;
        }
        if (locating) return false;
        selected = flow().steps[index].id;
        dragFlow = history.current();
        return true;
      },
      dragMove(px, py) {
        if (noteDrag) {
          const view = viewport.view();
          const { x, y } = toFraction(px, py, view);
          const note = dragFlow.notes.find((item) => item.id === noteDrag.id);
          let changes;
          if (noteDrag.part === 'label') changes = { x: x + noteDrag.dx, y: y + noteDrag.dy };
          else if (noteDrag.part === 'start') changes = { x1: x, y1: y };
          else if (noteDrag.part === 'end') changes = { x2: x, y2: y };
          else {
            const { width, height } = view;
            changes = { bend: bendFrom({ px: note.x1 * width, py: note.y1 * height }, { px: note.x2 * width, py: note.y2 * height }, imagePoint(px, py)) };
          }
          dragFlow = updateNote(dragFlow, noteDrag.id, changes, { now: Date.now() });
          paint();
          return;
        }
        if (bendDrag >= 0) {
          const { width, height } = viewport.view();
          const [p1, p2] = routePoints(dragFlow.steps, width, height, [bendDrag, bendDrag + 1]);
          dragFlow = bendStep(dragFlow, dragFlow.steps[bendDrag + 1].id, bendFrom(p1, p2, imagePoint(px, py)), { now: Date.now() });
          paint();
          return;
        }
        const { x, y } = toFraction(px, py, viewport.view());
        dragFlow = moveStep(dragFlow, selected, x, y, { now: Date.now() });
        paint();
      },
      dragEnd() {
        const next = dragFlow;
        dragFlow = null;
        bendDrag = -1;
        noteDrag = null;
        if (next && next !== history.current()) commit(next);
        else paint();
      },
      bar: () => null,
      key(event) {
        const mod = event.metaKey || event.ctrlKey;
        if (event.key === 'Escape' && locating) {
          stopLocating();
        } else if (event.key === 'Escape' && placing) {
          cancelPlacing();
        } else if (!mod && selectedNote && (event.key === 'Delete' || event.key === 'Backspace')) {
          event.preventDefault();
          const id = selectedNote;
          selectedNote = null;
          commit(removeNote(history.current(), id, { now: Date.now() }));
        } else if (event.key === 'Escape' && selectedNote) {
          selectNote(null);
        } else if (mod && event.key.toLowerCase() === 'z') {
          event.preventDefault();
          if (event.shiftKey) history.redo(); else history.undo();
          autosave.schedule(history.current());
          renderAll();
        } else if (!mod && selected && (event.key === 'Delete' || event.key === 'Backspace')) {
          event.preventDefault();
          const id = selected;
          closeCard();
          selected = null;
          commit(removeStep(history.current(), id, { now: Date.now() }));
        } else if (event.key === 'Escape' && cardOpen) {
          closeCard();
          paint();
        } else if (event.key === 'Escape' && selected) {
          selected = null;
          renderList();
          paint();
        }
      },
    },

    mirar: (() => {
      let shown = 0;
      let timer = null;
      let speed = 'normal';
      const stop = () => { clearInterval(timer); timer = null; };
      const advance = () => {
        if (shown >= flow().steps.length) { stop(); renderBar(); return; }
        shown += 1;
        if (shown >= flow().steps.length) stop();
        renderList();
        paint();
        renderBar();
      };
      const play = () => {
        if (shown >= flow().steps.length) shown = 0;
        stop();
        timer = setInterval(advance, SPEEDS[speed]);
        advance();
      };
      function renderBar() {
        const empty = flow().steps.length === 0;
        modeBar.replaceChildren(
          empty ? h('p', { text: 'Este flujo todavía no tiene pasos.' })
            : h('p', { title: shown ? flow().steps[shown - 1].label : undefined }, `${shown} de ${flow().steps.length}`,
              shown ? h('span', { class: 'fd-now', text: ` · ${[flow().steps[shown - 1].label || `Paso ${shown}`, flow().steps[shown - 1].action].filter(Boolean).join(' · ')}` }) : null),
          button('Anterior', () => { stop(); shown = Math.max(0, shown - 1); renderList(); paint(); renderBar(); }, { class: 'fd-btn is-quiet', disabled: empty || shown === 0 }),
          button(timer ? 'Pausa' : shown >= flow().steps.length && !empty ? 'Repetir' : 'Reproducir', () => { if (timer) { stop(); renderBar(); } else play(); }, { class: 'fd-btn is-primary', disabled: empty }),
          button('Siguiente', () => { stop(); advance(); }, { class: 'fd-btn is-quiet', disabled: empty || shown >= flow().steps.length }),
          h('select', { class: 'fd-select', 'aria-label': 'Velocidad', disabled: empty, onchange: (event) => { speed = event.target.value; if (timer) play(); } },
            Object.keys(SPEEDS).map((key) => h('option', { value: key, selected: key === speed }, { lenta: 'Lenta', normal: 'Normal', rapida: 'Rápida' }[key]))),
        );
      }
      return {
        enter() { shown = 0; renderBar(); if (flow().steps.length) play(); },
        leave: stop,
        overlay: () => ({ route: true, shown: [...Array(shown).keys()], ahead: shown, animateLast: true, selected: flow().steps[shown - 1]?.id, hover, notes: notes() }),
        listReveal: () => new Set([...Array(shown).keys()]),
        current: () => shown - 1,
        bar: renderBar,
        key(event) {
          if (!flow().steps.length || event.metaKey || event.ctrlKey || event.altKey) return;
          if (event.key === ' ') {
            event.preventDefault();
            if (timer) { stop(); renderBar(); } else play();
          } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            stop();
            advance();
            renderBar();
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            stop();
            shown = Math.max(0, shown - 1);
            renderList();
            paint();
            renderBar();
          }
        },
      };
    })(),

    // Repasar en escalones: Con la lista (leer y ubicar), De memoria (ubicar y elegir la acción)
    // y Simulador (examen: sin lista ni ayudas, con reloj y nota). Los dos primeros se pueden mezclar.
    repasar: (() => {
      let level = LEVELS.includes(progress.lastLevel) ? progress.lastLevel : 'lista';
      let shuffled = false;
      let state = null;
      let only = null;
      let finished = false;
      let marks = [];
      let hint = null;
      let markTimer = null;
      // Lo que se acaba de acertar ("Flaps, 1+F"): se ve en la barra mientras dura el destello.
      let cheer = null;
      let cheerTimer = null;
      // De memoria: después de acertar el lugar se elige la acción. { index, pos, choices, correct, picked }
      let question = null;
      let answerTimer = null;
      // Simulador: phase 'ready' | 'run' | 'check' | 'done', con los toques, el reloj y la checklist.
      let sim = null;
      // El resultado se achica a una fila para ver la cabina con la ruta y los pasos fallados.
      let resultHidden = false;
      const steps = () => flow().steps;
      const solved = () => (state ? state.order.slice(0, state.current) : []);
      const stepName = (index) => steps()[index]?.label || `Paso ${index + 1}`;
      const passed = (key) => (progress.levels?.[key]?.best?.ratio ?? 0) >= PASS;
      const back = () => go({ screen: 'flow', cabinId: cabin.id, flowId: flow().id, mode: 'editar' });
      const clock = (ms) => {
        const seconds = Math.max(0, Math.round(ms / 1000));
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
      };
      const passTag = () => h('span', { class: 'fd-pass', text: 'Logrado' });

      function save(next) {
        progress = next;
        store.setMeta(progressKey(flow().id), progress).catch(() => {});
      }
      function stopTimers() {
        clearTimeout(markTimer);
        clearTimeout(cheerTimer);
        clearTimeout(answerTimer);
        clearInterval(sim?.ticker);
      }
      function start(nextOnly = null) {
        stopTimers();
        only = nextOnly;
        finished = false;
        marks = [];
        hint = null;
        cheer = null;
        question = null;
        resultHidden = false;
        state = null;
        sim = level === 'simulador' ? { phase: 'ready', taps: [], marks: [], answers: [] } : null;
        if (!sim) state = createReview(steps(), { mode: shuffled ? 'where' : 'order', only });
        renderPanel();
        renderList();
        list.querySelector('.is-current')?.scrollIntoView({ block: 'nearest' });
        paint();
        renderBar();
      }
      function setLevel(next) {
        if (next === level) return;
        level = next;
        if (progress.lastLevel !== level) save({ ...progress, lastLevel: level });
        start();
      }
      function flash(mark) {
        marks = [mark];
        clearTimeout(markTimer);
        markTimer = setTimeout(() => { marks = []; paint(); }, 700);
      }
      function finish() {
        if (finished) return;
        finished = true;
        const summary = reviewSummary(state);
        if (summary.total && !only) {
          save(recordResult(progress, level, { ratio: summary.firstTry / summary.total }, Date.now()));
          track('flowdot_review_finished', { level, steps: summary.total, first_try: summary.firstTry });
        }
      }

      // El escalón se elige en un menú chico, así la barra queda en una sola fila. Se arma de nuevo
      // solo si cambia el escalón o lo logrado, para que no se cierre solo mientras está abierto.
      let levelMenuNode = null;
      let levelMenuKey = '';
      function levelMenu() {
        const key = [level, ...LEVELS.map(passed)].join();
        if (levelMenuNode && key === levelMenuKey) return levelMenuNode;
        levelMenuKey = key;
        levelMenuNode = menu('Escalón', LEVELS.map((item) => ({
          label: LEVEL_LABELS[item], hint: LEVEL_HINTS[item], checked: item === level, action: () => setLevel(item),
          mark: passed(item) ? '✓' : null, markLabel: ', logrado',
        })), { text: [h('span', { text: LEVEL_LABELS[level] }), icon('chevronDown')], up: true });
        levelMenuNode.classList.add('fd-level-menu');
        levelMenuNode.firstChild.setAttribute('aria-label', `Escalón: ${LEVEL_LABELS[level]}. Cambiar`);
        return levelMenuNode;
      }
      const row = (...children) => h('div', { class: 'fd-modebar-row' }, ...children);
      const group = (...children) => h('div', { class: 'fd-modebar-group' }, ...children);

      function helpButton() {
        return button('Ayuda', () => {
          const step = steps()[state.expectedIndex];
          state = reviewHint(state);
          if (state.hintLevel === 1) {
            const angle = Math.random() * Math.PI * 2;
            const offset = (Math.random() * HIT_RADIUS * 2) / viewport.view().scale;
            const { width, height } = cabin.image;
            hint = { level: 1, radius: HIT_RADIUS * 4, x: step.x + (Math.cos(angle) * offset) / width, y: step.y + (Math.sin(angle) * offset) / height, index: state.expectedIndex };
          } else {
            hint = { level: 2, index: state.expectedIndex };
          }
          paint();
          renderBar();
        }, { class: 'fd-btn is-quiet', disabled: state.hintLevel >= 2 });
      }
      function mixButton() {
        return h('button', {
          type: 'button', class: 'fd-btn is-quiet fd-mix', 'aria-pressed': String(shuffled), title: 'Mezclar el orden',
          onclick: () => { shuffled = !shuffled; start(); },
        }, icon('shuffle'), h('span', { class: 'fd-mix-label', text: 'Mezclar' }));
      }

      function renderBar() {
        if (!steps().length) {
          modeBar.replaceChildren(h('p', { text: 'Este flujo todavía no tiene pasos.' }), button('Volver al editor', back, { class: 'fd-btn is-primary' }));
          return;
        }
        if (sim) { renderSim(); return; }
        if (question) {
          modeBar.replaceChildren(
            h('p', { class: 'fd-ask' }, h('span', { text: '¿Qué acción? ' }), h('strong', { text: stepName(question.index) })),
            h('div', { class: 'fd-choices', role: 'group', 'aria-label': 'Acciones' }, question.choices.map((choice, i) => {
              const mark = question.picked == null ? '' : choice === question.correct ? ' is-right' : choice === question.picked ? ' is-wrong' : '';
              return button(choice, () => answer(choice), { class: `fd-btn fd-choice${mark}`, disabled: question.picked != null, 'aria-keyshortcuts': String(i + 1) });
            })));
          return;
        }
        if (state.done) { renderResult(); return; }
        const step = steps()[state.expectedIndex];
        let prompt;
        if (cheer) prompt = h('p', { class: 'fd-ask is-hit' }, h('span', { text: 'Correcto: ' }), h('strong', { text: cheer }));
        else if (shuffled) prompt = h('p', { class: 'fd-ask' }, h('span', { text: 'Dónde está ' }), h('strong', { text: stepName(state.expectedIndex) }));
        else if (level === 'lista') {
          prompt = h('p', { class: 'fd-ask', title: [stepName(state.expectedIndex), step.action].filter(Boolean).join(' · ') }, `Paso ${state.current + 1} de ${state.total}`,
            h('span', { class: 'fd-now', text: ` · ${[stepName(state.expectedIndex), step.action].filter(Boolean).join(' · ')}` }));
        } else prompt = h('p', { class: 'fd-ask' }, `Paso ${state.current + 1} de ${state.total}`);
        modeBar.replaceChildren(levelMenu(), prompt, group(helpButton(), mixButton()));
      }

      /** El cartel del resultado, o achicado a una fila con `brief` y "Ver resultado". */
      function showResult(brief, missedCount, children) {
        const toggle = (hidden) => {
          resultHidden = hidden;
          renderBar();
          modeBar.querySelector(hidden ? '.fd-result-show' : '.fd-result-hide')?.focus();
        };
        if (resultHidden) {
          modeBar.replaceChildren(row(
            h('p', { class: 'fd-ask' }, brief, missedCount ? h('span', { class: 'fd-now', text: ' · Los vacíos son los que fallaste.' }) : null),
            button('Ver resultado', () => toggle(false), { class: 'fd-btn is-primary fd-result-show' })));
          return;
        }
        modeBar.replaceChildren(h('div', { class: 'fd-result' },
          h('button', { type: 'button', class: 'fd-icon-btn fd-result-hide', 'aria-label': 'Achicar para ver la cabina', title: 'Ver la cabina', onclick: () => toggle(true) }, icon('chevronDown')),
          ...children));
      }
      function missedIndices() {
        if (sim?.phase === 'done') return [...sim.grade.skipped, ...sim.grade.outOfOrder];
        if (!state?.done) return [];
        return reviewSummary(state).missedStepIds.map((id) => steps().findIndex((step) => step.id === id)).filter((i) => i >= 0);
      }

      function renderResult() {
        const summary = reviewSummary(state);
        const missed = missedIndices();
        const critical = criticalStepIds(steps());
        const ok = !only && summary.total > 0 && summary.firstTry / summary.total >= PASS;
        const next = LEVELS[LEVELS.indexOf(level) + 1];
        showResult(`${summary.firstTry} de ${summary.total} al primer intento`, missed.length, [
          h('h2', {}, `${LEVEL_LABELS[level]}: terminado`, ok ? passTag() : null),
          h('p', {}, h('strong', { text: `${summary.firstTry} de ${summary.total}` }), ' al primer intento · ',
            `${summary.errors} ${summary.errors === 1 ? 'error' : 'errores'} · ${summary.hints} ${summary.hints === 1 ? 'ayuda' : 'ayudas'}`),
          only ? h('p', { class: 'fd-result-note', text: 'Repaso parcial: no cuenta para tu avance.' })
            : ok ? null : h('p', { class: 'fd-result-note', text: `Se logra con ${Math.round(PASS * 100)} % al primer intento.` }),
          missed.length ? h('ul', { class: 'fd-missed' }, missed.map((i) => h('li', { text: `${i + 1}. ${stepName(i)}` }))) : null,
          h('div', { class: 'fd-result-actions' },
            ok && next ? button(`Pasar a ${LEVEL_LABELS[next]}`, () => setLevel(next), { class: 'fd-btn is-primary' }) : null,
            button('Repetir', () => start(), { class: ok && next ? 'fd-btn' : 'fd-btn is-primary' }),
            missed.length ? button('Repetir solo los pasos con error', () => start(summary.missedStepIds), { class: 'fd-btn' }) : null,
            critical.length ? button('Repetir solo los críticos', () => start(critical), { class: 'fd-btn' }) : null,
            button('Volver al editor', back, { class: 'fd-btn is-quiet' }))]);
      }

      function answer(choice) {
        if (!question || question.picked != null) return;
        question.picked = choice;
        const right = choice === question.correct;
        if (!right) {
          const errors = [...state.errors];
          errors[question.pos] += 1;
          state = { ...state, errors };
        }
        announce(right ? 'Correcto' : `No. Era ${question.correct}`);
        renderBar();
        answerTimer = setTimeout(() => {
          question = null;
          if (state.done) finish();
          renderList();
          paint();
          renderBar();
        }, right ? 600 : 1200);
      }

      // Simulador
      function begin() {
        sim = { phase: 'run', taps: [], marks: [], answers: [], startedAt: Date.now() };
        sim.ticker = setInterval(() => { if (sim?.clock) sim.clock.textContent = clock(Date.now() - sim.startedAt); }, 1000);
        announce('Empezó. Tocá los controles en orden.');
        renderBar();
      }
      function endRun() {
        clearInterval(sim.ticker);
        sim.time = Date.now() - sim.startedAt;
        sim.grade = gradeRun(steps().length, sim.taps);
        const checklist = flow().checklist ?? [];
        const responses = checklist.map((item) => item.response);
        sim.asks = checklist.map((item) => ({ item, choices: choicesFor(responses, item.response) })).filter((ask) => ask.choices.length);
        sim.at = 0;
        sim.phase = sim.asks.length ? 'check' : 'done';
        if (sim.phase === 'done') finishSim();
        renderList();
        paint();
        renderBar();
      }
      function answerCheck(choice) {
        const ask = sim.asks[sim.at];
        sim.answers.push({ item: ask.item, picked: choice, ok: choice === ask.item.response });
        sim.at += 1;
        if (sim.at >= sim.asks.length) {
          sim.phase = 'done';
          finishSim();
          renderList();
          paint();
        }
        renderBar();
      }
      function finishSim() {
        const { score } = sim.grade;
        const right = sim.answers.filter((item) => item.ok).length;
        sim.best = progress.levels?.simulador?.best ?? null;
        const result = { ratio: score / 100, score, time: sim.time };
        if (sim.asks.length) result.checklist = { right, total: sim.asks.length };
        save(recordResult(progress, 'simulador', result, Date.now()));
        track('flowdot_review_finished', { level: 'simulador', steps: steps().length, score });
      }
      function renderSim() {
        const total = steps().length;
        if (sim.phase === 'ready') {
          modeBar.replaceChildren(levelMenu(),
            h('p', { class: 'fd-ask' }, 'Como en el examen: en orden y sin ayudas.'),
            button('Empezar', begin, { class: 'fd-btn is-primary' }));
          return;
        }
        if (sim.phase === 'run') {
          const touched = sim.taps.filter((index) => index >= 0).length;
          sim.clock = h('span', { class: 'fd-clock', text: clock(Date.now() - sim.startedAt) });
          modeBar.replaceChildren(row(
            h('p', { class: 'fd-ask' }, sim.clock, h('span', { class: 'fd-now', text: ` · ${touched} de ${total} tocados` })),
            button('Cancelar', () => start(), { class: 'fd-btn is-quiet' }),
            button('Terminé', endRun, { class: 'fd-btn is-primary' })));
          return;
        }
        if (sim.phase === 'check') {
          const ask = sim.asks[sim.at];
          modeBar.replaceChildren(row(
            h('p', { class: 'fd-ask' }, h('span', { text: `Checklist ${sim.at + 1} de ${sim.asks.length} · ` }), h('strong', { text: ask.item.challenge })),
            h('div', { class: 'fd-choices', role: 'group', 'aria-label': 'Respuestas' },
              ask.choices.map((choice, i) => button(choice, () => answerCheck(choice), { class: 'fd-btn fd-choice', 'aria-keyshortcuts': String(i + 1) })))));
          return;
        }
        const { grade, time } = sim;
        const names = (indices) => (indices.length ? indices.map((i) => `${i + 1}. ${stepName(i)}`).join(', ') : 'Ninguno');
        const stat = (label, value) => [h('dt', { text: label }), h('dd', { text: value })];
        const wrong = sim.answers.filter((item) => !item.ok);
        const right = sim.answers.length - wrong.length;
        const ok = grade.score / 100 >= PASS;
        const best = sim.best;
        showResult(`Nota ${grade.score} · ${clock(time)}`, grade.skipped.length + grade.outOfOrder.length, [
          h('h2', {}, 'Simulador terminado', ok ? passTag() : null),
          h('p', { class: 'fd-score' }, h('strong', { text: String(grade.score) }), h('span', { text: ' / 100' }), h('span', { class: 'fd-now', text: ` · ${clock(time)}` })),
          h('dl', { class: 'fd-stats' },
            stat('En orden', `${grade.inOrder} de ${total}`),
            stat('Salteados', names(grade.skipped)),
            stat('Fuera de orden', names(grade.outOfOrder)),
            stat('Toques sin control', String(grade.stray)),
            sim.asks.length ? stat('Checklist', `${right} de ${sim.asks.length}`) : null),
          wrong.length ? h('ul', { class: 'fd-missed' }, wrong.map((item) => h('li', {}, `${item.item.challenge}: `, h('strong', { text: item.item.response }), ` (elegiste ${item.picked})`))) : null,
          best ? h('p', { class: 'fd-result-note', text: `Tu mejor marca anterior: ${best.score} en ${clock(best.time)}.` }) : null,
          h('div', { class: 'fd-result-actions' },
            button('Repetir', () => start(), { class: 'fd-btn is-primary' }),
            button('Ver el flujo', () => go({ screen: 'flow', cabinId: cabin.id, flowId: flow().id, mode: 'mirar' }), { class: 'fd-btn' }),
            button('Volver al editor', back, { class: 'fd-btn is-quiet' }))]);
      }

      return {
        enter: () => start(),
        leave: stopTimers,
        panelHint: () => ({
          lista: 'Leé cada paso y tocá dónde está en la cabina.',
          memoria: 'Tocá los controles en orden, de memoria. Después elegí la acción.',
          simulador: 'Como en el examen: sin lista ni ayudas. Al final, tu nota.',
        })[level],
        overlay() {
          if (sim) {
            if (sim.phase === 'done') return { route: true, shown: steps().map((_, i) => i), marks: sim.marks.filter((mark) => mark.stray), missed: missedIndices() };
            // Solo el último toque lleva su número; los anteriores quedan como puntitos.
            const latest = sim.marks.findLastIndex((mark) => mark.label != null);
            return { shown: [], marks: sim.marks.map((mark, i) => (mark.label != null && i !== latest ? { ...mark, small: true } : mark)) };
          }
          if (!state) return { shown: [] };
          const shown = solved();
          // Mientras se repasa, el último acertado queda grande y los anteriores pasan a puntitos.
          // Al terminar vuelven todos con su número, para revisar la ruta.
          const small = state.done ? [] : shown.slice(0, -1);
          if (hint?.level === 2 && !shown.includes(hint.index)) shown.push(hint.index);
          return {
            route: !shuffled, shown: shuffled ? shown : shown.sort((a, b) => a - b), hint, marks, missed: missedIndices(),
            small, animateLast: !shuffled, slow: true,
          };
        },
        listReveal() {
          if (sim) return sim.phase === 'done' ? null : new Set();
          if (level === 'lista') return null;
          return new Set(solved().filter((index) => index !== question?.index));
        },
        listDone: () => (level === 'lista' && state ? new Set(solved()) : null),
        current: () => (level === 'lista' && state && !state.done ? state.expectedIndex : -1),
        tap(px, py) {
          const view = viewport.view();
          const index = hitTest(steps(), px, py, view);
          const { x, y } = toFraction(px, py, view);
          if (sim) {
            if (sim.phase !== 'run') return;
            // Un paso tocado dos veces cuenta una sola; un toque fuera de los pasos queda en gris.
            if (index >= 0 && sim.taps.includes(index)) return;
            sim.taps.push(index);
            const step = steps()[index];
            const count = sim.taps.filter((tap) => tap >= 0).length;
            sim.marks.push(index >= 0 ? { x: step.x, y: step.y, label: String(count) } : { x, y, stray: true });
            if (count === steps().length) { endRun(); return; }
            paint();
            renderBar();
            return;
          }
          if (!state || state.done || question) return;
          const result = reviewTap(state, index);
          state = result.state;
          if (result.result === 'hit') {
            hint = null;
            const step = steps()[index];
            flash({ x: step.x, y: step.y, ok: true });
            const choices = level === 'memoria' && step.action ? choicesFor(steps().map((item) => item.action), step.action) : [];
            if (choices.length) {
              question = { index, pos: state.current - 1, choices, correct: step.action, picked: null };
              cheer = null;
              announce(`Correcto. ¿Qué acción? ${stepName(index)}`);
            } else {
              cheer = [stepName(index), step.action].filter(Boolean).join(', ');
              clearTimeout(cheerTimer);
              cheerTimer = setTimeout(() => { cheer = null; if (state && !state.done && !question) renderBar(); }, 900);
              announce(`Correcto. ${index + 1}, ${cheer}`);
              if (state.done) finish();
            }
            renderList();
            list.querySelector('.is-current')?.scrollIntoView({ block: 'nearest' });
          } else {
            flash({ x, y, ok: false });
            cheer = null;
            announce('No es ahí');
          }
          renderBar();
          paint();
        },
        key(event) {
          if (event.metaKey || event.ctrlKey || event.altKey || !/^[1-4]$/.test(event.key)) return;
          const choices = question ? question.choices : sim?.phase === 'check' ? sim.asks[sim.at].choices : null;
          const choice = choices?.[Number(event.key) - 1];
          if (!choice) return;
          event.preventDefault();
          if (question) answer(choice); else answerCheck(choice);
        },
        bar: renderBar,
      };
    })(),
  };

  function renderAll() {
    renderToolbar();
    renderPanel();
    renderList();
    paint();
    renderLocating();
  }

  function setMode(next) {
    settleEditing();
    modes[mode].leave?.();
    hover = -1;
    closeCard();
    placing = null;
    locating = null;
    selectedNote = null;
    noteDrag = null;
    mode = next;
    editor.dataset.mode = mode;
    modeBar.replaceChildren();
    renderAll();
    modes[mode].enter?.();
  }

  const onKey = (event) => {
    if (event.defaultPrevented || event.target.matches?.('input, textarea, select, [contenteditable]')) return;
    // Espacio y Enter activan el botón o enlace con foco; el resto de las teclas sigue de largo.
    if ((event.key === ' ' || event.key === 'Enter') && event.target.matches?.('button, a')) return;
    if (document.querySelector('dialog[open]')) return;
    modes[mode].key?.(event);
  };
  const onHide = () => { if (document.visibilityState === 'hidden') autosave.flush(); };
  document.addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', onHide);

  setMode(mode);

  return {
    setMode,
    async unmount() {
      modes[mode].leave?.();
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onHide);
      stage.removeEventListener('pointermove', onStageHover);
      if (!deleted) await autosave.flush();
      viewport.destroy();
      URL.revokeObjectURL(imageUrl);
    },
  };
}
