const express = require('express'); 
const sequelize =require('./util/database');
const Album = require('./models/album');
const Songs = require('./models/songs');
const app = express();

Album.hasMany(Songs);


sequelize
.sync({force:true})
.then((result)=>{
    console.log(result);
})
.catch((err)=>{
    console.log(err);
});

//albums
app.post('/albums',(req,res)=>{
    console.log('creating albums along with song info');

});

app.get()


module.exports = app;