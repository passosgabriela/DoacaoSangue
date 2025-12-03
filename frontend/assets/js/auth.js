// assets/js/auth.js
function saveSession(token, role, userObj = null) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  if (userObj) localStorage.setItem('user', JSON.stringify(userObj));
}

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
}

function isLogged() {
  return !!localStorage.getItem('token');
}

function getRole() {
  return localStorage.getItem('role');
}

// expose helpers
window.API = window.API || {};
window.API.saveSession = saveSession;
window.API.clearSession = clearSession;
window.API.isLogged = isLogged;
window.API.getRole = getRole;
