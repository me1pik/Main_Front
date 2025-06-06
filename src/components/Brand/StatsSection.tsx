// src/components/LockerRoom/StatsSection.tsx
import React from 'react';
import styled from 'styled-components';

interface Props {
  brandCount: number;
  productCount: number;
  BrandIcon: string;
}

const StatsSection: React.FC<Props> = ({
  brandCount,
  productCount,
  BrandIcon,
}) => {
  return (
    <Container>
      <StatsContainer>
        <StatBox $white>
          <Row>
            <StatLabel>종류</StatLabel>
            <StatNumber>{brandCount}</StatNumber>
          </Row>
        </StatBox>
        <StatBox $gray>
          <Row>
            <StatLabel>등록 상품수</StatLabel>
            <StatNumber>{productCount}</StatNumber>
          </Row>
        </StatBox>
      </StatsContainer>
      <ImageWrapper>
        <MenuImage src={BrandIcon} alt='메뉴 이미지' />
      </ImageWrapper>
    </Container>
  );
};

export default StatsSection;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
`;

const ImageWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const MenuImage = styled.img`
  width: 64px;
  height: 58px;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 0;
  width: 100%;
`;

const StatBox = styled.div<{
  $white?: boolean;
  $gray?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $white, $gray }) =>
    $white ? '#fff' : $gray ? '#f6f6f6' : '#fff'};
  border: 1px solid #ddd;
  border-radius: ${({ $white, $gray }) =>
    $white ? '10px 0 0 0' : $gray ? '0 0 10px 0' : '0'};
  text-align: center;
  padding: 15px 20px;
  position: relative;
  margin-right: 0;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatNumber = styled.div`
  font-weight: 800;
  font-size: 12px;
  line-height: 13px;
  color: #f6ae24;
`;

const StatLabel = styled.div`
  font-weight: 700;
  font-size: 12px;
  line-height: 13px;
  color: #000;
  margin-right: 5px;
  width: 100%;
`;
