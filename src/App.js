import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './component/auth/LoginPage';
import JoinPage from './component/join/JoinPage';
import MainView from './component/main/mainView'; // 이름을 명확히
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

function RouteChangeTracker() {
  const location = useLocation();
  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [location]);
  return null;
}

// 인증 상태 확인 함수
function isAuthenticated() {
  const user = sessionStorage.getItem('user');
  try {
    const parsed = JSON.parse(user);
    return !!parsed?.id;
  } catch {
    return false;
  }
}

// 인증이 필요한 라우트
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// 로그인/회원가입 페이지에서 이미 로그인된 경우 메인으로 이동
function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/main" replace />;
  }
  return children;
}

const App = () => {
  return (
    <Router>
      <RouteChangeTracker />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        } />
        <Route path="/join" element={
          <PublicOnlyRoute>
            <JoinPage />
          </PublicOnlyRoute>
        } />
        <Route path="/main" element={
          <ProtectedRoute>
            <MainView />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
