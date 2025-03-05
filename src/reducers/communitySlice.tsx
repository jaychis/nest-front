import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommunityVisibilityType } from '../_common/collectionTypes';

interface UserType {
  id: string;
  email: string;
  password: string;
  phone: string;
  nickname: string;
  refresh_token: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
export interface SelectCommunityMembersType {
  id: string;
  community_id: string;
  user_id: string;
  role: string;
  joinedAt: string;
  user: UserType[];
}
export interface SelectCommunityParams {
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly visibility: CommunityVisibilityType;
  readonly banner?: string | null;
  readonly icon?: string | null;
  readonly creator_user_id: string;
  readonly members: SelectCommunityMembersType[];
  readonly is_joined: boolean;
}

const initialState: SelectCommunityParams = {
  id: '',
  name: '',
  description: '',
  visibility: 'PUBLIC',
  banner: null,
  icon: null,
  creator_user_id: '',
  members: [],
  is_joined: false,
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
      state.members = action.payload.members;
      state.is_joined = action.payload.is_joined;
    },
    setCommunity(state, action: PayloadAction<SelectCommunityParams>) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.visibility = action.payload.visibility;
      state.banner = action.payload.banner;
      state.icon = action.payload.icon;
      state.creator_user_id = action.payload.creator_user_id;
      state.members = action.payload.members;
      state.is_joined = action.payload.is_joined;
    },
    joinCommunity(
      state,
      action: PayloadAction<{ readonly is_joined: boolean }>,
    ) {
      state.is_joined = action.payload.is_joined;
    },
    setJoinCommunity(
      state,
      action: PayloadAction<{ readonly is_joined: boolean }>,
    ) {
      state.is_joined = action.payload.is_joined;
    },
  },
});

export const { community, setCommunity, setJoinCommunity } =
  communitySlice.actions;
const communityReducer = communitySlice.reducer;
export default communityReducer;
