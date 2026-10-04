import { chapters as examChapters } from './ppa-course.js';
import { librarySources } from './library-sources.js';
import { handbookLessons } from './handbook-lessons.js';

const additions = {
  aerodinamica: [
    [
      'Las cuatro fuerzas en vuelo',
      'Sobre el avión actúan cuatro fuerzas: sustentación, peso, tracción y resistencia. El flujo alrededor del ala produce sustentación. El peso tira hacia la Tierra; la tracción impulsa y la resistencia se opone al avance.\n\nEn vuelo recto, nivelado y sin acelerar, las fuerzas se equilibran aproximadamente: sustentación con peso, y tracción con resistencia. Si el avión acelera, asciende, desciende o vira, cambian la dirección o el equilibrio. En cabina, pensá qué fuerza debe cambiar para iniciar ese movimiento. La trampa es creer que cada par siempre vale lo mismo.',
      'Para explicar un cambio de trayectoria, preguntate qué fuerza cambió y hacia dónde actúa.',
      'forces',
    ],
    [
      'Centro de presión y momento aerodinámico',
      'El centro de presión es el punto donde, para simplificar el análisis, se representa la fuerza aerodinámica total sobre un perfil. No es el centro de gravedad, que describe cómo está distribuida la masa.\n\nAl cambiar el ángulo de ataque, puede cambiar la distribución de presiones y desplazarse el centro de presión. Una fuerza aplicada lejos del centro de gravedad también tiende a hacer girar el avión; ese efecto de giro se llama momento. En el avión, ala, fuselaje y cola producen momentos que deben equilibrarse. La trampa es imaginar el centro de presión como una marca fija.',
      'Centro de presión resume una fuerza del aire; centro de gravedad resume dónde se concentra la masa.',
    ],
    [
      'Ejes del avión y movimientos',
      'El avión puede girar alrededor de tres ejes imaginarios que se cruzan en su centro de gravedad. El eje longitudinal va del morro a la cola; girar alrededor de él produce alabeo, es decir, inclinación de las alas.\n\nEl eje lateral va de punta a punta del ala; girar alrededor de él produce cabeceo, morro arriba o abajo. El eje vertical atraviesa el avión; girar alrededor de él produce guiñada, morro a izquierda o derecha. Alerones, elevador o estabilador, y timón actúan principalmente sobre esos movimientos. En vuelo pueden combinarse, así que el nombre del eje no garantiza una respuesta aislada.',
      'Longitudinal: alabeo; lateral: cabeceo; vertical: guiñada.',
      'axes',
    ],
    [
      'Viraje, factor de carga y pérdida acelerada',
      'En un viraje nivelado, la sustentación se inclina. Una parte sostiene el peso y otra hace que el avión cambie de dirección. Para no perder altura, el ala debe producir más sustentación.\n\nEl factor de carga compara la carga total con el peso. En un viraje coordinado y nivelado, n = 1/cos φ; φ es el ángulo de inclinación. A 60°, n = 2: el ala soporta el doble del peso, una carga de 2 g.\n\nAl necesitar más sustentación, el ala usa más ángulo de ataque y puede entrar en pérdida a más velocidad. La velocidad de pérdida crece con √n, la raíz cuadrada del factor de carga. Por ejemplo, si fuera 50 kt (nudos) a 1 g, a 2 g sería cerca de 70 kt. Es un ejemplo matemático, no un dato de un avión real.',
      'La trampa es pensar que una velocidad alta siempre evita la pérdida: la carga también importa.',
      'turn-load',
    ],
      [
        'Configuración, flaps y efecto suelo',
      'Los flaps son superficies móviles del ala que aumentan su curvatura. Al extenderlos, suelen permitir más sustentación a baja velocidad, pero también agregan resistencia.\n\nCerca del suelo aparece el efecto suelo. La proximidad de la superficie debilita los vórtices y reduce parte de la resistencia inducida, que aparece al producir sustentación. El avión puede flotar más de lo esperado si llega con exceso de energía. En cabina, anticipá que cambiar flaps modifica la respuesta y la trayectoria. No uses el efecto suelo para sostener una aproximación desestabilizada.',
        'Los flaps cambian sustentación y resistencia; el efecto suelo puede alargar la flotación.',
      ],
    [
      'Estabilidad: tendencia, amortiguamiento y control',
      'La estabilidad describe cómo responde el avión después de una perturbación, como una ráfaga. La estabilidad estática es la tendencia inicial: volver hacia la condición previa (positiva), alejarse (negativa) o quedarse donde quedó (neutra).\n\nLa estabilidad dinámica describe cómo cambia esa respuesta con el tiempo. Si las oscilaciones se achican, hay amortiguamiento y la estabilidad dinámica es positiva; si crecen, es negativa. El control es la capacidad del piloto de cambiar la trayectoria con los mandos. En vuelo, un avión estable no mantiene por sí solo rumbo y altura en toda condición. La respuesta depende del diseño y del centro de gravedad.',
      'Estabilidad no significa piloto automático: describe una tendencia, no quién controla el avión.',
    ],
    [
      'Guiñada adversa y coordinación',
      'La guiñada adversa es una tendencia del morro a girar al lado contrario del alabeo que se inicia. Al bajar un alerón, aumenta la sustentación de esa ala, pero también puede aumentar su resistencia.\n\nEsa diferencia de resistencia tira del morro en sentido opuesto al giro buscado. El piloto coordina con el timón de dirección y observa la bola del inclinómetro, si está instalada. Una hélice también puede producir otras tendencias de guiñada, sobre todo al cambiar potencia. En el examen, no confundas esos efectos con la guiñada adversa causada por los alerones.',
      'La resistencia desigual de los alerones puede tirar el morro contra el giro que empezás.',
    ],
    [
      'Indicios de pérdida y margen de velocidad',
      'La pérdida ocurre cuando el ala supera su ángulo de ataque crítico, el mayor ángulo al que mantiene el flujo adherido. No corresponde a una velocidad única.\n\nPuede haber vibración, aviso sonoro o menos respuesta de los mandos, pero las señales cambian entre aviones. Más peso o factor de carga puede hacer que se alcance el ángulo crítico a mayor velocidad. En cabina, reconocé los indicios enseñados para ese avión. La trampa de examen es definir la pérdida solo como “volar demasiado lento”.',
      'Pérdida significa superar el ángulo crítico; la velocidad a la que ocurre puede cambiar.',
    ],
  ],
  motopropulsor: [
    [
      'Paso fijo, paso variable y velocidad constante',
      'El paso de una hélice es cuánto avanzaría en una vuelta, como un tornillo en la madera. Depende del ángulo de las palas: más ángulo, más paso. En una hélice de paso fijo, ese ángulo no se ajusta en vuelo; su diseño busca un compromiso entre distintas fases.\n\nUna hélice de paso variable sí cambia ese ángulo. En una de velocidad constante, un gobernador —mecanismo que regula el paso— lo ajusta para sostener las revoluciones por minuto (RPM) elegidas. Puede hacerlo mientras las palas sigan dentro de su rango de regulación. En cabina, una palanca puede controlar paso o revoluciones según el sistema. La trampa es creer que “paso variable” y “velocidad constante” significan lo mismo.',
      'Paso variable permite ajustar el ángulo; velocidad constante describe qué intenta mantener el gobernador.',
    ],
    [
      'Indicios del motor y respuesta segura',
      'Los instrumentos del motor muestran variables como RPM, presión, temperatura y cantidad de combustible. Una variación puede avisar que algo cambió, pero un mismo indicio puede tener varias causas.\n\nCompará las indicaciones entre sí y con los rangos normales enseñados para ese motor. En vuelo, reconocé la señal y seguí la lista aprobada; no pruebes cambios de mezcla, calefacción o tanques por intuición. Antes de volar, ubicá cada indicador y entendé qué mide.',
      'Un indicio ayuda a reconocer una condición; por sí solo no identifica la causa.',
    ],
    [
      'Sistema eléctrico e indicaciones de falla',
      'El sistema eléctrico distribuye energía a equipos como radios, luces e instrumentos. La batería almacena energía; el alternador o generador suele producirla con el motor en marcha y recargar la batería.\n\nLa corriente pasa por circuitos y protecciones, que ayudan a limitar una sobrecarga. Una luz de carga o una indicación anormal señala un problema que hay que interpretar con el panel y la lista del avión. Si salta un interruptor automático (breaker), no intentes rearmarlo una y otra vez: seguí la lista del avión. En tierra, identificá qué equipos dependen de cada fuente. El diagrama enseña relaciones generales, no el cableado de un modelo.',
      'La batería almacena energía; el alternador o generador la produce durante el funcionamiento del motor.',
      'electrical-system',
    ],
    [
      'Recorrido del combustible y contaminación',
      'El sistema de combustible lleva combustible desde los tanques hasta el motor. Puede usar gravedad, una bomba o ambas. Los filtros retienen suciedad antes de la dosificación, que regula cuánto combustible llega al motor.\n\nUn selector permite elegir tanque en los sistemas que lo tienen. Agua, sedimentos o combustible equivocado pueden interrumpir la alimentación o dañar el motor. Durante la inspección, se comprueban cantidad y calidad con los puntos y el método de la lista. Aprendé en tierra la capacidad utilizable y cómo funciona el selector de ese avión.',
      'El recorrido general se entiende fácil; el selector y la inspección se aprenden para cada avión.',
      'fuel-system',
    ],
    [
      'Detonación, preignición y temperatura',
      'La detonación es una combustión anormal que aparece después de iniciarse el encendido normal. La preignición empieza antes de la chispa, porque un punto caliente en la cámara enciende la mezcla.\n\nAmbas pueden elevar mucho la temperatura y el esfuerzo sobre el motor. La detonación puede favorecerse con alta potencia, temperatura elevada de los cilindros, mezcla demasiado pobre o combustible de menor octanaje que el especificado. La diferencia está en cuándo empieza la combustión anormal: después de la chispa en la detonación, antes en la preignición. En vuelo, cualquier indicio se reconoce con los instrumentos y se atiende con el procedimiento aprobado para ese motor.',
      'Detonación: combustión anormal posterior a la chispa; preignición: encendido previo a la chispa.',
    ],
    [
      'Magnetos y encendido redundante',
      'Un magneto es un generador que produce electricidad para las bujías del motor. En muchos motores aeronáuticos funciona sin depender del alternador del avión.\n\nDos circuitos de encendido pueden dar redundancia: si uno falla, el otro puede seguir encendiendo sus bujías. La prueba de magnetos comprueba el funcionamiento bajo condiciones definidas. Compará las indicaciones con el límite publicado. No adivines ni copies de otro modelo la caída esperada.',
      'La prueba compara el encendido según los límites publicados para ese motor.',
    ],
    [
      'Turbina: panorama fuera del PPA inicial',
      'Una turbina comprime aire, quema combustible de forma continua y aprovecha la energía de los gases. El diseño determina cómo entrega el empuje o la potencia.\n\nEn un turbohélice, una turbina mueve una hélice por una transmisión. Un turborreactor obtiene empuje principalmente del chorro; un turbofán usa además un gran ventilador. Un turboeje entrega potencia para mover un rotor u otra carga. Son diferencias de arquitectura, no instrucciones de operación; los procedimientos requieren formación específica.',
      'Turbohélice mueve una hélice; turborreactor y turbofán producen empuje con el flujo de gases y aire.',
    ],
  ],
  instrumentos: [
    [
      'Qué presión alimenta cada instrumento',
      'El sistema pitot-estático toma dos presiones del aire. El tubo pitot recibe la presión de impacto; las tomas estáticas miden la presión del aire alrededor del avión.\n\nEl velocímetro compara ambas presiones para indicar velocidad. El altímetro usa la presión estática para estimar altitud, y el variómetro registra cómo cambia esa presión para indicar ascenso o descenso. Si una toma se obstruye, las indicaciones pueden alterarse. El esquema explica el principio, no la instalación de un modelo.',
      'El tubo pitot recibe la presión total, también llamada de impacto; las tomas estáticas reciben la presión ambiente.',
      'pitot-static',
    ],
    [
      'Lectura cruzada y detección de fallas',
      'La lectura cruzada consiste en comparar varias indicaciones relacionadas, en vez de confiar en un solo instrumento. Una aguja puede seguir mostrando un dato creíble aunque su fuente haya fallado.\n\nCompará tendencias con actitud, potencia, referencias exteriores y otros instrumentos. Si dos indicaciones que deberían coincidir se separan, tratá el dato con cautela y aplicá el procedimiento aprendido. En tierra, identificá qué instrumentos comparten fuente de energía o sensor.',
      'Detectar una indicación dudosa no significa que ya sepas qué componente falló.',
    ],
    [
      'Rumbo, variación y errores de brújula',
      'La brújula magnética se alinea con el campo magnético terrestre y muestra una referencia de rumbo. La variación es el ángulo entre el norte verdadero y el magnético; cambia según el lugar y se lee en la carta.\n\nEl propio avión también puede desviar la brújula por sus campos magnéticos; la tarjeta de desvíos registra esa corrección. Aceleraciones y virajes generan errores adicionales, cuyo sentido depende del rumbo y la latitud. En navegación, distinguí variación de la Tierra y desvío propio del avión.',
      'Variación pertenece al lugar; desvío pertenece a la instalación de la brújula.',
    ],
    [
      'IAS, CAS, TAS y velocidad sobre el suelo',
      'IAS (velocidad indicada) es lo que muestra el anemómetro. CAS (velocidad calibrada) corrige errores del instrumento y de la instalación; EAS (velocidad equivalente) también considera la compresibilidad del aire cuando importa.\n\nTAS (velocidad verdadera) es la velocidad respecto de la masa de aire. GS (velocidad sobre el suelo) resulta de sumar el efecto del viento a esa velocidad. El pitot-estático no mide GS directamente. Para estimar el tiempo de viaje, usá GS y comparala con el progreso real.',
      'IAS sale en el instrumento; TAS va con la masa de aire; GS va con el terreno.',
    ],
    [
      'Altitud barométrica, nivel de vuelo y transición',
      'El altímetro barométrico convierte la presión estática en una indicación de altura. QNH es el reglaje de presión que hace que en tierra indique aproximadamente la elevación del aeródromo sobre el nivel medio del mar.\n\nCon la presión estándar (1013,25 hPa), el altímetro indica niveles de vuelo. La altitud de transición es la altura a la que, al subir, cambiás a ese ajuste estándar. Al descender, al pasar el nivel de transición, volvés a QNH. La altitud de presión y la de densidad son valores de cálculo distintos. En Argentina, los valores de transición se consultan en la AIP vigente.',
      'El ajuste cambia la referencia del altímetro; la presión estándar sirve para expresar niveles de vuelo.',
    ],
    [
      'Marcas de velocidad y límites del instrumento',
      'Algunos anemómetros tienen arcos y líneas de color que resumen rangos de velocidad. En muchos aviones livianos, el blanco se relaciona con flaps y el verde con operación normal. El arco amarillo es de precaución: se usa solo con aire calmo. La línea roja marca VNE (velocidad que nunca se debe exceder).\n\nEl variómetro indica ascenso o descenso. El aire entra a su cámara por una pequeña fuga calibrada, que hace que tarde unos segundos en estabilizarse: primero muestra la tendencia y después el valor. En cabina, leé los instrumentos junto con las limitaciones del manual de vuelo aprobado.',
      'Los colores resumen límites y rangos; no reemplazan las condiciones que los acompañan.',
    ],
    [
      'Deriva del indicador de dirección',
      'Un indicador direccional giroscópico usa un rotor que conserva su orientación durante un tiempo. La fricción, la precesión y otros efectos hacen que su indicación se aparte gradualmente del rumbo real.\n\nEse alejamiento se llama deriva. Por eso, se compara con la brújula y se corrige cuando el procedimiento y las condiciones lo permiten. En cabina, una diferencia entre ambas indicaciones puede reflejar deriva y no un giro reciente.',
      'El indicador giroscópico deriva; compararlo con la brújula permite detectar esa diferencia.',
    ],
  ],
  regulaciones: [
    [
      'Cómo verificar una regla antes de aplicarla',
      'La RAAC, o Regulaciones Argentinas de Aviación Civil, establece requisitos para la operación en Argentina. La Parte 61 trata licencias y atribuciones; la Parte 91 reúne reglas de vuelo y operación general.\n\nLa AIP (Publicación de Información Aeronáutica) publica datos aeronáuticos; los NOTAM difunden cambios temporarios. Para responder una duda, identificá primero el tema, la fecha y el ámbito. Después consultá la publicación oficial que corresponda. Una pregunta de examen sirve para repasar su edición, pero puede no reflejar una actualización posterior.',
      'Para aplicar una regla, comprobá edición y vigencia en la publicación argentina correspondiente.',
    ],
    [
      'Planificar el vuelo y presentar un plan',
      'Planificar es reunir ruta, combustible, meteorología, aeródromos y alternativas para decidir si el vuelo es viable. Presentar un plan de vuelo es otra acción: transmitir información del vuelo a los servicios correspondientes.\n\nANAC significa Administración Nacional de Aviación Civil. Su Resolución 957/2025 modificó la Parte 91. El cambio a la Sección 91.153 entró en vigencia el 1 de marzo de 2026. Luego se aprobaron las Resoluciones 117/2026 y 311/2026, con enmiendas a la Parte 91.\n\nLos requisitos de presentación dependen de la operación y la información vigente. Para un caso real, leé el texto consolidado y las publicaciones aplicables.',
      'Planificar siempre ayuda a decidir; presentar un plan depende de los requisitos de la operación.',
    ],
  ],
  generalidades: [
    [
      'Centro de gravedad: un ejemplo de cálculo',
      'El centro de gravedad es el punto de equilibrio de la masa del avión y su carga. Para calcularlo, se usa el datum, una referencia elegida por el fabricante, y el brazo, la distancia de cada peso hasta esa referencia.\n\nMultiplicá cada peso por su brazo para obtener el momento; sumá los momentos y dividí por el peso total. Ejemplo ficticio: 400 kg a 0,20 m dan 80 kg·m; 200 kg a 1,20 m dan 240 kg·m. El total es 600 kg y 320 kg·m; 320 ÷ 600 = 0,533 m desde el datum. Es solo una cuenta ilustrativa. En una carga real se usan los datos y límites aprobados del avión.',
      'Peso por brazo da momento; momento total dividido por peso total da la posición del centro de gravedad.',
      'weight-balance',
    ],
    [
      'Manual de vuelo, placas y listas',
      'El manual de vuelo aprobado puede llamarse POH o AFM. POH significa Pilot’s Operating Handbook, manual de operación del piloto; AFM significa Aircraft Flight Manual, manual de vuelo de la aeronave.\n\nEl manual reúne límites, velocidades, procedimientos, rendimiento y datos de carga. Las placas son rótulos instalados en cabina o estructura; los suplementos agregan información sobre equipos o modificaciones. Antes de usar una cifra, verificá que el manual corresponda al modelo, serie, equipamiento y revisión del avión.',
      'Modelo, serie, equipo y revisión: comprobá los cuatro antes de usar un dato.',
    ],
    [
      'Tren de aterrizaje y frenos',
      'El tren de aterrizaje sostiene el avión en tierra y transmite las cargas de rodaje, despegue y aterrizaje. Puede ser fijo o retráctil. En el tren triciclo, una rueda está bajo el morro; en el convencional, la rueda principal queda delante de una rueda de cola.\n\nLos frenos reducen el giro de las ruedas y ayudan a desacelerar; su mando y ubicación varían. En la inspección, mirá el estado visible siguiendo la lista. En cabina, identificá cómo actúan los mandos antes de rodar.',
      'Reconocé el tipo de tren y aprendé su control antes de aplicar una técnica.',
    ],
    [
      'Dispositivos secundarios y geometría del ala',
      'La envergadura es la distancia de una punta de ala a la otra; la cuerda va del borde delantero al trasero. El alargamiento es la relación entre envergadura y cuerda. Estos términos describen la forma del ala, pero no alcanzan para deducir su rendimiento.\n\nLos flaps suelen aumentar curvatura y sustentación. Los slats ayudan al flujo sobre el borde delantero. Los spoilers reducen sustentación y aumentan resistencia. El estabilador combina funciones de estabilizador y elevador; un canard es una superficie horizontal delante del ala principal. Identificá qué componentes tiene realmente el avión.',
      'El nombre describe una pieza; su función concreta depende del diseño que tenés delante.',
    ],
    [
      'Lectura de tablas y envolvente de peso y centrado',
      'La envolvente de peso y centrado es el área del gráfico donde los cálculos deben quedar dentro de límites. El datum es el origen de medida y los brazos indican distancias respecto de él.\n\nComprobá primero unidades, modelo, configuración y revisión de la tabla. Calculá el peso y la posición del centro de gravedad con el método publicado, y ubicá ese punto en el gráfico. No extrapoles fuera de las tablas. Un ejemplo aritmético enseña el método, pero solo los datos aprobados sirven para evaluar una carga real.',
      'El punto debe quedar dentro de la envolvente correspondiente a ese avión y configuración.',
    ],
  ],
  meteorologia: [
    [
      'Tormentas, cizalladura y turbulencia severa',
      'Una tormenta puede combinar corrientes de aire que suben y bajan, granizo, lluvia intensa, rayos y turbulencia. La cizalladura es un cambio del viento en una distancia corta; cerca del suelo puede alterar rápidamente la trayectoria.\n\nEl radar y las imágenes meteorológicas ayudan a ubicar fenómenos, pero llegan con cierto retraso y no muestran cada detalle. En la planificación, reconocé su evolución y elegí una alternativa que conserve margen. La trampa es tratar una pantalla como garantía de que un paso es seguro.',
      'La tormenta combina peligros; una imagen ayuda a detectarla, pero no vuelve seguro atravesarla.',
    ],
    [
      'Leer productos meteorológicos como un conjunto',
      'METAR es un informe meteorológico rutinario de aeródromo; SPECI, un informe especial. TAF es un pronóstico para un aeródromo y un período. SIGMET avisa sobre fenómenos significativos en una zona de vuelo. SMN significa Servicio Meteorológico Nacional.\n\nCada producto tiene una hora y un área de validez. Revisá esos datos y compará aeródromos y horarios a lo largo de la ruta. Una observación describe un lugar y momento; un pronóstico no garantiza el resultado. Sumá terreno, luz diurna, alternativas y capacidad del piloto y del avión.',
      'Primero verificá hora y cobertura; después decidí qué significa para tu ruta.',
    ],
  ],
  performance: [
    [
      'Cómo trabajar una tabla de performance',
      'Una tabla de performance estima lo que puede hacer el avión bajo condiciones definidas. Empezá por la tabla de la fase correcta y confirmá peso, temperatura, viento, superficie y configuración. La altitud de presión es la que indicaría el altímetro con el reglaje estándar.\n\nSeguí las notas, unidades y método de interpolación. Usá los datos publicados sin extrapolar y distinguí carrera de pista de distancia sobre un obstáculo. Repetí el cálculo para el aterrizaje y volvé a revisar si cambian las condiciones.',
      'Cada cifra vale para sus condiciones; cambiá un dato y revisá el cálculo.',
    ],
    [
      'Peso, centrado y pista forman un solo problema',
      'La performance depende de varias condiciones a la vez. Más peso suele requerir más distancia y reducir el ascenso; un centro de gravedad fuera de límites puede afectar el control.\n\nLa superficie, pendiente, viento y obstáculos también cambian el margen. Reuní los datos reales del avión y de la pista, y usá tablas que describan ese escenario. Si el margen resulta insuficiente, revisá el plan antes de iniciar.',
      'Peso, centrado, condiciones y pista se evalúan juntos, no como datos separados.',
    ],
  ],
  navegacion: [
    [
      'Triángulo de velocidades y actualización en ruta',
      'El triángulo de velocidades suma dos movimientos: el del avión respecto del aire y el del aire respecto del suelo. Cada uno se representa con un vector, una flecha que tiene dirección y magnitud.\n\nEl viento modifica la trayectoria sobre el terreno, llamada derrota, aunque el avión mantenga el mismo rumbo. Por eso, los tiempos se estiman con velocidad sobre el suelo. En ruta, compará hora y posición con el plan; si la diferencia persiste, revisá viento, navegación y combustible antes de seguir.',
      'La derrota resulta del movimiento del avión en el aire más el movimiento del viento.',
      'wind-triangle',
    ],
    [
      'GPS y cartografía electrónica',
      'GNSS significa sistema global de navegación por satélite; GPS es una de sus constelaciones. Un receptor puede mostrar posición, trayectoria y tiempo estimado, si recibe señal y está configurado correctamente.\n\nEn Argentina, el uso permitido del GNSS depende de la RAAC Parte 91, de las aprobaciones del equipo y de su manual. La pantalla no confirma que sus datos de ruta, obstáculos o aeródromos estén actualizados. Compará con cartas y publicaciones oficiales vigentes y conocé el procedimiento ante una discrepancia.',
      'El equipo estima dónde estás; vos comprobás que la ruta y los datos sigan vigentes.',
    ],
  ],
};

const newChapters = [
  {
    id: 9,
    slug: 'operaciones-aerodromo',
    title: 'Operaciones de aeródromo',
    eyebrow: 'Orientarse en tierra y ordenar el tránsito en el circuito',
    minutes: 45,
    intro: 'Leé la información del aeródromo, entendé cada autorización y seguí el tránsito con una secuencia clara.',
    lessons: [
      [
        'Antes de rodar',
        'Antes de rodar, buscá los datos del aeródromo en la AIP (Publicación de Información Aeronáutica) y en las cartas. Los NOTAM son avisos de cambios temporarios. Confirmá pista, calles de rodaje, obras, obstáculos, frecuencias y restricciones.\n\nLa pista en uso puede cambiar. Confirmala por el ATIS (Servicio Automático de Información Terminal), si existe, o con los ATS (servicios de tránsito aéreo), según el procedimiento local. En cabina, ubicá la ruta y acordá quién maneja. Si una instrucción no queda clara, detenete en un lugar seguro y pedí que la repitan.',
        'Primero ubicá la ruta y entendé la instrucción; después empezá a rodar.',
      ],
      [
        'Arranque, comprobaciones y briefing previo al despegue',
        'El arranque pone el motor en funcionamiento; las comprobaciones posteriores permiten observar si trabaja dentro de sus límites. La prueba de motor y la revisión previa al despegue también confirman que el avión está preparado.\n\nEl briefing es un repaso hablado del plan: pista, viento, trayectoria, obstáculos, tareas y condiciones para interrumpir. Acordalo antes de entrar en la carrera. Los puntos y valores se estudian con la lista aprobada del avión.',
        'La lista organiza la comprobación; el briefing aclara qué hará cada persona.',
      ],
      [
        'Rodaje y prevención de incursiones',
        'Rodar es desplazarse por tierra con la aeronave. Una incursión de pista ocurre cuando una aeronave, vehículo o persona ocupa una pista protegida sin corresponder.\n\nSeguí la ruta en la carta y compará lo que ves con señales, marcas e instrucciones. Antes de cruzar o entrar en una pista, la vigilancia visual acompaña la autorización aplicable. Si perdés orientación o algo no coincide, detené el avión si es seguro y aclaralo antes de seguir.',
        'La autorización y la vigilancia se complementan: usá ambas antes de ocupar una pista.',
      ],
      [
        'Superficies de mando durante el rodaje',
        'Durante el rodaje, el viento empuja las alas y la cola. Ese empuje puede hacer que el avión tienda a inclinarse o girar, sobre todo con ráfagas o viento cruzado.\n\nLos alerones y el elevador pueden cambiar cómo responde el avión a ese viento. Pensá qué superficie recibe el empuje y qué movimiento podría producir. La posición de los mandos y la técnica se aprenden para el avión que volás.',
        'Entendé qué superficie recibe el viento y aplicá la técnica enseñada para ese avión.',
      ],
      [
        'Después del aterrizaje y salida de pista',
        'Después del contacto, mantené el control direccional y reducí la velocidad. Salí por una calle de rodaje cuando puedas hacerlo sin un giro brusco y según las instrucciones aplicables.\n\nUna vez fuera de la pista, ubicá la ruta siguiente antes de moverte y completá la lista posterior al aterrizaje. Las marcas y autorizaciones indican dónde continuar o detenerse. La secuencia exacta se aprende con la publicación del aeródromo y la lista del avión.',
        'Aterrizar termina el vuelo en pista; todavía falta orientarse y rodar hasta destino.',
      ],
      [
        'Circuito de tránsito y conciencia de tráfico',
        'El circuito de tránsito ordena los tramos alrededor de la pista: salida, viento cruzado, tramo inicial (paralelo a la pista, con viento en cola), básico y final. Te permite preparar el aterrizaje.\n\nLa RAAC Parte 91, Sección 91.128, establece como circuito tipo virajes a la izquierda, 500 ft (pies) de altura, al menos 500 m desde la periferia del aeródromo y una entrada a unos 45° respecto de la trayectoria del tramo inicial. Si la AIP publica otro circuito, seguí lo publicado.\n\nComo buena práctica, evitá entrar directo al tramo básico o al final: desde ahí puede ser más difícil ver y que te vean. Mirá el tránsito y comunicá tu posición cuando corresponda; el dibujo es conceptual.',
        'El esquema enseña la secuencia; la publicación del aeródromo define el circuito que vas a usar.',
        'traffic-pattern',
      ],
      [
        'Estela turbulenta y separación',
        'La estela turbulenta es el aire giratorio que queda detrás de las alas. Al producir sustentación, el aire fluye alrededor de las puntas y forma vórtices, remolinos que pueden persistir después de que pase el avión.\n\nSuele ser más intensa detrás de un avión pesado, lento y con los flaps retraídos: su ala necesita producir mucha sustentación y trabaja con más ángulo de ataque. El viento puede desplazar esos remolinos. Usá la separación y los procedimientos aplicables; la estela puede persistir aunque ya no veas al avión precedente.',
        'El avión deja remolinos invisibles; pensá dónde los llevó su trayectoria y el viento.',
      ],
      [
        'Radiotelefonía clara y confirmación',
        'La radiotelefonía es la comunicación por radio. Un mensaje claro identifica a quién llamás, quién sos, dónde estás y qué necesitás, usando la fraseología aplicable.\n\nEscuchá antes de transmitir y mantené el mensaje breve. Repetí los datos críticos cuando lo exija el servicio. En Argentina, las frecuencias y procedimientos se consultan en las publicaciones vigentes. Si no entendiste una instrucción o autorización, pedí que la repitan antes de actuar.',
        'Un mensaje corto sirve si identifica quién llama, dónde está y qué necesita.',
      ],
    ],
  },
  {
    id: 13,
    slug: 'maniobras-basicas',
    title: 'Maniobras básicas de vuelo',
    eyebrow: 'Leer la actitud y entender cómo cambia la trayectoria',
    minutes: 55,
    intro: 'Relacioná actitud, velocidad y potencia con la trayectoria en las maniobras básicas.',
    lessons: [
      [
        'Actitud, trayectoria y ángulo de ataque',
        'La actitud es hacia dónde apunta el avión respecto del horizonte; la trayectoria es hacia dónde se mueve por el aire. El ángulo de ataque mide el ángulo entre la cuerda del ala y el viento relativo, el aire que llega al avión.\n\nLa cuerda es una línea imaginaria entre el borde delantero y el trasero del ala. Si cambiás actitud, potencia o configuración, puede cambiar la trayectoria y la energía. Por eso, una misma actitud no siempre produce la misma velocidad o ascenso.',
        'El avión puede apuntar hacia un lado y moverse hacia otro: actitud no es trayectoria.',
        'flightpath',
      ],
      [
        'Vuelo recto y nivelado',
        'En vuelo recto y nivelado, el avión mantiene rumbo y altura sin girar ni subir o bajar de forma sostenida. También se busca conservar velocidad y coordinación.\n\nEl piloto observa las tendencias y hace ajustes pequeños. El compensador alivia la fuerza que aplicás a un mando y ayuda a mantener una condición; no reemplaza los mandos principales. Después de un ajuste, comprobá si produjo el efecto esperado.',
        'Ajustá poco, observá la respuesta y volvé a comprobar.',
      ],
      [
        'Ascensos y descensos',
        'Ascender significa ganar altura; descender, perderla. El avión puede intercambiar altura y velocidad, mientras la potencia y la resistencia influyen en cuánto cambia cada una.\n\nLa velocidad de mejor ángulo de ascenso (Vx) busca ganar más altura en menos distancia horizontal. La de mejor razón de ascenso (Vy) busca ganar altura en menos tiempo. Son valores de la aeronave y condición indicadas. En una maniobra, observá a la vez velocidad, altura y trayectoria.',
        'Vx gana altura sobre distancia; Vy gana altura sobre tiempo.',
      ],
      [
        'Virajes coordinados, resbale y derrape',
        'En un viraje, la inclinación de las alas ayuda a cambiar la dirección. Coordinado significa que el avión no se desplaza de costado de forma apreciable; la bola del inclinómetro ayuda a verlo.\n\nEn un viraje descoordinado, en un resbale la nariz gira poco para esa inclinación y la bola cae hacia adentro; en un derrape, la nariz gira de más y la bola se va hacia afuera. El resbale también puede hacerse a propósito para perder altura o corregir viento cruzado. Una carga mayor puede acercar el ala a la pérdida.',
        'Inclinación y guiñada deben acompañarse; la bola ayuda a comprobarlo.',
      ],
      [
        'Vuelo lento y margen respecto de la pérdida',
        'En vuelo lento, el ala necesita un ángulo de ataque mayor para sostener el peso. Los mandos pueden sentirse menos eficaces y el avión puede responder de otra manera.\n\nPotencia, flaps y coordinación afectan velocidad y trayectoria. La pérdida sigue dependiendo del ángulo de ataque crítico, no de una cifra fija. El reconocimiento y la recuperación se practican con instructor y en condiciones aprobadas para el avión.',
        'Volar lento exige más atención al ángulo de ataque y a la coordinación.',
      ],
      [
        'Despegue y decisión de interrumpir',
        'El despegue pasa del rodaje a la aceleración, luego al vuelo y al ascenso. Durante la carrera, el piloto mantiene el control direccional y compara lo que ocurre con el plan.\n\nViento, peso, superficie y obstáculos cambian la distancia necesaria. Antes de empezar, conocé las condiciones que llevarían a interrumpir la carrera y los datos publicados para el avión y la pista.',
        'Definí antes de empezar qué condición haría interrumpir el despegue.',
      ],
      [
        'Variantes de despegue y sus márgenes',
        'Un campo corto deja menos pista disponible; una superficie blanda puede aumentar la resistencia al rodaje; un obstáculo exige considerar la trayectoria inicial. Son problemas distintos y pueden requerir técnicas diferentes.\n\nUsá las tablas que correspondan a la aeronave, superficie, peso y viento. No mezcles pasos de técnicas distintas. Aprendé el objetivo y la secuencia con el manual de vuelo aprobado y el instructor.',
        'Elegí la técnica por la condición real y usá datos que describan ese escenario.',
      ],
      [
        'Aproximación, aterrizaje y motor y al aire',
        'La aproximación lleva al avión desde el circuito hasta la pista con una trayectoria y energía preparadas para aterrizar. Aterrizar incluye reducir el descenso, tocar la pista y mantener el control durante la carrera.\n\nMotor y al aire significa interrumpir el aterrizaje y volver a ascender. Se usa cuando no conviene continuar la aproximación. Los criterios y la secuencia se estudian para el avión y el aeródromo.',
        'Si no se cumplen los criterios acordados, motor y al aire conserva opciones.',
      ],
      [
        'Referencias visuales en final y aterrizaje',
        'En final, el piloto compara la posición del avión con la pista: alineación, trayectoria de descenso y desplazamiento lateral. La perspectiva cambia a medida que se acerca al suelo y aporta pistas, no una medida única.\n\nEl ancho de pista, el terreno, las luces y el viento pueden alterar esa impresión. Combiná las referencias visuales con velocidad y configuración. El diagrama es una vista lateral conceptual; no fija altura, ángulo ni punto de toma.',
        'Usá varias referencias juntas: una sola puede engañar sobre la trayectoria.',
        'landing-approach',
      ],
      [
        'Redondeo, contacto y carrera de aterrizaje',
        'El redondeo, o flare, es la transición entre el descenso y el contacto con la pista. Durante esa transición cambia la actitud para reducir el descenso y completar la toma.\n\nLa altura aparente depende de perspectiva, viento y geometría del avión. Si llega con exceso de energía, puede flotar más tiempo; después del contacto, se mantiene el control direccional mientras desacelera. Las referencias y técnicas se aprenden con instructor para la aeronave y pista.',
        'El redondeo enlaza descenso y contacto; la perspectiva cambia cómo se percibe la altura.',
      ],
    ],
  },
  {
    id: 10,
    slug: 'decision-y-riesgo',
    title: 'Decisión y gestión del riesgo',
    eyebrow: 'Reconocer peligros y conservar opciones para decidir',
    minutes: 40,
    intro: 'Identificá qué puede salir mal, qué margen tenés y cuándo conviene cambiar el plan.',
    lessons: [
      [
        'Peligros, riesgos y mitigaciones',
        'Un peligro es algo que puede causar daño; el riesgo combina qué tan probable es y qué tan grave sería. Viento cruzado, cansancio o una pista corta son ejemplos de peligros.\n\nUna mitigación es una medida que reduce la probabilidad o las consecuencias. Pensá qué barrera tenés y qué señal mostraría que dejó de alcanzar. Varios peligros juntos pueden achicar el margen aunque cada uno parezca manejable. Si el riesgo sigue alto, demorar, cambiar destino o cancelar son decisiones posibles.',
        'Nombrá el peligro, estimá sus consecuencias y comprobá si tus barreras alcanzan.',
      ],
      [
        'Un ciclo breve para decidir',
        'Decidir puede pensarse como un ciclo: observá qué pasa, interpretá qué significa, elegí una acción y comprobá el resultado. Si cambian el tiempo, combustible o estado del piloto, empezá otra vuelta.\n\nPAVE organiza la revisión del piloto, la aeronave, el entorno y las presiones externas. Es una ayuda para detectar peligros, no una regla argentina. Antes de salir, anotá señales que te harían esperar, volver o desviarte. El diagrama muestra cómo se repite el ciclo.',
        'Decidir no es un paso único: observá, interpretá, actuá y volvé a comprobar.',
        'decision-loop',
      ],
      [
        'Mínimos personales y presión externa',
        'Los mínimos personales son límites que elegís antes de volar para condiciones como visibilidad, viento, fatiga o experiencia reciente. Te ayudan a decidir si el día y el vuelo están dentro de tu capacidad.\n\nElegilos con tiempo y revisalos cuando cambien tu experiencia o situación. Nunca permiten exceder una regla ni una limitación del avión. Pasajeros, horarios o costos pueden presionarte para continuar; reconocé esa presión antes de empezar.',
        'Un límite acordado en tierra es más fácil de sostener cuando aparece presión.',
      ],
      [
        'Escenario: el pronóstico se deteriora',
        'Imaginá que el pronóstico de destino empeora y el viento real difiere del previsto. Además, llevás varias horas de actividad y el regreso tiene horario ajustado.\n\nAntes de salir, elegí alternativas y condiciones para esperar o cancelar. En ruta, compará observación, pronóstico y progreso; revisá combustible y hora estimada. Si aparece la señal que habías definido, usá la alternativa con tiempo suficiente. No hay un umbral único para todos los vuelos.',
        'Un buen plan dice qué condición te haría dejar de continuar.',
      ],
    ],
  },
  {
    id: 11,
    slug: 'factores-humanos',
    title: 'Factores humanos',
    eyebrow: 'Cómo el cuerpo y la atención cambian el vuelo',
    minutes: 45,
    intro: 'Aprendé a reconocer cuándo salud, percepción o cansancio pueden reducir tu margen como piloto.',
    lessons: [
      [
        'Aptitud antes del vuelo',
        'IMSAFE es una ayuda para revisar tu aptitud: Illness (enfermedad), Medication (medicación), Stress (estrés), Alcohol (alcohol), Fatigue (fatiga) y Emotion (emoción). Dolor, falta de sueño o una emoción intensa pueden reducir atención, coordinación y juicio.\n\nLos efectos se pueden sumar. El estrés ocupa atención; la fatiga demora respuestas. Una congestión puede impedir que se iguale la presión en el oído durante un cambio de altura. La lista no es un certificado médico ni reemplaza las reglas. Si dudás de tu aptitud, resolvelo antes de volar.',
        'Revisá cada letra y también cómo se combinan los factores ese día.',
        'imsafe',
      ],
      [
        'Oxígeno, hipoxia y monóxido de carbono',
        'La hipoxia ocurre cuando los tejidos reciben poco oxígeno. Puede afectar el juicio antes de que notes que algo anda mal. El monóxido de carbono es un gas de combustión sin olor. Si entra en la cabina, puede causar dolor de cabeza, mareo, somnolencia y confusión. Si sospechás monóxido, seguí la lista aprobada del avión y planificá aterrizar cuanto antes.\n\nHay cuatro mecanismos. La hipoxia hipóxica aparece cuando baja el oxígeno disponible, como en altura. La hipémica ocurre cuando la sangre transporta menos oxígeno, por ejemplo por monóxido de carbono o anemia. La de estancamiento aparece cuando la circulación no lo lleva suficiente, por ejemplo con mucha carga G. La histotóxica ocurre cuando los tejidos no pueden usarlo; algunas sustancias, como el alcohol, pueden interferir.\n\nEl tiempo de conciencia útil es el período en que todavía podés realizar tareas. Material de instrucción de la Administración Federal de Aviación de Estados Unidos (FAA) ofrece estimaciones aproximadas. A 18 000 ft (pies), estima 20 a 30 minutos; a 25 000 ft, pocos minutos. Son referencias, no un límite seguro.',
        'La hipoxia puede nublar el juicio antes de que el piloto reconozca sus propios síntomas.',
        'hypoxia-types',
      ],
      [
        'Desorientación espacial e ilusiones',
        'El sistema vestibular, ubicado en el oído interno, ayuda a percibir giros y aceleraciones. Puede confundir un viraje prolongado con vuelo recto, o una aceleración con la nariz que sube.\n\nNiebla, oscuridad, luces o un horizonte inclinado también pueden engañar la vista. Si el cuerpo y los instrumentos confiables parecen discrepar, la sensación corporal puede no describir la actitud real. Reconocer esas condiciones y entrenar dentro de la habilitación ayuda a prevenir la desorientación.',
        'Una sensación fuerte no siempre indica la actitud real del avión.',
      ],
      [
        'Atención, carga de trabajo y conciencia situacional',
        'La carga de trabajo es la cantidad de tareas que compiten por tu atención. Aumenta cuando se juntan navegación, comunicaciones, mal tiempo o una falla.\n\nCon demasiadas tareas, podés fijarte en un solo indicador y perder de vista el resto. La conciencia situacional es saber dónde estás, qué ocurre alrededor y qué puede pasar después. Usá listas, ordená prioridades y pedí ayuda si está disponible.',
        'Si te atrasás respecto del avión, simplificá tareas y recuperá una situación controlable.',
      ],
    ],
  },
  {
    id: 12,
    slug: 'procedimientos-emergencias',
    title: 'Procedimientos y emergencias',
    eyebrow: 'Entender las listas y conservar opciones ante una falla',
    minutes: 50,
    intro: 'Prepararte antes del vuelo ayuda a reconocer una condición anormal y responder según el avión.',
    lessons: [
      [
        'Procedimientos normales y uso de listas',
        'Un procedimiento normal es una secuencia prevista para operar el avión en condiciones habituales. La lista ayuda a recordar sus comprobaciones y reduce omisiones.\n\nCada ítem corresponde a un sistema o condición que conviene verificar. Aprendé qué busca cada punto y usá la lista aprobada para el modelo y la revisión correctos. No copies de memoria la secuencia de otro avión.',
        'La lista sirve cuando entendés qué comprueba cada paso y lo confirmás.',
      ],
      [
        'Energía en despegue, aproximación y aterrizaje',
        'La energía del avión combina movimiento y altura: más velocidad significa más energía de movimiento; más altura significa más energía potencial. Potencia, actitud y configuración cambian cómo se administra.\n\nEn una aproximación, el exceso de velocidad o altura puede exigir más espacio para estabilizarse. Una aproximación estabilizada cumple criterios observables de velocidad, trayectoria y configuración. Las velocidades y la decisión de motor y al aire se aprenden para el avión y el entrenamiento.',
        'Velocidad y altura son energía; cerca del suelo queda menos espacio para corregir.',
      ],
      [
        'Pérdidas, barrenas y prevención de pérdida de control',
        'La pérdida ocurre cuando el ala supera el ángulo de ataque crítico y deja de producir sustentación de la forma esperada. Una barrena es una rotación descendente que combina pérdida y giro alrededor de varios ejes.\n\nUna barrena puede desarrollarse cuando un ala entra en pérdida antes que la otra y el avión sigue girando. Reconocer energía y coordinación ayuda a prevenir la pérdida de control. Las maniobras y recuperaciones se practican con instructor y avión autorizados, según el entrenamiento previsto.',
        'La pérdida depende del ángulo de ataque; la barrena agrega una rotación descendente.',
      ],
      [
        'Pérdida de potencia y aterrizaje forzoso',
        'Una pérdida de potencia significa que el motor ya no entrega el empuje esperado. Un aterrizaje forzoso es una toma no planificada fuera de las condiciones normales, por una emergencia.\n\nLa altura, el terreno, el viento y los obstáculos cambian qué zonas pueden alcanzarse. El entrenamiento enseña a conservar control, elegir una opción y preparar la aeronave. Las acciones y listas concretas se estudian para el modelo; los ejercicios se practican con instructor.',
        'Una falla real exige decisiones con el margen disponible; aprendé la lista antes de volar.',
      ],
      [
        'Comunicación y contingencias',
        'En una contingencia, la radio permite informar qué ocurre y pedir asistencia. Aviate, navigate, communicate significa “controlá el avión, orientá la trayectoria, comunicá”. Es una ayuda para ordenar la atención, no una regla de prioridad para toda situación.\n\nSi la tarea de radio te hace descuidar velocidad, actitud o trayectoria, primero recuperá una condición controlable según tu entrenamiento. Después transmití posición e intención cuando sea posible. Una falla de radio tiene procedimientos propios en la RAAC, la AIP y el manual del equipo; estudialos antes del vuelo.',
        'La frase ayuda a ordenar la atención; el procedimiento concreto se aprende para la operación local.',
        'priority',
      ],
      [
        'Falla de comunicaciones: reconocer el alcance',
        'Una falla de comunicaciones puede afectar la transmisión, la recepción o ambas. Reconocer qué lado parece fallar ayuda a describir el problema, pero no determina por sí solo qué hacer.\n\nLa respuesta cambia con las reglas, el espacio aéreo, la fase del vuelo y el equipo. Estudiá en tierra el procedimiento de la RAAC, la AIP y los manuales aplicables. Un código o señal aprendido para otro país no se traslada automáticamente a Argentina.',
        'Primero identificá qué comunicación falla; después aplicá el procedimiento local estudiado.',
      ],
    ],
  },
];

const sourceIds = {
  aerodinamica: ['phak', 'afh'],
  motopropulsor: ['phak', 'afh'],
  instrumentos: ['phak'],
  regulaciones: ['anacPpa', 'raac', 'raac61', 'raac91', 'raac91Plan', 'raac91Equipment', 'raac91BushStol', 'aip'],
  generalidades: ['phak', 'weightBalance', 'anacPpa'],
  meteorologia: ['phak', 'weather', 'metArgentina', 'raac203'],
  performance: ['phak', 'afh', 'weightBalance'],
  navegacion: ['phak', 'aip'],
  'operaciones-aerodromo': ['phak', 'afh', 'aip', 'raac'],
  'decision-y-riesgo': ['phak', 'risk', 'anacPpa'],
  'factores-humanos': ['phak', 'risk', 'anacPpa'],
  'procedimientos-emergencias': ['afh', 'phak', 'anacPpa', 'raac', 'aip'],
  'maniobras-basicas': ['afh', 'phak', 'anacPpa'],
};

/**
 * Frontera biblioteca <-> banco de exámenes.
 *
 * Los primeros ocho capítulos coinciden 1:1 con el temario del examen PPA: mismo título, mismo
 * orden, y por eso tienen preguntas publicadas para practicar. Los cinco restantes son material
 * propio de la biblioteca y no tienen banco asociado.
 *
 * El vínculo se declara explícitamente en vez de heredarse de la posición en el temario, para que
 * mover o agregar un capítulo no cambie en silencio el destino del botón del pie. El `id` del
 * capítulo de biblioteca ya no es además el número de capítulo de examen.
 */
export const EXAM_LINK = Object.freeze(
  Object.fromEntries(examChapters.map((chapter) => [chapter.slug, chapter.id])),
);
export const EXAM_LINK_LABEL = 'Examen PPA';
export const LIBRARY_ONLY_REASON = 'Tema de biblioteca: todavía no hay banco de examen asociado.';

const withExamLink = (chapter, lessons) => ({
  ...chapter,
  lessons,
  sources: (sourceIds[chapter.slug] ?? ['anacPpa', 'phak']).map((id) => librarySources[id]),
  examChapterId: EXAM_LINK[chapter.slug] ?? null,
});

const expandedExamChapters = examChapters.map((chapter) => withExamLink(
  chapter,
  [...chapter.lessons, ...(additions[chapter.slug] ?? []), ...(handbookLessons[chapter.slug] ?? [])],
));

export const chapters = [...expandedExamChapters, ...newChapters.map((chapter) => withExamLink(
  chapter,
  [...chapter.lessons, ...(handbookLessons[chapter.slug] ?? [])],
))].sort((a, b) => a.id - b.id);
