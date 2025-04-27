import React, { useState, useEffect } from "react";
import axios from "axios";
import "./main.css";

const FolderAndDocumentViewer = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFolderName, setSelectedFolderName] = useState(null);
  const [documentContent, setDocumentContent] = useState("");
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleClick = () => {
    if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
  };

  const handleCreateFolder = async () => {
    const folderName = prompt("폴더 이름을 입력하세요:");
    const folderDescription = "테스트 설명";
    const isRootFolder = true;
    const isSharedFolder = true;

    if (folderName) {
      const userInfo = sessionStorage.getItem("user");
      if (!userInfo) {
        alert("로그인된 사용자 정보가 없습니다.");
        return;
      }

      let parsedUserInfo;
      try {
        parsedUserInfo = JSON.parse(userInfo);
      } catch (error) {
        alert("사용자 정보가 잘못되었습니다.");
        return;
      }

      const userId = parsedUserInfo.id;
      if (!userId || typeof userId !== "string") {
        alert("유효한 사용자 ID가 아닙니다.");
        return;
      }

      const requestData = {
        folderName,
        userId,
        parentFolderId: null,
        description: folderDescription,
        isRoot: isRootFolder,
        isShared: isSharedFolder,
      };

      try {
        const response = await fetch("http://localhost:8080/folders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const data = await response.json();
          setFolders((prev) => [...prev, data]);
          alert("폴더가 생성되었습니다.");
        } else {
          const errorText = await response.text();
          alert(`폴더 생성 실패: ${errorText}`);
        }
      } catch (error) {
        console.error("폴더 생성 오류:", error);
        alert("폴더 생성 중 오류가 발생했습니다.");
      }
    }
  };

  const handleDeleteFolder = async() => {
    if (!folders.length) {
      alert("삭제할 폴더가 없습니다.");
      return;
    }

    const filtered = folders.filter((folder) => folder.id !== selectedFolderId);
    setFolders(filtered);
    setSelectedFolderId(null);
    setSelectedFolderName(null);
    setContextMenu({ ...contextMenu, visible: false });

    try {``
      const response = await fetch("http://localhost:8080/folders/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(folder.id),
      });
    } catch (error) {
      console.error("폴더 생성 오류:", error);
      alert("폴더 생성 중 오류가 발생했습니다.");
    }
  };

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
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folderId", selectedFolderId);

          await axios.post("http://localhost:8080/api/upload/document", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          alert("파일이 성공적으로 업로드되었습니다!");
        } catch (error) {
          console.error("파일 업로드 오류:", error);
          alert("파일 업로드에 실패했습니다.");
        }
      }
    };

    fileInput.click();
    setContextMenu({ ...contextMenu, visible: false });
  };

  useEffect(() => {
    const fetchFolders = async () => {
      const userInfo = sessionStorage.getItem("user");
      if (!userInfo) {
        alert("로그인된 사용자 정보가 없습니다.");
        return;
      }

      let parsedUserInfo;
      try {
        parsedUserInfo = JSON.parse(userInfo);
      } catch (e) {
        console.error("사용자 정보 파싱 오류:", e);
        return;
      }

      const userId = parsedUserInfo.id;
      if (!userId || typeof userId !== "string") {
        alert("유효한 사용자 ID가 아닙니다.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/folders/select", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setFolders(data);
        } else {
          console.error("폴더 목록 불러오기 실패");
        }
      } catch (error) {
        console.error("폴더 목록 불러오는 중 오류:", error);
      }
    };

    fetchFolders();
  }, []);

  const handleFolderSelect = async (folderId, folderName) => {
    setSelectedFolderId(folderId);
    setSelectedFolderName(folderName);

    try {
      const response = await axios.get(`http://localhost:8080/api/folder/${folderId}`);
      setDocumentContent(response.data.content || "문서 내용이 없습니다.");
    } catch (error) {
      console.error("문서 내용 불러오기 오류:", error);
      setDocumentContent("문서 내용을 불러오지 못했습니다.");
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
