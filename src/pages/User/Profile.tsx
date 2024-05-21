import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { ReduxProfileAPI } from "../api/UserApi";
import { ProfileState } from "../../reducers/profileSlice";

const Profile = () => {
  const user: ProfileState = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("user ::: ", user);
  }, [user]);

  useEffect(() => {
    dispatch(ReduxProfileAPI({ id: "54870c90-ab34-4555-ad44-338c0478670b" }));
  }, [dispatch]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>프로필</h1>
        <div style={styles.info}>
          <label style={styles.label}>닉네임:</label>
          <span style={styles.value}>{user.data.nickname || "닉네임을 입력하세요"}</span>
        </div>
        <div style={styles.info}>
          <label style={styles.label}>이메일:</label>
          <span style={styles.value}>{user.data.email ? user.data.email : "이메일을 입력하세요"}</span>
        </div>
        <div style={styles.info}>
          <label style={styles.label}>전화번호:</label>
          <span style={styles.value}>{user.data.phone ? user.data.phone : "전화번호를 입력하세요"}</span>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    width: "100%",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    borderBottom: "2px solid #007BFF",
    paddingBottom: "10px",
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
  },
  value: {
    flexGrow: 1,
    textAlign: "right",
    color: "#555",
  },
};

export default Profile;