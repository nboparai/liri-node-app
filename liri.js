require("dotenv").config();
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);  //initializing spotify -passing keys to variable

var action = process.argv[2];
var title = process.argv.slice(3).join(" ");
function getBandsInTown(){
   var queryUrl=
    "https://rest.bandsintown.com/artists/" + title + "/events?app_id=codingbootcamp";
    console.log(queryUrl);
    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            var output = JSON.parse(body)[0];
            console.log(output);
            console.log("Name of the Venue: " + output.venue.name);
            console.log("Venue location: " + output.venue.city);
            console.log("Time of Event: " + moment(output.datetime).format("MM/DD/YYYY"));
        }

      });
    
}
function getSpotify(){
    if (title ===undefined) {
        title = "Ace of Base"
    }
    
    spotify.search({ type: 'track', query: title, limit: 10  }, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }

        var songArray = [];

        for (var i = 0; i < data.tracks.items.length; i++ ) {
            var result = {
                artist : data.tracks.items[i].album.artists[0].name,
                album_name : data.tracks.items[i].album.name,
                song_name : data.tracks.items[i].name,
                preview_url : data.tracks.items[i].preview_url 
            }
            songArray.push(result);
            
        }
        console.log(songArray);
    });
}
function getOdmb(){
    var queryUrl = `http://www.omdbapi.com/?t=${title}&apikey=7587dcf2`;
    console.log(queryUrl);
    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
      
          // Parse the body of the site and recover teh data needed
          
          console.log("Ttile: " + JSON.parse(body).Title);
          console.log("Release Year: " + JSON.parse(body).Year);
          console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
          console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
          console.log("Produced in: " + JSON.parse(body).Country);
          console.log("Language: " + JSON.parse(body).Language);
          console.log("Plot: " + JSON.parse(body).Plot);
          console.log("Actors: " + JSON.parse(body).Actors);
        }

      });
}
function getRandom(){  
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
    var dataArr = data.split(",");
    var trimedArr = [];
    dataArr.forEach((dataItem)=>{
        trimedArr.push(dataItem.trim());
    })
    action = trimedArr[0];
    title = trimedArr[1];
    runAction();
    });
}

function runAction(){

    switch (action) {
        case "concert-this":
            getBandsInTown();
            break;
        case "spotify-this-song":
            getSpotify();
            break;
        case "movie-this":
            getOdmb();
            break;
        case "do-what-it-says":
            getRandom();
            break;

        default:
            break;
    }
}
runAction();