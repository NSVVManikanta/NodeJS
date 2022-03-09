const albums = require('../models/albums');
const songs = require('../models/songs');


const create = (req,res)=>{
  songs.create({
    title:req.body.title,
    length:req.body.length,
    composers:req.body.composers,
    singers:req.body.singers,
    lyricists:req.body.lyricists,
    include: [
      {
        model: albums
      }
    ],
  }).then((songs) => {
    res.status(200).send(songs);
  }).catch(err=>{
    console.log(err);
  });
};


const list = (req, res) => {
    songs.findAll({
      include: [
        {
          model: albums
        }
      ],
    }).then((songs) => {
      res.status(200).send(songs);
    }).catch(err=>{
      console.log(err);
    });
};

  const update = (req, res) => {
    const { songId } = req.params;
    Song.update(req.body, { where: { id: songId } }).then(
      ([numOfRowsUpdated]) => {
        if (numOfRowsUpdated === 0) {
          res.status(404).json({ error: "The song does not exist." });
        } else {
          res.status(200).json([numOfRowsUpdated]);
        }
      }
    );
  };

  const deleteSong = (req, res) => {

    const { songId } = req.params;
    Song.destroy({ where: { id: songId } }).then((numOfRowsDeleted) => {
      if (numOfRowsDeleted === 0) {
        res.status(404).json({ error: "The song does not exist." });
      }
      res.status(204).json(numOfRowsDeleted);
    });
  };
  
  module.exports = {
    create,
    list,
   // getSongsByAlbumId,
    update,
    deleteSong,
  };