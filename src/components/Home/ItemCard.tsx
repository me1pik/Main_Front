// src/components/ItemCard.tsx
import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { HeartIcon } from '../../assets/library/HeartIcon';
import { addToCloset, removeFromCloset } from '../../api/closet/closetApi';
import ReusableModal from '../ReusableModal2';

type ItemCardProps = {
  id: string;
  image: string;
  brand: string;
  description: string;
  price: number;
  discount: number;
  isLiked: boolean;
  onOpenModal: (id: string) => void;
  onDelete?: (id: string) => void;
};

type ConfirmAction = 'add' | 'remove' | null;

const heartbeat = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(1.4); }
  100% { transform: scale(1); }
`;

function ItemCard({
  id,
  image,
  brand,
  description,
  price,
  discount,
  isLiked: initialLiked,
  onOpenModal,
  onDelete,
}: ItemCardProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [animating, setAnimating] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const displayDescription = description.includes('/')
    ? description.split('/')[1]
    : description;

  const handleCardClick = () => onOpenModal(id);
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmAction(liked ? 'remove' : 'add');
  };

  const doAdd = async () => {
    setLiked(true);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    try {
      await addToCloset(+id);
    } catch (err: unknown) {
      setLiked(false);
      showError(err);
    }
  };

  const doRemove = async () => {
    setLiked(false);
    try {
      await removeFromCloset(+id);
      onDelete?.(id);
    } catch (err: unknown) {
      setLiked(true);
      showError(err);
    }
  };

  const showError = (err: unknown) => {
    let status;
    if (typeof err === 'object' && err !== null && 'response' in err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status = (err as any).response?.status;
    }
    const msg =
      status === 409
        ? '이미 찜한 상품입니다.'
        : status === 401
          ? '로그인이 필요합니다.'
          : '찜 처리 중 오류가 발생했습니다.';
    setErrorMsg(msg);
    setErrorModalOpen(true);
  };

  const closeConfirm = () => setConfirmAction(null);
  const handleConfirm = () => {
    closeConfirm();
    confirmAction === 'add' ? doAdd() : doRemove();
  };

  const modalTitle = confirmAction === 'add' ? '찜 등록 확인' : '삭제 확인';
  const modalMessage =
    confirmAction === 'add'
      ? '정말 이 상품을 내 옷장에 추가하시겠습니까?'
      : '정말 이 상품을 내 옷장에 삭제하시겠습니까?';

  return (
    <>
      <Card onClick={handleCardClick}>
        <ImageWrapper>
          <Image src={image.split('#')[0] || '/default.jpg'} alt={brand} />
          <LikeButton $animating={animating} onClick={handleLikeClick}>
            <HeartIcon filled={liked} />
          </LikeButton>
        </ImageWrapper>
        <Brand>{brand}</Brand>
        <Description>{displayDescription}</Description>
        <PriceWrapper>
          <PointBar />
          <OriginalPrice>{price.toLocaleString()}원</OriginalPrice>
          <SubPrice>
            <NowLabel>NOW</NowLabel>
            <DiscountLabel>{discount}%</DiscountLabel>
          </SubPrice>
        </PriceWrapper>
      </Card>

      <ReusableModal
        isOpen={confirmAction !== null}
        onClose={closeConfirm}
        onConfirm={handleConfirm}
        title={modalTitle}
      >
        <p>{modalMessage}</p>
      </ReusableModal>

      <ReusableModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title='오류'
      >
        <p>{errorMsg}</p>
      </ReusableModal>
    </>
  );
}

export default ItemCard;

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  margin-bottom: 12px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  min-height: 240px;
  background: #f5f5f5;
  border: 1px solid #ccc;

  overflow: hidden;
  @supports not (aspect-ratio: 2/3) {
    min-height: 240px;
    height: 360px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  min-height: 240px;
  aspect-ratio: 2/3;
  object-fit: cover;
  display: block;

  background: #f5f5f5;
`;

const LikeButton = styled.div<{ $animating: boolean }>`
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  padding: 2px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  /* 클릭으로 $animating=true 일 때 한 번 뛰기 */
  ${({ $animating }) =>
    $animating &&
    css`
      animation: ${heartbeat} 0.3s ease-out;
    `}

  /* 호버 시에도 계속 뛰는 효과 */
  &:hover {
    animation: ${heartbeat} 0.6s ease-out infinite;
    transform: scale(1.1);
  }

  & svg {
    width: 16px;
    height: 16px;
  }
`;

const Brand = styled.h3`
  margin: 10px 0 0 0;
  font-weight: 900;
  font-size: 10px;
  line-height: 11px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  margin: 5px 0 0 0;
  font-size: 11px;
  color: #999;
  margin-bottom: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 5px;

  position: relative;

  @media (max-width: 768px) {
    margin-top: 5px;
    margin-left: 5px;
  }
`;

const PointBar = styled.div`
  display: block;
  width: 2px;
  height: 16px;
  background: #f6ae24;
  border-radius: 2px;
  margin-right: 5px;
`;

const OriginalPrice = styled.span`
  font-weight: 900;
  font-size: 14px;
`;

const SubPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NowLabel = styled.span`
  font-size: 9px;
`;

const DiscountLabel = styled.span`
  font-weight: 800;
  font-size: 11px;
  color: #f6ae24;
`;
