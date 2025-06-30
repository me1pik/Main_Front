// src/layouts/AppLayout.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Cookies from 'js-cookie';

import UnifiedHeader from '../components/UnifiedHeader';
import BottomNav from '../components/BottomNav1';
import useHeaderConfig from '../hooks/useHeaderConfig';
import useImageLoader from '../hooks/useImageLoader';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) return;
    // 사용자 정보 API 호출
  }, []);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    const publicPaths = [
      '/signup',
      '/findId',
      '/findid',
      '/findPassword',
      '/landing',
      '/',
      '/login',
      '/PersonalLink',
    ];
    if (!publicPaths.includes(location.pathname) && !token) {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate]);

  const {
    includeHeader1,
    includeHeader2,
    includeHeader3,
    includeHeader4,
    includeBottomNav,
    headerTitle,
    disablePadding,
  } = useHeaderConfig(location.pathname);

  const { loading, handleBackWithExit } = useImageLoader(
    navigate,
    location.pathname
  );

  if (loading) {
    return (
      <LoadingOverlay>
        <LoadingSpinner />
      </LoadingOverlay>
    );
  }

  // BottomNav 표시 대상 경로
  const bottomNavPaths = [
    '/home',
    '/brand',
    '/melpik',
    '/lockerRoom',
    '/customerService',
  ];

  return (
    <AppContainer>
      {includeHeader1 && <UnifiedHeader variant='default' />}
      {includeHeader2 && <UnifiedHeader variant='oneDepth' />}
      {includeHeader3 && (
        <UnifiedHeader
          variant='twoDepth'
          title={headerTitle}
          onBack={handleBackWithExit}
        />
      )}
      {includeHeader4 && (
        <UnifiedHeader
          variant='threeDepth'
          title={headerTitle}
          onBack={handleBackWithExit}
        />
      )}

      {/* transient prop으로 변경 */}
      <ContentContainer $disablePadding={disablePadding}>
        <Outlet />
      </ContentContainer>

      {includeBottomNav && bottomNavPaths.includes(location.pathname) && (
        <BottomNav />
      )}
    </AppContainer>
  );
};

export default AppLayout;

// --- Styled Components ---

const spin = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
`;

const ContentContainer = styled.div<{
  $disablePadding?: boolean;
}>`
  flex: 1;
  padding: ${({ $disablePadding }) => ($disablePadding ? '0' : '70px 0')};
  overflow: auto;
  min-height: 100vh;
  background: #fff;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.div`
  border: 8px solid rgba(246, 172, 54, 0.3);
  border-top: 8px solid #f6ac36;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
`;
