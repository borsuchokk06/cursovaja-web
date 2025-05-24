document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');

  location.reload();
});
