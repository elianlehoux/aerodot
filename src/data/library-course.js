import { chapters as examChapters } from './ppa-course.js';
import { librarySources } from './library-sources.js';
import { handbookLessons } from './handbook-lessons.js';
import { maneuverChapters } from './maneuvers.js';

const additions = {
  aerodinamica: [
    [
      'Las cuatro fuerzas en vuelo',
      'Sobre el avión actúan cuatro fuerzas: sustentación, peso, tracción y resistencia. El flujo alrededor del ala produce sustentación. El peso tira hacia la Tierra. La tracción impulsa y la resistencia se opone al avance.\n\nEn vuelo recto, nivelado y sin acelerar, las fuerzas se equilibran aproximadamente: sustentación con peso, y tracción con resistencia. Si el avión acelera, asciende, desciende o vira, cambian la dirección o el equilibrio. En cabina, pensá qué fuerza debe cambiar para iniciar ese movimiento. La trampa es creer que cada par siempre vale lo mismo.',
      'Para explicar un cambio de trayectoria, preguntate qué fuerza cambió y hacia dónde actúa.',
      'forces',
    ],
    [
      'Centro de presión y momento aerodinámico',
      'El centro de presión es el punto donde, para simplificar el análisis, se representa la fuerza aerodinámica total sobre un perfil. No es el centro de gravedad, que describe cómo está distribuida la masa.\n\nAl cambiar el ángulo de ataque, puede cambiar la distribución de presiones y desplazarse el centro de presión. Una fuerza aplicada lejos del centro de gravedad también tiende a hacer girar el avión. Ese efecto de giro se llama momento. En el avión, ala, fuselaje y cola producen momentos que deben equilibrarse. La trampa es imaginar el centro de presión como una marca fija.',
      'El centro de presión resume una fuerza del aire. El centro de gravedad resume dónde se concentra la masa.',
    ],
    [
      'Ejes del avión y movimientos',
      'El avión puede girar alrededor de tres ejes imaginarios que se cruzan en su centro de gravedad. El eje longitudinal va del morro a la cola. Girar alrededor de él produce alabeo, es decir, inclinación de las alas.\n\nEl eje lateral va de punta a punta del ala. Girar alrededor de él produce cabeceo, morro arriba o abajo. El eje vertical atraviesa el avión. Girar alrededor de él produce guiñada, morro a izquierda o derecha. Alerones, elevador o estabilador, y timón actúan principalmente sobre esos movimientos. En vuelo pueden combinarse, así que el nombre del eje no garantiza una respuesta aislada.',
      'Longitudinal: alabeo. Lateral: cabeceo. Vertical: guiñada.',
      'axes',
    ],
    [
      'Viraje, factor de carga y pérdida acelerada',
      'En un viraje nivelado, la sustentación se inclina. Una parte sostiene el peso y otra hace que el avión cambie de dirección. Para no perder altura, el ala debe producir más sustentación.\n\nEl factor de carga compara la carga que soporta el ala con el peso del avión. En un viraje coordinado y nivelado depende solo de la inclinación.\n\nEQ: n = 1 / cos φ | n: factor de carga, en g | φ: ángulo de inclinación de las alas\n\nA 30° de inclinación, n es cerca de 1,15. A 45°, cerca de 1,41. A 60°, n = 2: el ala soporta el doble del peso, una carga de 2 g.\n\nPara sostener esa carga, el ala usa más ángulo de ataque y entra en pérdida a más velocidad. La velocidad de pérdida crece con la raíz cuadrada del factor de carga.\n\nEQ: V_Sn = V_S · √n | V_Sn: velocidad de pérdida en el viraje | V_S: velocidad de pérdida en vuelo recto, a 1 g | n: factor de carga del viraje\n\nPor ejemplo, si la velocidad de pérdida fuera 50 kt (nudos) a 1 g, en un viraje de 60° (n = 2) sería 50 × 1,41, cerca de 71 kt. Es un ejemplo de cálculo, no un dato de un avión real.',
      'La trampa es pensar que una velocidad alta siempre evita la pérdida. La carga también importa.',
      'turn-load',
    ],
      [
        'Configuración, flaps y efecto suelo',
      'Los flaps son superficies móviles del ala que aumentan su curvatura. Al extenderlos, suelen permitir más sustentación a baja velocidad, pero también agregan resistencia.\n\nCerca del suelo aparece el efecto suelo. La proximidad de la superficie debilita los vórtices y reduce parte de la resistencia inducida, que aparece al producir sustentación. El avión puede flotar más de lo esperado si llega con exceso de energía. En cabina, anticipá que cambiar flaps modifica la respuesta y la trayectoria. No uses el efecto suelo para sostener una aproximación desestabilizada.',
        'Los flaps cambian la sustentación y la resistencia. El efecto suelo puede alargar la flotación.',
      ],
    [
      'Estabilidad: tendencia, amortiguamiento y control',
      'La estabilidad describe cómo responde el avión después de una perturbación, como una ráfaga. La estabilidad estática es la tendencia inicial: volver hacia la condición previa (positiva), alejarse (negativa) o quedarse donde quedó (neutra).\n\nLa estabilidad dinámica describe cómo cambia esa respuesta con el tiempo. Si las oscilaciones se achican, hay amortiguamiento y la estabilidad dinámica es positiva. Si crecen, es negativa. El control es la capacidad del piloto de cambiar la trayectoria con los mandos. En vuelo, un avión estable no mantiene por sí solo rumbo y altura en toda condición. La respuesta depende del diseño y del centro de gravedad.',
      'Estabilidad no significa piloto automático. Describe una tendencia, no quién controla el avión.',
    ],
    [
      'Guiñada adversa y coordinación',
      'La guiñada adversa es una tendencia del morro a girar al lado contrario del alabeo que se inicia. Al bajar un alerón, aumenta la sustentación de esa ala, pero también puede aumentar su resistencia.\n\nEsa diferencia de resistencia tira del morro en sentido opuesto al giro buscado. El piloto coordina con el timón de dirección y observa la bola del inclinómetro, si está instalada. Una hélice también puede producir otras tendencias de guiñada, sobre todo al cambiar potencia. En el examen, no confundas esos efectos con la guiñada adversa causada por los alerones.',
      'La resistencia desigual de los alerones puede tirar el morro contra el giro que empezás.',
      'adverse-yaw',
    ],
    [
      'Indicios de pérdida y margen de velocidad',
      'La pérdida ocurre cuando el ala supera su ángulo de ataque crítico, el mayor ángulo al que mantiene el flujo adherido. No corresponde a una velocidad única.\n\nPuede haber vibración, aviso sonoro o menos respuesta de los mandos, pero las señales cambian entre aviones. Más peso o factor de carga puede hacer que se alcance el ángulo crítico a mayor velocidad. En cabina, reconocé los indicios enseñados para ese avión. La trampa de examen es definir la pérdida solo como «volar demasiado lento».',
      'Pérdida significa superar el ángulo crítico. La velocidad a la que ocurre puede cambiar.',
    ],
    [
      'Lo que la hélice tiende a hacer',
      'Una hélice que gira empuja el avión y, además, lo tuerce. El sentido depende de para dónde gira, vista desde la cabina. En muchos entrenadores gira en sentido horario hacia adelante. Con ese giro, tres de estas tendencias van a la izquierda. Si la hélice gira al revés, el sentido se da vuelta.\n\nEl torque es la reacción al giro del motor y tiende a inclinar el avión. Pesa más con mucha potencia y poca velocidad. La estela en espiral golpea la cola de un lado y tiende a guiñar. Se nota en la misma condición que el torque: mucha potencia y baja velocidad.\n\nEl factor P aparece con mucho ángulo de ataque. La pala que baja muerde más aire que la que sube, y el empuje queda desparejo. Se nota en el despegue y en el ascenso. La precesión giroscópica se siente unos 90° más adelante, en el sentido del giro. En un patín de cola, al levantar la cola, esa fuerza guiña a la izquierda si la hélice es horaria desde la cabina.\n\nLa guiñada adversa de los alerones no es ninguna de estas: viene del ala. Cómo se corrige cada una se practica en tu avión.',
      'Con hélice horaria desde la cabina, torque, estela y factor P pesan a la izquierda y con mucha potencia.',
    ],
  ],
  motopropulsor: [
    [
      'Paso fijo, paso variable y velocidad constante',
      'El paso de una hélice es cuánto avanzaría en una vuelta, como un tornillo en la madera. Depende del ángulo de las palas: más ángulo, más paso. En una hélice de paso fijo, ese ángulo no se ajusta en vuelo. Su diseño busca un compromiso entre distintas fases.\n\nUna hélice de paso variable sí cambia ese ángulo. En una de velocidad constante, un gobernador, mecanismo que regula el paso, lo ajusta para sostener las revoluciones por minuto (RPM) elegidas. Puede hacerlo mientras las palas sigan dentro de su rango de regulación. En cabina, una palanca puede controlar paso o revoluciones según el sistema. La trampa es creer que «paso variable» y «velocidad constante» significan lo mismo.',
      'Paso variable permite ajustar el ángulo. Velocidad constante describe qué intenta mantener el gobernador.',
    ],
    [
      'Indicios del motor y respuesta segura',
      'Los instrumentos del motor muestran variables como RPM, presión, temperatura y cantidad de combustible. Una variación puede avisar que algo cambió, pero un mismo indicio puede tener varias causas.\n\nCompará las indicaciones entre sí y con los rangos normales enseñados para ese motor. En vuelo, reconocé la señal y seguí la lista aprobada. No pruebes cambios de mezcla, calefacción o tanques por intuición. Antes de volar, ubicá cada indicador y entendé qué mide.',
      'Un indicio ayuda a reconocer una condición. Por sí solo no identifica la causa.',
    ],
    [
      'Sistema eléctrico e indicaciones de falla',
      'El sistema eléctrico distribuye energía a equipos como radios, luces e instrumentos. La batería almacena energía. El alternador o generador suele producirla con el motor en marcha y recargar la batería.\n\nLa corriente pasa por circuitos y protecciones, que ayudan a limitar una sobrecarga. Una luz de carga o una indicación anormal señala un problema que hay que interpretar con el panel y la lista del avión. Si salta un interruptor automático (breaker), no intentes rearmarlo una y otra vez. Seguí la lista del avión. En tierra, identificá qué equipos dependen de cada fuente. El diagrama enseña relaciones generales, no el cableado de un modelo.',
      'La batería almacena energía. El alternador o generador la produce durante el funcionamiento del motor.',
      'electrical-system',
    ],
    [
      'Recorrido del combustible y contaminación',
      'El sistema de combustible lleva combustible desde los tanques hasta el motor. Puede usar gravedad, una bomba o ambas. Los filtros retienen suciedad antes de la dosificación, que regula cuánto combustible llega al motor.\n\nUn selector permite elegir tanque en los sistemas que lo tienen. Agua, sedimentos o combustible equivocado pueden interrumpir la alimentación o dañar el motor. Durante la inspección, comprobá la cantidad y la calidad con los puntos y el método de la lista. Aprendé en tierra la capacidad utilizable y cómo funciona el selector de ese avión.',
      'El recorrido general se entiende fácil. El selector y la inspección se aprenden para cada avión.',
      'fuel-system',
    ],
    [
      'Detonación, preignición y temperatura',
      'La detonación es una combustión explosiva y descontrolada de la mezcla que todavía no se quemó. Aparece después de la chispa normal. La preignición empieza antes de la chispa, porque un punto caliente en la cámara enciende la mezcla.\n\nAmbas pueden elevar mucho la temperatura y el esfuerzo sobre el motor. La detonación puede favorecerse con alta potencia, temperatura elevada de los cilindros, mezcla demasiado pobre o combustible de menor octanaje que el especificado. La diferencia está en cuándo empieza la combustión anormal: después de la chispa en la detonación, antes en la preignición. En vuelo, reconocé cualquier indicio con los instrumentos y atendelo con el procedimiento aprobado para ese motor.',
      'Detonación: combustión anormal posterior a la chispa. Preignición: encendido previo a la chispa.',
    ],
    [
      'Magnetos y encendido redundante',
      'Un magneto es un generador que produce electricidad para las bujías del motor. En muchos motores aeronáuticos funciona sin depender del alternador del avión.\n\nDos circuitos de encendido pueden dar redundancia: si uno falla, el otro puede seguir encendiendo sus bujías. La prueba de magnetos comprueba el funcionamiento bajo condiciones definidas. Compará las indicaciones con el límite publicado. No adivines ni copies de otro modelo la caída esperada.',
      'La prueba compara el encendido según los límites publicados para ese motor.',
    ],
    [
      'Turbina: panorama fuera del PPA inicial',
      'Una turbina comprime aire, quema combustible de forma continua y aprovecha la energía de los gases. El diseño determina cómo entrega el empuje o la potencia.\n\nEn un turbohélice, una turbina mueve una hélice por una transmisión. Un turborreactor obtiene empuje principalmente del chorro. Un turbofán usa además un gran ventilador. Un turboeje entrega potencia para mover un rotor u otra carga. Son diferencias de arquitectura, no instrucciones de operación. Los procedimientos requieren formación específica.',
      'Turbohélice mueve una hélice. Turborreactor y turbofán producen empuje con el flujo de gases y aire.',
    ],
    [
      'Los dos mandos de la velocidad constante',
      'En una hélice de velocidad constante hay dos indicaciones distintas. La presión de admisión es la presión del aire en el múltiple de entrada. La controlás con el acelerador. Las revoluciones las sostiene el gobernador, y las elegís con el mando de paso.\n\nPara subir la potencia, primero subí las revoluciones y después la admisión. Para bajarla, primero bajá la admisión y después las revoluciones. Ese orden evita mucha admisión con pocas revoluciones.\n\nLa precaución es justamente esa combinación: mucha presión de admisión con pocas revoluciones. Qué palanca es cada una lo dice el manual de tu avión. En un motor con turbo, el límite puede ser otro.',
      'Subir potencia: primero revoluciones, después admisión. Bajar: al revés.',
    ],
  ],
  instrumentos: [
    [
      'Qué presión alimenta cada instrumento',
      'El sistema pitot-estático toma dos presiones del aire. El tubo pitot recibe la presión de impacto. Las tomas estáticas miden la presión del aire alrededor del avión.\n\nEl velocímetro compara ambas presiones para indicar velocidad. El altímetro usa la presión estática para estimar altitud, y el variómetro registra cómo cambia esa presión para indicar ascenso o descenso. Si una toma se obstruye, las indicaciones pueden alterarse. El esquema explica el principio, no la instalación de un modelo.',
      'El tubo pitot recibe la presión total, también llamada de impacto. Las tomas estáticas reciben la presión ambiente.',
      'pitot-static',
    ],
    [
      'Lectura cruzada y detección de fallas',
      'La lectura cruzada consiste en comparar varias indicaciones relacionadas, en vez de confiar en un solo instrumento. Una aguja puede seguir mostrando un dato creíble aunque su fuente haya fallado.\n\nCompará tendencias con actitud, potencia, referencias exteriores y otros instrumentos. Si dos indicaciones que deberían coincidir se separan, tratá el dato con cautela y aplicá el procedimiento aprendido. En tierra, identificá qué instrumentos comparten fuente de energía o sensor.',
      'Detectar una indicación dudosa no significa que ya sepas qué componente falló.',
    ],
    [
      'Rumbo, variación y errores de brújula',
      'La brújula magnética se alinea con el campo magnético terrestre y muestra una referencia de rumbo. La variación es el ángulo entre el norte verdadero y el magnético. Cambia según el lugar y se lee en la carta.\n\nEl propio avión también puede desviar la brújula por sus campos magnéticos. La tarjeta de desvíos registra esa corrección. Aceleraciones y virajes generan errores adicionales, cuyo sentido depende del rumbo y la latitud. En navegación, distinguí variación de la Tierra y desvío propio del avión.',
      'Variación pertenece al lugar. Desvío pertenece a la instalación de la brújula.',
    ],
    [
      'IAS, CAS, TAS y velocidad sobre el suelo',
      'IAS (velocidad indicada) es lo que muestra el velocímetro. CAS (velocidad calibrada) corrige errores del instrumento y de la instalación. EAS (velocidad equivalente) también considera la compresibilidad del aire cuando importa.\n\nTAS (velocidad verdadera) es la velocidad respecto de la masa de aire. GS (velocidad sobre el suelo) resulta de sumar el efecto del viento a esa velocidad. El pitot-estático no mide GS directamente. Para estimar el tiempo de viaje, usá GS y comparala con el progreso real.',
      'IAS sale en el instrumento. TAS va con la masa de aire. GS va con el terreno.',
      'airspeed-chain',
    ],
    [
      'Altitud barométrica, nivel de vuelo y transición',
      'El altímetro barométrico convierte la presión estática en una indicación de altura. QNH es el reglaje de presión que hace que en tierra indique aproximadamente la elevación del aeródromo sobre el nivel medio del mar.\n\nCon la presión estándar (1013,25 hPa), el altímetro indica niveles de vuelo. La altitud de transición es la altitud a la que, al subir, cambiás a ese ajuste estándar. Al descender, al pasar el nivel de transición, volvés a QNH. La altitud de presión y la de densidad son valores de cálculo distintos. En Argentina, los valores de transición se consultan en la AIP vigente.',
      'El ajuste cambia la referencia del altímetro. La presión estándar sirve para expresar niveles de vuelo.',
      'altimeter-transition',
    ],
    [
      'Marcas de velocidad y límites del instrumento',
      'Algunos velocímetros tienen arcos y líneas de color que resumen rangos de velocidad. En muchos aviones livianos, el blanco se relaciona con flaps y el verde con operación normal. El arco amarillo es de precaución: se usa solo con aire calmo. La línea roja marca Vne, la velocidad que nunca se debe exceder.\n\nEl variómetro indica ascenso o descenso. El aire entra a su cámara por una pequeña fuga calibrada, que hace que tarde unos segundos en estabilizarse. Primero muestra la tendencia y después el valor. En cabina, leé los instrumentos junto con las limitaciones del manual de vuelo aprobado.',
      'Los colores resumen límites y rangos. No reemplazan las condiciones que los acompañan.',
    ],
    [
      'Deriva del indicador de dirección',
      'Un indicador direccional giroscópico usa un rotor que conserva su orientación durante un tiempo. La fricción, la precesión y otros efectos hacen que su indicación se aparte gradualmente del rumbo real.\n\nEse alejamiento se llama deriva. Por eso, compará el indicador con la brújula y corregilo cuando el procedimiento y las condiciones lo permitan. En cabina, una diferencia entre ambas indicaciones puede reflejar deriva y no un giro reciente.',
      'El indicador giroscópico deriva. Compararlo con la brújula permite detectar esa diferencia.',
    ],
    [
      'Si se tapa el pitot o la toma estática',
      'El velocímetro compara la presión del pitot con la de la toma estática. El altímetro y el variómetro usan solo la estática.\n\nSi se tapa el pitot y el drenaje sigue abierto, el velocímetro cae a cero. Si se tapan el pitot y el drenaje, esa presión queda atrapada. Al subir, el velocímetro sube. Al bajar, baja. El velocímetro se comporta como un altímetro.\n\nSi se tapa la estática, el altímetro se queda en la altura de ese momento y el variómetro va a cero. El velocímetro también indica mal: en un ascenso marca de menos y en un descenso marca de más, porque compara el pitot con una presión vieja.\n\nSi el altímetro y el variómetro se traban juntos, pensá en la estática. Reconocer cuál instrumento indica mal no reemplaza la lista del avión.',
      'Con el pitot tapado, el velocímetro indica mal. Con la estática tapada, se traban el altímetro y el variómetro, y el velocímetro también indica mal.',
      'pitot-block',
    ],
    [
      'Las velocidades con nombre',
      'Cada sigla nombra un límite o un rendimiento. Vs es la velocidad de pérdida, la mínima a la que el avión se sostiene en una configuración dada. Vs0 es la velocidad de pérdida con los flaps de aterrizaje. Vs1 es la velocidad de pérdida en la configuración limpia que indica el manual. Vfe es la velocidad máxima con los flaps extendidos. Vno es la velocidad máxima de crucero estructural. Vne, la línea roja, no se pasa.\n\nVa es la velocidad de maniobra de diseño. Por debajo de Va, una sola deflexión brusca y completa llega a la pérdida antes de la carga límite. Esa protección no cubre mandos repetidos ni varios ejes a la vez. Va no tiene color en el arco. Va baja si el avión pesa menos.\n\nVx gana más altura en menos distancia. Vy gana más altura en menos tiempo. El arco blanco va de Vs0 a Vfe. El verde va de Vs1 a Vno. El amarillo va de Vno a Vne y se usa solo con aire calmo. Los números de tu avión están en el manual de vuelo.',
      'Va no tiene color: por debajo, una deflexión brusca llega a la pérdida antes que a la carga límite.',
      'airspeed-arcs',
    ],
    [
      'Cinco nombres de altitud',
      'La altitud indicada es la que leés en el altímetro. La absoluta es la altura sobre el terreno que tenés debajo. La verdadera es la altura real sobre el nivel medio del mar.\n\nLa de presión es la que marcaría el altímetro con 1013,25 hPa. La de densidad corrige esa altitud de presión cuando la temperatura no es la estándar. Más calor, más altitud de densidad.\n\nCon el QNH del lugar, en tierra el altímetro marca la elevación del aeródromo, así que la indicada y la verdadera coinciden. En el aire coinciden solo si la atmósfera es la estándar. La de presión y la de densidad coinciden cuando la temperatura es la estándar. La verdadera y la absoluta coinciden cuando el terreno de abajo está al nivel del mar.',
      'La indicada sale de la aguja, la verdadera se mide desde el mar, la absoluta desde el suelo y la de densidad sube con el calor.',
      'altitudes',
    ],
    [
      'El viraje estándar',
      'Un viraje estándar cambia el rumbo 3° por segundo. Una vuelta completa lleva dos minutos. El medio estándar es la mitad, 1,5° por segundo.\n\nLa inclinación no es fija. A más velocidad, hace falta más inclinación para el mismo régimen. El coordinador de viraje muestra el régimen. El horizonte muestra la inclinación.\n\nHay más de una cuenta aproximada. La del manual de vuelo por instrumentos de la FAA divide la velocidad por 10 y le suma la mitad de ese resultado.\n\nEQ: φ ≈ V / 10 + V / 20 | φ: inclinación para un viraje estándar, en grados | V: velocidad verdadera, en nudos\n\nCon 150 kt (nudos), 15 más 7,5 da cerca de 22°. Es una estimación. El coordinador de viraje confirma el régimen.\n\nEl cuestionario puede pedir el ángulo para una velocidad. Esta lección no fija un tope de inclinación para el vuelo por instrumentos.',
      'El viraje estándar es de 3° por segundo, una vuelta en dos minutos. A más velocidad, más inclinación.',
    ],
  ],
  regulaciones: [
    [
      'Cómo verificar una regla antes de aplicarla',
      'La RAAC, o Regulaciones Argentinas de Aviación Civil, establece requisitos para la operación en Argentina. La Parte 61 trata licencias y atribuciones. La Parte 91 reúne reglas de vuelo y operación general.\n\nLa AIP (Publicación de Información Aeronáutica) publica datos aeronáuticos. Los NOTAM difunden cambios temporarios. Para responder una duda, identificá primero el tema, la fecha y el ámbito. Después consultá la publicación oficial que corresponda. Una pregunta de examen sirve para repasar la edición en que se publicó, pero puede no reflejar una actualización posterior.',
      'Para aplicar una regla, comprobá edición y vigencia en la publicación argentina correspondiente.',
    ],
    [
      'Planificar el vuelo y presentar un plan',
      'Planificar es reunir ruta, combustible, meteorología, aeródromos y alternativas para decidir si el vuelo es viable. Presentar un plan de vuelo es otra acción: transmitir información del vuelo a los servicios correspondientes.\n\nLa Parte 91 cambió varias veces en poco tiempo. La ANAC (Administración Nacional de Aviación Civil) la modificó con la Resolución 957/2025, y el cambio a la Sección 91.153 rige desde el 1 de marzo de 2026. Después llegaron las Resoluciones 117/2026 y 311/2026.\n\nQué hay que presentar depende de la operación. Para un caso real, leé el texto consolidado vigente y las publicaciones del lugar.',
      'Planificar siempre ayuda a decidir. Presentar un plan depende de los requisitos de la operación.',
    ],
    [
      'Niveles de crucero VFR',
      'En crucero VFR, salvo mientras subís o bajás, hay un nivel que usar. Desde 3000 ft (pies) sobre la superficie, ese nivel sale de las columnas 2 y 4 de AIP ENR 1.7. Lo fija la Sección 91.159 de la Parte 91, en el texto de la Resolución 957/2025.\n\nEsas columnas usan la derrota magnética, que es el camino sobre el suelo y no hacia dónde apunta la nariz. De 000° a 179°, los niveles VFR son miles impares más 500 ft, como 3500, 5500 o 7500. De 180° a 359°, miles pares más 500 ft, como 4500, 6500 u 8500.\n\nPor debajo de 3000 ft sobre la superficie, esos niveles se recomiendan y no obligan. El tránsito puede autorizar otro. Por encima, el nivel es obligatorio. No hace falta escribirlo en el plan VFR, ni pedir permiso para pasar a otro que siga siendo el de esa derrota. Si una ruta publica otra columna, seguí la carta. El cuestionario a veces dice curso magnético para esa derrota.',
      'Desde 3000 ft sobre el suelo: derrota 000° a 179°, impar más 500. 180° a 359°, par más 500.',
      'vfr-levels',
    ],
    [
      'Visibilidad y techo para salir',
      'La zona de tránsito es el espacio alrededor del aeródromo donde se vuela el circuito. Para operar ahí en VFR, la Sección 91.156 pide 5 km de visibilidad y 1000 ft (pies) de techo. Vale en aeródromos controlados y no controlados, dentro o fuera de una zona de control, salvo que haya publicado un mínimo más exigente.\n\nLos 1000 ft de techo tienen una razón. La Sección 91.155 pide, en general, quedar 500 ft por debajo de la base de la nube y 500 ft sobre el suelo. Con un techo más bajo que 1000 ft, no se pueden cumplir las dos separaciones a la vez.\n\nUna nota de la tabla de 91.155 baja la visibilidad a 2500 m en aeródromos no controlados fuera de una zona de control. El cuestionario publicado marca 2500 m y 1000 ft como única respuesta. Para la zona de tránsito, la 91.156 sigue pidiendo 5 km y 1000 ft.',
      'Zona de tránsito, 91.156: 5 km de visibilidad y 1000 ft de techo, salvo un mínimo publicado más alto.',
      'ceiling-circuit',
    ],
    [
      'Reserva final de combustible',
      'La reserva final es lo que todavía tiene que quedar cuando llegás al aeródromo donde pensás aterrizar. No incluye el rodaje ni el combustible de una alternativa.\n\nLa Sección 91.151, en la Resolución 957/2025, pide para un avión en VFR de día al menos 30 minutos. De noche, al menos 45. Esos minutos se calculan a la altitud de crucero normal.\n\nEl consumo sale del manual de tu avión, no de una cifra genérica. El cuestionario publicado todavía marca 45 minutos como única respuesta, de día y de noche.',
      'La 91.151 pide 30 minutos al llegar en VFR de día y 45 de noche.',
      'fuel-reserve',
    ],
    [
      'Altura mínima en VFR',
      'Salvo despegue, aterrizaje o un permiso de la autoridad, el VFR tiene una altura mínima. No se vuela tan bajo que un aterrizaje de emergencia ponga en peligro excesivo a personas o bienes. Lo dice la Sección 91.119, en la Resolución 311/2026.\n\nSobre edificios agrupados de una ciudad, pueblo o lugar habitado, el mínimo sube. También sobre una reunión de personas al aire libre. Ahí son 1000 ft (300 m) sobre el obstáculo más alto, en un radio de 600 m. En cualquier otro lugar, el mínimo es 500 ft (150 m) sobre el suelo.\n\nSobre una zona poco poblada o sobre el agua, se puede ir más bajo que esos 500 ft. El avión tiene que quedar a más de 500 ft (150 m) de cualquier persona, embarcación, vehículo o estructura. Una versión anterior pedía 3000 ft sobre zonas sensibles al ruido. Ese párrafo ya no está en el texto de 2026.',
      'Sobre una ciudad o una reunión, el mínimo es 1000 ft sobre el obstáculo, en 600 m. En otro lugar, es 500 ft sobre el suelo.',
    ],
    [
      'Papeles que van en el avión',
      'La Sección 91.203 pide, en una aeronave civil argentina, el certificado de aeronavegabilidad vigente, con la matrícula, y el certificado de matrícula. Si la propiedad no figura ahí, también va el certificado de propiedad.\n\nLa Sección 91.103 agrega una condición para salir. No se inicia el vuelo hasta comprobar que el avión está aeronavegable, bien matriculado y con la documentación reglamentaria a bordo.\n\nLa licencia y el certificado médico del piloto no forman parte de esa lista. El cuestionario a veces cita una Sección 91.10 que la Parte 91 vigente no trae.',
      'En el avión: aeronavegabilidad vigente y matrícula. La licencia del piloto es otro papel.',
    ],
    [
      'Cinturón y arnés',
      'Durante el despegue, el aterrizaje y en ruta, cada tripulante de vuelo permanece en su puesto. Puede ausentarse por una tarea de la operación o por una necesidad fisiológica. Mientras está en su puesto, el cinturón va abrochado. Lo dice la Sección 91.105.\n\nEn el despegue y el aterrizaje, el arnés de hombro también va abrochado si el asiento lo tiene, salvo que impida la tarea. Antes de mover el avión, despegar o aterrizar, cada persona tiene que saber abrochar y desabrochar, y se le pide que lo haga.\n\nEn el rodaje, el despegue, el aterrizaje y con turbulencia, cada persona va en su asiento. El cinturón va ajustado y, si está instalado, también el arnés. Es la Sección 91.106.',
      'Antes de moverte, despegar o aterrizar, cada persona abrocha cinturón y, si hay, arnés.',
    ],
    [
      'Qué cuenta como noche',
      'La Parte 61, edición de enero de 2026, define la noche. Va del fin del crepúsculo civil de la tarde al comienzo del crepúsculo civil de la mañana. El crepúsculo civil de la tarde termina cuando el centro del disco solar baja 6° por debajo del horizonte.\n\nNo es desde la puesta del sol hasta la salida. Tampoco es una hora y media antes o después. La autoridad puede prescribir otro período entre la puesta y la salida.\n\nLas horas nocturnas que pide la licencia, y la limitación si no las hiciste, están en el camino de este sitio.',
      'Noche es entre crepúsculos civiles, no entre la puesta y la salida del sol.',
      'civil-twilight',
    ],
    [
      'Cuánto hace que no volás',
      'La Sección 61.140, en la Parte 61 de enero de 2026, pide experiencia reciente para ser piloto al mando o copiloto. En los 90 días previos hacen falta tres despegues y tres aterrizajes con circuito completo. Tenés que ser la única persona en los mandos, en esa categoría, clase y tipo si corresponde.\n\nPara el piloto privado, el planeador y el globo libre, ese plazo pasa a 180 días. De noche, en un avión de un solo piloto, hay un requisito más para ser piloto al mando. En 180 días hacen falta tres despegues y tres aterrizajes nocturnos hasta detenerse, o una habilitación instrumental vigente.\n\nSi el repaso de vuelo sigue vigente, el piloto de la Parte 91 puede completar lo que falta. Lo hace sin personas ni carga, o con un instructor, y lo deja asentado. El cuestionario puede mostrar 30 días con instructor, o 25 horas de solo antes de llevar pasajeros. Ninguna de las dos está en esta edición. Las atribuciones de la 61.530 están en el camino.',
      'El piloto privado necesita tres circuitos en 180 días. De noche, necesita tres aterrizajes completos en 180 días o la habilitación instrumental.',
    ],
  ],
  generalidades: [
    [
      'Centro de gravedad: un ejemplo de cálculo',
      'El centro de gravedad es el punto de equilibrio de la masa del avión y su carga. Para calcularlo, se usa el datum, una referencia elegida por el fabricante, y el brazo, la distancia de cada peso hasta esa referencia.\n\nUn ejemplo ficticio con dos pesos. El primero, 400 kg a 0,20 m del datum, da un momento de 80 kg·m. El segundo, 200 kg a 1,20 m, da 240 kg·m. En total hay 600 kg y 320 kg·m. El CG queda en 320 ÷ 600, cerca de 0,53 m desde el datum. Es solo una cuenta ilustrativa. En una carga real se usan los datos y límites aprobados del avión.',
      'Peso por brazo da momento. Momento total dividido por peso total da la posición del centro de gravedad.',
      'weight-balance',
    ],
    [
      'Manual de vuelo, placas y listas',
      'El manual de vuelo aprobado puede llamarse POH o AFM. POH significa Pilot’s Operating Handbook, manual de operación del piloto. AFM significa Aircraft Flight Manual, manual de vuelo de la aeronave.\n\nEl manual reúne límites, velocidades, procedimientos, rendimiento y datos de carga. Las placas son rótulos instalados en cabina o estructura. Los suplementos agregan información sobre equipos o modificaciones. Antes de usar una cifra, verificá que el manual corresponda al modelo, serie, equipamiento y revisión del avión.',
      'Modelo, serie, equipo y revisión: comprobá los cuatro antes de usar un dato.',
    ],
    [
      'Tren de aterrizaje y frenos',
      'El tren de aterrizaje sostiene el avión en tierra y transmite las cargas de rodaje, despegue y aterrizaje. Puede ser fijo o retráctil. En el tren triciclo, una rueda está bajo el morro. En el convencional, las ruedas principales van adelante y hay una rueda de cola atrás.\n\nLos frenos reducen el giro de las ruedas y ayudan a desacelerar. Su mando y ubicación varían. En la inspección, mirá el estado visible según la lista. En cabina, identificá cómo actúan los mandos antes de rodar.',
      'Reconocé el tipo de tren y aprendé su control antes de aplicar una técnica.',
    ],
    [
      'Dispositivos secundarios y geometría del ala',
      'La envergadura es la distancia de una punta de ala a la otra. La cuerda va del borde delantero al trasero. El alargamiento compara la envergadura con la cuerda media: un ala larga y angosta tiene mucho alargamiento. Estos términos describen la forma del ala, pero no alcanzan para deducir su rendimiento.\n\nLos flaps suelen aumentar curvatura y sustentación. Los slats son superficies en el borde de ataque que, al abrirse, dejan pasar aire hacia el extradós y retrasan la pérdida. Los spoilers reducen sustentación y aumentan resistencia. El estabilador combina funciones de estabilizador y elevador. Un canard es una superficie horizontal delante del ala principal. Identificá qué componentes tiene realmente el avión.',
      'El nombre describe una pieza. Su función concreta depende del diseño que tenés delante.',
      'wing-geometry',
    ],
    [
      'Lectura de tablas y envolvente de peso y centrado',
      'La envolvente de peso y centrado es el área del gráfico donde los cálculos deben quedar dentro de límites. El datum es el origen de medida y los brazos indican distancias respecto de él.\n\nComprobá primero unidades, modelo, configuración y revisión de la tabla. Calculá el peso y la posición del centro de gravedad con el método publicado, y ubicá ese punto en el gráfico. No extrapoles fuera de las tablas. Un ejemplo aritmético enseña el método, pero solo los datos aprobados sirven para evaluar una carga real.',
      'El punto debe quedar dentro de la envolvente correspondiente a ese avión y configuración.',
    ],
  ],
  meteorologia: [
    [
      'Tormentas, cortante de viento y turbulencia severa',
      'Una tormenta puede combinar corrientes de aire que suben y bajan, granizo, lluvia intensa, rayos y turbulencia. El cortante de viento es un cambio del viento en una distancia corta. Cerca del suelo puede alterar rápidamente la trayectoria.\n\nEl radar y las imágenes meteorológicas ayudan a ubicar fenómenos, pero llegan con cierto retraso y no muestran cada detalle. En la planificación, reconocé su evolución y elegí una alternativa que conserve margen. La trampa es tratar una pantalla como garantía de que un paso es seguro.',
      'La tormenta combina peligros. Una imagen ayuda a detectarla, pero no vuelve seguro atravesarla.',
    ],
    [
      'Leer productos meteorológicos como un conjunto',
      'METAR, SPECI, TAF y SIGMET se presentaron en «Informes y pronósticos». Cada uno mira un lugar y un tiempo distintos, así que juntos dicen más que por separado.\n\nCada producto tiene una hora y un área de validez. Revisá esos datos y compará aeródromos y horarios a lo largo de la ruta. Una observación describe un lugar y momento. Un pronóstico no garantiza el resultado. Sumá terreno, luz diurna, alternativas y capacidad del piloto y del avión.',
      'Primero verificá hora y cobertura. Después decidí qué significa para tu ruta.',
    ],
    [
      'Dónde puede estar la base de los cúmulos',
      'Si el aire de la superficie sube, se enfría. Cuando llega al punto de rocío, el vapor puede condensar y aparecer la base de un cúmulo. La diferencia entre la temperatura y el punto de rocío indica cuánto tiene que subir.\n\nEl material del examen estima esa base con una cuenta. Restá el punto de rocío a la temperatura, en grados Celsius. Dividí por 6,5 y multiplicá por 1000. El resultado queda en metros. El 6,5 es el gradiente de la atmósfera estándar, 6,5 °C cada 1000 m. Con 22 °C y un punto de rocío de 12 °C, la cuenta da cerca de 1540 m.\n\nEs una estimación de la base de los cúmulos, no el techo del METAR o del TAF. Para salir, el techo es el del informe vigente. Una cuenta de convección usa cerca de 8 °C cada 1000 m y da una base más baja.',
      'La base estimada, en metros, es la temperatura menos el punto de rocío, dividido 6,5 y multiplicado por 1000. El techo lo dice el informe.',
      'cloud-base',
    ],
    [
      'La corriente de chorro',
      'La corriente de chorro es un viento fuerte y angosto, cerca del tope de la troposfera. Separa masas de aire de distinta temperatura. Cuando ese contraste es mayor, la corriente es más intensa. Ese efecto pesa más en la estación fría.\n\nAl lado puede haber turbulencia en aire claro, sin nubes que la anuncien. Se llama CAT, por las siglas en inglés de clear air turbulence. Aparece donde el viento cambia mucho en poca distancia, sobre todo del lado frío de la corriente.\n\nA veces unos cirros largos marcan la zona, y a veces no hay ninguna nube. El pronóstico de viento en altura y el SIGMET dicen si está prevista. El cuestionario puede nombrar una latitud o una estación de su edición.',
      'La corriente de chorro es un viento fuerte en altura. Al lado puede haber turbulencia sin nubes.',
    ],
    [
      'Cuando la temperatura sube con la altura',
      'En la atmósfera habitual, la temperatura baja a medida que subís. Una inversión es una capa en la que pasa lo contrario: más arriba, más calor.\n\nUna inversión cerca del suelo se forma a menudo en una noche despejada y calma. El suelo se enfría, y enfría el aire que lo toca. El aire de esa capa queda quieto. La visibilidad puede empeorar, con niebla o con bruma.\n\nEn el despegue o en la aproximación, al cruzar el tope de la capa, el viento puede cambiar de golpe. Ese cambio en poca distancia es un cortante de viento. En ese tramo mirá la velocidad y la trayectoria.',
      'Inversión: la temperatura sube con la altura. En el tope puede haber cortante.',
      'inversion',
    ],
  ],
  performance: [
    [
      'Cómo trabajar una tabla de performance',
      'Una tabla de performance estima lo que puede hacer el avión bajo condiciones definidas. Empezá por la tabla de la fase correcta y confirmá peso, temperatura, viento, superficie y configuración. La altitud de presión es la que indicaría el altímetro con el reglaje estándar.\n\nSeguí las notas, unidades y método de interpolación. Usá los datos publicados sin extrapolar y distinguí carrera de pista de distancia sobre un obstáculo. Repetí el cálculo para el aterrizaje y volvé a revisar si cambian las condiciones.',
      'Cada cifra vale para sus condiciones. Cambiá un dato y revisá el cálculo.',
    ],
    [
      'Peso, centrado y pista forman un solo problema',
      'La performance depende de varias condiciones a la vez. Más peso suele requerir más distancia y reducir el ascenso. Un centro de gravedad fuera de límites puede afectar el control.\n\nLa superficie, pendiente, viento y obstáculos también cambian el margen. Reuní los datos reales del avión y de la pista, y usá tablas que describan ese escenario. Si el margen resulta insuficiente, revisá el plan antes de iniciar.',
      'Peso, centrado, condiciones y pista se evalúan juntos, no como datos separados.',
    ],
    [
      'Viento de frente y viento cruzado',
      'El viento casi nunca viene derecho de la pista. Se parte en dos: el de frente, a lo largo del eje, y el cruzado, de costado. El ángulo es el que hay entre la dirección del viento y el eje de la pista.\n\nCada componente sale de multiplicar la velocidad del viento por una función del ángulo.\n\nEQ: cruzado = V × sen α | V: velocidad del viento | α: ángulo entre el viento y el eje de la pista\n\nEQ: de frente = V × cos α | V: velocidad del viento | α: ángulo entre el viento y el eje de la pista\n\nSi el viento viene de atrás, el coseno da negativo: la componente es de cola.\n\nEjemplo: pista 27 y viento de los 300° a 20 kt (nudos). El ángulo es 30°. El seno de 30° es 0,5, así que el cruzado es 10 kt. El coseno es cerca de 0,87, así que el de frente es unos 17 kt. La misma cuenta se lee en un gráfico de arcos y ángulos. El límite de viento cruzado de tu avión está en el manual.',
      'Cruzado: viento por el seno del ángulo con la pista. De frente: viento por el coseno.',
      'wind-components',
    ],
    [
      'Alcance y autonomía',
      'La autonomía es el tiempo que podés volar con el combustible que tenés. El alcance es la distancia que podés cubrir con ese mismo combustible.\n\nLa máxima autonomía aparece cuando el motor quema la menor cantidad de combustible por hora. No es la velocidad más baja ni la más alta. Esa condición sale de la tabla del avión.\n\nEl máximo alcance aparece cuando cada litro rinde más distancia. No es ir lo más lejos posible con cualquier potencia. A medida que se consume combustible, la potencia y la velocidad de esa condición suelen bajar. Los valores concretos están en el manual.',
      'Autonomía es tiempo. Alcance es distancia. Cada máximo tiene su velocidad en el manual.',
    ],
    [
      'V1, VR y el despegue',
      'Estas tres siglas son del despegue de un avión de transporte. No son las del arco de un entrenador. V1 es la velocidad de decisión. VR es la de rotación: ahí se levanta la nariz. Vlof es la velocidad a la que el avión deja el suelo.\n\nAntes de V1, ante una falla se puede interrumpir el despegue y frenar en la distancia prevista. Desde V1, el cálculo sigue con el despegue. Los números de cada peso y cada pista están en el manual de ese avión.\n\nLa zona libre de obstáculos es un área publicada más allá de la pista. Sobre ella se puede hacer una parte del ascenso inicial. La zona de parada es un área publicada para frenar si se interrumpe. Las dos entran en la cuenta de ese despegue. Cómo mueven a V1 lo dice ese cálculo, no una regla general.',
      'V1 decide seguir o frenar. VR rota. Vlof deja el suelo. Los números están en el manual.',
    ],
  ],
  navegacion: [
    [
      'Triángulo de velocidades y actualización en ruta',
      'El triángulo de velocidades suma dos movimientos: el del avión respecto del aire y el del aire respecto del suelo. Cada uno se representa con un vector, una flecha que tiene dirección y magnitud.\n\nEl viento modifica la trayectoria sobre el terreno, llamada derrota, aunque el avión mantenga el mismo rumbo. Por eso, los tiempos se estiman con velocidad sobre el suelo. En ruta, compará hora y posición con el plan. Si la diferencia persiste, revisá viento, navegación y combustible antes de seguir.',
      'La derrota resulta del movimiento del avión en el aire más el movimiento del viento.',
      'wind-triangle',
    ],
    [
      'GPS y cartografía electrónica',
      'GNSS significa sistema global de navegación por satélite. GPS es una de sus constelaciones. Un receptor puede mostrar posición, trayectoria y tiempo estimado, si recibe señal y está configurado correctamente.\n\nEn Argentina, el uso permitido del GNSS depende de la RAAC Parte 91, de las aprobaciones del equipo y de su manual. La pantalla no confirma que sus datos de ruta, obstáculos o aeródromos estén actualizados. Compará con cartas y publicaciones oficiales vigentes y conocé el procedimiento ante una discrepancia.',
      'El equipo estima dónde estás. Vos comprobás que la ruta y los datos sigan vigentes.',
    ],
    [
      'Cuentas de tiempo, distancia y combustible',
      'La milla náutica (NM) mide 1852 m. La milla terrestre mide cerca de 1609 m. Para las cuentas de tiempo, distancia y velocidad tienen que estar en las mismas unidades: millas náuticas con nudos.\n\nEQ: t = d / GS | t: tiempo, en horas | d: distancia, en millas náuticas | GS: velocidad sobre el suelo, en nudos\n\nEQ: combustible = consumo × t | consumo: litros por hora, del manual | t: tiempo del tramo, en horas\n\nEjemplo: 90 NM a 120 kt de GS llevan 90 ÷ 120 = 0,75 h, o sea 45 minutos. Si en crucero el avión consume 28 litros por hora, en ese tramo quema 28 × 0,75 = 21 litros. Es una cuenta de práctica. El consumo de tu avión sale del manual. La reserva que pide la regla se suma aparte de este tramo.\n\nEl triángulo de viento también se resuelve con números. Con viento de costado puro, el ángulo de corrección y la GS salen de dos cuentas.\n\nEQ: sen ACV = Vc / TAS | ACV: ángulo de corrección de viento | Vc: viento cruzado | TAS: velocidad verdadera\n\nEQ: GS = √(TAS² − Vc²) | GS: velocidad sobre el suelo | TAS: velocidad verdadera | Vc: viento cruzado\n\nCon 100 kt de TAS y 20 kt de viento cruzado, el seno es 20 ÷ 100 = 0,2 y el ángulo queda cerca de 12°. La GS es √(100² − 20²), cerca de 98 kt.',
      'Tiempo es distancia sobre GS. Combustible de crucero es consumo por ese tiempo.',
    ],
    [
      'El signo de la declinación',
      'La declinación, o variación, es el ángulo entre el norte verdadero y el norte magnético. Si la variación es este, el norte magnético está al este del verdadero. Para pasar de curso verdadero a magnético, el este resta y el oeste suma.\n\nEQ: CM = CV − Var | CM: curso magnético | CV: curso verdadero | Var: variación, positiva si es este y negativa si es oeste\n\nEjemplo: curso verdadero 120° y variación 8° este dan curso magnético 112°. Con 8° oeste, el magnético sería 128°.\n\nLa desviación es otra corrección: la de la brújula de ese avión, anotada en la tarjeta. No entra en la cuenta de la declinación del lugar.',
      'De verdadero a magnético, el este resta y el oeste suma.',
      'variation',
    ],
    [
      'La hora de Argentina',
      'La Ley 26.350 fija la hora oficial de invierno en tres horas al oeste de Greenwich: UTC−3. La misma ley permite un horario de verano en UTC−2, si el Poder Ejecutivo fija las fechas de ese período.\n\nMientras el Poder Ejecutivo no fije ese período, el reloj del país queda en UTC−3. En el plan de vuelo y en los informes meteorológicos, la hora que se usa es UTC.\n\nCon el reloj en UTC−3, a las 15:00 hora oficial corresponden las 18:00 UTC. Sumá tres horas para pasar de la hora oficial a UTC.',
      'Hora oficial de invierno: UTC−3. En el plan y en el informe, la hora es UTC.',
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
        'Primero ubicá la ruta y entendé la instrucción. Después empezá a rodar.',
      ],
      [
        'Arranque, comprobaciones y briefing previo al despegue',
        'El arranque pone el motor en funcionamiento. Las comprobaciones posteriores permiten observar si trabaja dentro de sus límites. La prueba de motor y la revisión previa al despegue también confirman que el avión está preparado.\n\nEl briefing es un repaso hablado del plan: pista, viento, trayectoria, obstáculos, tareas y condiciones para interrumpir. Acordalo antes de entrar en la carrera. Los puntos y valores se estudian con la lista aprobada del avión.',
        'La lista organiza la comprobación. El briefing aclara qué hará cada persona.',
      ],
      [
        'Rodaje y prevención de incursiones',
        'Rodar es desplazarse por tierra con la aeronave. Una incursión de pista ocurre cuando una aeronave, vehículo o persona ocupa una pista protegida sin corresponder.\n\nSeguí la ruta en la carta y compará lo que ves con señales, marcas e instrucciones. Antes de cruzar o entrar en una pista, la vigilancia visual acompaña la autorización aplicable. Si perdés orientación o algo no coincide, detené el avión si es seguro y aclaralo antes de seguir.',
        'La autorización y la vigilancia se complementan: usá ambas antes de ocupar una pista.',
      ],
      [
        'Mandos al rodar con viento',
        'Al rodar, el viento empuja el ala y la cola. Si viene derecho de adelante, los alerones quedan neutros. Si viene de adelante y de un costado, el mando se gira hacia el viento, para que el alerón de ese lado suba. Si viene de atrás y de un costado, se gira al revés, para que ese alerón baje, y el elevador va abajo.\n\nEn un triciclo, con viento de frente el elevador queda neutro. En un patín de cola, con viento de frente el elevador va arriba, para que el viento no levante la cola. Con viento de cola, en los dos, el elevador va abajo.\n\nEs la figura de instrucción del Airplane Flying Handbook, no el límite de cada modelo. Si el manual de tu avión indica otra posición, seguí esa.',
        'Frente: alerón arriba del lado del viento. Cola: ese alerón abajo y el elevador abajo.',
        'taxi-wind',
      ],
      [
        'Qué dice el número de pista',
        'El número de pista es el rumbo magnético de ese eje, redondeado a la decena más cercana, sin el último cero. La pista 09 apunta cerca de los 090°. La 27, cerca de los 270°.\n\nSi el rumbo magnético es 094°, se redondea a 090° y la pista se llama 09. Si es 086°, también queda 09. Cada cabecera mira al sentido contrario: 09 y 27 son el mismo pavimento, desde puntas opuestas.\n\nEl viento del día no cambia el número. La brújula del avión puede no leerlo exacto, porque tiene su propio desvío. El número describe el eje magnético de la pista.',
        'El número de pista es el rumbo magnético, redondeado a la decena, sin el cero final.',
        'runway-number',
      ],
      [
        'Después del aterrizaje y salida de pista',
        'Después del contacto, mantené el control direccional y reducí la velocidad. Salí por una calle de rodaje cuando puedas hacerlo sin un giro brusco y según las instrucciones aplicables.\n\nUna vez fuera de la pista, ubicá la ruta siguiente antes de moverte y completá la lista posterior al aterrizaje. Las marcas y autorizaciones indican dónde continuar o detenerse. La secuencia exacta se aprende con la publicación del aeródromo y la lista del avión.',
        'Aterrizar termina el vuelo en pista. Todavía falta orientarse y rodar hasta destino.',
      ],
      [
        'Circuito de tránsito y conciencia de tráfico',
        'El circuito de tránsito ordena los tramos alrededor de la pista: salida, viento cruzado, tramo inicial (paralelo a la pista, con viento en cola), básico y final. Te permite preparar el aterrizaje.\n\nLa RAAC Parte 91, Sección 91.128, establece como circuito tipo virajes a la izquierda, 500 ft (pies) de altura, al menos 500 m desde la periferia del aeródromo y una entrada a unos 45° respecto de la trayectoria del tramo inicial. Si la AIP publica otro circuito, seguí lo publicado.\n\nLa misma sección prohíbe incorporarse por el tramo básico o por el final, porque desde ahí cuesta ver y que te vean. Mirá el tránsito y comunicá tu posición cuando corresponda. El dibujo es conceptual.',
        'El esquema enseña la secuencia. La publicación del aeródromo define el circuito que vas a usar.',
        'traffic-pattern',
      ],
      [
        'Estela turbulenta y separación',
        'La estela turbulenta es el aire giratorio que queda detrás de las alas. Al producir sustentación, el aire fluye alrededor de las puntas y forma vórtices, remolinos que pueden persistir después de que pase el avión.\n\nSuele ser más intensa detrás de un avión pesado, lento y con los flaps retraídos. Su ala necesita producir mucha sustentación y trabaja con más ángulo de ataque. El viento puede desplazar esos remolinos. Usá la separación y los procedimientos aplicables. La estela puede persistir aunque ya no veas al avión precedente.',
        'El avión deja remolinos invisibles. Pensá dónde los llevó su trayectoria y el viento.',
        'wake-vortex',
      ],
      [
        'Radiotelefonía clara y confirmación',
        'La radiotelefonía es la comunicación por radio. Un mensaje claro identifica a quién llamás, quién sos, dónde estás y qué necesitás, y usa la fraseología aplicable.\n\nEscuchá antes de transmitir y mantené el mensaje breve. Repetí los datos críticos cuando lo exija el servicio. En Argentina, las frecuencias y procedimientos se consultan en las publicaciones vigentes. Si no entendiste una instrucción o autorización, pedí que la repitan antes de actuar.',
        'Un mensaje corto sirve si identifica quién llama, dónde está y qué necesita.',
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
        'Un peligro es algo que puede causar daño. El riesgo combina qué tan probable es y qué tan grave sería. Viento cruzado, cansancio o una pista corta son ejemplos de peligros.\n\nUna mitigación es una medida que reduce la probabilidad o las consecuencias. Pensá qué barrera tenés y qué señal mostraría que dejó de alcanzar. Varios peligros juntos pueden achicar el margen aunque cada uno parezca manejable. Si el riesgo sigue alto, demorar, cambiar destino o cancelar son decisiones posibles.',
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
        'Los mínimos personales son límites que elegís antes de volar para condiciones como visibilidad, viento, fatiga o experiencia reciente. Te ayudan a decidir si el día y el vuelo están dentro de tu capacidad.\n\nElegilos con tiempo y revisalos cuando cambien tu experiencia o situación. Ningún mínimo personal permite exceder una regla ni una limitación del avión. Pasajeros, horarios o costos pueden presionarte para continuar. Reconocé esa presión antes de empezar.',
        'Un límite acordado en tierra es más fácil de sostener cuando aparece presión.',
      ],
      [
        'Escenario: el pronóstico se deteriora',
        'Imaginá que el pronóstico de destino empeora y el viento real difiere del previsto. Además, llevás varias horas de actividad y el regreso tiene horario ajustado.\n\nAntes de salir, elegí alternativas y condiciones para esperar o cancelar. En ruta, compará observación, pronóstico y progreso. Revisá combustible y hora estimada. Si aparece la señal que habías definido, usá la alternativa con tiempo suficiente. No hay un umbral único para todos los vuelos.',
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
        'IMSAFE es una ayuda para revisar tu aptitud: Illness (enfermedad), Medication (medicación), Stress (estrés), Alcohol (alcohol), Fatigue (fatiga) y Emotion (emoción). Dolor, falta de sueño o una emoción intensa pueden reducir atención, coordinación y juicio.\n\nLos efectos se pueden sumar. El estrés ocupa atención. La fatiga demora respuestas. Una congestión puede impedir que se iguale la presión en el oído durante un cambio de altura. La lista no es un certificado médico ni reemplaza las reglas. Si dudás de tu aptitud, resolvelo antes de volar.',
        'Revisá cada letra y también cómo se combinan los factores ese día.',
        'imsafe',
      ],
      [
        'Oxígeno, hipoxia y monóxido de carbono',
        'La hipoxia ocurre cuando los tejidos reciben poco oxígeno. Puede afectar el juicio antes de que notes que algo anda mal. El monóxido de carbono es un gas de combustión sin olor. Si entra en la cabina, puede causar dolor de cabeza, mareo, somnolencia y confusión. Si sospechás monóxido, seguí la lista aprobada del avión y planificá aterrizar cuanto antes.\n\nHay cuatro mecanismos. La hipoxia hipóxica aparece cuando baja el oxígeno disponible, como en altura. La hipémica ocurre cuando la sangre transporta menos oxígeno, por ejemplo por monóxido de carbono o anemia. La de estancamiento aparece cuando la circulación no lo lleva suficiente, por ejemplo con mucha carga G. La histotóxica ocurre cuando los tejidos no pueden usarlo. Algunas sustancias, como el alcohol, pueden interferir.\n\nEl tiempo de conciencia útil es el período en que todavía podés realizar tareas. Material de instrucción de la Administración Federal de Aviación de Estados Unidos (FAA) ofrece estimaciones aproximadas. A 18 000 ft (pies), estima 20 a 30 minutos. A 25 000 ft, pocos minutos. Son referencias, no un límite seguro.',
        'La hipoxia puede nublar el juicio antes de que el piloto reconozca sus propios síntomas.',
        'hypoxia-types',
      ],
      [
        'Oxígeno que pide la regla',
        'La Sección 91.211 se basa en la presión de la cabina. En un avión sin presurizar, esa presión es la de la altura a la que volás. En atmósfera estándar, 700 hPa equivalen a unos 10.000 ft (pies) y 620 hPa a unos 13.000 ft.\n\nNo se inicia un vuelo que vaya a quedar bajo 700 hPa si no se lleva oxígeno suficiente. Entre 10.000 y 13.000 ft de presión de cabina, ese oxígeno cubre el tramo que supere los 30 minutos. Alcanza para toda la tripulación y, como mínimo, para el 10 % de los pasajeros.\n\nSi la presión de cabina baja de 620 hPa, el oxígeno alcanza para toda la tripulación y todos los pasajeros, durante todo ese tramo. Quien lo necesita en la tripulación lo usa de forma continua. El cuestionario a veces resume solo los 30 minutos entre 10.000 y 13.000 ft.',
        'De 10.000 a 13.000 ft, oxígeno pasado los 30 minutos. Por encima de 13.000, todos y todo el tiempo.',
        'oxygen-rule',
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
        'La energía del avión combina movimiento y altura. Más velocidad significa más energía de movimiento, la cinética. Más altura significa más energía potencial. Potencia, actitud y configuración cambian cómo se administra.\n\nEQ: E = ½ · m · V² + m · g · h | E: energía total del avión | m: masa del avión | V: velocidad | g: aceleración de la gravedad | h: altura\n\nLa velocidad va al cuadrado. Llegar a la pista con un 10 % más de velocidad suma cerca de un 21 % de energía de movimiento, y esa energía hay que disiparla en el suelo con más pista.\n\nEn una aproximación, el exceso de velocidad o altura puede exigir más espacio para estabilizarse. Una aproximación estabilizada cumple criterios observables de velocidad, trayectoria y configuración. Las velocidades y la decisión de motor y al aire se aprenden para el avión y el entrenamiento.',
        'Velocidad y altura son energía. Cerca del suelo queda menos espacio para corregir.',
      ],
      [
        'Pérdidas, barrenas y prevención de pérdida de control',
        'La pérdida ocurre cuando el ala supera el ángulo de ataque crítico y deja de producir sustentación de la forma esperada. Una barrena es una rotación descendente que combina pérdida y giro alrededor de varios ejes.\n\nUna barrena puede desarrollarse cuando un ala entra en pérdida antes que la otra y el avión sigue girando. Reconocer energía y coordinación ayuda a prevenir la pérdida de control. Las maniobras y recuperaciones se practican con instructor y avión autorizados, según el entrenamiento previsto.',
        'La pérdida depende del ángulo de ataque. La barrena agrega una rotación descendente.',
      ],
      [
        'Pérdida de potencia y aterrizaje forzoso',
        'Una pérdida de potencia significa que el motor ya no entrega el empuje esperado. Un aterrizaje forzoso es una toma no planificada fuera de las condiciones normales, por una emergencia.\n\nLa altura, el terreno, el viento y los obstáculos cambian qué zonas pueden alcanzarse. El entrenamiento enseña a conservar control, elegir una opción y preparar la aeronave. Las acciones y listas concretas se estudian para el modelo. Los ejercicios se practican con instructor.',
        'Una falla real exige decisiones con el margen disponible. Aprendé la lista antes de volar.',
      ],
      [
        'Comunicación y contingencias',
        'En una contingencia, la radio permite informar qué ocurre y pedir asistencia. Aviate, navigate, communicate significa «controlá el avión, orientá la trayectoria, comunicá». Es una ayuda para ordenar la atención, no una regla de prioridad para toda situación.\n\nSi la tarea de radio te hace descuidar velocidad, actitud o trayectoria, primero recuperá una condición controlable según tu entrenamiento. Después transmití posición e intención cuando sea posible. Una falla de radio tiene procedimientos propios en la RAAC, la AIP y el manual del equipo. Estudialos antes del vuelo.',
        'La frase ayuda a ordenar la atención. El procedimiento concreto se aprende para la operación local.',
        'priority',
      ],
      [
        'Falla de comunicaciones: reconocer el alcance',
        'Una falla de comunicaciones puede afectar la transmisión, la recepción o ambas. Reconocer qué lado parece fallar ayuda a describir el problema, pero no determina por sí solo qué hacer.\n\nLa respuesta cambia con las reglas, el espacio aéreo, la fase del vuelo y el equipo. Estudiá en tierra el procedimiento de la RAAC, la AIP y los manuales aplicables. El código 7600 avisa la falla de radio. La altura y la ruta que siguen están en el procedimiento de la AIP para ese vuelo.',
        'Primero identificá qué comunicación falla. Después aplicá el procedimiento local estudiado.',
      ],
      [
        'Los códigos 7500, 7600 y 7700',
        'El transpondedor contesta al radar secundario con un código de cuatro cifras. Tres códigos están reservados. Los servicios de tránsito aéreo pueden ver la condición aunque la radio no alcance.\n\nEl 7700 es emergencia. El 7600 es falla de comunicaciones. El 7500 es interferencia ilícita, por ejemplo un apoderamiento del avión. El 7700 y el 7500 están en el procedimiento de uso del transpondedor publicado con el Anexo 17. Si las circunstancias lo piden, en una interferencia se puede usar el 7700 en lugar del 7500.\n\nLa AIP usa el 7600 cuando falla la radio en un vuelo bajo vigilancia. La altura y la ruta que siguen están en el procedimiento de ese vuelo, no en el código. El 1200 no es un código de emergencia de la Argentina.',
        '7700 es emergencia, 7600 es radio y 7500 es interferencia ilícita.',
      ],
      [
        'La baliza de emergencia',
        'El ELT es el transmisor localizador de emergencia. Si se activa, manda una señal para avisar un accidente y ayudar a encontrar el avión.\n\nLa Sección 91.207 de la Parte 91 lo pide a las aeronaves que operan en el espacio aéreo argentino. Hay excepciones, en los párrafos (b), (g) e (i). El equipo tiene que cumplir el estándar que fija la ANAC. El de 406 MHz se registra, para que la búsqueda tenga un contacto.\n\nNo toda baliza es igual. Hay equipos fijos y otros que se pueden sacar. La activación depende del modelo: algunos se disparan con el impacto y otros también se pueden encender a mano. No alcanza decir que todas son fijas y que solo se activan con el impacto.',
        'El ELT avisa y ayuda a ubicar el avión. La 91.207 lo pide, con excepciones.',
      ],
    ],
  },
];

const sourceIds = {
  aerodinamica: ['phak', 'afh'],
  motopropulsor: ['phak', 'afh'],
  instrumentos: ['phak', 'ifh'],
  regulaciones: ['anacPpa', 'raac', 'raac61', 'raac91', 'raac91Plan', 'raac91Equipment', 'raac91BushStol', 'aip'],
  generalidades: ['phak', 'weightBalance', 'anacPpa'],
  meteorologia: ['phak', 'weather', 'metArgentina', 'raac203'],
  performance: ['phak', 'afh', 'weightBalance'],
  navegacion: ['phak', 'aip', 'horaOficial', 'ifh'],
  'operaciones-aerodromo': ['phak', 'afh', 'aip', 'raac'],
  'decision-y-riesgo': ['phak', 'risk', 'anacPpa'],
  'factores-humanos': ['phak', 'risk', 'anacPpa', 'raac91'],
  'procedimientos-emergencias': ['afh', 'phak', 'anacPpa', 'raac', 'aip', 'elt', 'ssr'],
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

// Las maniobras traen sus propias fuentes, una lista por página.
const expandedManeuverChapters = maneuverChapters.map(({ sources, ...chapter }) => ({
  ...withExamLink(chapter, chapter.lessons),
  sources: sources.map((id) => librarySources[id]),
}));

export const chapters = [...expandedExamChapters, ...newChapters.map((chapter) => withExamLink(
  chapter,
  [...chapter.lessons, ...(handbookLessons[chapter.slug] ?? [])],
)), ...expandedManeuverChapters].sort((a, b) => a.id - b.id);
