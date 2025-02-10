import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import profileReducer from "./profileSlice";
import userModalReducer from "./userModalSlice";
import sideBarButtonReducer from "./mainListTypeSlice";
import searchReducer from "./searchSlice"; // 새로 추가
import recentPostsReducer from "./recentPostsSlice"; // 새로 추가
import communityReducer from "./communitySlice";

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  userModal: userModalReducer,
  sideBarButton: sideBarButtonReducer,
  search: searchReducer, // 새로 추가
  recentPosts: recentPostsReducer, // 새로 추가
  community: communityReducer
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
