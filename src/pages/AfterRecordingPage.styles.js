// src/pages/AfterRecordingPage.styles.js
import styled from 'styled-components';

// --- 기본 레이아웃 ---

export const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 90px); /* 전체 화면 높이 - 헤더 높이 */
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f4f4f4; /* 페이지 배경색 */
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 400px; /* 콘텐츠 최대 너비 고정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px; /* 요소 사이의 간격 */
`;

// --- 로딩 및 에러 상태 ---

export const LoadingText = styled.h2`
  font-size: 1.2rem;
  color: #333;
  margin-top: 40px;
`;

export const ErrorMessage = styled.p`
  font-size: 1rem;
  color: #d93025; /* 에러 텍스트 (빨간색) */
  text-align: center;
  line-height: 1.5;
  background-color: #fdd;
  border: 1px solid #d93025;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
`;

// --- 일기 카드 (성공 시) ---

export const DiaryCard = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EmotionIcon = styled.img`
  width: 70px;
  height: 70px;
  margin-bottom: 12px;
`;

export const DiaryHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 5px 0;
  text-align: center;
`;

export const DiaryDate = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin: 0 0 20px 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  text-align: center;
  width: 100%;
`;

export const EmotionList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const EmotionItem = styled.li`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;

  span {
    /* 감정 원인 (emotion.cause) */
    font-size: 0.85rem !important; /* 인라인 스타일보다 우선 적용 */
    color: #777 !important;
  }
`;

export const EmotionBadge = styled.span`
  background-color: #eef;
  color: #557;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-left: 8px;
`;

export const DiaryContent = styled.p`
  font-size: 1rem;
  color: #333;
  line-height: 1.7;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin: 20px 0;
  white-space: pre-wrap; /* \n 줄바꿈 적용 */
`;

export const AdviceContent = styled.p`
  font-size: 0.95rem;
  color: #446;
  line-height: 1.6;
  background-color: #f9f9ff;
  border-left: 4px solid #50AB75;
  padding: 12px 16px;
  margin: 0;
  font-style: italic;
`;


// --- 버튼 ---

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const DiaryButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 100%;
  max-width: 300px; /* 버튼 최대 너비 */
  
  img {
    width: 100%;
    display: block;
  }
  
  &:hover {
    opacity: 0.9;
  }
`;

// [수정] '일기 다시 쓰기' 버튼 (이미지 버튼용 스타일)
export const RetryRecordingButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 100%;
  max-width: 300px; /* 버튼 최대 너비 */

  img {
    width: 100%;
    display: block;
  }
  
  &:hover {
    opacity: 0.9;
  }
`;

export const EmotionListIcon = styled.img`
  width: 20px;
  height: 20px;
  vertical-align: middle; /* 뱃지와 높이를 맞춥니다. */
  margin: 10px 10px 10px 10px;
`;