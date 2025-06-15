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

const DocumentDetail = ({ document, onClose }) => {
  const [tab, setTab] = useState(0);
  const previewRef = useRef();
  const [error, setError] = useState("");

  useEffect(() => {
    if (tab === 1 && document && document.file && document.file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // docx 미리보기
      const file = document.file;
      const render = async () => {
        try {
          previewRef.current.innerHTML = "";
          await renderAsync(file, previewRef.current);
        } catch (e) {
          setError("docx 미리보기에 실패했습니다.");
        }
      };
      render();
    }
  }, [tab, document]);

  if (!document) return null;

  return (
    <Box sx={styles.panel}>
      <Box sx={styles.header}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ minHeight: 56 }}
        >
          <Tab label="기본 정보" sx={{ fontWeight: 700, fontSize: 16, minWidth: 120 }} />
          <Tab label="문서 보기" sx={{ fontWeight: 700, fontSize: 16, minWidth: 120 }} />
        </Tabs>
        <IconButton onClick={onClose} sx={{ ml: 'auto' }}><CloseIcon /></IconButton>
      </Box>
      <Card sx={{ flex: 1, m: 2, boxShadow: 2, borderRadius: 3, minHeight: 300, overflow: 'auto' }}>
        <CardContent>
          {tab === 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>{document.name}</Typography>
              <Typography variant="body2" color="text.secondary"><b>작성자:</b> {document.author}</Typography>
              <Typography variant="body2" color="text.secondary"><b>업로드일:</b> {document.date}</Typography>
              <Typography variant="body2" color="text.secondary"><b>크기:</b> {document.size}</Typography>
              <Typography variant="body2" color="text.secondary"><b>설명:</b> {document.desc || "-"}</Typography>
            </Box>
          )}
          {tab === 1 && (
            <Box sx={{ minHeight: 300 }}>
              {document.file && document.file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                <Box ref={previewRef} sx={{ background: "#fff", p: 2, borderRadius: 2, minHeight: 300, maxHeight: 600, overflow: "auto" }} />
              ) : (
                <Typography color="error">지원하지 않는 파일 형식입니다.</Typography>
              )}
              {error && <Typography color="error">{error}</Typography>}
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
    width: 480,
    height: "calc(100vh - 56px)",
    background: "#f8f9fa",
    boxShadow: "-2px 0 8px rgba(0,0,0,0.06)",
    zIndex: 2100,
    borderLeft: "1px solid #dfe6e9",
    display: "flex",
    flexDirection: "column",
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