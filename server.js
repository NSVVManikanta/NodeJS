const express = require('express'); 
const sequelize =require('./util/database');
const albums = require('./models/albums');
const songs = require('./models/songs');
const albumControllers = require("./controllers/album");
const songControllers = require("./controllers/song");
const app = express();

app.use(express.json());

albums.hasMany(songs,{ foreignKey: 'albumId' });
songs.belongsTo(albums);

sequelize
.sync()
.then((result)=>{
    console.log(result);
}).catch(err=>console.log(err));

// albums
app.get('/',albumControllers.welcome);

app.post("/albums", albumControllers.create);

app.get("/albums", albumControllers.list);

app.put("/albums/:albumId", albumControllers.update);

app.delete("/albums/:albumId", albumControllers.deleteAlbum);

// songs

app.post("/albums/:albumId/songs", songControllers.create);

app.get("/albums/:albumId/songs/:songId",songControllers.getSong);

app.get("/songs", songControllers.list);

app.put("/albums/:albumId/songs/:songId", songControllers.update);

app.delete("/albums/:albumId/songs/:songId",songControllers.deleteSong);


app.listen(8080,()=>{
    console.log('Sever running on 8080!');
});
