// ============================================
// 0. GERENCIAMENTO DE TEMA E INICIALIZAÇÃO
// ============================================
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeButton(savedTheme);
}

function toggleTheme() {
  const html = document.documentElement;
  const newTheme =
    html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
  const btn = document.getElementById("theme-toggle");
  const logo = document.querySelector(".company-logo");
  if (btn) {
    btn.innerHTML =
      theme === "dark"
        ? '<i data-lucide="sun"></i>'
        : '<i data-lucide="moon"></i>';
    lucide.createIcons();
  }
  if (logo) {
    logo.src =
      theme === "dark"
        ? "/logos/logo-hortsoy.png"
        : "/logos/logo-hortsoy-ligth.png";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initWeatherSystem();
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  if (!isTouchDevice) {
    const cursor = document.createElement("div");
    cursor.className = "cursor-dot";
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
    document.addEventListener("mousedown", () =>
      cursor.classList.add("active"),
    );
    document.addEventListener("mouseup", () =>
      cursor.classList.remove("active"),
    );

    document.body.addEventListener("mouseover", (e) => {
      if (
        e.target.closest(
          "button, a, .unit-item, .btn-maps-popup, .btn-fotos-popup, input",
        )
      )
        cursor.classList.add("hovered");
    });
    document.body.addEventListener("mouseout", (e) => {
      if (
        e.target.closest(
          "button, a, .unit-item, .btn-maps-popup, .btn-fotos-popup, input",
        )
      )
        cursor.classList.remove("hovered");
    });
  }
});

// ============================================
// 1. DADOS DAS UNIDADES E FERIADOS
// ============================================
const nationalHolidays = [
  { day: "01/01", name: "Ano Novo" },
  { day: "25/12", name: "Natal" },
  { day: "07/09", name: "Independência do Brasil" },
  { day: "03/04", name: "Paixão de Cristo" },
  { day: "21/04", name: "Tiradentes" },
  { day: "01/05", name: "Dia do Trabalho" },
  { day: "04/06", name: "Corpus Christi" },
  { day: "12/10", name: "Nossa Senhora Aparecida" },
  { day: "02/11", name: "Finados" },
  { day: "15/11", name: "Proclamação da República" },
  { day: "20/11", name: "Consciência Negra" },
];

const unidades = [
  {
    nome: "ADM",
    endereco: "AV. SANTOS DUMONT, 130",
    link: "https://maps.app.goo.gl/fyeeoFGsbZKB9XEu6",
    lat: -19.7467,
    lng: -47.9391,
    icone: "black",
    municipalHolidays: [
      { day: "02/03", name: "Aniversário de Uberaba" },
      { day: "15/08", name: "Nossa Senhora da Abadia" },
    ],
  },
  {
    nome: "ARAXÁ",
    endereco: "AV. JOSE ANANIAS AGUIAR, 5835",
    link: "https://maps.app.goo.gl/jyxtBeDQN77QFJgi9",
    lat: -19.5756022019829,
    lng: -46.95455589999999,
    icone: "green",
    municipalHolidays: [{ day: "19/12", name: "Aniversário de Araxá" }],
  },
  {
    nome: "BAMBUÍ",
    endereco: "RUA ALZIRA TORRES, 681",
    link: "https://maps.app.goo.gl/a9BcQQsscCR7VptF6",
    lat: -20.018301100116915,
    lng: -45.98550917353176,
    icone: "green",
    municipalHolidays: [{ day: "10/07", name: "Aniversário de Bambuí" }],
  },
  {
    nome: "CARMO RIO CLARO",
    endereco: "RUA PADRE PENTEADO, 15",
    link: "https://maps.app.goo.gl/woF4xVQtqCUPomfw9",
    lat: -20.97131546013282,
    lng: -46.13039021340026,
    icone: "green",
    municipalHolidays: [
      { day: "05/11", name: "Aniversário de Carmo Rio Claro" },
    ],
  },
  {
    nome: "CONCEIÇÃO DAS ALAGOAS",
    endereco: "AV. JOAO MARQUES DE OLIVEIRA, 527",
    link: "https://maps.app.goo.gl/Y1KbwHgJAwynPrJt9",
    lat: -19.932387128211232,
    lng: -48.377289372426226,
    icone: "green",
    municipalHolidays: [
      { day: "17/12", name: "Aniversário de Conceição das Alagoas" },
    ],
  },
  {
    nome: "COROMANDEL",
    endereco: "AV. GOVERNADOR ISRAEL PINHEIRO, 691",
    link: "https://maps.app.goo.gl/uLiejz5g2PWbLsmy6",
    lat: -18.483407164034354,
    lng: -47.20205250956627,
    icone: "green",
    municipalHolidays: [{ day: "07/09", name: "Aniversário de Coromandel" }],
  },
  {
    nome: "IBIÁ",
    endereco: "AV. BARTOLOMEU RIBEIRO DE PAIVA, 934",
    link: "https://maps.app.goo.gl/bH4tTTLZPDqEQ3yx8",
    lat: -19.501516500491153,
    lng: -46.55006727355715,
    icone: "green",
    municipalHolidays: [{ day: "07/09", name: "Aniversário de Ibiá" }],
  },
  {
    nome: "PASSOS",
    endereco: "ROD. MG - 050, 628",
    link: "https://maps.app.goo.gl/jfV4bCUmtXbEnFar9",
    lat: -20.73938776721489,
    lng: -46.59563708792725,
    icone: "green",
    municipalHolidays: [{ day: "14/05", name: "Aniversário de Passos" }],
  },
  {
    nome: "PATOS DE MINAS",
    endereco: "AV. PRESIDENTE TANCREDO NEVES, 540",
    link: "https://maps.app.goo.gl/6iEMCYAjG8WmN2um9",
    lat: -18.62084965162708,
    lng: -46.51175157375422,
    icone: "green",
    municipalHolidays: [
      { day: "24/05", name: "Aniversário de Patos de Minas" },
    ],
  },
  {
    nome: "PATROCÍNIO",
    endereco: "AV. FARIA PEREIRA, 4677",
    link: "https://maps.app.goo.gl/fFhios9dDTEe1Wwd8",
    lat: -18.947761807309806,
    lng: -47.014211445521084,
    icone: "green",
    municipalHolidays: [{ day: "07/04", name: "Aniversário de Patrocínio" }],
  },
  {
    nome: "PIUMHI",
    endereco: "RUA PADRE ABEL, 1396",
    link: "https://maps.app.goo.gl/S1g5TkkesmQRLTJC7",
    lat: -20.461805785908382,
    lng: -45.96862264612876,
    icone: "green",
    municipalHolidays: [{ day: "20/07", name: "Aniversário de Piumhi" }],
  },
  {
    nome: "SACRAMENTO",
    endereco: "RUA MARIO DE SANTI, 280",
    link: "https://maps.app.goo.gl/wvqYYikGG1nqZBHm6",
    lat: -19.872262072327732,
    lng: -47.43102797561854,
    icone: "green",
    municipalHolidays: [{ day: "24/08", name: "Aniversário de Sacramento" }],
  },
  {
    nome: "SANTA JULIANA",
    endereco: "AV. JOAQUIM HONORIO DA SILVA, 20",
    link: "https://maps.app.goo.gl/4M9MvdKPrLpbiegs5",
    lat: -19.30989518168748,
    lng: -47.53400394220797,
    icone: "green",
    municipalHolidays: [
      { day: "17/12", name: "Aniversário de Santa Juliana" },
      { day: "15/08", name: "Nossa Senhora da Abadia" },
    ],
  },
  {
    nome: "SÃO GOTARDO",
    endereco: "ROD. MG 235, 590 KM 88",
    link: "https://maps.app.goo.gl/DzJVgHy9Hn5GhFxR8",
    lat: -19.35339095816613,
    lng: -46.13111095856429,
    icone: "green",
    municipalHolidays: [{ day: "30/09", name: "Aniversário de São Gotardo" }],
  },
  {
    nome: "UBERABA",
    endereco: "AV. DEP. JOSE MARCUS CHEREM, 1020",
    link: "https://maps.app.goo.gl/X86d192AibphuJ1a6",
    lat: -19.773730218689845,
    lng: -47.93592100258318,
    icone: "green",
    municipalHolidays: [
      { day: "02/03", name: "Aniversário de Uberaba" },
      { day: "15/08", name: "Nossa Senhora da Abadia" },
    ],
  },
];

// ============================================
// 2. CONFIGURAÇÃO DOS ÍCONES E MAPA
// ============================================
const isRainCondition = (condition) =>
  ["Rain", "Drizzle", "Thunderstorm"].includes(condition);

const createIcon = (nome, color, holiday = false, weatherCondition = "") => {
  const rainy = isRainCondition(weatherCondition);
  const borderColor = holiday ? "#f59e0b" : "var(--hortsoy-green)";

  return L.divIcon({
    className: "custom-div-icon",
    html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                ${rainy ? '<div class="rain-drops"><span></span><span></span><span></span><span></span><span></span></div>' : ""}
                <div style="position: relative;">
                    <img src="/logos/marker-${color}.png" style="width: 40px; height: 40px;" alt="Marcador">
                    ${holiday ? '<div class="holiday-alert-badge" title="Unidade em Feriado">⚠️</div>' : ""}
                </div>
                <span style="background-color: var(--card-bg); color: var(--hortsoy-accent); padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; border: 1px solid ${borderColor}; white-space: nowrap; margin-top: -4px; box-shadow: var(--shadow-sm);">${nome}</span>
            </div>`,
    iconSize: [40, 55],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

function getTodayKey() {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getHolidayStatus(unit) {
  const today = getTodayKey();
  let h = unit.municipalHolidays?.find((h) => h.day === today);
  if (h) return { type: "Municipal", name: h.name };
  h = [...(unit.nationalHolidays || []), ...nationalHolidays].find(
    (h) => h.day === today,
  );
  return h ? { type: "Nacional", name: h.name } : null;
}

const map = L.map("map", { zoomControl: false }).setView([-19.7, -47.0], 8);
L.control.zoom({ position: "topleft" }).addTo(map);

const SidebarToggleControl = L.Control.extend({
  options: { position: "topleft" },
  onAdd: function (map) {
    const container = L.DomUtil.create(
      "div",
      "leaflet-bar leaflet-control custom-map-toggle",
    );
    container.innerHTML =
      '<a href="#" title="Ocultar/Mostrar Menu" role="button" aria-label="Toggle Menu"><i data-lucide="menu" style="width: 18px; height: 18px;"></i></a>';
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.on(container, "click", function (e) {
      L.DomEvent.preventDefault(e);
      document.body.classList.toggle("sidebar-hidden");
      lucide.createIcons();
      setTimeout(() => map.invalidateSize(), 300);
    });
    return container;
  },
});
map.addControl(new SidebarToggleControl());

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

const markersGroup = L.layerGroup().addTo(map);
const rainCircleLayer = L.layerGroup().addTo(map);
const markers = {};
const rainCircles = {};

const updateCityRainLayer = (unit, condition) => {
  const rainy = isRainCondition(condition);
  if (rainy && !rainCircles[unit.nome]) {
    rainCircles[unit.nome] = L.circle([unit.lat, unit.lng], {
      radius: 2000,
      color: "#4fc2f700",
      weight: 1,
      fillColor: "#4fc2f70c",
      fillOpacity: 0.99,
      interactive: false,
    }).addTo(rainCircleLayer);
  } else if (!rainy && rainCircles[unit.nome]) {
    rainCircleLayer.removeLayer(rainCircles[unit.nome]);
    delete rainCircles[unit.nome];
  }
};

const logo = document.querySelector(".company-logo");
if (logo) {
  logo.style.cursor = "pointer";
  logo.addEventListener("click", () => map.setView([-19.7, -47.0], 8));
}

// ============================================
// 3. RENDERIZAÇÃO
// ============================================
const listElement = document.getElementById("units-list");
const filterInput = document.getElementById("filter");

function render() {
  listElement.innerHTML = "";
  markersGroup.clearLayers();
  const term = filterInput.value.toLowerCase();

  unidades
    .filter(
      (u) =>
        u.nome.toLowerCase().includes(term) ||
        u.endereco.toLowerCase().includes(term),
    )
    .forEach((u) => {
      const holiday = getHolidayStatus(u);
      const iconColor = holiday ? "orange" : u.icone || "green";

      const item = document.createElement("div");
      item.className = `unit-item${holiday ? " holiday" : ""}`;
      item.dataset.unitName = u.nome;
      item.innerHTML = `<h3>${u.nome} ${holiday ? `<span class="holiday-badge" title="${holiday.type} - ${holiday.name}">FERIADO</span>` : ""}</h3><p>${u.endereco}</p>`;
      item.onclick = () => {
        map.flyTo([u.lat, u.lng], 13);
        markers[u.nome].openPopup();
      };
      listElement.appendChild(item);

      const marker = L.marker([u.lat, u.lng], {
        icon: createIcon(u.nome, iconColor, !!holiday, u.weatherCondition),
      }).addTo(markersGroup);

      const slug = u.nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");
      marker.bindPopup(`
                <div style="color: white; min-width: 220px;">
                    <h3 style="margin:0; color:var(--hortsoy-accent);">${u.nome}</h3>
                    <p style="margin:5px 0; font-size:12px;">${u.endereco}</p>
                    ${holiday ? `<p class="popup-holiday">🎉 ${holiday.type} - ${holiday.name}</p>` : ""}
                    <div class="popup-action-buttons">
                        <a href="${u.link}" target="_blank" class="btn-maps-popup">Google Maps</a>
                        <button onclick="abrirDetalhes('${slug}', '${u.nome}')" class="btn-fotos-popup">Fotos</button>
                    </div>
                </div>`);
      markers[u.nome] = marker;
    });
  lucide.createIcons();
}

filterInput.addEventListener("input", render);
render();

// ============================================
// 4. MODAL DE FOTOS (ABAS DINÂMICAS SEM LEGENDA)
// ============================================
async function abrirDetalhes(slug, nome) {
  if (typeof gtag === 'function') {
      gtag('event', 'visualizar_fotos', { 'event_category': 'Filiais', 'event_label': nome });
  }

  const modal = document.getElementById("modal-unidade");
  document.getElementById("modal-titulo").innerText = nome;
  modal.style.display = "flex";

  mudarAbaFotos('escritorio');

  const carregarCategoria = async (indices, containerId) => {
      const container = document.getElementById(containerId);
      container.innerHTML = "";

      indices.forEach(() => {
          const skeleton = document.createElement("div");
          skeleton.className = "skeleton";
          container.appendChild(skeleton);
      });

      const imagePromises = indices.map(i => {
          return new Promise((resolve) => {
              const img = new Image();
              img.src = `fotos/${slug}/${i}.Png`; 
              img.onload = () => resolve(img);
              img.onerror = () => resolve(null); 
          });
      });

      const results = await Promise.all(imagePromises);
      const validImages = results.filter((img) => img !== null);

      container.innerHTML = "";

      if (validImages.length === 0) {
          container.innerHTML = `<p style='color: var(--text-muted); width: 100%; grid-column: 1 / -1; text-align: center; padding: 40px 0;'>Nenhuma foto disponível nesta seção.</p>`;
      } else {
          validImages.forEach((img) => { 
              const wrapper = document.createElement("div");
              wrapper.className = "foto-item";
              wrapper.appendChild(img);
              container.appendChild(wrapper); 
          });
      }
  };

  // Alterado: 6 fotos para o Escritório (índices de 1 a 6)
  carregarCategoria([1, 2, 3, 4, 5, 6], 'galeria-escritorio');
  
  // Alterado: 6 fotos para o Depósito (índices de 7 a 12)
  carregarCategoria([7, 8, 9, 10, 11, 12], 'galeria-deposito');
}

function mudarAbaFotos(aba) {
  document
    .querySelectorAll(".modal-tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".modal-tab-content")
    .forEach((content) => content.classList.remove("active"));
  document.getElementById(`btn-aba-${aba}`).classList.add("active");
  document.getElementById(`galeria-${aba}`).classList.add("active");
  lucide.createIcons();
}

function fecharModal() {
  document.getElementById("modal-unidade").style.display = "none";
}
window.onclick = (e) => {
  if (e.target == document.getElementById("modal-unidade")) fecharModal();
};

// ============================================
// 5. PLAYER DE MÚSICA
// ============================================
const playlist = [
  {
    name: "COLD PLAY - Viva la Vida",
    src: "/musicas/COLD PLAY - Viva la Vida.mp3",
  },
];
let currentTrackIndex = 0;
const audio = document.getElementById("audio-element");
const playBtn = document.getElementById("play-btn");

function loadTrack(index) {
  audio.src = playlist[index].src;
  document.getElementById("track-name").innerText = playlist[index].name;
}
function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = '<i data-lucide="pause"></i>';
  } else {
    audio.pause();
    playBtn.innerHTML = '<i data-lucide="play"></i>';
  }
  lucide.createIcons();
}
function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  audio.play();
}
function prevTrack() {
  currentTrackIndex =
    (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  audio.play();
}
loadTrack(currentTrackIndex);

// ============================================
// 6. SISTEMA DE CLIMA
// ============================================
const API_KEY = "2c51f53e14f402123f518b63cdf4d002";
const WEATHER_CACHE_KEY = "hortsoy_weather_cache";
const CACHE_DURATION = 30 * 60 * 1000;

async function getWeatherData(lat, lng, unitName) {
  const cache = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || "{}");
  const now = new Date().getTime();
  if (cache[unitName] && now - cache[unitName].timestamp < CACHE_DURATION)
    return cache[unitName].data;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=pt_br`,
    );
    const data = await response.json();
    cache[unitName] = { timestamp: now, data: data };
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cache));
    return data;
  } catch (error) {
    console.error("Erro clima:", error);
    return null;
  }
}

const weatherTranslations = {
  Clear: "Céu limpo",
  Clouds: "Nublado",
  Rain: "Chuva",
  Drizzle: "Garoa",
  Thunderstorm: "Tempestade",
  Snow: "Neve",
  Mist: "Névoa",
  Fog: "Névoa",
};
const weatherIcons = {
  "Céu limpo": "☀️",
  Nublado: "☁️",
  Chuva: "🌧️",
  Garoa: "🌦️",
  Tempestade: "⛈️",
  Neve: "❄️",
  Névoa: "🌫️",
};

async function updateWeatherForUnit(unit) {
  const weatherData = await getWeatherData(unit.lat, unit.lng, unit.nome);
  if (!weatherData) return;

  const temp = Math.round(weatherData.main.temp);
  const condition = weatherData.weather[0].main;
  const conditionPt = weatherTranslations[condition] || condition;
  const icon = weatherIcons[conditionPt] || "🌤️";

  let rainChance = 0;
  if (weatherData.pop !== undefined)
    rainChance = Math.round(weatherData.pop * 100);
  else if (weatherData.rain && weatherData.rain["1h"])
    rainChance = Math.min(Math.round(weatherData.rain["1h"] * 20), 100);

  unit.weatherCondition = condition;

  const holiday = getHolidayStatus(unit);
  const iconColor = holiday ? "orange" : unit.icone || "green";
  if (markers[unit.nome])
    markers[unit.nome].setIcon(
      createIcon(unit.nome, iconColor, !!holiday, condition),
    );
  updateCityRainLayer(unit, condition);

  document.querySelectorAll(".unit-item").forEach((item) => {
    if (item.dataset.unitName === unit.nome) {
      item.classList.toggle("rainy", isRainCondition(condition));
      let weatherDiv = item.querySelector(".unit-weather");
      if (!weatherDiv) {
        weatherDiv = document.createElement("div");
        weatherDiv.className = "unit-weather";
        item.appendChild(weatherDiv);
      }
      weatherDiv.innerHTML = `<span class="weather-icon">${icon}</span><span class="weather-temp">${temp}°C</span><span class="weather-condition">${conditionPt}</span>${rainChance > 0 ? `<span class="weather-rain">💧 ${rainChance}%</span>` : ""}`;
    }
  });
}

async function initWeatherSystem() {
  if (!API_KEY || API_KEY === "SUA_API_KEY_AQUI") return;
  for (const unit of unidades) {
    await updateWeatherForUnit(unit);
    await new Promise((r) => setTimeout(r, 100));
  }
  setInterval(
    () => unidades.forEach((unit) => updateWeatherForUnit(unit)),
    CACHE_DURATION,
  );
}

// ============================================
// 7. SISTEMA DE ROTAS MÚLTIPLAS
// ============================================
function switchTab(tabId) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));
  event.currentTarget.classList.add("active");
  document.getElementById(`tab-${tabId}`).classList.add("active");
  lucide.createIcons();
}

const geocoder = L.Control.Geocoder.nominatim();
let routingControl = null;
let waypointCount = 0;

function addWaypointInput(
  placeholder = "Adicionar destino",
  isRemovable = true,
) {
  waypointCount++;
  const container = document.getElementById("waypoints-container");
  const inputId = `route-input-${waypointCount}`;

  const group = document.createElement("div");
  group.className = "input-group";
  let iconClass =
    waypointCount === 1
      ? "start-icon"
      : !isRemovable
        ? "end-icon"
        : "stop-icon";

  group.innerHTML = `<div class="route-icon ${iconClass}"></div><input type="text" id="${inputId}" class="route-input" placeholder="${placeholder}" autocomplete="none">${isRemovable ? `<button class="btn-remove-stop" onclick="removeWaypoint(this)" title="Remover parada"><i data-lucide="x" style="width: 16px; height: 16px;"></i></button>` : '<div style="width: 26px;"></div>'}`;
  container.appendChild(group);
  setupAutocomplete(document.getElementById(inputId));
  lucide.createIcons();
}

function removeWaypoint(button) {
  button.closest(".input-group").remove();
}

function setupAutocomplete(inputElement) {
  const parentContainer = inputElement.parentElement;
  let debounceTimer;

  inputElement.addEventListener("input", function (e) {
    clearTimeout(debounceTimer);
    const query = e.target.value;
    inputElement.removeAttribute("data-lat");
    inputElement.removeAttribute("data-lng");

    let oldList = document.getElementById(inputElement.id + "-list");
    if (oldList) oldList.remove();
    if (query.length < 3) return;

    debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=br&limit=5`,
        );
        const results = await response.json();
        if (results.length === 0) return;

        const list = document.createElement("div");
        list.id = inputElement.id + "-list";
        list.style.cssText =
          "position: absolute; top: 100%; left: 0; right: 34px; background: var(--card-bg); border: 1px solid var(--hortsoy-green); border-radius: 6px; max-height: 250px; overflow-y: auto; z-index: 9999; box-shadow: 0 4px 15px rgba(0,0,0,0.6); margin-top: 5px;";

        results.forEach((result) => {
          const item = document.createElement("div");
          item.style.cssText =
            "padding: 12px; cursor: pointer; border-bottom: 1px solid rgba(46, 125, 50, 0.2); font-size: 12px; color: var(--text-main); line-height: 1.4;";
          item.innerHTML = `<strong>${result.display_name.split(",")[0]}</strong><br><span style="font-size: 10px; color: var(--text-muted);">${result.display_name.split(",").slice(1).join(",")}</span>`;
          item.addEventListener(
            "mouseover",
            () => (item.style.background = "rgba(46, 125, 50, 0.2)"),
          );
          item.addEventListener(
            "mouseout",
            () => (item.style.background = "transparent"),
          );
          item.addEventListener("click", function () {
            inputElement.value =
              result.display_name.split(",")[0] +
              ", " +
              result.display_name.split(",")[1];
            inputElement.setAttribute("data-lat", result.lat);
            inputElement.setAttribute("data-lng", result.lon);
            list.remove();
          });
          list.appendChild(item);
        });
        parentContainer.appendChild(list);
      } catch (error) {
        console.error("Erro busca:", error);
      }
    }, 500);
  });

  document.addEventListener("click", function (e) {
    if (e.target !== inputElement)
      document.getElementById(inputElement.id + "-list")?.remove();
  });
}

addWaypointInput("Escolha o ponto de partida", false);
addWaypointInput("Escolha o destino final", false);

document.getElementById("btn-add-parada").addEventListener("click", () => {
  const container = document.getElementById("waypoints-container");
  const inputs = container.querySelectorAll(".input-group");
  const lastInput = inputs[inputs.length - 1];
  addWaypointInput("Adicionar parada intermediária", true);
  container.appendChild(lastInput);
});

document.getElementById("btn-calcular-rota").addEventListener("click", () => {
  if (typeof gtag === "function") {
    gtag("event", "rota_calculada", {
      event_category: "Roteirizador",
      event_label: "Cálculo de Rota Iniciado",
    });
  }

  const inputs = document.querySelectorAll(".route-input");
  const waypointsArray = [];

  inputs.forEach((input) => {
    const lat = input.getAttribute("data-lat"),
      lng = input.getAttribute("data-lng");
    if (lat && lng)
      waypointsArray.push(L.latLng(parseFloat(lat), parseFloat(lng)));
  });

  if (waypointsArray.length < 2)
    return alert(
      "Por favor, pesquise e selecione pelo menos 2 endereços na lista suspensa.",
    );
  if (routingControl) map.removeControl(routingControl);

  routingControl = L.Routing.control({
    waypoints: waypointsArray,
    routeWhileDragging: false,
    addWaypoints: false,
    show: false,
    lineOptions: { styles: [{ color: "#4caf50", opacity: 0.9, weight: 6 }] },
    createMarker: function (i, wp, nWps) {
      let color = i === 0 ? "#4fc3f7" : i === nWps - 1 ? "#ff5252" : "#ffb300";
      return L.marker(wp.latLng, {
        icon: L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        }),
      });
    },
  }).addTo(map);

  routingControl.on("routesfound", function (e) {
    const summary = e.routes[0].summary;
    const formatTime = (secs) => {
      const h = Math.floor(secs / 3600),
        m = Math.floor((secs % 3600) / 60);
      return h > 0 ? `${h}h ${m}m` : `${m} min`;
    };

    document.getElementById("time-car").innerText = formatTime(
      summary.totalTime,
    );
    document.getElementById("time-truck").innerText = formatTime(
      summary.totalTime * 1.25,
    );
    document.getElementById("route-distance").innerText =
      `${(summary.totalDistance / 1000).toFixed(1)} km`;
    document.getElementById("route-results").style.display = "flex";
    lucide.createIcons();
    map.fitBounds(L.latLngBounds(waypointsArray), { padding: [50, 50] });
  });
});

// ============================================
// 8. SERVICE WORKER PARA PWA (INSTALAR NO CELULAR)
// ============================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registrado com sucesso:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.log("Falha ao registrar o ServiceWorker:", error);
      });
  });
}
