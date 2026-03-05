import React, { createContext, useState } from 'react'
export const  authContextProvider = createContext()


const AuthContext = ({children}) => {

  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)


  return (
    <authContextProvider.Provider value={{user,setUser,loading,setLoading}}>
      {children}
    </authContextProvider.Provider>
  )
}

export default AuthContext