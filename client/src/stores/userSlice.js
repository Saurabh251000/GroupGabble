import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
  },
  reducers: {
    Updateinfo: (state, action) => {
      state.users = action.payload;
      // console.log(state);
    },
  }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
