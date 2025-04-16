import React, { useState, useEffect } from "react";
import axios from "axios";
import "./main.css";

const FolderAndDocumentViewer = () => {
  const [folders, setFolders] = useState([]); // 폴더 목록 상태
  const [selectedFolder, setSelectedFolder] = useState(null); // 선택된 폴더 상태
  const [documentContent, setDocumentContent] = useState(""); // 선택된 문서의 내용
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 }); // 컨텍스트 메뉴 상태

  // 우클릭 시 사용자 정의 컨텍스트 메뉴 표시
  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({
      visible: true, // 메뉴 표시
      x: event.clientX, // 클릭 위치 X 좌표
      y: event.clientY, // 클릭 위치 Y 좌표
    });
  };

  // 폴더 삭제 핸들러
  const handleDeleteFolder = () => {
    if (!folders.length) { // 폴더가 없으면 알림
      alert("삭제할 폴더가 없습니다.");
      return;
    }
    const folderToDelete = selectedFolder || folders[folders.length - 1]; // 선택된 폴더 또는 마지막 폴더 삭제
    setFolders((prev) => prev.filter((folder) => folder !== folderToDelete)); // 폴더 목록에서 삭제
    setSelectedFolder(null); // 선택된 폴더 초기화
    setContextMenu({ ...contextMenu, visible: false }); // 컨텍스트 메뉴 닫기
  };

  // 컨텍스트 메뉴 숨기기
  const handleClick = () => {
    if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false }); // 메뉴 숨기기
  };

  // 새로운 폴더 생성
  const handleCreateFolder = async () => {
    const folderName = prompt("폴더 이름을 입력하세요:");
    const selectedParentFolderId = "";
    const folderDescription = "테스트 설명";
    const isRootFolder = true;
    const isSharedFolder = true;

    if (folderName) {
        const userInfo = sessionStorage.getItem('user');
        if (!userInfo) {
            alert('로그인된 사용자 정보가 없습니다.');
            return;
        }

        let parsedUserInfo;
        try {
            parsedUserInfo = JSON.parse(userInfo);
            console.log("사용자 ID:", parsedUserInfo.id);  // 사용자 ID 콘솔 출력
        } catch (error) {
            alert('사용자 정보가 잘못되었습니다.');
            return;
        }

        // `userId`를 Long 타입으로 변환
        const userId = parseInt(1, 10); // String -> Long 변환

        if (isNaN(userId)) {
            alert("유효한 사용자 ID가 아닙니다.");
            return;
        }

        const requestData = {
            folderName: folderName,
            userId: userId, // Long 타입 userId
            parentFolderId: selectedParentFolderId || null,
            description: folderDescription,
            isRoot: isRootFolder,
            isShared: isSharedFolder,
        };

        try {
            const response = await fetch('http://localhost:8080/folders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                setFolders((prevFolders) => [...prevFolders, folderName]);
            } else {
                const errorText = await response.text();
                alert(`폴더 생성에 실패했습니다: ${errorText}`);
            }
        } catch (error) {
            console.error("폴더 생성 오류:", error);
            alert("폴더 생성 중 오류가 발생했습니다.");
        }
    }
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

    const userId = parseInt(parsedUserInfo.id, 10);
    if (isNaN(userId)) {
      alert("유효한 사용자 ID가 아닙니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/folders/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFolders(data); // 폴더 목록 업데이트
      } else {
        console.error("폴더 목록 불러오기 실패");
      }
    } catch (error) {
      console.error("폴더 목록 불러오는 중 오류:", error);
    }
  };

  fetchFolders(); // 컴포넌트가 마운트될 때 폴더 불러오기
}, []);

  // 문서 업로드
  const handleUploadDocument = async () => {
    if (!selectedFolder) { // 폴더를 먼저 선택하지 않으면 알림
      alert("먼저 폴더를 선택하세요!");
      return;
    }
    const fileInput = document.createElement("input"); // 파일 입력 요소 생성
    fileInput.type = "file"; // 파일 타입 설정
    fileInput.accept = ".hwp"; // .hwp 파일만 선택 가능
    fileInput.onchange = async (e) => { // 파일 선택 시 처리
      const file = e.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file); // 파일 추가
          formData.append("folder", selectedFolder); // 선택된 폴더 추가
  
          await axios.post("http://localhost:8080/api/upload/document", formData, {
            headers: {
              "Content-Type": "multipart/form-data", // 멀티파트 데이터로 파일 전송
            },
          });
  
          alert("파일이 성공적으로 업로드되었습니다!");
        } catch (error) {
          console.error("파일 업로드 오류:", error);
          alert("파일 업로드에 실패했습니다.");
        }
      }
    };
    fileInput.click(); // 파일 선택 창 열기
    setContextMenu({ ...contextMenu, visible: false }); // 컨텍스트 메뉴 닫기
  };

  // 폴더 선택 및 해당 폴더의 문서 내용 불러오기
  const handleFolderSelect = async (folderName) => {
    setSelectedFolder(folderName); // 선택된 폴더 상태 설정
    try {
      const response = await axios.get(`http://localhost:8080/api/folder/${folderName}`); // 폴더 내용 가져오기
      setDocumentContent(response.data.content || "문서 내용이 없습니다."); // 문서 내용 설정
    } catch (error) {
      console.error("폴더 내용 불러오기 오류:", error);
      setDocumentContent("문서 내용을 불러오지 못했습니다.");
    }
  };

  return (
    <div className="container" onContextMenu={handleContextMenu} onClick={handleClick}>
      {/* 사용자 정의 컨텍스트 메뉴 */}
      {contextMenu.visible && (
        <ul
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <li onClick={handleCreateFolder}>폴더 생성</li> {/* 폴더 생성 클릭 */}
          <li onClick={handleDeleteFolder}>폴더 삭제</li> {/* 폴더 삭제 클릭 */}
          <li onClick={handleUploadDocument}>문서 업로드</li> {/* 문서 업로드 클릭 */}
        </ul>
      )}

      {/* 왼쪽 패널: 폴더 목록 */}
      <div className="left-pane">
        <h2>폴더 목록</h2>
        <ul>
          {folders.map((folder, index) => (
            <li
              key={index}
              onClick={() => handleFolderSelect(folder)} // 폴더 클릭 시 내용 불러오기
              className={folder === selectedFolder ? "selected" : ""} // 선택된 폴더 강조
            >
              {folder}
            </li>
          ))}
        </ul>
      </div>

      {/* 오른쪽 패널: 문서 뷰어 */}
      <div className="right-pane">
        <h2>문서 뷰어</h2>
        {selectedFolder ? (
          <div>
            <h3>선택된 폴더: {selectedFolder}</h3>
            <pre>{documentContent}</pre> {/* 문서 내용 표시 */}
          </div>
        ) : (
          <p>폴더를 선택하여 내용을 확인하세요.</p> /* 폴더 선택 안내 */
        )}
      </div>
    </div>
  );
};

export default FolderAndDocumentViewer;