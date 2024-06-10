import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: [{}],
  reducers: {
    Updateinfo: (state, action) => {
      // Loop through each object in the payload array
      return action.payload.forEach((user) => {
        const { email, name } = user;
        // Check if the user already exists in the state
        const existingUser = state.find(user => user.email === email);
        if (!existingUser) {
          state.push({ email, name });
        }
      });
    },
  }

})

export const userActions = userSlice.actions;
export default userSlice;