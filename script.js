let allMovies = [];
let displayedMovies = [];
let favourites = new Set();

async function getMovies() {
  try {
    let response = await fetch(
      "https://api.themoviedb.org/3/movie/top_rated?api_key=1829dffd986a3aa94677f730051f78f7"
    );
    let data = await response.json();
    return data.results;
  } catch (error) {
    console.log("Error in fetching API");
  }
}

function renderMovies(movies) {
  let result = document.getElementById("result");
  result.innerHTML = "";

  movies.forEach((movie, idx) => {
    let card = document.createElement("div");
    card.classList.add("movieCard");

    let rank = document.createElement("h2");
    rank.innerText = `#${idx + 1}`;
    rank.classList.add("rank");

    let img = document.createElement("img");
    img.src = "https://image.tmdb.org/t/p/original" + movie.poster_path;
    img.classList.add("poster");

    let vote = document.createElement("h5");
    vote.innerText = `⭐️ ${movie.vote_average} (${movie.vote_count})`;
    vote.classList.add("vote");

    let title = document.createElement("h3");
    title.innerText = movie.original_title + ` (${movie.original_language})`;
    title.classList.add("title");

    let releaseDate = document.createElement("h5");
    releaseDate.innerText = movie.release_date.slice(0, 4);
    releaseDate.classList.add("releaseDate");

    let favBtn = document.createElement("button");

    if (favourites.has(movie.id)) {
      favBtn.innerText = "❤️ Favourite";
    } else {
      favBtn.innerText = "🤍 Add Favourite";
    }

    favBtn.addEventListener("click", () => {
      if (favourites.has(movie.id)) {
        favourites.delete(movie.id);
      } else {
        favourites.add(movie.id);
      }
      renderMovies(displayedMovies);
    });

    card.append(img, rank, vote, title, releaseDate, favBtn);

    result.append(card);
  });
}

async function main() {
  try {
    let movies20 = await getMovies();
    allMovies = movies20;
    displayedMovies = allMovies;
    renderMovies(displayedMovies);
  } catch (error) {
    console.log("Error in executing getMovies fn before main fn");
  }
}

document.getElementById("search").addEventListener("input", (e) => {
  let keyword = e.target.value.toLowerCase();

  displayedMovies = allMovies.filter((movie) =>
    movie.original_title.toLowerCase().includes(keyword),
  );
  renderMovies(displayedMovies);
});

document.getElementById("ratingHigh").addEventListener("click", () => {
  displayedMovies = [...displayedMovies].sort(
    (a, b) => b.vote_average - a.vote_average,
  );
  renderMovies(displayedMovies);
});

document.getElementById("ratingLow").addEventListener("click", () => {
  displayedMovies = [...displayedMovies].sort(
    (a, b) => a.vote_average - b.vote_average,
  );
  renderMovies(displayedMovies);
});

document.getElementById("yearNew").addEventListener("click", () => {
  displayedMovies = [...displayedMovies].sort(
    (a, b) => b.release_date.slice(0, 4) - a.release_date.slice(0, 4),
  );
  renderMovies(displayedMovies);
});

main();
