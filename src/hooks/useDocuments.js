import { useState } from "react";
import { fetchDocument, uploadDocument } from "../api/document";

export default function useDocuments() {
  const [documentContent, setDocumentContent] = useState("");

  // 문서 내용을 불러오는 함수
  const loadDocument = async (folderId) => {
    try {
      const data = await fetchDocument(folderId);
      setDocumentContent(data.content || "문서 내용이 없습니다.");
    } catch (e) {
      setDocumentContent("문서 내용을 불러오지 못했습니다.");
    }
  };

  // 문서를 업로드하는 함수
  const upload = async (formData) => {
    await uploadDocument(formData);
  };

  return {
    documentContent,
    loadDocument,
    upload,
    setDocumentContent,
  };
} 