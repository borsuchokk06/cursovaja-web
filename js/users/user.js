document.addEventListener('DOMContentLoaded', () => {
  const currentUserRaw = localStorage.getItem('currentUser');
  const registerButtons = document.querySelectorAll('.register-btn');
  const logoutBtn = document.getElementById('logoutBtn');
  const noclickButtons = document.querySelectorAll('#noclick'); 
  const adminControls = document.getElementById('adminControls');
  const addModal = document.getElementById('addModal');
  const deleteModal = document.getElementById('deleteModal');
  const addTeamModal = document.getElementById('addTeamModal');
  const deleteTeamListModal = document.getElementById('deleteTeamListModal');
  const addArticleBtn = document.getElementById('addArticleBtn');
  const openDeleteArticleListBtn = document.getElementById('openDeleteArticleListBtn');

  let isAdmin = false;

  noclickButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      if (!currentUserRaw) {
        event.preventDefault(); 
        window.location.href = '../pages/login.html'; 
      }
    });
  });

  if (currentUserRaw) {
    const currentUser = JSON.parse(currentUserRaw);

    if (currentUser.role === 'admin') {
      isAdmin = true;
    }

    registerButtons.forEach(btn => btn.style.display = 'none');
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  } else {
    registerButtons.forEach(btn => btn.style.display = 'inline-block');
    if (logoutBtn) logoutBtn.style.display = 'none';
  }

  if (isAdmin) {
    if (adminControls) adminControls.style.display = 'block';
    if (addModal) addModal.style.display = 'none'; 
    if (deleteModal) deleteModal.style.display = 'none';
    if (addTeamModal) addTeamModal.style.display = 'none'; 
    if (deleteTeamListModal) deleteTeamListModal.style.display = 'none';
    if (addArticleBtn) addArticleBtn.style.display = 'none'; 
    if (openDeleteArticleListBtn) openDeleteArticleListBtn.style.display = 'none';
  } else {
    if (adminControls) adminControls.style.display = 'none';
    if (addModal) addModal.remove(); 
    if (deleteModal) deleteModal.remove();
    if (addTeamModal) addTeamModal.remove(); 
    if (deleteTeamListModal) deleteTeamListModal.remove();
    if (addArticleBtn) addArticleBtn.remove(); 
    if (openDeleteArticleListBtn) openDeleteArticleListBtn.remove();
  }
});
