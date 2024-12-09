import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Navigate 추가
import LoginPage from './component/auth/LoginPage';
import JoinForm from './component/join/JoinForm';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* 기본 경로 접속 시 /login으로 리디렉션 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinForm />} />
      </Routes>
    </Router>
  );
};

export default App;
