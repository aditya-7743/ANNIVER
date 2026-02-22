/* ==========================================
   DAYS TOGETHER COUNTER
   ========================================== */

function updateCounter() {
  const now = new Date();
  const diff = now - ANNIVERSARY_DATE;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cDays').textContent = days;
  document.getElementById('cHours').textContent = hours;
  document.getElementById('cMinutes').textContent = minutes;
  document.getElementById('cSeconds').textContent = seconds;

  // Heartbeat pulse on the seconds box every tick
  const secBox = document.getElementById('cSeconds').parentElement;
  secBox.classList.remove('heartbeat-pulse');
  void secBox.offsetWidth; // trigger reflow to restart animation
  secBox.classList.add('heartbeat-pulse');
}

// Update every second
setInterval(updateCounter, 1000);
updateCounter();
