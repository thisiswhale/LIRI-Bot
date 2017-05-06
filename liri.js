//grabs arguments from command line and calls the switch and case function
var action = process.argv[2];
var submit = process.argv.slice(3).join(" ");

    var fs = require("fs");
fs.appendFile("log.txt", process.argv.slice(2).join(" ")+",\r\n");


choices();

function choices() {
    switch (action) {

        case "my-tweets":
            twitter();
            break;

            //"https://api.spotify.com/v1/search?query=hello&type=track&offset=0&limit=20"
        case "spotify-this-song":
            spotify();
            break;

        case "movie-this":
            imdb();
            break;

        case "do-what-it-says":
            readTxt();
            break;

    }
}
//twitter call tweets out me recent 20 tweets
function twitter() {
    var grab = require("./keys.js");
    var Twitter = require('twitter');
    var client = new Twitter(grab.twitterKeys)

    //setting up params use for get()
    var params = { screen_name: 'willcodethis' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {

        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(JSON.stringify(tweets[i].text));
            }
        }

    });
}

//spotify will locate the info by track name
function spotify() {
    var spotify = require('spotify');
    var index;
    //blank query default to The Sign by Ace of Barrons
    if (submit == "" || submit == "null") {
        submit = "The Sign";
    }

    spotify.search({ type: 'track', query: submit }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        // check if album_type is "album" data.tracks.items[0].album.album_type

        for (var i = 0; i < data.tracks.items.length; i++) {

        	//checks for album type is album, want no "singles"
            if (data.tracks.items[i].album.album_type === "album") {
                index = i;
                console.log("Artists: " + data.tracks.items[index].album.artists[0].name);
                console.log("Song's track: " + data.tracks.items[index].name);
                console.log("Preview link: " + data.tracks.items[index].preview_url);
                console.log("Album title: " + data.tracks.items[index].album.name);
                return;
            }
        }
    });
}


function imdb() {
    var request = require("request");
    if (submit == null || submit === "") {
        submit = "Mr. Nobody";
    }
    request("http://www.omdbapi.com/?t=" + submit + "&y=&plot=short&r=json", function(error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Released Date: " + JSON.parse(body).Released);
            console.log("Rating: " + JSON.parse(body).imdbRating);
            console.log("Country produced in: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Short Summary: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("URL: http://www.imdb.com/title/" + JSON.parse(body).imdbID);
        }
    });

}
//reads the random.txt and store it into an array form
//reconfigure action and submit equals with variables from random.txt
function readTxt() {


    fs.readFile("random.txt", "utf8", function(error, data) {
        var dataArr = data.split(" ");
        action = dataArr[0];
        submit = dataArr.slice(1).join(" ");

        choices();
    });
}

// * In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.

// * Make sure you append each command you run to the `log.txt` file. 

// * Do not overwrite your file each time you run a command.
