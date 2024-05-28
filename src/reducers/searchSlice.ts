// src/reducers/searchSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getTopSearches = createAsyncThunk('search/getTopSearches', async () => {
  // 데모 데이터를 사용합니다.
  return ['검색어1', '검색어2', '검색어3', '검색어4', '검색어5', '검색어6', '검색어7', '검색어8', '검색어9', '검색어10'];
});

export const searchQuery = createAsyncThunk('search/searchQuery', async (query: string) => {
  const response = await axios.get(`/api/search?query=${query}`);
  return response.data;
});

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    topSearches: [] as string[],
    searchResults: [] as string[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTopSearches.fulfilled, (state, action) => {
      state.topSearches = action.payload;
    });
    builder.addCase(searchQuery.fulfilled, (state, action) => {
      state.searchResults = action.payload;
    });
  },
});

export default searchSlice.reducer;
