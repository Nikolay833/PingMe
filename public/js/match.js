async function runMatchmaking() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
    return;
  }

  const interests   = document.getElementById('interests')?.value?.trim();
  const travelStyle = document.getElementById('travel-style')?.value?.trim();
  const lookingFor  = document.getElementById('looking-for')?.value?.trim();

  if (!interests || !travelStyle || !lookingFor) {
    alert('Please fill in all three fields.');
    return;
  }

  // Save profile so backend has data for the AI
  try {
    await apiPatch('/api/auth/update-traveler', {
      interests,
      travel_style: travelStyle,
      looking_for:  lookingFor
    });
  } catch (e) {
    // Non-fatal — continue anyway
  }

  // Show loading, hide form
  document.getElementById('match-form')?.style && (document.getElementById('match-form').style.display = 'none');
  document.getElementById('match-loading')?.style && (document.getElementById('match-loading').style.display = 'flex');

  try {
    const userId = localStorage.getItem('user_id');
    const data   = await apiPost('/api/ai/match', { traveler_id: userId });

    document.getElementById('match-loading').style.display = 'none';
    document.getElementById('match-result').style.display  = 'block';

    document.getElementById('match-name').textContent      = data.match.name;
    document.getElementById('match-village').textContent   = data.match.village;
    document.getElementById('match-specialty').textContent = data.match.specialty;

    const photoEl = document.getElementById('match-photo');
    if (photoEl) photoEl.src = data.match.photo_url || '';

    typewriterEffect('match-reason', data.reason);

    const viewBtn = document.getElementById('view-profile-btn');
    if (viewBtn) viewBtn.href = `/legend.html?id=${data.match.id}`;

  } catch (err) {
    document.getElementById('match-loading').style.display = 'none';
    document.getElementById('match-form').style.display    = 'block';
    alert('Matchmaking failed: ' + err.message);
  }
}

function typewriterEffect(elementId, text) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, 22);
}
