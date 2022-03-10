const albums = require('../models/albums');
const songs = require('../models/songs');

const welcome = (req, res) => {
  res.status(200).send("Music Library API. Built by manikanta.");
};

const create = (req, res) => {
      albums.create({
        title:req.body.title,
        year:req.body.year
      }).then((album) => {
        res.status(200).send(album);
      }).catch(err=>{
        console.log(err);
      });
    };

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
    }).catch(err=>{
      console.log(err);
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
