import { isScoreableQuestion } from '../data/question-utils.js';

const bankLoaders = {
  ppa: () => import('../data/ppa-questions.json'),
  'pca-hvi': () => import('../data/exam-banks/pca-hvi.json'),
  tla: () => import('../data/exam-banks/tla.json'),
  iva: () => import('../data/exam-banks/iva.json'),
  riva: () => import('../data/exam-banks/riva.json'),
  ppl: () => import('../data/exam-banks/ppl.json'),
  ivh: () => import('../data/exam-banks/ivh.json'),
  dda: () => import('../data/exam-banks/dda.json'),
  ivp: () => import('../data/exam-banks/ivp.json'),
  etvi: () => import('../data/exam-banks/etvi.json'),
  cta: () => import('../data/exam-banks/cta.json'),
  aeroaplicador: () => import('../data/exam-banks/aeroaplicador.json'),
  incendios: () => import('../data/exam-banks/incendios.json'),
  'alumno-paracaidista': () => import('../data/exam-banks/alumno-paracaidista.json'),
};

const main = document.querySelector('.exam-practice-page');
const startPanel = document.querySelector('#practiceStart');
const quiz = document.querySelector('#quiz');
const results = document.querySelector('#results');

const setTakingExam = (active) => {
  main.classList.toggle('is-taking-exam', active);
};

const scrollExamIntoView = (element) => {
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - 4;
  window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
};
const licenseSlug = main.dataset.examLicense;
const practiceOnly = main.dataset.practiceOnly === 'true';
const testSize = Number(main.dataset.testSize) || 10;
const loader = bankLoaders[licenseSlug];
if (!loader) throw new Error(`No hay banco configurado para ${licenseSlug}`);
// El banco se pide al empezar, no al abrir la página: algunos pesan cientos de KB.
let bank = null;
let chapters = [];
let allQuestions = [];
let bankReady = null;
const ensureBank = () => {
  if (!bankReady) {
    bankReady = loader().then((bankModule) => {
      bank = bankModule.default;
      chapters = bank.chapters;
      allQuestions = chapters.flatMap((chapter) => chapter.questions);
    });
  }
  return bankReady;
};
// isScoreableQuestion viene de question-utils.js: la misma regla que usa la pagina al
// calcular en build el tamano anunciado del examen.

let queue = [];
let index = 0;
let mode = 'practice';
let answers = [];
let answered = false;
let activeQuestion = null;
let timerId = null;
let timerStartedAt = null;
const storageKey = `altura:practice-missed:${licenseSlug}`;

const pad = (value) => String(value).padStart(2, '0');
const formatElapsed = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  return `${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}`;
};

/**
 * Un pool vacío no puede fallar en silencio: el usuario presionó un botón y no pasó nada.
 * Se avisa en #bankStatus y se devuelve el foco al panel de inicio.
 */
const announceNoQuestions = (reason) => {
  const status = document.querySelector('#bankStatus');
  if (status) {
    status.textContent = reason;
    status.classList.add('is-warning');
  }
  startPanel.hidden = false;
  document.querySelector('#startStudy').focus({ preventScroll: true });
};

const stopTimer = () => {
  if (timerId !== null) clearInterval(timerId);
  timerId = null;
};

const hideTimer = () => {
  stopTimer();
  timerStartedAt = null;
  const timer = document.querySelector('#quizTimer');
  if (timer) {
    timer.hidden = true;
    timer.textContent = '00:00';
  }
};

const startTimer = () => {
  hideTimer();
  timerStartedAt = Date.now();
  const timer = document.querySelector('#quizTimer');
  if (!timer) return;
  timer.hidden = false;
  timer.textContent = '00:00';
  timerId = setInterval(() => {
    timer.textContent = formatElapsed(Date.now() - timerStartedAt);
  }, 250);
};

const liveScore = () => {
  const answeredQuestions = answers.filter(Boolean);
  const correct = answeredQuestions.filter((answer) => answer.scoreable && answer.correct).length;
  const wrong = answeredQuestions.filter((answer) => answer.scoreable && !answer.correct).length;
  document.querySelector('#scoreCorrect').textContent = String(correct);
  document.querySelector('#scoreWrong').textContent = String(wrong);
};

const clearResultTime = () => {
  const resultTime = document.querySelector('#resultTime');
  if (!resultTime) return;
  resultTime.hidden = true;
  resultTime.textContent = '';
};

const resetSession = () => {
  answers = [];
  index = 0;
  answered = false;
  activeQuestion = null;
  liveScore();
};

const readMissed = () => {
  try {
    const ids = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
};
const saveMissed = (ids) => {
  try { localStorage.setItem(storageKey, JSON.stringify([...new Set(ids)])); }
  catch { /* La práctica sigue sin persistencia. */ }
};
const updateMissed = (question, shouldReview) => {
  const ids = readMissed().filter((id) => id !== question.id);
  if (shouldReview) ids.push(question.id);
  saveMissed(ids);
};
const refreshReviewButton = () => {
  const button = document.querySelector('#startReview');
  if (!button) return;
  if (!allQuestions.length) {
    button.hidden = readMissed().length === 0;
    return;
  }
  button.hidden = !allQuestions.some((question) => readMissed().includes(question.id));
};
refreshReviewButton();

const shuffle = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
const chapterTitle = (id) => chapters.find((chapter) => chapter.questions[0]?.chapter === id)?.title ?? licenseSlug.toUpperCase();
const licenseLabel = () => document.querySelector('.practice-heading h1')?.innerText?.replace(/\s+/g, ' ').trim() || licenseSlug;
const fillReportButton = (button, question) => {
  if (!button || !question) return;
  const choices = question.choices.map((choice, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${choice}`).join('\n');
  button.dataset.reportWhere = `${licenseLabel()} · tema ${String(question.chapter).padStart(2, '0')} · pregunta ${question.number}`;
  button.dataset.reportRef = question.id || `${licenseSlug}-${question.chapter}-${question.number}`;
  button.dataset.reportExcerpt = `${question.prompt}\n${choices}`;
};

const setQuestion = () => {
  if (index >= queue.length) return showResults();
  const originalQuestion = queue[index];
  if (practiceOnly) {
    const answerOrder = shuffle(originalQuestion.choices.map((_, optionIndex) => optionIndex));
    activeQuestion = {
      ...originalQuestion,
      choices: answerOrder.map((optionIndex) => originalQuestion.choices[optionIndex]),
      answerIndex: answerOrder.indexOf(originalQuestion.answerIndex),
    };
  } else {
    activeQuestion = originalQuestion;
  }
  const q = activeQuestion;
  answered = false;
  document.querySelector('#quizCount').textContent = `${String(index + 1).padStart(2, '0')} / ${String(queue.length).padStart(2, '0')}`;
  document.querySelector('#quizProgress').style.width = `${((index + 1) / queue.length) * 100}%`;
  const questionMeta = document.querySelector('#questionMeta');
  const showChapterMeta = mode !== 'mock';
  questionMeta.hidden = !showChapterMeta;
  questionMeta.textContent = showChapterMeta
    ? `TEMA ${String(q.chapter).padStart(2, '0')} · ${chapterTitle(q.chapter)} · PREGUNTA ${q.number}`
    : '';
  document.querySelector('#questionText').textContent = q.prompt;

  const figureImages = Array.isArray(q.images) ? q.images : [];
  const figureBox = document.querySelector('#questionFigures');
  figureBox.hidden = figureImages.length === 0;
  figureBox.replaceChildren();
  const figureLabel = q.figure?.label || q.figure?.number;
  figureImages.forEach((image) => {
    const picture = document.createElement('img');
    picture.src = image.src;
    picture.alt = figureLabel ? `Figura ${figureLabel} del cuestionario` : 'Figura del cuestionario';
    picture.width = image.width;
    picture.height = image.height;
    picture.decoding = 'async';
    figureBox.append(picture);
  });

  const figureNotice = document.querySelector('#figureNotice');
  figureNotice.hidden = true;
  figureNotice.replaceChildren();
  if (q.figure && figureImages.length === 0) {
    const annexUrl = bank.figureSourceUrl || 'https://www.anac.gov.ar/anac/web/uploads/pers_aeron/examenes/ppa/anexo-figuras-para-las-preguntas-ppa.pdf';
    const isAnnex = annexUrl.includes('anexo');
    figureNotice.append(document.createTextNode(`Esta pregunta refiere a la Figura ${figureLabel}. `));
    const figureLink = document.createElement('a');
    figureLink.href = annexUrl;
    figureLink.target = '_blank';
    figureLink.rel = 'noreferrer';
    figureLink.textContent = isAnnex ? 'Abrir anexo oficial ↗' : 'Abrir el cuestionario ↗';
    figureNotice.append(figureLink);
  } else if (figureLabel && figureImages.length) {
    figureNotice.hidden = false;
    figureNotice.textContent = `Figura ${figureLabel}.`;
  }

  const sourceNote = document.querySelector('#sourceNote');
  // Las etiquetas esperadas se derivan de cuantas opciones trae la pregunta. Con la constante
  // fija ['a','b','c'] toda pregunta de 4 a 6 opciones aparecia marcada como errada —346
  // preguntas en 13 bancos, todas las de CTA— y el texto decia "A, B y C" mientras se
  // renderizaban hasta seis letras.
  const expectedLabels = Array.from({ length: q.choices.length }, (_, index) => String.fromCharCode(97 + index));
  const printedLabels = q.printedOptionLabels || [];
  const labelsNeedNormalization = printedLabels.some((label, optionIndex) => label !== expectedLabels[optionIndex]);
  const letters = expectedLabels.map((label) => label.toUpperCase()).join(', ');
  sourceNote.hidden = !labelsNeedNormalization;
  sourceNote.textContent = labelsNeedNormalization
    ? `El PDF fuente tiene una etiqueta faltante o repetida. Aquí las opciones se numeran ${letters} por su orden.`
    : '';

  const options = document.querySelector('#answerOptions');
  options.replaceChildren();
  q.choices.forEach((choice, optionIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';
    const label = document.createElement('span');
    label.textContent = String.fromCharCode(65 + optionIndex);
    const text = document.createElement('b');
    text.textContent = choice;
    button.append(label, text);
    button.addEventListener('click', () => choose(optionIndex));
    options.append(button);
  });
  document.querySelector('#answerFeedback').hidden = true;
  document.querySelector('#answerFeedback').replaceChildren();
  document.querySelector('#nextQuestion').disabled = true;
  document.querySelector('#skipQuestion').disabled = false;
  fillReportButton(document.querySelector('#reportQuestion'), q);
  document.querySelector('#questionText').focus({ preventScroll: true });
  if (main.classList.contains('is-taking-exam')) scrollExamIntoView(document.querySelector('.quiz-chrome'));
};

const choose = (choiceIndex) => {
  if (answered) return;
  answered = true;
  const q = activeQuestion;
  const mock = mode === 'mock';
  const known = Number.isInteger(q.answerIndex);
  const scoreable = isScoreableQuestion(q);
  const correct = known && choiceIndex === q.answerIndex;
  answers[index] = { question: q, choiceIndex, known, scoreable, correct };
  liveScore();
  if (scoreable && !mock) updateMissed(q, !correct);
  refreshReviewButton();

  const feedback = document.querySelector('#answerFeedback');
  document.querySelectorAll('.answer-option').forEach((option, i) => {
    option.disabled = true;
    if (known && i === q.answerIndex) option.classList.add(scoreable ? 'is-correct' : 'is-published-key');
    if (scoreable && i === choiceIndex && !correct) option.classList.add('is-wrong');
    if (!scoreable && i === choiceIndex && i !== q.answerIndex) option.classList.add('is-selected');
    if (!known && i === choiceIndex) option.classList.add('is-selected');
  });
  document.querySelector('#skipQuestion').disabled = true;
  document.querySelector('#nextQuestion').disabled = false;
  document.querySelector('#nextQuestion').focus({ preventScroll: true });
  feedback.hidden = false;
  feedback.className = `answer-feedback ${!scoreable ? 'feedback-review' : (correct ? 'feedback-correct' : 'feedback-wrong')}`;

  const lead = document.createElement('strong');
  lead.textContent = known
    ? (!scoreable ? 'Clave publicada en revisión · esta pregunta no suma ni resta.' : choiceIndex === null ? 'Respuesta para repasar.' : correct ? 'Correcto.' : mock ? 'Incorrecto.' : 'Revisemos esta idea.')
    : 'Respuesta en revisión.';
  const message = document.createElement('p');
  message.textContent = q.explanation || (known ? 'La respuesta se contrastó con la fuente enlazada.' : 'El material disponible no permite confirmar una clave segura. La registramos como pendiente, no como error.');
  feedback.append(lead, message);

  if (known && choiceIndex === null) {
    const answer = document.createElement('p');
    answer.textContent = `Respuesta indicada: ${String.fromCharCode(65 + q.answerIndex)}. ${q.choices[q.answerIndex]}`;
    feedback.append(answer);
  }
  if (known && !scoreable) {
    const evidence = document.createElement('small');
    evidence.textContent = 'La clave tiene una reserva documental; revisá la fuente antes de tratarla como definitiva.';
    feedback.append(evidence);
  }

  const referenceUrl = q.referenceUrl || bank.answerSourceUrl || bank.sourceUrl;
  if (referenceUrl) {
    const source = document.createElement('a');
    source.href = referenceUrl;
    source.target = '_blank';
    source.rel = 'noreferrer';
    source.textContent = q.referenceTitle ? `Fuente: ${q.referenceTitle} ↗` : (bank.answerSourceUrl ? 'Consultar análisis de respuestas ANAC ↗' : 'Consultar fuente oficial ↗');
    feedback.append(source);
  }

  // Estas preguntas son las del temario del examen PPA. La regla no se aplica a los demas
  // bancos: cada uno tiene su propia numeracion de capitulo y pregunta.
  const ppaRuleQuestion = licenseSlug === 'ppa'
    && (q.chapter === 4 || (q.chapter === 5 && q.number <= 17) || (q.chapter === 2 && q.number === 44));
  const didacticRuleQuestion = practiceOnly && /RAAC|AIP|NOTAM|carta vigente|normativa/i.test(q.referenceTitle || '');
  if (q.regulatoryCaution || q.currentRules || ppaRuleQuestion || didacticRuleQuestion) {
    const currentRules = document.createElement('small');
    currentRules.className = 'regulation-caution';
    currentRules.textContent = 'Verificá la RAAC, AIP, NOTAM y documentación vigentes antes de aplicar una regla o procedimiento.';
    feedback.append(currentRules);
  }
};

const skip = () => {
  if (answered) return;
  choose(null);
  answers[index].skipped = true;
};

const showResults = () => {
  const isMock = mode === 'mock';
  const elapsed = isMock && timerStartedAt !== null ? formatElapsed(Date.now() - timerStartedAt) : null;
  hideTimer();
  const resultTime = document.querySelector('#resultTime');
  if (resultTime) {
    if (isMock && elapsed !== null) {
      resultTime.hidden = false;
      resultTime.textContent = `Tiempo: ${elapsed}`;
    } else {
      clearResultTime();
    }
  }
  quiz.hidden = true;
  results.hidden = false;
  const correct = answers.filter((answer) => answer?.scoreable && answer.correct).length;
  const wrong = answers.filter((answer) => answer?.scoreable && !answer.correct).length;
  const review = answers.filter((answer) => answer && !answer.scoreable).length;
  document.querySelector('#resultCorrect').textContent = correct;
  document.querySelector('#resultWrong').textContent = wrong;
  document.querySelector('#resultReview').textContent = review;
  document.querySelector('#resultTitle').textContent = isMock ? 'Simulacro terminado.' : 'Sesión completada.';
  const scored = correct + wrong;
  const percentage = scored ? Math.round((correct / scored) * 100) : 0;
  document.querySelector('#resultSummary').textContent = isMock
    // El porcentaje va siempre: antes solo aparecia cuando no habia ninguna pregunta sin
    // puntuar, asi que el mismo modo daba dos formatos distintos de resumen.
    ? `${percentage}% de aciertos sobre ${scored} preguntas verificadas (${correct} correctas, ${wrong} incorrectas).${review ? ` ${review} quedaron fuera porque su clave falta o sigue en revisión.` : ''}${practiceOnly ? ' Estas preguntas son de estudio y no representan una aprobación oficial.' : ' El 75% es la referencia publicada por ANAC para TCEXAM; confirmá el formato de tu evaluación.'}`
    : `Respondiste ${answers.length} preguntas.${scored ? ` ${percentage}% de aciertos sobre las ${scored} con clave verificada.` : ''} Las que no tienen clave contrastada o siguen en revisión quedan fuera del resultado.`;

  const reviewList = document.querySelector('#resultReviewList');
  reviewList.replaceChildren();
  answers.filter((answer) => answer && (!answer.scoreable || answer.skipped || !answer.correct)).forEach((answer) => {
    const item = document.createElement('p');
    item.className = 'review-item';
    const label = !answer.scoreable ? (answer.known ? 'Clave en revisión · sin puntuar' : 'Sin clave verificada · sin puntuar') : answer.skipped ? 'Saltada · repasar' : 'Repasar';
    item.textContent = `${String(answer.question.chapter).padStart(2, '0')}.${String(answer.question.number).padStart(2, '0')} · ${label} — ${answer.question.prompt}`;
    reviewList.append(item);
  });
  document.querySelector('#retryWrong').hidden = !answers.some((answer) => answer?.scoreable && (!answer.correct || answer.skipped));
  document.querySelector('#resultTitle').focus({ preventScroll: true });
  scrollExamIntoView(results);
};

const begin = async (selected, selectedMode) => {
  await ensureBank();
  mode = selectedMode;
  let pool = selected === 'all' ? allQuestions : allQuestions.filter((question) => question.chapter === Number(selected));
  if (mode === 'mock') pool = shuffle(pool.filter(isScoreableQuestion)).slice(0, testSize);
  if (!pool.length) {
    // Antes el boton no hacia nada visible: el pool vacio era un return silencioso.
    announceNoQuestions(mode === 'mock'
      ? 'No hay preguntas con clave verificada para esa combinación. Probá con «Todos los temas».'
      : 'Ese tema no tiene preguntas en este banco. Probá con «Todos los temas».');
    return;
  }
  queue = pool;
  resetSession();
  hideTimer();
  clearResultTime();
  startPanel.hidden = true;
  results.hidden = true;
  quiz.hidden = false;
  setTakingExam(true);
  document.querySelector('#quizMode').textContent = mode === 'mock'
    ? `EXAMEN DE PRUEBA · ${queue.length} PREGUNTAS`
    : 'PRÁCTICA · CORRECCIÓN INMEDIATA';
  if (mode === 'mock') startTimer();
  setQuestion();
};

const runBegin = async (button, selected, selectedMode) => {
  button.disabled = true;
  try {
    await begin(selected, selectedMode);
  } finally {
    button.disabled = false;
  }
};
document.querySelector('#startStudy').addEventListener('click', (event) => runBegin(event.currentTarget, document.querySelector('#chapterSelect').value, 'practice'));
document.querySelector('#startMock').addEventListener('click', (event) => runBegin(event.currentTarget, 'all', 'mock'));
document.querySelector('#nextQuestion').addEventListener('click', () => { index += 1; setQuestion(); });
document.querySelector('#skipQuestion').addEventListener('click', skip);
document.querySelector('#exitQuiz').addEventListener('click', () => {
  hideTimer();
  clearResultTime();
  resetSession();
  quiz.hidden = true;
  startPanel.hidden = false;
  setTakingExam(false);
  window.scrollTo({ top: 0, behavior: 'auto' });
  document.querySelector('#startStudy').focus();
});
document.querySelector('#finishQuiz').addEventListener('click', () => {
  hideTimer();
  clearResultTime();
  resetSession();
  results.hidden = true;
  startPanel.hidden = false;
  setTakingExam(false);
  window.scrollTo({ top: 0, behavior: 'auto' });
  document.querySelector('#startStudy').focus();
});
document.querySelector('#retryWrong').addEventListener('click', () => {
  const wrong = answers.filter((answer) => answer && answer.scoreable && (!answer.correct || answer.skipped)).map((answer) => answer.question);
  // El boton se oculta cuando no hay nada que repasar, asi que este guardia es defensivo.
  if (!wrong.length) return;
  hideTimer();
  clearResultTime();
  queue = shuffle(wrong);
  resetSession();
  mode = 'practice';
  results.hidden = true;
  quiz.hidden = false;
  setTakingExam(true);
  document.querySelector('#quizMode').textContent = 'REPASO DE ERRORES';
  setQuestion();
});
document.querySelector('#startReview').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    await ensureBank();
  } finally {
    button.disabled = false;
  }
  const missed = new Set(readMissed());
  const questions = allQuestions.filter((question) => missed.has(question.id));
  // El contador de errores guardados puede quedar viejo si el banco cambio: se avisa en vez de fallar en silencio.
  if (!questions.length) {
    announceNoQuestions('No quedan preguntas marcadas para repasar en este dispositivo.');
    return;
  }
  hideTimer();
  clearResultTime();
  queue = shuffle(questions);
  resetSession();
  mode = 'practice';
  startPanel.hidden = true;
  results.hidden = true;
  quiz.hidden = false;
  setTakingExam(true);
  document.querySelector('#quizMode').textContent = 'REPASO · PREGUNTAS MARCADAS';
  setQuestion();
});

// Un valor de ?chapter= que no exista dejaba el select vacio y, al pulsar, un pool vacio.
// Se valida contra las opciones reales y, si no calza, se vuelve a "Todos los temas" avisando.
const params = new URLSearchParams(location.search);
const chapterSelect = document.querySelector('#chapterSelect');
const requestedChapter = params.get('chapter');
if (requestedChapter !== null) {
  const known = [...chapterSelect.options].some((option) => option.value === requestedChapter);
  if (known) chapterSelect.value = requestedChapter;
  else {
    chapterSelect.value = 'all';
    announceNoQuestions(`El enlace apunta al tema ${requestedChapter}, que no existe en este banco. Mostramos todos los temas.`);
  }
}
