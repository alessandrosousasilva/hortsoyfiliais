// ============================================
// js/modules/ui.js
// ============================================

export function initUI() {
  initTheme();
  initCursor();

  // Tornando as funções acessíveis para os botões no HTML (onclick="")
  window.toggleTheme = toggleTheme;
  window.abrirDetalhes = abrirDetalhes;
  window.mudarAbaFotos = mudarAbaFotos;
  window.fecharModal = fecharModal;
  window.togglePlay = togglePlay;
  window.nextTrack = nextTrack;
  window.prevTrack = prevTrack;
  window.switchTab = switchTab;

  loadTrack(currentTrackIndex);
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeButton(savedTheme);

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
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
    if (window.lucide) lucide.createIcons();
  }
  if (logo) {
    logo.src =
      theme === "dark"
        ? "/logos/logo-hortsoy.png"
        : "/logos/logo-hortsoy-ligth.png";
  }
}

function initCursor() {
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
}

// --- MODAL DE FOTOS ---
async function abrirDetalhes(slug, nome) {
  if (typeof gtag === "function")
    gtag("event", "visualizar_fotos", {
      event_category: "Filiais",
      event_label: nome,
    });
  const modal = document.getElementById("modal-unidade");
  document.getElementById("modal-titulo").innerText = nome;
  modal.style.display = "flex";
  mudarAbaFotos("escritorio");

  const carregarCategoria = async (indices, containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    indices.forEach(() => {
      const skeleton = document.createElement("div");
      skeleton.className = "skeleton";
      container.appendChild(skeleton);
    });

    const imagePromises = indices.map((i) => {
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

  carregarCategoria([1, 2, 3, 4, 5, 6], "galeria-escritorio");
  carregarCategoria([7, 8, 9, 10, 11, 12], "galeria-deposito");
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
  if (window.lucide) lucide.createIcons();
}

function fecharModal() {
  document.getElementById("modal-unidade").style.display = "none";
}
window.onclick = (e) => {
  if (e.target == document.getElementById("modal-unidade")) fecharModal();
};

// --- TABS (Rotas/Filiais) ---
function switchTab(tabId, event) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  // Garantia caso o event não seja passado
  if (event && event.currentTarget) event.currentTarget.classList.add("active");
  else
    document
      .querySelector(`.tab-btn[onclick*="${tabId}"]`)
      .classList.add("active");

  document.getElementById(`tab-${tabId}`).classList.add("active");
  if (window.lucide) lucide.createIcons();
}

// --- PLAYER DE MÚSICA ---
const playlist = [
  {
    name: "COLD PLAY - Viva la Vida",
    src: "/musicas/COLD PLAY - Viva la Vida.mp3",
  },
];
let currentTrackIndex = 0;

function loadTrack(index) {
  const audio = document.getElementById("audio-element");
  if (!audio) return;
  audio.src = playlist[index].src;
  document.getElementById("track-name").innerText = playlist[index].name;
}

function togglePlay() {
  const audio = document.getElementById("audio-element");
  const playBtn = document.getElementById("play-btn");
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = '<i data-lucide="pause"></i>';
  } else {
    audio.pause();
    playBtn.innerHTML = '<i data-lucide="play"></i>';
  }
  if (window.lucide) lucide.createIcons();
}

function nextTrack() {
  const audio = document.getElementById("audio-element");
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  audio.play();
}

function prevTrack() {
  const audio = document.getElementById("audio-element");
  currentTrackIndex =
    (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  audio.play();
}
