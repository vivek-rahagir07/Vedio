// ============================================================
// NOT A GOOD — PURE CINEMATIC TYPOGRAPHIC ENGINE
// ============================================================
(() => {
  'use strict';

  // ------------------------------------------------------------
  // POEM TIMELINE (The Complete Journey)
  // ------------------------------------------------------------
  const TIMELINE = [
    // ACT I: Accelerating Tempo Curve (Starts with good gap, ramps into rapid-fire blitz)
    { type: 'kinetic', text: 'son.', delay: 1300 },       // Initial spacious gap
    { type: 'kinetic', text: 'friend.', delay: 1100 },    // Good gap
    { type: 'kinetic', text: 'student.', delay: 900 },    // Starting to build
    { type: 'kinetic', text: 'partner.', delay: 720 },
    { type: 'kinetic', text: 'brother.', delay: 560 },
    { type: 'kinetic', text: 'listener.', delay: 420 },
    { type: 'kinetic', text: 'supporter.', delay: 320 },
    { type: 'kinetic', text: 'creator.', delay: 240 },
    { type: 'kinetic', text: 'leader.', delay: 180 },
    { type: 'kinetic', text: 'teammate.', delay: 140 },
    { type: 'kinetic', text: 'dreamer.', delay: 120 },
    { type: 'kinetic', text: 'fighter.', delay: 100 },    // Ultra-fast blitz
    { type: 'climax-person', text: 'person.', delay: 2600 }, // THE BLAST! (Holds 2.6s on black screen)

    // ACT II: THE SHIFT (Video begins playing under text)
    { 
      type: 'passage', 
      main: 'But maybe that’s okay.', 
      sub: '', 
      mainGold: false,
      delay: 2400 
    },

    // ACT III: THE REALIZATION & RESOLUTION (Completes with video in 6s)
    { 
      type: 'passage', 
      main: 'Because when no one is left<br>to understand me,', 
      sub: 'I’ll still have myself.', 
      mainGold: false,
      delay: 3800 
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
  const textStage = document.getElementById('textStage');
  const kineticStatement = document.getElementById('kineticStatement');
  const staticPrefix = document.getElementById('staticPrefix');
  const roleText = document.getElementById('roleText');
  const passageStatement = document.getElementById('passageStatement');
  const passageMain = document.getElementById('passageMain');
  const passageSub = document.getElementById('passageSub');

  // Background Media Elements
  const photoCarousel = document.getElementById('photoCarousel');
  const carouselSlides = document.querySelectorAll('.carousel-slide');
  const bgVideo = document.getElementById('bgVideo');

  let currentSlideIndex = 0;
  let carouselInterval = null;

  function showSlide(index) {
    if (!carouselSlides || carouselSlides.length === 0) return;
    const targetIdx = Math.abs(index) % carouselSlides.length;
    carouselSlides.forEach((slide, i) => {
      if (i === targetIdx) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    currentSlideIndex = targetIdx;
  }

  function startCarouselTimer() {
    stopCarouselTimer();
    // Rotate every 1500ms so all 4 photos get an equal, beautiful ~1.5s display across Act I
    carouselInterval = setInterval(() => {
      if (currentIndex < 12 && isPlaying) {
        showSlide(currentSlideIndex + 1);
      }
    }, 1500);
  }

  function stopCarouselTimer() {
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
  }

  function updateBackgroundMedia(stepIndex, stepType) {
    // Act I: 12 roles up to 'fighter.' -> Photo carousel active, video paused
    if (stepType === 'kinetic') {
      if (photoCarousel) photoCarousel.classList.remove('fade-out');
      if (bgVideo) {
        bgVideo.classList.remove('active');
        try { bgVideo.pause(); } catch (_) {}
      }

      // If at start (step 0), reset to slide 0 and restart smooth 1.5s carousel timer
      if (stepIndex === 0) {
        showSlide(0);
        startCarouselTimer();
      }
    } 
    // "NOT A GOOD person." -> PURE BLACK SCREEN (Both carousel and video are hidden)
    else if (stepType === 'climax-person') {
      stopCarouselTimer();
      if (photoCarousel) photoCarousel.classList.add('fade-out');
      if (bgVideo) {
        bgVideo.classList.remove('active');
        try { bgVideo.pause(); } catch (_) {}
      }
    }
    // AFTER person -> Video reveals and plays for 6 seconds under the narrative text
    else if (stepType === 'passage') {
      stopCarouselTimer();
      if (photoCarousel) photoCarousel.classList.add('fade-out');
      if (bgVideo) {
        bgVideo.classList.add('active');
        if (bgVideo.paused) {
          bgVideo.currentTime = 0;
          bgVideo.play().catch(() => {});
        }
      }
    }
  }

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

      // 1. Deep Sub-bass Drop (Impact)
      const sub = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(95, now);
      sub.frequency.exponentialRampToValueAtTime(36, now + 2.0);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.32, now + 0.18);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

      sub.connect(subGain);
      subGain.connect(masterGain);
      sub.start(now);
      sub.stop(now + 2.7);

      // 2. Warm Cinematic Resonant Tone (C3 / 130.81Hz)
      const tone = audioCtx.createOscillator();
      const toneGain = audioCtx.createGain();
      tone.type = 'sine';
      tone.frequency.setValueAtTime(130.81, now);

      toneGain.gain.setValueAtTime(0.001, now);
      toneGain.gain.linearRampToValueAtTime(0.12, now + 0.12);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      tone.connect(toneGain);
      toneGain.connect(masterGain);
      tone.start(now);
      tone.stop(now + 2.3);
    } catch (_) {}
  }

  // Heavy sonic detonation for the BLASTING reveal of "NOT A GOOD person."
  function playBlastDetonation() {
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;

      // 1. Heavy Sub-bass Boom (Glide down to 26Hz)
      const sub = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(125, now);
      sub.frequency.exponentialRampToValueAtTime(26, now + 2.4);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.48, now + 0.04);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      sub.connect(subGain);
      subGain.connect(masterGain);
      sub.start(now);
      sub.stop(now + 2.9);

      // 2. Punch Transient Kick
      const kick = audioCtx.createOscillator();
      const kickGain = audioCtx.createGain();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(180, now);
      kick.frequency.exponentialRampToValueAtTime(45, now + 0.28);

      kickGain.gain.setValueAtTime(0.001, now);
      kickGain.gain.linearRampToValueAtTime(0.42, now + 0.015);
      kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      kick.connect(kickGain);
      kickGain.connect(masterGain);
      kick.start(now);
      kick.stop(now + 0.35);

      // 3. Crystalline High Shimmer / Sonic Ring
      const chime = audioCtx.createOscillator();
      const chimeGain = audioCtx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(1046.5, now);

      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.linearRampToValueAtTime(0.09, now + 0.02);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      chime.connect(chimeGain);
      chimeGain.connect(masterGain);
      chime.start(now);
      chime.stop(now + 1.8);
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
  // CINEMATIC CLIMAX REVEAL: SUSPENSE, FOCUS-PULL & GOLDEN SHIMMER
  // High-end cinematic reveal for "NOT A GOOD person."
  // ------------------------------------------------------------
  let climaxTimer = null;

  function runCinematicClimaxReveal(onDone) {
    clearTimeout(climaxTimer);

    // Micro 130ms blackout freeze right before the blast
    if (staticPrefix) {
      staticPrefix.className = 'static-prefix climax-dim';
    }
    roleText.className = 'role-text climax-dissolve';
    kineticStatement.classList.remove('statement-blast');
    if (textStage) textStage.classList.remove('blast-flash');

    // Ensure photo carousel is faded out (pure black screen)
    if (photoCarousel) photoCarousel.classList.add('fade-out');

    climaxTimer = setTimeout(() => {
      // THE EXPLOSIVE BLAST!
      if (staticPrefix) {
        staticPrefix.className = 'static-prefix climax-surge';
        staticPrefix.textContent = 'NOT A GOOD';
      }

      roleText.className = 'role-text climax-reveal golden-shimmer';
      roleText.textContent = 'person.';
      roleText.setAttribute('data-text', 'person.');

      // Blasting impact on the entire statement
      kineticStatement.classList.remove('statement-blast');
      void kineticStatement.offsetWidth;
      kineticStatement.classList.add('statement-blast');

      // Shockwave flash across screen
      if (textStage) {
        textStage.classList.remove('blast-flash');
        void textStage.offsetWidth;
        textStage.classList.add('blast-flash');
      }

      // Heavy sonic detonation
      playBlastDetonation();

      if (onDone) onDone();
    }, 130);
  }

  // ------------------------------------------------------------
  // CORE TIMELINE RENDER
  // ------------------------------------------------------------
  function renderStep(idx, triggerGlitch = true) {
    currentIndex = Math.max(0, Math.min(idx, TIMELINE.length - 1));
    const step = TIMELINE[currentIndex];

    // Clean up any pending climax timers
    clearTimeout(climaxTimer);

    // Sync background media (carousel for Act I, video for person & passages)
    updateBackgroundMedia(currentIndex, step.type);

    // 1. ACT I: NOT A GOOD [role]
    if (step.type === 'kinetic') {
      kineticStatement.classList.remove('statement-blast');
      if (textStage) textStage.classList.remove('blast-flash');
      if (staticPrefix) {
        staticPrefix.className = 'static-prefix';
        staticPrefix.textContent = 'NOT A GOOD';
      }

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
    // Special Cinematic Reveal for 'NOT A GOOD person.'
    else if (step.type === 'climax-person') {
      kineticStatement.classList.remove('hidden');
      passageStatement.classList.add('hidden');

      if (triggerGlitch) {
        runCinematicClimaxReveal();
      } else {
        if (staticPrefix) {
          staticPrefix.className = 'static-prefix climax-surge';
          staticPrefix.textContent = 'NOT A GOOD';
        }
        roleText.className = 'role-text climax-reveal golden-shimmer';
        roleText.textContent = 'person.';
        roleText.setAttribute('data-text', 'person.');
      }
    } 
    // 2. ACT II & III: NARRATIVE PASSAGE
    else if (step.type === 'passage') {
      kineticStatement.classList.remove('statement-blast');
      if (textStage) textStage.classList.remove('blast-flash');
      if (staticPrefix) {
        staticPrefix.className = 'static-prefix';
        staticPrefix.textContent = 'NOT A GOOD';
      }

      kineticStatement.classList.add('hidden');
      passageStatement.classList.remove('hidden');

      passageMain.innerHTML = step.main;
      if (step.mainGold) {
        passageMain.classList.add('gold-text');
      } else {
        passageMain.classList.remove('gold-text');
      }

      if (step.sub) {
        passageSub.innerHTML = step.sub;
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
    clearTimeout(climaxTimer);
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
    clearTimeout(climaxTimer);
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
  showSlide(0);
  renderStep(0, false);
  scheduleNext();
})();