import React, { useContext } from 'react'
import {moodGetSongAPI} from "../services/mood.api";
import {SongContextProvider} from "../song.context";


const useSong = () => {


 const {loading,setLoading,songs,setSongs} =  useContext(SongContextProvider)


 async function HandlerGetSong(mood){
  setLoading(true)
   try {

    const response = await moodGetSongAPI(mood);
    setSongs(response.songs)
    return {success:true}
    
   } catch (error) {
    return {
      success:false,
      message:`${error.message} ❌ something went wrong`
    }
   }
   finally{
    (setLoading(false))
   }
 }

  return (
    {loading,songs,HandlerGetSong}
  )
}

export default useSong