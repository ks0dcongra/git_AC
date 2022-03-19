const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + '/posters/';
const MOVIE_PER_PAGE = 12;

const movies = [];
let filteredMovies = [];

//model answer 宣告currentPage去紀錄目前分頁，確保切換模式時分頁不會跑掉且搜尋時不會顯示錯誤
let currentPage = 1;

const dataPanel = document.querySelector('#data-panel');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const paginator = document.querySelector('#paginator');
const listIcon = document.querySelector('#icon-panel');
//渲染至HTML
function renderMovieList(data) {
  let rawHTML = '';

  data.forEach((item) => {
    // console.log(item);
    rawHTML += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-top" alt="Movie Poster" />
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">
              More
            </button>

            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
        
      </div >
    </div>`
  })
  dataPanel.innerHTML = rawHTML;
}

function renderMovieListBar(data) {
  let rawHTML = '';

  data.forEach((item) => {
    // console.log(item);
    rawHTML += `
    <div class="row">
      <div class="col-12">
        <div class="list">
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex bd-highlight">
              <div class="d-inline-flex p-2 flex-grow-1 bd-highlight mt-2">
                ${item.title}
              </div>

              <div class="d-inline-flex p-2 bd-highlight">
                <button class="btn btn-primary btn-show-movie " data-bs-toggle="modal" data-bs-target="#movie-modal"
                  data-id="${item.id}">More</button>
              </div>

              <div class="d-inline-flex p-2 bd-highlight">
                <button class="btn btn-info btn-add-favorite " data-id="${item.id}">+</button>
              </div>
            </li>
            <li class="list-group-item"></li>
          </ul>
        </div>
      </div>
    </div>`
  })


  dataPanel.innerHTML = rawHTML;
}

//總共有幾個分頁 //amount為總共電影數
function renderPaginator(amount) {
  //無條件進位
  const numberOfPages = Math.ceil(amount / MOVIE_PER_PAGE)
  let rawHTML = '';
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }

  paginator.innerHTML = rawHTML;
}

//一頁只能顯示12部電影 
function getMoviesByPage(page) {
  //page 1 -> movies 0-11
  //page 2 -> movies 12-23
  //page 3 -> movies 24-34
  //...
  //movies要兩種一種是最上面的movies陣列，一種是搜尋過後的movies
  const data = filteredMovies.length ? filteredMovies : movies;
  const starIndex = (page - 1) * MOVIE_PER_PAGE;
  //取的電影數量
  // console.log(data);
  return data.slice(starIndex, starIndex + MOVIE_PER_PAGE);
}


//渲染HTML的Modal
function showMovieModal(id) {
  if (!id) {
    return
  }
  const modalTitle = document.querySelector('#movie-modal-title');
  const modalImage = document.querySelector('#movie-modal-image');
  const modalDate = document.querySelector('#movie-modal-date');
  const modalDescription = document.querySelector('#movie-modal-description');
  //ModelAnswer的答案避免前一個Modal有暫存
  modalImage.innerHTML = `<img src="" alt="movie-poster" class="img-fluid">`;
  modalTitle.textContent = "";
  modalDate.textContent = "";
  modalDescription.textContent = "";


  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`;
    modalDate.innerText = 'Release Date' + data.release_date;
    modalDescription.innerText = data.description;
  })
}

//加入最愛清單
function addToFavorite(id) {
  // console.log(id)
  // 第一種方法:宣告函式
  // function isMovieIdMatched(movie) {
  //   return movie.id === id;
  // }

  //儲存到本地端
  // localStorage.setItem('default_language', 'english')
  //取出本地端的key值
  // localStorage.getItem('default_language')
  //刪掉本地端儲存的值
  // localStorage.removeItem('default_language')

  //如果沒拿到本地端東西就返回空陣列 資料轉成JSON字串
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  //第一種方法
  // const movie = movies.find(isMovieIdMatched)
  // 第二種方法：匿名函式
  const movie = movies.find(movie => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('電影已經在收藏清單中!')
  }
  list.push(movie);

  const jsonString = JSON.stringify(list)
  localStorage.setItem('favoriteMovies', jsonString)
}

//監聽More鍵與加入最愛鍵，顯示Modal
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset);
    //dataset是Bootstrape的特殊用法
    showMovieModal(parseInt(event.target.dataset.id));
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(parseInt(event.target.dataset.id))
  }
})

function pageChange(className) {
  if (className === 'fa fa-th') {
    renderMovieList(getMoviesByPage(currentPage))
    // renderMovieList(getMoviesByPage(1))
    // 換頁列監聽
    paginator.addEventListener('click', function onPaginatorClicked(event) {
      if (event.target.tagName !== 'A') return
      const page = Number(event.target.dataset.page)
      currentPage = page;
      renderMovieList(getMoviesByPage(currentPage))
    })
  } else if (className === 'fa fa-bars') {
    renderMovieListBar(getMoviesByPage(currentPage))
    // renderMovieListBar(getMoviesByPage(1))
    // 換頁列監聽
    paginator.addEventListener('click', function onPaginatorClicked(event) {
      if (event.target.tagName !== 'A') return
      const page = Number(event.target.dataset.page)
      currentPage = page;
      renderMovieListBar(getMoviesByPage(currentPage))
    })
  } else {
    paginator.addEventListener('click', function onPaginatorClicked(event) {
      if (event.target.tagName !== 'A') return
      const page = Number(event.target.dataset.page)
      currentPage = page;
      renderMovieList(getMoviesByPage(currentPage))
    })
  }
}




//搜尋列監聽
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  //js預設submit後會重新整理頁面，避免他重整。
  event.preventDefault();
  //儲存符合篩選條件的項目

  const keyword = searchInput.value.trim().toLowerCase();
  //當我沒有輸入任何關鍵字應該顯示全部電影 ; 錯誤處理：輸入無效字串
  // if (!keyword.length) {
  //   return alert('Please enter a valid string')
  // }
  //條件篩選:
  //第一種搜尋方法迴圈法
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }

  // 第二種方法
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert('Cannot find movie with keyword' + keyword)
  }

  //重新輸出至畫面(加入搜尋後進行頁數取代)
  // renderMovieList(filteredMovies);
  //顯示搜尋後的電影
  renderPaginator(filteredMovies.length)
  //重新輸出至畫面
  renderMovieList(getMoviesByPage(currentPage))
})

//Icon監聽
listIcon.addEventListener('click', function onSearchFormSubmitted(event) {
  pageChange(event.target.className)
})


//顯示全部電影
axios.get(INDEX_URL).then(response => {
  //為了避免造成外層還多一個陣列
  //第一種方法
  // for (const movie of response.data.results) {
  //   movies.push(movie);
  // }
  //第二種方法
  movies.push(...response.data.results);
  //重製分頁器
  renderPaginator(movies.length);
  //預設顯示第 1 頁的搜尋結果
  renderMovieList(getMoviesByPage(currentPage));

  //在沒有按任何圖示的情況下可以更換頁面
  pageChange();
})

