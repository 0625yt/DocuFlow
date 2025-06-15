// 폴더 관련 API 함수

export async function fetchFolders(userId) {
  const response = await fetch("http://localhost:8080/folders/select", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) throw new Error("폴더 목록 불러오기 실패");
  return response.json();
}

export async function createFolder(requestData) {
  const response = await fetch("http://localhost:8080/folders/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function deleteFolder(folderId) {
  const response = await fetch("http://localhost:8080/folders/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: folderId }),
  });
  if (!response.ok) throw new Error("폴더 삭제 실패");
  return response.json();
} 