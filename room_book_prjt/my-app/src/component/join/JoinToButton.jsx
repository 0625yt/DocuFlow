import React from 'react';

const JoinToButton = ({ onClick }) => {
  return (
    <div className="seperate-join-row">
      <button
        type="button"
        className="btn-try-join"
        onClick={onClick}
      >
        가입하기
      </button>
    </div>
  );
};

export default JoinToButton;
