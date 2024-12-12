import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommunityVisibilityType } from '../_common/collectionTypes';

export interface SelectCommunityParams {
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly visibility: CommunityVisibilityType;
  readonly banner?: string | null;
  readonly icon?: string | null;
  readonly creator_user_id: string;
}

const initialState: SelectCommunityParams = {
  id: '',
  name: '',
  description: '',
  visibility: 'PUBLIC',
  banner: null,
  icon: null,
  creator_user_id: '',
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
      state.creator_user_id = action.payload.creator_user_id;
    },
    setCommunity(state, action: PayloadAction<SelectCommunityParams>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.visibility = action.payload.visibility;
      state.banner = action.payload.banner;
      state.icon = action.payload.icon;
      state.creator_user_id = action.payload.creator_user_id;
    },
  },
});

export const { community, setCommunity } = communitySlice.actions;
const communityReducer = communitySlice.reducer;
export default communityReducer;
