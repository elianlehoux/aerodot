# Flowdot: flechas que se arquean y se destacan

Fecha: 2026-11-18. Estado: para aprobar. Rama: `elianlehoux/rediseno-UI`.

## Por qué

Hoy la ruta es una curva automática que pasa por todos los pasos. Cuando hay pasos cerca, las flechas quedan encimadas o casi rectas y no se lee el orden del flujo. Flowdeck, la app en la que se basa Flowdot, deja arquear cada flecha y la destaca al pasar el mouse. Flowdot tiene que poder hacer lo mismo.

## Qué se decidió

1. Una sola curva por flecha (opción A): un puntito por tramo que la arquea hacia un lado u otro. No hay codos libres.
2. La curva se guarda relativa a la flecha (opción 1): un número que dice cuánto se aleja del medio y hacia qué lado, en proporción al largo del tramo. Si se mueve un paso, la flecha conserva su forma.
3. Las flechas que nunca se tocaron siguen con la curva automática de hoy.

## Enfoques considerados

- **Curva relativa a la flecha** (elegido): sobrevive a mover pasos, nunca queda una curva rara.
- **Puntito fijo en la foto**: pasa justo por un lugar, pero al mover un paso queda sin sentido y hay que reacomodarlo.
- **Varios codos por flecha**: más control para esquivar paneles, más difícil en el teléfono. Descartado.

## Diseño

**Dato.** Cada paso puede tener `bend`, un número entre -1 y 1: la curvatura de la flecha que llega a ese paso. Sin `bend`, esa flecha es automática. 0 es recta. El valor es la distancia del puntito al medio del tramo, perpendicular, dividida por el largo del tramo; el signo dice el lado.

**Geometría.** Una flecha arqueada es una curva que pasa por el puntito en su mitad (cuadrática pasada a cúbica). Sale con el mismo formato de tramo que ya usa `routeSegments`, así la ruta, la punta de flecha, la impresión y el PNG la dibujan sin cambios aparte. Los puntos de control siguen sin salir de la imagen.

**Editar (con mouse).**
- Al pasar el mouse por una flecha, aparece su puntito en la mitad, en lugar de la punta de flecha.
- Las flechas que llegan y salen del paso seleccionado también muestran su puntito.
- Arrastrar el puntito arquea la flecha. Soltar guarda (entra en deshacer y rehacer).
- Doble clic en el puntito vuelve la flecha a automática.
- Los pasos tienen prioridad: si el toque cae sobre un paso, se mueve el paso.

**Editar (tablet y teléfono).** Tocar una flecha la selecciona y muestra su puntito; después se arrastra igual. Doble toque en el puntito la vuelve a automática.

**Destacar al pasar por arriba.** En Editar y Mirar, la flecha bajo el mouse se engrosa y un brillo corto la recorre en el sentido del flujo, en bucle. Los dos pasos que une se destacan, y en la lista se marca el paso al que llega. Al revés también: pasar por una fila de la lista destaca la flecha que llega a ese paso. Con "reducir movimiento" activado no hay brillo que corre, solo el grosor. En Repasar no hay destacado (la ruta está oculta).

**Reordenar y borrar.** Si un paso cambia de lugar o se borra, las flechas que quedan uniendo pasos distintos vuelven a automática. Una curva pensada para otro tramo no tiene sentido en el nuevo.

**Archivo `.flowdot`.** Cada paso puede llevar `bend`. Sigue siendo la versión 1: los archivos viejos se abren igual y un Flowdot viejo que abre uno nuevo ignora las curvas. Al importar, un `bend` que no sea un número entre -1 y 1 da error y dice qué paso está mal.

## No entra

- Codos múltiples o flechas que esquivan obstáculos solas.
- Cambiar el color o el grosor de una flecha en particular.
- Curvas en Repasar.

## Pruebas

- Geometría: una flecha arqueada pasa por el puntito en su mitad; la forma se conserva al mover un paso; sin `bend` sale la curva automática de hoy.
- Ediciones: arquear, volver a automática, y que reordenar o borrar limpie las flechas que cambiaron de extremo.
- Archivo: `bend` se exporta y se vuelve a importar igual; uno fuera de rango da error.
- A mano en el navegador: arrastrar, doble clic, tablet, destacado y que la impresión y el PNG respeten las curvas.

## Queda para quien lo construye

El tamaño exacto del puntito, la duración del brillo y cuánto se engrosa la flecha, dentro del estilo actual de Flowdot.
