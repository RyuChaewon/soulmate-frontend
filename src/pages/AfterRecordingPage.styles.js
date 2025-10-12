// src/pages/AfterRecordingPage.styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  flex-grow: 1; /* 남은 공간을 모두 차지 */
`;

export const SubText = styled.p`
  position: absolute;
  top: 210px; /* 320px - 90px (헤더 높이) */
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  color: #333;
`;

export const EmotionIcon = styled.img`
  position: absolute;
  top: 260px; /* 350px - 90px */
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 120px;
`;

export const MainText = styled.h2`
  position: absolute;
  top: 410px; /* 500px - 90px */
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: 540;
  color: #333;
  white-space: nowrap;
`;

export const DiaryButtonLink = styled(Link)`
  position: absolute;
  top: 630px; /* 720px - 90px */
  left: 50%;
  transform: translateX(-50%);
  width: 275px;
  height: 42px;
`;