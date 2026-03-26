function calculateSessionsRemaining(sessionsCompleted, age) {
  const yearsLeft   = Math.max(0, 90 - (age || 75));
  const sessionsPerYear = 40; // ~2 per week, ~20 active weeks
  return Math.max(0, yearsLeft * sessionsPerYear - (sessionsCompleted || 0));
}

function initCountdown(legendData) {
  const numberEl = document.getElementById('extinction-countdown');
  const labelEl  = document.getElementById('countdown-label');
  if (!numberEl) return;

  const remaining = calculateSessionsRemaining(legendData.sessions_completed, legendData.age);

  // Animate count up
  let current = 0;
  const steps    = 60;
  const duration = 1500;
  const increment = remaining / steps;

  const timer = setInterval(() => {
    current = Math.min(current + increment, remaining);
    numberEl.textContent = Math.round(current);
    if (current >= remaining) clearInterval(timer);
  }, duration / steps);

  // Apply urgency styling
  const wrapper = numberEl.closest('.countdown-wrapper') || numberEl.parentElement;

  if (remaining <= 10) {
    wrapper?.classList.add('critical');
    if (labelEl) labelEl.textContent = 'sessions left. Critically endangered.';
    numberEl.style.color = '#e74c3c';
    // Pulse animation via CSS class
    wrapper?.classList.add('pulse');
  } else if (remaining <= 50) {
    wrapper?.classList.add('warning');
    if (labelEl) labelEl.textContent = 'sessions remaining. Time is limited.';
    numberEl.style.color = '#f39c12';
  } else {
    if (labelEl) labelEl.textContent = 'sessions of this knowledge remain.';
  }
}
