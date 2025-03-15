document.addEventListener('DOMContentLoaded', () => {
  /****************************************************************************
   * 1) ANIMIERTER DONUT-PROGRESS
   ****************************************************************************/
  // Your values
  const current = 21504; // e.g., 5000
  const goal = 25000; // e.g., 25000

  // DOM elements
  const donutValueEl = document.getElementById('donut-value');
  const donutProgressEl = document.querySelector('.donut-progress');

  // Circle circumference: r = 160 => circumference ~ 2π*160 ≈ 1005.31
  // stroke-dasharray is set to 1006 in the CSS
  const CIRCUMFERENCE = 1006;

  // Calculate percentage progress, capped at 100%
  let percentage = (current / goal) * 100;
  if (percentage > 100) percentage = 100;

  // Dash-offset for the final result (0 = full circle, 1006 = empty)
  const finalOffset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

  // Animation variables
  const frames = 120; // ~5 seconds at 60 FPS
  let frameCount = 0;
  let startOffset = CIRCUMFERENCE; // starting from "empty"
  let startValue = 0; // starting value for the text

  // Donut animation function
  function animateDonut() {
    frameCount++;
    const progress = frameCount / frames;

    // Animate the dash offset from start (1006) to finalOffset
    const currOffset = startOffset + (finalOffset - startOffset) * progress;
    donutProgressEl.style.strokeDashoffset = currOffset;

    // Update the text in the center to count up
    const currValue = Math.floor(startValue + (current - startValue) * progress);
    donutValueEl.textContent = currValue;

    if (frameCount < frames) {
      requestAnimationFrame(animateDonut);
    } else {
      // Ensure the final values are set cleanly
      donutProgressEl.style.strokeDashoffset = finalOffset;
      donutValueEl.textContent = current;
    }
  }

  // Start the donut animation immediately (it will now take ~5 seconds)
  requestAnimationFrame(animateDonut);

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
