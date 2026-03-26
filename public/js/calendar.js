const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];

function initCalendar(legendId, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear  = today.getFullYear();
  let availableSessions = [];

  async function loadSessions() {
    try {
      availableSessions = await apiGet(`/api/legends/${legendId}/sessions`);
      renderCalendar();
    } catch (err) {
      container.innerHTML = '<p style="color:#c0392b;">Failed to load availability.</p>';
    }
  }

  function renderCalendar() {
    const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const openDates = new Set(
      availableSessions
        .filter(s => s.status === 'open')
        .map(s => s.date)
    );

    const dayHeaders = ['Su','Mo','Tu','We','Th','Fr','Sa']
      .map(d => `<div class="cal-day-header">${d}</div>`).join('');

    const emptyCells = Array(firstDay).fill('<div class="cal-day empty"></div>').join('');

    const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
      const day     = i + 1;
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast  = new Date(dateStr) < today;
      const hasSlot = openDates.has(dateStr);

      if (isPast)    return `<div class="cal-day past">${day}</div>`;
      if (hasSlot)   return `<div class="cal-day available" onclick="selectCalDate('${dateStr}')">${day}</div>`;
      return `<div class="cal-day">${day}</div>`;
    }).join('');

    container.innerHTML = `
      <div class="calendar-header">
        <button class="cal-nav" id="cal-prev">&#8249;</button>
        <span class="cal-month-label">${MONTH_NAMES[currentMonth]} ${currentYear}</span>
        <button class="cal-nav" id="cal-next">&#8250;</button>
      </div>
      <div class="calendar-grid">
        ${dayHeaders}
        ${emptyCells}
        ${dayCells}
      </div>
    `;

    document.getElementById('cal-prev').addEventListener('click', () => {
      if (currentMonth === 0) { currentMonth = 11; currentYear--; }
      else currentMonth--;
      renderCalendar();
    });

    document.getElementById('cal-next').addEventListener('click', () => {
      if (currentMonth === 11) { currentMonth = 0; currentYear++; }
      else currentMonth++;
      renderCalendar();
    });
  }

  window.selectCalDate = function(dateStr) {
    const sessions = availableSessions.filter(s => s.date === dateStr && s.status === 'open');
    if (!sessions.length) return;

    document.querySelectorAll('.cal-day.available').forEach(el => el.classList.remove('selected'));
    event?.target?.classList.add('selected');

    const slotContainer = document.getElementById('time-slots');
    if (slotContainer) {
      slotContainer.innerHTML = sessions.map(s => `
        <button class="time-slot-btn" onclick="selectSession(${s.id}, '${dateStr}', '${s.time_start}')">
          ${s.time_start.slice(0, 5)} &mdash; ${s.duration_minutes} min
          &mdash; ${s.max_participants - s.current_participants} spots left
        </button>
      `).join('');
    }
  };

  loadSessions();
}
