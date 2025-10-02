document.addEventListener('DOMContentLoaded', () => {
  const adminControls = document.getElementById('adminControls');
  if (adminControls && localStorage.getItem('role') === 'admin') {
    adminControls.style.display = 'block';
  }

  if (adminControls && adminControls.style.display !== 'none') {
    initAdminTeamControls();
  }

  function initAdminTeamControls() {
    const addModal = document.getElementById('addTeamModal');
    const deleteListModal = document.getElementById('deleteTeamListModal');

    document.getElementById('addTeamMemberBtn').addEventListener('click', showAddModal);
    document.getElementById('openDeleteTeamListBtn').addEventListener('click', showDeleteListModal);

    document.querySelectorAll('.close').forEach(btn => {
      btn.addEventListener('click', () => {
        if (addModal) addModal.style.display = 'none';
        if (deleteListModal) deleteListModal.style.display = 'none';
      });
    });

    window.addEventListener('click', e => {
      if ([addModal, deleteListModal].includes(e.target)) {
        e.target.style.display = 'none';
      }
    });

    initAddTeamForm();
  }

  function showAddModal() {
    const form = document.getElementById('teamMemberForm');
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    
    form.innerHTML = `
      <div class="form-group">
        <label data-i18n="teamMemberName">Name:</label>
        <input type="text" name="name" required>
      </div>
      <div class="form-group">
        <label data-i18n="teamMemberPosition">Position:</label>
        <input type="text" name="position" required>
      </div>
      <div class="form-group">
        <label data-i18n="teamMemberBio">Bio:</label>
        <textarea name="bio" rows="3" required></textarea>
      </div>
      <div class="form-group">
        <label data-i18n="teamMemberImage">Image URL:</label>
        <input type="text" name="image" required>
      </div>
      <button type="submit" class="admin-btn" data-i18n="addMemberButton">Add Member</button>
    `;

    applyTranslationsToElement(form);
    document.getElementById('addTeamModal').style.display = 'block';
  }

  function initAddTeamForm() {
    const form = document.getElementById('teamMemberForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const memberData = {
        name: formData.get('name'),
        position: formData.get('position'),
        bio: formData.get('bio'),
        image: formData.get('image')
      };

      try {
        const res = await fetch('http://localhost:3000/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData)
        });

        if (!res.ok) throw new Error('Failed to add member');
        
        alert(getTranslation('memberAdded'));
        document.getElementById('addTeamModal').style.display = 'none';
        window.location.reload();
      } catch (err) {
        alert(getTranslation('errorAddingMember') + ' ' + err.message);
      }
    });
  }

  async function showDeleteListModal() {
    const modal = document.getElementById('deleteTeamListModal');
    const listContainer = document.getElementById('teamDeleteList');
    listContainer.innerHTML = `<p>${getTranslation('loadingTeam')}</p>`;
    modal.style.display = 'block';

    try {
      const res = await fetch('http://localhost:3000/team');
      if (!res.ok) throw new Error('Failed to fetch team');
      
      const team = await res.json();
      listContainer.innerHTML = '';

      team.forEach(member => {
        const item = document.createElement('div');
        item.className = 'delete-item';
        item.innerHTML = `
          <span>${member.name}</span>
          <button data-id="${member.id}" data-i18n="deleteMember">Delete</button>
        `;

        applyTranslationsToElement(item);

        item.querySelector('button').addEventListener('click', async () => {
          if (!confirm(`${getTranslation('confirmDeleteMember')} "${member.name}"?`)) return;
          
          try {
            const delRes = await fetch(`http://localhost:3000/team/${member.id}`, {
              method: 'DELETE',
            });
            
            if (!delRes.ok) throw new Error('Delete failed');
            
            alert(getTranslation('memberDeleted'));
            item.remove();
          } catch (err) {
            alert(getTranslation('errorDeletingMember') + ' ' + err.message);
          }
        });

        listContainer.appendChild(item);
      });
    } catch (err) {
      listContainer.innerHTML = `<p>${getTranslation('errorLoadingTeam')} ${err.message}</p>`;
    }
  }

  function getTranslation(key) {
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    return translations && translations[currentLang] && translations[currentLang][key] 
      ? translations[currentLang][key] 
      : key;
  }

  function applyTranslationsToElement(element) {
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';

    const translationData = typeof translations !== 'undefined' ? translations : window.translations;
    
    if (!translationData || !translationData[currentLang]) return;
    
    element.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translationData[currentLang] && translationData[currentLang][key]) {
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
          el.placeholder = translationData[currentLang][key];
        } else if (el.tagName === 'BUTTON' || el.tagName === 'LABEL') {
          el.textContent = translationData[currentLang][key];
        } else {
          el.textContent = translationData[currentLang][key];
        }
      }
    });
  }

  function addDeleteButtonsToTeamCards() {
    document.querySelectorAll('.team-card').forEach(card => {
      const memberId = card.getAttribute('data-id') || card.closest('[data-id]')?.getAttribute('data-id');
      
      if (!memberId) return;

      const existingBtn = card.querySelector('.delete-btn');
      if (existingBtn) existingBtn.remove();
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.setAttribute('data-i18n', 'deleteMember');
      deleteBtn.setAttribute('aria-label', getTranslation('deleteMember'));
      
      deleteBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(getTranslation('deleteMemberConfirm'))) {
          deleteTeamMember(memberId);
        }
      };
      
      card.appendChild(deleteBtn);
      applyTranslationsToElement(deleteBtn);
    });
  }

  async function deleteTeamMember(id) {
    try {
      const response = await fetch(`http://localhost:3000/team/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete team member');

      alert(getTranslation('memberDeleted'));
      window.location.reload();
    } catch (error) {
      alert(getTranslation('errorDeletingMember') + ' ' + error.message);
    }
  }

  document.addEventListener('languageChanged', () => {
    if (adminControls && adminControls.style.display !== 'none') {
      const addModal = document.getElementById('addTeamModal');
      if (addModal && addModal.style.display === 'block') {
        applyTranslationsToElement(document.getElementById('teamMemberForm'));
      }
      
      const deleteListModal = document.getElementById('deleteTeamListModal');
      if (deleteListModal && deleteListModal.style.display === 'block') {
        applyTranslationsToElement(document.getElementById('teamDeleteList'));
      }

      addDeleteButtonsToTeamCards();
    }
  });

  setTimeout(() => {
    if (adminControls && adminControls.style.display !== 'none') {
      addDeleteButtonsToTeamCards();
    }
  }, 500);
});