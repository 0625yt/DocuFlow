import React from "react";
import "../../styles/global.css";
import useFolders from "../../hooks/useFolders";
import useDocuments from "../../hooks/useDocuments";
import { isValidFolderName, escapeHtml } from "../../utils/validator";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import DocumentTable from "../document/DocumentTable";
import DocumentDetail from "../document/DocumentDetail";
import DocumentUploadModal from "../document/DocumentUploadModal";
import UserInfoModal from "../common/UserInfoModal";
// DeleteModal 컴포넌트 import 예시 (사용 시 활성화)
// Modal 컴포넌트 import 예시 (사용 시 활성화)

const FolderAndDocumentViewer = () => {
  const navigate = useNavigate();
  const [userInfoOpen, setUserInfoOpen] = React.useState(false);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [detailDoc, setDetailDoc] = React.useState(null);
  const [documents, setDocuments] = React.useState([]);
  const userInfo = sessionStorage.getItem("user");
  let userId = "";
  if (userInfo) {
    try {
      userId = JSON.parse(userInfo).id;
    } catch (e) {
      userId = "";
    }
  }
  const {
    folders,
    selectedFolderId,
    selectedFolderName,
    handleSelect,
    handleCreate,
    handleDelete,
  } = useFolders(userId);
  const {
    loadDocument,
    upload,
  } = useDocuments();

  // 폴더 생성 핸들러
  const handleCreateFolder = async () => {
    const folderName = prompt("폴더 이름을 입력하세요:");
    if (!folderName) {
      alert("폴더 이름을 입력해야 합니다.");
      return;
    }
    if (!isValidFolderName(folderName)) {
      alert("폴더 이름은 한글, 영문, 숫자, 공백만 사용 가능하며 1~30자 이내여야 합니다.");
      return;
    }
    if (!userId) {
      alert("로그인된 사용자 정보가 없습니다.");
      return;
    }
    const folderDescription = "테스트 설명";
    const isRootFolder = true;
    const isSharedFolder = true;
    const requestData = {
      folderName: escapeHtml(folderName),
      userId,
      parentFolderId: null,
      description: folderDescription,
      isRoot: isRootFolder,
      isShared: isSharedFolder,
    };
    try {
      await handleCreate(requestData);
      alert("폴더가 생성되었습니다.");
    } catch (e) {
      console.error("폴더 생성 실패:", e);
      alert("폴더 생성 실패: " + (e.message || e));
    }
  };

  // 폴더 삭제 핸들러
  const handleDeleteFolder = async () => {
    if (!folders.length || !selectedFolderId) {
      alert("삭제할 폴더가 없습니다.");
      return;
    }
    try {
      await handleDelete(selectedFolderId);
      alert("폴더가 삭제되었습니다.");
    } catch (e) {
      console.error("폴더 삭제 실패:", e);
      alert("폴더 삭제 실패: " + (e.message || e));
    }
  };

  // 폴더 선택 시 문서 내용 불러오기
  const handleFolderSelect = async (folderId, folderName) => {
    try {
      handleSelect(folderId, folderName);
      await loadDocument(folderId);
    } catch (e) {
      console.error("문서 내용 불러오기 실패:", e);
      alert("문서 내용을 불러오지 못했습니다. 네트워크 상태를 확인하세요.");
    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  // 회원 정보 아이콘 클릭 핸들러
  const handleUserInfo = () => setUserInfoOpen(true);
  const handleUserInfoClose = () => setUserInfoOpen(false);

  // 문서 업로드 핸들러(모달)
  const handleUploadModal = () => setUploadOpen(true);
  const handleUploadClose = () => setUploadOpen(false);
  const handleUpload = (file) => {
    if (file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      alert("docx 파일만 업로드 가능합니다.");
      return;
    }
    console.log("업로드 파일:", file);
    // TODO: 실제 업로드 API 연동 필요
    setDocuments(prev => [
      ...prev,
      {
        id: Date.now(),
        name: file.name,
        author: userId,
        date: new Date().toISOString().slice(0, 10),
        size: (file.size / 1024 / 1024).toFixed(2) + "MB",
        file,
        content: "(업로드된 문서 내용 예시)",
      },
    ]);
  };

  // 문서 미리보기 핸들러
  const handlePreview = (doc) => setDetailDoc(doc);
  const handlePreviewClose = () => setDetailDoc(null);

  // 문서 다운로드 핸들러(예시)
  const handleDownload = (doc) => {
    alert("다운로드 기능은 실제 구현 필요: " + doc.name);
  };

  // 문서 삭제 핸들러(예시)
  const handleDeleteDoc = (doc) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#f9f9f9" }}>
      <Header onLogout={handleLogout} onUserInfo={handleUserInfo} />
      <Sidebar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelect={handleFolderSelect}
        onAddFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
      />
      <main style={{ marginLeft: 220, paddingTop: 70, paddingRight: 32, paddingLeft: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            {selectedFolderName ? `폴더: ${selectedFolderName}` : "폴더를 선택하세요"}
          </div>
          <button onClick={handleUploadModal} style={{ background: "#0984e3", color: "white", border: "none", borderRadius: 4, padding: "7px 18px", fontWeight: 600, cursor: "pointer" }}>문서 업로드</button>
        </div>
        <DocumentTable
          documents={documents}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onDelete={handleDeleteDoc}
        />
      </main>
      <UserInfoModal isOpen={userInfoOpen} onClose={handleUserInfoClose} userId={userId} />
      <DocumentUploadModal isOpen={uploadOpen} onClose={handleUploadClose} onUpload={handleUpload} />
      <DocumentDetail document={detailDoc} onClose={handlePreviewClose} />
    </div>
  );
};

export default FolderAndDocumentViewer;
