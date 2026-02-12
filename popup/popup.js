async function fetchWatchlist() {
  //   read saved watchlist
  const savedWatchlistData = await chrome.storage.local.get("watchlist");
  return savedWatchlistData.watchlist || [];
}

const renderWatchlist = (savedWatchlist = []) => {
  const watchlistWrapper = document.querySelector(".watchlist-wrapper");
  watchlistWrapper.innerHTML = ""; // clear old items

  if (!savedWatchlist.length) return;

  savedWatchlist.map((movieInfo) => {
    const watchListItem = document.createElement("li");
    watchListItem.classList.add("watchlist-item", movieInfo.id);
    watchListItem.innerHTML = ` 
            <span className="movie-id">${movieInfo.id}</span>
            <span className="movie-name">${movieInfo.name}</span>
            <span className="movie-release-date">${movieInfo.releaseDate}</span>
            `;
    watchlistWrapper.appendChild(watchListItem);
  });
};

const trackerFormHandler = async () => {
  let savedWatchlist = await fetchWatchlist();
  renderWatchlist(savedWatchlist);

  const watchlistFormRef = document.querySelector(".add-to-watchlist-form");
  const submitButtonRef = watchlistFormRef.querySelector("#form-submit-btn");
  const clearWatchlistButtonRef = document.querySelector(
    ".clear-watchlist-btn",
  );
  const watchlistFormData = new FormData(watchlistFormRef);
  const capturedMovieName = watchlistFormData.get("movieName");
  const capturedMovieReleaseDate = watchlistFormData.get("movieReleaseDate");

  // handle add movie to watchlist
  submitButtonRef.addEventListener("click", async (e) => {
    e.preventDefault();

    if (capturedMovieName && capturedMovieReleaseDate) {
      const newMovieItem = {
        id: Date.now(),
        name: capturedMovieName,
        releaseDate: capturedMovieReleaseDate,
      };

      savedWatchlist = [...savedWatchlist, newMovieItem];
      await chrome.storage.local.set({ watchlist: savedWatchlist });
      renderWatchlist(savedWatchlist);
      watchlistFormRef.reset();
    }
  });

  // handle clear entire watchlist
  clearWatchlistButtonRef.addEventListener("click", async () => {
    savedWatchlist = [];
    await chrome.storage.local.set({ watchlist: savedWatchlist });
    renderWatchlist(savedWatchlist);
  });
};

trackerFormHandler();
