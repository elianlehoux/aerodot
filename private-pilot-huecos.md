# Huecos de la biblioteca

Lista de control para escribir lecciones. Cruza el temario de *Private Pilot Made Easy* con la biblioteca actual (`src/data/ppa-course.js`, `library-course.js`, `handbook-lessons.js`) y con las 313 preguntas del banco PPA.

El temario de ese curso queda como mapa privado. No se copia su índice, ni sus clases de plataforma, ni sus reglas de Estados Unidos.

## Cómo leer cada ítem

- **Ya está.** La biblioteca lo explica con el detalle que hace falta.
- **Parcial.** Lo nombra y le falta el pedazo que alguien usa para entender o para responder el examen.
- **Falta, universal.** La física o la cuenta valen en cualquier país. Se puede escribir con los manuales que la biblioteca ya cita.
- **Falta, fuente argentina.** El número, el plazo o el documento salen de las RAAC o de la AIP vigentes. No se trae la cifra de la FAA.
- **No va.** Es el producto de ese curso, o una regla que en Argentina es otra.

Varias lecciones se frenan a propósito: dicen que el procedimiento se aprende en el avión y no lo inventan. Esos frenos se quedan. Lo que sigue es conocimiento que se puede explicar sin inventar una lista de emergencia.

## Escribir primero

Estas son las que el banco pregunta y la lección todavía no alcanzaba para responderlas. Quedaron escritas el 28 de octubre de 2026, en el formato de la biblioteca. Donde el cuestionario publicado no coincide con la RAAC vigente, la lección enseña el texto citado y lo dice en una frase. La segunda tanda, más abajo, no se escribió.

1. **Qué instrumento miente si se tapa el pitot, la toma estática o las dos.** Capítulo Instrumentos. Falta, universal. El banco lo pregunta en los tres casos. La lección dice que la indicación puede cambiar y no dice cuál.
2. **La familia de velocidades y los arcos.** Va, Vno, Vfe, Vs, Vne, Vx, Vy, y qué color las muestra. Capítulo Instrumentos. Parcial. Vx, Vy, VNE y los arcos están. El banco pregunta Va, Vno, Vfe, Vs y la línea roja como siglas distintas.
3. **Los cinco nombres de altitud.** Indicada, absoluta, verdadera, de presión y de densidad, y en qué caso dos de ellas coinciden. Capítulo Instrumentos. Parcial. Densidad, presión y “de alta a baja, mirá abajo” están. Absoluta, y cuándo la indicada iguala a la verdadera, no.
4. **Componente de viento de frente y cruzado.** Cómo se lee el ángulo entre el viento y la pista. Capítulo Performance. Falta, universal. El banco trae seis preguntas con figura. No hay lección.
5. **Dónde van el alerón y el elevador al rodar.** Triciclo y patín de cola, viento de frente y de cola. Capítulo Operaciones de aeródromo. Falta, universal. El banco tiene siete preguntas con figura. La lección dice que la posición se aprende en el avión y no la muestra. Conviene la técnica publicada para aviones livianos, presentada como técnica de instrucción y no como límite de cada modelo.
6. **Qué quiere decir el número de pista.** 09 y 27 son el rumbo magnético, redondeado a la decena. Capítulo Operaciones de aeródromo. Falta, universal. Una pregunta directa del banco.
7. **Niveles de crucero VFR.** Según el curso magnético, por encima de la altura en que la regla empieza. Capítulo Regulaciones o Navegación. Falta, fuente argentina. Tres preguntas del banco. No se copia la regla de la FAA: se cita la sección argentina vigente.
8. **Las cifras de la salida VFR.** Visibilidad para salir de un aeródromo controlado, visibilidad y techo fuera de una zona de control, combustible de reserva, altitud mínima sobre zona congestionada y fuera de ella. Capítulo Regulaciones. Falta, fuente argentina. La lección dice que los mínimos existen y no los da. El banco los pregunta.
9. **Papeles, cinturones, plazo sin volar y oxígeno.** Qué documentos lleva el piloto al mando. Cuándo van puestos el cinturón y el arnés. Cuánto tiempo sin actividad pide una rehabilitación con instructor. Qué se considera noche. A partir de qué altitud de cabina hace falta oxígeno. Capítulos Regulaciones y Factores humanos. Falta, fuente argentina. El camino (`pilot-path.js`) ya cuenta edad, horas, atribuciones de la 61.530 y la limitación nocturna. Estos ítems del banco no están ni ahí ni en la biblioteca.
10. **Las cuentas de la navegación.** Milla náutica, milla terrestre y kilómetro. Tiempo, distancia y velocidad terrestre. Consumo y remanente. Un triángulo de viento con números, no solo el dibujo. Capítulo Navegación. Falta, universal. Es buena parte de las 50 preguntas de ese capítulo. El triángulo está explicado; el ejemplo numérico no. No hace falta un capítulo de computadora E6B ni de CX-3.
11. **Declinación con el signo, y el huso de Argentina.** Curso verdadero 041° con 5° este: qué rumbo magnético queda. En qué huso está el país. Capítulo Navegación. Parcial la declinación; falta el huso. El signo es universal. El huso se cita como dato local.
12. **Las cuatro tendencias de la hélice.** Torque, factor P, estela de la hélice y precesión giroscópica, y en qué fase pesa cada una. Capítulo Aerodinámica. Falta, universal. El banco pregunta cuándo el torque es mayor. La lección nombra la guiñada adversa de los alerones y dice que la hélice “también” produce tendencias, sin nombrarlas. El sentido depende de para dónde gira la hélice. No se escribe “siempre a la izquierda”.
13. **Base de las nubes con temperatura y punto de rocío.** Capítulo Meteorología. Falta, universal. Dos preguntas de cálculo. La lección explica el punto de rocío y no la cuenta. La fórmula tiene que ser la que usa el material citado, no una regla suelta.

## Segunda tanda

Sirven para entender el vuelo. El banco las toca poco, o la lección ya está cerca.

| Tema | Dónde | Marca | Nota |
| --- | --- | --- | --- |
| Errores de brújula al virar y al acelerar, en el hemisferio sur | Instrumentos | Parcial | El banco pregunta la causa del desvío y cuándo la lectura es más precisa. Eso está cerca. Falta el sentido de los errores, escrito para el sur. La regla del hemisferio norte no se copia. |
| Diagrama de maniobra (Vg) atado a Va | Aerodinámica | Falta, universal | Va entra en la primera tanda. El diagrama completo es la explicación, no otra sigla. |
| Inanición y agotamiento de combustible | Motopropulsor | Falta, universal | Una es tanque o selector; la otra es quedarse sin combustible. La contaminación ya está. |
| Carburador frente a inyección | Motopropulsor | Parcial | El banco dice que el carburador de flotante se hiela más. Conviene una frase explícita. El hielo y la mezcla ya están. |
| Qué instrumentos caen si falla la succión | Instrumentos | Parcial | Se dice que comparten fuente. Falta cuál grupo se apaga junto. |
| Escarcha en el ala | Meteorología | Falta, universal | El engelamiento en vuelo ya está. La escarcha en tierra, antes de salir, no. |
| Inversión de temperatura | Meteorología | Falta, universal | Aire suave, visibilidad pobre y cortante en el tope de la capa. |
| Ilusiones con nombre | Factores humanos | Parcial | El banco pregunta qué hacer ante la desorientación, y la lección ya orienta a no seguir la sensación. Los nombres (espiral del cementerio, ilusión somatográvica, horizonte falso, pista ancha o angosta) sirven para reconocerlas. |
| Espacio aéreo como lo publica la AIP | Regulaciones | Falta, fuente argentina | Las clases A a G de la FAA no van. La lección ya advierte que la letra no se traslada de país. Falta explicar controlado, no controlado, zona de control, área de control, prohibida, restringida y peligrosa con la carta argentina. |
| Ficha de aeródromo y lectura de un NOTAM | Operaciones de aeródromo | Parcial | Se nombra la AIP y el NOTAM. Falta recorrer una ficha y un aviso de ejemplo. |
| Un cruce en una sola lección | Navegación | Falta, universal el esqueleto | Tiempo, aeródromo, ruta, performance y combustible, enlazando lecciones que ya existen. No 24 videos. Los productos se nombran con la fuente argentina (SMN, AIP). |
| Pilotaje y navegación estimada, por su nombre | Navegación | Parcial | El banco define la estima. El método está disperso en el triángulo y en la actualización en ruta. |
| Salida del circuito en un aeródromo sin control | Operaciones de aeródromo | Parcial | La entrada a 45° y el circuito tipo de la 91.128 están. El banco también pregunta la salida. Citar el criterio publicado, sin inventar un procedimiento local. |
| Códigos de transponder de emergencia | Procedimientos | Parcial | 7500, 7600 y 7700 son de uso internacional. El 1200 de la FAA no va. Inglés ya muestra el 7600. La biblioteca dice que el procedimiento argentino se estudia aparte y no lo cuenta. |
| ELT y a quién se avisa un accidente | Regulaciones o Procedimientos | Falta, fuente argentina | El NTSB y el 49 CFR 830 no van. |
| Equipo inoperativo | Regulaciones | Falta, fuente argentina | La MEL y la lista de equipo de la FAA no se enseñan como regla local. Se cita lo que dice la Parte 91 argentina. |
| Cantidad de satélites del GPS | Navegación | Falta, universal con cita | El banco pregunta cuántos forman el sistema, cuántos se ven y cuántos hacen falta para una posición. La cifra cambia con los años: se cita la fuente y se advierte que el banco puede usar la de su edición. |

## Qué ya está y no hace falta reabrir

- **Aerodinámica.** Cuatro fuerzas, ángulo de ataque, pérdida, resistencia parásita e inducida, estela, efecto suelo, factor de carga, estabilidad estática y dinámica, guiñada adversa, flaps.
- **Motopropulsor.** Cuatro tiempos, paso fijo y velocidad constante, mezcla, hielo de carburador, magnetos, aceite, eléctrico, combustible y contaminación, detonación y preignición.
- **Instrumentos.** Pitot y estática como principio, IAS/CAS/TAS/GS, QNH y nivel de vuelo, deriva del direccional, variación y desvío como ideas distintas.
- **Generalidades.** Estructura, mandos, centro de gravedad, efecto de llevarlo adelante o atrás, la cuenta de momentos, mover una carga, manual de vuelo.
- **Meteorología.** ISA, viento y Coriolis en el hemisferio sur, frentes frío y cálido, estabilidad, niebla de radiación y de advección, tormenta, cortante, engelamiento, un METAR leído grupo por grupo.
- **Performance.** Altitud de densidad, Vx y Vy, cómo se entra a una tabla. Falta la figura del viento, no el concepto.
- **Navegación.** Coordenadas, rumbo y derrota, VOR, ADF con un ejemplo de marcación, GPS y la advertencia de no creerle solo.
- **Operaciones.** Incursión, punto de espera, umbral desplazado, circuito 91.128, estela, PAPI y VASI, manga, mensaje de radio corto.
- **Maniobras.** Actitud y trayectoria, viraje coordinado, resbale, referencias en el suelo, pista corta y blanda, motor y al aire.
- **Decisión.** Peligro y riesgo, PAVE, mínimos personales, las cinco actitudes y sus antídotos, amenaza-error-estado no deseado, automatización.
- **Factores humanos.** IMSAFE, los cuatro tipos de hipoxia, monóxido, hiperventilación, adaptación a la oscuridad, fatiga. El plazo de alcohol de la FAA está marcado como dato de Estados Unidos; si se escribe el plazo, sale de la RAAC.
- **Emergencias.** Listas, energía, pérdida y barrena como ideas, falla de motor como decisión, el orden de aviar-navegar-comunicar. Sin procedimientos inventados.

## No va

Queda fuera de la biblioteca aunque el curso le dedique videos.

- Cómo usar la plataforma, horarios de consulta, comunidad, encuestas, la aplicación de realidad virtual, el podcast y la lista de compras.
- Cómo elegir escuela, leer un presupuesto y ahorrar en la instrucción de Estados Unidos.
- Piloto deportivo, recreativo, Parte 61 contra 141, BasicMed y la escala de licencias de la FAA. El camino argentino ya está en el sitio.
- Clases A a G, separaciones de nubes de la FAA, Chart Supplement, LAHSO, rutas VFR especiales, el Gran Cañón, MOA, TRSA y el código 1200.
- NTSB 830 como organismo al que se reporta.
- Dos capítulos de computadora de vuelo y uno de ForeFlight. Las cuentas sí van; la herramienta no.
- Exámenes de etapa, “preguntas típicas de la FAA” y maniobras que en ese temario son títulos vacíos. Las maniobras ya tienen capítulo propio.
- Presurización, oxígeno de abordo y turbonormalización como sistemas de un avión de línea. El oxígeno que exige la regla de cabina, en cambio, sí va en la primera tanda, porque el banco lo pregunta.
