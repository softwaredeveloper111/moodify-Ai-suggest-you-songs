const express = require("express");
const authRouter = require("./routes/auth.route")
const songRouter = require('./routes/song.route')
const cors = require('cors')
const cookieParser = require("cookie-parser")




const app = express();



/** application middleware */
app.use(express.static('./public'))
app.use(express.json());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}))
app.use(cookieParser())



app.use("/api/auth", authRouter)
app.use("/api/songs",  songRouter)








module.exports = app;