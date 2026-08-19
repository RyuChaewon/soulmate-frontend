// src/pages/MainPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as S from './MainPage.styles';
import Layout from '../components/Layout/Layout';
import Calendar from '../components/Calendar';
import { authFetch } from '../api';

// 화면에 사용하는 버튼 이미지
import leftButtonImg from '../assets/buttons/leftbutton.svg';
import rightButtonImg from '../assets/buttons/rightbutton.svg';
import addButtonImg from '../assets/buttons/addbutton.svg';
import diaryButtonImg from '../assets/buttons/diarybutton.svg';

// 감정 아이콘
import happyIcon from '../assets/emotions/happy.png';
import angryIcon from '../assets/emotions/angry.png';
import anxietyIcon from '../assets/emotions/anxiety.png';
import neutralIcon from '../assets/emotions/neutral.png';
import panicIcon from '../assets/emotions/panic.png';
import sadIcon from '../assets/emotions/sad.png';
import woundIcon from '../assets/emotions/wound.png';

const emotionIcons = {
  happy: happyIcon,
  angry: angryIcon,
  anxiety: anxietyIcon,
  neutral: neutralIcon,
  panic: panicIcon,
  sad: sadIcon,
  wound: woundIcon,
};

const emotionNumberToName = {
  1: 'happy',
  2: 'angry',
  3: 'anxiety',
  4: 'neutral',
  5: 'panic',
  6: 'sad',
  7: 'wound',
};

function MainPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [monthlyRecords, setMonthlyRecords] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [topEmotions, setTopEmotions] = useState([]);

  // 월이 바뀔 때마다 해당 월의 일기 데이터를 불러옵니다.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMonthlyData = async () => {
      setIsLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const data = await authFetch(`/diaries/month?year=${year}&month=${month}`);
        
        // 캘린더에서 표시할 날짜별 대표 감정 정보를 구성합니다.
        const records = data.reduce((acc, diary) => {
          const day = new Date(diary.date).getDate();
          if (diary.emotionData && diary.emotionData.length > 0) {
            const mainEmotionId = diary.emotionData[0].emotion;
            acc[day] = emotionNumberToName[mainEmotionId];
          }
          return acc;
        }, {});

    setMonthlyRecords(records);
  } catch (error) {
    console.error("월별 데이터 로딩 실패:", error);
  } finally {
    setIsLoading(false);
  }
};

    fetchMonthlyData();
  }, [navigate, currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  // 날짜를 선택하면 해당 일자의 상세 감정 데이터를 불러옵니다.
  const handleDayClick = useCallback(async (day, record) => {
    if (selectedDayData && selectedDayData.day === day) {
      setSelectedDayData(null);
      setTopEmotions([]);
      return;
    }

    setSelectedDayData(day ? { day, record } : null); 
    
    if (day && record) {
      try {
        setTopEmotions([]);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const date = String(day).padStart(2, '0');
        
        const dailyData = await authFetch(`/diaries/date?year=${year}&month=${month}&date=${date}`);
        
        // 상세 영역에는 상위 3개 감정을 표시합니다.
        const emotions = dailyData.emotionData
          .map(e => emotionNumberToName[e.emotion])
          .slice(0, 3);
        setTopEmotions(emotions); 

      } catch (error) {
        console.error("일별 상세 데이터 로딩 실패:", error);
        setTopEmotions([]);
      }
    } else {
      setTopEmotions([]);
    }
  }, [currentDate, selectedDayData]); 

  const formattedMonth = `${currentDate.getFullYear()}년 ${String(currentDate.getMonth() + 1).padStart(2, '0')}월`;
  const formattedFullDate = selectedDayData?.day 
    ? `${currentDate.getFullYear()}년 ${String(currentDate.getMonth() + 1).padStart(2, '0')}월 ${String(selectedDayData.day).padStart(2, '0')}일`
    : '';
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
            records={monthlyRecords}
            isLoading={isLoading}
          />
        </S.CalendarWrapper>

        <S.BottomContainer>
          {selectedDayData && selectedDayData.record ? (
            <S.RecordInfoContainer>
              <S.SelectedDateText>{formattedFullDate}</S.SelectedDateText>
              <S.InfoBox>
                <S.EmotionRow>
                  {topEmotions.length > 0 ? (
                    topEmotions.map((emotion, index) => (
                      <S.EmotionIcon key={index} src={emotionIcons[emotion]} alt={emotion} />
                    ))
                  ) : (
                    <p>감정 분석 중...</p>
                  )}
                </S.EmotionRow>
                <Link to={`/day/${urlFormattedDate}`}>
                  <S.DiaryButton src={diaryButtonImg} alt="일기 보기" />
                </Link>
              </S.InfoBox>
            </S.RecordInfoContainer>
          ) : selectedDayData ? (
            <S.AddButtonWrapper>
              <Link to={`/before-record/${urlFormattedDate}`}>
                <S.AddButton src={addButtonImg} alt="기록 추가" />
              </Link>
            </S.AddButtonWrapper>
          ) : (
            <></>
          )}
        </S.BottomContainer>
      </S.PageContainer>
    </Layout>
  );
}

export default MainPage;