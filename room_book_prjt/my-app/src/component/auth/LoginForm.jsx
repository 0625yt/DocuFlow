// components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate 사용
import LoginLogo from './LoginLogo';
import LoginInput from './LoginInput';
import LoginButton from './LoginButton';
import JoinButton from './JoinButton';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ LOGIN_ID: '', LOGIN_PW: '' });
  const navigate = useNavigate(); // navigate 함수 생성

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    if (credentials.LOGIN_ID && credentials.LOGIN_PW) {
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: credentials.LOGIN_ID,
            userPw: credentials.LOGIN_PW,
          }),
        });

        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error('로그인 요청 중 오류 발생:', error);
        alert('서버와 통신 중 문제가 발생했습니다.');
      }
    } else {
      alert('아이디와 패스워드 모두 입력하십시오.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // 회원가입 페이지로 이동하는 함수
  const handleJoin = () => {
    navigate('/join'); // 회원가입 페이지로 이동
  };


  return (
    <div className="login-form">
      <LoginLogo />
      <LoginInput
        type="email"
        name="LOGIN_ID"
        value={credentials.LOGIN_ID}
        placeholder="Enter your ID"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        icon="user"
      />
      <LoginInput
        type="password"
        name="LOGIN_PW"
        value={credentials.LOGIN_PW}
        placeholder="Enter your password"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        icon="lock"
      />
      <LoginButton onClick={handleLogin} />
     <JoinButton onClick={handleJoin} /> {/* handleJoin을 핸들러로 전달 */}
      </div>
  );
};

export default LoginForm;