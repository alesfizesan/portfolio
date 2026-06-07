const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Matrix rain
const canvas = document.getElementById('matrix-canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let cols = Math.floor(canvas.width / 14);
const drops = Array.from({length: cols}, () => Math.floor(Math.random() * (canvas.height / 14)));
const chars = '01アイウエオカキクケコ#$%<>{}[]ナニヌネノ*&^!?';

function drawMatrix() {
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '12px Space Mono, monospace';
  for (let i = 0; i < drops.length; i++) {
    const c = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillStyle = Math.random() > 0.97 ? '#ffffff' : '#72BF23';
    ctx.globalAlpha = Math.random() * 0.7 + 0.3;
    ctx.fillText(c, i * 14, drops[i] * 14);
    ctx.globalAlpha = 1;
    if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}
if (!reducedMotion) setInterval(drawMatrix, 50);

// Anomaly counter
function startAnomalyCounter() {
  const countEl = document.getElementById('anomaly-count');
  if (!countEl) return;
  if (reducedMotion) { countEl.textContent = '8,347'; return; }
  countEl.textContent = '0';
  const phases = [
    { step: 1000, limit: 8000 },
    { step: 100,  limit: 8300 },
    { step: 10,   limit: 8340 },
    { step: 1,    limit: 8347 }
  ];
  let current = 0, phaseIndex = 0;
  function countUp() {
    if (phaseIndex >= phases.length) return;
    const phase = phases[phaseIndex];
    current += phase.step;
    if (current >= phase.limit) {
      current = phase.limit;
      countEl.textContent = current.toLocaleString();
      phaseIndex++;
      if (phaseIndex < phases.length) setTimeout(countUp, 130);
      return;
    }
    countEl.textContent = current.toLocaleString();
    setTimeout(countUp, 130);
  }
  countUp();
}

// Developer form counter
function startDevCounter() {
  const pel = document.getElementById('dev-pct');
  if (!pel) return;
  if (reducedMotion) { pel.textContent = '47%'; return; }
  pel.textContent = '0%';
  let pct = 0;
  function gp() {
    if (pct < 47) { pct++; pel.textContent = pct + '%'; setTimeout(gp, 60); }
  }
  gp();
}

// Role cycling
const roles = [
  'QA ENGINEER', 'BUG HUNTER', 'ANOMALY DETECTOR',
  'SYSTEM BREAKER', 'CODE ARCHAEOLOGIST', 'DEVELOPER IN PROGRESS...'
];
let ri = 0;
const rel = document.getElementById('hero-role');
function startRoleCycling() {
  function cycleRole() {
    rel.style.animation = 'none';
    rel.offsetHeight;
    rel.style.animation = 'fadein 0.5s ease';
    rel.textContent = roles[ri++ % roles.length];
    setTimeout(cycleRole, 2500);
  }
  setTimeout(cycleRole, 2500);
}

// Terminal
const lines = [
  "wake up...", "the matrix has you...", "follow the white rabbit →",
  "knock, knock...", "how deep does it go?", "you take the red pill...",
  "reality.exe is unstable.", "QA_to_DEV.exe: loading...",
  "anomaly detected: potential.", "there is no bug. yet."
];
let ti = 0;
const tel = document.getElementById('terminal-text');
function startTerminal() {
  function cy() {
    tel.textContent = lines[ti++ % lines.length];
    setTimeout(cy, 2200);
  }
  cy();
}

// Sequential reveal after name types
function onNameComplete() {
  const items = document.querySelectorAll('.reveal-item:not(.badge)');
  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('visible');
      if (item.classList.contains('hero-stats')) {
        setTimeout(() => {
          startAnomalyCounter();
          startDevCounter();
        }, 400);
      }
      if (item.classList.contains('terminal')) {
        setTimeout(startTerminal, 300);
      }
    }, index * 400);
  });
  if (!reducedMotion) {
    setTimeout(startRoleCycling, 800);
  }
}

// Typing effect
const name = "Aleš Fizešan";
const el = document.getElementById('typed-name');
let ni = 0;
function tp() {
  if (ni < name.length) {
    el.textContent += name[ni++];
    setTimeout(tp, reducedMotion ? 0 : 90);
  } else {
    setTimeout(onNameComplete, 400);
  }
}
setTimeout(startTerminal, 500);
const badge = document.querySelector('.badge');
setTimeout(() => {
  if (badge) badge.classList.add('visible');
  setTimeout(tp, reducedMotion ? 0 : 600);
}, reducedMotion ? 0 : 400);

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const oldCols = cols;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 14);
    drops.length = cols;
    for (let i = oldCols; i < cols; i++) {
      drops[i] = Math.floor(Math.random() * (canvas.height / 14));
    }
  }, 200);
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

function openMenu() {
  navLinks.classList.add('open');
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', true);
  const firstLink = navLinks.querySelector('a');
  if (firstLink) firstLink.focus();
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', false);
  hamburger.focus();
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
});

document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) closeMenu();
});