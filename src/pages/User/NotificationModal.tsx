import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

interface NotificationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  buttonRef: React.RefObject<HTMLDivElement>;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onRequestClose,
  buttonRef,
}) => {
  const [activeSection, setActiveSection] = useState<string>("notifications");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onRequestClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, buttonRef, onRequestClose]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "70px",
          right: "20px",
          left: "auto",
          bottom: "auto",
          width: "500px",
          height: "300px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
        },
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ margin: "10px 0 10px 20px" }}>알림</h2>
        <button
          onClick={onRequestClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "34px",
            padding: "0 10px",
          }}
        >
          &times;
        </button>
      </div>

      <div style={styles.buttonContainer}>
        <button
          style={
            activeSection === "notifications"
              ? styles.activeButton
              : styles.button
          }
          onClick={() => setActiveSection("notifications")}
        >
          알림
        </button>
        <button
          style={
            activeSection === "messages" ? styles.activeButton : styles.button
          }
          onClick={() => setActiveSection("messages")}
        >
          메시지
        </button>
      </div>

      {activeSection === "notifications" && (
        <div style={styles.section}>
          <p>알림이 없습니다</p>
        </div>
      )}

      {activeSection === "messages" && (
        <div style={styles.section}>
          <p>메시지가 없습니다</p>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button style={styles.settingsButton}>설정 보기</button>
      </div>
    </ReactModal>
  );
};

const styles = {
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    margin: "10px",
    borderBottom: "2px solid transparent",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    cursor: "pointer",
    backgroundColor: "white",
    color: "#007BFF",
    fontWeight: "bold",
    transition: "border-color 0.3s, color 0.3s",
  },
  activeButton: {
    padding: "10px 20px",
    margin: "10px",
    borderBottom: "2px solid #007BFF",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    cursor: "pointer",
    backgroundColor: "white",
    color: "#007BFF",
    fontWeight: "bold",
    transition: "border-color 0.3s, color 0.3s",
  },
  section: {
    maxHeight: "400px",
    overflowY: "auto" as "auto",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  settingsButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "60px",
    cursor: "pointer",
    backgroundColor: "#D3D3D3",
    color: "black",
    fontWeight: "bold",
    transition: "background-color 0.3s, color 0.3s",
  },
};

export default NotificationModal;
