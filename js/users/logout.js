document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');

  window.location.href = '../../pages/home.html';
});
