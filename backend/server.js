require("dotenv").config()
const app = require('./src/app');
const connectToDB = require("./src/config/database.connection")
require("./src/config/redis.connection")



const PORT = process.env.PORT || 7000
connectToDB()





app.listen(PORT,()=>{
  console.log(`server is running at ${PORT}`)
})