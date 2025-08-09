import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

const DocumentTable = ({ documents, onPreview, onDownload, onDelete }) => {
  // 데이터가 배열로 들어오는 경우, flat 처리
  const normalizedDocuments = Array.isArray(documents[0])
    ? documents.flat()
    : documents;

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: '#e3f2fd' }}>
            <TableCell sx={{ fontWeight: 700 }}>문서명</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>크기</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>업로드일</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>액션</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {normalizedDocuments.map(doc => (
            <TableRow key={doc.name}>
              <TableCell>{doc.name}</TableCell>
              <TableCell>{doc.size ? (doc.size / 1024).toFixed(1) + " KB" : "-"}</TableCell>
              <TableCell>{doc.lastModified ? new Date(doc.lastModified).toLocaleDateString() : "-"}</TableCell>
              <TableCell>
                <Tooltip title="미리보기"><IconButton color="primary" onClick={() => onPreview(doc)}><VisibilityIcon /></IconButton></Tooltip>
                <Tooltip title="다운로드"><IconButton color="success" onClick={() => onDownload(doc)}><DownloadIcon /></IconButton></Tooltip>
                <Tooltip title="삭제"><IconButton color="error" onClick={() => onDelete(doc)}><DeleteIcon /></IconButton></Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DocumentTable;