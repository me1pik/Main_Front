import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import MypageBox from '../assets/MypageBox.svg';
import MystyleBox from '../assets/MystyleBox.svg';
import ReusableModal from '../components/ReusableModal';
import ReusableModal2 from '../components/ReusableModal2';
import { logoutUser } from '../api/user/userApi';
import { Axios } from '../api/Axios';

const getEmailFromToken = (): string | null => {
  const token =
    Cookies.get('accessToken') || localStorage.getItem('accessToken') || '';
  if (!token) return null;
  try {
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    return payload.email as string;
  } catch {
    return null;
  }
};

type MypageModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MypageModal: React.FC<MypageModalProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isPlaceholderOpen, setPlaceholderOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  const handleOverlayClick = () => {
    setIsClosing(true);
    setTimeout(onClose, 400);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLogoutOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      const email = getEmailFromToken();
      if (email) {
        await logoutUser(email);
      }
    } catch (err) {
      console.error('logout error:', err);
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('profileImageUrl');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      Axios.defaults.headers.Authorization = '';
      setLogoutModalOpen(false);
      onClose();
      navigate('/login', { replace: true });
      window.location.reload();
    }
  };

  const handlePlaceholderOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaceholderOpen(true);
  };

  const handlePlaceholderClose = () => {
    setPlaceholderOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={handleOverlayClick}>
        <ModalContainer onClick={handleModalClick} $isClosing={isClosing}>
          <ModalHandle>
            <HandleBar />
          </ModalHandle>
          <ModalHeader>
            <Title>마이페이지</Title>
          </ModalHeader>
          <Divider />
          <ModalContentArea>
            <PlaceholderImage
              src={MypageBox}
              alt='마이페이지 이미지'
              onClick={handlePlaceholderOpen}
            />
            <PlaceholderImage
              src={MystyleBox}
              alt='마이스타일 이미지'
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                navigate('/Mystyle');
              }}
            />
          </ModalContentArea>
          <Divider />
          <LogoutButton onClick={handleLogoutOpen}>로그아웃</LogoutButton>
        </ModalContainer>
      </Overlay>

      {isLogoutModalOpen && (
        <ReusableModal2
          isOpen={isLogoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleLogoutConfirm}
          title='알림'
        >
          로그아웃을 하시겠습니까?
        </ReusableModal2>
      )}

      {isPlaceholderOpen && (
        <ReusableModal
          isOpen={isPlaceholderOpen}
          onClose={handlePlaceholderClose}
          title='준비 중입니다'
        >
          아직 구현 전인 기능이에요.
        </ReusableModal>
      )}
    </>
  );
};

export default MypageModal;

/* Styled Components */
const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

const slideDown = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(100%); }
`;

interface ModalContainerProps {
  $isClosing: boolean;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 9999;
`;

const ModalContainer = styled.div<ModalContainerProps>`
  max-width: 600px;
  width: 100%;
  min-height: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: ${({ $isClosing }) =>
    $isClosing
      ? css`
          ${slideDown} 0.4s ease-out forwards
        `
      : css`
          ${slideUp} 0.4s ease-out forwards
        `};
`;

const ModalHandle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 8px;
`;

const HandleBar = styled.div`
  position: fixed;
  top: 6px;
  width: 40px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
`;

const ModalHeader = styled.div`
  margin: 16px;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 800;
  line-height: 18px;
  margin: 0;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  background: #ddd;
  border: none;
  margin: 0;
`;

const ModalContentArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 20px;
`;

const PlaceholderImage = styled.img`
  cursor: pointer;
  object-fit: cover;
`;

const LogoutButton = styled.button`
  width: 100%;
  height: 56px;
  margin: 16px auto;
  background: #000;
  color: #fff;
  font-weight: 800;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;
