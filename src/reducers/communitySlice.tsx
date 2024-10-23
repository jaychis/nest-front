import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { CommunitySubmitParams } from "../pages/api/CommunityApi";

const initialState:CommunitySubmitParams = {
    name: '',
    description: '',
    visibility: 'PUBLIC',
    banner: null,
    icon: null,
    requestedUserId: ''
}

const communitySlice = createSlice({
    name: 'community',
    initialState,
    reducers:{
        community(state,action:PayloadAction<CommunitySubmitParams>){
            state.name = action.payload.name;
            state.description = action.payload.description;
            state.visibility = action.payload.visibility;
            state.banner = action.payload.banner;
            state.icon = action.payload.icon;
            state.requestedUserId = action.payload.requestedUserId;
        }
    }
})

export const {community} = communitySlice.actions
const communityReducer = communitySlice.reducer
export default communityReducer;