import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate 사용
import LoginLogo from './LoginLogo';
import LoginInput from './LoginInput';
import LoginButton from './LoginButton';
import JoinButton from './JoinButton';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ LOGIN_ID: '', LOGIN_PW: '' });
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수 생성

  // 입력값 변경 시 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  // 로그인 버튼 클릭 또는 Enter 키 입력 시 로그인 처리
  const handleLogin = async () => {
    const { LOGIN_ID, LOGIN_PW } = credentials;

    // 아이디와 비밀번호가 모두 입력되었는지 확인
    if (LOGIN_ID.trim() && LOGIN_PW.trim()) {
      try {
        // 로그인 정보를 백엔드 API로 전송
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

        // JSON 응답 파싱
        const data = await response.json();

        // 로그인 성공 여부 확인
        if (data.status === 'success') {
          // 로그인 성공 시 사용자 정보를 sessionStorage에 저장(비밀번호는 저장하지 않음)
          sessionStorage.setItem('user', JSON.stringify({ id: LOGIN_ID.trim() }));

          // 메인 페이지로 이동
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

  // Enter 키 입력 시 로그인 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // 회원가입 페이지로 이동
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
