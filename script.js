document.addEventListener('DOMContentLoaded', () => {
  /****************************************************************************
   * 1) ANIMIERTER DONUT-PROGRESS
   ****************************************************************************/
  // Circle circumference: r = 160 => circumference ~ 2π*160 ≈ 1005.31
  // stroke-dasharray is set to 1006 in the CSS
  const CIRCUMFERENCE = 1006;

  // Values for each donut: update these as needed
  const donutData = [
    { current: 8356, goal: 25000 }, // blue donut
    { current: 15, goal: 600 }, // pink donut
  ];

  // Function to animate a single donut
  function animateSingleDonut(progressEl, percentEl, valueEl, current, goal) {
    const finalPct = Math.min((current / goal) * 100, 100);
    const finalOffset = CIRCUMFERENCE - (finalPct / 100) * CIRCUMFERENCE;
    const frames = 120;
    let frameCount = 0;
    const startOffset = CIRCUMFERENCE;
    const startValue = 0;

    function step() {
      frameCount++;
      const progress = frameCount / frames;
      const currOffset = startOffset + (finalOffset - startOffset) * progress;
      progressEl.style.strokeDashoffset = currOffset;
      // Update percentage and raw value
      percentEl.textContent = Math.floor(finalPct * progress) + '%';
      valueEl.textContent = Math.floor(current * progress) + ' / ' + goal;

      if (frameCount < frames) {
        requestAnimationFrame(step);
      } else {
        progressEl.style.strokeDashoffset = finalOffset;
        percentEl.textContent = Math.floor(finalPct) + '%';
        valueEl.textContent = current + ' / ' + goal;
      }
    }

    requestAnimationFrame(step);
  }

  // Initialize animations for each donut
  document.querySelectorAll('.donut').forEach((svg, index) => {
    const { current, goal } = donutData[index] || donutData[0];
    const percentEl = svg.querySelector('.percent-line');
    const valueEl = svg.querySelector('.value-line');
    const progressEl = svg.querySelector('.donut-progress');
    animateSingleDonut(progressEl, percentEl, valueEl, current, goal);
  });

  /****************************************************************************
   * 2) DOT-GRID-HINTERGRUND (WHITE DOTS) MIT PULSATION
   ****************************************************************************/
  const dotCanvas = document.getElementById('dot-grid');
  const dotCtx = dotCanvas.getContext('2d');

  let dots = [];
  let dotAnimationId;

  function initDots() {
    dotCanvas.width = window.innerWidth;
    dotCanvas.height = window.innerHeight;
    dots = [];

    // Configurable values
    const spacing = 40; // Distance between dots
    const baseRadius = 2; // Base size of a dot
    const amplitude = 3; // Pulse amplitude

    // Create grid
    for (let y = 0; y < dotCanvas.height; y += spacing) {
      for (let x = 0; x < dotCanvas.width; x += spacing) {
        const phase = Math.random() * 2 * Math.PI; // random phase offset
        dots.push({
          x,
          y,
          baseRadius,
          amplitude,
          offset: phase,
          phaseSpeed: 1 + Math.random() * 0.5, // slight variation in pulse speed
        });
      }
    }
  }

  function animateDots(time) {
    dotCtx.clearRect(0, 0, dotCanvas.width, dotCanvas.height);

    dots.forEach((dot) => {
      // Calculate the pulsing radius
      const radius = dot.baseRadius + dot.amplitude * Math.sin(time * 0.002 * dot.phaseSpeed + dot.offset);

      dotCtx.beginPath();
      dotCtx.arc(dot.x, dot.y, Math.max(0, radius), 0, 2 * Math.PI);
      // White dots with partial transparency
      dotCtx.fillStyle = 'rgba(44, 62, 80,0.5)';
      dotCtx.fill();
    });

    dotAnimationId = requestAnimationFrame(animateDots);
  }

  /* Remaining Days Counter */
  function updateRemainingDays() {
    const targetDate = new Date('2025-06-29T00:00:00');
    const now = new Date();
    // Berechne den Unterschied in Millisekunden
    const timeDiff = targetDate.getTime() - now.getTime();
    // Umrechnung in Tage, negative Werte vermeiden
    const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    const remainingDaysEl = document.getElementById('remaining-days');
    remainingDaysEl.textContent = `Remaining Days: ${daysRemaining}`;
  }

  // Initial einmal aufrufen
  updateRemainingDays();

  // Handle window resize
  window.addEventListener('resize', () => {
    cancelAnimationFrame(dotAnimationId);
    initDots();
    requestAnimationFrame(animateDots);
  });

  // Initialize and start dot grid animation
  initDots();
  requestAnimationFrame(animateDots);
});
