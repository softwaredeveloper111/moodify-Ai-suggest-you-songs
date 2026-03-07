import axios from "axios";




const instance = axios.create({
  baseURL: 'https://moodify-ai-suggest-you-songs.onrender.com',
  withCredentials:true
});



export async function moodGetSongAPI(mood){
   try {
    
    const response = await instance.get(`/api/songs?mood=${mood}`)
    return response.data
    
   } catch (error) {
    console.log(error.message)
    throw error
   }
}