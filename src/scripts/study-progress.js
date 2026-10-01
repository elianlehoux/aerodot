const STATUS_KEY = 'aerodot:study-status';
const PREVIOUS_KEY = 'altura:study-status';
const LEGACY_KEY = 'altura:lessons';

const readMap = () => {
  const map = {};
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || '[]');
    if (Array.isArray(legacy)) {
      legacy.forEach((slug) => {
        if (typeof slug === 'string' && slug) map[slug] = 'listo';
      });
    }
  } catch { /* El avance anterior ilegible no bloquea el nuevo. */ }
  try {
    const raw = localStorage.getItem(STATUS_KEY) || localStorage.getItem(PREVIOUS_KEY);
    const saved = JSON.parse(raw || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      Object.entries(saved).forEach(([slug, value]) => {
        if (value === 'curso' || value === 'listo') map[slug] = value;
      });
    }
  } catch { /* Se sigue con lo que haya podido leerse. */ }
  return map;
};

const writeMap = (map) => {
  const compact = {};
  const legacy = [];
  Object.entries(map).forEach(([slug, value]) => {
    if (value !== 'curso' && value !== 'listo') return;
    compact[slug] = value;
    if (value === 'listo') legacy.push(slug);
  });
  localStorage.setItem(STATUS_KEY, JSON.stringify(compact));
  localStorage.setItem(LEGACY_KEY, JSON.stringify(legacy));
};

const statusOf = (map, slug) => (map[slug] === 'curso' || map[slug] === 'listo' ? map[slug] : 'none');

const paint = (map) => {
  document.querySelectorAll('[data-study-slug]').forEach((group) => {
    const current = statusOf(map, group.dataset.studySlug);
    group.dataset.studyCurrent = current;
    group.querySelectorAll('[data-study-state]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.studyState === current));
    });
  });
  document.querySelectorAll('[data-complete]').forEach((button) => {
    const current = statusOf(map, button.dataset.complete);
    const label = button.querySelector('[data-complete-label]');
    if (label) label.textContent = current === 'listo' ? 'Capítulo estudiado' : 'Marcar como estudiado';
    button.setAttribute('aria-pressed', String(current === 'listo'));
    const status = button.closest('section')?.querySelector('.saved-state');
    if (!status) return;
    if (current === 'listo') status.textContent = 'Avance guardado en este dispositivo.';
    else if (current === 'curso') status.textContent = 'Quedó marcado en curso en este dispositivo.';
    else status.textContent = '';
  });
  document.querySelectorAll('[data-study-count]').forEach((node) => {
    const slugs = (node.dataset.studyCount || '').split(/\s+/).filter(Boolean);
    const ready = slugs.filter((slug) => statusOf(map, slug) === 'listo').length;
    const underway = slugs.filter((slug) => statusOf(map, slug) === 'curso').length;
    const readyLabel = `${ready} de ${slugs.length} ${slugs.length === 1 ? 'listo' : 'listos'}`;
    node.textContent = underway ? `${readyLabel} · ${underway} en curso` : readyLabel;
  });
};

const showSaveError = (anchor) => {
  const status = anchor?.closest('section')?.querySelector('.saved-state')
    ?? anchor?.closest('li')?.querySelector('[data-study-count]')
    ?? document.querySelector('[data-study-count]')
    // Sin este destino el error no se mostraba en ninguna pagina: si el control no esta
    // dentro de una .saved-state ni de un contador, el aviso se perdia en silencio.
    ?? document.querySelector('[data-progress-notice]');
  if (status) status.textContent = 'No se pudo guardar en este dispositivo.';
};

const mountStudyProgress = () => {
  if (window.__aerodotStudyProgress) return;
  if (!document.querySelector('[data-study-slug], [data-complete], [data-study-count]')) return;
  window.__aerodotStudyProgress = true;
  let map = readMap();
  paint(map);

  document.addEventListener('click', (event) => {
    const stateButton = event.target.closest('[data-study-state]');
    const completeButton = event.target.closest('[data-complete]');
    if (!stateButton && !completeButton) return;
    map = readMap();
    let slug;
    let nextStatus;
    if (stateButton) {
      slug = stateButton.closest('[data-study-slug]')?.dataset.studySlug;
      nextStatus = stateButton.dataset.studyState;
      if (!slug || (nextStatus !== 'none' && nextStatus !== 'curso' && nextStatus !== 'listo')) return;
      if (nextStatus === 'none') delete map[slug];
      else map[slug] = nextStatus;
    } else {
      slug = completeButton.dataset.complete;
      if (!slug) return;
      nextStatus = statusOf(map, slug) === 'listo' ? 'none' : 'listo';
      if (nextStatus === 'none') delete map[slug];
      else map[slug] = nextStatus;
    }
    try {
      writeMap(map);
      paint(map);
      window.posthog?.capture('study_chapter_status_changed', {
        chapter_slug: slug,
        status: nextStatus,
      });
    } catch {
      showSaveError(stateButton || completeButton);
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== STATUS_KEY && event.key !== LEGACY_KEY) return;
    map = readMap();
    paint(map);
  });
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountStudyProgress);
else mountStudyProgress();
