// src/pages/JoinPage.styles.js
import styled from 'styled-components';

export const PageContainer = styled.div`
  width: 393px;
  min-height: 852px;
  background-color: #ffffff;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  box-sizing: border-box;
`;

export const Logo = styled.img`
  margin-top: 60px;
  margin-bottom: 50px;
`;

export const JoinForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const FormGroup = styled.div`
  margin-bottom: 35px; /* 에러 메시지가 들어갈 공간 확보 */
  width: 100%;
  position: relative;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
`;

// LabelRow는 더 이상 필요 없으므로 삭제합니다.

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Input = styled.input`
  flex-grow: 1;
  width: 100%;
  height: 25px;
  border: 1px solid #A9A9A9;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 16px;
  box-sizing: border-box;

  &:disabled {
    background-color: #f0f0f0;
    color: #888;
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  
  img {
    display: block;
  }
`;
export const StatusText = styled.p`
  font-size: 12px;
  color: #50AB75;
  text-align: right;
  margin-top: 10px; /* 입력창과 10px 간격 */
  position: absolute;
  right: 70px;
`;

export const ErrorText = styled.p`
  font-size: 12px;
  color: #ff0000;
  text-align: right;
  margin-top: 10px; /* 입력창과 10px 간격 */
  position: absolute;
  right: 5px;
`;
// --- ↓↓↓ 이 부분을 수정합니다 ↓↓↓ ---
export const JoinButtonWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex; /* 중앙 정렬을 위해 flex 사용 */
  justify-content: center; /* 가로 중앙 정렬 */
`;
// --- ↑↑↑ 여기까지 수정 ---