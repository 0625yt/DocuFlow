import React, { useState } from 'react';
import './App.css'; 

const App = () => {
  const [credentials, setCredentials] = useState({ LOGIN_ID: '', LOGIN_PW: '' });

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
        const response = await fetch('http://localhost:8080/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginId: credentials.LOGIN_ID,
            loginPw: credentials.LOGIN_PW,
          }),
        });
          
        const data = await response.json();
        if (data.status === 'success') {
          alert(data.message);
        } else {
          alert(data.message);
        }
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

  return (
    <div className="login-page">
      <div className="container">
        <div className="panel-heading">
          <div className="main-center">
            <div className="logo">
              <img src="../../images/loginLogo.png" alt="Logo" />
            </div>

            <div className="row seperate-row">
              <span className="input-group-addon">
                <i className="fa fa-user" aria-hidden="true"></i>
              </span>
              <input
                type="email"
                className="form-control"
                name="LOGIN_ID"
                value={credentials.LOGIN_ID}
                placeholder="Enter your ID"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="row seperate-row">
              <span className="input-group-addon">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
              <input
                type="password"
                className="form-control"
                name="LOGIN_PW"
                value={credentials.LOGIN_PW}
                placeholder="Enter your password"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="row seperate-row">
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block btn-try-login"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer id="container-footer">
        Copyright ⓒ 보험금 지급 솔루션 포트폴리오 All Rights Reserved
      </footer>
    </div>
  );
};

export default App;
