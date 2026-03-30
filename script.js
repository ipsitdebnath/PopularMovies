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

async function main() {
  let movies20 = await getMovies();
  console.log(movies20);
  let result = document.getElementById("result");

  movies20.forEach((movie,idx) => {
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
    releaseDate.innerText = `${movie.release_date}`;
    releaseDate.classList.add("releaseDate");

    card.append(img,rank,vote,title,releaseDate);
    result.append(card)
  });

}

main();