// 문서 관련 API 함수
import axios from "axios";

export async function uploadDocument(formData) {
  // 문서를 업로드합니다.
  const response = await axios.post("http://localhost:8080/api/upload/document", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function fetchDocument(folderId) {
  // 문서 내용을 불러옵니다.
  const response = await axios.get(`http://localhost:8080/api/download/document?folderId=${folderId}`);
  return response.data;
}

export async function downloadDocument(folderId) {
  // 파일 다운로드를 위한 API 호출
  return axios.get(
    `http://localhost:8080/api/download/document?folderId=${folderId}`,
    { responseType: 'blob' }
  );
} 