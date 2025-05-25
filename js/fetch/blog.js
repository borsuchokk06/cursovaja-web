document.addEventListener('DOMContentLoaded', function () {
  const blogGrid = document.getElementById('blogGrid');
  const paginationContainer = document.getElementById('pagination');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortBy = document.getElementById('sortBy');
  
  const articlesPerPage = 9;
  let currentPage = 1;
  let blogArticles = [];
  let filteredArticles = [];

  blogGrid.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading articles...</p>
    </div>
  `;

  fetch('http://localhost:3000/articles')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load articles');
      return response.json();
    })
    .then(data => {
      blogArticles = data;
      filteredArticles = [...blogArticles];
      
      // Initialize controls
      initCategoryFilter();
      initEventListeners();
      
      renderArticles(currentPage);
      renderPagination();
    })
    .catch(error => {
      console.error('Error fetching articles:', error);
      blogGrid.innerHTML = `
        <div class="error-message">
          <h3>Unable to load blog articles</h3>
          <p>${error.message}</p>
        </div>
      `;
    });

  function initCategoryFilter() {
    // Get unique categories
    const categories = [...new Set(blogArticles.map(article => article.category))];
    
    // Populate category filter
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  function initEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') applyFilters();
    });
    
    // Filter and sort changes
    categoryFilter.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', applyFilters);
  }

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortValue = sortBy.value;
    
    // Apply filters
    filteredArticles = blogArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm) || 
                          article.excerpt.toLowerCase().includes(searchTerm) ||
                          article.content.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    // Apply sorting
    sortArticles(sortValue);
    
    // Reset to first page
    currentPage = 1;
    renderArticles(currentPage);
    renderPagination();
  }

  function sortArticles(sortValue) {
    const [sortField, sortDirection] = sortValue.split('-');
    
    filteredArticles.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }

  function renderArticles(page) {
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = filteredArticles.slice(startIndex, endIndex);

    if (articlesToShow.length === 0) {
      blogGrid.innerHTML = `
        <div class="no-results">
          <h3>No articles found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      `;
      return;
    }

    blogGrid.innerHTML = articlesToShow.map(article => `
      <article class="blog-card">
        <div class="blog-image">
          <img src="${article.image}" alt="${article.title}">
        </div>
        <div class="blog-content">
          <span class="blog-date">${article.date} • ${article.category}</span>
          <h3 class="blog-title">${article.title}</h3>
          <p class="blog-excerpt">${article.excerpt}</p>
          <a href="article.html?id=${article.id}" class="read-more">Read More</a>
        </div>
      </article>
    `).join('');
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;

    let paginationHTML = '<div class="pagination-wrapper">';

    paginationHTML += `
      <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
        &laquo; Prev
      </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `
        <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    }

    paginationHTML += `
      <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
        Next &raquo;
      </button>
    `;

    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;

    document.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const page = parseInt(this.getAttribute('data-page'));
        if (page !== currentPage && page >= 1 && page <= totalPages) {
          currentPage = page;
          renderArticles(currentPage);
          window.scrollTo({ top: blogGrid.offsetTop - 100, behavior: 'smooth' });
        }
      });
    });
  }
});