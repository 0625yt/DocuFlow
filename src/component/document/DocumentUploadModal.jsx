import React, { useRef, useState } from "react";

const DocumentUploadModal = ({ isOpen, onClose, onUpload }) => {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = e => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = () => {
    if (!file) {
      setError("파일을 선택하세요.");
      return;
    }
    onUpload(file);
    setFile(null);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>문서 업로드</h3>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={styles.input} />
        {error && <div style={{ color: "red", margin: "8px 0" }}>{error}</div>}
        <div style={{ marginTop: 10 }}>
          <button onClick={handleUpload} style={styles.btn}>업로드</button>
          <button onClick={onClose} style={styles.btn}>닫기</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3001,
  },
  modal: {
    background: "white",
    padding: 24,
    borderRadius: 8,
    minWidth: 340,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  input: {
    margin: "12px 0",
  },
  btn: {
    margin: "0 8px",
    padding: "6px 18px",
    borderRadius: 4,
    border: "none",
    background: "#0984e3",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default DocumentUploadModal; 