import styled from 'styled-components';
import ShoppingBasket from '../../../assets/Home/HomeDetail/ShoppingBasket.svg';

const BottomBar = () => {
  return (
    <BottomBarContainer>
      <CartButton>
        <CartImage src={ShoppingBasket} alt='Shopping Basket' />
      </CartButton>
      <OrderButton>제품 주문하기</OrderButton>
    </BottomBarContainer>
  );
};

export default BottomBar;

const BottomBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #eeeeee;

  z-index: 9998;

  max-width: 600px;

  padding: 10px 0 34px 0;
  text-align: center;
  gap: 21px;
`;

const CartButton = styled.button`
  width: 75px;
  height: 56px;
  background-color: #eeeeee;
  border: 1px solid #dddddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  margin-left: 27px;
`;

const CartImage = styled.img`
  width: 41px;
  height: 34px;
`;

const OrderButton = styled.button`
  width: 100%;
  height: 56px;
  background-color: #f6ae24;
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;

  margin-right: 27px;
`;
