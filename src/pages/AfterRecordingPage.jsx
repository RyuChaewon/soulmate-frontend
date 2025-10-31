// src/pages/AfterRecordingPage.jsx
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as S from './AfterRecordingPage.styles.js';
import Layout from '../components/Layout/Layout';
import { authFetch } from '../api';

import diaryButtonImg from '../assets/buttons/diarybutton.svg';

// 모든 감정 아이콘 import
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

function AfterRecordingPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  
  const [recordData, setRecordData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');

    const fetchRecordData = async () => {
      setIsLoading(true);
      try {
        const [year, month, day] = date.split('-');
        const data = await authFetch(`/diaries/date?year=${year}&month=${month}&date=${day}`);
        setRecordData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (date) {
      fetchRecordData();
    } else {
      setIsLoading(false);
      setError("날짜 정보가 없습니다.");
    }
  }, [date, navigate]);

  return (
    <Layout>
      <S.ContentContainer>
        {/* 로딩 중일 때 */}
        {isLoading && (
          <S.MainText>분석 결과를 불러오는 중...</S.MainText>
        )}

        {/* 로딩이 끝났을 때 (성공 또는 실패) */}
        {!isLoading && (
          <>
            <S.SubText>오늘의 감정</S.SubText>

            {/* 에러가 있거나 데이터가 없을 경우 */}
            {error || !recordData ? (
              <S.MainText>오류: {error || "데이터를 불러오지 못했습니다."}</S.MainText>
            ) : (
              // 성공했을 경우
              <>
                <S.EmotionIcon 
                  src={emotionIcons[emotionNumberToName[recordData.emotionData[0].emotion]]} 
                  alt="대표 감정" 
                />
                <S.MainText>대화가 종료되었습니다.</S.MainText>
              </>
            )}
            
            {/* 일기 보기 버튼은 로딩이 끝났다면 항상 보입니다. */}
            <S.DiaryButtonLink to={`/day/${date}`}>
              <img src={diaryButtonImg} alt="일기 보기" />
            </S.DiaryButtonLink>
          </>
        )}
      </S.ContentContainer>
    </Layout>
  );
}

export default AfterRecordingPage;