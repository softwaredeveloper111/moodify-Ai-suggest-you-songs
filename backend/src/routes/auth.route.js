const express = require("express");
const {registerController, loginController, getMeController,logoutController} = require("../controllers/auth.controller")
const identifierUser = require("../middlewares/auth.middleware")





const authRouter = express.Router();




/**
 * @method        POST
 * @route         /api/auth/register
 * @description    new user can register and store their information in database and get a token
 * @body      {username,email,password} = req.body
 */

authRouter.post('/register',registerController)




/**
 * @method      POST
 * @route       /api/auth/login
 * @description    registered user can login by username or email and password, and get a token.
 * @body          {username,email,password} = req.body;
 */

authRouter.post("/login", loginController)






/**
 * @method    GET
 * @route     /api/auth/me
 * @description      user get their profile data account
 */

authRouter.get("/me", identifierUser, getMeController)







/**
 * @method    POST
 * @route     /api/authlogout
 * @description  user can sucessfully logout
 */

authRouter.post("/logout", identifierUser , logoutController)

















module.exports = authRouter;