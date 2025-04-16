import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate 사용
import LoginLogo from './LoginLogo';
import LoginInput from './LoginInput';
import LoginButton from './LoginButton';
import JoinButton from './JoinButton';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ LOGIN_ID: '', LOGIN_PW: '' });
  const navigate = useNavigate(); // navigate 함수 생성

  // Handle input changes and update state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  // Handle login on button click or Enter key press
  const handleLogin = async () => {
    const { LOGIN_ID, LOGIN_PW } = credentials;

    // Ensure both fields are filled
    if (LOGIN_ID.trim() && LOGIN_PW.trim()) {
      try {
        // Send login credentials to the backend API
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: LOGIN_ID.trim(),
            userPw: LOGIN_PW.trim(),
          }),
        });

        // Parse the JSON response
        const data = await response.json();
        console.log(data);

        // Check if login was successful
        if (data.status === 'success') {
          alert('로그인 성공!');
          // If login is successful, store user data in sessionStorage
          sessionStorage.setItem('user', JSON.stringify({ id: LOGIN_ID.trim() , pw: LOGIN_PW.trim()}));

          // Redirect user to the main page
          navigate('/main');
        } else {
          alert(data.message || '로그인 실패');
        }
      } catch (error) {
        console.error('로그인 요청 중 오류 발생:', error);
        alert('서버와 통신 중 문제가 발생했습니다.');
      }
    } else {
      alert('아이디와 패스워드 모두 입력하십시오.');
    }
  };

  // Handle the Enter key press to trigger login
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Redirect to the join page (회원가입)
  const handleJoin = () => {
    navigate('/join');
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
      <JoinButton onClick={handleJoin} /> {/* 회원가입 페이지로 이동 */}
    </div>
  );
};

export default LoginForm;
