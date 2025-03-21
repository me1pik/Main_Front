import React from 'react';
import styled from 'styled-components';

interface FixedBottomBarProps {
  text: string;
  color?: 'yellow' | 'black';
  onClick?: () => void;
}

const FixedBottomBar: React.FC<FixedBottomBarProps> = ({
  text,
  color = 'black',
  onClick,
}) => {
  return (
    <BottomBar>
      <SettleButton color={color} onClick={onClick}>
        {text}
      </SettleButton>
    </BottomBar>
  );
};

export default FixedBottomBar;

const BottomBar = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
  max-width: 600px;
  background: #eeeeee;
  padding: 15px 0 34px 0;
  text-align: center;
`;

const SettleButton = styled.button<{ color: 'yellow' | 'black' }>`
  width: 90%;
  padding: 20px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${({ color }) =>
    color === 'yellow' ? '#F6AE24' : 'black'};
  color: ${({ color }) => (color === 'yellow' ? 'white' : 'white')};
  border: none;

  font-weight: 800;
  font-size: 16px;
  line-height: 18px;
  /* identical to box height */
  text-align: center;

  color: #ffffff;
`;
