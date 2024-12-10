// components/auth/LoginButton.jsx
import React from 'react';

const LoginButton = ({ onClick }) => {
  return (
    <div className="row seperate-row">
      <button
        type="button"
        className="btn btn-primary btn-lg btn-block btn-try-to-login"
        onClick={onClick}
      >
        Login
      </button>
    </div>
  );
};

export default LoginButton;
