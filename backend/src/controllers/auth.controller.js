const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const redis = require("../config/redis.connection")






/** user register,  controller*/

async function registerController(req,res){
   
  try {
    
   
    const {username,email,password} = req.body;

    const isUserAlreadyRegister = await userModel.findOne({
      $or:[
        {username},
        {email}
      ]
    })


    if(isUserAlreadyRegister){
      return res.status(400).json({
        success:false,
        message:"user already registered",
        error:{
          code:"BAD REQUEST",
          details:null
        }
      })
    }


    const hashPassword = await bcrypt.hash(password, Number(process.env.GEN_SALT));
    
    const user = await userModel.create({
      username,
      email,
      password:hashPassword
    })

    const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET_KEY);

    res.cookie("JWT_TOKEN",token)

    const userObj = user.toObject();
    delete userObj.password
   
    res.status(201).json({
      success:true,
      message:"user sucessfully registered",
      user:userObj

    })


  } catch (error) {
    return res.status(500).json({
      success:false,
      message:`INTERNAL SERVER ERROR , ${error.message}`,
      error:{
        code:"INTERNAL SERVER ERROR",
        details:null
      }
    })
  }

}






/** user login, controller */

async function loginController(req,res){
  try {

    const {identifier,password} = req.body;

    const isUserRegistered = await userModel.findOne({
      $or:[
        {email:identifier},
        {username:identifier}
      ]
    }).select("+password")


    if(!isUserRegistered){
     return  res.status(400).json({
        success:false,
        message:"invalid credentials",
        error:{
          code:"BAD REQUEST",
          details:{
            identifer:`user not found`
          }
        }
      })
    }



    const isPasswordMatch = await bcrypt.compare(password,isUserRegistered.password)
    if(!isPasswordMatch){
      return res.status(400).json({
        success:false,
        message:"invalid credentials",
        errro:{
          coDe:"BAD REQUEST",
          details:{
             password:"wrong password"
          }
        }
      })
    }
   
    

    const token = jwt.sign({id:isUserRegistered.id,username:isUserRegistered.username} , process.env.JWT_SECRET_KEY)
   
    res.cookie("JWT_TOKEN",token)

    const userObj = isUserRegistered.toObject();
    delete userObj.password

    res.status(200).json({
      success:true,
      message:'user logged in sucessfully',
      user:userObj
    })



    
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:`INTERNAL SERVER ERROR,${error.message}`,
      error:{
        code:"INTERNAL SERVER ERROR",
        details:null
      }
    })
  }
}





/** get me , controller */

async function  getMeController(req,res){
  try {

    const userId = req.user.id;
    const user  = await userModel.findById(userId);
    res.status(200).json({
      success:true,
      message:"user fetch successfully",
      user
    })
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:`INTERNAL SERVER ERROR , ${error.message}`,
      error:{
        code:"INTERNAL SERVER ERROR",
        details:null
      }

    })
  }
}








/** user logout , controller */
async function logoutController(req,res){
   try {
    
      const token = req.cookies?.JWT_TOKEN;
      await redis.set(token,Date.now().toString(), "EX" , 60*60)
      res.clearCookie("JWT_TOKEN")
      res.status(200).json({
        success:true,
        message:"user logout successfully"
      })

   } catch (error) {
    res.status(500).json({
      success:false,
      message:`INTERNAL SERVER ERROR, ${error.message}`,
      error:{
        code:"INTERNAL SERVER ERROR",
        details:null
      }
    })
   }
}











module.exports = {
  registerController,
  loginController,
  getMeController,
  logoutController
  
}