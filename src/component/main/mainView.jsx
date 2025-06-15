import React from "react";
import "../../styles/global.css";
import useFolders from "../../hooks/useFolders";
import useDocuments from "../../hooks/useDocuments";
import { isValidFolderName, escapeHtml } from "../../utils/validator";
// DeleteModal 컴포넌트 import 예시 (사용 시 활성화)
// Modal 컴포넌트 import 예시 (사용 시 활성화)

const FolderAndDocumentViewer = () => {
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
    documentContent,
    loadDocument,
    upload,
    setDocumentContent,
  } = useDocuments();
  const [contextMenu, setContextMenu] = React.useState({ visible: false, x: 0, y: 0 });

  // 우클릭 시 컨텍스트 메뉴 표시
  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  // 컨텍스트 메뉴 외부 클릭 시 메뉴 닫기
  const handleClick = () => {
    if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
  };

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
    setContextMenu({ ...contextMenu, visible: false });
    try {
      await handleDelete(selectedFolderId);
      alert("폴더가 삭제되었습니다.");
    } catch (e) {
      console.error("폴더 삭제 실패:", e);
      alert("폴더 삭제 실패: " + (e.message || e));
    }
  };

  // 문서 업로드 핸들러
  const handleUploadDocument = async () => {
    if (!selectedFolderId) {
      alert("먼저 폴더를 선택하세요!");
      return;
    }
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".hwp";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        alert("업로드할 파일을 선택해야 합니다.");
        return;
      }
      const allowedExt = ["hwp"];
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedExt.includes(ext)) {
        alert("허용되지 않은 파일 형식입니다. (hwp만 가능)");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("10MB 이하 파일만 업로드 가능합니다.");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folderId", selectedFolderId);
        formData.append("fileName", file.name);
        formData.append("fileSize", file.size);
        formData.append("fileType", file.type);
        formData.append("filePath", file.webkitRelativePath || file.name);
        formData.append("userId", userId);
        await upload(formData);
        alert("파일이 성공적으로 업로드되었습니다!");
      } catch (error) {
        console.error("파일 업로드 실패:", error);
        alert("파일 업로드에 실패했습니다. 네트워크 상태를 확인하거나, 파일 형식을 확인하세요.");
      }
    };
    fileInput.click();
    setContextMenu({ ...contextMenu, visible: false });
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

  return (
    <div className="container" onContextMenu={handleContextMenu} onClick={handleClick}>
      {contextMenu.visible && (
        <ul className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <li onClick={handleCreateFolder}>폴더 생성</li>
          <li onClick={handleDeleteFolder}>폴더 삭제</li>
          <li onClick={handleUploadDocument}>문서 업로드</li>
        </ul>
      )}

      <div className="left-pane">
        <h2>폴더 목록</h2>
        <ul>
          {folders.map((folder) => (
            <li
              key={folder.id}
              onClick={() => handleFolderSelect(folder.id, folder.folderName)}
              className={folder.id === selectedFolderId ? "selected" : ""}
            >
              {folder.folderName}
            </li>
          ))}
        </ul>
      </div>

      <div className="right-pane">
        <h2>문서 뷰어</h2>
        {selectedFolderId ? (
          <div>
            <h3>선택된 폴더: {selectedFolderName}</h3>
            <pre>{documentContent}</pre>
          </div>
        ) : (
          <p>폴더를 선택하여 내용을 확인하세요.</p>
        )}
      </div>
    </div>
  );
};

export default FolderAndDocumentViewer;
