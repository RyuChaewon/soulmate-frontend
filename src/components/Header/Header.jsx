// src/components/Header/Header.jsx
import { Link } from 'react-router-dom';
import * as S from './Header.styles';
import headerImg from '../../assets/Header.svg'; // 헤더 이미지

function Header() {
  return (
    <S.HeaderContainer>
      <Link to="/">
        <S.HeaderImage src={headerImg} alt="Header - Go to Main" />
      </Link>
    </S.HeaderContainer>
  );
}

export default Header;