import { MainListTypes } from '../_common/collectionTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MainListTypeState {
  buttonType: MainListTypes;
}

export interface HamburgerStatus {
  readonly hamburgerStatus: boolean;
}

const initialState = {
  buttonType: 'HOME' as MainListTypes,
  hamburgerStatus: false,
};

export const sideButtonSlice = createSlice({
  name: 'sideBarButton',
  initialState,
  reducers: {
    setButtonType: (state, action: PayloadAction<MainListTypeState>) => {
      state.buttonType = action.payload.buttonType;
    },
    setHamburgerStatus: (state, action: PayloadAction<HamburgerStatus>) => {
      state.hamburgerStatus = action.payload.hamburgerStatus;
    },
    hamburgerStatus: (state, action: PayloadAction<HamburgerStatus>) => {
      state.hamburgerStatus = action.payload.hamburgerStatus;
    },
  },
});

export const sideButtonSliceActions = sideButtonSlice.actions;

const sideBarButtonReducer = sideButtonSlice.reducer;
export default sideBarButtonReducer;
