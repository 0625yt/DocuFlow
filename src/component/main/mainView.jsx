// src/components/view/MainView.jsx
import React, { useEffect, useRef, useState } from "react";
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

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const API_BASE = "http://localhost:8080";

const MainView = () => {
  const navigate = useNavigate();

  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detailDoc, setDetailDoc] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [panelWidth, setPanelWidth] = useState(360);
  const dragging = useRef(false);

  const [askFolderNameOpen, setAskFolderNameOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  const userInfo = sessionStorage.getItem("user");
  let userId = "";
  if (userInfo) {
    try {
      userId = JSON.parse(userInfo).id;
    } catch {}
  }

  const {
    folders,
    selectedFolderId,
    selectedFolderName,
    handleSelect,
    handleCreate,
    handleDelete,
    refreshFolders,
  } = useFolders(userId);

  // 폴더별 문서 불러오기
  const fetchDocuments = async (folderId) => {
    if (!folderId) {
      setDocuments([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/documents?folderId=${folderId}`);
      if (!res.ok) throw new Error("문서 목록을 불러오지 못했습니다.");
      const list = await res.json();
      setDocuments(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setSnack({ open: true, severity: "error", message: e.message });
      setDocuments([]);
    }
  };

  // 폴더별 문서 업로드
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

  // 폴더별 문서 삭제
  const deleteDocument = async (docId) => {
    const res = await fetch(`${API_BASE}/documents/${docId}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) throw new Error(await res.text());
  };

  useEffect(() => {
    fetchDocuments(selectedFolderId);
  }, [selectedFolderId]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const w = Math.min(Math.max(window.innerWidth - e.clientX, 360), 900);
      setPanelWidth(w);
    };
    const onUp = () => (dragging.current = false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // 폴더 생성
  const handleCreateFolderSubmit = async () => {
    const folderName = newFolderName.trim();
    if (!folderName) {
      setSnack({ open: true, severity: "warning", message: "폴더 이름을 입력하세요." });
      return;
    }
    if (!isValidFolderName(folderName)) {
      setSnack({ open: true, severity: "warning", message: "폴더 이름 형식이 올바르지 않습니다." });
      return;
    }
    try {
      await handleCreate({
        folderName: escapeHtml(folderName),
        userId,
        parentFolderId: null,
        description: "",
        isRoot: false,
        isShared: false,
      });
      await (refreshFolders?.());
      setAskFolderNameOpen(false);
      setSnack({ open: true, severity: "success", message: "폴더가 생성되었습니다." });
    } catch (e) {
      console.error(e);
      setSnack({ open: true, severity: "error", message: `폴더 생성 실패: ${e.message}` });
    }
  };

  // 폴더 삭제
  const handleConfirmDelete = async () => {
    const target = confirmTarget;
    setConfirmOpen(false);
    try {
      if (target?.type === "folder") {
        await handleDelete(target.id);
        await (refreshFolders?.());
        setDocuments([]);
        handleSelect(null, "");
        setSnack({ open: true, severity: "success", message: "폴더를 삭제했습니다." });
      } else if (target?.type === "doc") {
        await deleteDocument(target.doc.id);
        setDocuments((prev) => prev.filter((d) => d.id !== target.doc.id));
        setSnack({ open: true, severity: "success", message: "문서를 삭제했습니다." });
      }
    } catch (e) {
      console.error(e);
      setSnack({ open: true, severity: "error", message: e.message || "삭제 실패" });
    }
  };

  const handleUpload = async (file) => {
    if (!selectedFolderId) {
      setSnack({ open: true, severity: "info", message: "먼저 폴더를 선택하세요." });
      return;
    }
    if (!file.name.toLowerCase().endsWith(".docx")) {
      setSnack({ open: true, severity: "warning", message: "docx 파일만 업로드 가능합니다." });
      return;
    }
    try {
      const saved = await uploadIntoFolder(file, selectedFolderId);
      setDocuments((prev) => [saved, ...prev]);
      setUploadOpen(false);
      setSnack({ open: true, severity: "success", message: "업로드 성공!" });
    } catch (e) {
      console.error(e);
      setSnack({ open: true, severity: "error", message: `업로드 실패: ${e.message}` });
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#f9f9f9" }}>
      <AppBar position="static" sx={{ background: "#263a53" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#fff" }}>
            <img src="/logo.png" alt="회사로고" style={{ height: 32, marginRight: 12 }} />
            DocuFlow 업무시스템
          </Typography>
          <Avatar sx={{ bgcolor: "#1976d2" }}>U</Avatar>
        </Toolbar>
      </AppBar>

      <Header onLogout={() => navigate("/login")} onUserInfo={() => setUserInfoOpen(true)} />

      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ width: 220, background: "#f4f6fa", borderRight: "2px solid #dfe6e9", p: 2 }}>
          <Sidebar
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelect={(id, name) => handleSelect(id, name)}
            onAddFolder={() => setAskFolderNameOpen(true)}
            onDeleteFolder={() => {
              if (selectedFolderId) {
                setConfirmTarget({ type: "folder", id: selectedFolderId, label: selectedFolderName });
                setConfirmOpen(true);
              }
            }}
          />
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", p: 3 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              {selectedFolderName ? `폴더: ${selectedFolderName}` : "폴더를 선택하세요"}
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              style={{ background: "#0984e3", color: "white", border: "none", borderRadius: 4, padding: "7px 18px", fontWeight: 600, cursor: "pointer" }}
              disabled={!selectedFolderId}
            >
              문서 업로드
            </button>
          </div>
          <DocumentTable
            documents={documents}
            onPreview={(doc) => setDetailDoc(doc)}
            onDownload={(doc) => window.open(`${API_BASE}/documents/download/${doc.id}`, "_blank")}
            onDelete={(doc) => {
              setConfirmTarget({ type: "doc", doc, label: doc.name });
              setConfirmOpen(true);
            }}
          />
        </Box>
      </Box>

      {/* 모달 */}
      <UserInfoModal isOpen={userInfoOpen} onClose={() => setUserInfoOpen(false)} userId={userId} />
      <DocumentUploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onUpload={handleUpload} />
      <DocumentDetail document={detailDoc} onClose={() => setDetailDoc(null)} />

      {/* 폴더 생성 다이얼로그 */}
      <Dialog open={askFolderNameOpen} onClose={() => setAskFolderNameOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>새 폴더 생성</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            label="폴더 이름"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAskFolderNameOpen(false)}>취소</Button>
          <Button variant="contained" onClick={handleCreateFolderSubmit}>
            확인
          </Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          {confirmTarget?.type === "folder"
            ? `폴더 "${confirmTarget.label}" 및 폴더 내 문서를 삭제합니다.`
            : `문서 "${confirmTarget?.label}" 를 삭제합니다.`}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>취소</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      {/* 스낵바 */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2200}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled" sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MainView;
