/* =====================================================
   VARIABLES GLOBALES
===================================================== */
let map;
let userMarker;
let taxiMarker;
let routeLine;
let userPath = [];

/* =====================================================
   INICIALIZAR MAPA
===================================================== */
function initMap(){

  if(!navigator.geolocation){
    alert("Tu navegador no soporta geolocalización");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    map = L.map('map').setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution:'© OpenStreetMap'
    }).addTo(map);

    userMarker = L.marker([lat,lng]).addTo(map)
      .bindPopup("📍 Tú estás aquí")
      .openPopup();

    routeLine = L.polyline(userPath,{color:'yellow'}).addTo(map);

    document.getElementById("status").innerText = "Ubicación detectada";

    trackUserLocation();
  });
}

/* =====================================================
   SEGUIMIENTO EN TIEMPO REAL
===================================================== */
function trackUserLocation(){

  navigator.geolocation.watchPosition(position => {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    userMarker.setLatLng([lat,lng]);
    map.setView([lat,lng]);

    userPath.push([lat,lng]);
    routeLine.setLatLngs(userPath);

  });
}

/* =====================================================
   SOLICITAR TAXI
===================================================== */
function requestTaxi(){

  if(!map) return;

  updateStatus("🚖 Buscando taxi...");

  setTimeout(assignTaxi,2000);
}

/* =====================================================
   ASIGNAR TAXI
===================================================== */
function assignTaxi(){

  const userPosition = userMarker.getLatLng();

  const taxiLat = userPosition.lat + 0.01;
  const taxiLng = userPosition.lng + 0.01;

  taxiMarker = L.marker([taxiLat,taxiLng]).addTo(map)
    .bindPopup("🚖 Taxi asignado")
    .openPopup();

  updateStatus("Taxi en camino");

  showTripInfo();
}

/* =====================================================
   MOSTRAR INFORMACIÓN DEL VIAJE
===================================================== */
function showTripInfo(){

  const tarifa = calculateFare(3);

  document.getElementById("tripInfo").innerHTML =
  `<div class="card">
      🚖 Taxi asignado<br><br>
      📏 Distancia estimada: 3 km<br><br>
      💰 Tarifa estimada: $${tarifa}
   </div>`;
}

/* =====================================================
   CÁLCULO DE TARIFA
===================================================== */
function calculateFare(distance){
  const base = 2;
  const perKm = 0.75;
  return (base + distance * perKm).toFixed(2);
}

/* =====================================================
   UTILIDADES
===================================================== */
function updateStatus(message){
  document.getElementById("status").innerText = message;
}

/* =====================================================
   INICIAR APP
===================================================== */
window.onload = initMap;
