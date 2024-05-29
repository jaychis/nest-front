import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTopSearches } from "../../reducers/searchSlice";
import { RootState, AppDispatch } from "../../store/store";
import { GetTopTenSearches } from "../api/SearchApi.tex";

const RightSideBar = () => {
  // const dispatch = useDispatch<AppDispatch>();
  // const topSearches = useSelector(
  //   (state: RootState) => state.search.topSearches,
  // );
  // const recentPosts = useSelector(
  //   (state: RootState) => state.recentPosts.posts,
  // );

  const [isTopTenList, setIsTopTenList] = useState([]);
  useEffect(() => {
    const fetchTopTenList = async (): Promise<void> => {
      const res = await GetTopTenSearches();
      const response = res.data.response;
      console.log("response ; ", response);

      setIsTopTenList(response);
    };
    fetchTopTenList();
  }, []);

  // useEffect(() => {
  //   console.log("Top Searches:", topSearches);
  //   console.log("Recent Posts:", recentPosts);
  // }, [topSearches, recentPosts]);

  return (
    <div
      style={{
        width: "350px",
        padding: "10px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <div>
        <h3>실시간 검색어 TOP 10</h3>
        <ol>
          {isTopTenList.map(
            (
              search: { readonly query: string; readonly count: number },
              index: number,
            ) => (
              <li key={index}>{search.query}</li>
            ),
          )}
        </ol>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>최근 본 게시물</h3>
        <ul>
          {[].map((post: { id: string; title: string }, index: number) => (
            <li key={index}>
              <a href={`/boards/read?id=${post.id}&title=${post.title}`}>
                {post.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RightSideBar;
