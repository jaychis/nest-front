// src/reducers/searchSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTopSearches } from '../pages/api/SearchApi';

interface SearchState {
  topSearches: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: SearchState = {
  topSearches: [],
  status: 'idle',
};

export const getTopSearches = createAsyncThunk('search/getTopSearches', async () => {
  const response = await fetchTopSearches();
  return response.data;
});

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTopSearches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTopSearches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topSearches = action.payload;
      })
      .addCase(getTopSearches.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default searchSlice.reducer;
