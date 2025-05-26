document.addEventListener('DOMContentLoaded', function() {
  const propertiesPerPage = 10;
  let currentPage = 1;
  let allProperties = [];
  let filteredProperties = [];
  
  const propertiesContainer = document.getElementById('properties');
  const paginationContainer = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const locationFilter = document.getElementById('locationFilter');
  const sortBy = document.getElementById('sortBy');

  propertiesContainer.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p data-i18n="lpro">Loading properties...</p>
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
      filteredProperties = [...allProperties];

      initLocationFilter();
      initEventListeners();
      
      renderProperties(currentPage);
      renderPagination();
    })
    .catch(error => {
      console.error('Error loading properties:', error);
      propertiesContainer.innerHTML = `
        <div class="error-message">
          <h3 data-i18n="elpr">Error Loading Properties</h3>
          <p>${error.message}</p>
          <button onclick="window.location.reload()" data-i18n="ta">Try Again</button>
        </div>
      `;
    });

  function initLocationFilter() {
    if (!locationFilter) return;

    const locations = [...new Set(allProperties.map(property => property.location))];

    locations.forEach(location => {
      const option = document.createElement('option');
      option.value = location;
      option.textContent = location;
      locationFilter.appendChild(option);
    });
  }

  function initEventListeners() {
    if (searchBtn) searchBtn.addEventListener('click', applyFilters);
    if (searchInput) searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') applyFilters();
    });

    if (locationFilter) locationFilter.addEventListener('change', applyFilters);
    if (sortBy) sortBy.addEventListener('change', applyFilters);
  }

  function applyFilters() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedLocation = locationFilter ? locationFilter.value : '';
    const sortValue = sortBy ? sortBy.value : 'price-desc';

    filteredProperties = allProperties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm) || 
                          property.location.toLowerCase().includes(searchTerm) ||
                          property.description.toLowerCase().includes(searchTerm);
      
      const matchesLocation = !selectedLocation || property.location === selectedLocation;
      
      return matchesSearch && matchesLocation;
    });

    sortProperties(sortValue);

    currentPage = 1;
    renderProperties(currentPage);
    renderPagination();
  }

  function sortProperties(sortValue) {
    const [sortField, sortDirection] = sortValue.split('-');
    
    filteredProperties.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'beds') {
        comparison = a.beds - b.beds;
      } else if (sortField === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }

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
    const pageProperties = filteredProperties.slice(startIndex, endIndex);

    if (pageProperties.length === 0) {
      propertiesContainer.innerHTML = `
        <div class="no-results">
          <h3 data-i18n="npf">No properties found</h3>
          <p data-i18n="tay">Try adjusting your search or filters</p>
        </div>
      `;
      return;
    }
    
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
                <button class="btn-view" data-id="${property.id}" data-i18n="viewDetails">View Details</button>
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
    const pageCount = Math.ceil(filteredProperties.length / propertiesPerPage);
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