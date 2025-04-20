// src/pages/Home/HomeDetail.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Spinner from '../../components/Spinner';
import { getProductInfo } from '../../api/upload/productApi';
import ImageSlider from '../../components/Home/HomeDetail/ImageSlider';
import ProductInfo from '../../components/Home/HomeDetail/ProductInfo';
import ProductOptions from '../../components/Home/HomeDetail/ProductOptions';
import PaymentMethod from '../../components/Home/HomeDetail/PaymentMethod';
import SizeInfo from '../../components/Home/HomeDetail/SizeInfo';
import MaterialInfo from '../../components/Home/HomeDetail/MaterialInfo';
import ProductDetails from '../../components/Home/HomeDetail/ProductDetails';
import BottomBar from '../../components/Home/HomeDetail/BottomBar';
import ServiceSelection from '../../components/Home/HomeDetail/ServiceSelection';
import RentalOptions from '../../components/Home/HomeDetail/RentalOptions';
import ShoppingBasket from '../../assets/Home/HomeDetail/ShoppingBasket.svg';
import { addToCloset } from '../../api/closet/closetApi';

interface ProductDetail {
  id: number;
  name: string;
  product_num: string;
  brand: string;
  mainImage: string;
  price: {
    originalPrice: number;
    discountRate: number;
    finalPrice: number;
  };
  product_img: string[];
  sizes: { size: string; measurements: Record<string, any> }[];
  size_picture: string;
  category: string;
  season: string;
  manufacturer: string;
  description: string;
  fabricComposition: Record<'겉감' | '안감' | '배색' | '부속', string>;
  elasticity: string;
  transparency: string;
  thickness: string;
  lining: string;
  fit: string;
  color: string;
}

type HomeDetailProps = { id?: string };

const HomeDetail: React.FC<HomeDetailProps> = ({ id: propId }) => {
  // ─── Hooks ───
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedService, setSelectedService] = useState('');

  // 데이터를 받아오고
  useEffect(() => {
    const id = propId || params.id;
    if (!id) return;
    getProductInfo(Number(id))
      .then((res) => setProduct(res.product))
      .catch((e) => console.error('제품 상세정보 로드 실패:', e))
      .finally(() => setLoading(false));
  }, [propId, params.id]);

  // 이미지를 안전하게 계산
  const images = useMemo(() => {
    if (
      product &&
      Array.isArray(product.product_img) &&
      product.product_img.length
    ) {
      return product.product_img;
    }
    return [product?.mainImage || '/default-image.jpg'];
  }, [product]);

  // 원단 정보를 네 카테고리별로 받음 (객체 그대로 전달)
  // 렌더링은 ProductDetails에서 처리

  // 슬라이드 핸들러
  const handleSwipeLeft = useCallback(() => {
    setCurrentImageIndex((p) => (p + 1) % images.length);
  }, [images.length]);

  const handleSwipeRight = useCallback(() => {
    setCurrentImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  }, [images.length]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const onMove = (ev: MouseEvent) => {
        if (Math.abs(ev.clientX - startX) > 50) {
          ev.clientX - startX > 0 ? handleSwipeRight() : handleSwipeLeft();
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
        }
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [handleSwipeLeft, handleSwipeRight]
  );

  // ─── Early Returns ───
  if (loading) return <Spinner />;
  if (!product) return <div>제품을 찾을 수 없습니다.</div>;

  // ─── 이벤트 핸들러 ───
  const handleCartClick = async () => {
    try {
      await addToCloset(product.id);
      alert('찜 목록에 추가되었습니다!');
      navigate('/my-closet');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        alert('이미 찜한 상품입니다.');
        navigate('/my-closet');
      } else if (status === 401) {
        alert('로그인이 필요합니다.');
      } else {
        alert('찜 추가 중 오류가 발생했습니다.');
        console.error(err);
      }
    }
  };

  const handleOrderClick = () => {
    console.log('🛒 주문하기');
  };

  // ─── 렌더링 데이터 준비 ───
  const productInfoItem = {
    brand: product.brand,
    product_num: product.product_num,
    name: product.name,
    originalPrice: product.price.originalPrice,
    discountPercent: product.price.discountRate,
    discountPrice: product.price.finalPrice,
  };

  const sizeOptions = product.sizes.map((s) => s.size);
  const colorOptions = product.color.split(',').map((c) => c.trim());

  const materialData = {
    두께감: product.thickness,
    신축성: product.elasticity,
    안감: product.lining,
    촉감: product.fit,
    비침: product.transparency,
  };

  const detailsData = {
    품번: product.product_num,
    계절감: product.season,
    제조사: product.manufacturer,
  };

  // ─── JSX ───
  return (
    <DetailContainer>
      <ImageSlider
        images={images}
        currentImageIndex={currentImageIndex}
        handleSwipeLeft={handleSwipeLeft}
        handleSwipeRight={handleSwipeRight}
        handleMouseDown={handleMouseDown}
      />

      <ContentContainer>
        <ProductInfo item={productInfoItem} />

        <ServiceSelectionWrapper>
          <ServiceSelection
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
        </ServiceSelectionWrapper>

        <ConditionalContainer>
          {selectedService === 'rental' && <RentalOptions />}
          {selectedService === 'purchase' && <PaymentMethod />}
          {selectedService === '' && <Message>서비스를 선택하세요</Message>}
        </ConditionalContainer>

        <Separator />

        <ProductOptions
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          sizeOptions={sizeOptions}
          colorOptions={colorOptions}
        />

        <Separator />

        <SizeInfo
          productSizes={product.sizes}
          size_picture={product.size_picture}
        />

        <Separator />

        <MaterialInfo materialData={materialData} />

        <Separator />

        <ProductDetails
          fabricComposition={product.fabricComposition}
          detailsData={detailsData}
        />
      </ContentContainer>

      <BottomBar
        cartIconSrc={ShoppingBasket}
        orderButtonLabel='제품 주문하기'
        onCartClick={handleCartClick}
        onOrderClick={handleOrderClick}
      />
    </DetailContainer>
  );
};

export default HomeDetail;

/* Styled Components */

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  padding-bottom: 80px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const ContentContainer = styled.div``;

const ServiceSelectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`;

const ConditionalContainer = styled.div`
  margin-top: 20px;
`;

const Separator = styled.div`
  border: 1px solid #e0e0e0;
  margin: 30px 0;
`;

const Message = styled.p`
  text-align: center;
  font-size: 16px;
  color: gray;
`;
