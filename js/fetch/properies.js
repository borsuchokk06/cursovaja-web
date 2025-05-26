document.addEventListener('DOMContentLoaded', function () {
fetch('http://localhost:3000/properties')
  .then(response => response.json())
  .then(properties => {
    const container = document.getElementById('properties');

    container.innerHTML = `
      <div class="section-title">
        <div>
                <span class="highlight" data-i18n="popular">Popular</span>
                <p data-i18n="properties">Properties</p>
        </div>
        <a class="view-all" href="properties.html" data-i18n="viewAll">View all</a>
      </div>
      <div class="property-grid">
        ${properties.map(p => `
          <div class="property-card">
            <img src="${p.image}" alt="${p.title}">
            <div class="card-body">
              <h3>${p.title}</h3>
              <p class="location"><i class="fas fa-map-marker-alt"></i> ${p.location}</p>
              <div class="features">
                <span><i class="fas fa-bed"></i> ${p.beds}</span>
                <span><i class="fas fa-bath"></i> ${p.baths}</span>
                <span><i class="fas fa-car"></i> ${p.parking}</span>
              </div>
              <div class="card-footer">
                <span class="price">$${p.price.toFixed(2)}</span>
                <button class="btn-view"><a href="properties.html" data-i18n="viewDetails">View Details</a></button>
              </div>
              <div class="like-icon">
                <i class="${p.liked ? 'fas' : 'far'} fa-heart"></i>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  })
  .catch(error => {
    console.error('Ошибка загрузки данных:', error);
  })
})
