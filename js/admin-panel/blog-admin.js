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
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    
    form.innerHTML = `
      <div class="form-group">
        <label data-i18n="articleTitle">Заголовок:</label>
        <input type="text" name="title" required>
      </div>
      <div class="form-group">
        <label data-i18n="articleCategory">Категория:</label>
        <input type="text" name="category" required>
      </div>
      <div class="form-group">
        <label data-i18n="articleImage">Изображение URL:</label>
        <input type="text" name="image" required>
      </div>
      <div class="form-group">
        <label data-i18n="articleDate">Дата:</label>
        <input type="date" name="date" required>
      </div>
      <div class="form-group">
        <label data-i18n="articleExcerpt">Отрывок:</label>
        <textarea name="excerpt" required></textarea>
      </div>
      <div class="form-group">
        <label data-i18n="articleContent">Содержание:</label>
        <textarea name="content" rows="6" required></textarea>
      </div>
      <button type="submit" class="admin-btn" data-i18n="addArticleButton">Добавить статью</button>
    `;

    applyTranslationsToElement(form);
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

        alert(getTranslation('articleAdded'));
        document.getElementById('addArticleModal').style.display = 'none';
        window.location.reload();
      } catch (error) {
        alert(getTranslation('errorAddingArticle') + ' ' + error.message);
      }
    });
  }

  async function showDeleteListModal() {
    const modal = document.getElementById('deleteArticleListModal');
    const listContainer = document.getElementById('articleDeleteList');
    listContainer.innerHTML = `<p>${getTranslation('loadingArticles')}</p>`;
    modal.style.display = 'block';

    try {
      const response = await fetch('http://localhost:3000/articles');
      if (!response.ok) throw new Error('Failed to fetch articles');

      const articles = await response.json();
      listContainer.innerHTML = '';

      articles.forEach(article => {
        const item = document.createElement('div');
        item.className = 'delete-item';
        item.innerHTML = `
          <span>${article.title}</span>
          <button data-id="${article.id}" data-i18n="deleteArticle">Delete</button>
        `;

        applyTranslationsToElement(item);

        item.querySelector('button').addEventListener('click', async () => {
          if (!confirm(`${getTranslation('confirmDeleteArticle')} "${article.title}"?`)) return;
          try {
            const delRes = await fetch(`http://localhost:3000/articles/${article.id}`, {
              method: 'DELETE',
            });
            if (!delRes.ok) throw new Error('Delete failed');
            alert(getTranslation('articleDeleted'));
            item.remove();
          } catch (error) {
            alert(getTranslation('errorDeletingArticle') + ' ' + error.message);
          }
        });

        listContainer.appendChild(item);
      });
    } catch (error) {
      listContainer.innerHTML = `<p>${getTranslation('errorLoadingArticles')} ${error.message}</p>`;
    }
  }

  function addDeleteButtons() {
    document.querySelectorAll('.blog-card').forEach(card => {
      const articleId = card.querySelector('a').href.split('id=')[1];

      const existingBtn = card.querySelector('.delete-btn');
      if (existingBtn) existingBtn.remove();
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.setAttribute('data-i18n', 'deleteArticle');
      deleteBtn.setAttribute('aria-label', getTranslation('deleteArticle'));
      
      deleteBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(getTranslation('deleteArticleConfirm'))) {
          deleteArticle(articleId);
        }
      };
      
      card.querySelector('.blog-content').appendChild(deleteBtn);
      applyTranslationsToElement(deleteBtn);
    });
  }

  async function deleteArticle(id) {
    try {
      const response = await fetch(`http://localhost:3000/articles/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete article');

      alert(getTranslation('articleDeleted'));
      window.location.reload();
    } catch (error) {
      alert(getTranslation('errorDeletingArticle') + ' ' + error.message);
    }
  }

  function getTranslation(key) {
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    return translations[currentLang] && translations[currentLang][key] 
      ? translations[currentLang][key] 
      : key;
  }

  function applyTranslationsToElement(element) {
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    const elementToProcess = element.nodeType ? element : document.createElement('div');
    if (!element.nodeType) {
      elementToProcess.innerHTML = element;
    }
    
    elementToProcess.querySelectorAll('[data-i18n]').forEach(el => {
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
    
    if (!element.nodeType) {
      return elementToProcess.innerHTML;
    }
  }

  if (typeof renderArticles === 'function') {
    const originalRenderArticles = renderArticles;
    renderArticles = function (page) {
      originalRenderArticles(page);
      if (document.getElementById('blogAdminControls')) {
        setTimeout(() => {
          addDeleteButtons();
        }, 100);
      }
    };
  }

  document.addEventListener('languageChanged', () => {
    if (isAdmin) {
      const addModal = document.getElementById('addArticleModal');
      if (addModal && addModal.style.display === 'block') {
        applyTranslationsToElement(document.getElementById('articleForm'));
      }
      
      const deleteListModal = document.getElementById('deleteArticleListModal');
      if (deleteListModal && deleteListModal.style.display === 'block') {
        applyTranslationsToElement(document.getElementById('articleDeleteList'));
      }

      addDeleteButtons();
    }
  });
});