document.addEventListener('DOMContentLoaded', function () {
  const teamPreviewContainer = document.getElementById('teamContainer');
  const teamFullContainer = document.getElementById('fullTeamContainer');
  const paginationContainer = document.getElementById('pagination');
  const previewLimit = 3;
  const perPage = 6;
  let currentPage = 1;
  let teamData = [];

  fetch('http://localhost:3000/team')
    .then(res => res.json())
    .then(team => {
      if (!Array.isArray(team)) throw new Error('Invalid team data format');
      teamData = team;

      if (teamPreviewContainer) {
        const preview = team.slice(0, previewLimit);
        preview.forEach(member => {
          teamPreviewContainer.insertAdjacentHTML('beforeend', createMemberHTML(member));
        });
      }

      if (teamFullContainer) {
        renderTeamPage(currentPage);
        renderPagination();
      }
    })
    .catch(error => {
      console.error('Error loading team data:', error);
      const errorHTML = '<p>Unable to load team members at this time.</p>';
      if (teamPreviewContainer) teamPreviewContainer.innerHTML = errorHTML;
      if (teamFullContainer) teamFullContainer.innerHTML = errorHTML;
    });

  function renderTeamPage(page) {
    if (!teamFullContainer) return;

    teamFullContainer.innerHTML = '';
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const membersToShow = teamData.slice(start, end);

    membersToShow.forEach(member => {
      teamFullContainer.insertAdjacentHTML('beforeend', createMemberHTML(member));
    });
  }

  function renderPagination() {
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(teamData.length / perPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = (i === currentPage) ? 'active' : '';
      btn.addEventListener('click', () => {
        currentPage = i;
        renderTeamPage(currentPage);
        renderPagination();
      });
      paginationContainer.appendChild(btn);
    }
  }

  function createMemberHTML(member) {
    return `
      <div class="team-member">
        <img src="${member.image}" alt="${member.name}">
        <h3>${member.name}</h3>
        <p class="position">${member.position}</p>
        <p class="bio">${member.bio}</p>
      </div>
    `;
  }
});
