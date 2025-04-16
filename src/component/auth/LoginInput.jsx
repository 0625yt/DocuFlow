// components/auth/LoginInput.jsx
import React from 'react';

const LoginInput = ({ type, name, value, placeholder, onChange, onKeyDown, icon }) => {
  return (
    <div className="row seperate-row">
      <span className="input-group-addon">
        <i className={`fa fa-${icon}`} aria-hidden="true"></i>
      </span>
      <input
        type={type}
        className="form-control"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default LoginInput;
