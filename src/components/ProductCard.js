import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import AddToCartButton from './AddToCartButton';

const ProductCardContainer = styled(Link)`
  text-decoration: none;
  color: inherit;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: #f5f5f5;
  padding: 1rem;
`;

const ProductInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProductName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
`;

const ProductPrice = styled.p`
  color: #2e7d32;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0.5rem 0;
`;

const ProductRating = styled.div`
  color: #faad14;
  font-size: 1rem;
  margin: 0.5rem 0;
`;

const ReviewCount = styled.span`
  color: #666;
  font-size: 0.9rem;
  margin-left: 0.5rem;
`;

const generateStars = (rating) => {
  const stars = Math.floor(rating);
  const half = rating - stars >= 0.5;
  const fullStars = '★'.repeat(stars);
  const halfStar = half ? '★' : '';
  const emptyStars = '☆'.repeat(5 - stars - (half ? 1 : 0));
  return `${fullStars}${halfStar}${emptyStars}`;
};

const ProductCard = ({ product, className }) => {
  const { t } = useTranslation();
  const defaultVariant = product.defaultVariant || product.variants?.[0] || {};

  return (
    <ProductCardContainer to={`/shop/${product._id}`} className={className}>
      <ProductImage 
        src={defaultVariant.image || product.mainImage} 
        alt={product.name} 
      />
      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>
          ₹{defaultVariant.discountPrice || defaultVariant.price}
          {defaultVariant.originalPrice > defaultVariant.discountPrice && (
            <span style={{ textDecoration: 'line-through', color: '#999', marginLeft: '8px', fontSize: '0.9rem' }}>
              ₹{defaultVariant.originalPrice}
            </span>
          )}
        </ProductPrice>
        <ProductRating>
          {generateStars(product.rating || 0)}
          <ReviewCount>({product.reviews || 0} {t('reviews')})</ReviewCount>
        </ProductRating>
        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <AddToCartButton 
            product={product} 
            weight={defaultVariant.weight}
          />
        </div>
      </ProductInfo>
    </ProductCardContainer>
  );
};

export default ProductCard;
