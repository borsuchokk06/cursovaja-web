document.addEventListener('DOMContentLoaded', function () {
  const blogGrid = document.getElementById('blogGrid');
  const paginationContainer = document.getElementById('pagination');
  const articlesPerPage = 9;
  let currentPage = 1;
  let blogArticles = [];

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

  function renderArticles(page) {
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = blogArticles.slice(startIndex, endIndex);

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
    const totalPages = Math.ceil(blogArticles.length / articlesPerPage);
    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

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
          renderPagination();
          window.scrollTo({ top: blogGrid.offsetTop - 100, behavior: 'smooth' });
        }
      });
    });
  }
});
