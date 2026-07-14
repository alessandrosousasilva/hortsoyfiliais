// ============================================
// js/main.js
// ============================================

import { initUI } from "./modules/ui.js";
import { iniciarMapa } from "./modules/mapa.js";
import { initRoteirizador } from "./modules/roteirizador.js";
import { carregarPedagios } from "./api/supabase.js";
import { setPedagiosDaNuvem } from "./data/pedagios.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("A conectar à nuvem da Hortsoy...");

  // 1. Busca os dados no Supabase e atualiza o estado
  const dadosNuvem = await carregarPedagios();
  setPedagiosDaNuvem(dadosNuvem);
  console.log(`Sucesso! ${dadosNuvem.length} pedágios carregados do Supabase.`);

  // 2. Levanta a Interface
  initUI();

  // 3. Levanta o Mapa e desliga a tela de carregamento
  iniciarMapa();

  // 4. Inicializa o Roteirizador (agora com dados reais da nuvem)
  initRoteirizador();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
});
