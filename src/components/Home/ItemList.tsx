import React from 'react';
import styled from 'styled-components';
import ItemCard from './ItemCard';

export interface UIItem {
  id: string;
  image: string;
  brand: string;
  description: string;
  price: number;
  discount: number;
  isLiked: boolean;
}

type ItemListProps = {
  items: UIItem[];
  columns?: number;
  onItemClick?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const ItemList: React.FC<ItemListProps> = ({
  items,
  columns = 5,
  onItemClick,
  onDelete,
}) => {
  const handleOpen = onItemClick ?? (() => {});
  const handleDelete = onDelete ?? (() => {});

  return (
    <ListContainer>
      <ItemsWrapper columns={columns}>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            {...item}
            onOpenModal={handleOpen}
            onDelete={handleDelete}
          />
        ))}
      </ItemsWrapper>
    </ListContainer>
  );
};

export default ItemList;

const ListContainer = styled.div`
  background-color: #fff;
  margin: 0 auto;
  box-sizing: border-box;
`;

const ItemsWrapper = styled.div<{ columns: number }>`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(${({ columns }) => columns}, minmax(0, 1fr));
`;
