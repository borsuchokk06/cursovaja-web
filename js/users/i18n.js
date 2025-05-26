let currentLang = 'en';
let translations = {};

async function loadTranslations() {
  try {
    const response = await fetch('../translations.json');
    translations = await response.json();
    applyTranslations();
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key]) {
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.placeholder = translations[currentLang][key];
      } else {
        el.textContent = translations[currentLang][key];
      }
    }
  });
}

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('preferredLanguage', lang);
  applyTranslations();
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang) {
    currentLang = savedLang;
  }

  loadTranslations();

  const langSwitcher = document.createElement('div');
  langSwitcher.className = 'lang-switcher';
  langSwitcher.innerHTML = `
    <button onclick="changeLanguage('en')">EN</button>
    <button onclick="changeLanguage('ru')">RU</button>
  `;
  document.querySelector('header').appendChild(langSwitcher);
});
