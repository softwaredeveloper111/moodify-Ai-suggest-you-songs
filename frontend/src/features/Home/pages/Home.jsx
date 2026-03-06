import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ExpressionCapture from '../../Expressions/components/Expressioncaptures'
import useSong from "../hooks/useSong";
import Loading from "../../shared/Loading";
import MusicPlayer from "../components/MusicPlayer";
import PlayListItem from "../components/playListItem";
import CurrentMood from '../components/CurrentMood';


const Home = () => {
 
 const {loading,songs,HandlerGetSong} = useSong();

 const [mood,setMood] = useState("nutural");

  const [idx, setIdx]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const [imgErr, setImgErr] = useState({});



 const moodColors = {
  happy:     { from: "#f59e0b", to: "#ef4444" },
  nutural:     { from: "#6366f1", to: "#06b6d4" },
  surprise: { from: "#ec4899", to: "#8b5cf6" },
  sad:       { from: "#3b82f6", to: "#1e3a5f" },
};


 const sharedProps = { songs, moodColors, idx, setIdx, playing, setPlaying, imgErr, setImgErr };



 useEffect(()=>{

  async function getSongs(){
    try {
       await HandlerGetSong(mood)
    } catch (error) {
      console.log(error)
    }
  }

  getSongs()

 },[mood])


 if(loading){
  return <Loading/>
 }
 


 console.log(songs)


  return (
    <div className='home min-h-screen w-screen bg-[#110C1D]'>
       <Navbar/>
       <div className='px-10 flex gap-2 justify-between'>

        <ExpressionCapture onMoodDetected={(detectedMood) => setMood(detectedMood)} />


        <div className='flex flex-col gap-4 justify-between'>
          
         <CurrentMood/>
        { songs &&  <MusicPlayer {...sharedProps}/> }
         
        </div>


       {songs && <PlayListItem  {...sharedProps}/> }

       </div>
       
    </div>
  )
}

export default Home