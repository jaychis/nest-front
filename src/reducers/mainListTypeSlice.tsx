import { MainListTypes } from '../_common/collectionTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MainListTypeState {
  buttonType: MainListTypes;
  hamburgerButton: boolean;
}

const initialState: MainListTypeState = {
  buttonType: 'HOME',
  hamburgerButton: false,
};

export const sideButtonSlice = createSlice({
  name: 'sideBarButton',
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
