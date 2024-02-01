// Data
const api = axios.create({
  baseURL:"https://api.themoviedb.org/3/",
  Headers:{
    'Content-Type':'application/json;charset=utf-8',
  },
  params: {
    'api_key': "185846f6a0e2f62f8f1c9bb8dbcd7c92", 
    'language': "es",
  },

});

function likedMovieList(){
  /*JSON.parse: strings a objetos java scripts */
  const item = JSON.parse(localStorage.getItem('liked_movies'));
  let movies;
  if(item) {
    movies = item;
  }else {
    movies = {}
  }

  return movies;
}

function likeMovie(movie){
  // movie.id
  const likedMovies = likedMovieList();
  
 
  if(likedMovies[movie.id]){
    
    likedMovies[movie.id] = undefined;
    
  } else{
    
    likedMovies[movie.id] = movie;
    
  }
  /*JSON.stringify:  objetos java script a strings */
  localStorage.setItem('liked_movies',JSON.stringify(likedMovies));
  

}

// Utils

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    
    if(entry.isIntersecting){
      const url = entry.target.getAttribute('data-img');
      entry.target.setAttribute('src', url);
    }
  })
});

function createMovies(
  movies, 
  container, 
  {
    lazyload = false,
    clean = true,
  }
){
  if(clean){
    container.innerHTML = "";
  }
  movies.forEach(movie => {
    
    const movieContainer = document.createElement("div");
    movieContainer.classList.add('movie-container');
    const movieImg = document.createElement("img");
    movieImg.classList.add('movie-img');
    /* movieImg.setAttribute('alt', movie.title); */
    movieImg.setAttribute(lazyload ? 'data-img':'src', `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
    movieImg.addEventListener('click', () => {
      location.hash = `#movie=${movie.id}-${movie.title}`
    });
    movieImg.addEventListener(`error`, () =>{
      movieImg.classList.add('inactive');
      const tittleMovie =document.createElement("div");
      movieContainer.classList.add("color-error")
      tittleMovie.innerText = movie.title;
      movieContainer.appendChild(tittleMovie);
    });
    
    const movieBtn = document.createElement('button');
    movieBtn.classList.add('movie-btn');
    likedMovieList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
    movieBtn.addEventListener('click', () => {
      likeMovie(movie);
      movieBtn.classList.toggle('movie-btn--liked');
      getTrendingMoviesPreview();
      getLikedMovies();

      if(likedMoviesListArticle.childNodes.length=="0"){
        likedMoviesSection.classList.add('inactive');
        titleLikedMovie.classList.add('inactive')
      }else{
        likedMoviesSection.classList.remove('inactive');
        titleLikedMovie.classList.remove('inactive');
      }
    });

    if(lazyload){
      lazyLoader.observe(movieImg);
    }
    
    movieContainer.appendChild(movieBtn);
    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}
function createCategories(categories, container){
  container.innerHTML = "";
  categories.forEach(category => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement("h3");
    categoryTitle.classList.add('category-title');

    categoryTitle.setAttribute('id', `id${category.id}`);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`
    });    
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}
// Llamados a la API

async function getTrendingMoviesPreview(){
  const { data } = await api(`trending/movie/day`);
  const movies = data.results;
  
  createMovies(
    movies, 
    trendingMoviesPreviewList, 
    {lazyload: true, clean: true},
    );
}

async function getTrendingMoviesPreview(){
  const { data } = await api(`trending/movie/day`);
  const movies = data.results;
  
  createMovies(
    movies, 
    trendingMoviesPreviewList, 
    {lazyload: true, clean: true},
    );
}

async function getCategoriesPreview(){
  const { data } = await api(`genre/movie/list`);
  const categories = data.genres;
  createCategories(categories, categoriesPreviewList);
}
async function getMoviesByDrama(){
  const { data } = await api(`discover/movie?with_genres=18`);
  const movies = data.results;
  pageMax = data.total_pages;
  createMovies(
    movies, 
    moviesDramaList, 
    {lazyload: true, clean: true},
    );
}
async function getMoviesBycategory(id){
  const { data } = await api(`discover/movie?with_genres=${id}`);
  const movies = data.results;
  pageMax = data.total_pages;
  createMovies(
    movies, 
    genericListSection, 
    {lazyload: true, clean: true},
    );
  
}
function getPaginedMoviesByCategory(id) {
  return async function(){
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < pageMax;
    if(scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api(`discover/movie?with_genres=`, {
        params:{
          id,
          page,
        }
      });
      const movies = data.results;
      
      
      createMovies(
        movies, 
        genericListSection, 
        {lazyload: true, clean: false},
        );
    }
  }
}
async function getMoviesBySerach(query){
  const { data } = await api(`search/movie`, {
    params:{
      query,
    }
  });
  const movies = data.results;
  pageMax = data.total_pages;
  createMovies(
    movies, 
    genericListSection, 
    {lazyload: true, clean: true},
    );
  
}

function getPaginedMoviesBysearch(query) {
  return async function(){
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < pageMax;
    if(scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api(`search/movie`, {
        params:{
          query,
          page,
        }
      });
      const movies = data.results;
     
      createMovies(
        movies, 
        genericListSection, 
        {lazyload: true, clean: false},
        );
    }
  }
}

async function getTrendingMovies(){
  const { data } = await api(`trending/movie/day`);
  const movies = data.results;
  pageMax = data.total_pages;
  createMovies(
    movies, 
    genericListSection, 
    {lazyload: true, clean: true},
    );
  
  /*   const btnLoadMore = document.createElement('button')
  btnLoadMore.innerText = 'Cargar más';
  btnLoadMore.addEventListener('click', getPaginedTrendingMovies);
  genericListSection.appendChild(btnLoadMore); */
}

async function getPaginedTrendingMovies() {
  const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
  const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
  const pageIsNotMax = page < pageMax;
  if(scrollIsBottom && pageIsNotMax) {
    page++;
    const { data } = await api(`trending/movie/day`, {
      params:{
        page,
      }
    });
    const movies = data.results;
    
    createMovies(
      movies, 
      genericListSection, 
      {lazyload: false, clean: false},
      );
    
  }
/* 
  const btnLoadMore = document.createElement('button')
  btnLoadMore.innerText = 'Cargar más';
  btnLoadMore.addEventListener('click', getPaginedTrendingMovies);
  genericListSection.appendChild(btnLoadMore); */
}
async function getMovieById(id){
  const { data: movie } = await api(`movie/${id}`);
  movieDetailImg.setAttribute('src', `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`);
  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  
  movieDetailScore.textContent = Math.round(movie.vote_average * 10) / 10;
  createCategories(movie.genres, movieDetailCategoriesList);
  
  getRelatedMoviesById(id);
}

async function getRelatedMoviesById(id){
  const { data } = await api(`movie/${id}/similar`);
  const relatedMovies = data.results;

  createMovies(
    relatedMovies, 
    relatedMoviesContainer, 
    {lazyload: true, clean: true},
    );
}
function getLikedMovies(){
  const likedMovies = likedMovieList();
  //{keys: 'values', convierte todo los values del objeto en un array}
  const moviesArray = Object.values(likedMovies);
  createMovies(
    moviesArray, 
    likedMoviesListArticle, 
    {lazyload: true, clean: true},
    );
}
