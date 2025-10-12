// src/pages/BeforeRecordingPage.jsx
import { Link, useParams } from 'react-router-dom';
import * as S from './BeforeRecordingPage.styles.js';

import Layout from '../components/Layout/Layout';
import avatarIcon from '../assets/icons/avatar.svg';
import startRecordingButtonImg from '../assets/buttons/startrecordingbutton.svg';

function BeforeRecordingPage() {
  const { date } = useParams();
  return (
    <Layout>
      <S.ContentContainer>
      <S.Avatar src={avatarIcon} alt="아바타" />

      <S.PromptText>
        대화를 시작하시겠습니까?
      </S.PromptText>

      <S.StartButtonLink to={`/recording/${date}`}>
        <img src={startRecordingButtonImg} alt="기록 시작" />
      </S.StartButtonLink>
      </S.ContentContainer>
      </Layout>
  );
}

export default BeforeRecordingPage;