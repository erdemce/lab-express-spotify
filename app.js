require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token'])
  })
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res) => {
  res.render("partials/search",{
    style: "style.css"
  })
})

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      //console.log('The received data from the API: ', data.body.artists.items[0]);
      let allArtists = data.body.artists.items
      res.render("partials/artist-search-results", {
        allArtists: allArtists,
        style: "style.css"
      })

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:id", (req, res) => {
  let id = req.params.id;
  spotifyApi.getArtistAlbums(id)
    .then(data => {
      //console.log('The received data from the API: ', data.body.items[0].images);
      let allAlbums = data.body.items
      res.render("partials/albums", {
        allAlbums: allAlbums,
        style: "style.css"
      })

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/album/:id/tracks", (req, res) => {
  let id = req.params.id;
  spotifyApi.getAlbumTracks(id)
    .then(data => {
      //console.log('The received data from the API: ', data.body.items.preview_url);
      let allTracks = data.body.items
      res.render("partials/tracks", {
        allTracks:allTracks,
        style: "style.css"
      })

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));