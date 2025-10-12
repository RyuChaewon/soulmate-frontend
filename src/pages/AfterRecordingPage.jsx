// src/pages/AfterRecordingPage.jsx
import { Link, useParams } from 'react-router-dom';
import * as S from './AfterRecordingPage.styles.js';

import Layout from '../components/Layout/Layout';
import happyIcon from '../assets/emotions/happy.png'; // 예시 감정 아이콘
import diaryButtonImg from '../assets/buttons/diarybutton.svg';

function AfterRecordingPage() {
  // TODO: 실제 기록된 날짜를 받아와야 함 (예시)
  const { date } = useParams(); 

  return (
    <Layout>

      <S.ContentContainer>
        <S.SubText>오늘의 감정</S.SubText>

        <S.EmotionIcon src={happyIcon} alt="대표 감정" />

        <S.MainText>대화가 종료되었습니다.</S.MainText>

        <S.DiaryButtonLink to={`/day/${date}`}>
          <img src={diaryButtonImg} alt="일기 보기" />
        </S.DiaryButtonLink>
      </S.ContentContainer>
    </Layout>
  );
}

export default AfterRecordingPage;