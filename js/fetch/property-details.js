document.addEventListener('DOMContentLoaded', function() {
  // Проверка существования элементов DOM
  const elements = {
    mainImage: document.getElementById('main-property-image'),
    title: document.getElementById('property-title'),
    address: document.getElementById('property-address'),
    price: document.getElementById('property-price'),
    beds: document.getElementById('property-beds'),
    baths: document.getElementById('property-baths'),
    parking: document.getElementById('property-parking'),
    sqft: document.getElementById('property-sqft'),
    year: document.getElementById('property-year'),
    description: document.getElementById('property-description'),
    features: document.getElementById('property-features'),
    agentPhoto: document.getElementById('agent-photo'),
    agentName: document.getElementById('agent-name'),
    agentPhone: document.getElementById('agent-phone'),
    agentEmail: document.getElementById('agent-email'),
    gallery: document.getElementById('thumbnail-gallery'),
    propertyContent: document.querySelector('.property-content')
  };

  // Проверяем, все ли элементы найдены
  for (const [key, element] of Object.entries(elements)) {
    if (!element && key !== 'gallery') { // gallery может быть пустым
      console.error(`Element not found: ${key}`);
      showError(`Required element ${key} is missing in the page`);
      return;
    }
  }

  // Показываем состояние загрузки
  if (elements.propertyContent) {
    elements.propertyContent.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading property details...</p>
      </div>
    `;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = parseInt(urlParams.get('id'));

  if (!propertyId || isNaN(propertyId)) {
    showError("Invalid property ID");
    return;
  }

  fetch('../db.json')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      const property = data.properties.find(p => p.id === propertyId);
      if (property) {
        renderPropertyDetails(property, elements);
      } else {
        showError("Property not found");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showError("Failed to load property details");
    });

  function setImageIfExists(imgElement, src) {
    if (!imgElement) return;
    
    if (!src) {
      imgElement.style.display = 'none';
      return;
    }
    
    imgElement.style.display = 'none';
    
    const img = new Image();
    img.onload = function() {
      imgElement.src = src;
      imgElement.style.display = 'block';
    };
    img.onerror = function() {
      imgElement.style.display = 'none';
    };
    img.src = src;
  }

  function renderPropertyDetails(property, elements) {
    try {
      // Основное изображение
      setImageIfExists(elements.mainImage, property.image);

      // Основная информация
      elements.title.textContent = property.title || 'No title';
      elements.address.textContent = property.address || 'Address not specified';
      elements.price.textContent = property.price ? `$${property.price.toLocaleString()}` : 'Price not available';
      
      // Характеристики
      elements.beds.textContent = property.beds || 'N/A';
      elements.baths.textContent = property.baths || 'N/A';
      elements.parking.textContent = property.parking || 'N/A';
      elements.sqft.textContent = property.sqft || 'N/A';
      elements.year.textContent = property.yearBuilt || 'N/A';
      
      // Описание
      elements.description.textContent = property.description || 'No description available for this property.';
      elements.description.style.whiteSpace = 'pre-line';

      // Особенности
      elements.features.innerHTML = property.features && property.features.length > 0 
        ? property.features.map(f => `<li>${f}</li>`).join('')
        : '<li>No features listed</li>';

      // Агент
      setImageIfExists(elements.agentPhoto, property.agent?.photo);
      elements.agentName.textContent = property.agent?.name || 'Agent not specified';
      elements.agentPhone.textContent = property.agent?.phone || 'Phone not available';
      elements.agentEmail.textContent = property.agent?.email || 'Email not available';

      // Галерея
      if (elements.gallery) {
        elements.gallery.innerHTML = '';
        
        if (property.gallery && property.gallery.length > 0) {
          property.gallery.forEach(imgSrc => {
            const img = document.createElement('img');
            img.alt = property.title;
            img.classList.add('gallery-thumbnail');
            setImageIfExists(img, imgSrc);
            img.addEventListener('click', () => {
              setImageIfExists(elements.mainImage, imgSrc);
            });
            elements.gallery.appendChild(img);
          });
        } else {
          elements.gallery.innerHTML = '<p class="no-images">No images available</p>';
        }
      }

    } catch (error) {
      console.error('Error rendering property details:', error);
      showError("Error displaying property details");
    }
  }

  function showError(message) {
    const contentElement = elements.propertyContent || document.body;
    contentElement.innerHTML = `
      <div class="error-message">
        <h2>Error</h2>
        <p>${message}</p>
        <a href="properties.html" class="btn">Back to Properties</a>
      </div>
    `;
  }
});