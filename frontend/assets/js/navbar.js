// assets/js/navbar.js
function initNavbar() {
  const root = document.getElementById('site-navbar');
  const role = localStorage.getItem('role');

  const html = `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold text-danger" href="../pages/usuario.html">Doação+</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navc">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navc">
          <ul class="navbar-nav ms-auto gap-3">

            <li class="nav-item">
              <a class="nav-link" href="../pages/index.html">Início</a>
            </li>

            ${role === 'usuario'
      ? `
    <li class="nav-item"><a class="nav-link" href="../pages/usuario.html">Minha Área</a></li>
    <li class="nav-item"><a class="nav-link" href="../pages/perfil.html">Meu Perfil</a></li>
  `
      : ''}


            ${role === 'profissional'
      ? `<li class="nav-item"><a class="nav-link" href="../pages/profissional.html">Profissional</a></li>`
      : ''}

            ${role === 'adm'
      ? `<li class="nav-item"><a class="nav-link" href="../pages/admin.html">Admin</a></li>`
      : ''}

            ${!role
      ? `<li class="nav-item"><a class="nav-link" href="../pages/login.html">Entrar</a></li>`
      : ''}

            ${role
      ? `<li class="nav-item"><a class="nav-link text-danger" id="logoutBtn" href="#">Sair</a></li>`
      : ''}
          </ul>
        </div>
      </div>
    </nav>`;

  root.innerHTML = html;

  const logout = document.getElementById('logoutBtn');
  if (logout) {
    logout.addEventListener('click', (e) => {
      e.preventDefault();
      window.API.clearSession();
      window.location.href = "../pages/index.html";
    });
  }
}
