import React from 'react';
import JoinForm from './JoinForm'; // JoinForm 경로
import Footer from '../auth/Footer'; // Footer 경로
import './Join.css'; // 스타일 경로

const JoinPage = () => {
  return (
    <div className="join-page">
      <div className="container">
        <div className="panel-heading">
          <div className="main-center">
            <JoinForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JoinPage;
