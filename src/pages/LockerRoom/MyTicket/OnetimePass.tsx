// // src/pages/OnetimePass.tsx
// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import { getUserTickets, TicketItem } from '../../../api/ticket/ticket'; // 실제 경로로 조정

// const OnetimePass: React.FC = () => {
//   const [ticket, setTicket] = useState<TicketItem | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getUserTickets();
//         const items: TicketItem[] = res.data;
//         if (items.length) {
//           // autoRenewal === false인 티켓만 필터링
//           const oneTimers = items.filter((item) => item.autoRenewal === false);
//           const tk = oneTimers.length > 0 ? oneTimers[0] : items[0];
//           setTicket(tk);
//         }
//       } catch (err) {
//         console.error('티켓 조회 실패', err);
//       }
//     })();
//   }, []);

//   const formatDate = (iso: string) => iso.slice(0, 10).replace(/-/g, '.');
//   const formatTime = (iso: string) => new Date(iso).toTimeString().slice(0, 8);

//   if (!ticket) {
//     return <Container>로딩 중...</Container>;
//   }

//   return (
//     <Container>
//       <ContentArea>
//         <Section>
//           <SectionTitle>이용 중인 이용권</SectionTitle>
//           <ReadOnlyBox>
//             <PassName>{ticket.ticketList.name}</PassName>
//           </ReadOnlyBox>
//         </Section>

//         <Section>
//           <SectionTitle>이용권 사용기간</SectionTitle>
//           <ReadOnlyBox>
//             {formatDate(ticket.startDate)} ~ {formatDate(ticket.endDate)}{' '}
//             <GrayText>(유효기간)</GrayText>
//           </ReadOnlyBox>
//         </Section>

//         <Section>
//           <SectionTitle>이용권 결제일시</SectionTitle>
//           <ReadOnlyBox>
//             {formatDate(ticket.purchasedAt)}{' '}
//             <GrayText>({formatTime(ticket.purchasedAt)})</GrayText>
//           </ReadOnlyBox>
//         </Section>

//         <Section>
//           <Row style={{ gap: '20px' }}>
//             <HalfSection>
//               <SectionTitle>이용권(매달) 결제금액</SectionTitle>
//               <ReadOnlyBox>
//                 <PriceText>
//                   {ticket.ticketList.price.toLocaleString()}원
//                 </PriceText>
//               </ReadOnlyBox>
//             </HalfSection>
//             <HalfSection>
//               <SectionTitle>다음 결제일</SectionTitle>
//               <ReadOnlyBox>
//                 {ticket.nextBillingDate
//                   ? formatDate(ticket.nextBillingDate)
//                   : '—'}
//               </ReadOnlyBox>
//             </HalfSection>
//           </Row>
//         </Section>

//         <Section>
//           <SectionTitle>시즌 자동연장</SectionTitle>
//           <InFieldBoxGray>
//             <Row>
//               <SeasonLabel>다음 시즌</SeasonLabel>
//               <Pipe> | </Pipe>
//               <SeasonValue>2025 SUMMER</SeasonValue>
//             </Row>
//           </InFieldBoxGray>
//         </Section>

//         <Divider />

//         <NoticeArea>
//           <NoticeText>
//             ※ 이용 중인 구독권은 시즌 중간에{' '}
//             <OrangeBold>취소가 불가</OrangeBold>합니다.
//           </NoticeText>
//           <NoticeText>
//             만약, 취소가 필요할 경우는 서비스팀에 문의해 주시기 바랍니다.
//           </NoticeText>
//         </NoticeArea>
//       </ContentArea>
//     </Container>
//   );
// };

// export default OnetimePass;

// // 스타일 정의
// const Container = styled.div`
//   position: relative;
//   background: #ffffff;
//   margin: 0 auto;
//   display: flex;
//   justify-content: center;
//   padding: 1rem;
//   max-width: 600px;
// `;

// const ContentArea = styled.div`
//   margin-bottom: 30px;
//   display: flex;
//   flex-direction: column;
//   width: 100%;
// `;

// const Section = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin-bottom: 30px;
// `;

// const Divider = styled.div`
//   width: 100%;
//   height: 1px;
//   background: #dddddd;
//   margin-bottom: 30px;
// `;

// const SectionTitle = styled.div`
//   font-weight: 700;
//   font-size: 10px;
//   line-height: 11px;
//   color: #000000;
//   margin-bottom: 10px;
// `;

// const Row = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// `;

// const HalfSection = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex: 1;
// `;

// const ReadOnlyBox = styled.div`
//   box-sizing: border-box;
//   width: 100%;
//   height: 57px;
//   border: 1px solid #eeeeee;
//   border-radius: 4px;
//   display: flex;
//   align-items: center;
//   padding: 0 16px;
//   font-weight: 800;
//   font-size: 13px;
//   line-height: 14px;
//   color: #000000;
// `;

// const PriceText = styled.span`
//   font-weight: 900;
//   font-size: 13px;
//   line-height: 14px;
//   color: #000000;
// `;

// const PassName = styled.span`
//   font-weight: 800;
//   font-size: 13px;
//   line-height: 14px;
//   color: #000000;
// `;

// const InFieldBoxGray = styled.div`
//   box-sizing: border-box;
//   width: 100%;
//   height: 57px;
//   border: 1px solid #dddddd;
//   border-radius: 4px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0 16px;
// `;

// const Pipe = styled.span`
//   font-weight: 400;
//   font-size: 13px;
//   line-height: 14px;
//   color: #cccccc;
//   margin: 0 4px;
// `;

// const SeasonLabel = styled.span`
//   font-weight: 400;
//   font-size: 13px;
//   line-height: 14px;
//   color: #cccccc;
//   margin-right: 4px;
// `;

// const SeasonValue = styled.span`
//   font-weight: 800;
//   font-size: 13px;
//   line-height: 14px;
//   color: #cccccc;
//   margin-left: 4px;
// `;

// const NoticeArea = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
// `;

// const NoticeText = styled.p`
//   margin: 0;
//   font-weight: 400;
//   font-size: 12px;
//   line-height: 13px;
//   color: #999999;
// `;

// const OrangeBold = styled.span`
//   font-weight: 700;
//   font-size: 12px;
//   line-height: 13px;
//   color: #f6ae24;
// `;

// const GrayText = styled.span`
//   padding-left: 3px;
//   font-weight: 700;
//   font-size: 13px;
//   line-height: 14px;
//   color: #999999;
// `;
