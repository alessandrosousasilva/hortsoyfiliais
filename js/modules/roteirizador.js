// ============================================
// js/modules/roteirizador.js
// ============================================

import { map } from "./mapa.js";
import { pedagiosHortsoy } from "../data/pedagios.js";

let routingControl = null;
let waypointCount = 0;
let pedagiosMarkersLayer = null;

const multiplicadoresEixo = {
  carro: 1,
  "caminhao-2": 2,
  "caminhao-3": 3,
  "caminhao-4": 4,
  "caminhao-5": 5,
  "caminhao-6": 6,
  "caminhao-7": 7,
  "caminhao-9": 9,
};

export function initRoteirizador() {
  pedagiosMarkersLayer = L.layerGroup().addTo(map);

  // Expõe a remoção de waypoint para o HTML
  window.removeWaypoint = removeWaypoint;

  addWaypointInput("Escolha o ponto de partida", false);
  addWaypointInput("Escolha o destino final", false);

  const btnAddParada = document.getElementById("btn-add-parada");
  if (btnAddParada) {
    btnAddParada.addEventListener("click", () => {
      const container = document.getElementById("waypoints-container");
      const inputs = container.querySelectorAll(".input-group");
      const lastInput = inputs[inputs.length - 1];
      addWaypointInput("Adicionar parada intermediária", true);
      container.appendChild(lastInput);
    });
  }

  const btnCalcular = document.getElementById("btn-calcular-rota");
  if (btnCalcular) btnCalcular.addEventListener("click", calcularRota);

  // Lógica do Botão Limpar
  const btnLimpar = document.getElementById("btn-limpar-rota");
  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      // 1. Esvazia todos os campos de texto da rota
      document
        .querySelectorAll(".route-input")
        .forEach((input) => (input.value = ""));

      // 2. Remove a linha e os marcadores da rota do mapa
      if (typeof routingControl !== "undefined" && routingControl != null) {
        map.removeControl(routingControl);
        routingControl = null;
      }

      // 3. Esconde a caixa de tempo e distância (se estiver visível)
      const routeResults = document.querySelector(".route-results");
      if (routeResults) {
        routeResults.style.display = "none";
      }

      // 4. Remove paradas extras e deixa apenas Origem e Destino
      const inputsContainer = document.querySelector(".route-inputs-wrapper");
      if (inputsContainer) {
        const paradas = inputsContainer.querySelectorAll(".input-group");
        // Se houver mais de 2 (origem e destino), apaga as do meio
        for (let i = 1; i < paradas.length - 1; i++) {
          paradas[i].remove();
        }
      }

      // 5. Devolve o mapa à visão geral original
      map.setView([-19.7, -47.0], 8);
    });
  }
}

function addWaypointInput(
  placeholder = "Adicionar destino",
  isRemovable = true,
) {
  waypointCount++;
  const container = document.getElementById("waypoints-container");
  if (!container) return;

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
  if (window.lucide) lucide.createIcons();
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

function calcularRota() {
  if (typeof gtag === "function")
    gtag("event", "rota_calculada", {
      event_category: "Roteirizador",
      event_label: "Cálculo de Rota Iniciado",
    });
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
    if (window.lucide) lucide.createIcons();
    map.fitBounds(L.latLngBounds(waypointsArray), { padding: [50, 50] });

    const rota = e.routes[0];
    const coordenadasRota = rota.coordinates;
    const tipoVeiculo = document.getElementById("tipo-veiculo").value;
    const multiplicador = multiplicadoresEixo[tipoVeiculo] || 1;

    let custoTotalPedagio = 0;
    let quantidadePedagios = 0;
    pedagiosMarkersLayer.clearLayers();

    pedagiosHortsoy.forEach((pedagio) => {
      const pontoPedagio = L.latLng(pedagio.lat, pedagio.lng);
      let vezesPassou = 0;
      let dentroDoRaio = false;

      coordenadasRota.forEach((coord) => {
        const distancia = coord.distanceTo(pontoPedagio);
        if (distancia < 2500) {
          if (!dentroDoRaio) {
            vezesPassou++;
            dentroDoRaio = true;
          }
        } else if (distancia > 3500) {
          dentroDoRaio = false;
        }
      });

      if (vezesPassou > 0) {
        const custoVeiculo = pedagio.tarifaBase * multiplicador * vezesPassou;
        custoTotalPedagio += custoVeiculo;
        quantidadePedagios += vezesPassou;

        const pedagioIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); position: relative;"><span style="color: white; font-weight: 900; font-size: 14px;">$</span>${vezesPassou > 1 ? `<div style="position: absolute; top: -8px; right: -8px; background: #fbbf24; color: black; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; font-weight: bold; display: flex; justify-content: center; align-items: center; border: 1px solid white; z-index: 10;">${vezesPassou}x</div>` : ""}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([pedagio.lat, pedagio.lng], { icon: pedagioIcon })
          .bindPopup(
            `<div style="text-align: center;"><b style="color: #ef4444;">${pedagio.nome}</b><br><span style="font-size: 12px; color: var(--text-muted);">${vezesPassou > 1 ? `<strong style="color: #fbbf24;">Cruzou ${vezesPassou} vezes (Ida e Volta)</strong><br>` : ""}Custo neste veículo:</span><br><b style="font-size: 14px;">R$ ${custoVeiculo.toFixed(2).replace(".", ",")}</b></div>`,
          )
          .addTo(pedagiosMarkersLayer);
      }
    });

    const tollCard = document.getElementById("toll-card");
    if (quantidadePedagios > 0 && tollCard) {
      document.getElementById("toll-count-label").innerText =
        `Pedágios (${quantidadePedagios})`;
      document.getElementById("toll-total-cost").innerText =
        `R$ ${custoTotalPedagio.toFixed(2).replace(".", ",")}`;
      tollCard.style.display = "flex";
    } else if (tollCard) {
      tollCard.style.display = "none";
    }
  });
}
