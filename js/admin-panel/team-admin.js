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
        addModal.style.display = 'none';
        deleteListModal.style.display = 'none';
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
    form.innerHTML = `
    <div class="form-group"><label>Name:</label><input type="text" name="name" required></div>
    <div class="form-group"><label>Position:</label><input type="text" name="position" required></div>
    <div class="form-group"><label>Bio:</label><textarea name="bio" rows="3" required></textarea></div>
    <div class="form-group"><label>Image URL:</label><input type="text" name="image" required></div>
    <button type="submit" class="admin-btn">Add Member</button>
    `;

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
        alert('Team member added!');
        document.getElementById('addTeamModal').style.display = 'none';
        window.location.reload();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  }

  async function showDeleteListModal() {
    const modal = document.getElementById('deleteTeamListModal');
    const listContainer = document.getElementById('teamDeleteList');
    listContainer.innerHTML = '<p>Loading...</p>';
    modal.style.display = 'block';

    try {
      const res = await fetch('http://localhost:3000/team');
      if (!res.ok) throw new Error('Failed to fetch team');
      const team = await res.json();
      listContainer.innerHTML = '';

      team.forEach(member => {
        const item = document.createElement('div');
        item.className = 'delete-item';
        item.innerHTML = `<span>${member.name}</span><button data-id="${member.id}">Delete</button>`;

        item.querySelector('button').addEventListener('click', async () => {
          if (!confirm(`Delete ${member.name}?`)) return;
          try {
            const delRes = await fetch(`http://localhost:3000/team/${member.id}`, {
              method: 'DELETE',
            });
            if (!delRes.ok) throw new Error('Delete failed');
            alert('Deleted!');
            item.remove();
          } catch (err) {
            alert('Error: ' + err.message);
          }
        });

        listContainer.appendChild(item);
      });
    } catch (err) {
      listContainer.innerHTML = `<p>Error: ${err.message}</p>`;
    }
  }
});
