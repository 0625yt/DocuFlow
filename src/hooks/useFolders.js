// src/hooks/useFolders.js
import { useEffect, useState } from "react";

export default function useFolders(userId) {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFolderName, setSelectedFolderName] = useState("");
  const [loading, setLoading] = useState(true);           // 로딩 상태 추가
  const [loadedOnce, setLoadedOnce] = useState(false);    // 첫 로딩 완료 플래그

  const refreshFolders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/folders/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const list = await res.json();
      setFolders(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setFolders([]);
    } finally {
      setLoading(false);
      setLoadedOnce(true);
    }
  };

  useEffect(() => { refreshFolders(); }, [userId]);

  // 폴더 로딩이 끝난 뒤에만 첫 폴더 자동 선택
  useEffect(() => {
    if (!loading && folders.length && selectedFolderId == null) {
      const f = folders[0];
      setSelectedFolderId(f.id);
      setSelectedFolderName(f.folderName || f.name || "");
    }
  }, [loading, folders, selectedFolderId]);

  const handleSelect = (id, name) => {
    setSelectedFolderId(id ?? null);
    setSelectedFolderName(name ?? "");
  };

  const handleCreate = async (payload) => {
    const res = await fetch(`http://localhost:8080/folders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    await refreshFolders();
  };

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:8080/folders/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error(await res.text());
    await refreshFolders();
  };

  return {
    folders,
    selectedFolderId,
    selectedFolderName,
    handleSelect,
    handleCreate,
    handleDelete,
    refreshFolders,
    loading,
    loadedOnce, // 첫 로딩 완료 여부
  };
}
