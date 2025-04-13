import React from 'react';
import ReactDOM from 'react-dom/client';
import './component/auth/App.css'; // App.css도 함께 루트로 이동
import App from './App'; // 경로를 수정
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
