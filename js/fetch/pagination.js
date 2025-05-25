document.addEventListener('DOMContentLoaded', function() {
  const propertiesPerPage = 10;
  let currentPage = 1;
  let allProperties = [];
  
  const propertiesContainer = document.getElementById('properties');
  const paginationContainer = document.getElementById('pagination');

propertiesContainer.innerHTML = `
  <div class="loading-state">
    <div class="spinner"></div>
    <p>Loading properties...</p>
  </div>
`;

fetch('http://localhost:3000/properties')  
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(properties => {
    if (!Array.isArray(properties)) throw new Error('Invalid properties format');
    allProperties = properties;
    renderProperties(currentPage);
    renderPagination();
  })
  .catch(error => {
    console.error('Error loading properties:', error);
    propertiesContainer.innerHTML = `
      <div class="error-message">
        <h3>Error Loading Properties</h3>
        <p>${error.message}</p>
        <button onclick="window.location.reload()">Try Again</button>
      </div>
    `;
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

  function renderProperties(page) {
    const startIndex = (page - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const pageProperties = allProperties.slice(startIndex, endIndex);
    
    propertiesContainer.innerHTML = `
      <div class="property-grid">
        ${pageProperties.map(property => `
          <div class="property-card" data-id="${property.id}">
            <div class="property-image-container">
              <img src="" alt="${property.title}" data-src="${property.image}">
              <div class="like-icon">
                <i class="${property.liked ? 'fas' : 'far'} fa-heart"></i>
              </div>
            </div>
            <div class="card-body">
              <h3>${property.title}</h3>
              <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
              <div class="features">
                <span><i class="fas fa-bed"></i> ${property.beds}</span>
                <span><i class="fas fa-bath"></i> ${property.baths}</span>
                <span><i class="fas fa-car"></i> ${property.parking}</span>
              </div>
              <div class="card-footer">
                <span class="price">$${property.price.toLocaleString()}</span>
                <button class="btn-view" data-id="${property.id}">View Details</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.querySelectorAll('.property-image-container img').forEach(img => {
      setImageIfExists(img, img.getAttribute('data-src'));
    });

    document.querySelectorAll('.btn-view').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const propertyId = this.getAttribute('data-id');
        navigateToPropertyDetails(propertyId);
      });
    });

    document.querySelectorAll('.property-card').forEach(card => {
      card.addEventListener('click', function(e) {
        if (!e.target.closest('.btn-view') && !e.target.closest('.like-icon')) {
          const propertyId = this.getAttribute('data-id');
          navigateToPropertyDetails(propertyId);
        }
      });
    });
  }

  function navigateToPropertyDetails(propertyId) {
    sessionStorage.setItem('lastPropertiesPage', currentPage);
    window.location.href = `property-details.html?id=${propertyId}`;
  }

function renderPagination() {
  const pageCount = Math.ceil(allProperties.length / propertiesPerPage);
  if (pageCount <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let paginationHTML = '<div class="pagination-wrapper">';

  paginationHTML += `
    <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
      &laquo; Prev
    </button>
  `;

  for (let i = 1; i <= pageCount; i++) {
    paginationHTML += `
      <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  paginationHTML += `
    <button class="pagination-btn" ${currentPage === pageCount ? 'disabled' : ''} data-page="${currentPage + 1}">
      Next &raquo;
    </button>
  `;

  paginationHTML += '</div>';
  paginationContainer.innerHTML = paginationHTML;

  document.querySelectorAll('.pagination-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const page = parseInt(this.getAttribute('data-page'));
      if (page !== currentPage && page >= 1 && page <= pageCount) {
        currentPage = page;
        renderProperties(currentPage);
        renderPagination();
        window.scrollTo({ top: propertiesContainer.offsetTop - 100, behavior: 'smooth' });
      }
    });
  });
}


  const lastPage = sessionStorage.getItem('lastPropertiesPage');
  if (lastPage) {
    currentPage = parseInt(lastPage);
    sessionStorage.removeItem('lastPropertiesPage');
  }

if (localStorage.getItem('admin') === 'true') {
  document.getElementById('adminControls').style.display = 'block';

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.style.display = 'inline-block';
  logoutBtn.textContent = 'Exit Admin';
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('admin');
    window.location.reload();
  });
}
});