const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";
//DOM
let dataPanel = document.querySelector("#dataPanel");
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchGender = document.querySelector('#search-gender');
const exampleModal = document.querySelector('#exampleModal');
//宣告陣列
const peoples = [];
let filteredPeoples = [];

// 頁數
const MOVIE_PER_PAGE = 50;
const paginator = document.querySelector('#paginator');

// 個人圖片渲染主畫面
function showIndex(data) {
  let htmlContent = ``;
  let htmlModal = ``;
  data.forEach((item) => {
    htmlContent += `
    <div class="person-info">
      <img src="${item.avatar}" class="pic" alt="People Avatar" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${item.id}">
      <h5 class="name" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${item.id}">${item.name}</h5>
    </div>`;
  });
  dataPanel.innerHTML = htmlContent;
  // modalBlock.innerHTML = htmlModal;
}

//顯示個人資訊Modal
function showPersonal(id) {
  const modalName = document.querySelector("#name");
  const modalEmail = document.querySelector("#email");
  const modalAvatar = document.querySelector("#avatar");
  const modalInfo = document.querySelector("#smallInfo");
  const modalFooter = document.querySelector(".modal-footer");
  //ModelAnswer的答案避免前一個Modal有暫存
  modalName.textContent = "";
  modalEmail.textContent = "";
  modalAvatar.innerHTML = `<img src="" alt="avatar-poster" class="img-fluid">`;
  modalInfo.textContent = "";
  axios
    .get(INDEX_URL + id)
    .then((response) => {
      data = response.data;
      modalName.innerText = data.name + " " + data.surname;
      modalEmail.innerText = data.email;
      modalAvatar.innerHTML = `<img src="${data.avatar}" alt="movie-poster" class="img-fluid">`;
      modalInfo.innerHTML = `<p>gender: ${data.gender}</p><p>age: ${data.age}</p><p>region: ${data.region}</p><p>birthday: ${data.birthday}</p><p>create: ${data.created_at}</p><p>update: ${data.updated_at}</p>
      <p>Id: ${data.id}</p>`;
      modalFooter.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-add-favorite" id="addFavorite" data-id = "${data.id}">加入至我的賞金目標</button>`;
    })
    .catch(function (error) {
      // 2.handle error
      console.log(error);
    });
}

//監聽dataPanel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  showPersonal(parseInt(event.target.dataset.id));
});

//監聽Modal與加入最愛鍵，顯示Modal
exampleModal.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-add-favorite')) {
    // console.log(event.target)
    // console.log(parseInt(event.target.dataset.id))
    addToFavorite(parseInt(event.target.dataset.id))
  }
})


// 換頁列監聽
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  showIndex(getPeoplesByPage(page))
})

//搜尋列監聽 //submit方法也可以
searchForm.addEventListener('input', function onSearchFormSubmitted(event) {

  //js預設submit後會重新整理頁面，避免他重整。
  event.preventDefault();
  //儲存符合篩選條件的項目

  const keyword = searchInput.value.trim().toLowerCase();
  const selectGender = searchGender.value;
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
  filteredPeoples = peoples.filter((people) =>
    people.name.toLowerCase().includes(keyword)
  )
  filteredPeoples = filteredPeoples.filter(function (people) {
    if (selectGender === 'female') {
      return people.gender.match(selectGender);
    } else if (selectGender === 'male') {
      return people.gender === 'male';
    } else {
      return 1;
    }
  })

  // console.log(selectGender)
  // console.log(filteredPeoples2);


  // filteredPeoples = filteredPeoples.filter((people) =>
  //   // if (selectGender !== 'Choose')
  //   people.gender.toLowerCase().includes('Male')
  // )
  //錯誤處理：無符合條件的結果
  if (filteredPeoples.length === 0) {
    return alert('Cannot find peoples with keyword' + ' ' + keyword)
  }

  //重新輸出至畫面(加入搜尋後進行頁數取代)
  // showIndex(filteredPeoples);
  //顯示搜尋後的電影
  renderPaginator(filteredPeoples.length)
  //重新輸出至畫面
  showIndex(getPeoplesByPage(1))

})

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
  const list = JSON.parse(localStorage.getItem('favoritePeoples')) || []
  //第一種方法
  // const movie = movies.find(isMovieIdMatched)
  // 第二種方法：匿名函式
  const people = peoples.find(people => people.id === id)
  if (list.some((people) => people.id === id)) {
    return alert('罪犯已經在賞金目標中!')
  }
  list.push(people);

  const jsonString = JSON.stringify(list)
  localStorage.setItem('favoritePeoples', jsonString)
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
function getPeoplesByPage(page) {
  //page 1 -> movies 0-11
  //page 2 -> movies 12-23
  //page 3 -> movies 24-34
  //...
  //movies要兩種，一種是最上面的movies陣列，一種是搜尋過後的filteredMovies
  const data = filteredPeoples.length ? filteredPeoples : peoples;
  const starIndex = (page - 1) * MOVIE_PER_PAGE;
  //取的電影數量
  // console.log(data);
  return data.slice(starIndex, starIndex + MOVIE_PER_PAGE);
}



//把API推入本地端陣列裡並呼叫showIndex把電影顯示出來
axios.get(INDEX_URL).then((response) => {
  // let index = response.data.results;
  peoples.push(...response.data.results);
  // showIndex(peoples);
  renderPaginator(peoples.length);
  showIndex(getPeoplesByPage(1));
});

