import { useState, useEffect } from "react";
import { fetchFolders, createFolder, deleteFolder } from "../api/folder";

export default function useFolders(userId) {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFolderName, setSelectedFolderName] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetchFolders(userId)
      .then(setFolders)
      .catch(console.error);
  }, [userId]);

  // 폴더 선택 핸들러
  const handleSelect = (folderId, folderName) => {
    setSelectedFolderId(folderId);
    setSelectedFolderName(folderName);
  };

  // 폴더 생성 핸들러
  const handleCreate = async (requestData) => {
    const newFolder = await createFolder(requestData);
    setFolders((prev) => [...prev, newFolder]);
  };

  // 폴더 삭제 핸들러
  const handleDelete = async (folderId) => {
    await deleteFolder(folderId);
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    setSelectedFolderId(null);
    setSelectedFolderName(null);
  };

  return {
    folders,
    selectedFolderId,
    selectedFolderName,
    handleSelect,
    handleCreate,
    handleDelete,
  };
} 