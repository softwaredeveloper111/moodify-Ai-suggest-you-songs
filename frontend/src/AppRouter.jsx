import { Routes,Route } from "react-router-dom";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import Home from "./features/Home/pages/Home";


import React from 'react'
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";

const AppRouter = () => {
  return (
     <Routes>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={ <ProtectedRoute><Home/></ProtectedRoute> }/>
     </Routes>
  )
}

export default AppRouter