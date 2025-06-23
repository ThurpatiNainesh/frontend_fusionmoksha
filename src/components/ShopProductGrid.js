import React from 'react';
import styled from 'styled-components';
import ProductCardSkeleton from './ProductCardSkeleton';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    padding: 1rem 0.5rem;
    gap: 1rem;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  @media (max-width: 576px) {
    gap: 0.75rem;
    padding: 0.75rem 0.5rem;
  }
`;

const ShopProductGrid = ({ count = 8 }) => {
  return (
    <Grid>
      {Array(count).fill().map((_, index) => (
        <div key={index} style={{ 
          scrollSnapAlign: 'start',
          flex: '0 0 auto',
          width: '85%',
          maxWidth: '300px',
          minWidth: '200px',
          padding: '0 0.25rem'
        }}>
          <ProductCardSkeleton />
        </div>
      ))}
    </Grid>
  );
};

export default ShopProductGrid;
