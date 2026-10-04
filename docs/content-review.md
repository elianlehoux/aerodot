# Revisión cruzada del contenido de estudio reescrito

**Alcance:** `src/data/ppa-course.js`, `src/data/handbook-lessons.js` y `src/data/library-course.js` (`additions` y `newChapters`), comparados con `HEAD` (`git diff`), con `docs/content-style-guide.md`, con `docs/normativa-311-2026.md` y con los captions y etiquetas de `src/components/StudyDiagram.astro`. Revisión de solo lectura: no se editó ningún archivo de contenido.

**Resumen:** 26 hallazgos A (técnicos, normativos o datos perdidos), 16 B (claridad para un principiante) y 3 C (incoherencias entre cuerpo, idea y diagrama). Los más graves son A1 (resistencia inducida), A2 (Vx/Vy) y A3/A4 (tramos y entrada al circuito).

Convención: cada redacción sugerida respeta la guía (voseo y frases cortas) y está lista para pegar. "Perdido" quiere decir que el dato estaba en `HEAD` y desapareció en la reescritura.

---

## A. Errores técnicos, afirmaciones engañosas y datos perdidos

### A1. La resistencia inducida queda explicada al revés
- **Archivo:** `ppa-course.js` · **Lección:** "Resistencia, capa límite y vórtices"
- **Texto actual:** "Esa inclinación tira un poco hacia atrás. Por eso la resistencia inducida aumenta cuando el ala necesita mucha sustentación, como a baja velocidad o con mayor carga." · Idea: "La resistencia parásita crece con la velocidad; la inducida, con la sustentación que necesitás."
- **Problema:** en vuelo nivelado lento, el ala **no** necesita más sustentación: sigue igualando el peso. Lo que necesita es más ángulo de ataque (más CL), y eso es lo que aumenta la inducida. Con la idea actual, un alumno concluye que la inducida no cambia con la velocidad, y eso lo lleva a la respuesta equivocada en el examen. "Esa inclinación tira hacia atrás" no explica el mecanismo: lo que se inclina hacia atrás es la sustentación. Además, se perdió la resistencia de **interferencia**, uno de los tipos de parásita.
- **Redacción sugerida (párrafos 1 y 2):**
  > La resistencia es la fuerza que se opone al avance. La resistencia parásita viene del rozamiento, de la forma del avión y de la interferencia entre sus partes (por ejemplo, donde el ala se une al fuselaje). Aumenta mucho con la velocidad. La resistencia inducida aparece al producir sustentación.
  >
  > En las puntas del ala, el aire de abajo, que tiene más presión, se escapa hacia arriba, donde hay menos. Así se forman vórtices: remolinos que empujan hacia abajo el aire que deja el ala. Esa corriente inclina la sustentación un poco hacia atrás, y esa parte que apunta atrás es la resistencia inducida. Crece cuando el ala trabaja con mucho ángulo de ataque: al volar lento o con más carga (más peso o un viraje cerrado).
- **Idea sugerida:** "La parásita crece con la velocidad; la inducida, al volar lento o con más carga."

### A2. Vx y Vy: el uso práctico quedó confuso y una frase es falsa
- **Archivo:** `ppa-course.js` · **Lección:** "Despegue, ascenso y obstáculos"
- **Texto actual:** "Por eso Vx ayuda a comparar cuánto suelo queda al superar un obstáculo, mientras Vy describe cuánto tardás en ascender." / "Ambas cambian con las condiciones y pueden acercarse al techo absoluto, donde coinciden."
- **Problema:** "comparar cuánto suelo queda" no dice para qué sirve Vx. Se perdió la regla que pide el examen: con un obstáculo cerca, Vx; para llegar antes a la altura, Vy. La segunda frase sugiere que las velocidades "se acercan al techo"; lo correcto es que se acercan **entre sí** a medida que subís y coinciden en el techo absoluto. También se perdió la advertencia de no confundir la carrera de despegue con la distancia total para pasar un obstáculo.
- **Redacción sugerida (párrafos 2 y 3):**
  > Vx es la velocidad de mejor ángulo: ganás más altura por cada metro que avanzás. Vy es la de mejor régimen: ganás más altura por cada minuto. Si hay un obstáculo cerca después del despegue, usá Vx para pasarlo. Una vez libre, Vy te lleva más rápido a la altura que buscás.
  >
  > Al ganar altura, Vx aumenta y Vy disminuye. Se juntan en el techo absoluto, donde el avión ya no puede ascender. No confundas la carrera de despegue con la distancia total para pasar un obstáculo. Los valores de tu avión están en la tabla del manual.

### A3. Los tramos del circuito están mal enumerados y no coinciden con el diagrama
- **Archivo:** `library-course.js` · **Lección:** "Circuito de tránsito y conciencia de tráfico" (diagrama `traffic-pattern`)
- **Texto actual:** "Ordena el tránsito y permite preparar el aterrizaje: tramo inicial, viento en cola, básico y final."
- **Problema:** en la terminología argentina, "tramo inicial" **es** el tramo con viento en cola. La RAAC 91.128 habla de entrar "a 45° respecto de la trayectoria del tramo inicial", y la pregunta ANAC 5-02 dice "45° al punto medio del tramo a favor del viento". Listarlos como dos tramos distintos es un error. Además, el diagrama muestra Salida, Viento cruzado, Viento en cola, Básica y Final: no tiene ningún "tramo inicial", y la lección omite la salida y el viento cruzado.
- **Redacción sugerida:**
  > El circuito de tránsito es una secuencia de tramos alrededor de la pista: salida, viento cruzado, tramo inicial (paralelo a la pista, con viento en cola), básico y final. Ordena el tránsito y te deja preparar el aterrizaje.
- **Diagrama:** conviene que la etiqueta 3 diga "Viento en cola (tramo inicial)", para que el ingreso a 45° se lea contra el tramo que nombra la norma.

### A4. Se atribuye a la 91.128 una regla que no está verificada
- **Archivos:** `ppa-course.js` · **Lección:** "Circuito de tránsito"; `library-course.js` · **Lección:** "Circuito de tránsito y conciencia de tráfico"
- **Texto actual (PPA):** "La Sección 91.128 de la RAAC Parte 91 define el circuito tipo: […]. El ingreso se hace aproximadamente a 45° hacia el tramo inicial; no se ingresa por el tramo básico ni por el final." (La biblioteca dice algo equivalente: "no ingreses por el tramo básico ni por el final".)
- **Problema:** `docs/normativa-311-2026.md` confirma de la 91.128 vigente la izquierda, los 500 ft, los 500 m y los 45° respecto del tramo inicial. No confirma "no se ingresa por el básico ni por el final", y esa frase no estaba en `HEAD`. La guía prohíbe agregar normativa argentina que no se pueda sostener. Por otro lado, "tramo inicial" nunca se define para el principiante.
- **Redacción sugerida (PPA, párrafo 1):**
  > La Sección 91.128 de la RAAC Parte 91 define el circuito tipo: virajes a la izquierda, 500 ft (pies) de altura y al menos 500 m desde la periferia del aeródromo. Para incorporarte, entrá a unos 45° respecto del tramo inicial: el tramo paralelo a la pista, con viento en cola. En la práctica, evitá entrar directo al tramo básico o al final: ahí es difícil ver y que te vean.
- Aplicá el mismo criterio en la biblioteca: la regla de los 45° va como cita de la norma y la del básico o final, como buena práctica. Si alguien la confirma en el Anexo de la Res. 311/2026, se puede volver a citar como norma.

### A5. Alcohol: una afirmación normativa nueva que contradice al resto del sitio
- **Archivo:** `handbook-lessons.js` · **Lección:** "Alcohol, medicamentos y la noche anterior"
- **Texto actual:** "La RAAC prohíbe volar si el alcohol o una sustancia afecta la capacidad. No hay un único intervalo horario que garantice estar apto; consultá al profesional de medicina aeronáutica y las reglas vigentes."
- **Problema:** es normativa argentina agregada sin respaldo en el repo. La versión anterior de `library-course.js` ("Aptitud antes del vuelo") hablaba de "las horas mínimas de la norma", y los bancos ANAC del repo (`ivp`, `riva`, `aeroaplicador`) preguntan cuántas horas antes conviene la última ingesta (respuesta marcada: 24 h). Decir que "no hay un único intervalo" puede contradecir un plazo reglamentario de la RAAC 91.17 que no se verificó.
- **Redacción sugerida (párrafo 2):**
  > La RAAC prohíbe actuar como tripulante bajo los efectos del alcohol o de sustancias que afecten tu capacidad. Los plazos y límites exactos están en la RAAC vigente: consultalos ahí y con tu médico aeronáutico. Aunque hayas cumplido el plazo, si sentís efectos o tenés dudas, no vueles.

### A6. El punto de espera solo se explica para aeródromos con torre
- **Archivo:** `handbook-lessons.js` · **Lección:** "Marcas y carteles: frenar antes de la pista"
- **Texto actual:** "En el área de maniobras, la RAAC (Regulaciones Argentinas de Aviación Civil) exige esperar allí hasta que la torre autorice seguir; la barra de parada iluminada se respeta hasta que se apaga." · Idea: "El punto de espera marca hasta dónde avanzar, salvo que la torre autorice seguir."
- **Problema:** muchos aeródromos donde vuela un alumno PPA no tienen torre. El texto anterior cubría ese caso ("en un lugar sin servicio de control […] podés seguir después de mirar"). Tal como quedó, parece que siempre hace falta una torre, y además pone en boca de la RAAC un detalle que `normativa-311-2026.md` no confirma: solo confirma la obligación de detenerse ante puntos de espera y barras de parada iluminadas.
- **Redacción sugerida:**
  > Las marcas y carteles te orientan en el aeródromo. El punto de espera de pista indica dónde detenerte antes de entrar. La RAAC (Regulaciones Argentinas de Aviación Civil) obliga a detenerse ahí y ante una barra de parada iluminada. Si hay torre, seguís cuando te autoriza. Si no hay servicio de control, seguís después de mirar la pista y el final, según el procedimiento local.
- **Idea sugerida:** "El punto de espera es tu límite: con torre, hasta que te autorice; sin torre, hasta ver la pista libre."

### A7. La definición de "paso" contradice la del curso PPA
- **Archivo:** `library-course.js` · **Lección:** "Paso fijo, paso variable y velocidad constante"
- **Texto actual:** "El paso de una hélice es el ángulo de sus palas respecto del giro."
- **Problema:** `ppa-course.js` ("Hélice y paso") define paso como "cuánto avanza teóricamente la hélice en una vuelta" y llama "ángulo de pala" a la inclinación, que es la definición correcta. En la biblioteca, el alumno lee dos definiciones distintas del mismo término.
- **Redacción sugerida:**
  > El paso de una hélice es cuánto avanzaría en una vuelta, como un tornillo en la madera. Depende del ángulo de las palas: más ángulo, más paso. En una hélice de paso fijo, ese ángulo no se ajusta en vuelo; su diseño busca un compromiso entre distintas fases.

### A8. Ilusión somatográvica: dice "inclinación" donde va "cabeceo"
- **Archivo:** `library-course.js` · **Lección:** "Desorientación espacial e ilusiones"
- **Texto actual:** "Puede confundir un viraje prolongado con vuelo recto o una aceleración con un cambio de inclinación."
- **Problema:** una aceleración se percibe como **nariz arriba** (cabeceo). En todo el curso, "inclinación" se usa para el alabeo (alas), así que el alumno entiende algo falso.
- **Redacción sugerida:** "Puede confundir un viraje prolongado con vuelo recto, o una aceleración con la nariz que sube."

### A9. Cita normativa nueva sin fuente: "Apéndice N"
- **Archivo:** `library-course.js` · **Lección:** "GPS y cartografía electrónica"
- **Texto actual:** "En Argentina, la RAAC Parte 91, Apéndice N, contempla el GNSS como apoyo a la navegación VFR, es decir, bajo reglas de vuelo visual."
- **Problema:** la cita no estaba en `HEAD`, no aparece en `library-sources.js` y no está verificada en `docs/`. La guía dice que es mejor omitir que inventar.
- **Redacción sugerida:** "En Argentina, el uso permitido del GNSS depende de la RAAC Parte 91, de las aprobaciones del equipo y de su manual." (Si se confirma el Apéndice N, conviene sumarlo a `library-sources.js` antes de citarlo.)

### A10. "La presión suele bajar al subir"
- **Archivo:** `ppa-course.js` · **Lección:** "Atmósfera y presión"
- **Texto actual:** "La presión es el peso del aire de arriba; por eso suele bajar al subir."
- **Problema:** la presión **siempre** baja con la altura. Lo que puede variar es la temperatura (por ejemplo, con una inversión). "Suele" introduce una duda falsa.
- **Redacción sugerida:** "La presión es el peso del aire que tenés encima; por eso siempre baja al subir."

### A11. Magnetos: "encender el motor" se lee como "arrancarlo"
- **Archivo:** `ppa-course.js` · **Lección:** "Lubricación, encendido y temperatura"
- **Texto actual (idea):** "El aceite lubrica y enfría; los magnetos pueden encender el motor sin el alternador."
- **Problema:** en castellano, "encender el motor" es arrancarlo, y para eso hacen falta la batería y el motor de arranque. El cuerpo dice lo correcto ("no corta por sí sola la chispa"), pero la idea, que es lo que se memoriza, induce un error.
- **Idea sugerida:** "El aceite lubrica y enfría; los magnetos siguen dando chispa aunque falle el alternador."

### A12. CG adelantado: se perdió "más estable", que el diagrama sí muestra
- **Archivo:** `ppa-course.js` · **Lección:** "Qué cambia con el centro de gravedad" (diagrama `cg-stability`)
- **Texto actual:** "Si el centro de gravedad avanza, suele hacer falta más fuerza de cola y más esfuerzo para rotar o redondear." · Idea: "Un CG adelantado suele exigir más esfuerzo; uno atrasado reduce estabilidad y margen de recuperación."
- **Problema:** `HEAD` decía "la estabilidad aumenta", y el diagrama dice "Más estable, mandos más pesados". La lección reescrita no lo menciona, y el contraste adelante/atrás, que es clásico en el examen, queda cojo.
- **Redacción sugerida (párrafo 1, segunda oración):**
  > Si el centro de gravedad avanza, la cola tiene que empujar más hacia abajo. El avión se vuelve más estable, pero los mandos se ponen más pesados y cuesta más rotar o redondear.
- **Idea sugerida:** "CG adelante: más estable y mandos pesados. CG atrás: menos estable y más difícil de recuperar."

### A13. Se perdió la diferencia con el ángulo de incidencia
- **Archivo:** `ppa-course.js` · **Lección:** "Ángulo de ataque y sustentación"
- **Texto actual:** "No es lo mismo que cuánto apunta la nariz arriba."
- **Problema:** `HEAD` distinguía el ángulo de ataque del ángulo de incidencia. Las preguntas ANAC 1-01 y 1-02 usan justamente la incidencia como distractor.
- **Redacción sugerida (agregar al final del párrafo 1):** "Tampoco es el ángulo de incidencia: ese es el ángulo fijo con que el ala está montada, entre la cuerda y el eje longitudinal del avión."

### A14. Detonación: se perdieron las causas
- **Archivo:** `library-course.js` · **Lección:** "Detonación, preignición y temperatura"
- **Texto actual:** "Ambas pueden elevar mucho la temperatura y el esfuerzo sobre el motor. La diferencia está en cuándo empieza la combustión anormal […]"
- **Problema:** `HEAD` nombraba el combustible incorrecto, la temperatura elevada y la mezcla. Las preguntas ANAC 2-21 y 2-22 preguntan exactamente eso: combustible de menor grado y alta potencia.
- **Redacción sugerida (agregar al párrafo 2):** "La detonación suele aparecer con alta potencia y el motor caliente: combustible de menor grado que el especificado, mezcla demasiado pobre o temperatura alta de cilindros."

### A15. Hipoxia: se perdió que el monóxido causa hipoxia hipémica
- **Archivo:** `library-course.js` · **Lección:** "Oxígeno, hipoxia y monóxido de carbono" (diagrama `hypoxia-types`)
- **Texto actual:** "La hipémica ocurre cuando la sangre transporta menos oxígeno. La de estancamiento aparece cuando la circulación no lo lleva suficiente."
- **Problema:** la lección habla del CO en el párrafo 1 y de la hipémica en el párrafo 2, pero nunca las relaciona. El diagrama sí lo hace ("monóxido (CO), anemia"; "carga G"). También se perdió la acción ante una sospecha ("aplicá la lista aprobada y priorizá aterrizar").
- **Redacción sugerida:**
  > La hipémica ocurre cuando la sangre transporta menos oxígeno, por ejemplo por monóxido de carbono o anemia. La de estancamiento aparece cuando la circulación no lo lleva suficiente, por ejemplo con mucha carga G.
  - Y al final del párrafo 1: "Si sospechás monóxido, aplicá la lista aprobada y planificá aterrizar cuanto antes."

### A16. Instrumentos giroscópicos: se perdió la falla común de la fuente y la alineación con la brújula
- **Archivos:** `ppa-course.js` · **Lección:** "Instrumentos giroscópicos"; `library-course.js` · **Lección:** "Deriva del indicador de dirección"
- **Texto actual (PPA):** "El giro puede recibir energía de vacío, presión o electricidad. Un indicador libre puede derivar gradualmente y necesitar ajuste […]" · **(Biblioteca):** "La fricción y otros efectos hacen que su indicación se aparte gradualmente del rumbo real."
- **Problema:** se perdió "una falla de fuente puede afectar varios instrumentos a la vez", que es clave para reconocer una falla de vacío. "Indicador libre" no está definido y no dice contra qué se ajusta. En la biblioteca se perdió la precesión como causa de la deriva.
- **Redacción sugerida (PPA, párrafo 3):**
  > El giróscopo puede recibir energía de vacío, presión o electricidad. Si esa fuente falla, pueden fallar a la vez varios instrumentos: por eso conviene saber qué alimenta a cada uno. El indicador direccional deriva con el tiempo; alinealo con la brújula de forma periódica, en vuelo recto, nivelado y sin acelerar.
- **Biblioteca:** "La fricción, la precesión y otros efectos hacen que su indicación se aparte gradualmente del rumbo real."

### A17. ADF: se perdieron sus errores típicos
- **Archivo:** `ppa-course.js` · **Lección:** "Ayudas a la navegación"
- **Texto actual:** "ADF (equipo radiogoniométrico automático) señala una estación NDB (radiofaro no direccional)."
- **Problema:** `HEAD` decía "sujeto a errores por tormenta, costa, noche". Es un tema frecuente en el examen.
- **Redacción sugerida (agregar después):** "Su aguja puede dar indicaciones erróneas cerca de tormentas, sobre la costa y de noche."

### A18. Hiperventilación: se perdió la acción segura ante la duda
- **Archivo:** `handbook-lessons.js` · **Lección:** "Respirar de más"
- **Texto actual:** "En vuelo, si hay duda, atendé la situación según la lista y el entrenamiento del avión; no pierdas tiempo intentando diagnosticarla solo por los síntomas."
- **Problema:** `HEAD` decía qué hacer: tratarlo como un problema de oxígeno. "Atendé la situación" no le da al principiante ninguna acción concreta.
- **Redacción sugerida:**
  > En vuelo, si no sabés si es hiperventilación o hipoxia, tratalo como hipoxia: aplicá el procedimiento de oxígeno o descenso del avión. Si ya la descartaste, bajá el ritmo de la respiración.

### A19. Hielo en vuelo: faltan las condiciones y que el claro es el más peligroso
- **Archivo:** `handbook-lessons.js` · **Lección:** "Hielo sobre el avión"
- **Texto actual:** "El engelamiento en vuelo ocurre cuando gotitas de agua líquida se congelan al golpear el avión." / "El claro puede escurrir antes de congelarse y extenderse por una superficie mayor."
- **Problema:** no dice cuándo pasa (humedad visible y temperatura cercana o inferior a 0 °C), y `HEAD` lo tenía. También se perdió que el hielo claro es "más traicionero" porque cuesta verlo, otro punto de examen.
- **Redacción sugerida (párrafos 1 y 2):**
  > El engelamiento aparece cuando volás en humedad visible (nubes, lluvia o llovizna) con temperatura cercana o inferior a 0 °C. Las gotitas siguen líquidas aunque estén bajo cero y se congelan al golpear el avión.
  >
  > El hielo opaco y rugoso se congela justo donde impactan las gotas. El claro escurre antes de congelarse, se extiende por más superficie y cuesta verlo: es el más peligroso.

### A20. Estela turbulenta: se perdió qué la hace más fuerte
- **Archivos:** `library-course.js` · **Lección:** "Estela turbulenta y separación"; `ppa-course.js` · **Lección:** "Resistencia, capa límite y vórtices"
- **Texto actual:** "Una aeronave más liviana puede sentir más su efecto, sobre todo cerca del despegue y aterrizaje."
- **Problema:** las dos versiones anteriores decían que el peso, la configuración y la velocidad influyen en la intensidad. Se borró en los dos archivos.
- **Redacción sugerida (biblioteca, párrafo 2):** "La estela es más fuerte detrás de un avión pesado, lento y sin flaps, porque su ala trabaja con mucho ángulo de ataque. El viento puede desplazar esos remolinos […]"

### A21. Hélice: se perdió el ángulo de ataque de la pala y el efecto molinete
- **Archivo:** `ppa-course.js` · **Lección:** "Hélice y paso"
- **Problema:** `HEAD` advertía "no confundas paso de pala con ángulo de ataque" y que la hélice detenida genera resistencia. Las dos cosas desaparecieron.
- **Redacción sugerida (agregar al párrafo 2):** "El ángulo de pala no es el ángulo de ataque de la pala: este depende también de la velocidad de avance, que cambia el aire que recibe cada sección. Con el motor detenido, una hélice que gira por el viento (en molinete) también agrega resistencia."

### A22. Peso y balanceo: se perdió el límite de peso total
- **Archivo:** `ppa-course.js` · **Lección:** "Peso, balanceo y centro de gravedad"
- **Problema:** `HEAD` empezaba con "El peso total debe quedar dentro de los límites estructurales y de operación". Ahora solo se habla del CG, y un alumno podría creer que basta con tener el CG en rango.
- **Redacción sugerida (agregar al párrafo 2):** "El peso total también tiene un máximo: tiene que quedar dentro de los límites del avión, igual que el CG."

### A23. Variómetro: se perdió la fuga calibrada y el retardo quedó mal explicado
- **Archivos:** `ppa-course.js` · **Lección:** "Sistema pitot-estático"; `library-course.js` · **Lección:** "Marcas de velocidad y límites del instrumento"
- **Texto actual (PPA):** "El variómetro detecta cómo cambia esa presión […]" · **(Biblioteca):** "tarda en responder porque mide el cambio de presión."
- **Problema:** `HEAD` nombraba la fuga calibrada, que es lo que explica tanto el funcionamiento como el retardo. "Tarda porque mide el cambio" no es la causa.
- **Redacción sugerida (PPA):** "El variómetro compara la presión estática con la de una cámara que se llena por una pequeña fuga calibrada; esa diferencia muestra si subís o bajás."
- **Biblioteca:** "El variómetro tarda unos segundos en estabilizarse por esa fuga calibrada: primero muestra la tendencia y después el valor."

### A24. Viento: se perdió la rotación terrestre
- **Archivo:** `ppa-course.js` · **Lección:** "Viento, frentes y turbulencia"
- **Texto actual:** "El viento es aire que se mueve por diferencias de presión; el relieve y la fricción con el suelo modifican su dirección y velocidad."
- **Problema:** `HEAD` incluía la rotación terrestre. Sin ella, el alumno espera que el viento vaya directo de la alta a la baja.
- **Redacción sugerida:** "El viento nace de diferencias de presión. La rotación de la Tierra lo desvía (en el hemisferio sur, hacia la izquierda), así que no va directo de la alta a la baja. Cerca del suelo, la fricción y el relieve cambian su dirección y velocidad."

### A25. Hielo de carburador: se perdió cuándo aplicar la calefacción y qué lo favorece
- **Archivo:** `ppa-course.js` · **Lección:** "Formación de hielo en el carburador"
- **Texto actual:** "Si el sistema tiene calefacción de carburador, aplicá el procedimiento publicado para ese avión."
- **Problema:** `HEAD` decía "cuando el procedimiento lo indica, no cuando el motor ya perdió potencia" y que la humedad y la potencia cambian la probabilidad.
- **Redacción sugerida:** "El riesgo sube con humedad alta y con potencia reducida, como en un descenso. Si el sistema tiene calefacción de carburador, aplicala según el procedimiento ante los primeros indicios: no esperes a perder potencia."

### A26. Sistema eléctrico: se perdió una advertencia de seguridad
- **Archivo:** `library-course.js` · **Lección:** "Sistema eléctrico e indicaciones de falla"
- **Problema:** `HEAD` decía "No restablezcas repetidamente un interruptor automático". Es la única advertencia operativa de la lección y se perdió.
- **Redacción sugerida (agregar):** "Si salta un interruptor automático (breaker), no lo rearmes una y otra vez: seguí la lista del avión."

---

## B. Explicaciones que un principiante no entendería

### B1. El viraje de 60° no explica por qué acerca la pérdida
- **Archivo:** `ppa-course.js` · **Lección:** "Ángulo de ataque y sustentación"
- **Texto actual:** "En un viraje nivelado de 60°, el factor de carga llega a 2 g —dos veces la gravedad— y también acerca el ala a la pérdida."
- **Sugerida:** "En un viraje nivelado de 60°, el ala tiene que sostener el doble del peso (2 g). A la misma velocidad, eso exige el doble de CL, así que el ala se acerca al ángulo crítico."

### B2. "Tendencia a volver… no significa que vuelva": suena contradictorio
- **Archivo:** `ppa-course.js` · **Lección:** "Pérdida, estabilidad y controles"
- **Texto actual:** "Estabilidad es la tendencia inicial del avión a volver a su condición después de una perturbación. No significa que vuelva solo […]"
- **Sugerida:** "La estabilidad estática es la tendencia inicial del avión a volver a su condición después de una perturbación, como una ráfaga. La dinámica es lo que pasa después: si las oscilaciones se achican hasta volver, es positiva. Aun con un avión estable, el control lo seguís teniendo vos."

### B3. "Si crecen, aumentan" es una tautología
- **Archivo:** `library-course.js` · **Lección:** "Estabilidad: tendencia, amortiguamiento y control"
- **Texto actual:** "Si las oscilaciones se achican, hay amortiguamiento; si crecen, aumentan."
- **Sugerida:** "Si las oscilaciones se achican, hay amortiguamiento y la estabilidad dinámica es positiva; si crecen, es negativa." También conviene nombrar los tres casos estáticos: "volver (positiva), alejarse (negativa) o quedarse donde quedó (neutra)".

### B4. "Juntas" se confunde con la pieza del motor
- **Archivo:** `ppa-course.js` · **Lección:** "Lubricación, encendido y temperatura"
- **Texto actual:** "Por eso se vigilan su presión y temperatura: juntas, las indicaciones ayudan a detectar un problema."
- **Sugerida:** "Por eso se vigilan su presión y su temperatura. Mirá las dos indicaciones a la vez para detectar un problema."

### B5. Frente frío: "concentrar los ascensos" no se entiende
- **Archivo:** `ppa-course.js` · **Lección:** "Viento, frentes y turbulencia"
- **Texto actual:** "Un frente frío avanza con aire más frío y suele concentrar los ascensos."
- **Sugerida:** "En un frente frío, el aire frío entra como una cuña por abajo y levanta de golpe al cálido. Por eso suele traer nubes de desarrollo, chaparrones y un cambio brusco de viento en una franja angosta." (Coincide con el caption del diagrama `front`.)

### B6. Triángulo de velocidades sin su tercer lado
- **Archivo:** `ppa-course.js` · **Lección:** "Rumbo, derrota y viento"
- **Texto actual:** "El triángulo de velocidades combina, como flechas de dirección y magnitud, la velocidad verdadera del avión en el aire y la dirección e intensidad del viento."
- **Sugerida:** "El triángulo de velocidades suma dos flechas: la del avión en el aire (rumbo y TAS, velocidad verdadera) y la del viento. La flecha que resulta es lo que pasa sobre el suelo: la derrota y la GS (velocidad sobre el suelo)."

### B7. El título habla de "transición" y el cuerpo no la explica
- **Archivo:** `library-course.js` · **Lección:** "Altitud barométrica, nivel de vuelo y transición"
- **Texto actual:** "Con la presión estándar, la indicación se usa para expresar un nivel de vuelo según las reglas aplicables."
- **Sugerida:** "Con la presión estándar (1013,25 hPa), el altímetro indica niveles de vuelo. La altitud de transición es la altura a la que, al subir, cambiás a ese ajuste estándar. Al descender, al pasar el nivel de transición, volvés a QNH. Los valores de cada zona están en la AIP."

### B8. Los colores del velocímetro quedan a medias
- **Archivo:** `library-course.js` · **Lección:** "Marcas de velocidad y límites del instrumento"
- **Texto actual:** "El amarillo indica precaución; la línea roja marca un límite."
- **Sugerida:** "El arco amarillo es de precaución: usalo solo con aire calmo. La línea roja es la velocidad que nunca se debe exceder (VNE)."

### B9. ATIS aparece sin para qué
- **Archivo:** `library-course.js` · **Lección:** "Antes de rodar"
- **Texto actual:** "ATIS significa Servicio Automático de Información Terminal; ATS, servicios de tránsito aéreo. Usá la fuente disponible según el procedimiento local."
- **Sugerida:** "La pista en uso puede cambiar. Confirmala por el ATIS (Servicio Automático de Información Terminal), si existe, o con los ATS (servicios de tránsito aéreo), según el procedimiento local."

### B10. ADF: "combinar" no dice qué cuenta hacer
- **Archivo:** `handbook-lessons.js` · **Lección:** "El radiocompás y la estación que señala"
- **Texto actual:** "Al combinar esa marcación con el rumbo magnético del avión obtenés la dirección magnética hacia la estación."
- **Sugerida:** "Sumá esa marcación al rumbo magnético del avión y obtenés el rumbo magnético hacia la estación. Con rumbo 030 y la aguja en 060, la estación queda a 090. Si pasás de 360, restá 360."

### B11. La manga no tiene un "extremo cerrado"
- **Archivo:** `handbook-lessons.js` · **Lección:** "Luces, senda y manga"
- **Texto actual:** "su extremo cerrado apunta hacia donde va y el abierto, hacia donde viene."
- **Sugerida:** "La manga se infla con el viento: la boca ancha mira hacia donde viene el viento y la punta angosta, hacia donde va."

### B12. Pista blanda: el objetivo quedó vago
- **Archivo:** `handbook-lessons.js` · **Lección:** "Aterrizar con viento, en pista corta o en pista blanda"
- **Texto actual:** "En pista blanda, se busca evitar cargas innecesarias sobre las ruedas."
- **Sugerida:** "En pista blanda, el objetivo es tocar suave y mantener el peso fuera de la rueda de nariz el mayor tiempo posible, para que no se clave."

### B13. "TAS atraviesa la masa de aire"
- **Archivo:** `ppa-course.js` · **Lección:** "Velocidades y altímetro" (idea)
- **Texto actual:** "IAS es la lectura; TAS atraviesa la masa de aire; GS cuenta el viento y el terreno recorrido."
- **Sugerida:** "IAS es lo que marca el velocímetro; TAS, tu velocidad en el aire; GS, tu velocidad sobre el suelo."

### B14. "Resbale" significa dos cosas distintas y ninguna lección lo aclara
- **Archivos:** `handbook-lessons.js` · **Lección:** "El resbale"; `library-course.js` · **Lección:** "Virajes coordinados, resbale y derrape"
- **Problema:** en el handbook, el resbale es una maniobra intencional. En la biblioteca es un viraje descoordinado. Sin una aclaración, el alumno los mezcla.
- **Sugerida (biblioteca, párrafo 2):** "En un resbale, la nariz gira poco para esa inclinación y la bola cae hacia adentro del viraje. En un derrape, la nariz gira de más y la bola se va hacia afuera. Ojo: el resbale también puede hacerse a propósito para perder altura o corregir viento cruzado."

### B15. Energía: actitud y potencia quedaron indistintas
- **Archivo:** `handbook-lessons.js` · **Lección:** "De dónde sale la energía"
- **Texto actual:** "La actitud —hacia dónde apunta el avión— y la potencia afectan trayectoria y velocidad."
- **Sugerida (recupera la idea de `HEAD`):** "La actitud —hacia dónde apunta el avión— reparte la energía que ya tenés entre velocidad y altura. La potencia cambia cuánta energía total tenés."

### B16. Motor alternativo: dos frases que confunden
- **Archivo:** `ppa-course.js` · **Lección:** "El motor alternativo"
- **Texto actual:** "El ciclo Otto ideal es un modelo simplificado de esa conversión; no es el nombre de las cuatro carreras. La presión de admisión y las revoluciones sirven para controlar algunos motores con hélice de paso variable."
- **Problema:** en el material en castellano, "ciclo Otto" suele usarse como nombre del ciclo de cuatro tiempos, así que negarlo confunde. La frase sobre la presión de admisión queda suelta.
- **Sugerida:** "Este ciclo de cuatro tiempos se conoce como ciclo Otto. En aviones con hélice de paso variable, la potencia se controla mirando dos indicaciones: la presión de admisión y las revoluciones."

---

## C. Incoherencias entre lección, idea y diagrama

### C1. La idea habla del altímetro, pero el cuerpo nunca lo explica
- **Archivo:** `ppa-course.js` · **Lección:** "Atmósfera y presión" (diagrama `atmosphere`)
- **Idea actual:** "De alta presión a baja, sin reajustar el altímetro, la altitud verdadera queda más baja que la indicada."
- **Problema:** ni el cuerpo ni el diagrama tratan el reajuste del altímetro.
- **Sugerida (agregar como último párrafo):** "Si volás de una zona de alta presión a una de baja sin reajustar el altímetro, este marca más alto de lo que estás: la altitud verdadera queda por debajo de la indicada. Por eso se dice: de alta a baja, mirá abajo."

### C2. Pitot: "presión total", "de avance" y "de impacto" usadas como si fueran cosas distintas
- **Archivos:** `ppa-course.js` · **Lección:** "Sistema pitot-estático"; `library-course.js` · **Lección:** "Qué presión alimenta cada instrumento"
- **Texto actual:** el cuerpo de PPA dice "presión total"; su idea dice "Pitot aporta la presión de avance"; la biblioteca dice "presión de impacto".
- **Sugerida (idea PPA):** "El pitot recibe la presión total (la del aire más la del avance); las tomas estáticas, solo la del aire alrededor." En la biblioteca: "El tubo pitot recibe la presión total, también llamada de impacto."

### C3. VOR: la idea perdió el matiz que la hacía correcta
- **Archivo:** `handbook-lessons.js` · **Lección:** "El VOR en una sola imagen"
- **Idea actual:** "El radial sale de la estación; la aguja muestra el lado del curso, no una orden de giro."
- **Problema:** `HEAD` decía "no qué tenés que hacer **sin mirar el rumbo**". Sin esa condición, choca con la regla práctica de "volar hacia la aguja" cuando el rumbo coincide con el curso.
- **Sugerida:** "El radial sale de la estación; la aguja muestra de qué lado queda el curso. Leela junto con tu rumbo antes de virar."

---

## Observaciones fuera del alcance pedido

- **Cambió la cantidad de lecciones en `ppa-course.js`:** "Grupo motopropulsor" pasó de 4 a 5 y "Regulaciones" de 4 a 6. La guía de estilo lo prohíbe. Además, `src/pages/estudiar/[slug].astro` arma anclas `#leccion-N` por índice, así que un enlace o un reporte guardado puede apuntar a otra lección. Conviene confirmar que fue un cambio deliberado.
- **Lo que está bien verificado:** las cifras de 91.113 y 91.128 (500 ft, 500 m, 45°, 70° en el alcance, la jerarquía de cesión), el ejemplo de altitud de densidad (17 °C × 120 ft ≈ 2000 ft), n = 1/cos φ con Vs ∝ √n (50 kt → ~70 kt), el METAR de ejemplo, las octas, la ISA y el ejemplo de CG (320 ÷ 600 = 0,533 m) coinciden con `HEAD`, con `normativa-311-2026.md` y con los diagramas. La nueva explicación TO/FROM del VOR es más correcta que la anterior.
