var queryURLNowPlaying = "https://api.themoviedb.org/3/movie/now_playing?api_key=821200ae1886978d84ce617ffe08aa3f&language=en-US&page=1";

var nowPlayingMovies = [];
var movieOverviews = [];
var releaseDates = [];
var genres = [];
var movieCast = [];
var movieRoles = [];
var nameRole = [];

$.ajax({
    url: queryURLNowPlaying,
    method: "GET"
}).then(function (response) {

    console.log(response);
    console.log(response.results);


    var movies = [];
    var length = response.results.length;
    var movieIDs = [];
    for (var i = 0; i < length; i++) {
        movies[i] = response.results[i].original_title.split("'").join("");
        movieIDs[i] = response.results[i].id;
        movieOverviews[i] = response.results[i].overview;
        releaseDates[i] = response.results[i].release_date;

        $(".list-group").append("<button type='button' data-index = '" + i + "'data-id = '" + movieIDs[i] + "'  data-movie-name = '" +
            movies[i] + "' class='list-group-item list-group-item-action movies-now-playing'>" + movies[i] + "</button>");
    }

    console.log(movieIDs);
    console.log(movies);
});


$(document).on("click", ".movies-now-playing", function () {
    var movieID = $(this).attr("data-id");
    var movieName = $(this).attr("data-movie-name");
    var movieIndex = $(this).attr("data-index");
    // console.log(movieIndex);
    var plot = movieOverviews[movieIndex];
    var released = releaseDates[movieIndex];
    var year = released.substring(0, 5);
    released = released.substring(5) + "-" + year.substring(0, 4);
    console.log(year);
    console.log(released);
    console.log(plot);

    $(".movie-title-details").text("Movie Title: " + movieName);
    $(".overview").text("Movie Overview: " + plot);
    $(".released").text("Movie Released: " + released);

    // console.log(movieID);
    var queryURLPoster = "https://api.themoviedb.org/3/movie/" + movieID + "/images?api_key=821200ae1886978d84ce617ffe08aa3f&language=en-US&include_image_language=en";
    var queryURLMovieDetails = "https://api.themoviedb.org/3/movie/" + movieID + "?api_key=821200ae1886978d84ce617ffe08aa3f&language=en-US";
    var queryURLCast = "https://api.themoviedb.org/3/movie/" + movieID + "/credits?api_key=821200ae1886978d84ce617ffe08aa3f";
    $.ajax({
        url: queryURLPoster,
        method: "GET"
    }).then(function (response) {
        // console.log(response.posters);
        // console.log(response.posters[0].file_path);
        var poster = "https://image.tmdb.org/t/p/w500/" + response.posters[0].file_path;
        // console.log(poster);
        $("#poster").attr("src", poster);
        $(".magsmall").attr("src", poster);

    });

    $.ajax({
        url: queryURLMovieDetails,
        method: "GET"
    }).then(function (response) {
        console.log(response.genres);
        var genreLength = response.genres.length;
        var genre = "";
        console.log(genreLength);
        for (var i = 0; i < genreLength; i++) {
            genres[i] = response.genres[i].name;
            genre = genre + genres[i];
        }
        console.log(genres);
        genre = genre.replace(/([A-Z])/g, ' $1').trim().split(" ").join(", ");
        console.log(genre);

        $(".genres").text("Genres: " + genre);
    });

    // console.log("movie name: " + movieName);
    $(".movie-title").text(movieName);

    $.ajax({
        url: queryURLCast,
        method: "GET"
    }).then(function (response) {
        console.log(response.cast);
        var role = "";
        for (var i = 0; i < 10; i++) {
            movieCast[i] = response.cast[i].name;
            movieRoles[i] = response.cast[i].character;
            nameRole[i] = movieCast[i] + " as " + movieRoles[i];
            role = role + nameRole[i] + ", ";
        }
        role = role.split(" (voice)").join("");
        role = role.slice(0, -2);


        console.log(role);

        $(".cast").text("Cast and Role: " + role);
    });



});



//retrieves the movie name, loads youtube video that plays corresponding movie name trailer  
$(".btn.trailer").click(function () {
    var filmName = document.getElementsByClassName("card-text movie-title")[0].innerHTML;
    console.log(filmName);


    filmName = filmName.split(" ").join("+") + "+movie+trailer";

    console.log(filmName);
    var link = "https://www.youtube.com/embed/?listType=search&list=" + filmName;

    $(".youtube-modal").html("<iframe id='ytplayer' type='text/html' width='720' height='405' src=" + link + " frameborder='0' allowfullscreen>");

    $('.youtube-modal').on('hidden.bs.modal', function () {
        $(".youtube-modal").empty();
    });


});

$(".btn.close").click(function () {
    $(".youtube-modal").html("");
});

var config = {
    apiKey: "AIzaSyD1U9ReBiBnL00B1lH5tFUpZJEgnLiyCTM",
    authDomain: "project1-ucf-coding-bootcamp.firebaseapp.com",
    databaseURL: "https://project1-ucf-coding-bootcamp.firebaseio.com",
    projectId: "project1-ucf-coding-bootcamp",
    storageBucket: "project1-ucf-coding-bootcamp.appspot.com",
    messagingSenderId: "475451427154"
};
firebase.initializeApp(config);
var database = firebase.database();


var txtEmail = $("#txtEmail");
var txtPassword = $("#txtPassword");
var btnLogin = $("#btnLogin");
var btnSignUp = $("#btnSignUp");
var btnLogout = $("#btnLogout");



btnLogin.click(function () {
    //   alert("hello");
    var email = txtEmail.val().trim();
    var pass = txtPassword.val().trim();
    const auth = firebase.auth();
    // txtEmail.val("");
    // txtPassword.val("");
    // console.log(email + pass);

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
});

btnSignUp.click(function () {
    // TODO: check for REAL EMAIL
    var email = txtEmail.val().trim();
    var pass = txtPassword.val().trim();
    const auth = firebase.auth();
    // txtEmail.val("");
    // txtPassword.val("");
    // console.log(email + pass);

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
});

btnLogout.click(function () {
    firebase.auth().signout().then(function () {
        console.log("signout successful");
    }).catch(function (error) {
        console.log(e.message);
    })
})

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
        btnLogout.classList.remove("invisible");
    } else {
        console.log('not logged in');
        btnLogout.attr("class", "invisible");
    }
});

// must hit enter for var zip to obtain value

var zip ="";
$("#zip").keyup(function(event) {
    if (event.keyCode === 13) {
        zip = $("#zip").val().trim();
    };
// var zip =  $("#zip").val().trim();
// $("#zip").val("");
// console.log(zip)
// database.ref().push({
//     zip: zip,
//     dateAdded: firebase.database.ServerValue.TIMESTAMP});

var queryURLzip = {
    "async": true,
    "crossDomain": true,
    "url": "https://maps.googleapis.com/maps/api/place/textsearch/json?query=movie+theater+" + zip + "&radius=25&key=AIzaSyBLquMy7ja6z4_u2YAJP-z_7GnxUOQrjBg",
    "method": "GET",
    "headers": {
        "Cache-Control": "no-cache",
        "Postman-Token": "fdbfab48-d78b-4811-aa54-b7c4544edadc",
    }
}


$(document).on("click", ".btn.theaters", function () {
    $.ajax(queryURLzip).done(function (response) {
        console.log(response.results[0].formatted_address);
        var result = response.results[0].formatted_address;
        result = result.split(" ").join("%20");
        var url = "https://www.google.com/maps/embed/v1/place?q=" + result + "&zoom=17&key=AIzaSyDkQQvy7J15US6zz8Ia7CngKYj8pFOUJ9I";
        $('iframe').attr('src', url);
        
        });

    });

});