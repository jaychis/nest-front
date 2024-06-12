import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { ReduxProfileAPI } from "../api/UserApi";
import { ProfileState } from "../../reducers/profileSlice";
import { CardType } from "../../_common/CollectionTypes";
import Card from "../../components/Card";
import BoardComment, { CommentType } from "../Board/BoardComment";
import { BoardInquiryAPI } from "../api/BoardApi";
import { CommentInquiryAPI } from "../api/CommentApi";

type ACTIVE_SECTION_TYPES = "POSTS" | "COMMENTS" | "PROFILE";
const Profile = () => {
  const user: ProfileState = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  const [myPosts, setMyPosts] = useState<CardType[]>([]);
  const [myComments, setMyComments] = useState<CommentType[]>([]);
  const [activeSection, setActiveSection] =
    useState<ACTIVE_SECTION_TYPES>("POSTS");
  const ID: string = (localStorage.getItem("id") as string) || "";

  useEffect(() => {
    ExecuteBoardInquiryAPI({ id: ID }).then((res) => setMyPosts(res));
  }, [ID]);

  useEffect(() => {
    if (activeSection === "POSTS") {
      ExecuteBoardInquiryAPI({ id: ID }).then((res) => setMyPosts(res));
    }

    if (activeSection === "COMMENTS") {
      CommentInquiryAPI({ userId: ID })
        .then((res) => {
          const response = res.data.response;
          console.log("profile comment inquiry api response : ", response);

          setMyComments(response);
        })
        .catch((err) => console.error("PROFILE COMMENT INQUIRY ERROR : ", err));
    }

    if (activeSection === "PROFILE") {
      dispatch(ReduxProfileAPI({ id: ID })).then((res) => {
        console.log("Profile API response:", res);
      });
    }
  }, [activeSection, ID, dispatch]);

  const handleReplySubmit = (reply: any) => {
    // Implement reply submit logic here
  };

  return (
    <>
      <div style={styles.container}>
        <div style={{ flex: 2, padding: "20px" }}>
          <div style={styles.buttonContainer}>
            <button
              style={
                activeSection === "POSTS" ? styles.activeButton : styles.button
              }
              onClick={() => setActiveSection("POSTS")}
            >
              내가 등록한 게시글
            </button>
            <button
              style={
                activeSection === "COMMENTS"
                  ? styles.activeButton
                  : styles.button
              }
              onClick={() => setActiveSection("COMMENTS")}
            >
              내가 등록한 댓글
            </button>
            <button
              style={
                activeSection === "PROFILE"
                  ? styles.activeButton
                  : styles.button
              }
              onClick={() => setActiveSection("PROFILE")}
            >
              나의 정보
            </button>
          </div>

          {activeSection === "POSTS" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>내가 등록한 게시글</h2>
              {myPosts.length > 0 ? (
                myPosts.map((post: CardType) => (
                  <Card key={post.id} {...post} createdAt={post.created_at} />
                ))
              ) : (
                <p>등록된 포스트가 없습니다.</p>
              )}
            </div>
          )}

          {activeSection === "COMMENTS" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>내가 등록한 댓글</h2>
              {myComments.length > 0 ? (
                myComments.map((comment: CommentType) => (
                  <BoardComment
                    key={comment.id}
                    {...comment}
                    onReplySubmit={handleReplySubmit}
                  />
                ))
              ) : (
                <p>작성된 댓글이 없습니다.</p>
              )}
            </div>
          )}

          {activeSection === "PROFILE" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>프로필</h2>
              <div style={styles.info}>
                <label style={styles.label}>닉네임:</label>
                <span style={styles.value}>
                  {user.data.nickname || "닉네임을 입력하세요"}
                </span>
              </div>
              <div style={styles.info}>
                <label style={styles.label}>이메일:</label>
                <span style={styles.value}>
                  {user.data.email ? user.data.email : "이메일을 입력하세요"}
                </span>
              </div>
              <div style={styles.info}>
                <label style={styles.label}>전화번호:</label>
                <span style={styles.value}>
                  {user.data.phone
                    ? user.data.phone
                    : "전화번호를 입력하세요"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    width: "100%",
    height: "100vh",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    margin: "0 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "white",
    color: "#333",
    fontWeight: "bold",
    transition: "background-color 0.3s, color 0.3s",
  },
  activeButton: {
    padding: "10px 20px",
    margin: "0 10px",
    borderBottom: "2px solid #333",
    borderTop: "none",
    borderRight: "none",
    borderLeft: "none",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#007BFF",
    fontWeight: "bold",
    transition: "background-color 0.3s, color 0.3s",
  },
  section: {
    marginBottom: "20px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "1200px", // 섹션 너비를 동일하게 설정
    width: "100%",
  },
  sectionTitle: {
    fontSize: "24px",
    marginBottom: "10px",
    borderBottom: "2px solid #333",
    paddingBottom: "5px",
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  label: {
    fontWeight: "bold",
    marginRight: "10px",
    color: "#333",
    fontSize: "18px",
  },
  value: {
    flexGrow: 1,
    textAlign: "right" as "right",
    color: "#555",
    fontSize: "18px",
  },
};

async function ExecuteBoardInquiryAPI({ id }: { readonly id: string }) {
  try {
    const res = await BoardInquiryAPI({ id });
    const response = res.data.response;
    console.log("profile board inquiry api response : ", response);

    return response;
  } catch (e: any) {
    console.error("PROFILE BOARD INQUIRY ERROR : ", e);
  }
}

export default Profile;