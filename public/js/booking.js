let selectedSession = null;
let lockTimer = null;

window.selectSession = function(sessionId, date, time) {
  selectedSession = { id: sessionId, date, time };

  const panel = document.getElementById('booking-panel');
  if (panel) panel.style.display = 'block';

  const dateEl = document.getElementById('booking-date');
  const timeEl = document.getElementById('booking-time');
  if (dateEl) dateEl.textContent = date;
  if (timeEl) timeEl.textContent = time.slice(0, 5);

  updatePriceDisplay();
};

function updatePriceDisplay() {
  const participants = parseInt(document.getElementById('participants')?.value || 1);
  const priceBase    = parseFloat(document.getElementById('price-base')?.dataset.price || 0);
  const total        = priceBase * participants;

  const totalEl = document.getElementById('booking-total');
  if (totalEl) totalEl.textContent = `€${total.toFixed(2)}`;
}

async function confirmBooking() {
  if (!selectedSession) return alert('Please select a session first.');
  if (!isLoggedIn()) { window.location.href = '/login.html'; return; }

  const participants = parseInt(document.getElementById('participants')?.value || 1);
  const btn = document.getElementById('confirm-booking-btn');

  if (btn) { btn.disabled = true; btn.textContent = 'Booking...'; }

  try {
    const data = await apiPost('/api/bookings', {
      session_id: selectedSession.id,
      participants
    });

    // Start 15-min lock countdown
    startLockTimer(15 * 60);

    // Show QR code screen
    showQRCode(data.qr_token, data.booking_id, data.total_price);

  } catch (err) {
    alert('Booking failed: ' + err.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Book this session'; }
  }
}

function startLockTimer(seconds) {
  const timerEl = document.getElementById('lock-timer');
  if (!timerEl) return;

  let remaining = seconds;
  lockTimer = setInterval(() => {
    remaining--;
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;

    if (remaining <= 0) {
      clearInterval(lockTimer);
      timerEl.textContent = 'Expired';
      const panel = document.getElementById('booking-panel');
      if (panel) panel.innerHTML = '<p style="color:#c0392b;">Your reservation expired. Please select a new time slot.</p>';
    }
  }, 1000);
}

function showQRCode(token, bookingId, totalPrice) {
  const formEl  = document.getElementById('booking-form');
  const qrEl    = document.getElementById('qr-container');
  const idEl    = document.getElementById('booking-id-display');
  const priceEl = document.getElementById('booking-confirmed-price');

  if (formEl) formEl.style.display = 'none';
  if (qrEl)   qrEl.style.display   = 'block';
  if (idEl)   idEl.textContent      = `Booking #${bookingId}`;
  if (priceEl) priceEl.textContent  = `€${parseFloat(totalPrice).toFixed(2)}`;

  const qrDiv = document.getElementById('qr-code');
  if (qrDiv && typeof QRCode !== 'undefined') {
    qrDiv.innerHTML = '';
    new QRCode(qrDiv, { text: token, width: 200, height: 200 });
  }
}

// Wire up participants input to update price
document.addEventListener('DOMContentLoaded', () => {
  const participantsInput = document.getElementById('participants');
  if (participantsInput) {
    participantsInput.addEventListener('input', updatePriceDisplay);
  }
});
