fetch('../../db.json') 
  .then(response => response.json())
  .then(data => {
    const properties = data.properties;  
    const container = document.getElementById('properties');

    container.innerHTML = `
      <h2 class="section-title">
        <span class="highlight">Popular</span> Properties
        <a class="view-all" href="#">View all</a>
      </h2>
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
                <button class="btn-view">View Details</button>
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
  });
