import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import profileReducer from "./profileSlice";
import userModalReducer from "./userModalSlice";

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  userModal: userModalReducer,
});

export default rootReducer;
