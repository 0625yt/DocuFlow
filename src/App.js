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

const App = () => {
  return (
    <Router>
      <RouteChangeTracker />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/main" element={<MainView />} />
      </Routes>
    </Router>
  );
};

export default App;
