// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from './LoginForm'; // LoginForm 경로
import Footer from './Footer'; // Footer 경로
import Logo from './Logo'; // Logo 컴포넌트
import './App.css'; // 스타일 경로

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="logo-container">
        <Logo /> {/* 로고 컴포넌트 */}
      </div>
      <div className="container">
        <div className="panel-heading">
          <div className="main-center">
            <LoginForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
