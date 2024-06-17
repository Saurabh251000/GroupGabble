// stores/index.js
import { configureStore } from '@reduxjs/toolkit';
import profileSlice from './profileSlice';

const chatStore = configureStore({
  reducer: {
    profile: profileSlice,
  }
})

export default chatStore;
