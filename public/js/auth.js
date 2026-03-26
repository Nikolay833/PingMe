async function login(email, password) {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);

  localStorage.setItem('token',     data.token);
  localStorage.setItem('user_id',   data.user.id);
  localStorage.setItem('user_name', data.user.name);
  localStorage.setItem('user_role', data.user.role);

  return data.user;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_role');
  window.location.href = '/login.html';
}

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function getCurrentUser() {
  return {
    id:   localStorage.getItem('user_id'),
    name: localStorage.getItem('user_name'),
    role: localStorage.getItem('user_role')
  };
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

function updateNav() {
  const user = getCurrentUser();

  document.querySelectorAll('.nav-login').forEach(el => {
    el.style.display = isLoggedIn() ? 'none' : '';
  });

  document.querySelectorAll('.nav-logout').forEach(el => {
    el.style.display = isLoggedIn() ? '' : 'none';
    el.addEventListener('click', logout);
  });

  document.querySelectorAll('.nav-user-name').forEach(el => {
    el.textContent = user.name || '';
  });

  document.querySelectorAll('.nav-dashboard').forEach(el => {
    el.style.display = isLoggedIn() ? '' : 'none';
    el.href = user.role === 'legend' ? '/dashboard-legend.html' : '/dashboard-traveler.html';
  });
}

document.addEventListener('DOMContentLoaded', updateNav);
