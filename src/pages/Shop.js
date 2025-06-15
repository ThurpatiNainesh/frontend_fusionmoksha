import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AddToCartButton from '../components/AddToCartButton';
import { getProducts } from '../store/productSlice';

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
  min-height: 220px;
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

const ProductPrice = styled.p`
  color: #faad14;
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

const Shop = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { 
    products = [], 
    loading, 
    error,
    pagination = { currentPage: 1, totalPages: 1 }
  } = useSelector((state) => ({
    products: state.products.products,
    loading: state.products.loading,
    error: state.products.error,
    pagination: state.products.pagination
  }));

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getProducts({ page: currentPage, limit: 6 }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <h2>Error loading products</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <HeroBanner style={{ backgroundImage: 'url(/images/shop/shop_02.jpg)' }}>
        <h1>{t('headingShop')}</h1>
      </HeroBanner>
      <ProductGrid>
        {products && products.length > 0 ? (
          products.map((product) => {
            const defaultVariant = product.defaultVariant || {};
            return (
              <ProductCard key={product._id} to={`/shop/${product._id}`}>
                <ProductImage 
                  src={defaultVariant.image || product.mainImage} 
                  alt={product.name} 
                  style={{ position: 'relative', zIndex: 1 }} 
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
                  <AddToCartButton 
                    product={product} 
                    weight={defaultVariant.weight}
                  />
                </ProductInfo>
              </ProductCard>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            <h3>No products found</h3>
          </div>
        )}
      </ProductGrid>
      
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '0.5rem' }}>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              style={{
                padding: '0.5rem 1rem',
                margin: '0 0.25rem',
                border: '1px solid #ddd',
                background: pageNum === currentPage ? '#1890ff' : 'white',
                color: pageNum === currentPage ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Shop;
