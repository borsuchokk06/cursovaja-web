document.addEventListener('DOMContentLoaded', () => {
  const adminControls = document.getElementById('adminControls');

  if (adminControls && localStorage.getItem('role') === 'admin') {
    adminControls.style.display = 'block';
  }

  if (adminControls && adminControls.style.display !== 'none') {
    initAdminControls();
  }

  function initAdminControls() {
    const addModal = document.getElementById('addModal');
    const deleteModal = document.getElementById('deleteModal');
    const deleteListModal = document.getElementById('deleteListModal');

    document.getElementById('addPropertyBtn').addEventListener('click', showAddModal);
    document.getElementById('openDeleteListBtn').addEventListener('click', showDeleteListModal);

    document.querySelectorAll('.close, #cancelDeleteBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (addModal) addModal.style.display = 'none';
        if (deleteModal) deleteModal.style.display = 'none';
        if (deleteListModal) deleteListModal.style.display = 'none';
      });
    });

    window.addEventListener('click', e => {
      if ([addModal, deleteModal, deleteListModal].includes(e.target)) {
        e.target.style.display = 'none';
      }
    });

    initAddForm();
  }

  function showAddModal() {
    const form = document.getElementById('propertyForm');
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    
    form.innerHTML = `
      <div class="form-group">
        <label data-i18n="propertyTitle">Title:</label>
        <input type="text" name="title" required>
      </div>
      <div class="form-group">
        <label data-i18n="propertyLocation">Location:</label>
        <input type="text" name="location" required>
      </div>
      <div class="form-group">
        <label data-i18n="propertyImage">Image URL:</label>
        <input type="text" name="image" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label data-i18n="propertyBeds">Beds:</label>
          <input type="number" name="beds" min="1" required>
        </div>
        <div class="form-group">
          <label data-i18n="propertyBaths">Baths:</label>
          <input type="number" name="baths" min="1" required>
        </div>
        <div class="form-group">
          <label data-i18n="propertyParking">Parking:</label>
          <input type="number" name="parking" min="0" required>
        </div>
      </div>
      <div class="form-group">
        <label data-i18n="propertyPrice">Price ($):</label>
        <input type="number" name="price" min="100000" required>
      </div>
      <div class="form-group">
        <label data-i18n="propertyDescription">Description:</label>
        <textarea name="description" rows="4" required></textarea>
      </div>
      <button type="submit" class="admin-btn" data-i18n="addPropertyButton">Add Property</button>
    `;

    applyTranslationsToElement(form);
    document.getElementById('addModal').style.display = 'block';
  }

  function initAddForm() {
    const form = document.getElementById('propertyForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const propertyData = {
        title: formData.get('title'),
        location: formData.get('location'),
        image: formData.get('image'),
        beds: +formData.get('beds'),
        baths: +formData.get('baths'),
        parking: +formData.get('parking'),
        price: +formData.get('price'),
        description: formData.get('description'),
        liked: false,
        features: [],
        gallery: [],
        agent: {
          name: "Admin",
          phone: "+000000000000",
          email: "admin@example.com"
        }
      };

      try {
        const response = await fetch('http://localhost:3000/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(propertyData)
        });

        if (!response.ok) throw new Error('Failed to add property');

        alert(getTranslation('propertyAdded'));
        document.getElementById('addModal').style.display = 'none';
        window.location.reload();
      } catch (error) {
        alert(getTranslation('errorAdding') + ' ' + error.message);
      }
    });
  }

  async function showDeleteListModal() {
    const modal = document.getElementById('deleteListModal');
    const listContainer = document.getElementById('propertyDeleteList');
    listContainer.innerHTML = `<p>${getTranslation('loadingProperties')}</p>`;
    modal.style.display = 'block';

    try {
      const response = await fetch('http://localhost:3000/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');

      const properties = await response.json();
      listContainer.innerHTML = '';

      properties.forEach(property => {
        const item = document.createElement('div');
        item.className = 'delete-item';
        item.innerHTML = `
          <span>${property.title}</span>
          <button data-id="${property.id}" data-i18n="deleteProperty">Delete</button>
        `;

        applyTranslationsToElement(item);

        item.querySelector('button').addEventListener('click', async () => {
          if (!confirm(`${getTranslation('confirmDelete')} "${property.title}"?`)) return;
          try {
            const delRes = await fetch(`http://localhost:3000/properties/${property.id}`, {
              method: 'DELETE',
            });
            if (!delRes.ok) throw new Error('Delete failed');
            alert(getTranslation('propertyDeleted'));
            item.remove();
          } catch (error) {
            alert(getTranslation('errorDeleting') + ' ' + error.message);
          }
        });

        listContainer.appendChild(item);
      });
    } catch (error) {
      listContainer.innerHTML = `<p>${getTranslation('errorLoading')} ${error.message}</p>`;
    }
  }

  function addDeleteButtons() {
    document.querySelectorAll('.property-card').forEach(card => {
      const propertyId = card.getAttribute('data-id');

      const existingBtn = card.querySelector('.delete-btn');
      if (existingBtn) existingBtn.remove();
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.setAttribute('data-i18n', 'deleteProperty');
      deleteBtn.setAttribute('aria-label', getTranslation('deleteProperty'));
      
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        showDeleteModal(propertyId, card.querySelector('h3').textContent);
      };
      
      card.querySelector('.card-body').appendChild(deleteBtn);
      applyTranslationsToElement(deleteBtn);
    });
  }

  function showDeleteModal(id, title) {
    document.getElementById('propertyToDelete').textContent = title;
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';

    document.getElementById('confirmDeleteBtn').onclick = async () => {
      try {
        const response = await fetch(`http://localhost:3000/properties/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete property');

        alert(getTranslation('propertyDeleted'));
        modal.style.display = 'none';
        window.location.reload();
      } catch (error) {
        alert(getTranslation('errorDeleting') + ' ' + error.message);
      }
    };
  }

  function getTranslation(key) {
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    return translations[currentLang] && translations[currentLang][key] 
      ? translations[currentLang][key] 
      : key;
  }

  function applyTranslationsToElement(element) {
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    element.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[currentLang] && translations[currentLang][key]) {
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
          el.placeholder = translations[currentLang][key];
        } else if (el.tagName === 'BUTTON' || el.tagName === 'LABEL') {
          el.textContent = translations[currentLang][key];
        } else {
          el.textContent = translations[currentLang][key];
        }
      }
    });
  }

  if (typeof renderProperties === 'function') {
    const originalRenderProperties = renderProperties;
    renderProperties = function (page) {
      originalRenderProperties(page);
      if (document.getElementById('adminControls')) {
        setTimeout(() => {
          addDeleteButtons();
        }, 100);
      }
    };
  }

  document.addEventListener('languageChanged', () => {
    if (adminControls && adminControls.style.display !== 'none') {
      const addModal = document.getElementById('addModal');
      if (addModal && addModal.style.display === 'block') {
        applyTranslationsToElement(document.getElementById('propertyForm'));
      }
      
      const deleteListModal = document.getElementById('deleteListModal');
      if (deleteListModal && deleteListModal.style.display === 'block') {
        applyTranslationsToElement(document.getElementById('propertyDeleteList'));
      }

      addDeleteButtons();
    }
  });
});