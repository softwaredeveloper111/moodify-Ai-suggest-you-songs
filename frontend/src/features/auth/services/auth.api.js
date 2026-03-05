import axios from "axios";




const instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials:true
});





export async function registerAPI(data){
try {
  const response = await instance.post("/api/auth/register",data);
  return response.data
} catch (error) {
  console.log(error.message);
  throw error
}
}



export async function loginAPI(data){
  try {
 
    const response = await instance.post("/api/auth/login",data);
    return response.data
  } catch (error) {
    console.log(error);
    throw error
    
  }
}




export async function getMeAPI(){
  try {

    const response = await instance.get("/api/auth/me")
    return response.data
    
  } catch (error) {
    console.log(error.message);
    throw error
  }
}




export async function logoutAPI(){
  try {
    const response = await instance.post("/api/auth/logout")
    return response.data
  } catch (error) {
    console.log(error.message)
    throw error
  }
}