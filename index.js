(function () {

  const detail = document.getElementById('details');
  const ul = document.getElementById('articles');
  let detailUrl = 'https://gorest.co.in/public-api/posts/';
  let templateUrl = 'https://gorest.co.in/public-api/posts?page=';
  const leftArrow = document.querySelector('.left');
  const rightArrow = document.querySelector('.right');
  let currentPage = 10;

  function showPrevPage() {
    detail.style.display = 'none';

    if(currentPage !== 1) {
      currentPage--;
    } else {
      return
    }

    showPage();
  }

  function showNextPage() {
    detail.style.display = 'none';

    if(currentPage !== 175) {
      currentPage++;
    } else {
      return
    }

    showPage();
  }

  leftArrow.addEventListener('click', showPrevPage);
  rightArrow.addEventListener('click', showNextPage);


  function createNode(element) {
    return document.createElement(element);
  }

  function append(parent, el) {
    parent.appendChild(el);
  }

  function showPageNumber(pageNumber) {
    document.querySelector('.page__number-text').textContent = pageNumber;
  }

  function showPage() {

    let url = templateUrl + currentPage.toString();
    document.querySelector('#articles').innerHTML = '';

    fetch(url)
    .then((resp) => resp.json())
    .then(function(page) {
      let articles = page.data;
      let pageNumber = page.meta.pagination.page;
  
      showPageNumber(pageNumber);
      
      articles.map(function(article) {
        let id = article.id;
        let li = createNode('li');
        let title = createNode('h2');
        let body = createNode('p');
        title.addEventListener("click", () => { openArticle(id) });
        
        title.innerHTML = `${article.title}`;
        body.innerHTML = `${article.body}`;
  
        append(li, title);
        append(li, body);
        append(ul, li);
      })
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  function openArticle(id) {

    detail.innerHTML = '';
    let url = detailUrl + id.toString();

    fetch(url)
    .then((resp) => resp.json())
    .then(function(page) {
      let article = page.data;

      let title = createNode('h1');
      let body = createNode('p');
      let exit = createNode('div');

      title.innerHTML = `${article.title}`;
      body.innerHTML = `${article.body}`;

      let commentsUrl = `https://gorest.co.in/public-api/comments?post_id=${id}`;

      fetch(commentsUrl)
      .then((resp) => resp.json())
      .then(function(page) {
        let commentsList = page.data;
        
        commentsList.map(function(comment) {
          let comments = createNode('ul');
          let li = createNode('li');
          let author = createNode('h3');
          let description = createNode('p');
  
          author.innerHTML = `${comment.name}`;
          description.innerHTML = `${comment.body}`;
  
          append(detail, comments);
          append(comments, li);
          append(li, author);
          append(li, description);
        })
      })
      .catch(function(error) {
        console.log(error);
      });
      
      append(detail, title);
      append(detail, body);
      append(detail, exit);
      detail.style.display = 'flex';
      exit.classList.add('exit__detail');

      exit.addEventListener('click', () => { closeDetails(detail) });
      
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  function closeDetails(detail) {
    detail.style.display = 'none';
  }

  showPage();

})();