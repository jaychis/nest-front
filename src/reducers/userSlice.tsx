import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  password: string;
}

const initialState: UserState = {
  email: "",
  password: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    profile(state, action: PayloadAction<UserState>) {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
  },
});

export const { profile } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
