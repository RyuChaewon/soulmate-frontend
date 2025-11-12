// src/pages/AfterRecordingPage.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authFetch } from '../api';
import * as S from './AfterRecordingPage.styles';
import Layout from '../components/Layout/Layout';

import diaryButtonImg from '../assets/buttons/diarybutton.svg';
import againButtonImg from '../assets/buttons/againbutton.svg';

// --- [수정 1] 새로운 감정 아이콘 7가지 import (png) ---
import happyIcon from '../assets/emotions/happy.png';
import angryIcon from '../assets/emotions/angry.png';
import anxietyIcon from '../assets/emotions/anxiety.png';
import neutralIcon from '../assets/emotions/neutral.png';
import panicIcon from '../assets/emotions/panic.png';
import sadIcon from '../assets/emotions/sad.png';
import woundIcon from '../assets/emotions/wound.png';

// --- [수정 2] 영문 이름 -> 아이콘 변수 매핑 ---
const emotionIcons = {
  happy: happyIcon,
  angry: angryIcon,
  anxiety: anxietyIcon,
  neutral: neutralIcon,
  panic: panicIcon,
  sad: sadIcon,
  wound: woundIcon,
};

// --- [수정 3] 서버에서 오는 숫자 -> 영문 이름 매핑 ---
const emotionNumberToName = {
  1: 'happy',
  2: 'angry',
  3: 'anxiety',
  4: 'neutral',
  5: 'panic',
  6: 'sad',
  7: 'wound',
};

function AfterRecordingPage() {
  const { date } = useParams();
  const navigate = useNavigate();

  const [recordData, setRecordData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const retryCount = useRef(0);
  const MAX_RETRIES = 10; 
  const RETRY_INTERVAL = 2000;

  // --- (useEffect, formatDate, handleRetryRecording 함수는 동일) ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');

    if (!date) {
      setIsLoading(false);
      setError("날짜 정보가 없습니다.");
      return;
    }

    const fetchRecordData = async () => {
      try {
        const [year, month, day] = date.split('-');
        const data = await authFetch(`/diaries/date?year=${year}&month=${month}&date=${day}`);

        if (data && data.todayDiary) {
          setRecordData(data);
          setIsLoading(false);
        } else if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          console.log(`[AfterRecordingPage] 데이터 불완전: ${retryCount.current}/${MAX_RETRIES} 재시도 중...`);
          setTimeout(fetchRecordData, RETRY_INTERVAL);
        } else {
          setError("일기 분석 시간이 초과되었거나 데이터가 불완전합니다. 다시 시도해주세요.");
          setIsLoading(false);
        }
      } catch (err) {
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          console.error(`[AfterRecordingPage] API 호출 오류: ${err.message}. ${retryCount.current}/${MAX_RETRIES} 재시도 중...`);
          setTimeout(fetchRecordData, RETRY_INTERVAL);
        } else {
          setError(`일기 데이터를 불러오지 못했습니다: ${err.message}`);
          setIsLoading(false);
        }
      }
    };

    fetchRecordData();
  }, [date, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const handleRetryRecording = () => {
    navigate(`/before-record/${date}`); 
  };

  const handleReadDiary = () => {
    navigate(`/day/${date}`); 
  };
  // --- (여기까지 동일) ---


  if (isLoading) {
    return (
      <Layout>
        <S.Container>
          <S.ContentContainer>
            <S.LoadingText>일기를 분석 중입니다...</S.LoadingText>
          </S.ContentContainer>
        </S.Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <S.Container>
          <S.ContentContainer>
            <S.ErrorMessage>{error}</S.ErrorMessage>
            <S.ButtonWrapper>
              <S.RetryRecordingButton onClick={handleRetryRecording}>
                <img src={againButtonImg} alt="일기 다시 쓰기" />
              </S.RetryRecordingButton>
            </S.ButtonWrapper>
          </S.ContentContainer>
        </S.Container>
      </Layout>
    );
  }

  // --- [수정 4] 대표 감정 아이콘을 찾기 위한 변수 선언 ---
  let representativeEmotionName = 'neutral'; // 기본값
  let representativeIcon = neutralIcon;  // 기본값

  if (recordData && recordData.emotionData && recordData.emotionData.length > 0) {
    const emotionNumber = recordData.emotionData[0].emotion; // (예: 1)
    representativeEmotionName = emotionNumberToName[emotionNumber]; // (예: 'happy')
    representativeIcon = emotionIcons[representativeEmotionName]; // (예: happyIcon)
  }

  return (
    <Layout>
      <S.Container>
        <S.ContentContainer>
          <S.DiaryCard>
            
            {/* --- [수정 5] 대표 감정 아이콘 렌더링 로직 수정 --- */}
            <S.EmotionIcon 
              src={representativeIcon} 
              alt={`${representativeEmotionName} 아이콘`} 
            />
            {/* --- 👆 여기까지 --- */}

            <S.DiaryHeader>오늘의 일기</S.DiaryHeader>
            <S.DiaryDate>{formatDate(recordData.date)}</S.DiaryDate>
            
            <S.EmotionList>
              {recordData.emotionData && recordData.emotionData.map((emotion, index) => (
                <S.EmotionItem key={index}>
                  
                  {/* --- [수정] 텍스트(이름) 대신 아이콘(img)으로 변경 --- */}
                  <S.EmotionListIcon 
                    src={emotionIcons[emotionNumberToName[emotion.emotion]]}
                    alt={emotionNumberToName[emotion.emotion]}
                  />
                  {/* --- ------------------------------------- --- */}

                  
                  <br />
                  {emotion.summary}
                  <br />
                  <span style={{ fontSize: '12px', color: '#eee' }}>{emotion.cause}</span>
                </S.EmotionItem>
              ))}
            </S.EmotionList>
            
            <S.DiaryContent>{recordData.todayDiary}</S.DiaryContent>
            <S.AdviceContent>{recordData.advice}</S.AdviceContent>
          </S.DiaryCard>
          
          <S.ButtonWrapper>
              <S.DiaryButton onClick={handleReadDiary}>
                <img src={diaryButtonImg} alt="일기보기" />
              </S.DiaryButton>
          </S.ButtonWrapper>
        </S.ContentContainer>
      </S.Container>
    </Layout>
  );
}

export default AfterRecordingPage;