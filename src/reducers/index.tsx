import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import profileReducer from "./profileSlice";
import modalReducer from "./modalSlice";

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  modal: modalReducer,
});

export default rootReducer;
