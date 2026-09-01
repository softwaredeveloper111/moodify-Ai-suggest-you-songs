import axios from "axios";




const instance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials:true
});

// https://moodify-ai-suggest-you-songs.onrender.com

export async function moodGetSongAPI(mood){
   try {
    
    const response = await instance.get(`/api/songs?mood=${mood}`)
    return response.data
    
   } catch (error) {
    console.log(error.message)
    throw error
   }
}