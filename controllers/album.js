const albums = require('../models/albums');
const songs = require('../models/songs');
const { sequelize } = require('../models/songs');
const Joi = require('joi');

//Welcome Page
const welcome = (req, res) => {
  res.status(200).send("Music Library API. Built by manikanta.");
};

//Create Album 
const schema = Joi.object({
  title :Joi.string().alphanum().min(0).max(250).required(),
  year:Joi.number().integer().min(1900).max(2022).required(),
  songs:Joi.array().items(Joi.object({
    title :Joi.string().alphanum().min(2).max(250).required(),
    length : Joi.string().regex( /(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/).required(),
    composers:Joi.string().required(),
    singers:Joi.string().required(),
    lyricists:Joi.string().required(),
}))
});
const create = async (req, res) => {
  const dataToValidate = {
    title:req.body.title,
    year:req.body.year,
    songs:req.body.songs,
  }

  const schemaerr = schema.validate(dataToValidate);
  if(schemaerr.error){
    return res.send(schemaerr.error);
  }else{
  let t;
  try {
    t = await sequelize.transaction();
    console.log("entered", t);
    const Album = await albums.create({
      title: req.body.title,
      year: req.body.year
    }, { transaction: t });
    const songData = req.body.songs;
    const preparedSongObjArr = songData.map(song => {
      song.albumId = Album.id
      return song
    });
    console.log(preparedSongObjArr);
    await songs.bulkCreate(preparedSongObjArr, { transaction: t });
    await t.commit();
    res.send(Album);
  } catch (error) {
    await t.rollback()
    console.log(error);
  }
}
};

//Album List
const list = (req, res) => {
  albums.findAll({
    include: [
      {
        model: songs
      }
    ],
    order: [
      ["createdAt", "DESC"],
    ],
  }).then((albums) => {
    res.status(200).send(albums);
  }).catch(err => {
    console.log(err);
  });
};

//Update Album
const schema1 = Joi.object({
  title :Joi.string().alphanum().min(2).max(250).required(),
  year:Joi.number().integer().min(1900).max(2022).required(),
});
const update = (req, res) => {
  const dataToValidate1 = {
    title:req.body.title,
    year:req.body.year,
  }
  const schemaerr1 = schema1.validate(dataToValidate1);
  if(schemaerr1.error){
    return res.send(schemaerr1.error);
  }else{
  const { albumId } = req.params;
  albums.update({
    title: req.body.title,
    year: req.body.year
  },
    { where: { id: albumId } }).then(
      ([numOfRowsUpdated]) => {
        if (numOfRowsUpdated === 0) {
          res.status(404).json({ error: "The album does not exist." });
        } else {
          res.status(200).json([numOfRowsUpdated]);
        }
      }
    );
};
};

//Delete Album
const deleteAlbum = (req, res) => {
  const { albumId } = req.params;
  albums.destroy({ where: { id: albumId } }).then((numOfRowsDeleted) => {
    if (numOfRowsDeleted === 0) {
      res.status(404).json({ error: "The album does not exist." });
    }
    res.status(204).json(numOfRowsDeleted);
  });
};

module.exports = { welcome, list, create, update, deleteAlbum };
