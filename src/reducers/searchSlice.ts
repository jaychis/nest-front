// src/reducers/searchSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// export const getTopSearches = createAsyncThunk('search/getTopSearches', async () => {
//   // 데모 데이터를 사용합니다.
//   return ['검색어1', '검색어2', '검색어3', '검색어4', '검색어5', '검색어6', '검색어7', '검색어8', '검색어9', '검색어10'];
// });

export const searchQuery = createAsyncThunk('search/searchQuery', async (query: string) => {
  const response = await axios.get(`/api/search?query=${query}`);
  return response.data.slice(0, 5); // 최대 5개의 검색 결과만 반환
});

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    topSearches: [] as string[],
    searchResults: [] as string[],
  },
  reducers: {
    // 동기적으로 searchResults를 설정하는 리듀서
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(searchQuery.fulfilled, (state, action) => {
      state.searchResults = action.payload;
    });
  },
});

export const { setSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
