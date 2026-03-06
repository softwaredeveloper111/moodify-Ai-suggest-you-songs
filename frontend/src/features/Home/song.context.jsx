import React, { createContext, useState } from 'react'
export const SongContextProvider = createContext()


const SongContext = ({children}) => {


  const [loading,setLoading] = useState(false)
  const [songs,setSongs] = useState(null)

  return (
    <SongContextProvider value={{loading,setLoading,songs,setSongs}}>
      {children}
    </SongContextProvider>
  )
}

export default SongContext