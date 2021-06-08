import hitsTbs from "./templates/hits.hbs";
import "../src/styles.css";
import PixabayApiService from "./js/pixabay-api-service";
import LoadMoreBtn from "./js/load-more-Btn";

const refs = {
  searchForm: document.querySelector("#search-form"),
  gallery: document.querySelector(".gallery"),
};
console.log(refs.gallery);

const pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.searchForm.addEventListener("submit", onSearch);
loadMoreBtn.refs.button.addEventListener("click", onLoadMore);

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.elements.query.value;

  if (pixabayApiService.query === "") {
    return alert("Sorry, you need to enter search text");
  }
  loadMoreBtn.show();
  loadMoreBtn.disable();
  pixabayApiService.resetPage();
  pixabayApiService.fetchArticles().then((hits) => {
    clearGallery();
    appendLiItemMarkup(hits);
    loadMoreBtn.enable();
  });
}

async function onLoadMore(e) {
  loadMoreBtn.disable();
  const result = await pixabayApiService.fetchArticles();
  appendLiItemMarkup(result);
  loadMoreBtn.enable();

  window.scrollTo({
    top: e.pageY,
    left: 0,
    behavior: "smooth",
  });
}

function appendLiItemMarkup(hits) {
  refs.gallery.insertAdjacentHTML("beforeend", hitsTbs(hits));
}

function clearGallery() {
  refs.gallery.innerHTML = "";
}
