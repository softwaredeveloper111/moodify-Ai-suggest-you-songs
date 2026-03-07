import React from 'react'
import useAuth from "../../auth/hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";




const Navbar = ({user}) => {

console.log(user)

const navigate = useNavigate()

 const {handlerLogout,loading}  = useAuth()

 async function logoutEventHandler(){
  try {

  await handlerLogout();
  navigate("/login")
  toast.success('logout succesfully')
    
  } catch (error) {
    console.log(error.message);
    toast.error("someting went wrong")
  }

}

  return (
    <div className='w-full sm:px-10 px-5 py-3 bg[#141923] border-b-2 border-gray-900 flex justify-between items-center mb-7'>
         <div className='flex items-center gap-2'>
          <i  class="ri-bar-chart-fill text-2xl text-[#6935C7] font-bold"></i>
          <h3 className='sm:text-2xl text-xl font-bold bg-linear-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent'>Moodify</h3>
         </div>


         <div className="flex gap-2 items-center">  
          
          <div className='flex flex-col '>
            <span className='sm:text-lg text-sm font-normal text-white'>{user.username}</span>
            <span onClick={()=>logoutEventHandler()} className='cursor-pointer text-sm  text-blue-400'>logout</span>
          </div>
          <div>
            <img className='sm:h-12 sm:w-12 h-10 w-10  rounded-full overflow-hidden border-2 border-gray-700' src={user.avatar} alt="" />
          </div>
        
         </div>
    </div>
  )
}

export default Navbar