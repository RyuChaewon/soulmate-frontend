// src/pages/BeforeRecordingPage.styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(852px - 90px); /* 전체 높이 - 헤더 높이 */
`;

export const Avatar = styled.img`
  position: absolute;
  top: 217px;
  left: 50%;
  transform: translateX(-50%); /* 가로 중앙 정렬 */
  width: 140px;
  height: 146px;
`;

// --- ↓↓↓ 이 부분을 수정합니다 ↓↓↓ ---
export const PromptText = styled.p`
  position: absolute;
  top: 397px; /* Y좌표 487px로 설정 */
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: 540; /* Regular 굵기 */
  color: #333;
  white-space: nowrap;
`;
// --- ↑↑↑ 여기까지 ---

export const StartButtonLink = styled(Link)`
  position: absolute;
  top: 540px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
`;