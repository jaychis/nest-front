import { createSlice } from '@reduxjs/toolkit';

const recentPostsSlice = createSlice({
  name: 'recentPosts',
  initialState: {
    posts: [
      { id: '1', title: '게시물1' },
      { id: '2', title: '게시물2' },
      { id: '3', title: '게시물3' },
    ],
  },
  reducers: {},
});

export default recentPostsSlice.reducer;
