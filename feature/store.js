import { configureStore } from '@reduxjs/toolkit';
import playlistSlice from './playlistReducer'

export const store =  configureStore({
    reducer: {
      playlist: playlistSlice
    }
  })