// src/components/Calendar/Calendar.jsx
import { useState, useEffect, useCallback } from 'react';
import * as S from './Calendar.styles';

import happyIcon from '../../assets/emotions/happy.png';
import angryIcon from '../../assets/emotions/angry.png';
import anxietyIcon from '../../assets/emotions/anxiety.png';
import neutralIcon from '../../assets/emotions/neutral.png';
import panicIcon from '../../assets/emotions/panic.png';
import sadIcon from '../../assets/emotions/sad.png';
import woundIcon from '../../assets/emotions/wound.png';
// --- ↑↑↑ 여기까지 ---

// --- ↓↓↓ [수정] 새로운 감정 아이콘 매핑 객체 ↓↓↓ ---
const emotionIcons = {
  happy: happyIcon,
  angry: angryIcon,
  anxiety: anxietyIcon,
  neutral: neutralIcon,
  panic: panicIcon,
  sad: sadIcon,
  wound: woundIcon,
};
// --- ↑↑↑ 여기까지 ---

function Calendar({ date, onDayClick, records, isLoading }) {
  const [selectedDay, setSelectedDay] = useState(null);

  // 월이 바뀔 때 선택된 날짜를 초기화
  useEffect(() => {
    setSelectedDay(null);
  }, [date]);
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) { days.push(null); }
    for (let i = 1; i <= daysInMonth; i++) { days.push(i); }
    while (days.length % 7 !== 0) { days.push(null); }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const isSixWeeks = calendarDays.length > 35;
  const isFourWeeks = calendarDays.length <= 28;

  const handleDayClick = useCallback((e, day) => {
    e.preventDefault();
    if (day) {
      const newSelectedDay = day === selectedDay ? null : day;
      setSelectedDay(newSelectedDay);
      if (newSelectedDay) {
        const record = records[newSelectedDay] || null;
        if(onDayClick) onDayClick(newSelectedDay, record);
      } else {
        if(onDayClick) onDayClick(null, null);
      }
    }
  }, [selectedDay, records, onDayClick]);

  return (
    <S.CalendarContainer $isSixWeeks={isSixWeeks} $isFourWeeks={isFourWeeks}>
      {isLoading ? (
        <div style={{textAlign: 'center', width: '100%'}}>달력 로딩 중...</div>
      ) : (
        <S.DaysGrid>
          {calendarDays.map((day, index) => {
            const hasEmotion = day && records && records[day];
            const isSelected = day === selectedDay;
            const emotionType = hasEmotion ? records[day] : null;

            return (
              <S.DayCircle
                key={index}
                $isEmpty={!day}
                $hasEmotion={hasEmotion}
                $isSelected={isSelected}
                onClick={(e) => handleDayClick(e, day)}
              >
                {hasEmotion ? (
                  <S.EmotionIcon src={emotionIcons[emotionType]} alt={emotionType || "감정 아이콘"} />
                ) : (
                  <span>{day}</span>
                )}
              </S.DayCircle>
            );
          })}
        </S.DaysGrid>
      )}
    </S.CalendarContainer>
  );
}

export default Calendar;