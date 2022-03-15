const albums = require('../models/albums');
const songs = require('../models/songs');
const Joi = require('joi');

//Create Song
const schema = Joi.object({
  title :Joi.string().alphanum().min(0).max(250).required(),
    length : Joi.string().regex( /(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/).required(),
    composers:Joi.string().required(),
    singers:Joi.string().required(),
    lyricists:Joi.string().required(),
});
const create = (req,res)=>{
  const dataToValidate = {
    title:req.body.title,
    length:req.body.length,
    composers:req.body.composers,
    singers:req.body.singers,
    lyricists:req.body.lyricists,
  }
  const schemaerr = schema.validate(dataToValidate);
  if(schemaerr.error){
    return res.send(schemaerr.error);
  }else{
  songs.create({
    title:req.body.title,
    length:req.body.length,
    composers:req.body.composers,
    singers:req.body.singers,
    lyricists:req.body.lyricists,
    albumId :req.params.albumId,
  }).then((songs) => {
    res.status(200).send(songs);
  }).catch(err=>{
    console.log(err);
  });
}
 };

//Songs List
const list = (req, res) => {
    songs.findAll({
      include: [
        {
          model: albums
        }
      ],
      order: [
        ["createdAt", "DESC"],
      ],
    }).then((songs) => {
      res.status(200).send(songs);
    }).catch(err=>{
      console.log(err);
    });
};

// Get One Song
const getSong = (req, res) => {
  const { songId } = req.params;
  songs.findOne({ where: { id: songId },
    order: [
      ["createdAt", "DESC"],
    ], 
    })
    .then((song) => {
      if (!song) {
        res.status(404).send({ error: "The song does not exist." });
      } else {
        res.status(200).send(song);
      }
    }
  );
};

//Update Song
const schema1 = Joi.object({
  title :Joi.string().alphanum().min(2).max(250).required(),
  length :Joi.string().regex( /(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/).required(),
  composers:Joi.string().required(),
  singers:Joi.string().required(),
  lyricists:Joi.string().required(),
});
  const update = (req, res) => {
    const dataToValidate1 = {
      title:req.body.title,
      length:req.body.length,
      composers:req.body.composers,
      singers:req.body.singers,
      lyricists:req.body.lyricists,
    }
    const schemaerr1 = schema1.validate(dataToValidate1);
  if(schemaerr1.error){
    return res.send(schemaerr1.error);
  }else{
    const { songId } = req.params;
    songs.update({
      title:req.body.title,
      length:req.body.length,
      composers:req.body.composers,
      singers:req.body.singers,
      lyricists:req.body.lyricists,
      albumId :req.params.albumId}, { where: { id: songId } }).then(
      ([numOfRowsUpdated]) => {
        if (numOfRowsUpdated === 0) {
          res.status(404).send({ error: "The song does not exist." });
        } else {
          res.status(200).send([numOfRowsUpdated]);
        }
      }
    );
  };
};

//Delete Song
const deleteSong = async(req, res) => {
  try{
    const albumId= req.params.albumId;
    const album = await albums.findByPk(albumId)
      if(!album){
        return res.status(404).send({ error: "The album does not exist." });
      }
   const  songId  = req.params.songId;
  const song = await songs.findByPk(songId)
  if(!song){
    return res.status(404).send({ error: "The song does not exist." });
  }
  await song.destroy();
  res.send("deleted song successfully!");
}catch(err){
console.log(err);
}
}
  
  module.exports = {
    create,
    list,
    getSong,
    update,
    deleteSong,
  };
