import hitsTbs from "./templates/hits.hbs";
import "../src/styles.css";
import PixabayApiService from "./js/pixabay-api-service";
import LoadMoreBtn from "./js/load-more-Btn";

const refs = {
  searchForm: document.querySelector("#search-form"),
  gallery: document.querySelector(".gallery"),
  // loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const pixabayApiService = new PixabayApiService();

// LoadMoreBtn.show();
// LoadMoreBtn.disable();

refs.searchForm.addEventListener("submit", onSearch);
loadMoreBtn.refs.button.addEventListener("click", onLoadMore);

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.elements.query.value;

  if (pixabayApiService.query === "") {
    return alert("Sorry, you need to enter search text");
  }
  loadMoreBtn.show();
  pixabayApiService.resetPage();
  clearGallery();
  loadMoreBtn.disable();
  pixabayApiService.fetchArticles().then((hits) => {
    appendHitsMarkup(hits);
    loadMoreBtn.enable();
  });
}

function onLoadMore(e) {
  loadMoreBtn.disable();
  pixabayApiService.fetchArticles().then((hits) => {
    appendHitsMarkup(hits);
    loadMoreBtn.enable();

    window.scrollTo({
      top: e.pageY,
      left: 0,
      behavior: "smooth",
    });
  });
}

function appendHitsMarkup(hits) {
  refs.gallery.insertAdjacentHTML("beforeend", hitsTbs(hits));
}

function clearGallery() {
  refs.gallery.innerHTML = "";
}
