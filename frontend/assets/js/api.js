const API = (function () {
  const BASE_URL = "http://localhost:3000";

  async function request(path, opts = {}) {
    const headers = opts.headers || {};
    const token = localStorage.getItem("token");

    if (token) headers["Authorization"] = `Bearer ${token}`;
    headers["Content-Type"] = "application/json";

    const res = await fetch(BASE_URL + path, {
      method: opts.method || "GET",
      headers,
      body: opts.body ? JSON.stringify(opts.body) : null,
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = text;
    }

    if (!res.ok) throw data || { message: "Erro desconhecido" };
    return data;
  }

  return {
    // ---------------------------
    // AUTH
    // ---------------------------
    isLogged: () => !!localStorage.getItem("token"),
    getRole: () => localStorage.getItem("role"),

    // ---------------------------
    // USUÁRIOS
    // ---------------------------
    loginUser: (body) => request("/users/login", { method: "POST", body }),
    registerUser: (body) =>
      request("/users/register", { method: "POST", body }),
    getMyProfile: () => request("/users/me"),
    updateMyProfile: (body) =>
      request("/users/me", { method: "PUT", body }),

    // ---------------------------
    // PROFISSIONAIS
    // ---------------------------
    loginProfessional: (body) =>
      request("/profissionais/login", { method: "POST", body }),

    registrarProfissional: (body) =>
      request("/profissionais", { method: "POST", body }),

    getProfissionais: () => request("/profissionais"),
    removerProfissional: (id) =>
      request(`/profissionais/${id}`, { method: "DELETE" }),

    // ---------------------------
    // ADMINS
    // ---------------------------
    criarAdmin: (body) => request("/admin", { method: "POST", body }),
    loginAdmin: (body) => request("/admin/login", { method: "POST", body }),
    getAdmins: () => request("/admin"),
    removerAdmin: (id) => request(`/admin/${id}`, { method: "DELETE" }),

    // ---------------------------
    // CAMPANHAS
    // ---------------------------
    getCampanhas: () => request("/campanha"),
    criarCampanha: (body) =>
      request("/campanha/criar", { method: "POST", body }),
    removerCampanha: (id) =>
      request(`/campanha/${id}`, { method: "DELETE" }),

    // ---------------------------
    // RESUMO
    // ---------------------------
    getSistemaResumo: () => request("/sistema/resumo"),

    // ---------------------------
    // AGENDAMENTOS
    // ---------------------------
    createAgendamento: (body) =>
      request("/appointment/create", { method: "POST", body }),

    getMeusAgendamentos: () => request("/appointments/meus"),

    confirmarAgendamento: (id) =>
      request(`/appointment/confirmar/${id}`, { method: "POST" }),

    cancelarAgendamento: (id) =>
      request(`/appointment/cancelar/${id}`, { method: "POST" }),

    getAgendamentosDia: (data) =>
      request(`/appointments/dia/${data}`),

    // ---------------------------
    // DOAÇÕES
    // ---------------------------
    registrarDoacaoManual: (body) =>
      request("/donations/register", { method: "POST", body }),

    getMinhasDoacoes: () => request("/donations/meus"),

    getDoacoes: () => request("/donations/meus"),

    getDoacoesProfissional: () => request("/donations/profissional"),


    // ---------------------------
    // TRIAGEM
    // ---------------------------
    registrarTriagem: (body) =>
      request("/triagem/registrar", { method: "POST", body }),

    getTriagens: () => request("/triagem/all"),
  };
})();

window.API = API;
