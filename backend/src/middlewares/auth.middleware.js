const jwt = require("jsonwebtoken")
const redis = require('../config/redis.connection')






async function identifierUser(req,res,next){
  const token = req.cookies?.JWT_TOKEN;
  if(!token){
    return res.status(401).json({
      success:false,
      message:"unthorizec access",
      error:{
        code:"UNTHORIZED",
        details:null
      }
    })
  }


  const isTokenBlacklisted  = await redis.get(token)
  if(isTokenBlacklisted){
    return res.status(401).json({
      success:false,
      message:"unthorized acess",
      error:{
        code:"UNAUTHORIZED",
        details:null
      }
    })
  }


  try {

   const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

   req.user = decoded


   next()

    
  } catch (error) {
    return res.status(401).json({
      success:false,
      message:"unthorized acesss",
      error:{
        code:"UNAUTHORIZED",
        details:null
      }
    })
  }

}







module.exports =  identifierUser