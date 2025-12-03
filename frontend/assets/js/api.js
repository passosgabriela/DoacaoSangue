// assets/js/api.js
const API = (function(){
  const BASE_URL = "http://localhost:3000";

  async function request(path, opts = {}) {
    const headers = opts.headers || {};
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    headers['Content-Type'] = 'application/json';

    const res = await fetch(BASE_URL + path, {
      method: opts.method || 'GET',
      headers,
      body: opts.body ? JSON.stringify(opts.body) : null
    });

    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch(e) { data = text; }

    if (!res.ok) {
      const err = (data && data.message) ? data : { message: res.statusText || 'Erro' };
      throw err;
    }
    return data;
  }

  return {
    // Users
    loginUser: (body) => request('/users/login', { method: 'POST', body }),
    registerUser: (body) => request('/users/register', { method: 'POST', body }),
    getMyProfile: () => request('/users/me'),

    // Professionals (use '/profissionais' or '/profissional' depending on backend)
    loginProfessional: (body) => request('/profissionais/login', { method: 'POST', body }),
    // fallback if your backend expects different route: /profissional/login
    loginProfessionalFallback: (body) => request('/profissional/login', { method: 'POST', body }),

    // Admin
    loginAdmin: (body) => request('/admin/login', { method: 'POST', body }),

    // Campanhas
    getCampanhas: () => request('/campanhas'),

    // Agendamentos & Doações (example)
    createAgendamento: (body) => request('/agendamentos/create', { method: 'POST', body }),
    getMeusAgendamentos: () => request('/agendamentos/meus'),
    getMinhasDoacoes: () => request('/doacoes/meus'),
  };
})();

// export for other scripts
window.API = API;
