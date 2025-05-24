document.addEventListener('DOMContentLoaded', function() {

  const propertiesPerPage = 10;
  let currentPage = 1;
  let allProperties = [];

  const propertiesContainer = document.getElementById('properties');
  const paginationContainer = document.getElementById('pagination');

  fetch('../../db.json')
    .then(response => response.json())
    .then(data => {
      allProperties = data.properties;
      renderProperties(currentPage);
      renderPagination();
    })
    .catch(error => {
      console.error('Error loading properties:', error);
      propertiesContainer.innerHTML = '<p>Error loading properties. Please try again later.</p>';
    });

  function renderProperties(page) {
    const startIndex = (page - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const pageProperties = allProperties.slice(startIndex, endIndex);
    
    propertiesContainer.innerHTML = `
      <div class="property-grid">
        ${pageProperties.map(property => `
          <div class="property-card">
            <img src="${property.image}" alt="${property.title}">
            <div class="card-body">
              <h3>${property.title}</h3>
              <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
              <div class="features">
                <span><i class="fas fa-bed"></i> ${property.beds}</span>
                <span><i class="fas fa-bath"></i> ${property.baths}</span>
                <span><i class="fas fa-car"></i> ${property.parking}</span>
              </div>
              <div class="card-footer">
                <span class="price">$${property.price.toFixed(2)}</span>
                <button class="btn-view">View Details</button>
              </div>
              <div class="like-icon">
                <i class="${property.liked ? 'fas' : 'far'} fa-heart"></i>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderPagination() {
    const pageCount = Math.ceil(allProperties.length / propertiesPerPage);
    let paginationHTML = '';

    paginationHTML += `
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
      </li>
    `;

    for (let i = 1; i <= pageCount; i++) {
      paginationHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }

    paginationHTML += `
      <li class="page-item ${currentPage === pageCount ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
      </li>
    `;
    
    paginationContainer.innerHTML = paginationHTML;

    document.querySelectorAll('.page-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = parseInt(this.getAttribute('data-page'));
        if (page !== currentPage) {
          currentPage = page;
          renderProperties(currentPage);
          renderPagination();
          window.scrollTo({ top: propertiesContainer.offsetTop - 100, behavior: 'smooth' });
        }
      });
    });
  }
});