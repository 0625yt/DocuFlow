import React, { useState } from "react";

// 회원 정보 수정 모달
const UserInfoModal = ({ isOpen, onClose, userId }) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!password || !newPassword) {
      setMessage("현재 비밀번호와 새 비밀번호를 모두 입력하세요.");
      return;
    }
    // TODO: 실제 비밀번호 변경 API 연동 필요
    setMessage("비밀번호가 변경되었습니다. (실제 연동 필요)");
    setPassword("");
    setNewPassword("");
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>회원 정보 수정</h3>
        <div style={{ marginBottom: 10 }}>아이디: <b>{userId}</b></div>
        <input
          type="password"
          placeholder="현재 비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          style={styles.input}
        />
        {message && <div style={{ color: "red", marginBottom: 10 }}>{message}</div>}
        <div style={{ marginTop: 10 }}>
          <button onClick={handleSave} style={styles.button}>저장</button>
          <button onClick={onClose} style={styles.button}>닫기</button>
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
    zIndex: 2001,
  },
  modal: {
    background: "white",
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    minWidth: 320,
    textAlign: "center",
  },
  input: {
    width: "90%",
    padding: 8,
    margin: "6px 0",
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    margin: "0 8px",
    padding: "8px 18px",
    borderRadius: 4,
    border: "none",
    background: "#4a69bd",
    color: "white",
    cursor: "pointer",
  },
};

export default UserInfoModal; 