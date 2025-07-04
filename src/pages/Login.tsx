// src/page/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoginButton from '../components/Button01';
import InputField from '../components/InputField';
import Theme from '../styles/Theme';
import { LoginPost } from '../api/auth/LoginPost';
import { getMembershipInfo, MembershipInfo } from '../api/user/userApi';
import MelpikLogo from '../assets/LoginLogo.svg';
import { schemaLogin } from '../hooks/ValidationYup';
import ReusableModal from '../components/ReusableModal';
import { isNativeApp, saveNativeLoginInfo } from '../utils/nativeApp';

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schemaLogin),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    const savedAutoLogin = localStorage.getItem('autoLogin');
    if (savedAutoLogin === 'true') {
      setAutoLogin(true);
      const savedEmail = localStorage.getItem('autoLoginEmail');
      const savedPassword = localStorage.getItem('autoLoginPassword');
      if (savedEmail && savedPassword) {
        // 자동 로그인 시도
        handleLoginClick({ email: savedEmail, password: savedPassword });
      }
    }
    // eslint-disable-next-line
  }, []);

  const handleModalClose = () => setIsModalOpen(false);

  const handleLoginClick = async (data: LoginFormValues) => {
    try {
      const response = (await LoginPost(
        data.email,
        data.password
      )) as LoginResponse;
      const { accessToken, refreshToken } = response;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      if (autoLogin) {
        localStorage.setItem('autoLogin', 'true');
        localStorage.setItem('autoLoginEmail', data.email);
        localStorage.setItem('autoLoginPassword', data.password);
      } else {
        localStorage.removeItem('autoLogin');
        localStorage.removeItem('autoLoginEmail');
        localStorage.removeItem('autoLoginPassword');
      }

      // === 네이티브 앱에 로그인 정보 전달 ===
      if (isNativeApp()) {
        saveNativeLoginInfo({
          id: data.email, // 또는 서버에서 받은 user id
          email: data.email,
          name: '', // 필요하다면 서버에서 받은 이름
          token: accessToken,
          refreshToken: refreshToken,
          expiresAt: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 7
          ).toISOString(), // 예시: 7일 뒤 만료
        });
      }

      const membership: MembershipInfo = await getMembershipInfo();

      navigate('/home', {
        replace: true,
        state: {
          showNotice: true,
          membership,
        },
      });
    } catch (error: unknown) {
      setModalMessage(
        error instanceof Error
          ? error.message
          : '로그인 실패. 다시 시도해주세요.'
      );
      setIsModalOpen(true);
    }
  };

  return (
    <ThemeProvider theme={Theme}>
      <Container>
        <LoginContainer>
          <Logo src={MelpikLogo} alt='멜픽 로고' />

          <LoginForm
            onSubmit={handleSubmit(handleLoginClick)}
            autoComplete='on'
          >
            <InputFieldRow>
              <Controller
                control={control}
                name='email'
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    label='사용자 이메일'
                    type='text'
                    placeholder='이메일을 입력하세요'
                    error={error}
                    autoComplete='username'
                    {...field}
                  />
                )}
              />
            </InputFieldRow>
            <InputFieldRow>
              <Controller
                control={control}
                name='password'
                render={({ field, fieldState: { error } }) => (
                  <InputField
                    label='비밀번호'
                    type='password'
                    placeholder='비밀번호를 입력하세요'
                    error={error}
                    autoComplete='current-password'
                    {...field}
                  />
                )}
              />
            </InputFieldRow>

            <CheckboxWrapper>
              <CheckboxLabel>
                <CheckboxInput
                  type='checkbox'
                  checked={autoLogin}
                  onChange={() => setAutoLogin((prev) => !prev)}
                />
                <CheckboxText>자동 로그인</CheckboxText>
              </CheckboxLabel>
            </CheckboxWrapper>

            <LoginButton type='submit' disabled={!isValid || isSubmitting}>
              {isSubmitting ? '로그인 중...' : '로그인'}
            </LoginButton>
          </LoginForm>

          <ExtraLinks>
            <Link onClick={() => navigate('/findid')}>아이디 찾기</Link>
            <LinkSeparator>|</LinkSeparator>
            <Link onClick={() => navigate('/findPassword')}>비밀번호 찾기</Link>
            <LinkSeparator>|</LinkSeparator>
            <Link onClick={() => navigate('/signup')}>회원가입</Link>
          </ExtraLinks>
        </LoginContainer>

        <ReusableModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title='로그인 실패'
        >
          {modalMessage}
        </ReusableModal>
      </Container>
    </ThemeProvider>
  );
};

export default Login;

// --- styled-components ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 600px;
  padding: 1rem;
`;
const LoginContainer = styled.div`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const Logo = styled.img`
  width: 150px;
  margin: 50px 0 21px;
`;
const LoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const InputFieldRow = styled.div`
  width: 100%;
`;
const CheckboxWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
`;
const CheckboxInput = styled.input`
  width: 20px;
  height: 20px;
  border: 1px solid lightgray;
  appearance: none;
  position: relative;
  cursor: pointer;

  &:checked::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 10px;
    height: 5px;
    border-left: 3px solid orange;
    border-bottom: 3px solid orange;
    transform: rotate(-45deg);
  }
`;
const CheckboxText = styled.div`
  font-size: 12px;
  font-weight: 700;
  margin-left: 8px;
`;
const ExtraLinks = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  min-width: 264px;
  margin-top: 30px;
`;
const Link = styled.a`
  color: ${({ theme }) => theme.colors.black};
  padding: 5px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const LinkSeparator = styled.span`
  color: ${({ theme }) => theme.colors.gray2};
  font-size: 15px;
`;
