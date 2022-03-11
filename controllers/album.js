const albums = require('../models/albums');
const songs = require('../models/songs');
const {sequelize} = {albums,songs};
const joi = require('@hapi/joi');

const welcome = (req, res) => {
  res.status(200).send("Music Library API. Built by manikanta.");
};

/*const create = async(req, res) => {
  let t ;
  try{
      t = await sequelize.transaction(); 
      const Album =await albums.create({
        title:req.body.title,
        year:req.body.year
      }, {transaction:t});
      await albums.createsongs({
        title:req.body.title,
        length:req.body.length,
        composers:req.body.composers,
        singers:req.body.singers,
        lyricists:req.body.lyricists,
        albumId:req.body.albumId,
      },{transaction:t});
      await t.commit();
      res.send(Album);
      } catch (error) {
       await t.rollback()
     }
    };*/
    const schema = joi.object({
      title:joi.string().min(3).required()
    });
    const create = (req, res) => {
      const schemaerr = schema.validate(
        req.body.title
        );
      if(schemaerr.error){
        return res.send(schemaerr.error);
      }else{
      albums.create({
        title:req.body.title,
        year:req.body.year
      }).then((album) => {
        res.status(200).send(album);
      }).catch(err=>{
        console.log(err);
      });
    }
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

  module.exports = { welcome, list, create, update, deleteAlbum };
