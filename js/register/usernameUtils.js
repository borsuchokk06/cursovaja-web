export function initUsernameGeneration() {
  const generateBtn = document.getElementById('generateUsername');
  const input = document.getElementById('username');
  const attemptsLeft = document.getElementById('attemptsLeft');
  let attempts = 5;

  generateUsername();

  generateBtn.addEventListener('click', () => {
    if (attempts > 0) {
      attempts--;
      attemptsLeft.textContent = attempts;
      generateUsername();

      if (attempts === 0) {
        generateBtn.disabled = true;
        input.readOnly = false;
        input.placeholder = 'Введите никнейм вручную';
      }
    }
  });
}

function generateUsername() {
  const adjectives = ['Cool', 'Smart', 'Happy', 'Brave', 'Gentle', 'Wise', 'Lucky', 'Fast'];
  const nouns = ['Cat', 'Dog', 'Tiger', 'Eagle', 'Wolf', 'Bear', 'Lion', 'Fox'];
  const number = Math.floor(Math.random() * 1000);
  const name = adjectives[Math.floor(Math.random() * adjectives.length)] + 
               nouns[Math.floor(Math.random() * nouns.length)] + number;
  document.getElementById('username').value = name.toLowerCase();
}
