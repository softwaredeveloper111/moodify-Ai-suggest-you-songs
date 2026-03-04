const mongoose = require("mongoose");





async function connectToDB(){
  try {

   await mongoose.connect(process.env.MONGO_URI)
   console.log("connected to database")
    
  } catch (error) {
    
    console.log(`connection problem ❌ with database , ${error.message}`)
  }
}



module.exports = connectToDB