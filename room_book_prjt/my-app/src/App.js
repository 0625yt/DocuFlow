import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Navigate 추가
import LoginPage from './component/auth/LoginPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* 기본 경로 접속 시 /login으로 리디렉션 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
