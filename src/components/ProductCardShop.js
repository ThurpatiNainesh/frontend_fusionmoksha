import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import AddToCartButton from './AddToCartButton';

const ProductCardShopContainer = styled.div`
  text-decoration: none;
  color: inherit;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  max-width: 300px;
  margin: 0 auto;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
  margin: 0;
  padding: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ProductInfo = styled.div`
  padding: 0.5rem;
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
  margin-bottom: 0.2rem;
`;

const generateStars = (rating) => {
  const stars = Math.floor(rating);
  const half = rating - stars >= 0.5;
  const fullStars = '★'.repeat(stars);
  const halfStar = half ? '★' : '';
  const emptyStars = '☆'.repeat(5 - stars - (half ? 1 : 0));
  return `${fullStars}${halfStar}${emptyStars}`;
};

const ProductCardShop = ({ product, className }) => {
  const { t } = useTranslation();
  const defaultVariant = product.variants?.[0] || {};
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  
  // Calculate rating percentage for stars
  const ratingPercentage = ((product.rating || 0) / 5) * 100;
  
  // Calculate discount percentage
  const discountPercentage = selectedVariant.originalPrice > 0 
    ? Math.round(((selectedVariant.originalPrice - (selectedVariant.discountPrice || selectedVariant.price)) / selectedVariant.originalPrice) * 100)
    : 0;

  // Handle variant change
  const handleVariantChange = (e) => {
    e.stopPropagation(); // Prevent event bubbling to parent
    const variantId = e.target.value;
    const variant = product.variants.find(v => v._id === variantId) || defaultVariant;
    setSelectedVariant(variant);
  };
  
  // Handle dropdown click to prevent navigation
  const handleDropdownClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <ProductCardShopContainer className={className}>
      <ProductImage 
        src={selectedVariant.image || product.mainImage} 
        alt={product.name} 
      />
      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        
        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '0.2rem 0', gap: '2px' }}>
          <span style={{ color: '#0F1111', fontSize: '0.9rem', fontWeight: '500' }}>
            {product.rating?.toFixed(1) || '0.0'}
          </span>
          <div style={{
            position: 'relative',
            display: 'inline-block',
            fontSize: '0.9rem',
            lineHeight: '1',
            color: '#ddd'
          }}>
            <span style={{ color: '#ddd' }}>★★★★★</span>
            <span style={{
              position: 'absolute',
              top: 0,
              left: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              width: `${ratingPercentage}%`,
              color: '#FFA41C'
            }}>
              ★★★★★
            </span>
          </div>
          <span style={{ 
            fontSize: '0.8rem', 
            color: '#007185',
            textDecoration: 'none'
          }}>
            ({product.reviews || 0})
          </span>
        </div>

        {/* Variant Dropdown */}
        {product.variants?.length > 0 && (
          <div style={{ margin: '0.3rem 0 0' }} onClick={handleDropdownClick}>
            <select 
              value={selectedVariant?._id || ''}
              onChange={handleVariantChange}
              onClick={handleDropdownClick}
              style={{
                padding: '0.25rem 1.8rem 0.25rem 0.8rem',
                borderRadius: '9999px',
                border: '1px solid #d5d9d9',
                background: '#f0f2f2',
                boxShadow: '0 1px 2px rgba(15,17,17,.15)',
                height: '32px',
                width: 'fit-content',
                minWidth: '140px',
                fontSize: '0.8rem',
                ':hover': {
                  backgroundColor: '#e3e6e6',
                  borderColor: '#d5d9d9'
                },
              }}
            >
              {product.variants.map(variant => (
                <option 
                  key={variant._id} 
                  value={variant._id}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#fff',
                    color: '#0f1111',
                    fontSize: '0.8rem'
                  }}
                >
                  {variant.weight?.value} {variant.weight?.unit}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price */}
        <div style={{ margin: '0.3rem 0' }}>
          <div style={{ 
            display: 'flex', 
            gap: '0.3rem', 
            margin: '0.2rem 0',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ 
                  fontSize: '1.15rem', 
                  fontWeight: 'bold',
                  color: 'black',
                  marginRight: '0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '0.6em',
                    marginRight: '2px',
                    position: 'relative',
                    top: '-0.1em'
                  }}>
                    ₹
                  </span>
                  {selectedVariant.discountPrice || selectedVariant.price}
                </span>
              </div>
              {selectedVariant.originalPrice > (selectedVariant.discountPrice || selectedVariant.price) && (
                <>
                  <span style={{
                    textDecoration: 'line-through',
                    color: '#999',
                    fontSize: '0.9rem',
                    marginRight: '0.5rem'
                  }}>
                    MRP ₹ {selectedVariant.originalPrice}
                  </span>
                  <span style={{
                    color: '#2e7d32',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    ({discountPercentage}% off)
                  </span>
                </>
              )}
            </div>
            <span style={{ 
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'flex-start',
              fontSize: '0.7em',
              color: '#2e7d32',
              fontWeight: '500',
              marginLeft: '2px',
              transform: 'translateY(0.2em)'
            }}>
              ₹
            </span>
          </div>
        </div>


        {/* Add to Cart Button */}
        <div style={{ marginTop: '0.3rem' }}>
          <AddToCartButton 
            product={product} 
            weight={selectedVariant.weight}
            variant={selectedVariant}
            style={{
              backgroundColor: '#FFD814',
              border: '1px solid #FCD200',
              borderRadius: '9999px',
              color: '#0F1111',
              cursor: 'pointer',
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: '500',
              height: '38px',
              lineHeight: '36px',
              padding: '0.4rem 1.2rem',
              fontSize: '0.9rem',
              minWidth: '120px',
              textAlign: 'center',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(15,17,17,.15)',
              transition: 'all 0.1s ease',
              ':hover': {
                backgroundColor: '#F7CA00',
                borderColor: '#F2C200',
                boxShadow: '0 2px 5px rgba(15,17,17,.15)'
              },
              ':active': {
                backgroundColor: '#F0B800',
                borderColor: '#008296',
                boxShadow: '0 0 0 3px #c8f3fa',
                outline: '0'
              }
            }}
          />
        </div>
      </ProductInfo>
    </ProductCardShopContainer>
  );
};

export default ProductCardShop;
