document.addEventListener('DOMContentLoaded', function() {
  const teamPreviewContainer = document.getElementById('teamContainer');
  const teamFullContainer = document.getElementById('fullTeamContainer');
  const maxDisplay = 3;

  fetch('../../db.json')
    .then(response => response.json())
    .then(data => {
      const team = data.team; 
      
      if (teamPreviewContainer) {
        const previewMembers = team.slice(0, maxDisplay);
        previewMembers.forEach(member => {
          const memberHTML = createMemberHTML(member);
          teamPreviewContainer.insertAdjacentHTML('beforeend', memberHTML);
        });
      }

      if (teamFullContainer) {
        team.forEach(member => {
          const memberHTML = createMemberHTML(member);
          teamFullContainer.insertAdjacentHTML('beforeend', memberHTML);
        });
      }
    })
    .catch(error => {
      console.error('Error loading team data:', error);
      if (teamPreviewContainer) {
        teamPreviewContainer.innerHTML = '<p>Unable to load team members at this time.</p>';
      }
      if (teamFullContainer) {
        teamFullContainer.innerHTML = '<p>Unable to load team members at this time.</p>';
      }
    });

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
