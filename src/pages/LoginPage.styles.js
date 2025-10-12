// src/pages/LoginPage.styles.js
import styled from 'styled-components';

export const PageContainer = styled.div`
  width: 393px;
  height: 852px;
  background-color: #ffffff;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

export const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
`;

export const Title = styled.img`
  width: 250px;
`;

export const Avatar = styled.img`
  width: 150px;
  margin-top: 40px;
`;

export const BottomSheet = styled.form`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 400px;
  background-color: #EBF6D8;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 30px;
  box-sizing: border-box;
  gap: 15px;
`;

// InputWrapper를 원래의 단순한 스타일로 되돌립니다.
export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  width: 40px;
  text-align: left;
  color: #50AB75;
`;

export const Input = styled.input`
  flex: 1;
  height: 42px;
  border: 3px solid #50AB75;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 0 15px;
  font-size: 16px;
  box-sizing: border-box;
`;

// ErrorText 스타일을 삭제했습니다.

export const LoginButton = styled.button`
  width: 100%;
  height: 50px;
  background-color: #AAD786;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
`;

export const EmailStartLink = styled.a`
  color: #555;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;
`;