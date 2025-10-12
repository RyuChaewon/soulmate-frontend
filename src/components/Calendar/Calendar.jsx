// src/components/Calendar/Calendar.jsx
import { useState, useEffect } from 'react';
import * as S from './Calendar.styles';

// 감정 아이콘 경로 임포트
import angryIcon from '../../assets/emotions/angry.png';
import disgustedIcon from '../../assets/emotions/disgusted.png';
import fearIcon from '../../assets/emotions/fear.png';
import happyIcon from '../../assets/emotions/happy.png';
import hateIcon from '../../assets/emotions/hate.png';
import sadIcon from '../../assets/emotions/sad.png';
import surprisedIcon from '../../assets/emotions/surprised.png';

// 감정 아이콘 매핑 객체
const emotionIcons = {
  angry: angryIcon,
  disgusted: disgustedIcon,
  fear: fearIcon,
  happy: happyIcon,
  hate: hateIcon,
  sad: sadIcon,
  surprised: surprisedIcon,
};

function Calendar({ date, onDayClick }) {
  const [calendarData, setCalendarData] = useState({ dailyRecords: {} });
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const dummyData = {
      firstDayOfWeek: new Date(year, month - 1, 1).getDay(),
      daysInMonth: new Date(year, month, 0).getDate(),
      dailyRecords: {
        1: 'happy', 3: 'sad', 5: 'angry', 8: 'surprised', 12: 'fear',
        15: 'happy', 18: 'disgusted', 22: 'sad', 25: 'happy', 29: 'hate',
      }
    };
    setCalendarData(dummyData);
    setSelectedDay(null);
    if(onDayClick) onDayClick(null, null);

  }, [date, onDayClick]);

  const handleDayClick = (e, day) => {
    e.preventDefault();
    const newSelectedDay = day === selectedDay ? null : day;
    setSelectedDay(newSelectedDay);
    
    if (newSelectedDay) {
      const record = calendarData.dailyRecords[newSelectedDay] || null;
      if(onDayClick) onDayClick(newSelectedDay, record);
    } else {
      if(onDayClick) onDayClick(null, null);
    }
  };

  const generateCalendarDays = () => {
    if (!calendarData.firstDayOfWeek && calendarData.firstDayOfWeek !== 0) return [];
    const days = [];
    for (let i = 0; i < calendarData.firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= calendarData.daysInMonth; i++) {
      days.push(i);
    }
    while (days.length % 7 !== 0) {
      days.push(null);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const isSixWeeks = calendarDays.length > 35;
  const isFourWeeks = calendarDays.length <= 28;

  return (
    // S.CalendarContainer에 isSixWeeks prop을 전달합니다.
    <S.CalendarContainer $isSixWeeks={isSixWeeks} $isFourWeeks={isFourWeeks}>
      <S.DaysGrid>
        {calendarDays.map((day, index) => {
          const hasEmotion = day && calendarData.dailyRecords[day];
          const isSelected = day === selectedDay;
          const emotionType = hasEmotion ? calendarData.dailyRecords[day] : null;

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
    </S.CalendarContainer>
  );
}

export default Calendar;