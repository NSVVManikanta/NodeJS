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


let albumID=null;
sequelize
.sync()
.then((result)=>{
   // return albums.create({title: "Gethagovindam", year: "2022"})
    console.log(result);
})
/*.then(albums =>{
    albumID = albums.id;
    console.log('First Album created '+albums);
    //return songs.create({title: " Inkem",length: "2",composers: "DSP",singers: "sidsriram",lyricists: "Dsp"});
    //return albums.createSongs({title: "Inkem Inkem",length: "2",composers: "DSP",singers: "sidsriram",lyricists: "Dsp"});
})
.then(song=>{
    console.log('song is'+song);
})
  /*  return song.findAll({ where : albumID});
})
.then(songs=>{
    console.log('All songs are'+songs);
})*/
.catch((err)=>{
    console.log(err);
});

// albums
app.get('/',albumControllers.welcome);

app.post("/albums", albumControllers.create);

app.get("/albums", albumControllers.list);

app.patch("/albums/:albumId", albumControllers.update);

app.delete("/albums/:albumId", albumControllers.deleteAlbum);

// songs

app.post("/albums/:albumId/songs", songControllers.create);

//app.get("/albums/:albumId/songs/:songId",getSongsByAlbumId);

app.get("/songs", songControllers.list);

app.patch("/albums/:albumId/songs/:songId", songControllers.update);

app.delete("/albums/:albumId/songs/:songId",songControllers.deleteSong);



app.listen(8080,()=>{
    console.log('Sever running on 8080!');
});