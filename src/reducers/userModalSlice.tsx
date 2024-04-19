import { createSlice } from "@reduxjs/toolkit";

export interface UserModalState {
  modalType: "login" | "signup";
}

const initialState: UserModalState = {
  modalType: "login",
};

const userModalSlice = createSlice({
  name: "userModal",
  initialState,
  reducers: {
    openLogin: (state) => {
      state.modalType = "login";
    },
    openSignup: (state) => {
      state.modalType = "signup";
    },
  },
});

export const { openLogin, openSignup } = userModalSlice.actions;

const userModalReducer = userModalSlice.reducer;
export default userModalReducer;
