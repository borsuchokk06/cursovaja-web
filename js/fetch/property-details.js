document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id');
  
  if (!propertyId) {
    showError('Property ID not specified');
    return;
  }

fetch(`http://localhost:3000/properties/${propertyId}`)
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(property => {
    renderPropertyDetails(property);
  })
  .catch(error => {
    console.error('Error loading property:', error);
    showError(error.message);
  });


  function renderPropertyDetails(property) {
    document.getElementById('propertyTitle').textContent = property.title;
    document.getElementById('propertyLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${property.location}`;
    document.getElementById('propertyAddress').textContent = property.address || 'Address not specified';
    document.getElementById('propertyBeds').textContent = property.beds;
    document.getElementById('propertyBaths').textContent = property.baths;
    document.getElementById('propertyParking').textContent = property.parking;
    document.getElementById('propertySqft').textContent = property.sqft ? property.sqft.toLocaleString() : 'N/A';
    document.getElementById('propertyYear').textContent = property.yearBuilt || 'N/A';
    document.getElementById('propertyPrice').textContent = `$${property.price.toLocaleString()}`;
    document.getElementById('propertyDescription').textContent = property.description || 'No description available';

    const featuresList = document.getElementById('propertyFeatures');
    if (property.features && property.features.length > 0) {
      featuresList.innerHTML = property.features.map(feature => `<li>${feature}</li>`).join('');
    } else {
      featuresList.innerHTML = '<li data-i18n="ndfl">No features listed</li>';
    }

    const galleryGrid = document.querySelector('.gallery-grid');
    if (property.gallery && property.gallery.length > 0) {
      galleryGrid.innerHTML = property.gallery.map(img => `
        <div class="gallery-item">
          <img src="${img}" alt="${property.title}">
        </div>
      `).join('');
    } else {
      document.getElementById('propertyGallery').style.display = 'none';
    }

    if (property.agent) {
      document.getElementById('agentName').textContent = property.agent.name;
      document.getElementById('agentPhone').textContent = property.agent.phone;
      document.getElementById('agentPhone').href = `tel:${property.agent.phone}`;
      document.getElementById('agentEmail').textContent = property.agent.email;
      document.getElementById('agentEmail').href = `mailto:${property.agent.email}`;
      
      const agentPhoto = document.getElementById('agentPhoto');
      if (property.agent.photo) {
        agentPhoto.src = property.agent.photo;
      } else {
        agentPhoto.style.display = 'none';
      }
    } else {
      document.querySelector('.agent-card').innerHTML = '<p data-i18n="naia">No agent information available</p>';
    }

    const propertyHero = document.getElementById('propertyHero');
    if (property.image) {
      propertyHero.style.backgroundImage = `url('${property.image}')`;
      propertyHero.innerHTML = `
        <div class="hero-overlay">
          <h1>${property.title}</h1>
          <p>${property.location}</p>
        </div>
      `;
    } else {
      propertyHero.innerHTML = '<div class="no-image" data-i18n="nia">No Image Available</div>';
    }

    const likeBtn = document.getElementById('likeBtn');
    likeBtn.innerHTML = `<i class="${property.liked ? 'fas' : 'far'} fa-heart"></i>`;
    likeBtn.addEventListener('click', function() {
      property.liked = !property.liked;
      likeBtn.innerHTML = `<i class="${property.liked ? 'fas' : 'far'} fa-heart"></i>`;
    });
  }

  function showError(message) {
    document.querySelector('.property-hero').innerHTML = `
      <div class="error-message">
        <h3 data-i18n="elp">Error Loading Property</h3>
        <p>${message}</p>
        <button onclick="window.location.href='properties.html'" data-i18n="btp">Back to Properties</button>
      </div>
    `;
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showToast('Thank you for your message! The agent will contact you soon.');
      this.reset();
    });
  }

  function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
});