const mongoose = require("mongoose");




const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true,"username should be required"],
    unique:[true,"username already used"],
  },
  email:{
    type:String,
    required:[true,"email should be required"],
    unique:[true,"email should be required"],
  },
  password:{
    type:String,
    required:[true,"password should be required"],
    unique:[true,"password should be required"],
    select:false
  },
  avatar:{
    type:String,
    default:'https://ik.imagekit.io/a490stdk4/stylish-spectacles-guy-3d-avatar-character-illustrations-png.webp?updatedAt=1770782847473'
  }
})




const userModel = mongoose.model("user", userSchema);





module.exports = userModel;