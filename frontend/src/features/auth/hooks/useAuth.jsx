import React, { useContext, useEffect } from 'react'
import { authContextProvider } from "../auth.context";
import {  registerAPI, loginAPI,getMeAPI, logoutAPI } from "../services/auth.api";


const useAuth = () => {

 const {user,setUser,loading,setLoading} =   useContext(authContextProvider)


 async function handlerLogin(data){
   setLoading(true)
   try {
      
    const response = await loginAPI(data);
    setUser(response.user)
    return {success:true}

   } catch (error) {
    return {
      success:false,
      message:`${error.message} ❌ something went wrong `
    }
   }
   finally{
    setLoading(false)
   }
 }


  
 async function handlerRegister(data){
  setLoading(true)
  try {

    const response = await registerAPI(data);
    setUser(response.user);
    return {success:true}
    
  } catch (error) {
    return {
      success:false,
      message:`${error.message}, ❌ something went wrong`
    }
  }
  finally{
    setLoading(false);

  }
 }



 async function handlerGetMe(){
  setLoading(true);
  try {
      
    const response = await getMeAPI();
    setUser(response.user);
    return {success:true};

  } catch (error) {
    return {
      success:false,
      message:`${error.message}❌ something went wrong`
    }
  }
  finally{
    setLoading(false)
  }
 }



 async function handlerLogout(){
  setLoading(true)
  try {
    await logoutAPI();
    setUser(null)
    return {success:true}
  } catch (error) {
    return {
      success:false,
      message:`${error.message} ❌ something went wrong`
    }
  }
  finally{
    setLoading(false)
  }
 }

 useEffect(()=>{
  handlerGetMe()
 },[])


  return (
     { handlerLogin, handlerRegister ,handlerGetMe,handlerLogout,loading,user  }
  )
}

export default useAuth