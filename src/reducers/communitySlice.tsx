import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommunityVisibilityType } from '../_common/collectionTypes';

export interface SelectCommunityParams {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly visibility: string;
  readonly usersId?: string[];
  readonly banner: string | null;
  readonly icon?: string | null;
}

const initialState: SelectCommunityParams = {
  id: '',
  name: '',
  description: '',
  visibility: 'PUBLIC',
  banner: null,
  icon: null,
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    community(state, action: PayloadAction<SelectCommunityParams>) {
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.banner = action.payload.banner;
      state.icon = action.payload.icon;
    },
    setCommunity(state, action: PayloadAction<SelectCommunityParams>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.visibility = action.payload.visibility;
      state.usersId = action.payload.usersId ?? state.usersId;
      state.banner = action.payload.banner;
      state.icon = action.payload.icon ?? state.icon;
    },
  },
});

export const { community, setCommunity } = communitySlice.actions;
const communityReducer = communitySlice.reducer;
export default communityReducer;
