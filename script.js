async function getMovies() {
    try {
        let response = await fetch ("https://api.themoviedb.org/3/movie/popular?api_key=1829dffd986a3aa94677f730051f78f7");
    let data = await response.json();
    return data.results;
    
    } catch (error) {
        console.log("Error in fetching API");
    }
}

async function main(){
    let movies20 = await getMovies();
    console.log(movies20);
    let result = document.getElementById("result")
    let resultContent = "";
    movies20.forEach((movie,idx) => {
        resultContent += `${idx+1}. ${movie.original_title} \n`;
    });
    result.innerText = resultContent;
}
main();