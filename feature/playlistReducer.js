import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playlist: null,
  activeVideo: JSON.parse(localStorage.getItem("activeVideo")) || null,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    updatePlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    updateActiveVideo: (state, action) => {
      state.activeVideo = action.payload;
    },
  },
});

export const { updatePlaylist, updateActiveVideo } = playlistSlice.actions;
export default playlistSlice.reducer;
