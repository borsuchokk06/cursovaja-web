export function showError(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}

export function hideError(element) {
  element.textContent = '';
  element.style.display = 'none';
}
