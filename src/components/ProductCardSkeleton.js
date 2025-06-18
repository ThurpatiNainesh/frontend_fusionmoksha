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

const Card = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ImageContainer = styled.div`
  position: relative;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  overflow: hidden;
`;

const ProductCardSkeleton = () => {
  return (
    <Card>
      <ImageContainer>
        <ShimmerEffect 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '0'
          }}
        />
      </ImageContainer>
      
      <div style={{ padding: '1rem' }}>
        <ShimmerEffect height="20px" width="70%" margin="0 0 0.5rem 0" />
        <ShimmerEffect height="16px" width="40%" margin="0 0 1rem 0" />
        <ShimmerEffect height="24px" width="50%" margin="0 0 1rem 0" />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ShimmerEffect height="36px" width="120px" borderRadius="4px" />
          <ShimmerEffect height="36px" width="36px" borderRadius="50%" />
        </div>
      </div>
    </Card>
  );
};

export default ProductCardSkeleton;
