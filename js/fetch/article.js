document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  if (!articleId) {
    window.location.href = 'blog.html';
    return;
  }

  const articleUrl = `http://localhost:3000/articles/${articleId}`;
  const recentPostsUrl = `http://localhost:3000/articles?_limit=3&_sort=date&_order=desc&id_ne=${articleId}`;

  const articleTitle = document.getElementById('articleTitle');
  const articleDate = document.getElementById('articleDate');
  const articleCategory = document.getElementById('articleCategory');
  const articleImage = document.getElementById('articleImage');
  const articleText = document.getElementById('articleText');
  const recentPostsContainer = document.querySelector('.recent-posts');

  articleText.innerHTML = `<p data-i18n="larts">Loading article...</p>`;

  fetch(articleUrl)
    .then(response => {
      if (!response.ok) throw new Error('Article not found');
      return response.json();
    })
    .then(article => {
      articleTitle.textContent = article.title;
      articleDate.textContent = article.date;
      articleCategory.textContent = article.category;
      articleImage.src = article.image;
      articleImage.alt = article.title;
      articleText.innerHTML = article.content;
    })
    .catch(error => {
      console.error('Error loading article:', error);
      articleText.innerHTML = `<p class="error">Could not load article. <a href="blog.html">Return to blog</a></p>`;
    });

  fetch(recentPostsUrl)
    .then(response => response.json())
    .then(posts => {
      recentPostsContainer.innerHTML = posts.map(post => `
        <div class="recent-post">
          <img src="${post.image}" alt="${post.title}">
          <div class="recent-post-content">
            <h4><a href="article.html?id=${post.id}">${post.title}</a></h4>
            <span>${post.date}</span>
          </div>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Error loading recent posts:', error);
      recentPostsContainer.innerHTML = `<p class="error">Unable to load recent posts</p>`;
    });
});
