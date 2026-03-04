const mongoose = require("mongoose");





const songSchema = new mongoose.Schema({
  url:{
    type:String,
    required:[true,'song url should be required'],
  },
  posterUrl:{
    type:String,
    required:[true,"poster url should be required"]
  },
  title:{
    type:String,
    required:[true,"title should be required"]
  },

  artist:{
    type:String,
        required:[true,"artist should be required"]
  }
  ,
 
  mood:{
    type:String,
    enum:{
      values:["sad","happy","nutural","surprise"],
      message:"please select b/w given option"
    },
    required:[true,"mood should be required"]
  }
  
},{timestamps:true})




const songModel = mongoose.model("song", songSchema)




module.exports = songModel





