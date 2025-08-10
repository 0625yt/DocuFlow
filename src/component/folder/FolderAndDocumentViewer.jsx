import React, { useEffect, useState, useRef } from "react";
import "../../styles/global.css";
import useFolders from "../../hooks/useFolders";
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

// 새로 추가한 공용 모달/스낵바
import ConfirmDialog from "../common/ConfirmDialog";
import InputDialog from "../common/InputDialog";
import NoticeSnackbar from "../common/NoticeSnackbar";

const API_BASE = "http://localhost:8080"; // 필요시 .env로 분리

const FolderAndDocumentViewer = () => {
  const navigate = useNavigate();

  // UI 상태
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detailDoc, setDetailDoc] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [panelWidth, setPanelWidth] = useState(360);
  const dragging = useRef(false);

  // 모달/스낵바 상태
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState(null);
  const [inputOpen, setInputOpen] = useState(false);
  const [snack, setSnack] = useState({ open:false, severity:"success", message:"" });

  // 사용자
  const userInfo = sessionStorage.getItem("user");
  let userId = "";
  if (userInfo) {
    try { userId = JSON.parse(userInfo).id; } catch {}
  }

  // 폴더 훅
  const {
    folders,
    selectedFolderId,
    selectedFolderName,
    handleSelect,
    handleCreate,
    handleDelete,
    refreshFolders, // 훅에 없다면 만들어두면 좋아요 (생성/삭제 후 재조회)
  } = useFolders(userId);

  // ---------------------------
  // 문서 API 래퍼
  // ---------------------------
  const fetchDocuments = async (folderId) => {
    if (!folderId) { setDocuments([]); return; }
    const res = await fetch(`${API_BASE}/documents?folderId=${folderId}`);
    if (!res.ok) throw new Error("문서 목록 조회 실패");
    const list = await res.json(); // [{id, name, path, size, uploadedAt, ...}]
    setDocuments(Array.isArray(list) ? list : []);
  };

  const uploadIntoFolder = async (file, folderId) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE}/documents/upload?folderId=${folderId}`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const deleteDocument = async (docId) => {
    const res = await fetch(`${API_BASE}/documents/${docId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
  };

  // ---------------------------
  // 이벤트 핸들러
  // ---------------------------
  const handleCreateFolderClick = () => {
    setInputOpen(true);
  };

  const handleCreateFolderSubmit = async (value) => {
    setInputOpen(false);
    const folderName = (value || "").trim();
    if (!folderName) {
      setSnack({ open:true, severity:"warning", message:"폴더 이름을 입력하세요."});
      return;
    }
    if (!isValidFolderName(folderName)) {
      setSnack({ open:true, severity:"warning", message:"폴더 이름은 한글/영문/숫자/공백 1~30자입니다."});
      return;
    }
    if (!userId) {
      setSnack({ open:true, severity:"error", message:"로그인이 필요합니다."});
      return;
    }

    const requestData = {
      folderName: escapeHtml(folderName),
      userId,
      parentFolderId: null,
      description: "",
      isRoot: false,
      isShared: false,
    };

    try {
      await handleCreate(requestData);
      await (refreshFolders?.()); // 훅에 재조회 함수 있다면 호출
      setSnack({ open:true, severity:"success", message:"폴더가 생성되었습니다."});
    } catch (e) {
      console.error(e);
      setSnack({ open:true, severity:"error", message:`폴더 생성 실패: ${e.message || e}`});
    }
  };

  const handleDeleteFolderClick = () => {
    if (!folders.length || !selectedFolderId) {
      setSnack({ open:true, severity:"info", message:"삭제할 폴더가 없습니다."});
      return;
    }
    setConfirmPayload({ type:"folder", id: selectedFolderId, name: selectedFolderName });
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    const payload = confirmPayload;
    setConfirmOpen(false);

    try {
      if (payload?.type === "folder") {
        await handleDelete(payload.id); // 백엔드에서 문서까지 같이 삭제되도록 구현되어 있어야 함
        await (refreshFolders?.());
        setDocuments([]);
        handleSelect(null, "");
        setSnack({ open:true, severity:"success", message:"폴더가 삭제되었습니다."});
      } else if (payload?.type === "doc") {
        await deleteDocument(payload.id);
        setDocuments(prev => prev.filter(d => d.id !== payload.id));
        setSnack({ open:true, severity:"success", message:"문서를 삭제했습니다."});
      }
    } catch (e) {
      console.error(e);
      setSnack({ open:true, severity:"error", message:e.message || "삭제 실패"});
    }
  };

  const handleFolderSelect = async (folderId, folderName) => {
    try {
      handleSelect(folderId, folderName);
      await fetchDocuments(folderId);
    } catch (e) {
      console.error(e);
      setSnack({ open:true, severity:"error", message:"문서 목록을 불러오지 못했습니다."});
    }
  };

  const handleUploadModal = () => setUploadOpen(true);
  const handleUploadClose = () => setUploadOpen(false);

  const handleUpload = async (file) => {
    if (!selectedFolderId) {
      setSnack({ open:true, severity:"info", message:"먼저 업로드할 폴더를 선택하세요."});
      return;
    }
    if (!file?.name?.toLowerCase().endsWith(".docx")) {
      setSnack({ open:true, severity:"warning", message:"docx 파일만 업로드 가능합니다."});
      return;
    }
    try {
      const saved = await uploadIntoFolder(file, selectedFolderId);
      // 즉시 반영(낙관적 업데이트) 또는 재조회
      setDocuments(prev => [saved, ...prev]);
      setUploadOpen(false);
      setSnack({ open:true, severity:"success", message:"업로드 성공!"});
    } catch (e) {
      console.error(e);
      setSnack({ open:true, severity:"error", message:`업로드 실패: ${e.message || e}`});
    }
  };

  const handlePreview = (doc) => {
    // DocumentDetail에 다운로드/미리보기 로직이 있다면 그대로 전달
    setDetailDoc(doc);
  };

  const handleDeleteDoc = (doc) => {
    setConfirmPayload({ type:"doc", id: doc.id, name: doc.name });
    setConfirmOpen(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const handleUserInfo = () => setUserInfoOpen(true);
  const handleUserInfoClose = () => setUserInfoOpen(false);

  // 패널 리사이즈(기존 유지)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging.current) return;
      const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 360), 900);
      setPanelWidth(newWidth);
    };
    const handleMouseUp = () => { dragging.current = false; };
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
            onAddFolder={handleCreateFolderClick}
            onDeleteFolder={handleDeleteFolderClick}
          />
        </Box>

        {/* 본문 */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", p: 3 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {selectedFolderName ? `폴더: ${selectedFolderName}` : "폴더를 선택하세요"}
            </div>
            <button
              onClick={handleUploadModal}
              style={{ background: "#0984e3", color: "white", border: "none", borderRadius: 4, padding: "7px 18px", fontWeight: 600, cursor: "pointer" }}
              disabled={!selectedFolderId}
              title={!selectedFolderId ? "먼저 폴더를 선택하세요" : ""}
            >
              문서 업로드
            </button>
          </div>

          <DocumentTable
            documents={documents}
            onPreview={handlePreview}
            onDownload={(doc)=>window.open(`${API_BASE}/documents/download/${doc.id}`, "_blank")}
            onDelete={handleDeleteDoc}
          />
        </Box>
      </Box>

      <UserInfoModal isOpen={userInfoOpen} onClose={handleUserInfoClose} userId={userId} />
      <DocumentUploadModal isOpen={uploadOpen} onClose={handleUploadClose} onUpload={handleUpload} />
      <DocumentDetail document={detailDoc} onClose={()=>setDetailDoc(null)} />

      {/* 리사이즈 핸들 (기존 유지) */}
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

      {/* 모달/스낵바 */}
      <InputDialog
        open={inputOpen}
        title="새 폴더 생성"
        label="폴더 이름"
        defaultValue=""
        onClose={()=>setInputOpen(false)}
        onSubmit={handleCreateFolderSubmit}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="삭제 확인"
        description={
          confirmPayload?.type === "folder"
            ? `폴더 "${confirmPayload?.name}" 및 폴더 내 모든 문서를 삭제합니다. 계속할까요?`
            : `문서 "${confirmPayload?.name}" 를 삭제합니다. 계속할까요?`
        }
        confirmText="삭제"
        onClose={()=>setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
      <NoticeSnackbar
        open={snack.open}
        severity={snack.severity}
        message={snack.message}
        onClose={()=>setSnack(s=>({ ...s, open:false }))}
      />
    </div>
  );
};

export default FolderAndDocumentViewer;
