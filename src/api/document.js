// 문서 관련 API 함수
import axios from "axios";

export async function uploadDocument(formData) {
  const response = await axios.post("http://localhost:8080/api/upload/document", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function fetchDocument(folderId) {
  const response = await axios.get(`http://localhost:8080/api/folder/${folderId}`);
  return response.data;
} 