let allMovies = [];

let displayedMovies = [];

let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

/* FETCH MOVIES */

async function getMovies() {
  let response = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated?api_key=1829dffd986a3aa94677f730051f78f7",
  );
  let data = await response.json();
  return data.results;
}

/* SEARCH MOVEIS */

async function searchMovies(query) {
  let response = await fetch(
    "https://api.themoviedb.org/3/search/movie?api_key=1829dffd986a3aa94677f730051f78f7&query=" +query,);
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

  movies.forEach((movie, index) => {
    let card = document.createElement("div");
    card.classList.add("movieCard");

    /* RANK (only for default list) */

    if (movies === allMovies) {
      let rank = document.createElement("h2");
      rank.innerText = `#${index + 1}`;
      rank.classList.add("rank");
      card.append(rank);
    }

    /* POSTER */

    let img = document.createElement("img");

    if (movie.poster_path) {
      img.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
    } else {
      img.src = "https://via.placeholder.com/300x450?text=No+Image";
    }

    img.classList.add("poster");

    /* VOTES */

    let vote = document.createElement("h5");
    vote.innerText = `⭐ ${movie.vote_average || 0} (${movie.vote_count || 0})`;
    vote.classList.add("vote");

    /* TITLE */

    let title = document.createElement("h3");
    title.innerText =
      (movie.title || movie.original_title || "No Title") +
      ` (${movie.original_language || "NA"})`;
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

    if (favourites.some((m) => m.id === movie.id)) {
      favBtn.style.color = "#ef4444";
    } else {
      favBtn.style.color = "white";
    }

    favBtn.addEventListener("click", () => {
      let index = favourites.findIndex((m) => m.id === movie.id);

      if (index !== -1) {
        favourites.splice(index, 1);
        favBtn.style.color = "white";
      } else {
        favourites.push(movie);
        favBtn.style.color = "#ef4444";
      }

      localStorage.setItem("favourites", JSON.stringify(favourites));
    });

    /* APPEND IN CARd*/
    card.append(img, vote, title, releaseDate, favBtn);
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
  debounce(async (e) => {
    let keyword = e.target.value.trim();
    if (keyword === "") {
      displayedMovies = allMovies;
      renderMovies(displayedMovies);
      return;
    }
    let movies = await searchMovies(keyword);
    displayedMovies = movies;
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
    (a, b) => (b.vote_average || 0) - (a.vote_average || 0),
  );

  renderMovies(displayedMovies);
});

/* SORT LOW */

document.getElementById("ratingLow").addEventListener("click", () => {
  displayedMovies = [...displayedMovies].sort(
    (a, b) => (a.vote_average || 0) - (b.vote_average || 0),
  );

  renderMovies(displayedMovies);
});

/* SORT YEAR */

document.getElementById("yearNew").addEventListener("click", () => {
  displayedMovies = [...displayedMovies].sort((a, b) => (b.release_date || "0").slice(0, 4) - (a.release_date || "0").slice(0, 4),);

  renderMovies(displayedMovies);
});

/* SHOW FAVOURITES */

document.getElementById("showFav").addEventListener("click", () => {
  renderMovies(favourites);
});

main();
