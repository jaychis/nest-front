import { MainListTypes } from "../_common/CollectionTypes";
import { createSlice } from "@reduxjs/toolkit";

export interface MainListTypeState {
  buttonType: MainListTypes;
}

const initialState: MainListTypeState = {
  buttonType: "HOME",
};

export const sideButtonSlice = createSlice({
  name: "sideBarButton",
  initialState,
  reducers: {
    homeButton: (state) => {
      state.buttonType = "HOME";
    },
    popularButton: (state) => {
      state.buttonType = "POPULAR";
    },
    allButton: (state) => {
      state.buttonType = "ALL";
    },
  },
});

export const { homeButton, popularButton, allButton } = sideButtonSlice.actions;

const sideBarButtonReducer = sideButtonSlice.reducer;
export default sideBarButtonReducer;
