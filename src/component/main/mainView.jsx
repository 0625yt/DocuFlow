import React, { useEffect, useState, useRef } from "react";
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
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

const FolderAndDocumentViewer = () => {
  const navigate = useNavigate();
  const [userInfoOpen, setUserInfoOpen] = React.useState(false);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [detailDoc, setDetailDoc] = React.useState(null);
  const [documents, setDocuments] = React.useState([]);
  const [panelWidth, setPanelWidth] = useState(360);
  const dragging = useRef(false);
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

  // 페이지 로드 시 서버에서 파일 목록 불러오기
React.useEffect(() => {
  const fetchFiles = async () => {
    const res = await fetch("http://localhost:8080/api/files");
    let files = await res.json();

    if (!Array.isArray(files)) {
      try {
        files = JSON.parse(files);
      } catch (e) {
        files = [];
      }
    }

    // files: [{name, size, lastModified}, ...]
    setDocuments(
      files.map(f => ({
        name: f.name,
        size: f.size,
        lastModified: f.lastModified,
        fileUrl: `http://localhost:8080/files/${f.name}`,
        downloadUrl: `http://localhost:8080/api/download?filename=${encodeURIComponent(f.name)}`
      }))
    );
  };

  fetchFiles();
}, []);


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
  const handleUpload = async (file) => {
    const isDocx = file.name.endsWith(".docx");
    if (!isDocx) {
      alert("docx 파일만 업로드 가능합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      if (!res.ok) throw new Error("업로드 실패: " + text);

      alert("업로드 성공!");
      await fetchFiles(); // 업로드 후 목록 새로고침

    } catch (e) {
      console.error("파일 업로드 실패:", e);
      alert("파일 업로드 실패: " + (e.message || e));
    }
  };

  // 파일 목록 불러오기
 const fetchFiles = async () => {
  const res = await fetch("http://localhost:8080/api/files");
  let files = await res.json();

  if (!Array.isArray(files)) {
    try {
      files = JSON.parse(files);
    } catch (e) {
      files = [];
    }
  }

  setDocuments(
    files.map(f => ({
      name: f.name,
      size: f.size,
      lastModified: f.lastModified,
      fileUrl: `http://localhost:8080/files/${f.name}`,
      downloadUrl: `http://localhost:8080/api/download?filename=${encodeURIComponent(f.name)}`
    }))
  );
};


  // 문서 미리보기 핸들러
  const handlePreview = async (doc) => {
  if (!doc.file && doc.name.endsWith(".docx")) {
    try {
      const res = await fetch(doc.downloadUrl);
      const blob = await res.blob();
      const file = new File([blob], doc.name, { type: blob.type });

      setDetailDoc({ ...doc, file });
    } catch (e) {
      alert("파일 로딩 실패: " + (e.message || e));
      return;
    }
  } else {
    setDetailDoc(doc);
  }
};
  const handlePreviewClose = () => setDetailDoc(null);

  // 문서 다운로드 핸들러(예시)
  const handleDownload = (doc) => {
    alert("다운로드 기능은 실제 구현 필요: " + doc.name);
  };

  // 문서 삭제 핸들러(서버 연동)
  const handleDeleteDoc = async (doc) => {
    if (!doc?.name) return;
    if (!window.confirm(`정말 삭제하시겠습니까?\n${doc.name}`)) return;

    try {
      const res = await fetch(`http://localhost:8080/api/files/${encodeURIComponent(doc.name)}`, {
        method: "DELETE",
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "삭제 실패");

      // 성공 시 목록에서 제거
      setDocuments(prev => prev.filter(d => d.name !== doc.name));
      alert("삭제 완료");
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제 실패: " + (e.message || e));
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging.current) return;
      const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 360), 900);
      setPanelWidth(newWidth);
    };
    const handleMouseUp = () => {
      dragging.current = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#f9f9f9" }}>
      <AppBar position="static" sx={{ background: "#263a53" }}>
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1, color: "#fff" }}>
      <img src="/logo.png" alt="회사로고" style={{ height: 32, marginRight: 12 }} />
      DocuFlow 업무시스템
    </Typography>
    <Avatar sx={{ bgcolor: "#1976d2" }}>U</Avatar>
    <Typography sx={{ ml: 1, color: "#fff" }}>홍길동</Typography>
    {/* 로그아웃 버튼 등 추가 */}
  </Toolbar>
</AppBar>
      <Header onLogout={handleLogout} onUserInfo={handleUserInfo} />
      <Box sx={{ display: "flex", height: "100vh" }}>
  {/* 사이드바 */}
  <Box sx={{ width: 220, background: "#f4f6fa", borderRight: "2px solid #dfe6e9", p: 2 }}>
    <Sidebar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelect={handleFolderSelect}
        onAddFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
      />
  </Box>
  {/* 본문 */}
  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", p: 3 }}>
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
  </Box>
</Box>
      <UserInfoModal isOpen={userInfoOpen} onClose={handleUserInfoClose} userId={userId} />
      <DocumentUploadModal isOpen={uploadOpen} onClose={handleUploadClose} onUpload={handleUpload} />
      <DocumentDetail document={detailDoc} onClose={handlePreviewClose} />
      <Box
        sx={{
          transition: "background 0.2s",
          zIndex: 2200,
          background: dragging.current ? "#b2bec3" : "#dfe6e9",
          cursor: "ew-resize",
          height: "100%",
          width: 12,
          top: 0,
          left: 0,
          position: "absolute",
        }}
        onMouseDown={() => { dragging.current = true; }}
      />
    </div>
  );
};

export default FolderAndDocumentViewer;