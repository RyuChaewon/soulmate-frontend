// src/components/Calendar/Calendar.styles.js
import styled, { css } from 'styled-components';
import CalendarBackground from '../../assets/Calendar.svg';
import Calendar2Background from '../../assets/Calendar_2.svg';
import Calendar1Background from '../../assets/Calendar_1.svg'; // 1. 4주용 배경 이미지 불러오기

export const CalendarContainer = styled.div`
  width: 345px;
  height: 294px; /* 5주 기준 높이 */
  background-image: url(${CalendarBackground});
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  padding: 60px 25px 25px 25px; /* 5주 기준 패딩 */
  box-sizing: border-box;

  /* --- ↓↓↓ 4주용 스타일 추가 ↓↓↓ --- */
  ${props => props.$isFourWeeks && css`
    height: 248px; /* 4주용 높이 */
    background-image: url(${Calendar1Background});
    padding: 60px 25px 25px 25px; /* 4주용 상단 여백 조절 */
  `}

  /* 6주용 스타일 */
  ${props => props.$isSixWeeks && css`
    height: 330px;
    background-image: url(${Calendar2Background});
    padding: 60px 25px 25px 25px; /* 6주용 상단 여백 조절 */
  `}
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 19px;
  column-gap: 17px; /* --- 가로 간격만 17px로 수정 --- */
`;

export const DayCircle = styled.div`
  width: 27px;
  height: 27px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  box-sizing: border-box;
  color: #888;
  border: 1.5px solid #d9d9d9;

  /* 날짜가 없는 칸 */
  ${props => props.$isEmpty && css`
    border-color: transparent;
    cursor: default;
  `}

  /* 기록이 있는 날짜(선택 전) */
  ${props => props.$hasEmotion && !props.$isSelected && css`
    border-color: transparent;
  `}

  /* 선택된 비어있는 원 */
  ${props => props.$isSelected && !props.$hasEmotion && !props.$isEmpty && css`
    border-color: #47413e;
    color: #47413e;
  `}

  /* 선택된 기록 있는 원 */
  ${props => props.$isSelected && props.$hasEmotion && css`
    border-color: transparent;
    box-shadow: 0 0 0 1.5px #50AB75;
  `}
`;

export const EmotionIcon = styled.img`
  width: 27px;
  height: 27px;
  object-fit: contain;
`;