const albums = require('../models/albums');
const songs = require('../models/songs');

const welcome = (req, res) => {
  res.status(200).send("Music Library API. Built by manikanta.");
};

const create = (req, res) => {
  const { songsId } = req.params;

  songs.findByPk(songsId).then((songs) => {
    if (!songs) {
      res.status(404).json({ error: "The song could not be found." });
    } else {
      songs.create({
        title:req.body.title,
        length:req.body.length,
        composers:req.body.composers,
        singers:req.body.singers,
        lyricists:req.body.lyricists
      }).then((album) => {
        album.setSongs(songs).then((album) => {
          res.status(201).json(album);
        });
      });
    }
  });
};

const list = (req, res) => {
    albums.findAll({
      include: [
        {
          model: songs,
          as: "songs",
        },
      ],
    }).then((albums) => {
      res.status(200).send(albums);
    });
  };

  const update = (req, res) => {
    const { albumId } = req.params;
    albums.update(req.body, { where: { id: albumId } }).then(
      ([numOfRowsUpdated]) => {
        if (numOfRowsUpdated === 0) {
          res.status(404).json({ error: "The album does not exist." });
        } else {
          res.status(200).json([numOfRowsUpdated]);
        }
      }
    );
  };

  const deleteAlbum = (req, res) => {
    const { albumId } = req.params;
    albums.destroy({ where: { id: albumId } }).then((numOfRowsDeleted) => {
      if (numOfRowsDeleted === 0) {
        res.status(404).json({ error: "The album does not exist." });
      }
      res.status(204).json(numOfRowsDeleted);
    });
  };

  module.exports = { welcome,create, list,  update, deleteAlbum };