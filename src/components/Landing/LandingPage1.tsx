// src/components/Landing/LandingPage1.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import LandingBackground from '../../assets/Landing/LandingBackground.jpg';
import LeftLabel from '../../assets/Landing/LeftLabel.svg';

const LandingPage1: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/signup');
  };

  return (
    <Wrapper>
      {/* LeftLabelImage는 기존 절대 배치 유지 */}
      <LeftLabelImage src={LeftLabel} alt='Left Label' />

      <Container>
        <ContentBox>
          <BigTitle>
            이젠 <BrandSpan>브랜드 옷</BrandSpan>을
            <br />
            사고, 팔고, 빌리는
          </BigTitle>
          <SubTitle>멜픽에서 새롭게 경험하세요</SubTitle>
          <RegisterButton onClick={handleRegisterClick}>
            사전등록하기
          </RegisterButton>
        </ContentBox>
      </Container>
    </Wrapper>
  );
};

export default LandingPage1;

/* ====================== Styled Components ====================== */

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  /* 고정 높이를 제거하고 여백만 설정 */
  margin: 20px 10px;
  overflow: visible;
`;

const LeftLabelImage = styled.img`
  position: absolute;
  top: -35px;
  left: -35px;
  z-index: 2;
  width: auto;
  height: auto;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  min-height: 440px;
  /* 기본: 16:9 비율 유지 */
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;
  background: url(${LandingBackground}) no-repeat center/cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  margin: 0 auto;

  @media (min-width: 600px) {
    /* 너비가 600px 이상이면 높이를 700px로 고정 */
    height: 700px;
    aspect-ratio: unset;
  }
`;

const ContentBox = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BigTitle = styled.h1`
  font-weight: 800;
  font-size: 2rem; /* rem 단위 사용으로 반응형 적용 */
  line-height: 1.1;
  text-align: center;
  color: #ffffff;
  margin: 0 0 20px 0;
`;

const BrandSpan = styled.span`
  color: #f6ac36;
`;

const SubTitle = styled.h2`
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.1;
  text-align: center;
  color: #ffffff;
  margin: 0 0 47px 0;
`;

const RegisterButton = styled.button`
  width: 100%;
  max-width: 320px;
  height: 56px;
  background: rgba(34, 34, 34, 0.9);
  border: none;
  border-radius: 6px;
  cursor: pointer;

  font-weight: 800;
  font-size: 1rem;
  line-height: 1.1;
  color: #ffffff;
  transition: transform 0.1s;
  margin-bottom: 60px;

  &:hover {
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }
`;
