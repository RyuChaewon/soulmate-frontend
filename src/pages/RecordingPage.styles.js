// src/pages/RecordingPage.styles.js
import styled from 'styled-components';

export const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(852px - 90px); /* 전체 높이 - 헤더 높이 */
`;

export const UserVideoWrapper = styled.div`
  position: absolute;
  top: 0; /* 헤더 바로 아래 */
  left: 0;
  width: 393px;
  height: 260px;
  background-color: #000; /* 카메라 로딩 전 배경색 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

export const LiveVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarVideoWrapper = styled.div`
  position: absolute;
  top: 260px; /* 350px - 90px */
  left: 0;
  width: 393px;
  height: 260px;
  background-color: #DDF1C0;
  position: relative; /* 내부 아바타 위치 기준점 */
  overflow: hidden; /* 아바타가 밖으로 나가지 않도록 */
`;

export const AvatarImage = styled.img`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 190px;
  height: 200px;
`;

export const EndRecordingButtonWrapper = styled.div`
  position: absolute;
  top: 600px; /* 690px - 90px */
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  cursor: pointer;
`;

// --- 👇 [신규] 아바타 말풍선 스타일 ---

export const AvatarSpeechBubble = styled.div`
  position: absolute;
  top: 15px; // AvatarVideoWrapper 상단에서 15px 아래
  left: 50%;
  transform: translateX(-50%);
  width: 90%; // 래퍼 너비의 90%
  max-width: 350px;
  
  background: rgba(255, 255, 255, 0.9); // 반투명 흰색 배경
  color: #333; // 어두운 텍스트 색상
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
  
  // 텍스트가 길어질 경우 스크롤
  max-height: 100px; // 약 4~5줄 높이
  overflow-y: auto;
  
  // 말풍선 꼬리
  &::after {
    content: '';
    position: absolute;
    bottom: -10px; // 버블 아래쪽
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid rgba(255, 255, 255, 0.9); // 버블 배경색과 동일
  }
`;