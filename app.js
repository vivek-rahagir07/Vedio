// ============================================================
// NOT A GOOD — PURE CINEMATIC TYPOGRAPHIC ENGINE
// ============================================================
(() => {
  'use strict';

  // ------------------------------------------------------------
  // POEM TIMELINE (The Complete Journey)
  // ------------------------------------------------------------
  const TIMELINE = [
    // ACT I: NOT A GOOD [role]
    { type: 'kinetic', text: 'son.', delay: 1300 },
    { type: 'kinetic', text: 'friend.', delay: 1300 },
    { type: 'kinetic', text: 'student.', delay: 1300 },
    { type: 'kinetic', text: 'partner.', delay: 1300 },
    { type: 'kinetic', text: 'brother.', delay: 1300 },
    { type: 'kinetic', text: 'listener.', delay: 1300 },
    { type: 'kinetic', text: 'supporter.', delay: 1300 },
    { type: 'kinetic', text: 'creator.', delay: 1300 },
    { type: 'kinetic', text: 'leader.', delay: 1300 },
    { type: 'kinetic', text: 'teammate.', delay: 1300 },
    { type: 'kinetic', text: 'dreamer.', delay: 1300 },
    { type: 'kinetic', text: 'fighter.', delay: 1300 },
    { type: 'climax-person', text: 'person.', delay: 3800 },

    // ACT II: THE SHIFT
    { 
      type: 'passage', 
      main: 'But maybe that’s okay.', 
      sub: '', 
      mainGold: false,
      delay: 3800 
    },

    // ACT III: THE REALIZATION & ACCEPTANCE
    { 
      type: 'passage', 
      main: 'Because when no one is left to understand me,', 
      sub: 'I’ll still have myself.', 
      mainGold: false,
      delay: 4200 
    },
    { 
      type: 'passage', 
      main: 'And maybe being alone', 
      sub: 'is not my punishment—', 
      mainGold: false,
      subWhite: true,
      delay: 3800 
    },
    { 
      type: 'passage', 
      main: 'maybe it’s the place where I finally become', 
      sub: 'good enough for myself.', 
      mainGold: false,
      delay: 6000 
    }
  ];

  // ------------------------------------------------------------
  // APPLICATION STATE
  // ------------------------------------------------------------
  let currentIndex = 0;
  let isPlaying = true;
  let stepTimer = null;

  // Web Audio Context & Nodes
  let audioCtx = null;
  let masterGain = null;

  // ------------------------------------------------------------
  // DOM REFERENCES
  // ------------------------------------------------------------
  const particlesCanvas = document.getElementById('particlesCanvas');
  const kineticStatement = document.getElementById('kineticStatement');
  const staticPrefix = document.getElementById('staticPrefix');
  const roleText = document.getElementById('roleText');
  const passageStatement = document.getElementById('passageStatement');
  const passageMain = document.getElementById('passageMain');
  const passageSub = document.getElementById('passageSub');

  // ------------------------------------------------------------
  // PROCEDURAL AUDIO SYNTHESIZER
  // ------------------------------------------------------------
  function initAudio() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Soft kalimba acoustic note for word transition
  const ROLE_FREQS = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
  function playNote(idx = 0) {
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freq = ROLE_FREQS[idx % ROLE_FREQS.length] || 329.63;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch (_) {}
  }

  // Rapid cyber data tick sound during unscrambling
  function playDataTick() {
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(500 + Math.random() * 500, now);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (_) {}
  }

  // Deep Bass Swell for "But maybe that’s okay."
  function playSubSwell() {
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 1.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 2.5);
    } catch (_) {}
  }

  // Chime chord for epiphanies
  function playEpiphanyChord() {
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const chord = [261.63, 392.00, 523.25, 659.25];
      chord.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.06 / (i + 1), now + i * 0.08 + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now + i * 0.08);
        osc.stop(now + 3.2);
      });
    } catch (_) {}
  }

  // ------------------------------------------------------------
  // STARDUST CANVAS (Zero boundaries)
  // ------------------------------------------------------------
  let particles = [];
  function initParticles() {
    const canvas = particlesCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(50, Math.floor(window.innerWidth / 24));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.5 + 0.15,
        pulsing: Math.random() * 0.02 + 0.005,
        pulseVal: Math.random() * Math.PI
      });
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.pulseVal += p.pulsing;
        const currentAlpha = p.alpha * (0.6 + Math.sin(p.pulseVal) * 0.4);

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.fillStyle = `rgba(204, 164, 59, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render);
    }

    render();
  }

  // ------------------------------------------------------------
  // HACKER UNSCRAMBLE & POP-OUT REVEAL FOR ENTIRE "NOT A GOOD PERSON."
  // ------------------------------------------------------------
  let unscrambleTimer = null;

  function runCompleteUnscrambleReveal(onDone) {
    clearInterval(unscrambleTimer);

    const targetPrefix = 'NOT A GOOD';
    const targetWord = 'person.';

    if (staticPrefix) staticPrefix.classList.add('is-unscrambling');
    roleText.classList.add('is-unscrambling');
    kineticStatement.classList.remove('statement-popout');

    const chars = '!<>-_/[]{}—=+*^?#0101XYZKQ$&%';
    let frame = 0;
    const totalFrames = 26; // ~730ms duration (26 * 28ms)

    unscrambleTimer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      // 1. Unscramble Prefix "NOT A GOOD"
      let prefixOutput = '';
      for (let i = 0; i < targetPrefix.length; i++) {
        if (targetPrefix[i] === ' ') {
          prefixOutput += ' ';
        } else if (progress > (i + 1) / (targetPrefix.length + 1)) {
          prefixOutput += targetPrefix[i];
        } else {
          prefixOutput += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      if (staticPrefix) staticPrefix.textContent = prefixOutput;

      // 2. Unscramble Word "person."
      let wordOutput = '';
      for (let i = 0; i < targetWord.length; i++) {
        if (progress > (i + 1) / (targetWord.length + 1)) {
          wordOutput += targetWord[i];
        } else {
          wordOutput += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      roleText.textContent = wordOutput;
      roleText.setAttribute('data-text', wordOutput);

      playDataTick();

      // On Completion: LOCK IN AND POP OUT THE ENTIRE STATEMENT!
      if (frame >= totalFrames) {
        clearInterval(unscrambleTimer);
        if (staticPrefix) {
          staticPrefix.classList.remove('is-unscrambling');
          staticPrefix.textContent = targetPrefix;
        }
        roleText.classList.remove('is-unscrambling');
        roleText.textContent = targetWord;
        roleText.setAttribute('data-text', targetWord);

        // One-time explosive POP-OUT on the entire statement
        kineticStatement.classList.remove('statement-popout');
        void kineticStatement.offsetWidth;
        kineticStatement.classList.add('statement-popout');

        playSubSwell();
        if (onDone) onDone();
      }
    }, 28);
  }

  // ------------------------------------------------------------
  // CORE TIMELINE RENDER
  // ------------------------------------------------------------
  function renderStep(idx, triggerGlitch = true) {
    currentIndex = Math.max(0, Math.min(idx, TIMELINE.length - 1));
    const step = TIMELINE[currentIndex];

    // 1. ACT I: NOT A GOOD [role]
    if (step.type === 'kinetic') {
      clearInterval(unscrambleTimer);
      kineticStatement.classList.remove('statement-popout');
      if (staticPrefix) {
        staticPrefix.classList.remove('is-unscrambling');
        staticPrefix.textContent = 'NOT A GOOD';
      }
      roleText.classList.remove('is-unscrambling');

      kineticStatement.classList.remove('hidden');
      passageStatement.classList.add('hidden');

      roleText.className = 'role-text';
      roleText.textContent = step.text;
      roleText.setAttribute('data-text', step.text);

      if (triggerGlitch) {
        void roleText.offsetWidth;
        roleText.classList.add('hacker-glitch');
        playNote(currentIndex);
      }
    } 
    // Special Complete 'NOT A GOOD PERSON.' Unscramble & Pop-Out Reveal
    else if (step.type === 'climax-person') {
      kineticStatement.classList.remove('hidden');
      passageStatement.classList.add('hidden');

      if (triggerGlitch) {
        runCompleteUnscrambleReveal();
      } else {
        clearInterval(unscrambleTimer);
        if (staticPrefix) {
          staticPrefix.classList.remove('is-unscrambling');
          staticPrefix.textContent = 'NOT A GOOD';
        }
        roleText.classList.remove('is-unscrambling');
        roleText.className = 'role-text';
        roleText.textContent = 'person.';
        roleText.setAttribute('data-text', 'person.');
      }
    } 
    // 2. ACT II & III: NARRATIVE PASSAGE
    else if (step.type === 'passage') {
      clearInterval(unscrambleTimer);
      kineticStatement.classList.remove('statement-popout');
      if (staticPrefix) {
        staticPrefix.classList.remove('is-unscrambling');
        staticPrefix.textContent = 'NOT A GOOD';
      }
      roleText.classList.remove('is-unscrambling');

      kineticStatement.classList.add('hidden');
      passageStatement.classList.remove('hidden');

      passageMain.textContent = step.main;
      if (step.mainGold) {
        passageMain.classList.add('gold-text');
      } else {
        passageMain.classList.remove('gold-text');
      }

      if (step.sub) {
        passageSub.textContent = step.sub;
        passageSub.classList.remove('hidden');
        if (step.subWhite) {
          passageSub.classList.add('sub-white');
        } else {
          passageSub.classList.remove('sub-white');
        }
      } else {
        passageSub.textContent = '';
        passageSub.classList.add('hidden');
      }

      // Audio cues
      if (step.main.includes('maybe that’s okay')) {
        playSubSwell();
      } else {
        playEpiphanyChord();
      }
    }
  }

  // ------------------------------------------------------------
  // PLAYBACK ENGINE
  // ------------------------------------------------------------
  function scheduleNext() {
    clearTimeout(stepTimer);
    if (!isPlaying) return;

    const step = TIMELINE[currentIndex];
    const delay = step.delay || 1500;

    stepTimer = setTimeout(() => {
      stepNext();
    }, delay);
  }

  function stepNext() {
    clearInterval(unscrambleTimer);
    if (currentIndex < TIMELINE.length - 1) {
      renderStep(currentIndex + 1, true);
      scheduleNext();
    } else {
      // Loop back to beginning
      renderStep(0, true);
      scheduleNext();
    }
  }

  function stepPrev() {
    clearInterval(unscrambleTimer);
    if (currentIndex > 0) {
      renderStep(currentIndex - 1, true);
      if (isPlaying) scheduleNext();
    }
  }

  function togglePlayPause() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      scheduleNext();
    } else {
      clearTimeout(stepTimer);
    }
  }

  // ------------------------------------------------------------
  // EVENT LISTENERS (CLICK / KEYBOARD CONTROLS)
  // ------------------------------------------------------------
  // Tap or click anywhere on screen advances
  window.addEventListener('click', () => {
    initAudio();
    stepNext();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    initAudio();
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        stepNext();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        stepPrev();
        break;
    }
  });

  // Touch Swipe (Left / Right swipe)
  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diffX = touchEndX - touchStartX;
    if (Math.abs(diffX) > 50) {
      if (diffX < 0) {
        stepNext();
      } else {
        stepPrev();
      }
    }
  }, { passive: true });

  // ------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------
  initParticles();
  renderStep(0, false);
  scheduleNext();
})();