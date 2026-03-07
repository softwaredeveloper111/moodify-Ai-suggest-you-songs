import React, { useContext, useCallback } from 'react'
import { moodGetSongAPI } from "../services/mood.api";
import { SongContextProvider } from "../song.context";

const useSong = () => {
  const { loading, setLoading, songs, setSongs } = useContext(SongContextProvider);

  // ✅ useCallback — stable reference, prevents infinite useEffect loop in Home
  const HandlerGetSong = useCallback(async (mood) => {
    setLoading(true);
    try {
      const response = await moodGetSongAPI(mood);
      setSongs(response.songs);
      return { success: true };
    } catch (error) {
      return { success: false, message: `${error.message} ❌ something went wrong` };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, songs, HandlerGetSong };
};

export default useSong;