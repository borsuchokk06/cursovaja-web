import { validateForm } from './formValidation.js';

export const commonPasswords = [    'password', '123456', '123456789', 'guest', 'qwerty', '12345678', '111111',
    '12345', 'col123456', '123123', '1234567', '1234567890', '000000', '555555',
    '666666', '123321', '654321', '7777777', '123', 'iloveyou', '1q2w3e4r',
    'admin', 'welcome', 'monkey', 'password1', '1234', '123qwe', 'dragon', 'sunshine'];

export function initPasswordOptions() {
  const radios = document.querySelectorAll('input[name="passwordOption"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      togglePasswordFields(radio.value);
      validateForm();
    });
  });

  document.getElementById('generatePassword').addEventListener('click', generateAutoPassword);
  generateAutoPassword();

  document.getElementById('password').addEventListener('input', updatePasswordStrength);
}

function togglePasswordFields(option) {
  const manual = document.getElementById('manualPasswordFields');
  const auto = document.getElementById('autoPasswordField');

  if (option === 'manual') {
    manual.style.display = 'block';
    auto.style.display = 'none';
  } else {
    manual.style.display = 'none';
    auto.style.display = 'block';
    generateAutoPassword();
  }
}

export function generateAutoPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  password += getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  password += getRandomChar('abcdefghijklmnopqrstuvwxyz');
  password += getRandomChar('0123456789');
  password += getRandomChar('!@#$%^&*()');

  for (let i = 0; i < 8; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  password = password.split('').sort(() => 0.5 - Math.random()).join('');
  document.getElementById('autoPassword').value = password;
}

function getRandomChar(set) {
  return set[Math.floor(Math.random() * set.length)];
}

function updatePasswordStrength() {
  const password = this.value;
  const bar = document.querySelector('.strength-bar');
  const text = document.querySelector('.strength-text');

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()]/.test(password)) strength++;

  let width = 0, color = '#e74c3c', label = 'Слабый';
  if (strength >= 6) { width = 100; color = '#2ecc71'; label = 'Очень сильный'; }
  else if (strength >= 4) { width = 75; color = '#3498db'; label = 'Сильный'; }
  else if (strength >= 2) { width = 50; color = '#f39c12'; label = 'Средний'; }
  else if (password.length > 0) { width = 25; }

  bar.style.width = width + '%';
  bar.style.backgroundColor = color;
  text.textContent = password.length ? label : '';
}
