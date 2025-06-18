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

const Container = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
  
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  gap: 2rem;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainImageSkeleton = styled(ShimmerEffect)`
  width: 100%;
  height: 400px;
  border-radius: 8px;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ThumbnailSkeleton = styled(ShimmerEffect)`
  width: 80px;
  height: 80px;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TabsContainer = styled.div`
  margin-top: 3rem;
  width: 100%;
`;

const TabHeaderSkeleton = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
`;

const TabSkeleton = styled(ShimmerEffect)`
  width: 120px;
  height: 40px;
  border-radius: 4px;
`;

const ProductDetailsSkeleton = () => {
  return (
    <Container>
      {/* Hero Banner Skeleton */}
      <ShimmerEffect height="360px" width="100%" />
      
      <ContentWrapper>
        {/* Title Skeleton */}
        <ShimmerEffect height="40px" width="60%" margin="2rem auto" />
        
        <ProductContainer>
          {/* Left side - Product Images */}
          <ImageContainer>
            <MainImageSkeleton />
            <ThumbnailsContainer>
              <ThumbnailSkeleton />
              <ThumbnailSkeleton />
              <ThumbnailSkeleton />
              <ThumbnailSkeleton />
            </ThumbnailsContainer>
          </ImageContainer>
          
          {/* Right side - Product Info */}
          <ProductInfo>
            <ShimmerEffect height="32px" width="80%" />
            <ShimmerEffect height="24px" width="40%" />
            <ShimmerEffect height="20px" width="60%" />
            <ShimmerEffect height="20px" width="70%" />
            
            {/* Price */}
            <ShimmerEffect height="36px" width="30%" margin="1rem 0" />
            
            {/* Variant selector */}
            <ShimmerEffect height="24px" width="40%" margin="0.5rem 0" />
            <ShimmerEffect height="48px" width="100%" />
            
            {/* Quantity */}
            <ShimmerEffect height="24px" width="30%" margin="1rem 0 0.5rem 0" />
            <ShimmerEffect height="48px" width="40%" />
            
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <ShimmerEffect height="48px" width="48%" />
              <ShimmerEffect height="48px" width="48%" />
            </div>
          </ProductInfo>
        </ProductContainer>
        
        {/* Tabs */}
        <TabsContainer>
          <TabHeaderSkeleton>
            <TabSkeleton />
            <TabSkeleton />
            <TabSkeleton />
          </TabHeaderSkeleton>
          
          {/* Tab content */}
          <div>
            <ShimmerEffect height="16px" width="100%" margin="0.5rem 0" />
            <ShimmerEffect height="16px" width="95%" margin="0.5rem 0" />
            <ShimmerEffect height="16px" width="90%" margin="0.5rem 0" />
            <ShimmerEffect height="16px" width="97%" margin="0.5rem 0" />
            <ShimmerEffect height="16px" width="85%" margin="0.5rem 0" />
          </div>
        </TabsContainer>
      </ContentWrapper>
    </Container>
  );
};

export default ProductDetailsSkeleton;
