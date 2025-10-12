// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';

// 모든 페이지 컴포넌트들을 불러옵니다.
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import MainPage from './pages/MainPage';
import DayPage from './pages/DayPage'; // DailyPage -> DayPage로 수정
import BeforeRecordingPage from './pages/BeforeRecordingPage';
import RecordingPage from './pages/RecordingPage';
import AfterRecordingPage from './pages/AfterRecordingPage';
// EditDiaryPage와 SearchPage는 아직 만들지 않았으므로 주석 처리
// import EditDiaryPage from './pages/EditDiaryPage';
// import SearchPage from './pages/SearchPage';

// 라우터 설정 (페이지 경로 연결)
const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <MainPage /> },
  { path: "/join", element: <JoinPage /> },
  
  // --- ↓↓↓ 누락된 경로들을 모두 추가합니다 ↓↓↓ ---
  { path: "/day/:date", element: <DayPage /> }, // day로 수정
  { path: "/before-record/:date", element: <BeforeRecordingPage /> },
  { path: "/recording/:date", element: <RecordingPage /> },
  { path: "/after-record/:date", element: <AfterRecordingPage /> },
  // { path: "/search", element: <SearchPage /> },
  // { path: "/edit-diary", element: <EditDiaryPage /> },
]);

// 최종 렌더링
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);