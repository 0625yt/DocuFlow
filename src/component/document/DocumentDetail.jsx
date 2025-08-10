import React, { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

const API_BASE = "http://localhost:8080";

const DocumentDetail = ({ document, onClose }) => {
  const [tab, setTab] = useState(0);
  const previewRef = useRef(null);
  const [error, setError] = useState("");
  const [panelWidth, setPanelWidth] = useState(480);
  const dragging = useRef(false);

  // 미리보기 로딩
  useEffect(() => {
    if (tab !== 1 || !document) return;

    let cancelled = false;

    const loadAndRender = async () => {
      try {
        setError("");
        if (!previewRef.current) return;

        const name = (document.name || "").toLowerCase();
        if (!name.endsWith(".docx")) {
          setError("지원하지 않는 파일 형식입니다.");
          return;
        }

        // 1) 업로드 직후처럼 file이 이미 있으면 사용
        let fileOrBuffer = document.file;

        // 2) 없으면 서버에서 다운로드해서 생성
        if (!fileOrBuffer) {
          // 우선순위: downloadUrl → /documents/download/{id}
          const url =
            document.downloadUrl
              ? (document.downloadUrl.startsWith("http") ? document.downloadUrl : `${API_BASE}${document.downloadUrl.startsWith("/") ? "" : "/"}${document.downloadUrl}`)
              : `${API_BASE}/documents/download/${document.id}`;

          const res = await fetch(url);
          if (!res.ok) throw new Error(`다운로드 실패 (HTTP ${res.status})`);

          // docx-preview는 ArrayBuffer도 받습니다.
          fileOrBuffer = await res.arrayBuffer();
        }

        if (cancelled) return;

        // 렌더 전에 비우기
        previewRef.current.innerHTML = "";

        // 옵션은 필요시 조절 가능
        await renderAsync(
          fileOrBuffer,
          previewRef.current,
          undefined,
          { className: "docx", inWrapper: false }
        );
      } catch (e) {
        if (!cancelled) setError("docx 미리보기에 실패했습니다.");
        // 콘솔에 자세한 원인 출력
        console.error(e);
      }
    };

    loadAndRender();
    return () => { cancelled = true; };
  }, [tab, document?.id]);

  // 리사이즈 핸들
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const w = Math.min(Math.max(window.innerWidth - e.clientX, 360), 900);
      setPanelWidth(w);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  if (!document) return null;

  return (
    <Box sx={{ ...styles.panel, width: panelWidth }}>
      <Box sx={styles.dragHandle} onMouseDown={() => { dragging.current = true; }} />
      <Box sx={styles.header}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary" sx={{ minHeight: 56 }}>
          <Tab label="기본 정보" sx={{ fontWeight: 700, fontSize: 16, minWidth: 120 }} />
          <Tab label="문서 보기" sx={{ fontWeight: 700, fontSize: 16, minWidth: 120 }} />
        </Tabs>
        <IconButton onClick={onClose} sx={{ ml: "auto" }}><CloseIcon /></IconButton>
      </Box>

      <Card sx={{ flex: 1, m: 2, boxShadow: 2, borderRadius: 3, minHeight: 300, overflow: "auto" }}>
        <CardContent>
          {tab === 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>{document.name}</Typography>
              <Typography variant="body2" color="text.secondary"><b>업로드일:</b> {document.uploadedAt ?? "-"}</Typography>
              <Typography variant="body2" color="text.secondary"><b>크기:</b> {document.size != null ? `${document.size} bytes` : "-"}</Typography>
              <Typography variant="body2" color="text.secondary"><b>경로:</b> {document.path ?? "-"}</Typography>
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ minHeight: 300 }}>
              <Box ref={previewRef} sx={{ background: "#fff", p: 2, borderRadius: 2, minHeight: 300, maxHeight: 600, overflow: "auto" }} />
              {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

const styles = {
  panel: {
    position: "fixed",
    top: 56,
    right: 0,
    height: "calc(100vh - 56px)",
    background: "#f8f9fa",
    boxShadow: "-2px 0 8px rgba(0,0,0,0.06)",
    zIndex: 2100,
    borderLeft: "1px solid #dfe6e9",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.15s cubic-bezier(.4,0,.2,1)",
  },
  dragHandle: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 8,
    height: "100%",
    cursor: "ew-resize",
    zIndex: 2200,
    background: "transparent",
    '&:hover': { background: "#dfe6e9" },
  },
  header: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #dfe6e9",
    background: "#fff",
    px: 2,
    height: 56,
  },
};

export default DocumentDetail;
