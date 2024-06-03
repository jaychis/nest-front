import React, { useEffect, useState } from "react";
import {
  GetSearchBoardsAPI,
  GetSearchCommentsAPI,
  GetSearchCommunitiesAPI,
  GetSearchMediaAPI,
  GetSearchPeopleAPI,
} from "../api/SearchApi";
import { useSearchParams } from "react-router-dom";
import Card from "../../components/Card";
import { CardType } from "../../_common/CollectionTypes";
import BoardReply, { ReplyType } from "../Board/BoardReply";

type SearchListTypes =
  | "BOARDS"
  | "COMMUNITIES"
  | "COMMENTS"
  | "IMAGE&VIDEO"
  | "PEOPLE";

const SearchList = () => {
  const [searchList, setSearchList] = useState([]);
  const [params, setParams] = useSearchParams();
  const [searchType, setSearchType] = useState<SearchListTypes>("BOARDS");
  const QUERY: string = params.get("query") as string;
  useEffect(() => {
    if (searchType === "BOARDS") {
      GetSearchBoardsAPI({ query: QUERY })
        .then((res): void => {
          const response = res.data.response;
          console.log("BOARDS response : ", response);

          setSearchList(response);
        })
        .catch((err) =>
          console.error("SearchList GetSearchBoardsAPI error : ", err),
        );
    }

    if (searchType === "COMMUNITIES") {
      alert("준비중입니다.");
      // GetSearchCommunitiesAPI({ query: QUERY })
      //   .then((res): void => {
      //     const response = res.data.response;
      //     console.log("response : ", response);
      //
      //     setSearchList(response);
      //   })
      //   .catch((err) =>
      //     console.error("SearchList GetSearchCommunitiesAPI error : ", err),
      //   );
    }

    if (searchType === "COMMENTS") {
      GetSearchCommentsAPI({ query: QUERY })
        .then((res): void => {
          const response = res.data.response;
          console.log("COMMENTS response : ", response);

          setSearchList(response);
        })
        .catch((err) =>
          console.error("SearchList GetSearchCommentsAPI error : ", err),
        );
    }

    if (searchType === "IMAGE&VIDEO") {
      GetSearchMediaAPI({ query: QUERY })
        .then((res): void => {
          const response = res.data.response;
          console.log("IMAGE&VIDEO response : ", response);

          setSearchList(response);
        })
        .catch((err) =>
          console.error("SearchList GetSearchMediaAPI error : ", err),
        );
    }

    if (searchType === "PEOPLE") {
      GetSearchPeopleAPI({ query: QUERY })
        .then((res): void => {
          const response = res.data.response;
          console.log("PEOPLE response : ", response);

          setSearchList(response);
        })
        .catch((err) =>
          console.error("SearchList GetSearchPeopleAPI error : ", err),
        );
    }
  }, [searchType]);
  useEffect(() => console.log("searchType : ", searchType), [searchType]);

  const NavBarStateChange = async ({
    type,
  }: {
    readonly type: string;
  }): Promise<void> => {
    console.log("NavBarStateChange type : ", type);
    if (type === "BOARDS") setSearchType("BOARDS");
    if (type === "COMMUNITIES") setSearchType("COMMUNITIES");
    if (type === "COMMENTS") setSearchType("COMMENTS");
    if (type === "IMAGE&VIDEO") {
      console.log("check");
      setSearchType("IMAGE&VIDEO");
    }
    if (type === "PEOPLE") setSearchType("PEOPLE");
  };
  const styles = {
    navContainer: {
      display: "flex",
      borderBottom: "1px solid #e0e0e0",
      padding: "10px",
    },
    navItem: {
      marginRight: "20px",
      padding: "20px",
      cursor: "pointer",
      fontSize: "16px",
      color: "#000",
      borderRadius: "40px",
    },
  };
  const NavBar = () => {
    return (
      <div style={styles.navContainer}>
        <div
          style={{
            ...styles.navItem,
            backgroundColor: searchType === "BOARDS" ? "#f0f0f0" : "white",
          }}
          onClick={() => NavBarStateChange({ type: "BOARDS" })}
        >
          게시판
        </div>
        <div
          style={{
            ...styles.navItem,
            backgroundColor: searchType === "COMMUNITIES" ? "#f0f0f0" : "white",
          }}
          onClick={() => NavBarStateChange({ type: "COMMUNITIES" })}
        >
          커뮤니티
        </div>
        <div
          style={{
            ...styles.navItem,
            backgroundColor: searchType === "COMMENTS" ? "#f0f0f0" : "white",
          }}
          onClick={() => NavBarStateChange({ type: "COMMENTS" })}
        >
          댓글
        </div>
        <div
          style={{
            ...styles.navItem,
            backgroundColor: searchType === "IMAGE&VIDEO" ? "#f0f0f0" : "white",
          }}
          onClick={() => NavBarStateChange({ type: "IMAGE&VIDEO" })}
        >
          사진 & 영상
        </div>
        <div
          style={{
            ...styles.navItem,
            backgroundColor: searchType === "PEOPLE" ? "#f0f0f0" : "white",
          }}
          onClick={() => NavBarStateChange({ type: "PEOPLE" })}
        >
          사람
        </div>
      </div>
    );
  };
  return (
    <>
      <NavBar />
      {searchList.length > 0 ? (
        searchType === "BOARDS" || searchType === "IMAGE&VIDEO" ? (
          searchList.map((ca: CardType) => {
            return (
              <>
                <Card
                  id={ca.id}
                  category={ca.category}
                  content={ca.content}
                  nickname={ca.nickname}
                  title={ca.title}
                  createdAt={ca.created_at}
                  type={ca.type}
                />
              </>
            );
          })
        ) : searchType === "COMMUNITIES" ? null : searchType === "COMMENTS" ? (
          searchList.map((re: ReplyType) => {
            return (
              <>
                <BoardReply
                  id={re.id}
                  comment_id={re.comment_id}
                  user_id={re.user_id}
                  content={re.content}
                  nickname={re.nickname}
                  created_at={re.created_at}
                  updated_at={re.updated_at}
                  deleted_at={re.deleted_at}
                />
              </>
            );
          })
        ) : (
          searchList.map((el: CardType) => {
            return (
              <>
                <Card
                  id={el.id}
                  category={el.category}
                  content={el.content}
                  nickname={el.nickname}
                  title={el.title}
                  createdAt={el.created_at}
                  type={el.type}
                />
              </>
            );
          })
        )
      ) : (
        <div>텅!!</div>
      )}
    </>
  );
};

export default SearchList;
