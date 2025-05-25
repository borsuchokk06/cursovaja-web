document.addEventListener('DOMContentLoaded', () => {
  const currentUserRaw = localStorage.getItem('currentUser');
  const adminControls = document.getElementById('adminControls');
  const addArticleBtn = document.getElementById('addArticleBtn');
  const openDeleteArticleListBtn = document.getElementById('openDeleteArticleListBtn');
  
  let isAdmin = false;
  
  if (currentUserRaw) {
    const currentUser = JSON.parse(currentUserRaw);
    isAdmin = currentUser.role === 'admin';
  }

    if (isAdmin) {
    if (adminControls) adminControls.style.display = 'block';
    if (addArticleBtn) addArticleBtn.style.display = 'inline-block';
    if (openDeleteArticleListBtn) openDeleteArticleListBtn.style.display = 'inline-block';
    
    initBlogAdminControls();
  } else {
    if (adminControls) adminControls.style.display = 'none';
    if (addArticleBtn) addArticleBtn.style.display = 'none';
    if (openDeleteArticleListBtn) openDeleteArticleListBtn.style.display = 'none';
  }

  function initBlogAdminControls() {
    const addModal = document.getElementById('addArticleModal');
    const deleteListModal = document.getElementById('deleteArticleListModal');

    // Ensure buttons exist before adding event listeners
    if (addArticleBtn) {
      addArticleBtn.addEventListener('click', showAddModal);
    }
    
    if (openDeleteArticleListBtn) {
      openDeleteArticleListBtn.addEventListener('click', showDeleteListModal);
    }

    document.querySelectorAll('#addArticleModal .close, #deleteArticleListModal .close').forEach(btn => {
      btn.addEventListener('click', () => {
        if (addModal) addModal.style.display = 'none';
        if (deleteListModal) deleteListModal.style.display = 'none';
      });
    });

    window.addEventListener('click', e => {
      if (e.target === addModal || e.target === deleteListModal) {
        e.target.style.display = 'none';
      }
    });

    initAddForm();
  }

  function showAddModal() {
    const form = document.getElementById('articleForm');
    form.innerHTML = `
      <div class="form-group"><label>Title:</label><input type="text" name="title" required></div>
      <div class="form-group"><label>Category:</label><input type="text" name="category" required></div>
      <div class="form-group"><label>Image URL:</label><input type="text" name="image" required></div>
      <div class="form-group"><label>Date:</label><input type="date" name="date" required></div>
      <div class="form-group"><label>Excerpt:</label><textarea name="excerpt" required></textarea></div>
      <div class="form-group"><label>Content:</label><textarea name="content" rows="6" required></textarea></div>
      <button type="submit" class="admin-btn">Add Article</button>
    `;
    document.getElementById('addArticleModal').style.display = 'block';
  }

  function initAddForm() {
    const form = document.getElementById('articleForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const articleData = {
        title: formData.get('title'),
        category: formData.get('category'),
        image: formData.get('image'),
        date: formData.get('date'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        author: localStorage.getItem('username') || 'Admin'
      };

      try {
        const response = await fetch('http://localhost:3000/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });

        if (!response.ok) throw new Error('Failed to add article');

        alert('Article added successfully!');
        document.getElementById('addArticleModal').style.display = 'none';
        window.location.reload();
      } catch (error) {
        alert('Error adding article: ' + error.message);
      }
    });
  }

  async function showDeleteListModal() {
    const modal = document.getElementById('deleteArticleListModal');
    const listContainer = document.getElementById('articleDeleteList');
    listContainer.innerHTML = '<p>Loading...</p>';
    modal.style.display = 'block';

    try {
      const response = await fetch('http://localhost:3000/articles');
      if (!response.ok) throw new Error('Failed to fetch articles');

      const articles = await response.json();
      listContainer.innerHTML = '';

      articles.forEach(article => {
        const item = document.createElement('div');
        item.className = 'delete-item';
        item.innerHTML = `<span>${article.title}</span><button data-id="${article.id}">Delete</button>`;

        item.querySelector('button').addEventListener('click', async () => {
          if (!confirm(`Are you sure you want to delete "${article.title}"?`)) return;
          try {
            const delRes = await fetch(`http://localhost:3000/articles/${article.id}`, {
              method: 'DELETE',
            });
            if (!delRes.ok) throw new Error('Delete failed');
            alert('Article deleted successfully!');
            item.remove();
          } catch (error) {
            alert('Error deleting article: ' + error.message);
          }
        });

        listContainer.appendChild(item);
      });
    } catch (error) {
      listContainer.innerHTML = `<p>Error loading articles: ${error.message}</p>`;
    }
  }

  function addDeleteButtons() {
    document.querySelectorAll('.blog-card').forEach(card => {
      const articleId = card.querySelector('a').href.split('id=')[1];
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Delete this article?')) {
          deleteArticle(articleId);
        }
      };
      card.querySelector('.blog-content').appendChild(deleteBtn);
    });
  }

  async function deleteArticle(id) {
    try {
      const response = await fetch(`http://localhost:3000/articles/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete article');

      alert('Article deleted successfully!');
      window.location.reload();
    } catch (error) {
      alert('Error deleting article: ' + error.message);
    }
  }

  if (typeof renderArticles === 'function') {
    const originalRenderArticles = renderArticles;
    renderArticles = function (page) {
      originalRenderArticles(page);
      if (document.getElementById('blogAdminControls')) {
        addDeleteButtons();
      }
    };
  }
});