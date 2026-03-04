const songModel = require('../models/song.model')
const NodeID3 = require('node-id3')
const storageServices = require('../services/storage.service')




/** upload a songe, controller */
async function uploadSong(req,res){
   try {

    const {mood} = req.query
    const songFileBuffer = req.file.buffer

    const tags = NodeID3.read(songFileBuffer);


    

  const  [songFile,PosterFile] =   await Promise.all([

  storageServices.uploadFile({
      buffer:songFileBuffer,
      filename:`${tags.title}.mp3`,
      folder:'/cohort-2/moodify/songs'
    }) ,

  storageServices.uploadFile({
      buffer:tags.image.imageBuffer,
      filename:`${tags.title}.jpeg`,
      folder:'/cohort-2/moodify/posters'
    }) 

  ])
  
  const song = await songModel.create({
     url:songFile.url,
    posterUrl: PosterFile.url,
    artist:tags. artist,
     title:tags.title,
     mood:mood
  })

  res.status(200).json({
    success:true,
    message:"song uploaded sucessfully",
    song
  })


   
    
   } catch (error) {
    return res.status(500).json({
      success:false,
      message:`${error.message}`,
      error:{
        code:"INTERNAL SERVER ERROR",
        details:null
      }
    })
   }
}














module.exports = {uploadSong}