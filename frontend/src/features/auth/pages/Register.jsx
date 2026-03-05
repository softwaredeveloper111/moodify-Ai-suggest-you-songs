import React,{useState} from 'react'
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import Loading from "../../shared/Loading";



const Register = () => {

  const { handlerRegister,loading} = useAuth();
  const navigate = useNavigate()


const [passwordToggle,setPasswordToggle] =  useState(false);


 const {
  register,
  reset,
  handleSubmit,
  formState: { errors }
} = useForm({
  mode: "onSubmit",
  reValidateMode: "onChange"
});





    
   function clickEventHandler(){
    setPasswordToggle(prev=>!prev)
   }



  async function submithanlder(data){
     try {
      const response = await handlerRegister(data);
      if(response.success){
        toast.success("login successfull");
        reset()
        navigate("/")
      }
      else{
        toast.error("invalid credentials❌");

      }
     } catch (error) {
      toast.error("something went wrong❌")
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
    <div className="w-full min-h-screen bg-linear-to-b from-[#291E3D] to-[#0A141A] flex flex-col items-center justify-center gap-10 font-['Inter'] px-7 py-10 ">

    <div className='registerCard px-5 py-8 rounded-lg w-full max-w-112.5  flex flex-col items-center justify-center gap-1'>

         <div className='bg-linear-to-r from-[#7C3AED] to-[#b342cf]  rounded-xl overflow-hidden h-12 w-12 flex justify-center items-center'><i className="ri-bar-chart-fill text-white text-3xl"></i></div>
        
          <h3 className="text-white font-semibold text-[25px] mt-6">Moodify</h3>
         <span className='text-[15px] text-zinc-400'>Your emotions, translated into sound.</span>
         
         
          <form className='flex flex-col gap-5  w-full mt-10'  onSubmit={handleSubmit(submithanlder, onInvalid)}>


                <div className='bg-transparent border border-zinc-600  rounded-xl text-white px-4 py-3 flex gap-2 items-center shadow-lg'>
                <i className="ri-map-pin-user-line text-zinc-500 text-lg"></i>
                <input {...register("username",{
                  required:{value: true,message:"username should be required"},
                  minLength:{value:4 , message:"username mimimum 4 character required"},
                  maxLength:{value:20 ,message:"username maxmum 20 character exeed"}
                 })}
                 className='grow  h-full w-full border-none outline-none' 
                aria-invalid={!!errors.username}
                 type="text" placeholder='username'/>
                </div>
        


       
                <div className='bg-transparent border border-zinc-600  not-last-of-type:rounded-xl text-white px-4 py-3 flex gap-2 items-center shadow-lg '>
                <i className="ri-mail-fill text-zinc-500 text-lg"></i>
                <input {...register("email",{
                  required:{value:true,message:"email should be required"},
                  pattern:{value:/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message:"email should be valid"}
                })} 
                className='grow  h-full w-full border-none outline-none'
                  aria-invalid={!!errors.email}
                 type="email" placeholder='Email Address'/>
                </div>
         
               



               
                <div className='bg-transparent border border-zinc-600  rounded-xl text-white px-4 py-3 flex gap-2  items-center shadow-lg '>
                <i className="ri-lock-line text-zinc-500"></i>
                <input {...register("password",{
                  required:{value:true,message:"password should be required"},
                  minLength:{value: 8, message:"password Minimum 8 characters required."}     
                   })} 
                  aria-invalid={!!errors.password}
                className='grow  h-full w-full border-none outline-none' type={passwordToggle ? "text":"password"}  placeholder='password'/>
      
                <span className='text-zinc-500 cursor-pointer'  onClick={clickEventHandler}>{passwordToggle ? <i className="ri-eye-line text-lg cursor-pointer"></i>: <i className="ri-eye-off-line "></i>}</span>
                </div>
          
               




                  <button type='submit' className='cursor-pointer mt-4 shadow-lg text-white font-semibold bg-linear-to-r from-[#7C3AED] to-[#b342cf] px-3 py-3 rounded-full '>Sign Up</button>



                  <span className='text-center text-zinc-300 text-sm mt-14'>Already have an account ? <Link to="/login" className='text-[#06B6D4]'>Login</Link></span>




          </form>


         
   </div>


   <div className='flex gap-8 items-center text-zinc-500 max-w-[320px]'>
   <i className="ri-video-off-line"></i>
   <span className='text-[12px] text-zinc-500 text-center'>We respect you privacy.We will use your camera only to detect mood. nothing is stored or sent to servers.</span>
   </div>


    </div>
  )
}

export default Register