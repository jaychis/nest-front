import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTopSearches } from "../../reducers/searchSlice";
import { RootState, AppDispatch } from "../../store/store";
import { GetTopTenSearches } from "../api/SearchApi";

const RightSideBar = () => {
  // const dispatch = useDispatch<AppDispatch>();
  // const topSearches = useSelector(
  //   (state: RootState) => state.search.topSearches,
  // );
  // const recentPosts = useSelector(
  //   (state: RootState) => state.recentPosts.posts,
  // );

  const [isTopTenList, setIsTopTenList] = useState([]);
  const [selectedTab, setSelectedTab] = useState<"topSearches" | "recentPosts">("topSearches");

    // 데모 데이터
    const demoRecentPosts = [
      { id: "1", title: "최근 본 게시물 1" },
      { id: "2", title: "최근 본 게시물 2" },
      { id: "3", title: "최근 본 게시물 3" },
    ];

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
    <div style={styles.container}>
      <div style={styles.tabs}>
        <div
          style={selectedTab === "topSearches" ? styles.activeTab : styles.tab}
          onClick={() => setSelectedTab("topSearches")}
        >
          실시간 검색어
        </div>
        <div
          style={selectedTab === "recentPosts" ? styles.activeTab : styles.tab}
          onClick={() => setSelectedTab("recentPosts")}
        >
          최근 본 게시물
        </div>
      </div>
      {selectedTab === "topSearches" ? (
        <div>
          <h3 style={styles.header}>실시간 검색어 TOP 10</h3>
          <ol style={styles.list}>
            {isTopTenList.length > 0 ? (
              isTopTenList.map(
                (search: { readonly query: string; readonly count: number }, index: number) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.rank}>{index + 1}</span>
                    <span style={styles.query}>{search.query}</span>
                  </li>
                ),
              )
            ) : (
              <p>데이터를 불러오는 중...</p>
            )}
          </ol>
        </div>
      ) : (
        <div>
          <h3 style={styles.header}>최근 본 게시물</h3>
          <ul style={styles.list}>
            {demoRecentPosts.map((post) => (
              <li key={post.id} style={styles.listItem}>
                <a href={`/boards/read?id=${post.id}&title=${post.title}`} style={styles.link}>
                  {post.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "350px",
    padding: "20px",
    background: "#fff",
    border: "1px solid #ddd",
    borderTop: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  tabs: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
  tab: {
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#f0f0f0",
    fontWeight: "bold" as "bold",
  },
  activeTab: {
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "8px",
    border: "1px solid #0079D3",
    background: "#0079D3",
    color: "#fff",
    fontWeight: "bold" as "bold",
  },
  header: {
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  list: {
    listStyleType: "none" as "none",
    padding: "0",
    margin: "0",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  rank: {
    fontSize: "18px",
    fontWeight: "bold" as "bold",
    color: "#333",
  },
  query: {
    fontSize: "16px",
    color: "#0079D3",
  },
  link: {
    fontSize: "16px",
    color: "#0079D3",
    textDecoration: "none" as "none",
  },
};

export default RightSideBar;