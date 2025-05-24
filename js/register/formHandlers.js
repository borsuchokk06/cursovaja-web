import { validateForm } from './formValidation.js';
import { registerUser, setCurrentUser } from './storage.js';

export function setupFormHandlers() {
  const form = document.getElementById('registerForm');
  const registerBtn = document.getElementById('registerBtn');

  form.addEventListener('input', validateForm);

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const userData = {
    email: form.email.value.trim(),
    password: form.passwordOption.value === 'manual' ? form.password.value : form.autoPassword.value,
    phone: '+375' + form.phone.value.trim(),
    lastName: form.lastName.value.trim(),
    firstName: form.firstName.value.trim(),
    middleName: form.middleName.value.trim(),
    birthdate: form.birthdate.value,
    username: form.username.value.trim(),
    role: 'user'   
    };

    try {
      const user = await registerUser(userData);
      setCurrentUser(user);
      alert('Регистрация прошла успешно!');
      form.reset();
      window.location.href = '../../pages/home.html';
    } catch {
      alert('Ошибка при регистрации');
    }
  });
}
