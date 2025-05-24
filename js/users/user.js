document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser');
  const registerButtons = document.querySelectorAll('.register-btn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (currentUser) {
    registerButtons.forEach(btn => btn.style.display = 'none');
    if (logoutBtn) {
      logoutBtn.style.display = 'inline-block'; 
    }
  } else {
    registerButtons.forEach(btn => btn.style.display = 'inline-block');
    if (logoutBtn) {
      logoutBtn.style.display = 'none';
    }
  }
});
