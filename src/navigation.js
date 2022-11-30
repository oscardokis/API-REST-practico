window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
  console.log({ location });

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

  location.hash
}

function homePage(){
  console.log('Home!!');
  getTrendingMoviesPreview();
  getCategoriesPreview();
}
function categoriesPage(){
  console.log('Categories!!');
}
function movieDetailsPage(){
  console.log('Movie!!');
}
function serchPage(){
  console.log('Search!!');
}
function trendsPage(){
  console.log('TRENDS!!');
}