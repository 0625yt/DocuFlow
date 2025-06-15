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

  const handleSelect = (folderId, folderName) => {
    setSelectedFolderId(folderId);
    setSelectedFolderName(folderName);
  };

  const handleCreate = async (requestData) => {
    const newFolder = await createFolder(requestData);
    setFolders((prev) => [...prev, newFolder]);
  };

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