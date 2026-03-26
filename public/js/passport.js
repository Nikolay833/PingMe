function renderPassport(bookings) {
  const canvas = document.getElementById('passport-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width  = 600;
  canvas.height = 420;

  // Background
  ctx.fillStyle = '#1a3a2a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer border
  ctx.strokeStyle = '#c8a96e';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Inner border
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Title
  ctx.fillStyle = '#c8a96e';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('EXPERIENCE PASSPORT', canvas.width / 2, 58);

  ctx.font = '11px Georgia, serif';
  ctx.fillText('PingMe — Bulgarian Cultural Heritage Platform', canvas.width / 2, 76);

  // Divider line
  ctx.beginPath();
  ctx.moveTo(40, 88);
  ctx.lineTo(canvas.width - 40, 88);
  ctx.strokeStyle = 'rgba(200,169,110,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Stamps
  const completed = (bookings || []).filter(b => b.status === 'completed');

  if (completed.length === 0) {
    ctx.fillStyle = 'rgba(200,169,110,0.35)';
    ctx.font = 'italic 14px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Complete your first session to earn a stamp', canvas.width / 2, 240);
  } else {
    completed.slice(0, 8).forEach((booking, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x   = 80  + col * 130;
      const y   = 155 + row * 130;
      drawStamp(ctx, x, y,
        booking.sessions?.legends?.village || 'Bulgaria',
        booking.sessions?.date             || ''
      );
    });
  }
}

function drawStamp(ctx, x, y, village, date) {
  // Dashed circle
  ctx.beginPath();
  ctx.arc(x, y, 48, 0, Math.PI * 2);
  ctx.strokeStyle = '#c8a96e';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([5, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Inner circle
  ctx.beginPath();
  ctx.arc(x, y, 40, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(200,169,110,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Village name
  ctx.fillStyle = '#c8a96e';
  ctx.font = 'bold 9px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(village.toUpperCase().slice(0, 12), x, y - 10);

  // Date
  ctx.font = '8px Georgia, serif';
  ctx.fillText(date, x, y + 6);

  // Logo mark
  ctx.font = 'bold 7px sans-serif';
  ctx.fillText('✦ PINGME ✦', x, y + 22);
}

function downloadPassport() {
  const canvas = document.getElementById('passport-canvas');
  if (!canvas) return;

  const link = document.createElement('a');
  link.download = 'pingme-experience-passport.png';
  link.href     = canvas.toDataURL('image/png');
  link.click();
}
