# DocuFlow

## 소개
**DocuFlow**는 문서 관리 솔루션 기반의 애플리케이션으로, 사용자 인증, 회원가입, 메인 뷰(문서 편집 및 관리), 모달 컴포넌트 등 다양한 기능을 포함하고 있습니다. 이 프로젝트는 React를 기반으로 하며, 유저 친화적인 UI와 간단한 코드 구조를 목표로 설계되었습니다.

---

## 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone https://github.com/0625yt/DocuFlow.git
cd DocuFlow
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm start
```

---

## 주요 디렉토리 구조

- `src/component/auth`  
  사용자 인증 관련 컴포넌트들이 포함되어 있습니다.  
  - **LoginForm.jsx**: 로그인 폼 컴포넌트
  - **LoginButton.jsx**: 로그인 버튼 컴포넌트
  - **JoinButton.jsx**: 회원가입 버튼 컴포넌트 등

- `src/component/join`  
  회원가입 관련 컴포넌트들이 포함되어 있습니다.  
  - **JoinForm.jsx**: 회원가입 폼 컴포넌트
  - **JoinInput.jsx**: 회원가입 입력 필드 컴포넌트
  - **JoinPage.jsx**: 회원가입 페이지 컴포넌트 등

- `src/component/main`  
  메인 화면 관련 컴포넌트들이 포함되어 있습니다.  
  - **mainView.jsx**: 메인 화면의 메인 뷰를 담당하는 컴포넌트

- `src/component/modal`  
  모달 창 관련 컴포넌트들이 포함되어 있습니다.  
  - **DeleteModal.js**: 삭제 확인 모달 창 컴포넌트

---

## 주요 기능 및 설명

### 1. 사용자 인증
사용자 로그인 및 회원가입 컴포넌트를 포함합니다.  
`auth` 디렉토리 내 컴포넌트들이 이를 처리합니다.

### 2. 회원가입
회원가입 폼과 관련된 모든 로직과 UI를 제공합니다.  
`join` 디렉토리 내 컴포넌트들이 이를 처리합니다.

### 3. 메인 화면
애플리케이션의 메인 화면 UI를 제공합니다.  
메인화면에서 문서 편집 업로드 및 저장까지 모두 가능합니다.
`main` 디렉토리 내 컴포넌트가 메인 뷰를 담당합니다.

### 4. 모달 창
삭제 확인 모달과 같은 팝업 UI를 포함합니다.  
`modal` 디렉토리 내 컴포넌트가 이를 처리합니다.

---

## 기여 방법
1. 이 저장소를 포크합니다.
2. 새로운 브랜치를 생성합니다: `git checkout -b feature/새로운기능`
3. 변경 사항을 커밋합니다: `git commit -m '새로운 기능 추가'`
4. 푸시합니다: `git push origin feature/새로운기능`
5. 풀 리퀘스트를 생성합니다.

---

## 라이센스
이 프로젝트는 MIT 라이센스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

---

## 문의
추가적인 문의 사항이 있으시면 [이슈](https://github.com/0625yt/DocuFlow/issues)에 등록해 주세요.
