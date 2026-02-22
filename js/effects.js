/* ==========================================
   EFFECTS - Splash, Floating Hearts, Sparkles
   ========================================== */

// ============ SPLASH SCREEN ============
function startExperience() {
  document.getElementById('splash').classList.add('hidden');
  createFloatingHearts();
}

// ============ FLOATING HEARTS ============
function createFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const hearts = ['💕', '💗', '💖', '💝', '✨', '🌸', '💫', '♥'];

  setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'float-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (6 + Math.random() * 6) + 's';
    heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 12000);
  }, 800);
}

// ============ SPARKLE MOUSE TRAIL ============
let lastSparkle = 0;

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastSparkle < 80) return;
  lastSparkle = now;

  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.textContent = ['✨', '💗', '⭐', '💫'][Math.floor(Math.random() * 4)];
  sparkle.style.left = e.clientX + 'px';
  sparkle.style.top = e.clientY + 'px';
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 800);
});
