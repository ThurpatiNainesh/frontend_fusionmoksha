import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard2';

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
      <div style={{
        marginTop: '0.2rem',
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        height: '360px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src="/images/shop/shop_02.jpg" 
          alt="Hero Image" 
          style={{
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            position: 'absolute',
            zIndex: 1
          }} 
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 2
        }}></div>
        <h1 style={{
          color: '#fff',
          fontSize: 'clamp(1.75rem, 4vw, 3rem)',
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          zIndex: 3,
          textAlign: 'center'
        }}>{t('headingShop')}</h1>
      </div>
      <ProductGrid>
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            <h3>No products found</h3>
          </div>
        )}
      </ProductGrid>
      
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', gap: '0.5rem' }}>
          {/* Previous Page Button */}
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ddd',
              background: 'white',
              color: currentPage === 1 ? '#ccc' : '#333',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              borderRadius: '0',
            }}
          >
            &lt;
          </button>
          
          {/* Page Numbers */}
          {Array.from({ length: Math.min(4, pagination.totalPages) }, (_, i) => {
            // Show pages around current page
            let pageToShow;
            if (pagination.totalPages <= 4) {
              // If 4 or fewer pages, show all pages
              pageToShow = i + 1;
            } else if (currentPage <= 2) {
              // If on page 1 or 2, show pages 1-4
              pageToShow = i + 1;
            } else if (currentPage >= pagination.totalPages - 1) {
              // If on last or second-to-last page, show last 4 pages
              pageToShow = pagination.totalPages - 3 + i;
            } else {
              // Otherwise show current page, one before, and two after
              pageToShow = currentPage - 1 + i;
            }
            
            return (
              <button
                key={pageToShow}
                onClick={() => handlePageChange(pageToShow)}
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ddd',
                  background: pageToShow === currentPage ? '#1890ff' : 'white',
                  color: pageToShow === currentPage ? 'white' : '#333',
                  cursor: 'pointer',
                  borderRadius: '0',
                }}
              >
                {pageToShow}
              </button>
            );
          })}
          
          {/* Next Page Button */}
          <button
            onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage === pagination.totalPages}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ddd',
              background: 'white',
              color: currentPage === pagination.totalPages ? '#ccc' : '#333',
              cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
              borderRadius: '0',
            }}
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
};

export default Shop;
