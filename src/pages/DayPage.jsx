// src/pages/DayPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import * as S from './DayPage.styles';

import leftButtonImg from '../assets/buttons/leftbutton.svg';
import rightButtonImg from '../assets/buttons/rightbutton.svg';
import sadIcon from '../assets/emotions/sad.png';
import graphIcon from '../assets/icons/graph.svg';
import factorIcon from '../assets/icons/factor.svg';
import diaryIcon from '../assets/icons/diary.svg';
import adviceIcon from '../assets/icons/advice.svg';

const emotionIcons = { sad: sadIcon };

function DayPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  
  // 'setCurrentDate'를 사용하는 useState
  const [currentDate, setCurrentDate] = useState(new Date(date || Date.now()));
  // 'setDailyData'를 사용하는 useState
  const [dailyData, setDailyData] = useState(null);
  // 'setIsLoading'을 사용하는 useState
  const [isLoading, setIsLoading] = useState(true);

  // 'setDailyData', 'setIsLoading'을 사용하는 useEffect
  useEffect(() => {
    const fetchDailyData = async () => {
      setIsLoading(true);
      
      const mockData = {
        mainEmotion: 'sad',
        emotionFactors: ['날씨가 흐림', '업무 스트레스'],
        detail: '오늘은 기운이 없는 하루였다...',
        advice: '따뜻한 차 한잔과 함께 휴식을 취해보세요.'
      };
      setDailyData(mockData);
      setIsLoading(false);
    };
    fetchDailyData();
  }, [currentDate]);

  // 'formatDate' 함수
  const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];

  // 'setCurrentDate', 'navigate', 'formatDate'를 사용하는 함수들
  const handlePrevDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
    navigate(`/day/${formatDate(prevDay)}`);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
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
        ) : dailyData ? (
          <>
            <S.MainEmotionIcon src={emotionIcons[dailyData.mainEmotion]} alt="대표 감정" />
            <S.SectionContainer>
              <S.SectionTitleIcon src={graphIcon} alt="감정 그래프" />
              <S.ContentBox>
                <p>감정 그래프가 여기에 표시됩니다.</p>
              </S.ContentBox>
            </S.SectionContainer>
            <S.SectionContainer>
              <S.SectionTitleIcon src={factorIcon} alt="감정 요인" />
              <S.ContentBox>
                <ul>
                  {dailyData.emotionFactors.map((factor, i) => <li key={i}>{factor}</li>)}
                </ul>
              </S.ContentBox>
            </S.SectionContainer>
            <S.SectionContainer>
              <S.SectionTitleIcon src={diaryIcon} alt="감정 일기" />
              <S.ContentBox>
                <p>{dailyData.detail}</p>
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