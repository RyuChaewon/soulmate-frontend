// src/pages/RecordingPage.styles.js
import styled from 'styled-components';

export const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(852px - 90px); /* 전체 높이 - 헤더 높이 */
`;

export const UserVideoWrapper = styled.div`
  position: absolute;
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
  top: 260px;
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
  top: 600px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  cursor: pointer;
`;