/* ==========================================
   SCROLL ANIMATIONS - Intersection Observer
   ========================================== */

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-delay') || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('timeline-item')) {
          entry.target.classList.add('show-animate');
        }
      }, parseInt(delay));
    }
  });
}, { threshold: 0.15 });

// Observe all elements with data-animate attribute
document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

/* ==========================================
   PROMISE OVERLAY CONTROLS
   ========================================== */

function hideAllStages() {
  document.getElementById('promiseStage1').style.display = 'none';
  document.getElementById('promiseStage1').classList.remove('stage-active');

  document.getElementById('promiseStage2').style.display = 'none';
  document.getElementById('promiseStage2').classList.remove('stage-active');

  document.getElementById('promiseStage3').style.display = 'none';
  document.getElementById('promiseStage3').classList.remove('stage-active');
}

window.showPromiseAnimation = function () {
  const promiseOverlay = document.getElementById('promiseOverlay');
  if (promiseOverlay) {
    hideAllStages();

    // Reset to Stage 1
    const stage1 = document.getElementById('promiseStage1');
    stage1.style.display = 'block';

    promiseOverlay.classList.add('show');

    // Slight delay to allow display:block to render before triggering animation class
    setTimeout(() => {
      stage1.classList.add('stage-active');
    }, 50);
  }
}

window.closePromiseAnimation = function () {
  const promiseOverlay = document.getElementById('promiseOverlay');
  if (promiseOverlay) {
    promiseOverlay.classList.remove('show');

    // Cleanup rain if any
    document.querySelectorAll('.raining-emoji').forEach(el => el.remove());
  }
}

// Stage 1 Action ("Can You Give me a Promise?")
window.handlePromiseYes = function () {
  hideAllStages();
  const stage2 = document.getElementById('promiseStage2');
  stage2.style.display = 'block';
  setTimeout(() => {
    stage2.classList.add('stage-active');
  }, 50);
}

window.handlePromiseNo = function () {
  // Rain Sad Emojis
  rainEmojis(['😭', '😢', '💔', '⚡']);
}

// Transition from Stage 2 -> Stage 3
window.showMarryMeStage = function () {
  hideAllStages();
  const stage3 = document.getElementById('promiseStage3');
  stage3.style.display = 'block';
  setTimeout(() => {
    stage3.classList.add('stage-active');
  }, 50);
}

// Final Stage Actions
window.handleMarryYes = function () {
  rainEmojis(['💖', '💍', '🥰', '👰‍♀️', '🤵‍♂️'], 60);

  // Add background hearts for added effect
  if (typeof createHeartAnimation === 'function') {
    for (let i = 0; i < 30; i++) {
      createHeartAnimation();
    }
  }
}

window.handleMarryNo = function () {
  rainEmojis(['😭', '🙏', '⚡', '⛈️'], 40);
}

// The Teleporting "No" Button effect
window.moveButton = function (btn) {
  // Ensure it's ripped out of regular document flow so translate doesn't get weird
  if (btn.style.position !== 'fixed') {
    const rect = btn.getBoundingClientRect();
    btn.style.position = 'fixed';
    btn.style.left = rect.left + 'px';
    btn.style.top = rect.top + 'px';
    btn.style.zIndex = '10005'; // Way above the overlay
  }

  // Keep it within a safe 'inner box' of the screen so it doesn't get clipped
  const safePaddingX = 100; // pixels from edge
  const safePaddingY = 100;

  const minX = safePaddingX;
  const minY = safePaddingY;
  const maxX = window.innerWidth - btn.offsetWidth - safePaddingX;
  const maxY = window.innerHeight - btn.offsetHeight - safePaddingY;

  // Calculate random position ensuring element stays in safe viewport
  const randomX = Math.random() * (maxX - minX) + minX;
  const randomY = Math.random() * (maxY - minY) + minY;

  btn.style.left = `${randomX}px`;
  btn.style.top = `${randomY}px`;
  btn.style.transform = 'none'; // Clear translate if previously set by CSS animations
}

// Helper: Raining Emojis
function rainEmojis(emojiOptions, count = 30) {
  const overlay = document.getElementById('promiseOverlay');

  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div');
    drop.classList.add('raining-emoji');

    // Random emoji from the array provided
    drop.innerText = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];

    // Randomize position, size, and animation duration
    drop.style.left = Math.random() * 100 + 'vw';
    drop.style.animationDuration = Math.random() * 2 + 3 + 's'; // 3 to 5 seconds
    drop.style.fontSize = Math.random() * 2 + 1.5 + 'rem';

    // Randomize delay so they don't all fall at once
    drop.style.animationDelay = Math.random() * 2 + 's';

    overlay.appendChild(drop);

    // Cleanup after animation completes to avoid memory leaks
    setTimeout(() => {
      drop.remove();
    }, 6000);
  }
}
