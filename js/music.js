/* ==========================================
   BACKGROUND MUSIC - Web Audio API
   ========================================== */

let audioCtx = null;
let isPlaying = false;
let musicNodes = [];

function createRomanticMelody() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const notes = [
    { freq: 261.6, dur: 2 },   // C4
    { freq: 329.6, dur: 2 },   // E4
    { freq: 392.0, dur: 2 },   // G4
    { freq: 349.2, dur: 2 },   // F4
    { freq: 293.7, dur: 2 },   // D4
    { freq: 329.6, dur: 2 },   // E4
    { freq: 261.6, dur: 3 },   // C4
    { freq: 246.9, dur: 2 },   // B3
    { freq: 261.6, dur: 2 },   // C4
    { freq: 349.2, dur: 2 },   // F4
    { freq: 329.6, dur: 2 },   // E4
    { freq: 293.7, dur: 3 },   // D4
    { freq: 261.6, dur: 2 },   // C4
    { freq: 392.0, dur: 2 },   // G4
    { freq: 349.2, dur: 2 },   // F4
    { freq: 329.6, dur: 3 },   // E4
  ];

  let t = audioCtx.currentTime + 0.1;

  function scheduleLoop(startTime) {
    notes.forEach(note => {
      // Main tone
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.value = note.freq;

      filter.type = 'lowpass';
      filter.frequency.value = 800;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.06, startTime + 0.3);
      gain.gain.linearRampToValueAtTime(0.04, startTime + note.dur * 0.7);
      gain.gain.linearRampToValueAtTime(0, startTime + note.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + note.dur);
      musicNodes.push(osc);

      // Subtle harmony (fifth above, very quiet)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.value = note.freq * 1.5;
      gain2.gain.setValueAtTime(0, startTime);
      gain2.gain.linearRampToValueAtTime(0.015, startTime + 0.5);
      gain2.gain.linearRampToValueAtTime(0, startTime + note.dur);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(startTime);
      osc2.stop(startTime + note.dur);
      musicNodes.push(osc2);

      startTime += note.dur;
    });
    return startTime;
  }

  // Schedule several loops for continuous playback
  let time = t;
  for (let i = 0; i < 8; i++) {
    time = scheduleLoop(time);
  }
}

function toggleMusic() {
  const btn = document.getElementById('musicBtn');

  if (!isPlaying) {
    createRomanticMelody();
    isPlaying = true;
    btn.classList.add('playing');
  } else {
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }
    musicNodes = [];
    isPlaying = false;
    btn.classList.remove('playing');
  }
}
