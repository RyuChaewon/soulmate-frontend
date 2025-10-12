// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as S from './LoginPage.styles';

import titleLogo from '../assets/icons/soulmate_big.svg';
import avatar from '../assets/icons/avatar.svg';

function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 유효성 검사 실패 시 alert를 띄우고 함수 종료
    if (!id) {
      return alert('아이디를 입력하세요.');
    }
    if (!pw) {
      return alert('비밀번호를 입력하세요.');
    }

    // --- 임시 로그인 성공/실패 로직 ---
    // TODO: 아래는 실제 API 호출 로직으로 교체해야 합니다.
    if (id === "test" && pw === "1234") {
      alert('로그인 성공!');
      navigate('/'); // 로그인 성공 시 메인 페이지로 이동
    } else {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    // ---------------------------------
  };

  return (
    <S.PageContainer>
      <S.TopContent>
        <S.Title src={titleLogo} alt="SOUL MATE" />
        <S.Avatar src={avatar} alt="아바타" />
      </S.TopContent>

      <S.BottomSheet onSubmit={handleLogin}>
        <S.InputWrapper>
          <S.Label htmlFor="id">ID</S.Label>
          <S.Input 
            id="id" type="text" value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </S.InputWrapper>
        
        <S.InputWrapper>
          <S.Label htmlFor="pw">PW</S.Label>
          <S.Input 
            id="pw" type="password" value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </S.InputWrapper>

        <S.LoginButton type="submit">
          로그인
        </S.LoginButton>

        <Link to="/join">
          <S.EmailStartLink as="span">
            이메일로 시작하기
          </S.EmailStartLink>
        </Link>
      </S.BottomSheet>
    </S.PageContainer>
  );
}

export default LoginPage;