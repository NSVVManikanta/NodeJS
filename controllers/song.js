const albums = require('../models/albums');
const songs = require('../models/songs');
const joi = require('@hapi/joi');

const schema = joi.object().keys({
  title :joi.string().required(),
  composers:joi.string().required(),
  singers:joi.string().required(),
  lyricists:joi.string().required(),
});

const create = (req,res)=>{
  const schemaerr = schema.validate(
    req.body.title,
    req.body.composers,
    req.body.singers,
    req.body.lyricists,
    );
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


  const update = (req, res) => {
    const { songId } = req.params;
    songs.update(req.body, { where: { id: songId } }).then(
      ([numOfRowsUpdated]) => {
        if (numOfRowsUpdated === 0) {
          res.status(404).send({ error: "The song does not exist." });
        } else {
          res.status(200).send([numOfRowsUpdated]);
        }
      }
    );
  };

  const deleteSong = (req, res) => {

    const { songId } = req.params;
    songs.destroy({ where: { id: songId } }).then((numOfRowsDeleted) => {
      if (numOfRowsDeleted === 0) {
        res.status(404).send({ error: "The song does not exist." });
      }
      res.status(200).send(numOfRowsDeleted);
    });
  };
  
  module.exports = {
    create,
    list,
    getSong,
    update,
    deleteSong,
  };
