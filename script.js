let allMovies = [];

let displayedMovies = [];

let favourites = new Set(JSON.parse(localStorage.getItem("favourites")) || []);

/* FETCH MOVIES */

async function getMovies() {
  let response = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated?api_key=1829dffd986a3aa94677f730051f78f7",
  );
  let data = await response.json();
  return data.results;
}

/* DEBOUNCE */

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/* RENDER */

function renderMovies(movies) {
  let result = document.getElementById("result");
  if (movies.length === 0) {
    result.innerHTML = "<h2 class='empty'>No movies found 🎬</h2>";
    return;
  }
  result.innerHTML = "";
  movies.forEach((movie) => {
    let card = document.createElement("div");
    card.classList.add("movieCard");

    /* RANK */

    let rank = document.createElement("h2");
    let originalIndex = allMovies.findIndex((m) => m.id === movie.id);
    rank.innerText = `#${originalIndex + 1}`;
    rank.classList.add("rank");

    /* POSTER */

    let img = document.createElement("img");
    img.src = movie.poster_path
      ? "https://image.tmdb.org/t/p/original" + movie.poster_path
      : "https://via.placeholder.com/300x450";
    img.classList.add("poster");

    /* VOTES */

    let vote = document.createElement("h5");
    vote.innerText = `⭐ ${movie.vote_average} (${movie.vote_count})`;
    vote.classList.add("vote");

    /* TITLE */

    let title = document.createElement("h3");
    title.innerText = movie.original_title + ` (${movie.original_language})`;
    title.classList.add("title");

    /* YEAR */

    let releaseDate = document.createElement("h5");
    releaseDate.innerText = movie.release_date
      ? movie.release_date.slice(0, 4)
      : "N/A";
    releaseDate.classList.add("releaseDate");

    /* FAV BUTTON */

    let favBtn = document.createElement("button");
    favBtn.classList.add("favBtn");
    favBtn.innerHTML = "❤";
    if (favourites.has(movie.id)) {
      favBtn.style.color = "#ef4444";
    } else {
      favBtn.style.color = "white";
    }

    favBtn.addEventListener("click", () => {
      if (favourites.has(movie.id)) {
        favourites.delete(movie.id);
        favBtn.style.color = "white";
      } else {
        favourites.add(movie.id);
        favBtn.style.color = "#ef4444";
      }
      localStorage.setItem("favourites", JSON.stringify([...favourites]));
    });

    /* APPEND */
    card.append(img, rank, vote, title, releaseDate, favBtn);
    result.append(card);
  });
}

/* MAIN */

async function main() {
  let result = document.getElementById("result");
  result.innerHTML = "<h2 class='empty'>Loading movies...</h2>";
  let movies = await getMovies();
  allMovies = movies;
  displayedMovies = allMovies;
  renderMovies(displayedMovies);
}

/* SEARCH */

document.getElementById("search").addEventListener(
  "input",
  debounce((e) => {
    let keyword = e.target.value.toLowerCase();
    displayedMovies = allMovies.filter((movie) =>
      movie.original_title.toLowerCase().includes(keyword),
    );

    renderMovies(displayedMovies);
  }, 300),
);

/* DEFAULT */

document.getElementById("default").addEventListener("click", () => {
  displayedMovies = [...allMovies];
  renderMovies(displayedMovies);
});

/* SORT HIGH */

document.getElementById("ratingHigh").addEventListener("click", () => {
  displayedMovies = [...displayedMovies].sort(
    (a, b) => b.vote_average - a.vote_average,
  );

  renderMovies(displayedMovies);
});

/* SORT LOW */

document.getElementById("ratingLow").addEventListener("click", () => {
  displayedMovies = [...displayedMovies].sort(
    (a, b) => a.vote_average - b.vote_average,
  );

  renderMovies(displayedMovies);
});

/* SORT YEAR */

document.getElementById("yearNew").addEventListener("click", () => {
  displayedMovies = [...displayedMovies].sort(
    (a, b) => b.release_date.slice(0, 4) - a.release_date.slice(0, 4),
  );

  renderMovies(displayedMovies);
});

/* SHOW FAVOURITES */

document.getElementById("showFav").addEventListener("click", () => {
  let favMovies = allMovies.filter((movie) => favourites.has(movie.id));

  renderMovies(favMovies);
});

main();
