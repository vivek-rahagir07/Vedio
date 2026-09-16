// Minimalist Mobile Typographic Engine: Clean Abrupt Words & Soothing Climax
(() => {
  const SEQUENCE = [
    { text: 'son.', isDots: false, isFinal: false },
    { text: 'friend.', isDots: false, isFinal: false },
    { text: 'student.', isDots: false, isFinal: false },
    { text: 'partner.', isDots: false, isFinal: false },
    { text: 'brother.', isDots: false, isFinal: false },
    { text: 'listener.', isDots: false, isFinal: false },
    { text: 'supporter.', isDots: false, isFinal: false },
    { text: 'creator.', isDots: false, isFinal: false },
    { text: 'leader.', isDots: false, isFinal: false },
    { text: 'teammate.', isDots: false, isFinal: false },
    { text: 'dreamer.', isDots: false, isFinal: false },
    { text: 'fighter.', isDots: false, isFinal: false },
    { text: '....', isDots: true, isFinal: false },
    { text: 'person.', isDots: false, isFinal: true }
  ];

  const SPEEDS = [
    { label: '1.0s', value: 1000 },
    { label: '1.4s', value: 1400 },
    { label: '1.8s', value: 1800 }
  ];

  // State
  let currentIndex = 0;
  let isPlaying = true;
  let speedIndex = 1; // 1.4s
  let isExpanded = false;
  let soundEnabled = false;
  let timerId = null;
  let idleTimeoutId = null;
  let audioCtx = null;

  // DOM Elements
  const screenCanvas = document.getElementById('screenCanvas');
  const ambientBackdrop = document.getElementById('ambientBackdrop');
  const mobileViewport = document.getElementById('mobileViewport');
  const typographyStage = document.getElementById('typographyStage');
  const prefixTextEl = document.getElementById('prefixText');
  const dynamicWordEl = document.getElementById('dynamicWord');
  const soothingClimaxStage = document.getElementById('soothingClimaxStage');
  
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const speedBtn = document.getElementById('speedBtn');
  const soundBtn = document.getElementById('soundBtn');
  const soundMutedIcon = document.getElementById('soundMutedIcon');
  const soundActiveIcon = document.getElementById('soundActiveIcon');
  const modeBtn = document.getElementById('modeBtn');
  const mobileHud = document.getElementById('mobileHud');
  const progressThumb = document.getElementById('progressThumb');

  // Subtle acoustic tap / chime audio synth
  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Gentle acoustic tap on word transition
  function playSoftTapSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn('Audio tap error:', e);
    }
  }

  // Soothing warm ambient chord for the finale
  function playSoothingChord() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const freqs = [261.63, 329.63, 392.00, 523.25]; // C Major soothing chord

      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 0.3 + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {
      console.warn('Chord audio error:', e);
    }
  }

  // Render Step
  function renderStep(index, isAbrupt = true) {
    currentIndex = (index + SEQUENCE.length) % SEQUENCE.length;
    const currentItem = SEQUENCE[currentIndex];

    // Check if we are in the finale ("person.")
    if (currentItem.isFinal) {
      // 1. Remove all black screen! Transition into soothing warm light
      screenCanvas.classList.add('soothing-light-active');
      ambientBackdrop.classList.add('soothing-ambient');
      typographyStage.classList.add('stage-hidden');

      // 2. Reveal the soothing climax stage
      soothingClimaxStage.classList.add('climax-visible');

      playSoothingChord();
    } 
    // Check if we are at suspense dots ("....")
    else if (currentItem.isDots) {
      // Ensure we are in black screen mode
      screenCanvas.classList.remove('soothing-light-active');
      ambientBackdrop.classList.remove('soothing-ambient');
      typographyStage.classList.remove('stage-hidden');
      soothingClimaxStage.classList.remove('climax-visible');

      prefixTextEl.textContent = 'NOT A GOOD';
      dynamicWordEl.textContent = '....';
      dynamicWordEl.setAttribute('data-text', '....');
      dynamicWordEl.className = 'dynamic-word suspense-dots';

      playSoftTapSound();
    } 
    // Regular word change
    else {
      // Ensure black screen mode
      screenCanvas.classList.remove('soothing-light-active');
      ambientBackdrop.classList.remove('soothing-ambient');
      typographyStage.classList.remove('stage-hidden');
      soothingClimaxStage.classList.remove('climax-visible');

      prefixTextEl.textContent = 'NOT A GOOD';

      if (isAbrupt) {
        // Re-trigger clean abrupt cut with pink micro-slice
        dynamicWordEl.className = 'dynamic-word';
        void dynamicWordEl.offsetWidth; // Force reflow
        dynamicWordEl.textContent = currentItem.text;
        dynamicWordEl.setAttribute('data-text', currentItem.text);
        dynamicWordEl.classList.add('abrupt-cut');

        playSoftTapSound();
      } else {
        dynamicWordEl.className = 'dynamic-word';
        dynamicWordEl.textContent = currentItem.text;
        dynamicWordEl.setAttribute('data-text', currentItem.text);
      }
    }

    // Update progress thumb
    const progressPercent = ((currentIndex + 1) / SEQUENCE.length) * 100;
    progressThumb.style.width = `${progressPercent}%`;
  }

  function stepNext() {
    const nextIdx = (currentIndex + 1) % SEQUENCE.length;
    renderStep(nextIdx, true);
    scheduleNext();
  }

  function stepPrev() {
    const prevIdx = (currentIndex - 1 + SEQUENCE.length) % SEQUENCE.length;
    renderStep(prevIdx, true);
    if (isPlaying) {
      scheduleNext();
    }
  }

  function scheduleNext() {
    clearTimeout(timerId);
    if (!isPlaying) return;

    const currentItem = SEQUENCE[currentIndex];
    const baseDelay = SPEEDS[speedIndex].value;
    let delay = baseDelay;

    if (currentItem.isDots) {
      // Suspense dots hang gently for 1.8s
      delay = baseDelay * 1.6;
    } else if (currentItem.isFinal) {
      // The soothing finale lingers peacefully for 3.6 seconds before looping
      delay = baseDelay * 2.8;
    }

    timerId = setTimeout(() => {
      stepNext();
    }, delay);
  }

  function togglePlayPause() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      scheduleNext();
    } else {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      clearTimeout(timerId);
    }
  }

  function cycleSpeed() {
    speedIndex = (speedIndex + 1) % SPEEDS.length;
    speedBtn.textContent = SPEEDS[speedIndex].label;
    if (isPlaying) {
      scheduleNext();
    }
  }

  function toggleSound() {
    initAudio();
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundMutedIcon.classList.add('hidden');
      soundActiveIcon.classList.remove('hidden');
      playSoftTapSound();
    } else {
      soundMutedIcon.classList.remove('hidden');
      soundActiveIcon.classList.add('hidden');
    }
  }

  function toggleViewportMode() {
    isExpanded = !isExpanded;
    if (isExpanded) {
      mobileViewport.classList.add('viewport-expanded');
      modeBtn.textContent = 'FULL';
    } else {
      mobileViewport.classList.remove('viewport-expanded');
      modeBtn.textContent = '9:16';
    }
  }

  // Auto-hide controls pill on idle
  function resetIdleTimer() {
    mobileHud.classList.remove('hud-hidden');
    clearTimeout(idleTimeoutId);
    idleTimeoutId = setTimeout(() => {
      if (isPlaying) {
        mobileHud.classList.add('hud-hidden');
      }
    }, 2500);
  }

  // Event Listeners
  playPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    togglePlayPause();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    stepPrev();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    stepNext();
  });

  speedBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cycleSpeed();
  });

  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSound();
  });

  modeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleViewportMode();
  });

  // Tap anywhere on canvas advances
  screenCanvas.addEventListener('click', (e) => {
    if (!mobileHud.contains(e.target)) {
      initAudio();
      stepNext();
    }
  });

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    initAudio();
    resetIdleTimer();

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
      case 'KeyM':
        toggleSound();
        break;
      case 'KeyF':
        toggleViewportMode();
        break;
    }
  });

  window.addEventListener('mousemove', resetIdleTimer);
  window.addEventListener('mousedown', resetIdleTimer);
  window.addEventListener('touchstart', resetIdleTimer);

  // Initialize
  renderStep(0, false);
  scheduleNext();
  resetIdleTimer();
})();
