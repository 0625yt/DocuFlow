import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate 사용
import JoinLogo from '../auth/LoginLogo';
import JoinInput from './JoinInput';
import JoinToButton from './JoinToButton';
import BacktoLoginButton from './BacktoLoginButton';
import './Join.css';

const JoinForm = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    phonenumber: '',
    userId: '',
    password: '',
    passwordCheck: '',
    email: '',
  }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleJoin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',


        },
        body: JSON.stringify(userInfo),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('회원가입 요청 중 오류 발생:', error);
      alert('서버와 통신 중 문제가 발생했습니다.');
    }
  };

  // 회원가입 페이지로 이동하는 함수
  const handleLogin = () => {
    navigate('/login'); // 회원가입 페이지로 이동
  };

  return (
    <div className="join-form">
      <h2>
        <span aria-hidden="true">🔑</span>
      </h2>
      <JoinLogo />
      <JoinInput
        type="text"
        name="username"
        placeholder="사용자 이름"
        value={userInfo.username}
        onChange={handleInputChange}
      />
      <JoinInput
        type="text"
        name="userId"
        placeholder="사용자 아이디"
        value={userInfo.userId}
        onChange={handleInputChange}
      />
      <JoinInput
        type="email"
        name="email"
        placeholder="이메일"
        value={userInfo.email}
        onChange={handleInputChange}
      />
      <JoinInput
        type="password"
        name="password"
        placeholder="비밀번호"
        value={userInfo.password}
        onChange={handleInputChange}
      />
      <JoinInput
        type="password"
        name="passwordCheck"
        placeholder="비밀번호 확인"
        value={userInfo.passwordCheck}
        onChange={handleInputChange}
      />
      <JoinToButton onClick={handleJoin} />
      <BacktoLoginButton onClick={handleLogin} />
    </div>
  );
};

export default JoinForm;
