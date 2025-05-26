const toggleBtn = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-theme');
  toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
}

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  
  const isDark = body.classList.contains('dark-theme');
  toggleBtn.innerHTML = isDark 
    ? '<i class="fas fa-sun"></i>' 
    : '<i class="fas fa-moon"></i>';

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
