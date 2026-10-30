import { defineIcons } from '@animateicons/vanilla';
import { ArrowRight, ArrowUp, Copy, Download, Github, Moon, Play, Share, Square, Sun, Volume2, X } from '@animateicons/vanilla/lucide';

defineIcons({ ArrowRight, ArrowUp, Copy, Download, Github, Moon, Play, Share, Square, Sun, Volume2, X });

// El ícono se anima al pasar sobre el botón o el link entero, no solo sobre el dibujo.
document.addEventListener('pointerover', (event) => {
  const host = event.target instanceof Element ? event.target.closest('button, a') : null;
  if (!host || host.contains(event.relatedTarget)) return;
  host.querySelectorAll('animate-icons').forEach((icon) => icon.startAnimation?.());
});
