// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';

// 라우트 페이지
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import MainPage from './pages/MainPage';
import DayPage from './pages/DayPage';
import BeforeRecordingPage from './pages/BeforeRecordingPage';
import RecordingPage from './pages/RecordingPage';
import AfterRecordingPage from './pages/AfterRecordingPage';

// 앱 화면 경로 설정
const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <MainPage /> },
  { path: "/join", element: <JoinPage /> },
  
  { path: "/day/:date", element: <DayPage /> },
  { path: "/before-record/:date", element: <BeforeRecordingPage /> },
  { path: "/recording/:date", element: <RecordingPage /> },
  { path: "/after-record/:date", element: <AfterRecordingPage /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
);