import { MainListTypes } from '../_common/collectionTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MainListTypeState {
  readonly buttonType: MainListTypes;
}

export interface HamburgerState {
  readonly hamburgerState: boolean;
}

const initialState = {
  buttonType: 'HOME' as MainListTypes,
  hamburgerState: false,
};

export const sideButtonSlice = createSlice({
  name: 'sideBarButton',
  initialState,
  reducers: {
    setButtonType: (state, action: PayloadAction<MainListTypeState>) => {
      state.buttonType = action.payload.buttonType;
    },
    buttonType: (state, action: PayloadAction<MainListTypeState>) => {
      state.buttonType = action.payload.buttonType;
    },
    setHamburgerState: (state, action: PayloadAction<HamburgerState>) => {
      state.hamburgerState = action.payload.hamburgerState;
    },
    hamburgerState: (state, action: PayloadAction<HamburgerState>) => {
      state.hamburgerState = action.payload.hamburgerState;
    },
  },
});

export const sideButtonSliceActions = sideButtonSlice.actions;

const sideBarButtonReducer = sideButtonSlice.reducer;
export default sideBarButtonReducer;
