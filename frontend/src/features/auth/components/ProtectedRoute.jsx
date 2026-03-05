import React from 'react'
import useAuth from "../hooks/useAuth";
import Loading from "../../shared/Loading";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({children}) => {
 

  const {loading,user}  = useAuth();

  if(loading){
    return <Loading/>
  }

  if(!user){
    return <Navigate to="/login"/>
  }

  return children
    
  
}

export default ProtectedRoute