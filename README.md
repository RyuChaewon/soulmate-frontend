# Soulmate Frontend

감정 기록과 AI 피드백을 중심으로 한 Soulmate 서비스의 프론트엔드입니다. 사용자는 날짜별로 일기를 기록하고, 캘린더에서 대표 감정을 확인하며, 녹화 기반 상호작용을 통해 일기와 조언을 받을 수 있습니다.

## 주요 기능

- 로그인과 회원가입 화면
- 월별 캘린더에서 기록 여부와 대표 감정 확인
- 날짜별 일기 상세 보기
- 카메라/마이크 기반 녹화 흐름
- Socket.IO를 통한 영상/음성 스트리밍과 AI 응답 수신
- 감정 아이콘과 기록 상태를 활용한 시각적 피드백

## 기술 스택

- React 19
- Vite 7
- React Router DOM
- Styled Components
- Socket.IO Client
- Apollo Client / GraphQL
- ESLint

## 시작하기

```bash
npm install
npm run dev
```

프로덕션 빌드와 로컬 미리보기는 아래 명령어를 사용합니다.

```bash
npm run build
npm run preview
```

## API 연결

현재 프론트엔드는 `https://soulmate.kro.kr` 서버를 기준으로 API와 Socket.IO 연결을 수행합니다.

- 인증이 필요한 요청은 `localStorage`의 `token` 값을 `Authorization` 헤더에 포함합니다.
- 사용자 식별에는 `localStorage`의 `uuid` 값이 사용됩니다.
- 녹화 화면은 `/video` 네임스페이스의 Socket.IO 연결을 사용합니다.

## 프로젝트 구조

```text
src/
  api.js         공통 API 요청 헬퍼
  assets/        버튼, 감정, 아이콘 이미지
  components/    캘린더, 헤더, 레이아웃 컴포넌트
  pages/         로그인, 메인, 기록, 일기 화면
  index.css      전역 스타일
```
