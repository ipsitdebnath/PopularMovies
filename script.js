async function getMovies() {
    try {
        let response = await fetch ("https://api.themoviedb.org/3/movie/popular?api_key=1829dffd986a3aa94677f730051f78f7");
    let data = await response.json();
    console.log(data)
    } catch (error) {
        console.log("Error");
    }
}
getMovies();