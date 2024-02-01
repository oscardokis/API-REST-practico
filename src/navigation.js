let pageMax;
let page = 1;
let infiniteScroll;


searchFormBtn.addEventListener('click', () => {
  location.hash = `search=${searchFormInput.value}`;
});
trendingBtn.addEventListener('click', () => {location.hash = '#trends'});
arrowBtn.addEventListener('click', () =>{
  location.hash = window.history.back();
});
headerLogo.addEventListener('click', () => {location.hash = '#home'})

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);

function smoothscroll(){
  const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
       window.requestAnimationFrame(smoothscroll);
       window.scrollTo (0,currentScroll - (currentScroll/5));
  }
};
function navigator() {
  if(infiniteScroll){
    window.removeEventListener('scroll', infiniteScroll,{ passive:false});
    infiniteScroll= undefined;
  }
  if(location.hash.startsWith('#trends')) {
    trendsPage();
  } else if (location.hash.startsWith('#search=')){
    serchPage();
  } else if (location.hash.startsWith('#movie=')){
    movieDetailsPage();
  } else if (location.hash.startsWith('#category=')){
    categoriesPage();
  } else {
    homePage();
    
  }
  if(infiniteScroll){
    window.addEventListener('scroll', infiniteScroll, { passive:false});
  }
  smoothscroll();
/*   document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0; */
}

function homePage(){
  arrowBtn.classList.add('inactive');
  searchForm.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  genericListSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');
  movieDetailMainImagenContainer.classList.add('inactive');
  

  if(likedMoviesListArticle.childNodes.length=="0"){
    likedMoviesSection.classList.add('inactive');
    titleLikedMovie.classList.add('inactive');
  }else{
    likedMoviesSection.classList.remove('inactive');
    titleLikedMovie.classList.remove('inactive');
  }
  getMoviesByDrama();
  getTrendingMoviesPreview();
  getCategoriesPreview();
  getLikedMovies();
}
function categoriesPage(){

  arrowBtn.classList.remove('inactive');
  searchForm.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericListSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  movieDetailMainImagenContainer.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');

  const [_, categoryData] = location.hash.split('=');
  const [categoryId, categoryName] = categoryData.split("-");
  const categoryNewName =decodeURI(categoryName);
  headerCategoryTitle.innerHTML = categoryNewName;
  
  getMoviesBycategory(categoryId);
  infiniteScroll = getPaginedMoviesByCategory(categoryId);
}
function movieDetailsPage(){
  headerCategoryTitle.classList.add('inactive');
  arrowBtn.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericListSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');
  movieDetailMainImagenContainer.classList.remove('inactive');
  likedMoviesSection.classList.add('inactive');

  const [_, movieIdNameCode] = location.hash.split('=');
  const [movieId,movieNameCode] = movieIdNameCode.split('-');
  const movieName = decodeURI(movieNameCode);
  getMovieById(movieId);
}
function serchPage(){
  headerCategoryTitle.classList.add('inactive');
  arrowBtn.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericListSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  movieDetailMainImagenContainer.classList.add('inactive');
  likedMoviesSection.classList.add('inactive');
  //
  const [_, query] =location.hash.split('=');
  const queryDecode = decodeURI(query);
  getMoviesBySerach(queryDecode);
  infiniteScroll = getPaginedMoviesBysearch(query);
}
function trendsPage(){
  headerCategoryTitle.classList.remove('inactive');
  arrowBtn.classList.remove('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericListSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  movieDetailMainImagenContainer.classList.add('inactive');
  headerCategoryTitle.innerHTML = 'Tendencias';
  likedMoviesSection.classList.add('inactive');
  getTrendingMovies();
  
  infiniteScroll = getPaginedTrendingMovies;
}

