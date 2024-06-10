import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
    name: 'groups',
    initialState: [{
        isfetch: false,
        email: "",
        groups: [],
        friends: [],
    }],
    reducers: {
        MarkFetchDone: (state) => {
            return {
                ...state,
                isfetch: !state.isfetch,
            };
        },
        YourGroups : ( state , action) => {
            return state.groups = action.payload;
        },
        AddGroup :(state , action) => {
            const {group} = action.payload;
            return { ...state.groups , group };
        },
        YourFriends : (state ,action) =>{
            return state.friends = action.payload;
        },
        AddFriend: (state,action) =>{
            const {friend} = action.payload;
            return {...state.friends , friend};
        },
    }
})

export const groupAction = groupSlice.actions;
export default groupSlice;