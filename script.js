const canvas = document.querySelector(".sky-canvas");
const ctx = canvas.getContext("2d");
const particles = [];

const letterModal = document.querySelector("[data-letter-modal]");
const openLetter = document.querySelector("[data-open-letter]");
const closeLetter = document.querySelector("[data-close-letter]");
const sparkleButtons = document.querySelectorAll("[data-sparkle], [data-modal-sparkle]");
const typewriter = document.querySelector("[data-typewriter]");
const candles = document.querySelectorAll(".candle-card");
const starButtons = document.querySelectorAll(".star-dot");
const starMessage = document.querySelector("[data-star-message]");
const wishForm = document.querySelector("[data-wish-form]");
const wishInput = document.querySelector("#wish-input");
const savedWish = document.querySelector("[data-saved-wish]");
const countdownGate = document.querySelector("[data-countdown-gate]");
const giftContent = document.querySelector("[data-gift-content]");
const countdownDays = document.querySelector("[data-countdown-days]");
const countdownHours = document.querySelector("[data-countdown-hours]");
const countdownMinutes = document.querySelector("[data-countdown-minutes]");
const countdownSeconds = document.querySelector("[data-countdown-seconds]");
const countdownDate = document.querySelector("[data-countdown-date]");

function getNextMidnight() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(24, 0, 0, 0);
  return target;
}

const countdownEnabled = false;
const unlockAt = getNextMidnight();

function formatCountdown(value) {
  return String(value).padStart(2, "0");
}

function unlockGift() {
  document.body.classList.remove("gift-locked");
  giftContent.removeAttribute("aria-hidden");
  countdownGate.classList.add("is-open");
  burst(120, window.innerWidth / 2, window.innerHeight * 0.45);
  window.setTimeout(() => {
    countdownGate.hidden = true;
  }, 900);
}

function updateCountdown() {
  const remaining = unlockAt.getTime() - Date.now();
  if (remaining <= 0) {
    unlockGift();
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownDays.textContent = formatCountdown(days);
  countdownHours.textContent = formatCountdown(hours);
  countdownMinutes.textContent = formatCountdown(minutes);
  countdownSeconds.textContent = formatCountdown(seconds);
}

if (countdownEnabled) {
  document.body.classList.add("gift-locked");
  countdownGate.hidden = false;
  giftContent.setAttribute("aria-hidden", "true");
  countdownDate.textContent = `Se desbloquea a las 00:00 del ${unlockAt.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}.`;
  updateCountdown();
  const countdownTimer = window.setInterval(() => {
    if (countdownGate.hidden) {
      window.clearInterval(countdownTimer);
      return;
    }
    updateCountdown();
  }, 1000);
}

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function addParticle(x, y, options = {}) {
  particles.push({
    x,
    y,
    size: options.size ?? Math.random() * 5 + 4,
    speedX: (Math.random() - 0.5) * 2.8,
    speedY: Math.random() * -2.8 - 0.8,
    gravity: 0.025,
    alpha: 1,
    hue: options.hue ?? ["#f8c46a", "#f2a3ad", "#63c7c5", "#fff8ef"][Math.floor(Math.random() * 4)],
    rotation: Math.random() * Math.PI,
  });
}

function drawHeart(x, y, size, color, alpha, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(size / 18, size / 18);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(-12, -5, -8, -15, 0, -9);
  ctx.bezierCurveTo(8, -15, 12, -5, 0, 5);
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.speedY += particle.gravity;
    particle.alpha -= 0.008;
    particle.rotation += 0.02;
    drawHeart(particle.x, particle.y, particle.size, particle.hue, particle.alpha, particle.rotation);
    if (particle.alpha <= 0) particles.splice(i, 1);
  }
  requestAnimationFrame(animate);
}

function burst(count = 54, originX = window.innerWidth / 2, originY = window.innerHeight * 0.46) {
  for (let i = 0; i < count; i += 1) addParticle(originX, originY);
}

function typeLetter() {
  const fullText = typewriter.dataset.fullText || typewriter.textContent.trim();
  typewriter.dataset.fullText = fullText;
  typewriter.textContent = "";
  let index = 0;
  const timer = window.setInterval(() => {
    typewriter.textContent += fullText[index];
    index += 1;
    if (index >= fullText.length) window.clearInterval(timer);
  }, 22);
}

openLetter.addEventListener("click", () => {
  letterModal.showModal();
  burst(36);
});

closeLetter.addEventListener("click", () => letterModal.close());

letterModal.addEventListener("click", (event) => {
  if (event.target === letterModal) letterModal.close();
});

sparkleButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    burst(70, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
});

candles.forEach((candle) => {
  candle.addEventListener("click", () => {
    candle.classList.toggle("is-lit");
    const rect = candle.getBoundingClientRect();
    burst(16, rect.left + 30, rect.top + 34);
  });
});

starButtons.forEach((star) => {
  star.setAttribute("aria-label", "Revelar mensaje");
  star.addEventListener("click", () => {
    starMessage.textContent = star.dataset.message;
    const rect = star.getBoundingClientRect();
    burst(24, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
});

wishForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const wish = wishInput.value.trim();
  if (!wish) return;
  savedWish.textContent = `Queda guardado en esta noche: "${wish}"`;
  wishInput.value = "";
  burst(82, window.innerWidth / 2, window.innerHeight * 0.72);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !typewriter.dataset.typed) {
        typewriter.dataset.typed = "true";
        typeLetter();
      }
    });
  },
  { threshold: 0.45 }
);

resizeCanvas();
observer.observe(typewriter);
animate();
window.addEventListener("resize", resizeCanvas);
