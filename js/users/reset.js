document.getElementById('reset-settings').addEventListener('click', () => {
  document.body.classList.remove('dark-theme');
  

  localStorage.removeItem('theme');      
  localStorage.removeItem('preferredLanguage');   
  
  document.documentElement.lang = 'en';

  location.reload();
});
