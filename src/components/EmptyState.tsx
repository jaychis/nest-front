// src/components/EmptyState.tsx

import React from "react";
import logo from "../assets/img/panda_logo.png";
const EmptyState = () => {
  return (
    <div style={styles.container}>
      <img src={logo} alt="Empty State" style={styles.image} />
      <p style={styles.text}>아직 아무것도 없어요!</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f8f8f8",
  },
  image: {
    width: "150px",
    height: "150px",
    marginBottom: "20px",
    borderRadius: "50%",
    border: "2px solid #ddd",
  },
  text: {
    fontSize: "18px",
    color: "#888",
    fontWeight: "bold",
  },
};

export default EmptyState;