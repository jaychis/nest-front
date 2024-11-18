import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SelectCommunityParams {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly visibility: string;
  readonly userIds: [];
  readonly banner: string | null;
  readonly icon: string | null;
}

const initialState: SelectCommunityParams = {
  id: '',
  name: '',
  description: '',
  visibility: 'PUBLIC',
  banner: null,
  icon: null,
  userIds: []
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    community(state, action: PayloadAction<SelectCommunityParams>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.banner = action.payload.banner;
      state.icon = action.payload.icon;
      state.visibility = action.payload.visibility;
      state.userIds = action.payload.userIds;
    },
    setCommunity(state, action: PayloadAction<SelectCommunityParams>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.visibility = action.payload.visibility;
      state.banner = action.payload.banner;
      state.icon = action.payload.icon;
      state.userIds = action.payload.userIds
    },
  },
});

export const { community, setCommunity } = communitySlice.actions;
const communityReducer = communitySlice.reducer;
export default communityReducer;
