import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import profileReducer from "./profileSlice";
import userModalReducer from "./userModalSlice";
import sideBarButtonReducer from "./mainListTypeSlice";

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  userModal: userModalReducer,
  sideBarButton: sideBarButtonReducer,
});

export default rootReducer;
