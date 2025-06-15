import React from "react";

// 모달 컴포넌트
const Modal = ({ isOpen, onClose, onDelete, message }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p>{message}</p>
        <button onClick={onDelete}>삭제</button>
        <button onClick={onClose}>취소</button>
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
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    minWidth: 300,
    textAlign: "center",
  },
};

export default Modal;
