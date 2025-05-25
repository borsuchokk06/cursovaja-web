document.addEventListener('DOMContentLoaded', function () {
  const teamPreviewContainer = document.getElementById('teamContainer'); 
  const teamFullContainer = document.getElementById('fullTeamContainer'); 
  const paginationContainer = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const positionFilter = document.getElementById('positionFilter');
  const sortBy = document.getElementById('sortBy');
  
  const previewLimit = 3; 
  const perPage = 6; 
  let currentPage = 1;
  let teamData = [];
  let filteredTeam = [];

  const showLoading = (container) => {
    if (container) {
      container.innerHTML = `
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading team members...</p>
        </div>
      `;
    }
  };

  const showError = (container, error) => {
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <h3>Unable to load team members</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  };

  const renderTeamPreview = () => {
    if (!teamPreviewContainer) return;
    
    const preview = filteredTeam.slice(0, previewLimit);
    teamPreviewContainer.innerHTML = preview.map(member => createMemberHTML(member)).join('');
  };

  const renderFullTeam = () => {
    if (!teamFullContainer) return;

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const membersToShow = filteredTeam.slice(startIndex, endIndex);

    if (membersToShow.length === 0) {
      teamFullContainer.innerHTML = `
        <div class="no-results">
          <h3>No team members found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      `;
      return;
    }

    teamFullContainer.innerHTML = membersToShow.map(member => createMemberHTML(member)).join('');
  };

  const createMemberHTML = (member) => `
    <div class="team-member">
      <img src="${member.image}" alt="${member.name}" onerror="this.src='../img/placeholder-team.jpg'">
      <h3>${member.name}</h3>
      <p class="position">${member.position}</p>
      <p class="bio">${member.bio}</p>
    </div>
  `;

  const initPositionFilter = () => {
    if (!positionFilter) return;
    
    positionFilter.innerHTML = '<option value="">All Positions</option>';
    const positions = [...new Set(teamData.map(member => member.position))];
    
    positions.forEach(position => {
      const option = document.createElement('option');
      option.value = position;
      option.textContent = position;
      positionFilter.appendChild(option);
    });
  };

  const applyFilters = () => {
const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedPosition = positionFilter ? positionFilter.value : '';
    const sortValue = sortBy ? sortBy.value : 'name-asc';
    
    filteredTeam = teamData.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm) || 
                          member.position.toLowerCase().includes(searchTerm) ||
                          member.bio.toLowerCase().includes(searchTerm);
      
      const matchesPosition = !selectedPosition || member.position === selectedPosition;
      
      return matchesSearch && matchesPosition;
    });
    
    sortTeam(sortValue);
    currentPage = 1;
    
    if (teamPreviewContainer) renderTeamPreview();
    if (teamFullContainer) {
      renderFullTeam();
      renderPagination();
    }
  };

  const sortTeam = (sortValue) => {
    const [sortField, sortDirection] = sortValue.split('-');
    
    filteredTeam.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'position') {
        comparison = a.position.localeCompare(b.position);
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  };

  const renderPagination = () => {
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredTeam.length / perPage);
    
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = (i === currentPage) ? 'active' : '';
      btn.addEventListener('click', () => {
        currentPage = i;
        renderFullTeam();
        renderPagination();
      });
      paginationContainer.appendChild(btn);
    }
  };

  const initEventListeners = () => {
    if (searchBtn) searchBtn.addEventListener('click', applyFilters);
    if (searchInput) searchInput.addEventListener('keyup', (e) => e.key === 'Enter' && applyFilters());
    if (positionFilter) positionFilter.addEventListener('change', applyFilters);
    if (sortBy) sortBy.addEventListener('change', applyFilters);
  };

  const loadTeamData = () => {
    showLoading(teamPreviewContainer || teamFullContainer);

    fetch('http://localhost:3000/team')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(team => {
        if (!Array.isArray(team)) throw new Error('Invalid team data format');
        teamData = team;
        filteredTeam = [...teamData];
        
        initPositionFilter();
        initEventListeners();
        applyFilters();
      })
      .catch(error => {
        console.error('Error loading team data:', error);
        showError(teamPreviewContainer || teamFullContainer, error);
      });
  };

  loadTeamData();
});