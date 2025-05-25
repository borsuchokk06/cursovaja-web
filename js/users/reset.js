document.getElementById('reset-settings').addEventListener('click', () => {
  document.body.classList.remove('dark-theme', 'accessible');
  

  localStorage.removeItem('theme');      
  localStorage.removeItem('language');   
  localStorage.removeItem('accessible'); 
  
  document.documentElement.lang = 'en';

  location.reload();
});
