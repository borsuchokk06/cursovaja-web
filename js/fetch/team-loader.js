document.addEventListener('DOMContentLoaded', function() {
  const teamContainer = document.getElementById('teamContainer');
  const maxDisplay = 3; 

  fetch('../../db/team.json')
    .then(response => response.json())
    .then(data => {
      const displayedMembers = data.slice(0, maxDisplay);

      displayedMembers.forEach(member => {
        const memberHTML = `
          <div class="team-member">
            <img src="${member.image}" alt="${member.name}">
            <h3>${member.name}</h3>
            <p class="position">${member.position}</p>
            <p class="bio">${member.bio}</p>
          </div>
        `;
        teamContainer.insertAdjacentHTML('beforeend', memberHTML);
      });
    })
    .catch(error => {
      console.error('Error loading team data:', error);
      teamContainer.innerHTML = '<p>Unable to load team members at this time.</p>';
    });
});