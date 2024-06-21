import React, { useState, useEffect, useRef, ChangeEvent, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "../../../contexts/CommunityContext";

const CommunityCreatePage1: React.FC = () => {
  const navigate = useNavigate();
  const {
    communityName,
    setCommunityName,
    description,
    setDescription,
    profilePicture,
    setProfilePicture,
    backgroundPicture,
    setBackgroundPicture,
  } = useCommunity();  
  const [textareaHeight, setTextareaHeight] = useState("120px");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      setTextareaHeight(`${textareaRef.current.scrollHeight}px`);
    }
  }, [description]);
  
  useEffect(() => {
    if (profilePicture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(profilePicture);
    } else {
      setProfilePreview(null);
    }
  }, [profilePicture]);

  useEffect(() => {
    if (backgroundPicture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(backgroundPicture);
    } else {
      setBackgroundPreview(null);
    }
  }, [backgroundPicture]);

  const handleNext = () => {
    navigate("/community/create3", {
      state: { communityName, description },
    });
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePicture(file);
  };

  const handleBackgroundPictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBackgroundPicture(file);
  };

  return (
    <div style={{ ...styles.container, height: `calc(400px + ${textareaHeight} - 120px)` }}>
      <h2 style={styles.heading}>커뮤니티 만들기</h2>
      <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
        <div style={styles.formGroup}>
          <div style={styles.imageUploadWrapper}>
            <input
              type="file"
              id="backgroundPicture"
              accept="image/*"
              onChange={handleBackgroundPictureChange}
              style={styles.hiddenFileInput}
            />
            <div style={styles.backgroundImagePreviewWrapper} onClick={() => document.getElementById('backgroundPicture')?.click()}>
              {backgroundPreview ? (
                <img src={backgroundPreview} alt="Background Preview" style={styles.backgroundImagePreview} />
              ) : (
                <div style={styles.placeholder}>배경 사진</div>
              )}
            </div>
          </div>
        </div>
        <div style={styles.row}>
          <div style={styles.profilePictureWrapper}>
            <div style={styles.formGroup}>
              <div style={styles.imageUploadWrapper}>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={styles.hiddenFileInput}
                />
                <div style={styles.imagePreviewWrapper} onClick={() => document.getElementById('profilePicture')?.click()}>
                  {profilePreview ? (
                    <img src={profilePreview} alt="Profile Preview" style={styles.imagePreview} />
                  ) : (
                    <div style={styles.placeholder}>프로필 사진</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div style={styles.column}>
            <div style={styles.formGroup}>
              <input
                type="text"
                id="communityName"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                placeholder="커뮤니티 이름"
                required
                style={styles.input}
              />
            </div>
          </div>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>
            설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ ...styles.textarea, height: textareaHeight }}
            ref={textareaRef}
          />
        </div>
        <div style={styles.buttonGroup}>
          <button type="button" onClick={handleCancel} style={styles.cancelButton}>
            취소
          </button>
          <button type="button" onClick={handleNext} style={styles.nextButton}>
            다음
          </button>
        </div>
      </form>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    backgroundColor: "#FFFFFF",
    padding: "20px",
    maxWidth: "800px",
    margin: "50px auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    borderRadius: "8px",
    border: "1px solid #EDEDED",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  profilePictureWrapper: {
    marginRight: "20px",
  },
  column: {
    flex: 1,
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    marginBottom: "8px",
    fontSize: "14px",
    color: "#555",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid #CCC",
    fontSize: "14px",
    backgroundColor: "#F7F7F7",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid #CCC",
    fontSize: "14px",
    minHeight: "120px",
    resize: "none",
    backgroundColor: "#F7F7F7",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  hiddenFileInput: {
    display: "none",
  },
  imageUploadWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  imagePreviewWrapper: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#E0E0E0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  backgroundImagePreviewWrapper: {
    width: "100%",
    height: "100px",
    borderRadius: "12px",
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
  backgroundImagePreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholder: {
    fontSize: "14px",
    color: "#888",
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  cancelButton: {
    padding: "12px 20px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#CCC",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  nextButton: {
    padding: "12px 20px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#0079D3",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
};

export default CommunityCreatePage1;