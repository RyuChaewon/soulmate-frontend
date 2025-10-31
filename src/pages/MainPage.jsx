// src/pages/MainPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as S from './MainPage.styles';
import Layout from '../components/Layout/Layout';
import Calendar from '../components/Calendar';
import { authFetch } from '../api'; // API 통신 헬퍼

// 필요한 이미지 import
import leftButtonImg from '../assets/buttons/leftbutton.svg';
import rightButtonImg from '../assets/buttons/rightbutton.svg';
import addButtonImg from '../assets/buttons/addbutton.svg';
import diaryButtonImg from '../assets/buttons/diarybutton.svg';

import happyIcon from '../assets/emotions/happy.png';
import angryIcon from '../assets/emotions/angry.png';
import anxietyIcon from '../assets/emotions/anxiety.png';
import neutralIcon from '../assets/emotions/neutral.png';
import panicIcon from '../assets/emotions/panic.png';
import sadIcon from '../assets/emotions/sad.png';
import woundIcon from '../assets/emotions/wound.png';
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

// --- ↓↓↓ [수정] 새로운 감정 번호 -> 이름 매핑 객체 ↓↓↓ ---
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

  // 월이 바뀔 때마다 실행되는 월별 데이터 로딩
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
        
        // --- ↓↓↓ 이 데이터 처리 부분을 수정했습니다 ↓↓↓ ---
        const records = data.reduce((acc, diary) => {
          const day = new Date(diary.date).getDate();
          // emotionData 배열이 있고, 그 안에 요소가 있을 경우에만 처리
          if (diary.emotionData && diary.emotionData.length > 0) {
            const mainEmotionId = diary.emotionData[0].emotion;
            acc[day] = emotionNumberToName[mainEmotionId]; // 대표 감정 번호를 이름으로 변환하여 저장
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
  
  // 날짜 클릭 시 실행되는 일별 상세 데이터 로딩
  const handleDayClick = useCallback(async (day, record) => {
    // 같은 날짜를 다시 클릭하면 선택 해제
    if (selectedDayData && selectedDayData.day === day) {
      setSelectedDayData(null);
      setTopEmotions([]);
      return;
    }

    setSelectedDayData(day ? { day, record } : null); 
    
    if (day && record) {
      try {
        setTopEmotions([]); // 감정 로딩 중 상태를 위해 초기화
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const date = String(day).padStart(2, '0');
        
        const dailyData = await authFetch(`/diaries/date?year=${year}&month=${month}&date=${date}`);
        
        // emotionData 배열에서 감정 번호를 이름으로 변환하여 상위 3개 저장
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
            <></> // 아무것도 선택하지 않은 초기 상태
          )}
        </S.BottomContainer>
      </S.PageContainer>
    </Layout>
  );
}

export default MainPage;