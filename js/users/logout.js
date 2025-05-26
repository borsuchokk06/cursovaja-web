document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');

  window.location.href = '/cursovaja-web/pages/login.html';
});
