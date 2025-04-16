import React from 'react';

const JoinInput = ({ type, name, value, placeholder, onChange, onKeyDown, icon }) => {
  return (
    <div className="row">
      {icon && (
        <span className="input-group-addon">
          <i className={`fa fa-${icon}`} aria-hidden="true"></i>
        </span>
      )}
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

export default JoinInput;
