import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import profileReducer from "./profileSlice";

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
});

export default rootReducer;
