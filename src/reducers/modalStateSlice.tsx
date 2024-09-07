import { createSlice } from "@reduxjs/toolkit";

export interface UserModalState {
    modalState: boolean;
}
  
const initialState: UserModalState = {
    modalState: false,
};

const userModalStateSlice = createSlice({
    name : 'modalState',
    initialState,
    reducers: {
      modalState : (state) => {
        state.modalState = false
      },
      setModalState: (state, action) => {
        state.modalState = action.payload; 
      }
    }
  })

export const {setModalState,modalState} = userModalStateSlice.actions;

const modalStateReducer = userModalStateSlice.reducer;

export default modalStateReducer;