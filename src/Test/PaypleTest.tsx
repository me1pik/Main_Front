import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

declare global {
  interface Window {
    PaypleCpayAuthCheck?: (data: any) => void;
    PCD_PAY_CALLBACK?: (result: any) => void;
  }
}

const PaypleTest: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const registerCard = useCallback(async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const params = new URLSearchParams({
        userId: '70',
        userName: '황민서',
        userEmail: 'seehm1541@gmail.com',
      });

      const url = `https://api.stylewh.com/payple/card-register-data?${params}`;
      const res = await fetch(url);
      const data = await res.json();

      if (typeof window.PaypleCpayAuthCheck !== 'function') {
        throw new Error('Payple SDK 준비 오류: PaypleCpayAuthCheck 함수가 없음');
      }

      window.PaypleCpayAuthCheck({
        ...data,
        PCD_PAY_WORK: 'CERTPAY', // 카드 등록 + 결제
        PCD_SIMPLE_FLAG: 'Y',
        PCD_PAYER_AUTHTYPE: 'pwd',
        PCD_PAY_GOODS: '카드 등록 테스트 결제',
        PCD_PAY_TOTAL: 100,
      });
    } catch (e) {
      console.error('[🔥] 카드 등록 오류:', e);
      setError('카드 등록 중 오류 발생');
    }
  }, []);

  useEffect(() => {
    window.PCD_PAY_CALLBACK = async (result: any) => {
      console.log('[✅ Payple 결과 수신]', result);

      try {
        const res = await fetch('https://api.stylewh.com/payple/simple-pay-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payerId: result.PCD_PAYER_ID,
            payReqKey: result.PCD_PAY_REQKEY,
            authKey: result.PCD_AUTH_KEY,
            goods: result.PCD_PAY_GOODS,
            amount: Number(result.PCD_PAY_TOTAL),
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setSuccessMessage(data.message || '카드 등록 및 결제 성공');
        } else {
          throw new Error(data.message || '결제 처리 실패');
        }
      } catch (e: any) {
        console.error('[🔥] 서버 전송 오류:', e);
        setError('백엔드 처리 중 오류: ' + e.message);
      }
    };
  }, []);

  return (
    <SContainer>
      <STitle>Payple 테스트</STitle>
      <SButton onClick={registerCard}>카드 등록 및 결제하기</SButton>
      {error && <SMessage type="error">{error}</SMessage>}
      {successMessage && <SMessage>{successMessage}</SMessage>}
    </SContainer>
  );
};

export default PaypleTest;

// 스타일
const SContainer = styled.div`
  max-width: 480px;
  margin: 40px auto;
  padding: 24px;
  text-align: center;
`;

const STitle = styled.h1`
  margin-bottom: 24px;
  font-size: 1.5rem;
`;

const SButton = styled.button`
  margin: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  color: white;
  background: #fa9a00;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const SMessage = styled.p<{ type?: 'error' }>`
  margin-top: 16px;
  color: ${({ type }) => (type === 'error' ? '#d32f2f' : '#2e7d32')};
`;
