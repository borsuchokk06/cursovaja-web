fetch('properties.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('properties');
    data.forEach(prop => {
      const card = document.createElement('div');
      card.className = 'property-card';
      card.innerHTML = `
        <img src="${prop.image}" alt="House">
        <div class="info">
          <h4>${prop.title}</h4>
          <small>${prop.location}</small>
          <p>$${prop.price}</p>
        </div>
      `;
      container.appendChild(card);
    });
  });
