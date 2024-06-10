import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import profileSlice from './profileSlice';
import groupSlice from './groupSlice';

const chatStore = configureStore({
  reducer: {
    user: userSlice.reducer,
    profile: profileSlice.reducer,
    groups: groupSlice.reducer,
  }

})
export default chatStore;