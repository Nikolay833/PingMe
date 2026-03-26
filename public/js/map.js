let map;
const markers = [];

function initMap() {
  map = L.map('map').setView([42.7, 25.5], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  loadLegends();
}

function markerColor(risk) {
  if (risk >= 75) return '#e74c3c';   // red — critical
  if (risk >= 50) return '#f39c12';   // orange — warning
  return '#27ae60';                   // green — okay
}

function createMarkerIcon(risk) {
  const color = markerColor(risk);
  return L.divIcon({
    html: `<div style="
      width:18px;height:18px;
      background:${color};
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
    "></div>`,
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
}

async function loadLegends() {
  try {
    const legends = await apiGet('/api/legends');

    markers.forEach(m => m.remove());
    markers.length = 0;

    legends.forEach(legend => {
      if (!legend.lat || !legend.lng) return;

      const marker = L.marker([legend.lat, legend.lng], {
        icon: createMarkerIcon(legend.extinction_risk || 0)
      });

      const riskLabel = legend.extinction_risk >= 75 ? '🔴 Critical' :
                        legend.extinction_risk >= 50 ? '🟡 At Risk'  : '🟢 Active';

      marker.bindPopup(`
        <div style="min-width:200px;font-family:sans-serif;">
          ${legend.photo_url ? `<img src="${legend.photo_url}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:8px;">` : ''}
          <strong style="font-size:1rem;">${legend.name}</strong><br>
          <span style="color:#666;font-size:0.82rem;">${legend.village}</span><br>
          <p style="margin:6px 0;font-size:0.85rem;">${legend.specialty}</p>
          <span style="font-size:0.75rem;">${riskLabel}</span><br>
          <a href="/legend.html?id=${legend.id}"
             style="display:inline-block;margin-top:8px;background:#B778E8;color:white;
                    padding:5px 14px;border-radius:20px;text-decoration:none;font-size:0.82rem;">
            View Profile
          </a>
        </div>
      `);

      marker.addTo(map);
      markers.push(marker);
    });
  } catch (err) {
    console.error('Failed to load legends:', err.message);
  }
}

document.addEventListener('DOMContentLoaded', initMap);
