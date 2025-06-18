import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const ShimmerEffect = styled.div`
  background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: ${props => props.borderRadius || '4px'};
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '0'};
`;

const CartItemContainer = styled.div`
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  gap: 1rem;
`;

const CartItemImageSkeleton = styled(ShimmerEffect)`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  flex-shrink: 0;
`;

const CartItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CartDrawerSkeleton = () => {
  return (
    <div style={{ padding: '0.5rem' }}>
      {/* Cart Items */}
      {[...Array(3)].map((_, index) => (
        <CartItemContainer key={index}>
          <CartItemImageSkeleton />
          <CartItemDetails>
            <ShimmerEffect height="20px" width="80%" />
            <ShimmerEffect height="16px" width="40%" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <ShimmerEffect height="24px" width="30%" />
              <ShimmerEffect height="32px" width="100px" borderRadius="4px" />
            </div>
          </CartItemDetails>
        </CartItemContainer>
      ))}

      {/* Cart Summary */}
      <div style={{ padding: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <ShimmerEffect height="18px" width="30%" />
          <ShimmerEffect height="18px" width="20%" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <ShimmerEffect height="18px" width="25%" />
          <ShimmerEffect height="18px" width="15%" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', marginBottom: '1rem' }}>
          <ShimmerEffect height="24px" width="35%" />
          <ShimmerEffect height="24px" width="25%" />
        </div>

        {/* Buttons */}
        <div style={{ marginTop: '1.5rem' }}>
          <ShimmerEffect height="48px" width="100%" borderRadius="4px" margin="0 0 1rem 0" />
          <ShimmerEffect height="48px" width="100%" borderRadius="4px" />
        </div>
      </div>
    </div>
  );
};

export default CartDrawerSkeleton;
