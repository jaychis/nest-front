import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxProfileAPI } from "../pages/api/UserApi";

export interface ProfileState {
  data: {
    id: string;
    email: string;
    nickname: string;
    phone: string;
    created_at: string; // Date -> string
    updated_at: string; // Date -> string
    deleted_at?: Date | null;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined | null;
}

const initialState: ProfileState = {
  data: {
    id: "",
    email: "",
    nickname: "",
    phone: "",
    created_at: new Date().toISOString(), // Date -> ISO string
    updated_at: new Date().toISOString(), // Date -> ISO string
    deleted_at: null,
  },
  status: "idle",
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    profile(state, action: PayloadAction<ProfileState>) {
      state.data.id = action.payload.data.id;
      state.data.email = action.payload.data.email;
      state.data.nickname = action.payload.data.nickname;
      state.data.phone = action.payload.data.phone;
      state.data.created_at = action.payload.data.created_at;
      state.data.updated_at = action.payload.data.updated_at;
      state.data.deleted_at = action.payload.data.deleted_at;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ReduxProfileAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        ReduxProfileAPI.fulfilled,
        (state, action: PayloadAction<typeof initialState.data>) => {
          state.status = "succeeded";
          state.data = action.payload;
        },
      )
      .addCase(ReduxProfileAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { profile } = profileSlice.actions;
const profileReducer = profileSlice.reducer;
export default profileReducer;
