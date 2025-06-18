import React from 'react';
import styled from 'styled-components';
import ProductCardSkeleton from './ProductCardSkeleton';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const ShopProductGrid = ({ count = 8 }) => {
  return (
    <Grid>
      {Array(count).fill().map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </Grid>
  );
};

export default ShopProductGrid;
