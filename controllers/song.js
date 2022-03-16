const albums = require("../models/albums");
const songs = require("../models/songs");
const Joi = require("joi");

//Create Song
const schema = Joi.object({
  title: Joi.string().alphanum().min(0).max(250).required(),
  length: Joi.string()
    .regex(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/)
    .required(),
  composers: Joi.string().required(),
  singers: Joi.string().required(),
  lyricists: Joi.string().required(),
});
const create = async (req, res) => {
  try {
    const dataToValidate = {
      title: req.body.title,
      length: req.body.length,
      composers: req.body.composers,
      singers: req.body.singers,
      lyricists: req.body.lyricists,
    };
    const schemaerr = schema.validate(dataToValidate);
    if (schemaerr.error) {
      return res.send(schemaerr.error);
    } else {
      const song = await songs.create({
        title: req.body.title,
        length: req.body.length,
        composers: req.body.composers,
        singers: req.body.singers,
        lyricists: req.body.lyricists,
        albumId: req.params.albumId,
      });
      res.status(200).send(song);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "The song is not Created!" });
  }
};

//Songs List
const list = async (req, res) => {
  try {
    const song = await songs.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "albumId"] },
      include: [
        {
          model: albums,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(song);
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "Songs are not display!" });
  }
};

// Get One Song
const getSong = async (req, res) => {
  try {
    const { songId } = req.params;
    const find = await songs.findOne({
      where: { id: songId },
      attributes: { exclude: ["createdAt", "updatedAt", "albumId"] },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(find);
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "The song does not exist." });
  }
};

//Update Song
const schema1 = Joi.object({
  title: Joi.string().alphanum().min(2).max(250).required(),
  length: Joi.string()
    .regex(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/)
    .required(),
  composers: Joi.string().required(),
  singers: Joi.string().required(),
  lyricists: Joi.string().required(),
});
const update = async (req, res) => {
  try {
    const dataToValidate1 = {
      title: req.body.title,
      length: req.body.length,
      composers: req.body.composers,
      singers: req.body.singers,
      lyricists: req.body.lyricists,
    };
    const schemaerr1 = schema1.validate(dataToValidate1);
    if (schemaerr1.error) {
      return res.status(404).send(schemaerr1.error);
    } else {
      const songId = req.params.songId;
      const put = await songs.update(
        {
          title: req.body.title,
          length: req.body.length,
          composers: req.body.composers,
          singers: req.body.singers,
          lyricists: req.body.lyricists,
          albumId: req.params.albumId,
        },
        { where: { id: songId } }
      );
      res.status(200).send(put);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "The song does not update." });
  }
};

//Delete Song
const deleteSong = async (req, res) => {
  try {
    const songId = req.params.songId;
    const song = await songs.findByPk(songId);
    await song.destroy({ where: { albumId: req.params.albumId } });
    res.send("deleted successfully!");
  } catch (err) {
    console.log(err);
    return res.status(404).send({ error: "The song does not Delete." });
  }
};

module.exports = {
  create,
  list,
  getSong,
  update,
  deleteSong,
};
