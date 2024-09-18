import React, { useState, useEffect, useRef, ChangeEvent, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "../../../contexts/CommunityContext";
import {
  AwsImageUploadFunctionality,
  AwsImageUploadFunctionalityReturnType,
  ImageLocalPreviewUrls,
  ImageLocalPreviewUrlsReturnType,
} from "../../../_common/ImageUploadFuntionality";
import styled from "styled-components";

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

  useEffect(() => {
    if (backgroundPicture && typeof backgroundPicture !== "string") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(backgroundPicture);
    } else if (typeof backgroundPicture === "string") {
      setBackgroundPreview(backgroundPicture);
    } else {
      setBackgroundPreview(null);
    }
  }, [backgroundPicture]);

  const handleNext = async () => {
    if (profilePicture && typeof profilePicture !== "string") {
      const profileRes: AwsImageUploadFunctionalityReturnType =
        await AwsImageUploadFunctionality({ fileList: [profilePicture] });
      if (!profileRes) return;
      setProfilePicture(profileRes.imageUrls[0]);
    }

    if (backgroundPicture && typeof backgroundPicture !== "string") {
      const backgroundRes: AwsImageUploadFunctionalityReturnType =
        await AwsImageUploadFunctionality({ fileList: [backgroundPicture] });
      if (!backgroundRes) return;
      setBackgroundPicture(backgroundRes.imageUrls[0]);
    }

    navigate("/community/create3", {
      state: { communityName, description },
    });
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleProfilePictureChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({ event: e });
    if (!urls) return;
    setProfilePreview(urls.previewUrls[0]);
    setProfilePicture(urls.fileList[0]);
  };

  const handleBackgroundPictureChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const urls: ImageLocalPreviewUrlsReturnType = await ImageLocalPreviewUrls({ event: e });
    if (!urls) return;
    setBackgroundPreview(urls.previewUrls[0]);
    setBackgroundPicture(urls.fileList[0]);
  };

  return (
    <Container textareaHeight={textareaHeight}>
      <Heading>커뮤니티 만들기</Heading>
      <form onSubmit={(e) => e.preventDefault()} style={{
        display: "flex",
        flexDirection: "column",
      }}>
        <BackgroundUploader>
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
        </BackgroundUploader>
        <div style={styles.row}>
            <ImageUploadWrapper>
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
                <div style={styles.placeholder}>프로필</div>
              )}
            </div>
          </ImageUploadWrapper>
          <CommunityNameInput
            required
            type="text"
            id="communityName"
            value={communityName}
            placeholder="커뮤니티 이름"
            onChange={(e) => setCommunityName(e.target.value)}
          />
        </div>
        <DescriptionWrapper>
          <label htmlFor="description" style={{
            color: "#555",
            fontWeight: "bold",
          }}>
            설명
          </label>
          <DescriptionTextArea
            required
            id="description"
            ref={textareaRef}
            value={description}
            height={textareaHeight}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DescriptionWrapper>
        <div style={styles.buttonGroup}>
          <button type="button" onClick={handleCancel} style={styles.cancelButton}>
            취소
          </button>
          <button type="button" onClick={handleNext} style={styles.nextButton}>
            다음
          </button>
        </div>
      </form>
    </Container>
  );
};

const Container = styled.div<{textareaHeight: string}>`
  background-color: #FFFFFF;
  padding: 20px;
  max-width: 800px;
  margin: 50px auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 8px;
  border: 1px solid #EDEDED;
  height: calc(400px + ${props => props.textareaHeight} + 40px)}
`;

const Heading = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;
const BackgroundUploader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 20px;
`;
const CommunityNameInput = styled.input`
  flex: 1;
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #CCC;
  font-size: 14px;
  background-color: #F7F7F7;
  box-sizing: border-box;
  margin-bottom: 20px;
`;
const DescriptionWrapper = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
`;
const DescriptionTextArea = styled.textarea<{height: string}>`
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #CCC;
  min-height: 120px;
  margin-top: 18px;
  resize: none;
  background-color: #F7F7F7;
  box-sizing: border-box;
  overflow: hidden;
  height: ${props => props.height};
`;
const ImageUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-right: 20px;
  justify-content: center;
  cursor: pointer;
`;

const styles: { [key: string]: CSSProperties } = {
  row: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  label: {
    marginBottom: "8px",
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
    width: "90px",
    height: "90px",
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
    height: "140px",
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