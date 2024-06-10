import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    islogin: false,
    fetchDone: false,
    name: "",
    email: "",
  },
  reducers: {
    LoginState: (state) => {
      return {
        ...state,
        islogin: !state.islogin,
      };
      // return (!state.islogin);
    },
    Updateinfo: (state, action) => {
      // Destructure payload properties for clarity and potential validation
      const { name, email } = action.payload;
      // Update state values as instructed
      return {
        ...state,
        name,
        email,
      };
    },
    MarkFetchDone: (state) => {
      return {
        ...state, fetchDone: !state.fetchDone
      }
    },
  }
})

export const profileActions = profileSlice.actions;
export default profileSlice;