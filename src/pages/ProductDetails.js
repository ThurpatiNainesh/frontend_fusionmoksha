import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { getProductById } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import ProductCardShop from '../components/ProductCardShop';
import ProductDetailsSkeleton from '../components/ProductDetailsSkeleton';

// Styled Components
const Container = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
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

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (max-width: 576px) {
    padding: 1rem 0.5rem;
  }
`;

const ProductContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (max-width: 576px) {
    padding: 1rem 0.5rem;
  }
`;

const ProductBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  @media (max-width: 576px) {
    padding: 1rem;
    gap: 1rem;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 576px) {
    gap: 0.5rem;
  }
`;

const ZoomableImageContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  cursor: zoom-in;
  
  @media (max-width: 576px) {
    border-radius: 4px;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.1s ease-out;
  transform-origin: ${props => props.transformOrigin || 'center center'};
  transform: scale(${props => props.isZoomed ? 2 : 1});
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  @media (max-width: 576px) {
    gap: 0.25rem;
    justify-content: center;
    margin-top: 0.5rem;
    
    &::-webkit-scrollbar {
      height: 3px;
    }
  }
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${props => props.selected ? '#8c8c8c' : 'transparent'};
  
  &:hover {
    border-color: #8c8c8c;
  }
  
  @media (max-width: 576px) {
    width: 60px;
    height: 60px;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 576px) {
    gap: 0.75rem;
  }
`;

const ProductTitle = styled.h3`
  font-size: 1.75rem;
  margin: 0;
  color: #333;
  
  @media (max-width: 576px) {
    font-size: 1.4rem;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 0;
  
  @media (max-width: 576px) {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

const StarContainer = styled.div`
  position: relative;
  display: inline-block;
  color: #d3d3d3;
  height: 20px;
`;

const StarFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
  color: #faad14;
  height: 20px;
  width: ${props => props.width};
`;

const RatingNumber = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
  
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const ReviewCount = styled.span`
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  
  @media (max-width: 576px) {
    font-size: 0.8rem;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
  flex-wrap: wrap;
`;

const Price = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  
  @media (max-width: 576px) {
    font-size: 1.3rem;
  }
`;

const OriginalPrice = styled.span`
  font-size: 1.1rem;
  text-decoration: line-through;
  color: #999;
  
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const Savings = styled.span`
  font-size: 0.9rem;
  color: #4caf50;
  
  @media (max-width: 576px) {
    font-size: 0.85rem;
    width: 100%;
    margin-top: 0.25rem;
  }
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 1rem 0;
  
  @media (max-width: 576px) {
    margin: 0.5rem 0;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const VariantSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #8c8c8c;
  border-radius: 4px;
  margin: 1rem 0;
  width: 100%;
  max-width: 300px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%238c8c8c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 1rem auto;
  
  &:focus {
    outline: none;
    border-color: #555;
  }
  
  @media (max-width: 576px) {
    padding: 0.6rem 0.8rem;
    margin: 0.5rem 0;
    font-size: 0.95rem;
    max-width: 100%;
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin: 0.5rem 0;
  }
`;

const QuantityLabel = styled.span`
  font-weight: 500;
  color: #333;
  
  @media (max-width: 576px) {
    font-size: 0.95rem;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #8c8c8c;
  border-radius: 4px;
  overflow: hidden;
  
  @media (max-width: 576px) {
    width: 100%;
    max-width: 180px;
  }
`;

const QuantityButton = styled.button`
  background: #f5f5f5;
  border: none;
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #e0e0e0;
  }
  
  @media (max-width: 576px) {
    width: 40px;
  }
`;

const QuantityValue = styled.span`
  padding: 0 1rem;
  min-width: 40px;
  text-align: center;
  
  @media (max-width: 576px) {
    flex: 1;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: 1rem;
  
  @media (max-width: 576px) {
    margin-top: 0.5rem;
    margin-left: 0;
    width: 100%;
  }
`;

const AddToCartButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1b5e20;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
  }
`;

const BuyNowButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #faad14;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e0a000;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
  }
`;

// Tab components
const TabsContainer = styled.div`
  width: 100%;
  margin-top: 3rem;
  margin-bottom: 2rem;
  
  @media (max-width: 576px) {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e8e8e8;
  
  @media (max-width: 576px) {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      height: 3px;
    }
  }
`;

const Tab = styled.div`
  padding: 1rem 2rem;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#333' : '#666'};
  border-bottom: ${props => props.active ? '2px solid #faad14' : 'none'};
  margin-bottom: -1px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #faad14;
  }
  
  @media (max-width: 576px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
`;

const TabContent = styled.div`
  padding: 2rem 0;
  line-height: 1.6;
  color: #333;
  
  @media (max-width: 576px) {
    padding: 1.5rem 0;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('center center');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);
  
  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Set default variant when product loads
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setMainImage(product.variants[0].image || product.mainImage);
    }
  }, [product]);
  
  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  const handleVariantChange = (e) => {
    const variantId = e.target.value;
    const variant = product.variants.find(v => v._id === variantId);
    if (variant) {
      setSelectedVariant(variant);
      setMainImage(variant.image || product.mainImage);
    }
  };

  const handleThumbnailClick = (image, variant) => {
    setMainImage(image);
    setSelectedVariant(variant);
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        navigate('/login');
        return;
      }

      // Check if variant is selected
      if (!selectedVariant) {
        toast.error('Please select a product variant');
        return;
      }
      
      console.log('Selected variant:', selectedVariant);
      
      // Create weight object
      let weightObj;
      if (typeof selectedVariant.weight === 'object') {
        // If weight is already an object with value and unit
        weightObj = selectedVariant.weight;
      } else {
        // If weight is a number or string
        weightObj = {
          value: parseFloat(selectedVariant.weight) || 100,
          unit: selectedVariant.unit || 'g'
        };
      }
      
      console.log('Adding to cart with data:', {
        productId: product._id,
        weight: weightObj,
        quantity: quantity
      });
      
      // Dispatch the addToCart action
      const result = await dispatch(addToCart({
        productId: product._id,
        weight: weightObj,
        quantity: quantity
      })).unwrap();
      
      console.log('Cart response:', result);
      toast.success(`${quantity} ${product.name} added to cart`);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to add item to cart. Please try again.');
    }
  };

  const handleBuyNow = () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        toast.info('Please login to continue with purchase');
        navigate('/login', { 
          state: { 
            from: window.location.pathname,
            buyNowProduct: {
              productId: product._id,
              weight: selectedVariant.weight,
              quantity: quantity,
              variant: selectedVariant
            }
          } 
        });
        return;
      }

      // Check if variant is selected
      if (!selectedVariant) {
        toast.error('Please select a product variant');
        return;
      }
      
      // Create weight object
      let weightObj;
      if (typeof selectedVariant.weight === 'object') {
        // If weight is already an object with value and unit
        weightObj = selectedVariant.weight;
      } else {
        // If weight is a number or string
        weightObj = {
          value: parseFloat(selectedVariant.weight) || 100,
          unit: selectedVariant.unit || 'g'
        };
      }
      
      // Prepare product data for checkout
      const buyNowProduct = {
        productId: product._id,
        weight: weightObj,
        quantity: quantity,
        price: selectedVariant.price,
        originalPrice: selectedVariant.originalPrice,
        discountPrice: selectedVariant.discountPrice,
        savings: selectedVariant.savings,
        savingsPercentage: selectedVariant.savingsPercentage,
        image: selectedVariant.image || product.mainImage,
        name: product.name
      };
      
      toast.info('Proceeding to checkout...');
      
      // Navigate to checkout with the product data
      navigate('/checkout', { 
        state: { 
          buyNowProduct,
          isBuyNow: true
        } 
      });
    } catch (error) {
      console.error('Buy now error:', error);
      toast.error('Failed to process your request. Please try again.');
    }
  };

  // Image zoom functionality
  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;

    setTransformOrigin(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  if (loading && !product) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Container>
      <div style={{
        marginTop: '0.2rem',
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        height: window.innerWidth <= 576 ? '220px' : '360px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src="/images/shop/shop_02.jpg"
          alt="Product Details Banner"
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
        }}>{t('headingShop', 'Shop')}</h1>
      </div>

      <ContentWrapper>
        <h2 style={{
          fontSize: window.innerWidth <= 576 ? '1.5rem' : '2rem',
          color: '#333',
          textAlign: 'center',
          margin: window.innerWidth <= 576 ? '1.5rem 0' : '2rem 0',
          fontWeight: '500'
        }}>Your favorites all in one place</h2>

        <ProductContainer>
          <ProductBox>
            {/* Left side - Product Images */}
            <ImageContainer>
              <ZoomableImageContainer
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <MainImage
                  src={mainImage || product.mainImage}
                  alt={product.name}
                  isZoomed={isZoomed}
                  transformOrigin={transformOrigin}
                />
              </ZoomableImageContainer>
              <ThumbnailContainer>
                {product.variants && product.variants.map((variant, index) => (
                  <Thumbnail
                    key={variant._id || index}
                    src={variant.image || product.mainImage}
                    alt={`${product.name} - ${variant.weight && variant.weight.value ? `${variant.weight.value} ${variant.weight.unit}` : 'Standard'}`}
                    selected={selectedVariant && selectedVariant._id === variant._id}
                    onClick={() => handleThumbnailClick(variant.image || product.mainImage, variant)}
                  />
                ))}
              </ThumbnailContainer>
            </ImageContainer>

            {/* Right side - Product Info */}
            <ProductInfo>
              <ProductTitle>{product.name}</ProductTitle>

              {/* Rating */}
              <RatingContainer>
                <RatingNumber>
                  {product.rating ? product.rating.toFixed(1) : '0.0'}
                </RatingNumber>
                <StarContainer>
                  ★★★★★
                  <StarFill width={`${(product.rating / 5) * 100}%`}>★★★★★</StarFill>
                </StarContainer>
                <ReviewCount>
                  ({product.numReviews || product.reviews || 0} {t('reviews', 'reviews')})
                </ReviewCount>
              </RatingContainer>

              {/* Price */}
              <PriceContainer>
                <Price>
                  {selectedVariant && selectedVariant.price ?
                    `₹${selectedVariant.price.toFixed(2)}` :
                    product.price ? `₹${product.price.toFixed(2)}` :
                      product.defaultVariant && product.defaultVariant.price ?
                        `₹${product.defaultVariant.price.toFixed(2)}` : '₹0.00'}
                </Price>
                {selectedVariant && selectedVariant.originalPrice && (
                  <OriginalPrice>₹{selectedVariant.originalPrice.toFixed(2)}</OriginalPrice>
                )}
                {selectedVariant && selectedVariant.originalPrice && selectedVariant.price && (
                  <Savings>
                    {t('save', 'Save')} ₹{(selectedVariant.originalPrice - selectedVariant.price).toFixed(2)}
                  </Savings>
                )}
              </PriceContainer>

              {/* Description */}
              <Description>{product.description}</Description>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <VariantSelect
                    value={selectedVariant ? selectedVariant._id : ''}
                    onChange={handleVariantChange}
                  >
                    {product.variants.map((variant) => (
                      <option key={variant._id} value={variant._id}>
                        {variant.weight && variant.weight.value && variant.weight.unit ?
                          `${variant.weight.value} ${variant.weight.unit}` :
                          variant.weight || 'Standard'}
                      </option>
                    ))}
                  </VariantSelect>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <QuantityContainer>
                <QuantityControls>
                  <QuantityButton onClick={handleQuantityDecrease}>-</QuantityButton>
                  <QuantityValue>{quantity}</QuantityValue>
                  <QuantityButton onClick={handleQuantityIncrease}>+</QuantityButton>
                </QuantityControls>

                <ButtonContainer>
                  <AddToCartButton onClick={handleAddToCart}>
                    {t('addToCart', 'Add to Cart')}
                  </AddToCartButton>
                </ButtonContainer>
              </QuantityContainer>
            </ProductInfo>
          </ProductBox>
        </ProductContainer>
        
        {/* Tabs Section */}
        <TabsContainer>
          <TabsHeader>
            <Tab 
              active={activeTab === 'description'} 
              onClick={() => setActiveTab('description')}
            >
              Description
            </Tab>
            <Tab 
              active={activeTab === 'additional'} 
              onClick={() => setActiveTab('additional')}
            >
              Additional Information
            </Tab>
            <Tab 
              active={activeTab === 'reviews'} 
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.numReviews || product.reviews || 0})
            </Tab>
          </TabsHeader>
          
          {activeTab === 'description' && (
            <TabContent>
              <h3>Product Description</h3>
              <p>{product.description}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
            </TabContent>
          )}
          
          {activeTab === 'additional' && (
            <TabContent>
              <h3>Additional Information</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #e8e8e8' }}>Weight</th>
                    <td style={{ padding: '10px', borderBottom: '1px solid #e8e8e8' }}>
                      {selectedVariant && selectedVariant.weight ? 
                        (selectedVariant.weight.value && selectedVariant.weight.unit ? 
                          `${selectedVariant.weight.value} ${selectedVariant.weight.unit}` : 
                          selectedVariant.weight) : 
                        'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #e8e8e8' }}>Ingredients</th>
                    <td style={{ padding: '10px', borderBottom: '1px solid #e8e8e8' }}>{product.ingredients || 'Natural herbs and spices'}</td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #e8e8e8' }}>Origin</th>
                    <td style={{ padding: '10px', borderBottom: '1px solid #e8e8e8' }}>{product.origin || 'India'}</td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #e8e8e8' }}>Storage</th>
                    <td style={{ padding: '10px', borderBottom: '1px solid #e8e8e8' }}>Store in a cool, dry place away from direct sunlight</td>
                  </tr>
                </tbody>
              </table>
            </TabContent>
          )}
          
          {activeTab === 'reviews' && (
            <TabContent>
              <h3>Customer Reviews</h3>
              {(product.numReviews || product.reviews || 0) > 0 ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', marginRight: '15px' }}>
                      {product.rating ? product.rating.toFixed(1) : '0.0'}
                    </div>
                    <div>
                      <StarContainer style={{ marginBottom: '5px' }}>
                        ★★★★★
                        <StarFill width={`${(product.rating / 5) * 100}%`}>★★★★★</StarFill>
                      </StarContainer>
                      <div>{product.numReviews || product.reviews || 0} reviews</div>
                    </div>
                  </div>
                  
                  {/* Sample reviews - replace with actual reviews from API */}
                  <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '15px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>John D.</strong>
                      <StarContainer style={{ fontSize: '14px' }}>
                        ★★★★★
                        <StarFill width={`${(5 / 5) * 100}%`}>★★★★★</StarFill>
                      </StarContainer>
                    </div>
                    <div style={{ color: '#666', fontSize: '12px', marginBottom: '5px' }}>Verified Purchase - June 12, 2025</div>
                    <p>This product exceeded my expectations! The quality is excellent and it works exactly as described.</p>
                  </div>
                  
                  <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '15px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Sarah M.</strong>
                      <StarContainer style={{ fontSize: '14px' }}>
                        ★★★★★
                        <StarFill width={`${(4 / 5) * 100}%`}>★★★★★</StarFill>
                      </StarContainer>
                    </div>
                    <div style={{ color: '#666', fontSize: '12px', marginBottom: '5px' }}>Verified Purchase - May 28, 2025</div>
                    <p>Great product and fast shipping. Would definitely buy again!</p>
                  </div>
                </div>
              ) : (
                <p>No reviews yet. Be the first to review this product!</p>
              )}
              
              <button 
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#faad14',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginTop: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => toast.info('Review feature coming soon!')}
              >
                Write a Review
              </button>
            </TabContent>
          )}
        </TabsContainer>
      </ContentWrapper>
    </Container>
  );
};

export default ProductDetails;