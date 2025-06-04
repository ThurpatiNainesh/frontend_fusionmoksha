import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { products } from '../data/data';

// Helper function to generate star rating
const generateStars = (rating) => {
  const stars = Math.floor(rating);
  const half = rating - stars >= 0.5;
  const fullStars = '★'.repeat(stars);
  const halfStar = half ? '★' : '';
  const emptyStars = '☆'.repeat(5 - stars - (half ? 1 : 0));
  return `${fullStars}${halfStar}${emptyStars}`;
};

const HeroBanner = styled.section`
  width: 100%;
  min-height: 320px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/shop/shop_02.jpg');
  color: white;
  text-align: center;
  h1 {
    color: #fff;
    font-size: clamp(1.75rem, 4vw, 3rem);
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding-top: 2rem;
  overflow: visible;
`;

const ProductCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
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
  overflow: visible;
`;

const ProductName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

// const ProductPrice = styled.p` // Replaced by PriceContainer structure
//   color: #faad14;
//   font-weight: bold;
//   font-size: 1.2rem;
//   margin: 0.5rem 0;
// `;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem; /* Space between original and discounted price */
  margin: 0.5rem 0; /* Consistent with old ProductPrice margin */
`;

const OriginalPriceDisplay = styled.span`
  font-size: 0.9rem; 
  color: #777; /* Dimmer color for original price */
  text-decoration: line-through;
`;

const DiscountedPriceDisplay = styled.span`
  font-size: 1.2rem; /* Same as old ProductPrice */
  font-weight: bold; /* Same as old ProductPrice */
  color: #faad14; /* Same as old ProductPrice */
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

const AddToCartButton = styled.button`
  background-color: #faad14;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f5a623;
  }
`;

const Shop = () => {
  const { t } = useTranslation();
  return (
    <>
      <HeroBanner style={{ backgroundImage: 'url(/images/shop/shop_02.jpg)' }}>
        <h1>{t('headingShop')}</h1>
      </HeroBanner>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} to={`/shop/${product.id}`}>
            <ProductImage src={product.image} alt={product.name} style={{ position: 'relative', zIndex: 1 }} />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <PriceContainer>
                {product.originalPrice && product.originalPrice > product.price && (
                  <OriginalPriceDisplay>
                    ₹{product.originalPrice.toFixed(2)}
                  </OriginalPriceDisplay>
                )}
                <DiscountedPriceDisplay>
                  ₹{product.price.toFixed(2)}
                </DiscountedPriceDisplay>
              </PriceContainer>
              <ProductRating>
                {generateStars(product.rating)}
                <ReviewCount>({product.reviews} {t('reviews')})</ReviewCount>
              </ProductRating>
              <AddToCartButton>
                {t('addToCart')}
              </AddToCartButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </>
  );
};

export default Shop;
