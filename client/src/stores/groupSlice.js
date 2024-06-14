import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
  },
  reducers: {
    YourGroups: (state, action) => {
      state.groups = action.payload;
    },
    AddGroup: (state, action) => {
      state.groups.push(action.payload.group);
    },
  }
});

export const groupActions = groupSlice.actions;
export default groupSlice.reducer;
