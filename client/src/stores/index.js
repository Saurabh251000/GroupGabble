// stores/index.js
import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import profileSlice from './profileSlice';
import groupSlice from './groupSlice';
import friendsSlice from './friendsSlice';

const chatStore = configureStore({
  reducer: {
    users: userSlice,
    profile: profileSlice,
    groups: groupSlice,
    friends: friendsSlice,
  }
})

export default chatStore;
