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
    var bandKey = keys.bandsInTown.id;
   var queryUrl=
    "https://rest.bandsintown.com/artists/" + title + "/events?app_id=" +bandKey;
    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            var output = JSON.parse(body);
            
            if (output.length == 0){
                console.log(`No matching concerts for ${title}`);
                return;
            }
            console.log(`\nUpcoming concerts for ${title}:`);
            output.forEach((item) =>{
                console.log("\nName of the Venue: " + item.venue.name);
                console.log("Venue location: " + item.venue.city + ", " + (item.venue.region || item.venue.country));
                console.log("Time of Event: " + moment(item.datetime).format("MM/DD/YYYY"));
            });
            
        }

      });
    
}
function getSpotify(){
    if (!title) {
        title = "Ace of Base";
    }
    
    spotify.search({ type: 'track', query: title, limit: 10  }, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }


        for (var i = 0; i < data.tracks.items.length; i++ ) {
            var artistArr = data.tracks.items[i].artists;
            var artistName = [];
               artistArr.forEach((item) => {
                   artistName.push(item.name);
                   console.log(`artists : ${item.name}`);

               });
               console.log(`\nartists : ${artistName.join(", ")}`);
                console.log(`album_name : ${data.tracks.items[i].album.name}`);
                console.log(`song name : ${data.tracks.items[i].name}`);
                console.log(`preview_url : ${data.tracks.items[i].preview_url}`);
            
        }
        
    });
}
function getOdmb(){
    if (!title) {
        title = "Mr. Nobody";
        console.log(`\nIf you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>`);
        console.log(`\nIt's on Netflix`);
    }
    var odmbKey = keys.odmb.id;
    var queryUrl = `http://www.omdbapi.com/?t=${title}&apikey=${odmbKey}`;
        request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
      
          // Parse the body of the site and recover teh data needed
          var output =  JSON.parse(body);
          console.log("\nTtile: " + output.Title);
          console.log("Release Year: " + output.Year);
          console.log("IMDB Rating: " + output.imdbRating);
          if (output.Ratings[1]){
             console.log("Rotten Tomatoes Rating: " + output.Ratings[1].Value);
          }
          console.log("Produced in: " + output.Country);
          console.log("Language: " + output.Language);
          console.log("Plot: " + output.Plot);
          console.log("Actors: " + output.Actors);
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