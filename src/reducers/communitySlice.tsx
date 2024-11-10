import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommunityVisibilityType } from '../_common/collectionTypes';

export interface SelectCommunityParams {
  readonly name: string;
  readonly description: string;
  readonly banner?: string | null;
  readonly icon?: string | null;
}

const initialState: SelectCommunityParams = {
  name: '',
  description: '',
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
      return { ...state, ...action.payload };
    },
  },
});

export const { community, setCommunity } = communitySlice.actions;
const communityReducer = communitySlice.reducer;
export default communityReducer;
