import React, { useState, useRef, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaSignup } from '../hooks/ValidationYup';
import InputField from '../components/InputField';
import AgreementSection from '../components/Signup/AgreementSection';
import Theme from '../styles/Theme';
import BottomBar from '../components/BottomNav2';
import ResetButtonIcon from '../assets/ResetButton.png';
import { useNavigate } from 'react-router-dom';
import { CustomSelect } from '../components/CustomSelect';
import ReusableModal from '../components/ReusableModal';
import {
  signUpUser,
  checkEmail,
  verifyPhone,
  verifyCode,
  checkWebpage,
  checkNickname,
} from '../api/user/userApi';
import { regionDistrictData } from '../components/Signup/regionDistrictData';

type SignupFormData = {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  name: string;
  birthYear: string;
  phoneNumber: string;
  region: string;
  district: string;
  melpickAddress: string;
};

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const methods = useForm<SignupFormData>({
    resolver: yupResolver(schemaSignup),
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      nickname: '',
      name: '',
      birthYear: '',
      phoneNumber: '',
      region: '',
      district: '',
      melpickAddress: '',
    },
  });
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    getValues,
  } = methods;

  // 각 검증 성공 여부 상태
  const [isEmailChecked, setIsEmailChecked] = useState<boolean>(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState<boolean>(false);
  const [isPhoneVerificationSent, setIsPhoneVerificationSent] =
    useState<boolean>(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [isMelpickAddressChecked, setIsMelpickAddressChecked] =
    useState<boolean>(false);

  // 버튼 텍스트 상태
  const [emailButtonText, setEmailButtonText] = useState<string>('중복확인');
  const [nicknameButtonText, setNicknameButtonText] =
    useState<string>('중복확인');
  const [melpickAddressButtonText, setMelpickAddressButtonText] =
    useState<string>('체크');
  const [phoneVerificationButtonText, setPhoneVerificationButtonText] =
    useState<string>('인증');

  // 성별 및 멜픽 주소 관련 상태
  const [gender, setGender] = useState<string>('여성');
  const [selectedGenderButton, setSelectedGenderButton] =
    useState<string>('여성');
  const [melpickAddress, setMelpickAddress] = useState<string>('');

  // 회원가입 결과 메시지 및 모달 상태 (전체 검증 메시지는 회원가입 버튼을 통해서만 보여줌)
  const [signupResult, setSignupResult] = useState<string>('');
  const [isSignupSuccess, setIsSignupSuccess] = useState<boolean>(false);
  const [showSignupResultModal, setShowSignupResultModal] =
    useState<boolean>(false);

  // 본인 인증 관련 (인증번호 입력)
  const [verificationCode, setVerificationCode] = useState<string>('');

  // 타이머 (3분 = 180초)
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startTimer = () => {
    setTimer(180);
    if (timerRef.current !== null) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current !== null) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current);
    };
  }, []);

  // 필드별 인증 상태 초기화 함수 (입력값 변경 시 다시 검증하도록)
  const resetVerificationState = (
    field: 'email' | 'nickname' | 'phoneNumber' | 'melpickAddress'
  ) => {
    if (field === 'email' && isEmailChecked) {
      setIsEmailChecked(false);
      setEmailButtonText('중복확인');
    }
    if (field === 'nickname' && isNicknameChecked) {
      setIsNicknameChecked(false);
      setNicknameButtonText('중복확인');
    }
    if (field === 'phoneNumber' && isPhoneVerified) {
      setIsPhoneVerified(false);
      setPhoneVerificationButtonText('인증');
    }
    if (field === 'melpickAddress' && isMelpickAddressChecked) {
      setIsMelpickAddressChecked(false);
      setMelpickAddressButtonText('체크');
    }
  };

  // --- 개별 필드 검증 함수 ---
  const handleEmailCheck = async (): Promise<void> => {
    const valid = await trigger('email');
    if (!valid) return;
    const email = getValues('email');
    try {
      const result = await checkEmail(email);
      if (result.isAvailable) {
        setEmailButtonText('인증 완료');
        setIsEmailChecked(true);
      } else {
        setEmailButtonText('인증 실패');
        setIsEmailChecked(false);
      }
    } catch (err: unknown) {
      setEmailButtonText('인증 실패');
      setIsEmailChecked(false);
    }
  };

  const handleNicknameCheck = async (): Promise<void> => {
    const valid = await trigger('nickname');
    if (!valid) return;
    const nickname = getValues('nickname');
    try {
      const result = await checkNickname(nickname);
      if (result.isAvailable) {
        setNicknameButtonText('인증 완료');
        setIsNicknameChecked(true);
      } else {
        setNicknameButtonText('인증 실패');
        setIsNicknameChecked(false);
      }
    } catch (err: unknown) {
      setNicknameButtonText('인증 실패');
      setIsNicknameChecked(false);
    }
  };

  const handleSendVerification = async (): Promise<void> => {
    const valid = await trigger('phoneNumber');
    if (!valid) return;

    // 인증 인풋 필드와 타이머를 우선 노출
    setIsPhoneVerificationSent(true);
    const phoneNumber = getValues('phoneNumber');
    try {
      const result = await verifyPhone({ phoneNumber });
      if (result.message && result.message.includes('성공')) {
        // 인증 코드 전송 성공 시 타이머 시작
        startTimer();
      } else {
        setPhoneVerificationButtonText('인증 실패');
      }
    } catch (err: unknown) {
      setPhoneVerificationButtonText('인증 실패');
    }
  };

  const handleVerifyCode = async (): Promise<void> => {
    if (!verificationCode) return;
    const phoneNumber = getValues('phoneNumber');
    try {
      const result = await verifyCode({ phoneNumber, code: verificationCode });
      if (result.message && result.message.includes('성공')) {
        setIsPhoneVerified(true);
        setPhoneVerificationButtonText('인증 완료');
        // 인증 성공 시 타이머 중지
        if (timerRef.current !== null) clearInterval(timerRef.current);
      } else {
        setPhoneVerificationButtonText('인증 실패');
        setIsPhoneVerified(false);
      }
    } catch (err: unknown) {
      setPhoneVerificationButtonText('인증 실패');
      setIsPhoneVerified(false);
    }
  };

  const handleMelpickAddressCheck = async (): Promise<void> => {
    const valid = await trigger('melpickAddress');
    if (!valid) return;
    try {
      const result = await checkWebpage(melpickAddress);
      if (result.isAvailable) {
        setMelpickAddressButtonText('인증 완료');
        setIsMelpickAddressChecked(true);
      } else {
        setMelpickAddressButtonText('인증 실패');
        setIsMelpickAddressChecked(false);
      }
    } catch (err: unknown) {
      setMelpickAddressButtonText('인증 실패');
      setIsMelpickAddressChecked(false);
    }
  };

  // --- 최종 전체 검증 및 회원가입 제출 (회원가입 버튼을 통해 검증 결과를 보여줌) ---
  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    if (data.password !== data.passwordConfirm) {
      setSignupResult('비밀번호가 일치하지 않습니다.');
      setIsSignupSuccess(false);
      setShowSignupResultModal(true);
      return;
    }
    if (!isEmailChecked) {
      setSignupResult('이메일 중복확인을 완료해주세요.');
      setIsSignupSuccess(false);
      setShowSignupResultModal(true);
      return;
    }
    if (!isNicknameChecked) {
      setSignupResult('닉네임 중복확인을 완료해주세요.');
      setIsSignupSuccess(false);
      setShowSignupResultModal(true);
      return;
    }
    if (!isPhoneVerified) {
      setSignupResult('본인 인증을 완료해주세요.');
      setIsSignupSuccess(false);
      setShowSignupResultModal(true);
      return;
    }
    if (!isMelpickAddressChecked) {
      setSignupResult('멜픽 주소 검증을 완료해주세요.');
      setIsSignupSuccess(false);
      setShowSignupResultModal(true);
      return;
    }

    const formattedData = {
      email: data.email,
      password: data.password,
      name: data.name,
      nickname: data.nickname,
      birthdate: `${data.birthYear}-01-01`,
      address: `${data.region} ${data.district}`,
      phoneNumber: data.phoneNumber,
      gender: gender === '여성' ? 'female' : 'male',
      instagramId: '',
      agreeToTerms: true,
      agreeToPrivacyPolicy: true,
    };

    try {
      const response = await signUpUser(formattedData);
      setSignupResult(
        '🎉 회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.'
      );
      setIsSignupSuccess(true);
      setShowSignupResultModal(true);
    } catch (err: unknown) {
      setSignupResult(
        err instanceof Error
          ? '회원가입 중 오류가 발생했습니다: ' + err.message
          : '회원가입 중 오류가 발생했습니다.'
      );
      setIsSignupSuccess(false);
      setShowSignupResultModal(true);
    }
  };

  const handleSignupResultModalClose = () => {
    setShowSignupResultModal(false);
    if (isSignupSuccess) {
      navigate('/login');
    }
  };

  const handleGenderChange = (selected: string): void => {
    setGender(selected);
    setSelectedGenderButton(selected);
  };

  // 전화번호 인풋 필드 수정 시 인증 상태 초기화 처리
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/[^0-9]/g, '')
      .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    e.target.value = value;
    resetVerificationState('phoneNumber');
  };

  // 이메일, 닉네임, 멜픽주소 필드 변경 시 인증 상태 초기화 처리
  const handleInputChange =
    (field: 'email' | 'nickname' | 'melpickAddress') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      resetVerificationState(field);
      if (field === 'melpickAddress') {
        setMelpickAddress(e.target.value);
      }
    };

  return (
    <ThemeProvider theme={Theme}>
      <FormProvider {...methods}>
        <Container>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <AgreementSection />
            <InputField
              label='계정(이메일)'
              id='email'
              type='text'
              error={errors.email}
              placeholder='계정을 입력하세요'
              buttonLabel={emailButtonText}
              {...register('email')}
              onChange={handleInputChange('email')}
              required
              maxLength={50}
              onButtonClick={handleEmailCheck}
            />
            <InputField
              label='비밀번호(숫자, 문자를 조합하여 8자리 이상 입력하세요)'
              id='password'
              type='password'
              placeholder='비밀번호를 입력하세요'
              error={errors.password}
              {...register('password')}
              required
              maxLength={20}
              autoComplete='current-password'
            />
            <InputField
              label='비밀번호 확인'
              id='passwordConfirm'
              type='password'
              placeholder='비밀번호를 한번 더 입력하세요'
              error={errors.passwordConfirm}
              {...register('passwordConfirm')}
              required
              maxLength={20}
            />
            <InputField
              label='닉네임(8글자 이내)'
              id='nickname'
              type='text'
              placeholder='닉네임을 입력하세요'
              error={errors.nickname}
              {...register('nickname')}
              onChange={handleInputChange('nickname')}
              required
              maxLength={8}
              buttonLabel={nicknameButtonText}
              onButtonClick={handleNicknameCheck}
            />
            <RowLabel>
              <InputField
                label='이름'
                id='name'
                type='text'
                placeholder='이름을 입력하세요'
                error={errors.name}
                {...register('name')}
                required
                maxLength={5}
              />
              <InputField
                label='태어난 해'
                id='birthYear'
                as={CustomSelect}
                error={errors.birthYear}
                required
                {...register('birthYear')}
              >
                <option value='' disabled>
                  태어난 해를 선택하세요
                </option>
                {Array.from({ length: 100 }, (_, i) => 2023 - i).map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </InputField>
            </RowLabel>
            <GenderField>
              <InputFieldLabel>성별</InputFieldLabel>
              <GenderRow>
                <GenderButton
                  type='button'
                  selected={gender === '여성'}
                  onClick={() => handleGenderChange('여성')}
                  isSelected={selectedGenderButton === '여성'}
                >
                  여성
                </GenderButton>
                <GenderButton
                  type='button'
                  selected={gender === '남성'}
                  onClick={() => handleGenderChange('남성')}
                  isSelected={selectedGenderButton === '남성'}
                >
                  남성
                </GenderButton>
              </GenderRow>
            </GenderField>
            <PhoneField>
              <InputField
                label='전화번호(11자를 입력하세요)'
                id='phoneNumber'
                type='text'
                placeholder='전화번호를 입력하세요'
                error={errors.phoneNumber}
                {...register('phoneNumber')}
                required
                maxLength={11}
                onInput={handlePhoneNumberChange}
                buttonLabel='본인인증'
                onButtonClick={handleSendVerification}
              />
            </PhoneField>
            {isPhoneVerificationSent && (
              <VerificationWrapper>
                <VerificationLabel>인증번호 입력</VerificationLabel>
                <VerificationRow>
                  <VerificationContainer>
                    <VerificationInput
                      type='text'
                      placeholder='인증번호를 입력하세요'
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <VerificationBtn onClick={handleVerifyCode}>
                      {phoneVerificationButtonText}
                    </VerificationBtn>
                  </VerificationContainer>
                  {/* 인증이 완료되지 않았을 때만 타이머 표시 */}
                  {!isPhoneVerified && (
                    <TimerDisplay>{formatTime(timer)}</TimerDisplay>
                  )}
                </VerificationRow>
              </VerificationWrapper>
            )}
            <RowLabel>
              <InputField
                label='지역'
                id='region'
                as={CustomSelect}
                error={errors.region}
                required
                {...register('region')}
              >
                <option value='' disabled>
                  지역을 선택하세요
                </option>
                {Object.keys(regionDistrictData).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </InputField>
              <InputField
                label='구'
                id='district'
                as={CustomSelect}
                error={errors.district}
                required
                {...register('district')}
              >
                <option value='' disabled>
                  구를 선택하세요
                </option>
                {getValues('region') &&
                regionDistrictData[getValues('region')] ? (
                  regionDistrictData[getValues('region')].map(
                    (district: string) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    )
                  )
                ) : (
                  <option value=''>지역을 먼저 선택하세요</option>
                )}
              </InputField>
            </RowLabel>
            <InputField
              label='멜픽 주소설정(영문, 숫자 12글자 이내)'
              id='melpickAddress'
              type='text'
              placeholder='멜픽 주소를 입력하세요'
              error={errors.melpickAddress}
              {...register('melpickAddress')}
              onChange={handleInputChange('melpickAddress')}
              value={melpickAddress}
              buttonLabel={melpickAddressButtonText}
              buttonColor='yellow'
              required
              maxLength={12}
              onButtonClick={handleMelpickAddressCheck}
              prefix='melpick.com/'
            />
            <BlackContainer />
            <BottomBar
              imageSrc={ResetButtonIcon}
              buttonText={isSubmitting ? '가입 중...' : '회원가입'}
              type='submit'
              disabled={isSubmitting}
            />
          </Form>
        </Container>
      </FormProvider>

      <ReusableModal
        isOpen={showSignupResultModal}
        onClose={handleSignupResultModalClose}
        title='회원가입 결과'
      >
        {signupResult}
      </ReusableModal>
    </ThemeProvider>
  );
};

export default Signup;

/* 스타일 정의 */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const RowLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const GenderField = styled.div`
  width: 100%;
  height: 67px;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const InputFieldLabel = styled.label`
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.black};
  font-weight: 700;
  font-size: 11px;
  line-height: 11px;
`;

const GenderRow = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-between;
`;

const GenderButton = styled.button<{ selected: boolean; isSelected: boolean }>`
  flex: 1;
  border: ${({ isSelected }) => (isSelected ? '2px solid #f6ae24' : 'none')};
  border-radius: 10px;
  background-color: ${({ selected }) => (selected ? '#FFFFFF' : '#EEEEEE')};
  color: ${({ selected }) => (selected ? '#000000' : '#999999')};
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    border 0.3s ease,
    color 0.3s ease;
  &:hover {
    border: 2px solid #f6ae24;
  }
  &:first-child {
    border-radius: 10px 0 0 10px;
  }
  &:last-child {
    border-radius: 0 10px 10px 0;
  }
`;

const PhoneField = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  input {
    flex: 1;
    padding-right: 120px;
  }
`;

const BlackContainer = styled.div`
  margin-bottom: 100px;
`;

const VerificationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const VerificationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const VerificationLabel = styled.label`
  font-size: 13px;
  font-weight: bold;
`;

const VerificationContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  height: 40px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  overflow: hidden;
`;

const VerificationInput = styled.input`
  flex: 1;
  height: 100%;
  padding: 0 10px;
  font-size: 14px;
  border: none;
  outline: none;
`;

const VerificationBtn = styled.button`
  height: 40px;
  width: 100px;
  background-color: #000;
  color: #fff;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const TimerDisplay = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
