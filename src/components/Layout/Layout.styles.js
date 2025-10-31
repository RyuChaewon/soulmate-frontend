// src/components/Layout/Layout.styles.js
import styled from 'styled-components';

export const Background = styled.div`
  min-height: 100vh;
  background-color: #f0f2f5; /* 바깥 배경색 (선택 사항) */
  display: flex;
  justify-content: center; /* 자식 요소를 가로 중앙에 배치 */
  padding: 20px 0; /* 위아래 여유 공간 */
`;

// 2. 앱 전체를 감싸는 393px 너비의 흰색 컨테이너를 만듭니다. (스케치북 역할)
export const AppContainer = styled.div`
  width: 393px;
  min-height: 852px;
  background-color: white;
  position: relative; /* 내부 요소들의 위치 기준점 */
  margin: 0 auto; /* 수평 중앙 정렬 */
`;

// 3. 헤더 높이만큼 여백을 주는 콘텐츠 영역
export const Content = styled.main`
  padding-top: 90px; /* 헤더 높이 */
  height: 100%; /* 부모 높이에 꽉 채움 */
  overflow-y: auto; /* 내용이 길어지면 이 부분만 스크롤 */
`;