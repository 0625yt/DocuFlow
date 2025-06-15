// 입력값 검증 및 XSS 방지 유틸 함수

// 폴더명: 한글, 영문, 숫자, 공백만 허용, 1~30자
export function isValidFolderName(name) {
  return /^[가-힣a-zA-Z0-9 ]{1,30}$/.test(name);
}

// HTML 이스케이프 처리(XSS 방지)
export function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[tag]
  ));
} 