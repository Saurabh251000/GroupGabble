import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  islogin: false,
  userInfo: null,
  fetchDone: false, // Added fetchDone to initial state
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    LoginState(state) {
      state.islogin = true;
    },
    LogoutState(state) {
      state.islogin = false;
      state.userInfo = null;
      // return;
    },
    Updateinfo(state, action) {
      state.userInfo = action.payload;
    },
    MarkFetchDone(state) {
      state.fetchDone = !state.fetchDone; // Corrected state modification
    },
  }
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
