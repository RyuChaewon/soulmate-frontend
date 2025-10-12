// src/components/Layout/Layout.jsx
import styled from 'styled-components';
import Header from '../Header/Header';

// 앱 전체를 감싸는 393px 너비의 컨테이너
const AppContainer = styled.div`
  width: 393px;
  min-height: 852px;
  background-color: white;
  margin: 0 auto; /* 브라우저 중앙 정렬 */
  position: relative;
`;

// 헤더 높이만큼 여백을 주는 콘텐츠 영역
const Content = styled.main`
  padding-top: 90px;
`;

function Layout({ children }) {
  return (
    <AppContainer>
      <Header />
      <Content>{children}</Content>
    </AppContainer>
  );
}

export default Layout;