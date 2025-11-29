// frontend/assets/js/api.js
const API_URL = "http://localhost:3000";

export function salvarToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  // volta pra home pública
  window.location.href = "index.html";
}

// parse simples do JWT (sem libs) — retorna payload (obj) ou null
export function parseJwt(token) {
  try {
    const base = token.split('.')[1];
    const json = decodeURIComponent(atob(base).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

// retorna role presente no token (ex: "profissional" ou null)
export function getRole() {
  const t = getToken();
  if (!t) return null;
  const p = parseJwt(t);
  if (!p) return null;
  return p.role || p.tipo || (p.profissionalId ? "profissional" : null) || null;
}

export function isLogged() {
  return !!getToken();
}

async function request(endpoint, method = "GET", body = null, precisaAuth = false) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (precisaAuth) {
    const token = getToken();
    if (!token) {
      return { message: "Token não encontrado", error: true };
    }
    headers["Authorization"] = "Bearer " + token;
  }

  const res = await fetch(API_URL + endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let json;
  try {
    json = await res.json();
  } catch (e) {
    return { message: "Resposta inválida do servidor", error: true };
  }

  return json;
}

export async function apiPost(endpoint, body, precisaAuth = false) {
  return request(endpoint, "POST", body, precisaAuth);
}

export async function apiGet(endpoint, precisaAuth = false) {
  return request(endpoint, "GET", null, precisaAuth);
}
