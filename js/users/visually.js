function toggleDropdown() {
  document.getElementById("accessibility-dropdown").classList.toggle("open");
}

function setFontSize(size) {
  document.body.classList.remove('font-small', 'font-medium', 'font-large');
  document.body.classList.add(`font-${size}`);
  document.body.classList.add('accessibility');
}

function setColorScheme(scheme) {
  document.body.classList.remove(
    'color-black-white',
    'color-black-green',
    'color-white-black',
    'color-beige-brown',
    'color-blue-darkblue'
  );
  document.body.classList.add(`color-${scheme}`);
  document.body.classList.add('accessibility');
}

function toggleImages(disable) {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (disable) {
      if (!img.nextElementSibling || !img.nextElementSibling.classList.contains('image-placeholder')) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerText = img.alt || 'Изображение отключено';
        img.style.display = 'none';
        img.after(placeholder);
      }
    } else {
      img.style.display = '';
      const next = img.nextElementSibling;
      if (next?.classList.contains('image-placeholder')) {
        next.remove();
      }
    }
  });
  document.body.classList.add('accessibility');
}

function resetAccessibility() {
  document.body.className = '';
  const placeholders = document.querySelectorAll('.image-placeholder');
  placeholders.forEach(p => p.remove());
  const images = document.querySelectorAll('img');
  images.forEach(img => (img.style.display = ''));
}
