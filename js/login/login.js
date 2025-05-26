const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const emailInput = loginForm.email;
const passwordInput = loginForm.password;

function validateInputs() {
  loginBtn.disabled = !(emailInput.value.trim() && passwordInput.value.trim());
}

emailInput.addEventListener('input', validateInputs);
passwordInput.addEventListener('input', validateInputs);

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const response = await fetch('http://localhost:3000/users');
    if (!response.ok) throw new Error('Ошибка запроса');

    const users = await response.json();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      alert('Вход выполнен успешно!');
      window.location.href = '/cursovaja-web/pages/login.html';
    } else {
      alert('Неверный email или пароль');
    }
  } catch (error) {
    console.error('Ошибка при входе:', error);
    alert('Ошибка при входе, попробуйте позже');
  }
});
