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
    economicsButton: (state) => {
      state.buttonType = "경제";
    },
    programmingButton: (state) => {
      state.buttonType = "프로그래밍";
    },
    artButton: (state) => {
      state.buttonType = "예술";
    },
    mathematicsButton: (state) => {
      state.buttonType = "수학";
    },
    readingButton: (state) => {
      state.buttonType = "독서";
    },
  },
});

// export const { homeButton, popularButton, allButton } = sideButtonSlice.actions;
export const sideButtonSliceActions = sideButtonSlice.actions;

const sideBarButtonReducer = sideButtonSlice.reducer;
export default sideBarButtonReducer;
