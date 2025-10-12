// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as S from './LoginPage.styles';

import titleLogo from '../assets/icons/soulmate_big.svg';
import avatar from '../assets/icons/avatar.svg';
import loginButtonImage from '../assets/buttons/loginbutton.svg';

function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // 이전 에러 메시지 초기화

    // TODO: 아래는 실제 API 호출 로직으로 교체해야 합니다.
    try {
      // 예시: 실제 fetch API 호출
      // const response = await fetch('http://soulmate.kro.kr:3000/api/v1/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: id, password: pw }),
      // });

      // if (!response.ok) {
      //   throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      // }

      // const data = await response.json();
      // localStorage.setItem('token', data.accessToken); // 토큰 저장
      
      // --- 임시 로그인 성공/실패 로직 ---
      if (id === "test" && pw === "1234") {
        alert('로그인 성공!');
        navigate('/'); // 메인 페이지로 이동
      } else {
        throw new Error('아이디와 비밀번호를 다시 입력하세요.');
      }
      // ---------------------------------

    } catch (err) {
      setError(err.message);
    }
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
          <S.Input id="id" type="text" value={id} onChange={(e) => setId(e.target.value)} />
        </S.InputWrapper>
        
        <S.InputWrapper>
          <S.Label htmlFor="pw">PW</S.Label>
          <S.Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </S.InputWrapper>
        
        {/* 로그인 실패 시 에러 메시지 표시 */}
        {error && <S.ErrorText>{error}</S.ErrorText>}

        <S.LoginImageButton type="submit">
          <img src={loginButtonImage} alt="로그인" />
        </S.LoginImageButton>

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