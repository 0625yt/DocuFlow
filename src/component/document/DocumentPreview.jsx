import React from "react";

const DocumentPreview = ({ document, onClose }) => {
  if (!document) return null;
  // TODO: 파일 타입별 미리보기 구현 (현재는 텍스트만 예시)
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>문서 미리보기</h3>
        <div style={styles.content}>
          <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{document.content || "(미리보기 준비 중)"}</pre>
        </div>
        <button style={styles.btn} onClick={onClose}>닫기</button>
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
    minWidth: 400,
    minHeight: 200,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  content: {
    margin: "18px 0",
    maxHeight: 300,
    overflowY: "auto",
  },
  btn: {
    padding: "6px 18px",
    borderRadius: 4,
    border: "none",
    background: "#636e72",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default DocumentPreview; 