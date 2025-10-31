// src/pages/MainPage.styles.js
import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 캘린더 등 내부 요소를 중앙 정렬 */
`;

export const MonthControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  width: 100%;
  box-sizing: border-box;
`;

export const MonthText = styled.h2`
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

// Calendar 컴포넌트를 중앙 정렬하기 위한 래퍼
export const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const BottomContainer = styled.div`
  width: 100%;
  height: 300px;
  background-color: #EBF6D8;
  position: absolute;
  bottom: 0;
  left: 0;
`;


// --- 기록 없는 날짜 선택 시 (Main_b) ---
export const AddButtonWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AddButton = styled.img`
  width: 80px;
  height: 80px;
  cursor: pointer;
`;

// --- 기록 있는 날짜 선택 시 (Main_a) ---
export const RecordInfoContainer = styled.div`
  width: 100%;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SelectedDateText = styled.p`
  width: 345px;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 10px;
`;

export const InfoBox = styled.div`
  width: 345px;
  height: 198px;
  background-color: white;
  border-radius: 13px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

export const EmotionRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  margin-bottom: 20px;
`;

export const EmotionIcon = styled.img`
  width: 60px;
  height: 60px;
`;

export const DiaryButton = styled.img`
  cursor: pointer;
`;