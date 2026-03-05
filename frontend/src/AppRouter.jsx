import { Routes,Route } from "react-router-dom";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";


import React from 'react'
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";

const AppRouter = () => {
  return (
     <Routes>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={ <ProtectedRoute><h1>Home</h1></ProtectedRoute> }/>
     </Routes>
  )
}

export default AppRouter