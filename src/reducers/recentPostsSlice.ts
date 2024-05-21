// src/reducers/recentPostsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Post {
  id: string;
  title: string;
}

interface RecentPostsState {
  posts: Post[];
}

const initialState: RecentPostsState = {
  posts: [],
};

const recentPostsSlice = createSlice({
  name: 'recentPosts',
  initialState,
  reducers: {
    addRecentPost: (state, action: PayloadAction<Post>) => {
      const post = action.payload;
      if (!state.posts.find((p) => p.id === post.id)) {
        state.posts.push(post);
        if (state.posts.length > 10) {
          state.posts.shift();
        }
      }
    },
  },
});

export const { addRecentPost } = recentPostsSlice.actions;
export default recentPostsSlice.reducer;
