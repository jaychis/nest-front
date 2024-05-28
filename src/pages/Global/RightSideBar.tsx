import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTopSearches } from '../../reducers/searchSlice';
import { RootState, AppDispatch } from '../../store/store';

const RightSideBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const topSearches = useSelector((state: RootState) => state.search.topSearches);
  const recentPosts = useSelector((state: RootState) => state.recentPosts.posts);

  useEffect(() => {
    dispatch(getTopSearches());
  }, [dispatch]);

  useEffect(() => {
    console.log('Top Searches:', topSearches);
    console.log('Recent Posts:', recentPosts);
  }, [topSearches, recentPosts]);

  return (
    <div style={styles.container}>
      <div>
        <h3 style={styles.title}>실시간 검색어 TOP 10</h3>
        <ol style={styles.list}>
          {topSearches.map((search: string, index: number) => (
            <li key={index} style={styles.listItem}>{search}</li>
          ))}
        </ol>
      </div>
      <div style={styles.recentPostsContainer}>
        <h3 style={styles.title}>최근 본 게시물</h3>
        <ul style={styles.list}>
          {recentPosts.map((post: { id: string; title: string }, index: number) => (
            <li key={index} style={styles.listItem}>
              <a href={`/boards/read?id=${post.id}&title=${post.title}`} style={styles.link}>{post.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '350px',
    padding: '10px',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  title: {
    fontSize: '18px',
    margin: '10px 0',
  },
  list: {
    paddingLeft: '20px',
  },
  listItem: {
    fontSize: '16px',
    margin: '8px 0',
  },
  recentPostsContainer: {
    marginTop: '20px',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  }
};

export default RightSideBar;