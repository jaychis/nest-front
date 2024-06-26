import React from "react";

interface FallbackScreenProps {
  message: string;
  retry: () => void;
}

const FallbackScreen: React.FC<FallbackScreenProps> = ({ message, retry }) => {
  return (
    <div style={styles.container}>
      <img src="/path/to/your/logo.png" alt="Logo" style={styles.logo} />
      <h1 style={styles.title}>Oops! Something went wrong.</h1>
      <p style={styles.message}>{message}</p>
      <button onClick={retry} style={styles.button}>Retry</button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center" as "center",
    backgroundColor: "#f8f9fa",
    color: "#343a40",
    padding: "20px",
  },
  logo: {
    width: "100px",
    height: "100px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold" as "bold",
    marginBottom: "10px",
  },
  message: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default FallbackScreen;