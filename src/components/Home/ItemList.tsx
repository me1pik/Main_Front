import React, { useRef, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import ItemCard from './ItemCard';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

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

const GRID_GAP = 16; // grid gap(px)
const ASPECT_RATIO = 2 / 3; // width:height
const MIN_HEIGHT = 340; // 카드 최소 높이(px)

const ItemList: React.FC<ItemListProps> = ({
  items,
  columns = 5,
  onItemClick,
  onDelete,
}) => {
  const handleOpen = onItemClick ?? (() => {});
  const handleDelete = onDelete ?? (() => {});

  // 컨테이너 width 측정
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1100);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      setContainerWidth(containerRef.current!.offsetWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // 한 칸의 width/height 계산
  const totalGap = (columns - 1) * GRID_GAP;
  const cellWidth = Math.floor((containerWidth - totalGap) / columns);
  const cellHeight = Math.max(Math.round(cellWidth / ASPECT_RATIO), MIN_HEIGHT);

  // 행(row) 개수
  const rowCount = Math.ceil(items.length / columns);

  // 각 row(행) 렌더러
  const Row = ({ index, style }: ListChildComponentProps) => {
    const startIdx = index * columns;
    const rowItems = items.slice(startIdx, startIdx + columns);
    return (
      <div style={{ ...style, width: '100%' }}>
        <ItemsWrapper columns={columns}>
          {rowItems.map((item) => (
            <ItemCard
              key={item.id}
              {...item}
              onOpenModal={handleOpen}
              onDelete={handleDelete}
            />
          ))}
        </ItemsWrapper>
      </div>
    );
  };

  // 전체 리스트 높이 계산 (최대 800px)
  const listHeight = Math.min(rowCount * (cellHeight + GRID_GAP), 800);

  return (
    <ListContainer ref={containerRef}>
      <List
        height={listHeight}
        itemCount={rowCount}
        itemSize={cellHeight + GRID_GAP}
        width={containerWidth}
        style={{ overflowX: 'hidden' }}
      >
        {Row}
      </List>
    </ListContainer>
  );
};

export default ItemList;

const ListContainer = styled.div`
  background-color: #fff;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
`;

const ItemsWrapper = styled.div<{ columns: number }>`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(${({ columns }) => columns}, minmax(0, 1fr));
`;
