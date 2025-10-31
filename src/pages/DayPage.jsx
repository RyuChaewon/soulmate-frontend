// src/pages/DayPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import * as S from './DayPage.styles';

// asset 이미지들 불러오기
import leftButtonImg from '../assets/buttons/leftbutton.svg';
import rightButtonImg from '../assets/buttons/rightbutton.svg';
import factorIcon from '../assets/icons/factor.svg';
import diaryIcon from '../assets/icons/diary.svg';
import adviceIcon from '../assets/icons/advice.svg';

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
// --- ↑↑↑ 여기까지 ---

// --- ↓↓↓ [수정] 새로운 감정 번호 -> 한글 이름 매핑 객체 ↓↓↓ ---
const emotionNumberToKoreanName = {
  1: '행복',
  2: '분노',
  3: '불안',
  4: '중립',
  5: '공포',
  6: '슬픔',
  7: '상처',
};
// --- ↑↑↑ 여기까지 ---

function DayPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  
  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const [currentDate, setCurrentDate] = useState(parseDate(date || new Date().toISOString().split('T')[0]));
  const [dailyData, setDailyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCurrentDate(parseDate(date));

    const fetchDailyData = async () => {
      setIsLoading(true);
      setError(null);
      setDailyData(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const [year, month, day] = date.split('-');
        
        const response = await fetch(`https://soulmate.kro.kr/diaries/date?year=${year}&month=${month}&date=${day}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
     
        if (response.status === 404) {
          setDailyData(null);
        } else if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '데이터를 불러오는 데 실패했습니다.');
        } else {
          const result = await response.json();
          setDailyData(result);
        }

      } catch (err) {
        console.error("일별 데이터 로딩 실패:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyData();
  }, [date, navigate]);

  const formatDate = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handlePrevDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    navigate(`/day/${formatDate(prevDay)}`);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    navigate(`/day/${formatDate(nextDay)}`);
  };
  
  const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;

  return (
    <Layout>
      <S.PageWrapper>
        <S.DateControl>
          <S.ArrowButton onClick={handlePrevDay}>
            <img src={leftButtonImg} alt="이전 날짜" />
          </S.ArrowButton>
          <S.DateText>{formattedDate}</S.DateText>
          <S.ArrowButton onClick={handleNextDay}>
            <img src={rightButtonImg} alt="다음 날짜" />
          </S.ArrowButton>
        </S.DateControl>

        {isLoading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>에러: {error}</p>
        ) : dailyData ? (
          <>
            <S.MainEmotionIcon 
              src={emotionIcons[emotionNumberToName[dailyData.emotionData?.[0]?.emotion]]} 
              alt="대표 감정" 
            />
            
            {/* 감정 그래프는 삭제된 것으로 반영 */}

            <S.SectionContainer>
              <S.SectionTitleIcon src={factorIcon} alt="감정 요인" />
              <S.ContentBox>
                {/* --- ↓↓↓ 감정 요인 렌더링 로직 수정 ↓↓↓ --- */}
                <ul>
                  {dailyData.emotionData?.map((emotionItem, index) => {
                    const emotionName = emotionNumberToName[emotionItem.emotion];
                    const koreanEmotionName = emotionNumberToKoreanName[emotionItem.emotion];
                    return (
                      <S.FactorListItem key={index}>
                        <S.FactorHeader>
                          <S.FactorIcon src={emotionIcons[emotionName]} alt={emotionName} />
                          <S.FactorEmotionName>{koreanEmotionName}</S.FactorEmotionName>
                        </S.FactorHeader>
                        <S.FactorCause>{emotionItem.cause}</S.FactorCause>
                      </S.FactorListItem>
                    );
                  })}
                </ul>
                {/* --- ↑↑↑ 여기까지 --- */}
              </S.ContentBox>
            </S.SectionContainer>

            <S.SectionContainer>
              <S.SectionTitleIcon src={diaryIcon} alt="감정 일기" />
              <S.ContentBox>
                <p>{dailyData.todayDiary}</p>
              </S.ContentBox>
            </S.SectionContainer>

            <S.SectionContainer>
              <S.SectionTitleIcon src={adviceIcon} alt="소울메이트의 조언" />
              <S.ContentBox>
                <p>{dailyData.advice}</p>
              </S.ContentBox>
            </S.SectionContainer>
          </>
        ) : (
          <p>해당 날짜의 기록이 없습니다.</p>
        )}
      </S.PageWrapper>
    </Layout>
  );
}

export default DayPage;