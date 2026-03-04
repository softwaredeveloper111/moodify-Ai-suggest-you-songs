const express = require("express");
const identifierUser = require('../middlewares/auth.middleware')
const {uploadSong} = require('../controllers/song.controller')
const upload = require('../middlewares/multer.middleware')





const songRouter = express.Router();




/**
 * @method          POST
 * @route           /api/songs/
 * @description     artist can create a new song
 * @body            {mood,song} = req.body
 */

songRouter.post("/", identifierUser , upload.single("songFile") , uploadSong )








module.exports = songRouter 