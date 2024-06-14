import { createSlice } from "@reduxjs/toolkit";

const friendsSlice = createSlice({
  name: 'friends',
  initialState: [],
  reducers: {
    SetData: (state, action) => {
      action.payload;
    },
    AddFriend: (state, action) => {
      state.friendlist.push(action.payload.friend);
    },
    AddGroup: (state, action) => {
      state.grouplist.push(action.payload.group);
    },
  }
});

export const friendsActions = friendsSlice.actions;
export default friendsSlice.reducer;
