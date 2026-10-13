/* =========================================================
   ⚙️ CONFIGURACIÓN — SOLO CAMBIA ESTA LÍNEA
   ========================================================= */

// 👇👇👇 PON AQUÍ TU CORREO REAL 👇👇👇
const MI_CORREO = "mariojesusdh14200818@gmail.com";
// 👆👆👆 PON AQUÍ TU CORREO REAL 👆👆👆

// Endpoint AJAX de FormSubmit
const ENDPOINT_FORMSUBMIT = `https://formsubmit.co/ajax/${MI_CORREO}`;

/* =========================================================
   ESTADO GLOBAL
   ========================================================= */
const respuestas = {
  nombre: "",
  comida: "",
  comidaOtra: "",
  flores: "",
  floresOtra: "",
  plan: "",
  planOtra: "",
  fecha: "",
  fechaISO: "",
  hora: "",
  mensaje: ""
};

/* =========================================================
   REFERENCIAS
   ========================================================= */
const pantallas     = Array.from(document.querySelectorAll('.screen'));
const progressTrack = document.getElementById('progressTrack');
const progressFill  = document.getElementById('progressFill');
const toast         = document.getElementById('toast');

let pasoActual = 0;

/* =========================================================
   TOAST
   ========================================================= */
let toastTimeout = null;
function mostrarToast(mensaje, duracion = 2200) {
  toast.textContent = mensaje;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, duracion);
}

/* =========================================================
   NAVEGACIÓN ENTRE PANTALLAS
   ========================================================= */
function mostrarPaso(nuevoPaso) {
  if (nuevoPaso < 0 || nuevoPaso >= pantallas.length) return;

  pantallas.forEach(p => {
    p.classList.remove('active');
  });

  const pantalla = pantallas[nuevoPaso];
  pantalla.classList.add('active');

  pasoActual = nuevoPaso;

  if (nuevoPaso === 0) {
    btnNo.classList.remove('oculto');
  } else {
    btnNo.classList.add('oculto');
  }

  actualizarUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const inputVisible = pantalla.querySelector('input[type="text"]:not([id*="Otra"])');
  if (inputVisible && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    setTimeout(() => inputVisible.focus(), 350);
  }

  const textareaVisible = pantalla.querySelector('textarea');
  if (textareaVisible && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    setTimeout(() => textareaVisible.focus(), 350);
  }
}

function actualizarUI() {
  const totalPreguntas = 7;
  const progreso = pasoActual === 0
    ? 0
    : Math.min((pasoActual / totalPreguntas) * 100, 100);

  progressFill.style.width = progreso + '%';

  progressTrack.style.opacity = pasoActual === 0 ? '0' : '1';
}

/* =========================================================
   BOTÓN "NO"
   ========================================================= */
const btnYes = document.getElementById('btnYes');
const btnNo  = document.getElementById('btnNo');
const hint   = document.getElementById('hint');

const frases = [
  "¿Segura? 🥺",
  "Piénsalo bien...",
  "El botón se escapó 😳",
  "¡Ups! Se movió solo",
  "Inténtalo otra vez 😜",
  "Mejor di que sí 💖",
  "Este botón no coopera",
  "¿En serio? 😢",
  "Se está escondiendo...",
  "¡Ya ríndete, di sí! 🌸",
  "¡No me alcanzas! 🏃‍♀️",
  "Corre, corre 🐾",
  "Casi casi... 😏",
  "Ni lo intentes 😌"
];

let intentos = 0;

function posicionAleatoria() {
  const ancho = btnNo.offsetWidth  || 120;
  const alto  = btnNo.offsetHeight || 48;
  const pad = 16;

  const maxX = Math.max(window.innerWidth  - ancho - pad, pad);
  const maxY = Math.max(window.innerHeight - alto  - pad, pad);

  const rect = btnNo.getBoundingClientRect();
  const actualX = rect.left;
  const actualY = rect.top;

  let x = pad, y = pad;
  for (let i = 0; i < 15; i++) {
    x = pad + Math.random() * (maxX - pad);
    y = pad + Math.random() * (maxY - pad);

    const dx = x - actualX;
    const dy = y - actualY;
    if (Math.sqrt(dx * dx + dy * dy) > 160) break;
  }
  return { x, y };
}

function saltarBotonNo() {
  if (pasoActual !== 0) return;

  intentos++;

  if (!btnNo.classList.contains('huidizo')) {
    const rect = btnNo.getBoundingClientRect();
    document.body.appendChild(btnNo);

    btnNo.style.position = 'fixed';
    btnNo.style.left = rect.left + 'px';
    btnNo.style.top  = rect.top  + 'px';
    btnNo.style.width = rect.width + 'px';
    btnNo.style.height = rect.height + 'px';

    void btnNo.offsetWidth;
    btnNo.classList.add('huidizo');
  }

  const { x, y } = posicionAleatoria();
  btnNo.style.left = x + 'px';
  btnNo.style.top  = y + 'px';

  btnNo.style.transform = 'scale(1.12) rotate(-6deg)';
  setTimeout(() => {
    btnNo.style.transform = 'scale(1) rotate(0deg)';
  }, 220);

  hint.textContent = frases[intentos % frases.length];

  btnNo.style.opacity = '1';
  btnNo.style.pointerEvents = 'auto';
  btnNo.style.display = 'inline-flex';
  btnNo.style.visibility = 'visible';
}

const DISTANCIA_SEGURA = 90;

document.addEventListener('mousemove', (e) => {
  if (pasoActual !== 0) return;
  if (btnNo.classList.contains('oculto')) return;

  const rect = btnNo.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;

  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < DISTANCIA_SEGURA) {
    saltarBotonNo();
  }
});

btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  saltarBotonNo();
}, { passive: false });

btnNo.addEventListener('pointerdown', (e) => {
  if (e.pointerType !== 'mouse') {
    e.preventDefault();
    saltarBotonNo();
  }
});

btnNo.addEventListener('click', (e) => {
  e.preventDefault();
  saltarBotonNo();
});

window.addEventListener('resize', () => {
  if (btnNo.classList.contains('huidizo') && pasoActual === 0) {
    const rect = btnNo.getBoundingClientRect();
    const maxX = window.innerWidth  - rect.width  - 16;
    const maxY = window.innerHeight - rect.height - 16;
    const newX = Math.min(Math.max(rect.left, 16), Math.max(maxX, 16));
    const newY = Math.min(Math.max(rect.top,  16), Math.max(maxY, 16));
    btnNo.style.left = newX + 'px';
    btnNo.style.top  = newY + 'px';
  }
});

btnYes.addEventListener('click', () => {
  lanzarConfetiSuave();
  setTimeout(() => mostrarPaso(1), 250);
});

/* =========================================================
   SELECCIÓN DE OPCIONES
   ========================================================= */
document.querySelectorAll('.options-grid, .options-list').forEach(group => {
  const key = group.dataset.key;

  group.querySelectorAll('.option-card, .option-row').forEach(opt => {
    opt.addEventListener('click', () => {
      group.querySelectorAll('.option-card, .option-row')
           .forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');

      const valor = opt.dataset.value;
      const otroInputId = opt.dataset.otroInput;

      if (valor === '__OTRO__' && otroInputId) {
        respuestas[key] = '__OTRO__';
        const fieldOtro = document.getElementById(
          'field' + otroInputId.charAt(0).toUpperCase() + otroInputId.slice(1)
        );
        if (fieldOtro) {
          fieldOtro.hidden = false;
          const input = document.getElementById(otroInputId);
          if (input) {
            setTimeout(() => input.focus(), 100);
          }
        }
      } else {
        respuestas[key] = valor;

        const screenActual = opt.closest('.screen');
        if (screenActual) {
          screenActual.querySelectorAll('.field-otro').forEach(f => {
            if (!f.hidden) {
              f.hidden = true;
              const inp = f.querySelector('input');
              if (inp) {
                inp.value = '';
                respuestas[inp.id] = '';
              }
            }
          });
        }
      }
    });
  });
});

/* =========================================================
   BOTONES "CONTINUAR"
   ========================================================= */
document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => {
    const paso = parseInt(btn.dataset.next, 10);
    const validate = btn.dataset.validate;

    if (!validarPaso(validate)) return;

    mostrarPaso(paso + 1);
  });
});

function validarPaso(key) {
  if (!key) return true;

  const pantallaActual = pantallas[pasoActual];

  if (key === 'inputNombre') {
    const val = document.getElementById('inputNombre').value.trim();
    if (!val) {
      marcarError(document.getElementById('inputNombre'));
      mostrarToast("✏️ Escribe tu nombre para continuar");
      return false;
    }
    respuestas.nombre = val;
  }

  if (key === 'fecha') {
    if (!respuestas.fechaISO) {
      const cal = document.getElementById('calendar');
      if (cal) {
        cal.classList.add('shake');
        setTimeout(() => cal.classList.remove('shake'), 500);
      }
      mostrarToast("🌸 Elige un día para la cita");
      return false;
    }
  }

  if (key === 'hora') {
    if (!respuestas.hora) {
      const tp = document.querySelector('.time-picker');
      if (tp) {
        tp.classList.add('shake');
        setTimeout(() => tp.classList.remove('shake'), 500);
      }
      mostrarToast("🌸 Elige una hora también");
      return false;
    }
  }

  if (key === 'comida' || key === 'flores' || key === 'plan') {
    if (!respuestas[key]) {
      const grupo = pantallaActual.querySelector(`[data-key="${key}"]`);
      if (grupo) {
        grupo.classList.add('shake');
        setTimeout(() => grupo.classList.remove('shake'), 500);
      }
      const mensajes = {
        comida: "🍽️ Elige qué te gustaría comer",
        flores: "🌷 Elige tus flores favoritas",
        plan:   "🎬 Elige el plan que prefieras"
      };
      mostrarToast(mensajes[key] || "Elige una opción para continuar");
      return false;
    }

    if (respuestas[key] === '__OTRO__') {
      const inputId = key + 'Otra';
      const input = document.getElementById(inputId);
      const texto = input ? input.value.trim() : '';

      if (!texto) {
        if (input) marcarError(input);
        const mensajes = {
          comida: "✏️ Cuéntame qué se te antoja",
          flores: "✏️ Dime qué flores te gustan",
          plan:   "✏️ Cuéntame qué plan tienes en mente"
        };
        mostrarToast(mensajes[key] || "Escribe qué prefieres");
        return false;
      }
      respuestas[inputId] = texto;
    }
  }

  return true;
}

function marcarError(el) {
  el.classList.add('shake');
  el.style.borderColor = '#ff6b8b';
  el.style.boxShadow = '0 0 0 4px rgba(255,107,139,0.15)';
  setTimeout(() => {
    el.classList.remove('shake');
    el.style.borderColor = '';
    el.style.boxShadow = '';
  }, 700);
  return false;
}

/* =========================================================
   CALENDARIO
   ========================================================= */
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const DIAS_CORTOS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

const calendarTitle  = document.getElementById('calendarTitle');
const calendarDays   = document.getElementById('calendarDays');
const calPrev        = document.getElementById('calPrev');
const calNext        = document.getElementById('calNext');
const fechaDisplay   = document.getElementById('fechaSeleccionada');

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);
let mesVisible = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

function renderCalendario() {
  const year  = mesVisible.getFullYear();
  const month = mesVisible.getMonth();

  calendarTitle.textContent = `${MESES[month]} ${year}`;
  calendarDays.innerHTML = '';

  const primerDia = new Date(year, month, 1).getDay();
  const diasMes   = new Date(year, month + 1, 0).getDate();
  const diasPrevMes = new Date(year, month, 0).getDate();

  for (let i = primerDia - 1; i >= 0; i--) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-day otro-mes';
    btn.textContent = diasPrevMes - i;
    btn.disabled = true;
    calendarDays.appendChild(btn);
  }

  for (let d = 1; d <= diasMes; d++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-day';
    btn.textContent = d;

    const fechaDia = new Date(year, month, d);
    fechaDia.setHours(0, 0, 0, 0);

    if (fechaDia.getTime() === hoy.getTime()) {
      btn.classList.add('today');
    }

    if (fechaDia < hoy) {
      btn.disabled = true;
    }

    if (respuestas.fechaISO) {
      const seleccionada = new Date(respuestas.fechaISO + 'T00:00:00');
      if (seleccionada.getTime() === fechaDia.getTime()) {
        btn.classList.add('seleccionado');
      }
    }

    btn.addEventListener('click', () => {
      calendarDays.querySelectorAll('.cal-day.seleccionado')
        .forEach(el => el.classList.remove('seleccionado'));

      btn.classList.add('seleccionado');

      const isoStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      respuestas.fechaISO = isoStr;

      const diaSemana = DIAS_CORTOS[fechaDia.getDay()];
      respuestas.fecha = `${diaSemana} ${d} de ${MESES[month]} de ${year}`;

      fechaDisplay.innerHTML = `<strong>${respuestas.fecha}</strong>`;
    });

    calendarDays.appendChild(btn);
  }

  const celdasTotales = primerDia + diasMes;
  const celdasRestantes = (7 - (celdasTotales % 7)) % 7;
  for (let i = 1; i <= celdasRestantes; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-day otro-mes';
    btn.textContent = i;
    btn.disabled = true;
    calendarDays.appendChild(btn);
  }

  const mesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  calPrev.disabled = mesVisible.getTime() <= mesActual.getTime();
  calPrev.style.opacity = calPrev.disabled ? 0.35 : 1;
  calPrev.style.cursor  = calPrev.disabled ? 'not-allowed' : 'pointer';
}

calPrev.addEventListener('click', () => {
  mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() - 1, 1);
  renderCalendario();
});

calNext.addEventListener('click', () => {
  mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 1);
  renderCalendario();
});

renderCalendario();

/* =========================================================
   SELECTOR DE HORA
   ========================================================= */
const hourList    = document.getElementById('hourList');
const minuteList  = document.getElementById('minuteList');
const ampmList    = document.getElementById('ampmList');
const horaDisplay = document.getElementById('horaSeleccionada');

let horaTemp  = null;
let minTemp   = null;
let ampmTemp  = null;

function renderHora() {
  hourList.innerHTML = '';
  for (let h = 1; h <= 12; h++) {
    const item = document.createElement('div');
    item.className = 'time-item';
    item.textContent = String(h).padStart(2, '0');
    item.dataset.value = h;

    if (horaTemp === h) item.classList.add('selected');

    item.addEventListener('click', () => {
      horaTemp = h;
      hourList.querySelectorAll('.time-item').forEach(x => x.classList.remove('selected'));
      item.classList.add('selected');
      item.scrollIntoView({ block: 'center', behavior: 'smooth' });
      actualizarHora();
    });

    hourList.appendChild(item);
  }

  minuteList.innerHTML = '';
  for (let m = 0; m < 60; m += 5) {
    const item = document.createElement('div');
    item.className = 'time-item';
    item.textContent = String(m).padStart(2, '0');
    item.dataset.value = m;

    if (minTemp === m) item.classList.add('selected');

    item.addEventListener('click', () => {
      minTemp = m;
      minuteList.querySelectorAll('.time-item').forEach(x => x.classList.remove('selected'));
      item.classList.add('selected');
      item.scrollIntoView({ block: 'center', behavior: 'smooth' });
      actualizarHora();
    });

    minuteList.appendChild(item);
  }

  ampmList.innerHTML = '';
  ['a. m.', 'p. m.'].forEach(label => {
    const item = document.createElement('div');
    item.className = 'time-item';
    item.textContent = label;
    item.dataset.value = label;

    if (ampmTemp === label) item.classList.add('selected');

    item.addEventListener('click', () => {
      ampmTemp = label;
      ampmList.querySelectorAll('.time-item').forEach(x => x.classList.remove('selected'));
      item.classList.add('selected');
      actualizarHora();
    });

    ampmList.appendChild(item);
  });
}

function actualizarHora() {
  if (horaTemp !== null && minTemp !== null && ampmTemp !== null) {
    const hStr = String(horaTemp).padStart(2, '0');
    const mStr = String(minTemp).padStart(2, '0');
    respuestas.hora = `${hStr}:${mStr} ${ampmTemp}`;
    horaDisplay.innerHTML = `<strong>${respuestas.hora}</strong>`;
  }
}

renderHora();

/* =========================================================
   MENSAJE FINAL
   ========================================================= */
const inputMensaje = document.getElementById('inputMensaje');
inputMensaje.addEventListener('input', () => {
  respuestas.mensaje = inputMensaje.value.trim();
});

/* =========================================================
   ENVÍO FINAL
   ========================================================= */
const btnEnviar = document.getElementById('btnEnviar');

btnEnviar.addEventListener('click', async () => {
  const texto = inputMensaje.value.trim();
  if (!texto) {
    marcarError(inputMensaje);
    mostrarToast("💬 Cuéntame algo bonito antes de enviar");
    inputMensaje.focus();
    return;
  }
  respuestas.mensaje = texto;

  btnEnviar.disabled = true;
  const spanTexto = btnEnviar.querySelector('span');
  const spanEmoji = btnEnviar.querySelector('.btn-emoji');
  spanTexto.textContent = 'Enviando...';
  spanEmoji.textContent = '⏳';

  const comidaFinal = respuestas.comida === '__OTRO__'
    ? (respuestas.comidaOtra || '(sin especificar)')
    : (respuestas.comida || '(sin elegir)');

  const floresFinal = respuestas.flores === '__OTRO__'
    ? (respuestas.floresOtra || '(sin especificar)')
    : (respuestas.flores || '(sin elegir)');

  const planFinal = respuestas.plan === '__OTRO__'
    ? (respuestas.planOtra || '(sin especificar)')
    : (respuestas.plan || '(sin elegir)');

  const datos = {
    _subject: "💖 Nueva respuesta de tu invitación",
    _template: "table",
    _captcha: "false",
    nombre:  respuestas.nombre   || '(sin nombre)',
    comida:  comidaFinal,
    flores:  floresFinal,
    plan:    planFinal,
    fecha:   respuestas.fecha    || '(sin fecha)',
    hora:    respuestas.hora     || '(sin hora)',
    mensaje: respuestas.mensaje  || '(sin mensaje)'
  };

  try {
    const response = await fetch(ENDPOINT_FORMSUBMIT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    if (!response.ok) throw new Error('Error al enviar');

    lanzarConfetiFuerte();
    setTimeout(() => {
      mostrarPaso(pantallas.length - 1);
    }, 400);

  } catch (error) {
    console.error('Error al enviar:', error);
    mostrarToast("😢 Hubo un error, intenta de nuevo", 3000);
    btnEnviar.disabled = false;
    spanTexto.textContent = 'Enviar respuesta';
    spanEmoji.textContent = '💌';
  }
});

/* =========================================================
   CONFETI
   ========================================================= */
function cargarConfeti() {
  return new Promise((resolve) => {
    if (window.confetti) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

async function lanzarConfetiSuave() {
  await cargarConfeti();
  window.confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#ff9ec7', '#b59dff', '#ffd6e8', '#fff4d6']
  });
}

async function lanzarConfetiFuerte() {
  await cargarConfeti();
  const end = Date.now() + 1500;
  (function frame() {
    window.confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff9ec7', '#b59dff', '#ffd6e8', '#fff4d6']
    });
    window.confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff9ec7', '#b59dff', '#ffd6e8', '#fff4d6']
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/* =========================================================
   INPUTS "OTRO"
   ========================================================= */
const comidaOtra = document.getElementById('comidaOtra');
if (comidaOtra) {
  comidaOtra.addEventListener('input', () => {
    respuestas.comidaOtra = comidaOtra.value.trim();
  });
}

const floresOtra = document.getElementById('floresOtra');
if (floresOtra) {
  floresOtra.addEventListener('input', () => {
    respuestas.floresOtra = floresOtra.value.trim();
  });
}

const planOtra = document.getElementById('planOtra');
if (planOtra) {
  planOtra.addEventListener('input', () => {
    respuestas.planOtra = planOtra.value.trim();
  });
}

/* =========================================================
   INIT
   ========================================================= */
actualizarUI();