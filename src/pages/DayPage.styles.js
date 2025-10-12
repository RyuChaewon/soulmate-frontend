// src/pages/DayPage.styles.js
import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
`;

export const DateControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 40px;
  box-sizing: border-box;
`;

export const DateText = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

export const ArrowButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
`;

export const MainEmotionIcon = styled.img`
  width: 55px;
  height: 55px;
  margin-top: 10px;
`;

export const SectionContainer = styled.div`
  width: 345px;
  margin-top: 44px;
`;

// --- ↓↓↓ 이 부분을 텍스트 스타일에서 이미지 스타일로 변경합니다 ↓↓↓ ---
export const SectionTitleIcon = styled.img`
  height: 24px;
  width: auto;
  display: block; /* 이미지 아래 불필요한 여백 제거 */
  margin-bottom: 15px; /* 아이콘과 박스 사이 간격 */
`;
// --- ↑↑↑ 여기까지 ---

export const ContentBox = styled.div`
  background-color: #F6F6F8;
  border-radius: 13px;
  width: 100%;
  min-height: 120px;
  padding: 20px;
  box-sizing: border-box;
  font-size: 14px; /* 폰트 크기를 14px로 줄입니다. */
  color: #555;
`;