import React from 'react'
import neutralFace from "../../../../public/assets/avatar.png";
import happyFace from "../../../../public/assets/happy-face.png";
import sadFace from "../../../../public/assets/sad.png";
import surprisedFace from "../../../../public/assets/surprised.png";

const CurrentMood = ({mood="surprise"}) => {

  
  const rand =  Math.floor(Math.random() * 11) + 90;
  
  const MOOD_META = [
   { emoji: happyFace, label: "happy"},
     { emoji: sadFace, label: "sad"  },
   { emoji: surprisedFace, label: "surprise" },
   { emoji: neutralFace, label: "nutural" },
  ]

  const useMoodData = MOOD_META.find(item=>item.label===mood)


  return (
   <div className='upper current-mood current-mood w-160 h-68 bg-linear-to-r from-[#171718] to-[#0f2744]  rounded-xl py-10 px-20 flex justify-between'>
    <div>
          <h4 className='text-sm text-[#126682] font-bold'>CURRENT MOOD ANALYSIS</h4>
          <h1 className='mt-2 text-[3rem] text-white'>{useMoodData.label}</h1>

          <div className='mt-2 flex items-center gap-2 '>
            <div className='w-50 h-1.5 rounded-full bg-gray-400 overflow-hidden'> 
              <div   style={{ width: `${rand}%` }} className={`inner  h-full bg-linear-to-r from-purple-500 to-cyan-400 `}></div>
             </div>
            <span className='text-sm mt-1.5 inline-block text-[#1E869C] font-semibold'>{rand}% match</span>
          </div>
    </div>
    <div>
      <img className='h-30 w-30 object-cover' src={useMoodData.emoji} alt="" />
    </div>

    </div>
  )
}

export default CurrentMood