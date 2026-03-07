import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ExpressionCapture from '../../Expressions/components/Expressioncaptures'
import MoodGraph from "../components/MoodGraph";
import useSong from "../hooks/useSong";
import Loading from "../../shared/Loading";
import MusicPlayer from "../components/MusicPlayer";
import PlayListItem from "../components/playListItem";
import CurrentMood from '../components/CurrentMood';
import useAuth from "../../auth/hooks/useAuth";


const Home = () => {
  const {handlerGetMe,user} = useAuth();
  const { loading, songs, HandlerGetSong } = useSong();
  const [mood, setMood]     = useState("nutural");
  const [idx, setIdx]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const [imgErr, setImgErr] = useState({});

  const moodColors = {
    happy:    { from: "#f59e0b", to: "#ef4444" },
    nutural:  { from: "#6366f1", to: "#06b6d4" },
    surprise: { from: "#ec4899", to: "#8b5cf6" },
    sad:      { from: "#3b82f6", to: "#1e3a5f" },
  };

  useEffect(() => {
  handlerGetMe();
}, []);

  useEffect(() => {
    setIdx(0);            // ✅ reset idx on every mood change — prevents songs[idx] undefined crash
    setPlaying(false);
    HandlerGetSong(mood).catch(console.error);
  }, [mood]);

  const sharedProps = { songs, moodColors, idx, setIdx, playing, setPlaying, imgErr, setImgErr };
  
  console.log(mood)

  return (
   
    <div className='home min-h-screen w-screen  bg-[#110C1D]'>
     <Navbar user={user}/>
     <div className='px-10 flex flex-col sm:flex-row gap-2 sm:gap-10 justify-between'>

       
        <ExpressionCapture onMoodDetected={(detectedMood) => setMood(detectedMood)} />

        <div className='flex flex-col gap-2  justify-between min-w-0 overflow-hidden'>
          <CurrentMood mood={mood} />
          <MoodGraph mood={mood} />
          {loading ? <Loading /> : songs && <MusicPlayer {...sharedProps} />}
        </div>

        {!loading && songs && <PlayListItem {...sharedProps} />}
       

      </div> 
    </div>
  );
};

export default Home