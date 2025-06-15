import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AddToCartButton from '../components/AddToCartButton';
import { toast } from 'react-toastify';
import { getProductById } from '../store/productSlice';

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  margin-bottom: 2rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e9ecef;
    transform: translateY(-1px);
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  margin: 0 0 1rem 0;
  color: #2c3e50;
`;

const ProductBrand = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const RatingStars = styled.div`
  color: #ffc107;
  margin-right: 0.5rem;
`;

const ReviewCount = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const PriceContainer = styled.div`
  margin: 1.5rem 0;
`;

const CurrentPrice = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2e7d32;
  margin-right: 1rem;
`;

const OriginalPrice = styled.span`
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
  margin-right: 1rem;
`;

const DiscountBadge = styled.span`
  background: #ffeb3b;
  color: #333;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const Description = styled.div`
  margin: 1.5rem 0;
  line-height: 1.6;
  color: #444;
`;

const VariantSelector = styled.div`
  margin: 1.5rem 0;
`;

const VariantLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

const VariantOptions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const VariantOption = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: ${props => props.$selected ? '#2e7d32' : 'white'};
  color: ${props => props.$selected ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2e7d32;
  }
`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const renderRatingStars = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} style={{ opacity: 0.2 }} />);
      }
    }

    return stars;
  };

  if (loading && !product) {
    return <div>Loading...</div>;
  }


  if (!product) {
    return <div>Product not found</div>;
  }

  const variant = product.variants?.[selectedVariant];
  
  if (!variant) {
    return <div>No variants available for this product</div>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
        {t('common.back', 'Back to Shop')}
      </BackButton>

      <ProductContainer>
        <ProductImage>
          <img 
            src={variant.image || product.mainImage} 
            alt={product.name} 
          />
        </ProductImage>

        <div>
          <ProductTitle>{product.name}</ProductTitle>
          <ProductBrand>by {product.brand}</ProductBrand>
          
          <RatingContainer>
            <RatingStars>
              {renderRatingStars(product.rating)}
            </RatingStars>
            <ReviewCount>({product.reviews} {t('reviews')})</ReviewCount>
          </RatingContainer>

          <Description>
            <h3>{t('product.description', 'Description')}</h3>
            <p>{product.description}</p>
          </Description>

          <VariantSelector>
            <VariantLabel>{t('product.weight', 'Weight')}</VariantLabel>
            <VariantOptions>
              {product.variants.map((v, index) => (
                <VariantOption
                  key={v._id}
                  $selected={selectedVariant === index}
                  onClick={() => setSelectedVariant(index)}
                >
                  {v.weight.value} {v.weight.unit}
                </VariantOption>
              ))}
            </VariantOptions>
          </VariantSelector>

          <PriceContainer>
            <CurrentPrice>₹{variant.discountPrice || variant.price}</CurrentPrice>
            {variant.originalPrice > variant.discountPrice && (
              <>
                <OriginalPrice>₹{variant.originalPrice}</OriginalPrice>
                <DiscountBadge>{t('product.save', 'Save')} {variant.savingsPercentage}</DiscountBadge>
              </>
            )}
          </PriceContainer>

          <div style={{ marginTop: '2rem' }}>
            <AddToCartButton 
              product={product} 
              weight={variant.weight}
              quantity={quantity}
              style={{ width: '100%', padding: '1rem' }}
            />
          </div>
        </div>
      </ProductContainer>
    </Container>
  );
};

export default ProductDetails;