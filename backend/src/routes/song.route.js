const express = require("express");
const identifierUser = require('../middlewares/auth.middleware')
const {uploadSong , getAllSong} = require('../controllers/song.controller')
const upload = require('../middlewares/multer.middleware')





const songRouter = express.Router();




/**
 * @method          POST
 * @route           /api/songs/
 * @description     artist can create a new song
 * @body            {mood,song} = req.body
 */

songRouter.post("/", identifierUser , upload.single("songFile") , uploadSong )





/**
 * @method      GET
 * @route        /api/songs
 * @description     user can get all the songs playlinst according to the mood
 * 
 */
songRouter.get("/", identifierUser , getAllSong )






module.exports = songRouter 