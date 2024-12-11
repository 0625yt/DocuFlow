import React from 'react';

const BacktoLoginButton = ({ onClick }) => {
  return (
    <div className="seperate-join-row">
      <button
        type="button"
        className="btn-try-back"
        onClick={onClick}
      >
        취소하기
      </button>
    </div>
  );
};

export default BacktoLoginButton;
