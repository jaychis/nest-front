import React, { useEffect, useState } from "react";
import {
  GetSearchBoardsAPI,
  GetSearchCommentsAPI,
  GetSearchCommunitiesAPI,
  GetSearchMediaAPI,
  GetSearchPeopleAPI,
  GetSearchTagsAPI,
} from "../api/SearchApi";
import { useSearchParams } from "react-router-dom";
import Card from "../../components/Card";
import {
  CardType,
  CommunityType,
  UserType,
} from "../../_common/CollectionTypes";
import BoardReply, { ReplyType } from "../Board/BoardReply";
import EmptyState from "../../components/EmptyState";

type SearchListTypes =
  | "BOARDS"
  | "COMMUNITIES"
  | "COMMENTS"
  | "IMAGE&VIDEO"
  | "PEOPLE"
  | "TAGS";

const SearchList = () => {
  const [searchCardList, setSearchCardList] = useState<CardType[]>([]);
  const [searchCommunityList, setSearchCommunityList] = useState<
    CommunityType[]
  >([]);
  const [searchReplyList, setSearchReplyList] = useState<ReplyType[]>([]);
  const [searUserList, setSearchUserList] = useState<UserType[]>([]);
  const [searchTagList, setSearchTagsList] = useState([]);

  const [params, setParams] = useSearchParams();
  const [searchType, setSearchType] = useState<SearchListTypes>("BOARDS");
  const QUERY: string = params.get("query") as string;

  useEffect(() => {
    if (searchType === "BOARDS") {
      GetSearchBoardsAPI({ query: QUERY })
        .then((res): void => {
          if (!res) return;
          const response = res.data.response;
          console.log("BOARDS response : ", response);

          setSearchCardList(response);
        })
        .catch((err) =>
          console.error("SearchList GetSearchBoardsAPI error : ", err),
        );
    }

    if (searchType === "COMMUNITIES") {
      GetSearchCommunitiesAPI({ query: QUERY })
        .then((res): void => {
          if (!res) return;
          const response = res.data.response;
          console.log("community response : ", response);

          setSearchCommunityList(response);
        })
        .catch((err) =>
          console.error("SearchList GetSearchCommunitiesAPI error : ", err),
        );
    }

    if (searchType === "COMMENTS") {
      GetSearchCommentsAPI({ query: QUERY })
        .then((res): void => {
          if (!res) return;

          const response = res.data.response;
          console.log("COMMENTS response : ", response);

          setSearchReplyList(response);
        })
        .catch((err) =>
          console.error("SearchList GetSearchCommentsAPI error : ", err),
        );
    }

    if (searchType === "IMAGE&VIDEO") {
      GetSearchMediaAPI({ query: QUERY })
        .then((res): void => {
          if (!res) return;

          const response = res.data.response;
          console.log("IMAGE&VIDEO response : ", response);

          setSearchCardList(response);
        })
        .catch((err) =>
          console.error("SearchList GetSearchMediaAPI error : ", err),
        );
    }

    if (searchType === "PEOPLE") {
      GetSearchPeopleAPI({ query: QUERY })
        .then((res): void => {
          if (!res) return;

          const response = res.data.response;
          console.log("PEOPLE response : ", response);

          setSearchUserList(response);
        })
        .catch((err) =>
          console.error("SearchList GetSearchPeopleAPI error : ", err),
        );
    }

    if (searchType === "TAGS") {
      GetSearchTagsAPI({ query: QUERY })
        .then((res): void => {
          if (!res) return;

          const response = res.data.response[0].communities.map(
            (tag: { community: CommunityType }) => tag.community,
          );
          console.log("TAGS response : ", response);

          setSearchTagsList(response);
        })
        .catch((err) =>
          console.error("SearchList GetSearchTagsAPI error : ", err),
        );
    }
  }, [searchType, QUERY]); // QUERY를 의존성 배열에 추가하여 쿼리 변경 시 재실행

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
    if (type === "IMAGE&VIDEO") setSearchType("IMAGE&VIDEO");
    if (type === "PEOPLE") setSearchType("PEOPLE");
    if (type === "TAGS") setSearchType("TAGS");
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

        <div
          style={{
            ...styles.navItem,
            backgroundColor: searchType === "TAGS" ? "#f0f0f0" : "white",
          }}
          onClick={() => NavBarStateChange({ type: "TAGS" })}
        >
          태그
        </div>
      </div>
    );
  };

  const EmptyList = () => <EmptyState />;
  return (
    <>
      <NavBar />
      {searchCardList.length > 0 ? (
        searchType === "BOARDS" ||
        searchType === "IMAGE&VIDEO" ||
        searchType === "TAGS" ? (
          searchCardList.length > 0 ? (
            searchCardList.map((ca: CardType) => {
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
                    shareCount={ca.share_count}
                  />
                </>
              );
            })
          ) : (
            <EmptyList />
          )
        ) : searchType === "COMMUNITIES" ? (
          searchCommunityList.length > 0 ? (
            searchCommunityList.map((ca: CommunityType) => {
              return (
                <>
                  <div>
                    <span>
                      <h2>{ca.name}</h2>
                    </span>
                  </div>
                  <div>
                    <span>{ca.description}</span>
                  </div>
                </>
              );
            })
          ) : (
            <EmptyList />
          )
        ) : searchType === "COMMENTS" ? (
          searchReplyList.length > 0 ? (
            searchReplyList.map((re: ReplyType) => {
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
            <EmptyList />
          )
        ) : searUserList.length > 0 ? (
          searUserList.map((el: UserType) => {
            return (
              <>
                <div>{el.id}</div>
                <div>{el.nickname}</div>
                <div>{el.email}</div>
              </>
            );
          })
        ) : (
          <EmptyList />
        )
      ) : (
        <EmptyList />
      )}
    </>
  );
};

export default SearchList;
