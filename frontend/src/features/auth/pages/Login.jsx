import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import Loading from "../../shared/Loading";




const Login = () => {

 
  const {handlerLogin,loading} =  useAuth();
  const navigate = useNavigate()


  const { register ,
     reset, 
     handleSubmit ,  
     formState: { errors }} = useForm({
  mode: "onSubmit",
  reValidateMode: "onChange"
})


 const [passwordToggle,setPasswordToggle] =  useState(false);

  
 function clickEventHandler(){
  setPasswordToggle(prev=>!prev)
 }


 


async function sumbitHandler(data){

  try {

  const response =  await  handlerLogin(data)
  if(response.success){
     toast.success("login successfull");
     reset();
     navigate("/")
  }
  else{
    toast.error("invalid credentials❌")
  }
    
  } catch (error) {
    toast.error("something went wrong!")
    console.log(error.message)
  }
  
 }

 



 function onInvalid(errors) {
   console.log("INVALID:", errors); 
   Object.values(errors).forEach((err) => {
     if (err?.message) {
       toast.error(err.message);
     }
   });
 }
 

 if(loading){
  return <Loading/>
 }



  return (
    <div className="w-full min-h-screen bg-[#201533] flex flex-col items-center justify-center gap-10 font-['Inter'] px-9 py-10 ">

         <div className='shadow-[0_0_15px_1px_#4A2885]  border border-[#4A2885]  rounded-full h-12 w-12 flex justify-center items-center'><i className="ri-bar-chart-fill text-white text-3xl"></i></div>

         <div className='flex flex-col  items-center justify-center gap-1'>

         <h3 className="text-white font-semibold text-[25px]">Moodify</h3>
         <span className='text-[15px] text-zinc-400'>Music That Feels You</span>

        
         </div>

         <div className="w-full card px-5 py-7 rounded-2xl bg-red-100 max-w-105 bg-linear-to-b from-[#06B6D4] to-[#7C3AED]">
             <form className='flex flex-col gap-5' onSubmit={handleSubmit(sumbitHandler, onInvalid)}>

              <div className='flex flex-col gap-1'>
                <label className='text-sm text-zinc-600' htmlFor="email">Email or username</label>
                <div className='bg-white text-gray-900 rounded-full px-4 py-3 flex gap-2 items-center shadow-lg '>
                <i className="ri-mail-fill text-zinc-500"></i>
                <input {...register("identifier",{ setValueAs:(value)=>value.trim()  ,required:{value:true,message:"username or email should be required"},minLength:{value:1,message:"please fill the field"}})} aria-invalid={!!errors.identifier} className='grow  w-full h-full border-none outline-none' type="text" placeholder='hello@moodify.com'/>
                </div>
              </div>


              <div className='flex flex-col gap-1'>
                <label className='text-sm text-zinc-600' htmlFor="password">password</label>
                <div className='bg-white  text-gray-900 rounded-full px-4 py-3 flex gap-2 items-center shadow-lg relative'>
                <i className="ri-lock-line text-zinc-500"></i>
                <input {...register("password",{ setValueAs:(value)=>value.trim() ,required:{value:true,message:"password should be required"} , minLength:{value:1,message:"please fill the field"}})} aria-invalid={!!errors.password} className='grow h-full w-full border-none outline-none' type={passwordToggle ? "text":"password"} placeholder='password goes here' />
                 <span  onClick={clickEventHandler}>{passwordToggle ? <i className="ri-eye-line text-lg cursor-pointer"></i>: <i className="ri-eye-off-line "></i>}</span>
                </div>
              </div>


              <button className='mt-6 shadow-lg text-white font-semibold bg-linear-to-r from-[#7C3AED] to-[#b342cf] px-3 py-3 rounded-full cursor-pointer'>Sign In</button>
             </form>
         </div>


         <div className='w-full flex items-center max-w-105 px-3 py-3 rounded-full  bg-[#ffffff25] backdrop-blur-md border border-[#7C3AED30] '>
             <div className='flex items-center'>
              <img className='w-9 h-9 rounded-full   object-cover border border-black' src="https://i.pinimg.com/736x/7f/61/0f/7f610f263983a89d92c8115cb80735c4.jpg" alt="" />
              <img className='w-9 h-9 rounded-full  object-cover border border-black -translate-x-2.5' src="https://i.pinimg.com/736x/c8/01/94/c801948738e687213cf00aa6b28e00c8.jpg" alt="" />
              <img className='w-9 h-9 rounded-full  object-cover border border-black -translate-x-5' src="https://i.pinimg.com/736x/ee/85/d6/ee85d653517b3f05c8cd90fd94dfd8c0.jpg" alt="" />
             </div>
             <span className='text-[12px] text-zinc-300'>
              <span className=' text-[#06B6D4]'>92%</span> discovered their perfect playlist
             </span>
         </div>


         <span className='text-zinc-500 text-sm mt-10'>Don't have an account ?<Link to="/register" className='text-[#06B6D4]'> Register</Link></span>
         

    
    </div>
  )
}

export default Login