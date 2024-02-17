"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playlist: null,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    updatePlaylist: (state, action) => {
      state.playlist = action.payload;
    },
  },
});

export const { updatePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
