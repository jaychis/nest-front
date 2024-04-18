import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileAPI } from "../pages/api/UserApi";

interface ProfileState {
  data: {
    id: string;
    email: string;
    nickname: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | number;
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined | null;
}

const initialState: ProfileState = {
  data: null,
  status: "idle",
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ProfileAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        ProfileAPI.fulfilled,
        (state, action: PayloadAction<typeof initialState.data>) => {
          state.status = "succeeded";
          state.data = action.payload;
        },
      )
      .addCase(ProfileAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

const profileReducer = profileSlice.reducer;
export default profileReducer;
