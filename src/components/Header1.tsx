import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Cookies from 'js-cookie';

import Alarm from '../assets/Header/AlarmIcon.svg';
import BasketIcon from '../assets/Header/BasketIcon.svg';
import MypageIcon from '../assets/Header/MypageIcon.svg';
// import LogoutIcon from '../assets/Header/LogoutIcon.svg'; // 로그아웃 아이콘 추가
import Logo from '../assets/Logo.svg';

const Header: React.FC = () => {
  const navigate = useNavigate();

  // 상태 정의
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('사용자'); // 기본 닉네임

  useEffect(() => {
    // ✅ 토큰 확인 후 로그인 상태 변경
    const accessToken = Cookies.get('accessToken');
    const userNickname = Cookies.get('nickname');

    if (accessToken) {
      setIsLoggedIn(true);
      setNickname(userNickname || '멜픽 회원'); // 닉네임이 없으면 기본값 사용
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // ✅ 로그아웃 핸들러 (쿠키 삭제 후 상태 업데이트)
  // const handleLogout = () => {
  //   Cookies.remove('accessToken');
  //   Cookies.remove('refreshToken');
  //   Cookies.remove('nickname');
  //   setIsLoggedIn(false);
  //   navigate('/login');
  // };

  // ✅ 페이지 이동 핸들러
  // const handleMypageClick = () => navigate('/mypage');
  const handleBasketClick = () => navigate('/basket');

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <LeftSection>
          {isLoggedIn ? (
            <Greeting>
              <ProfileImage
                src='https://via.placeholder.com/44'
                alt='User profile'
              />
              <GreetingText>
                <Nickname>{nickname}</Nickname> 님 안녕하세요!
              </GreetingText>
            </Greeting>
          ) : (
            <LogoIcon src={Logo} alt='Logo' />
          )}
        </LeftSection>

        <RightSection>
          {isLoggedIn ? (
            <>
              <Icon
                src={BasketIcon}
                alt='장바구니'
                onClick={handleBasketClick}
              />
              <Icon src={Alarm} alt='알림' />
              {/* <Icon src={LogoutIcon} alt='로그아웃' onClick={handleLogout} /> */}
            </>
          ) : (
            <>
              <Icon
                src={MypageIcon}
                alt='마이페이지'
                onClick={() => navigate('/login')}
              />
              <Icon src={Alarm} alt='알림' />
            </>
          )}
        </RightSection>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;

// 스타일 정의
const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  z-index: 100;
  background-color: #fff;
`;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Greeting = styled.div`
  display: flex;
  align-items: center;
`;

const GreetingText = styled.div`
  font-family: 'NanumSquare Neo OTF';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 13px;
  color: #000000;
`;

const Nickname = styled.span`
  font-family: 'NanumSquare Neo OTF';
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 20px;
  color: #000000;
`;

const LogoIcon = styled.img`
  width: auto;
  height: auto;
`;

const Icon = styled.img`
  cursor: pointer;
`;
