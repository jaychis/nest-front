import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import profileReducer from "./profileSlice";
import userModalReducer from "./userModalSlice";
import sideBarButtonReducer from "./mainListTypeSlice";
import searchReducer from "./searchSlice"; // 새로 추가
import recentPostsReducer from "./recentPostsSlice"; // 새로 추가

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  userModal: userModalReducer,
  sideBarButton: sideBarButtonReducer,
  search: searchReducer, // 새로 추가
  recentPosts: recentPostsReducer, // 새로 추가
});

export default rootReducer;
