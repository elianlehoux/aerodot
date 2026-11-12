// Menú de secciones del teléfono. El <details> ya abre y cierra sin JS;
// esto suma Escape, cierre al tocar afuera, foco y bloqueo del scroll.
export function mountSiteMenu(details) {
  const summary = details.querySelector('summary');
  const panel = details.querySelector('.site-menu-panel');
  if (!summary || !panel) return;

  const close = ({ refocus = true } = {}) => {
    if (!details.open) return;
    details.open = false;
    if (refocus) summary.focus();
  };

  details.addEventListener('toggle', () => {
    const open = details.open;
    summary.setAttribute('aria-label', open ? 'Cerrar el menú' : 'Abrir el menú de secciones');
    document.documentElement.classList.toggle('menu-lock', open);
    if (open) panel.querySelector('a')?.focus({ preventScroll: true });
  });

  // Escape se escucha en el documento: el foco puede no estar dentro del menú.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && details.open) {
      event.preventDefault();
      close();
    }
  });

  // Si el foco sale del menú con Tab, se cierra: no queda abierto sobre una página que no se puede desplazar.
  details.addEventListener('focusout', (event) => {
    if (event.relatedTarget instanceof Node && !details.contains(event.relatedTarget)) close({ refocus: false });
  });

  details.querySelector('[data-site-menu-close]')?.addEventListener('click', () => close());
  panel.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) close({ refocus: false });
  });

  // Si la pantalla se ensancha con el menú abierto, el panel deja de verse: se cierra para soltar el scroll.
  window.matchMedia('(min-width:681px)').addEventListener('change', (event) => {
    if (event.matches) close({ refocus: false });
  });
}
