// src/pages/MainPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as S from './MainPage.styles';
import Layout from '../components/Layout/Layout';
import Calendar from '../components/Calendar';

// 필요한 이미지 import
import leftButtonImg from '../assets/buttons/leftbutton.svg';
import rightButtonImg from '../assets/buttons/rightbutton.svg';
import addButtonImg from '../assets/buttons/addbutton.svg';
import diaryButtonImg from '../assets/buttons/diarybutton.svg';

// 임시 감정 아이콘 import
import angryIcon from '../assets/emotions/angry.png';
import surprisedIcon from '../assets/emotions/surprised.png';
import happyIcon from '../assets/emotions/happy.png';

function MainPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6)); 
  const [selectedDayData, setSelectedDayData] = useState(null);

  useEffect(() => {
    // const token = localStorage.getItem('token');
    // if (!token) navigate('/login');
  }, [navigate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const handleDayClick = useCallback((day, record) => {
    setSelectedDayData(day ? { day, record } : null);
  }, []); 

  const formattedMonth = `${currentDate.getFullYear()}년 ${String(currentDate.getMonth() + 1).padStart(2, '0')}월`;
  
  const formattedFullDate = selectedDayData?.day 
    ? `${currentDate.getFullYear()}년 ${String(currentDate.getMonth() + 1).padStart(2, '0')}월 ${String(selectedDayData.day).padStart(2, '0')}일`
    : '';

  // --- ↓↓↓ URL에 사용할 날짜 형식을 여기서 만듭니다 ↓↓↓ ---
  const urlFormattedDate = selectedDayData?.day
    ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDayData.day).padStart(2, '0')}`
    : '';

  return (
    <Layout>
      <S.PageContainer>
        <S.MonthControl>
          <S.ArrowButton onClick={handlePrevMonth}>
            <img src={leftButtonImg} alt="이전 달" />
          </S.ArrowButton>
          <S.MonthText>{formattedMonth}</S.MonthText>
          <S.ArrowButton onClick={handleNextMonth}>
            <img src={rightButtonImg} alt="다음 달" />
          </S.ArrowButton>
        </S.MonthControl>

        <S.CalendarWrapper>
            <Calendar
              date={currentDate}
              onDayClick={handleDayClick}
            />
        </S.CalendarWrapper>

        <S.BottomContainer>
          {selectedDayData && selectedDayData.record ? (
            <S.RecordInfoContainer>
              <S.SelectedDateText>{formattedFullDate}</S.SelectedDateText>
              <S.InfoBox>
                <S.EmotionRow>
                  <S.EmotionIcon src={angryIcon} alt="Angry" />
                  <S.EmotionIcon src={surprisedIcon} alt="Surprised" />
                  <S.EmotionIcon src={happyIcon} alt="Happy" />
                </S.EmotionRow>
                {/* --- ↓↓↓ '일기 보기' 버튼 링크에 날짜 형식을 적용합니다 ↓↓↓ --- */}
                <Link to={`/day/${urlFormattedDate}`}>
                  <S.DiaryButton src={diaryButtonImg} alt="일기 보기" />
                </Link>
              </S.InfoBox>
            </S.RecordInfoContainer>
          ) : (
            <S.AddButtonWrapper>
              <Link to={selectedDayData ? `/before-record/${urlFormattedDate}` : '#'}>
                <S.AddButton src={addButtonImg} alt="기록 추가" />
              </Link>
            </S.AddButtonWrapper>
          )}
        </S.BottomContainer>
      </S.PageContainer>
    </Layout>
  );
}

export default MainPage;