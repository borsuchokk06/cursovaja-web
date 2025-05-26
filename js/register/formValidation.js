import { showError, hideError } from './domUtils.js';
import { commonPasswords } from './passwordUtils.js';

export function validateForm() {
  let isValid = true;

  const phoneInput = document.getElementById('phone');
  const phoneError = document.getElementById('phoneError');
  const phoneValue = phoneInput.value.replace(/\D/g, '');
  if (!phoneValue || phoneValue.length !== 9) {
    showError(phoneError, 'Введите корректный номер телефона (9 цифр после +375)');
    isValid = false;
  } else {
    hideError(phoneError);
  }
const emailInput = document.getElementById('email');
const emailValue = emailInput.value;
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailValue || !emailRegex.test(emailValue)) {
      showError(emailError, 'Введите корректный email');
      isValid = false;
    } else {
      hideError(emailError);
    }

    const birthdateInput = document.getElementById('birthdate');
    const birthdateValue = birthdateInput.value;
    const birthdateError = document.getElementById('birthdateError');
    
    if (!birthdateValue) {
      showError(birthdateError, 'Введите дату рождения');
      isValid = false;
    } else {
      const birthDate = new Date(birthdateValue);
      const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
        }
      
      if (age < 16) {
        showError(birthdateError, 'Вам должно быть не менее 16 лет');
        isValid = false;
      } else {
        hideError(birthdateError);
      }
    }

    const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const isManualPassword = document.querySelector('input[name="passwordOption"]:checked').value === 'manual';
    
    if (isManualPassword) {
      const passwordValue = passwordInput.value;
      const confirmValue = confirmPasswordInput.value;
      
      if (!passwordValue) {
        showError(passwordError, 'Введите пароль');
        isValid = false;
      } else if (passwordValue.length < 8 || passwordValue.length > 20) {
        showError(passwordError, 'Пароль должен быть от 8 до 20 символов');
        isValid = false;
      } else if (!/[A-Z]/.test(passwordValue)) {
        showError(passwordError, 'Пароль должен содержать хотя бы одну заглавную букву');
        isValid = false;
      } else if (!/[a-z]/.test(passwordValue)) {
        showError(passwordError, 'Пароль должен содержать хотя бы одну строчную букву');
        isValid = false;
      } else if (!/[0-9]/.test(passwordValue)) {
        showError(passwordError, 'Пароль должен содержать хотя бы одну цифру');
        isValid = false;
      } else if (!/[!@#$%^&*()]/.test(passwordValue)) {
        showError(passwordError, 'Пароль должен содержать хотя бы один специальный символ');
        isValid = false;
      } else if (commonPasswords.includes(passwordValue.toLowerCase())) {
        showError(passwordError, 'Этот пароль слишком распространен');
        isValid = false;
      } else if (passwordValue !== confirmValue) {
        showError(passwordError, 'Пароли не совпадают');
        isValid = false;
      } else {
        hideError(passwordError);
      }
    }

    const lastNameValue = document.getElementById('lastName').value;
    const firstNameValue = document.getElementById('firstName').value;
    
    if (!lastNameValue) {
      isValid = false;
    }
    
    if (!firstNameValue) {
      isValid = false;
    }

    const usernameInput = document.getElementById('username');
    const usernameValue = usernameInput.value;
    const usernameError = document.getElementById('usernameError');
    
    if (!usernameValue) {
      showError(usernameError, 'Введите никнейм');
      isValid = false;
    } else if (usernameValue.length < 3) {
      showError(usernameError, 'Никнейм должен быть не менее 3 символов');
      isValid = false;
    } else {
      hideError(usernameError);
    }

    const agreementChecked = document.getElementById('agreement').checked;
    const agreementError = document.getElementById('agreementError');
    
    if (!agreementChecked) {
      showError(agreementError, 'Необходимо принять соглашение');
      isValid = false;
    } else {
      hideError(agreementError);
    }

  document.getElementById('registerBtn').disabled = !isValid;
  return isValid;
}
