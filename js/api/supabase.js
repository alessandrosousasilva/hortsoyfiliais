// ============================================
// js/api/supabase.js
// ============================================

// As credenciais do banco de dados
const supabaseUrl = "https://xbrddqwcmxlumzveqqwv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicmRkcXdjbXhsdW16dmVxcXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTU0MTYsImV4cCI6MjA5OTUzMTQxNn0.JV54fnkc8u0ml5aUD2xZT-zyUjLCz2tIAx9bcdQzRmY";

// Inicia conectando à nuvem
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função que busca os pedágios
export async function carregarPedagios() {
  try {
    const { data, error } = await supabase.from("pedagios").select("*");
    if (error) throw error;
    return data;
  } catch (erro) {
    console.error("Erro ao buscar pedágios na nuvem:", erro);
    return []; // Retorna vazio se falhar, para não quebrar o mapa
  }
}
