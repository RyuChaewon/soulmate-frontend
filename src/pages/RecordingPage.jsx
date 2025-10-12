// src/pages/RecordingPage.jsx
import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as S from './RecordingPage.styles.js';

import Layout from '../components/Layout/Layout';
import avatarIcon from '../assets/icons/avatar.svg';
import endRecordingButtonImg from '../assets/buttons/endrecordingbutton.svg';

function RecordingPage() {
  const { date } = useParams();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // 카메라 켜기
  useEffect(() => {
    const getCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        streamRef.current = mediaStream;
      } catch (err) {
        console.error("카메라 접근 에러:", err);
        alert("카메라에 접근할 수 없습니다.");
      }
    };

    getCamera();

    // 페이지를 떠날 때 카메라 끄기
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 녹화 종료 버튼 클릭 핸들러
  const handleEndRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    navigate(`/after-record/${date}`);
  };

  return (
    <Layout>
        <S.ContentContainer>

      <S.UserVideoWrapper>
        <S.LiveVideo ref={videoRef} autoPlay playsInline muted />
      </S.UserVideoWrapper>

      <S.AvatarVideoWrapper>
        <S.AvatarImage src={avatarIcon} alt="아바타" />
      </S.AvatarVideoWrapper>

      <S.EndRecordingButtonWrapper onClick={handleEndRecording}>
        <img src={endRecordingButtonImg} alt="기록 끝" />
      </S.EndRecordingButtonWrapper>
      </S.ContentContainer>
    </Layout>
  );
}

export default RecordingPage;