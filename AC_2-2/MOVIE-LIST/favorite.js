const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + '/posters/';

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');

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

            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
        </div >
      </div >
      </div>`
  })
  dataPanel.innerHTML = rawHTML;
}

//渲染HTML的Modal
function showMovieModal(id) {
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
// function addToFavorite(id) {
//   // 第一種方法:宣告函式
//   // function isMovieIdMatched(movie) {
//   //   return movie.id === id;
//   // }

//   //儲存到本地端
//   // localStorage.setItem('default_language', 'english')
//   //取出本地端的key值
//   // localStorage.getItem('default_language')
//   //刪掉本地端儲存的值
//   // localStorage.removeItem('default_language')

//   //如果沒拿到本地端東西就返回空陣列 資料轉成JSON字串
//   const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
//   //第一種方法
//   // const movie = movies.find(isMovieIdMatched)
//   // 第二種方法：匿名函式
//   const movie = movies.find(movie => movie.id === id)
//   if (list.some((movie) => movie.id === id)) {
//     return alert('電影已經在收藏清單中!')
//   }
//   list.push(movie);

//   const jsonString = JSON.stringify(list)
//   localStorage.setItem('favoriteMovies', jsonString)
// }

//刪除最愛清單
function removeFromFavorite(id) {
  if (!movies || !movies.length) return //防止 movies 是空陣列的狀況
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
  // const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  //第一種方法
  // const movie = movies.find(isMovieIdMatched)
  // 第二種方法：匿名函式
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return
  // if (list.some((movie) => movie.id === id)) {
  //   return alert('電影已經在收藏清單中!')
  // }
  // list.push(movie);
  movies.splice(movieIndex, 1)
  const jsonString = JSON.stringify(movies)
  localStorage.setItem('favoriteMovies', jsonString)
  renderMovieList(movies)

}

//監聽More鍵，顯示Modal
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    // console.log(event.target.dataset);
    //dataset是Bootstrape的特殊用法
    showMovieModal(parseInt(event.target.dataset.id));
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(parseInt(event.target.dataset.id))
  }
})

// //監聽搜尋列
// searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
//   //js預設submit後會重新整理頁面，避免他重整。
//   event.preventDefault();
//   //儲存符合篩選條件的項目
//   let filteredMovies = [];

//   const keyword = searchInput.value.trim().toLowerCase();
//   //當我沒有輸入任何關鍵字應該顯示全部電影 ; 錯誤處理：輸入無效字串
//   // if (!keyword.length) {
//   //   return alert('Please enter a valid string')
//   // }
//   //條件篩選:
//   //第一種搜尋方法迴圈法
//   // for (const movie of movies) {
//   //   if (movie.title.toLowerCase().includes(keyword)) {
//   //     filteredMovies.push(movie)
//   //   }
//   // }

//   // 第二種方法
//   filteredMovies = movies.filter((movie) =>
//     movie.title.toLowerCase().includes(keyword)
//   )
//   //錯誤處理：無符合條件的結果
//   if (filteredMovies.length === 0) {
//     return alert('Cannot find movie with keyword' + keyword)
//   }
//   //重新輸出至畫面
//   renderMovieList(filteredMovies)
// })



// //顯示電影
// axios.get(INDEX_URL).then(response => {
//   //為了避免造成外層還多一個陣列
//   //第一種方法
//   // for (const movie of response.data.results) {
//   //   movies.push(movie);
//   // }
//   //第二種方法
//   movies.push(...response.data.results);
//   renderMovieList(movies);
// })

renderMovieList(movies);