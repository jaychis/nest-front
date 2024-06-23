import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "../../../contexts/CommunityContext";
import { CommunitySubmitAPI } from "../../api/CommunityApi";
import { CommunityVisibilityType } from "../../../_common/CollectionTypes";
import { CommunityTagsSubmitAPI } from "../../api/CommunityTagsAPI";
import { FaGlobe, FaLock, FaUsers } from "react-icons/fa"; // Importing icons from react-icons

const CommunityCreatePage4: React.FC = () => {
  const navigate = useNavigate();
  const { communityName, description, banner, icon, topics } = useCommunity();
  const [visibility, setVisibility] = useState<CommunityVisibilityType>("PUBLIC");
  
  useEffect(() => {
    console.log("topics : ", topics);
  }, [topics]);

  const [isCommunity, setIsCommunity] = useState<{
    readonly name: string;
    readonly description: string;
    readonly banner?: string | null;
    readonly icon?: string | null;
    readonly visibility: CommunityVisibilityType;
    readonly topics: string[];
  }>({
    name: communityName,
    description: description,
    banner: banner,
    icon: icon,
    visibility: "PUBLIC",
    topics: [],
  });

  const handleSubmit = async (): Promise<void> => {
    const coRes = await CommunitySubmitAPI({
      name: isCommunity.name,
      description: isCommunity.description,
      banner: isCommunity.banner,
      icon: isCommunity.icon,
      visibility: isCommunity.visibility,
    });

    if (!coRes) return;
    const coResponse = await coRes.data.response;
    console.log("community Submit coResponse : ", coResponse);

    const tagResponse = [];
    if (topics.length > 0) {
      const tagRes = await CommunityTagsSubmitAPI({
        tags: topics,
        communityId: coResponse.id,
      });
      if (!tagRes) return;
      console.log("tagRes : ", tagRes);
      tagResponse.push(tagRes.data.response);
    }
    console.log("tagResponse : ", tagResponse);
    setIsCommunity({
      ...coResponse,
      topic: tagResponse,
    });

    navigate("/");
  };

  const handleBack = () => {
    navigate("/community/create3");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>커뮤니티 공개 설정</h2>
      <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === "PUBLIC"}
              onChange={() => setVisibility("PUBLIC")}
              style={styles.radio}
            />
            <div style={styles.optionContent}>
              <FaGlobe style={styles.icon} />
              <div>
                <div>공개</div>
                <div style={styles.optionDescription}>모든 사용자가 이 커뮤니티를 볼 수 있습니다.</div>
              </div>
            </div>
          </label>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <input
              type="radio"
              name="visibility"
              value="restricted"
              checked={visibility === "RESTRICTED"}
              onChange={() => setVisibility("RESTRICTED")}
              style={styles.radio}
            />
            <div style={styles.optionContent}>
              <FaUsers style={styles.icon} />
              <div>
                <div>제한</div>
                <div style={styles.optionDescription}>모든 사용자가 이 커뮤니티를 볼 수 있지만, 참여하려면 승인이 필요합니다.</div>
              </div>
            </div>
          </label>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === "PRIVATE"}
              onChange={() => setVisibility("PRIVATE")}
              style={styles.radio}
            />
            <div style={styles.optionContent}>
              <FaLock style={styles.icon} />
              <div>
                <div>비공개</div>
                <div style={styles.optionDescription}>초대된 사용자만 이 커뮤니티를 볼 수 있습니다.</div>
              </div>
            </div>
          </label>
        </div>
        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleBack}
            style={styles.cancelButton}
          >
            이전
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            style={styles.nextButton}
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#FFFFFF",
    padding: "20px",
    maxWidth: "600px",
    height: "auto",
    margin: "50px auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    borderRadius: "8px",
    border: "1px solid #EDEDED",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center" as "center",
  },
  form: {
    display: "flex",
    flexDirection: "column" as "column",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#555",
    fontWeight: "bold" as "bold",
    cursor: "pointer",
  },
  radio: {
    marginRight: "10px",
  },
  optionContent: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    width: "25px",
    height: "25px",
    margin: "0 10px",
  },
  optionDescription: {
    fontSize: "12px",
    color: "#888",
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
    fontWeight: "bold" as "bold",
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
    fontWeight: "bold" as "bold",
    transition: "background-color 0.3s ease",
  },
};

export default CommunityCreatePage4;