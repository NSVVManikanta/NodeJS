const express = require("express");
const app = express();
const albumControllers = require("./controllers/album");
const songControllers = require("./controllers/song");

app.use(express.json());


// albums
app.get('/',albumControllers.welcome);

app.post("/albums", albumControllers.create);

app.get("/albums", albumControllers.list);

app.patch("/albums/:albumId", albumControllers.update);

app.delete("/albums/:albumId", albumControllers.deleteAlbum);

// songs

//app.post("/albums/:albumId/songs", songControllers.create);

//app.get("/albums/:albumId/songs/:songId",getSongsByAlbumId);

app.get("/songs", songControllers.list);

app.patch("/albums/:albumId/songs/:songId", songControllers.update);

app.delete("/albums/:albumId/songs/:songId",songControllers.deleteSong);

module.exports = app;