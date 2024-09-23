import React, { useEffect, useState, ChangeEvent, CSSProperties } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { ReduxProfileAPI } from "../api/UserApi";
import { ProfileState } from "../../reducers/profileSlice";
import { CardType } from "../../_common/CollectionTypes";
import Card from "../../components/Card";
import BoardComment, { CommentType } from "../Board/BoardComment";
import { BoardInquiryAPI } from "../api/BoardApi";
import { CommentInquiryAPI } from "../api/CommentApi";
import {
  ImageLocalPreviewUrls,
  ImageLocalPreviewUrlsReturnType,
} from "../../_common/ImageUploadFuntionality";

type ACTIVE_SECTION_TYPES = "POSTS" | "COMMENTS" | "PROFILE";
const Profile = () => {
  const user: ProfileState = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  const [myPosts, setMyPosts] = useState<CardType[]>([]);
  const [myComments, setMyComments] = useState<CommentType[]>([]);
  const [activeSection, setActiveSection] =
    useState<ACTIVE_SECTION_TYPES>("POSTS");
  const ID: string = (localStorage.getItem("id") as string) || "";
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>(user.data.nickname || "");
  const [email, setEmail] = useState<string>(user.data.email || "");
  const [phone, setPhone] = useState<string>(user.data.phone || "");

  useEffect(() => {
    ExecuteBoardInquiryAPI({ id: ID }).then((res) => setMyPosts(res));
  }, [ID]);

  useEffect(() => {
    if (activeSection === "POSTS") {
      ExecuteBoardInquiryAPI({ id: ID }).then((res) => setMyPosts(res));
    }

    if (activeSection === "COMMENTS") {
      const commentInquiry = async (): Promise<void> => {
        const res = await CommentInquiryAPI({ userId: ID });
        if (!res) return;

        const response = res.data.response;
        setMyComments(response);
      };
      commentInquiry();
    }

    if (activeSection === "PROFILE") {
      dispatch(ReduxProfileAPI({ id: ID })).then((res) => {
        console.log("Profile API response:", res);
        if (res && res.payload) {
          setNickname(res.payload.nickname);
          setEmail(res.payload.email);
          setPhone(res.payload.phone);
        }
      });
    }
  }, [activeSection, ID, dispatch]);

  useEffect(() => {
    if (profilePicture && typeof profilePicture !== "string") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(profilePicture);
    } else if (typeof profilePicture === "string") {
      setProfilePreview(profilePicture);
    } else {
      setProfilePreview(null);
    }
  }, [profilePicture]);

  const handleProfilePictureChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({
      event: e,
    });
    if (!urls) return;
    setProfilePreview(urls.previewUrls[0]);
    setProfilePicture(urls.fileList[0]);
  };

  const handleReplySubmit = (reply: any) => {
    // Implement reply submit logic here
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = () => {
    // Implement save logic here
    // After saving, toggle editing mode off
    setIsEditing(false);
  };

  return (
    <>
      <div style={styles.container}>
        <div style={{ flex: 2, padding: "20px", overflowY: "auto" }}>
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
                  <Card shareCount = {post.share_count} key={post.id} {...post} createdAt={post.created_at} />
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
              <div style={styles.profileContainer}>
                <div style={styles.imageUploadWrapper}>
                  {isEditing ? (
                    <>
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        style={styles.hiddenFileInput}
                      />
                      <div
                        style={styles.imagePreviewWrapper}
                        onClick={() =>
                          document.getElementById("profilePicture")?.click()
                        }
                      >
                        {profilePreview ? (
                          <img
                            src={profilePreview}
                            alt="Profile Preview"
                            style={styles.imagePreview}
                          />
                        ) : (
                          <div style={styles.placeholder}>프로필</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={styles.imagePreviewWrapper}>
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile Preview"
                          style={styles.imagePreview}
                        />
                      ) : (
                        <div style={styles.placeholder}>프로필</div>
                      )}
                    </div>
                  )}
                </div>
                <div style={styles.profileInfo}>
                  <div style={styles.infoRow}>
                    <label style={styles.label}>닉네임:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.value}>
                        {nickname || "닉네임을 입력하세요"}
                      </span>
                    )}
                  </div>
                  <div style={styles.infoRow}>
                    <label style={styles.label}>이메일:</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.value}>
                        {email || "이메일을 입력하세요"}
                      </span>
                    )}
                  </div>
                  <div style={styles.infoRow}>
                    <label style={styles.label}>전화번호:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.value}>
                        {phone || "전화번호를 입력하세요"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={isEditing ? handleSave : handleEditToggle}
                style={styles.editButton}
              >
                {isEditing ? "저장" : "수정"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    width: "100%",
    height: "100vh",
    justifyContent: "center",
    overflow: "hidden",
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
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
  },
  sectionTitle: {
    fontSize: "24px",
    marginBottom: "10px",
    borderBottom: "2px solid #333",
    paddingBottom: "5px",
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageUploadWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginRight: "20px",
  },
  hiddenFileInput: {
    display: "none",
  },
  imagePreviewWrapper: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    backgroundColor: "#E0E0E0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholder: {
    fontSize: "14px",
    color: "#888",
    textAlign: "center",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%", // Added to ensure consistency
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    fontSize: "18px",
    width: "100px",
  },
  value: {
    color: "#555",
    fontSize: "18px",
    flex: 1, // Added to ensure consistency
  },
  input: {
    fontSize: "18px",
    padding: "5px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    flex: 1, // Added to ensure consistency
  },
  editButton: {
    marginTop: "20px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#007BFF",
    color: "white",
    fontWeight: "bold",
    transition: "background-color 0.3s, color 0.3s",
  },
};

const cache: { [key: string]: any } = {};

const exponentialBackoff = (retryCount: number): Promise<void> => {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.pow(2, retryCount) * 1000),
  );
};

async function ExecuteBoardInquiryAPI({ id }: { readonly id: string }) {
  const URL = `boards/${id}`;

  // Return cached response if available
  if (cache[URL]) {
    return cache[URL];
  }

  let retryCount = 0;
  const maxRetries = 5;

  while (retryCount < maxRetries) {
    try {
      const res = await BoardInquiryAPI({ id });
      const response = res.data.response;
      console.log("profile board inquiry api response : ", response);

      // Cache the response
      cache[URL] = response;

      return response;
    } catch (e: any) {
      if (e.response && e.response.status === 429) {
        retryCount++;
        console.warn(`Retry ${retryCount} for ${URL} after 429 error.`);
        await exponentialBackoff(retryCount);
      } else if (e.response && e.response.status === 401) {
        console.error("Unauthorized error. Redirecting to login.");
        window.location.href = "/login"; // Adjust this to your login route
        return;
      } else {
        console.error("PROFILE BOARD INQUIRY ERROR : ", e);
        return []; // Return an empty array on error
      }
    }
  }

  console.error("Max retries reached. Returning empty response.");
  return [];
}

export default Profile;
