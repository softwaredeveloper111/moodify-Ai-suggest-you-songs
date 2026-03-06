import React from 'react'

const Navbar = () => {
  return (
    <div className='w-full px-10 py-3 bg[#141923] border-b-2 border-gray-900 flex justify-between items-center mb-15'>
         <div className='flex items-center gap-2'>
          <i  class="ri-bar-chart-fill text-2xl text-[#6935C7] font-bold"></i>
          <h3 className='text-2xl font-bold bg-linear-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent'>Moodify</h3>
         </div>


         <div>
         
         <div className='searbar w-130 flex items-center gap-3 bg-[#272639] rounded-full px-5 py-3 text-zinc-400' >
          <i class="ri-search-line"></i>
          <input className='text-zinc-400 text-sm h-full w-full grow outline-none border-none' type="search" placeholder='search for songs , artist or moods' />
         </div>

         </div>


         <div className="flex gap-2 items-center">  
          
          <div className='flex flex-col '>
            <span className='text-lg font-normal text-white'>Roko</span>
            <span className='cursor-pointer text-sm  text-blue-400'>logout</span>
          </div>
          <div>
            <img className='h-12 w-12  rounded-full overflow-hidden border-2 border-gray-700' src="https://i.pinimg.com/1200x/63/de/3b/63de3bbf1b1e360232183d9b057deec4.jpg" alt="" />
          </div>
        
         </div>
    </div>
  )
}

export default Navbar