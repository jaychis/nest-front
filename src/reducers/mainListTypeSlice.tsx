import { MainListTypes } from "../_common/CollectionTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    setButtonType: (state, action: PayloadAction<MainListTypes>) => {
      state.buttonType = action.payload;
    },
  },
});

export const sideButtonSliceActions = sideButtonSlice.actions;

const sideBarButtonReducer = sideButtonSlice.reducer;
export default sideBarButtonReducer;
