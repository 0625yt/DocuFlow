// 폴더 관련 API 함수

export async function fetchFolders(userId) {
  // 폴더 목록을 불러옵니다.
  const response = await fetch("http://localhost:8080/folders/select", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error("폴더 목록 불러오기 실패");
  return response.json();
}

export async function createFolder(requestData) {
  // 폴더를 생성합니다.
  const response = await fetch("http://localhost:8080/folders/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function deleteFolder(folderId) {
  // 폴더를 삭제합니다.
  const response = await fetch("http://localhost:8080/folders/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: folderId }),
  });
  if (!response.ok) throw new Error("폴더 삭제 실패");
  return response.json();
} 