// stores/index.js
import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import profileSlice from './profileSlice';
import groupSlice from './groupSlice';

const chatStore = configureStore({
  reducer: {
    user: userSlice,
    profile: profileSlice,
    groups: groupSlice,
  }
})

export default chatStore;
