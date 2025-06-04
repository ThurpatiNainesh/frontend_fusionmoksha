import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { products as allProducts } from '../data/data';
import { Link } from 'react-router-dom'; // Ensure Link is imported

// Styled Components
const ProductDetailsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 4rem auto;
  max-width: 1400px;
  padding: 0 2rem;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProductName = styled.h1`
  font-size: 2.5rem;
  font-weight: 500;
  color: #2c3e50;
  margin: 0;
`;

const RecommendedProductName = styled.h3` // Will be used as ProductName equivalent
  margin: 0 0 0.5rem 0; // Matched Shop.js ProductName margin
  font-size: 1.1rem; // Matched Shop.js ProductName font-size
  font-weight: normal; // Defaulting, Shop.js ProductName doesn't specify weight, relies on h3 default
  color: #2c3e50; // Keeping color, or could be inherit
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  .stars {
    color: #faad14;
    font-size: 1.5rem;
  }
  .rating-count {
    color: #666;
  }
`;

// Price component for main product (will be replaced by new structure)
// const ProductPrice = styled.div`
//   font-size: 2rem;
//   font-weight: 700;
//   color: #faad14;
// `;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline; /* Align text baselines */
  gap: 0.75rem; /* Space between original and discounted price */
  margin: 0.5rem 0; /* Consistent margin like old price components */
`;

const OriginalPriceDisplay = styled.span`
  font-size: ${props => props.isRelated ? '0.9rem' : '1.5rem'}; 
  color: #888;
  text-decoration: line-through;
`;

const DiscountedPriceDisplay = styled.span`
  font-size: ${props => props.isRelated ? '1.1rem' : '2rem'};
  font-weight: 700;
  color: ${props => props.isRelated ? '#333' : '#faad14'};
`;

const ProductStock = styled.div`
  padding: 1rem 2rem;
  background: ${props => props.inStock ? '#e8f5e9' : '#ffebee'};
  border-radius: 12px;
  font-weight: 600;
  color: ${props => props.inStock ? '#2e7d32' : '#c62828'};
`;

const ProductShipping = styled.div`
  font-size: 1.1rem;
  color: #666;
`;

const ProductDescription = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
`;

const ProductDetailsList = styled.ul`
  list-style: none;
  padding: 0;
  li {
    margin: 0.5rem 0;
    font-size: 1.1rem;
    color: #4a5568;
    strong {
      color: #2d3748;
    }
  }
`;

const ProductOptions = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const SelectOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  label {
    font-weight: 600;
    color: #4a5568;
  }
  select {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #4a5568;
    &:focus {
      outline: none;
      border-color: #faad14;
    }
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  .quantity-btn {
    width: 3rem;
    height: 3rem;
    border: none;
    background: #f7fafc;
    border-radius: 50%;
    font-size: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      background: #edf2f7;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  .quantity-display {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }
`;

const BuyNowButton = styled.button`
  background: #faad14;
  color: #fff;
  &:hover {
    background: #d4900d;
  }
  &:disabled {
    background: #e2e8f0;
    cursor: not-allowed;
  }
`;

const AddToCartButton = styled.button`
  background: #ffffff;
  color: #faad14;
  border: 2px solid #faad14;
  &:hover {
    background: #f8f9fa;
  }
  &:disabled {
    background: #e2e8f0;
    cursor: not-allowed;
  }
`;

// Styled components for Related Products section
const RelatedProductsWrapper = styled.section`
  margin-top: 4rem;
  padding: 2rem; // Add padding around the section
  background-color: #f9f9f9; // Light background for differentiation
`;

const RelatedProductsTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  text-align: center;
`;

const RelatedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  /* max-width: 1200px; // Max width for the grid itself - Removed to match Shop.js behavior */
  /* margin: 0 auto; // Center the grid - Removed */
`;

const RelatedProductCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); // Matched Shop.js
  transition: transform 0.3s ease; // Matched Shop.js
  /* overflow: hidden; // Removed */
  /* display: flex; // Removed */
  /* flex-direction: column; // Removed */
  
  &:hover {
    transform: translateY(-5px); // Matched Shop.js
    /* box-shadow: 0 4px 8px rgba(0,0,0,0.12); // Hover shadow is implicit with transform */
  }
`;

const RelatedProductImage = styled.img`
  width: 100%;
  height: 200px; // Matched Shop.js
  object-fit: contain;
  background-color: #f5f5f5; // Matched Shop.js
  padding: 1rem; // Matched Shop.js
  /* border-bottom: 1px solid #e2e8f0; // Removed */
`;

const RelatedProductInfo = styled.div`
  padding: 1rem;
  overflow: visible; // Matched Shop.js
  /* flex-grow: 1; // Removed */
  /* display: flex; // Removed */
  /* flex-direction: column; // Removed */
  /* justify-content: space-between; // Removed */
`;

const RelatedProductRating = styled.div`
  color: #faad14;
  font-size: 1rem;
  margin: 0.5rem 0;
`;

const RelatedReviewCount = styled.span`
  color: #666;
  font-size: 0.9rem;
  margin-left: 0.5rem;
`;

const RelatedAddToCartButton = styled.button`
  background-color: #faad14;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem; // Added margin for spacing
  
  &:hover {
    background-color: #f5a623;
  }
`;

// Helper function to generate star rating
const generateStars = (rating) => {
  const stars = Math.floor(rating);
  const half = rating - stars >= 0.5;
  const fullStars = '★'.repeat(stars);
  const halfStar = half ? '★' : '';
  const emptyStars = '☆'.repeat(5 - stars - (half ? 1 : 0));
  return `${fullStars}${halfStar}${emptyStars}`;
};

const ProductTabs = styled.div`
  margin-top: 3rem;
  .tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    button {
      padding: 0.75rem 1.5rem;
      border: none;
      background: #f7fafc;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      &.active {
        background: #faad14;
        color: #fff;
        &::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          right: 0;
          height: 3px;
          background: #fff;
          border-radius: 2px;
        }
      }
      &:hover:not(.active) {
        background: #edf2f7;
      }
    }
  }
  .tab-content {
    background: #fff;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  }
`;

const Review = styled.div`
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  .stars {
    color: #faad14;
    font-size: 1.5rem;
  }
`;

const ReviewCount = styled.span`
  color: #666;
  font-size: 0.9rem;
  margin-left: 0.5rem;
`;

const ReviewContent = styled.div`
  margin-left: 1.5rem;
  h3 {
    margin: 0 0 0.8rem 0;
    font-size: 1.3rem;
    color: #2c3e50;
  }
  p {
    margin: 0.8rem 0;
    color: #34495e;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  small {
    display: block;
    color: #666;
    font-size: 0.9rem;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
`;

const ProductDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState('5');
  const [reviewText, setReviewText] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('250'); // Default weight for options
  const [selectedPackageType, setSelectedPackageType] = useState('box'); // Default package type for options

  const productById = allProducts.find(p => p.id === parseInt(id));

  if (!productById) {
    return <div>{t('productNotFound', 'Product not found')}</div>;
  }

  // Create a consistent product object with fallbacks for the current product
  const currentProduct = {
    id: productById.id,
    name: productById.name || t('productNameUnavailable', 'Product Name Unavailable'),
    image: productById.image || '/images/default-product.png', // Fallback image
    price: parseFloat(productById.price) || 0,
    originalPrice: productById.originalPrice ? parseFloat(productById.originalPrice) : null,
    rating: parseFloat(productById.rating) || 0,
    // 'reviews' from data.js is a count. 'reviewList' is the array of actual reviews.
    reviewsCount: parseInt(productById.reviews) || 0, 
    stock: parseInt(productById.stock) || 0,
    description: productById.description || t('productDescriptionUnavailable', 'Product description not available.'),
    reviewList: Array.isArray(productById.reviewList) ? productById.reviewList : [],
    category: productById.category || t('categoryN/A', 'N/A'),
    weight: parseInt(productById.weight) || 0, // This is the base/default weight from data
    origin: productById.origin || t('originN/A', 'N/A'),
    flavor: productById.flavor || t('flavorN/A', 'N/A'),
  };

  const handleAddToCart = () => {
    if (currentProduct.stock === 0) return;
    setAddToCartLoading(true);
    console.log(`Adding ${quantity} of ${currentProduct.name} (ID: ${currentProduct.id}) to cart with weight ${selectedWeight}g and package ${selectedPackageType}`);
    setTimeout(() => {
      setAddToCartLoading(false);
      alert(t('addedToCartPlaceholder', `${currentProduct.name} added to cart (placeholder)`));
    }, 1000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim() || !reviewRating) return;
    const newReview = {
      author: 'Anonymous User',
      rating: parseInt(reviewRating),
      text: reviewText,
      date: new Date().toLocaleDateString(),
    };
    // This is a local simulation. In a real app, this would be an API call.
    console.log('New review submitted (local simulation):', newReview);
    // currentProduct.reviewList.push(newReview); // Avoid direct mutation if possible, depends on state management
    // currentProduct.reviewsCount = currentProduct.reviewList.length;
    alert(t('reviewSubmittedPlaceholder', 'Review submitted (placeholder - not saved globally)'));
    setReviewRating('5');
    setReviewText('');
  };

  const relatedProductsData = allProducts
    .filter(p => p.id !== currentProduct.id)
    .slice(0, 3)
    .map(rp => ({
      id: rp.id,
      name: rp.name || t('productNameUnavailable', 'Product Name Unavailable'),
      image: rp.image || '/images/default-product.png',
      price: parseFloat(rp.price) || 0,
      originalPrice: rp.originalPrice ? parseFloat(rp.originalPrice) : null,
      rating: parseFloat(rp.rating) || 0,
      reviewsCount: parseInt(rp.reviews) || 0,
      reviewList: Array.isArray(rp.reviewList) ? rp.reviewList : [],
    }));

  return (
    <>
      <ProductDetailsWrapper>
        <ProductImage src={currentProduct.image} alt={currentProduct.name} />
        <ProductInfo>
          <ProductName>{currentProduct.name}</ProductName>
          <ProductRating>
            <span className="stars">{generateStars(currentProduct.rating)}</span>
            <span className="rating" style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}>
              {currentProduct.rating ? currentProduct.rating.toFixed(1) : '0.0'}/5
            </span>
            <span className="rating-count">({currentProduct.reviewList.length} {t('reviews', 'reviews')})</span>
          </ProductRating>
          <PriceContainer>
            {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
              <OriginalPriceDisplay>
                ₹{currentProduct.originalPrice.toFixed(2)}
              </OriginalPriceDisplay>
            )}
            <DiscountedPriceDisplay>
              ₹{currentProduct.price ? currentProduct.price.toFixed(2) : '0.00'}
            </DiscountedPriceDisplay>
          </PriceContainer>
          <ProductStock inStock={currentProduct.stock > 0}>
            <span>{currentProduct.stock > 0 ? t('inStock', 'In Stock') : t('outOfStock', 'Out of Stock')}</span>
          </ProductStock>
          <ProductShipping>
            {t('freeShipping', 'Free Shipping')} • {t('shipsIn', 'Ships in')} {t('days', { count: 3, defaultValue: '3 days' })}
          </ProductShipping>
          
          <ProductOptions>
            <SelectOption>
              <label htmlFor={`weight-select-${currentProduct.id}`}>{t('weight', 'Weight')}:</label>
              <select id={`weight-select-${currentProduct.id}`} value={selectedWeight} onChange={(e) => setSelectedWeight(e.target.value)}>
                <option value="250">250g</option>
                <option value="500">500g</option>
                <option value="1000">1000g</option>
              </select>
            </SelectOption>
            <SelectOption>
              <label htmlFor={`package-select-${currentProduct.id}`}>{t('package', 'Package')}:</label>
              <select id={`package-select-${currentProduct.id}`} value={selectedPackageType} onChange={(e) => setSelectedPackageType(e.target.value)}>
                <option value="box">{t('box', 'Box')}</option>
                <option value="bag">{t('bag', 'Bag')}</option>
              </select>
            </SelectOption>
          </ProductOptions>

          <QuantitySelector>
            <button 
              className="quantity-btn" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              aria-label={t('decreaseQuantity', 'Decrease quantity')}
            >
              -
            </button>
            <span className="quantity-display" aria-live="polite">{quantity}</span>
            <button 
              className="quantity-btn" 
              onClick={() => setQuantity(quantity + 1)}
              aria-label={t('increaseQuantity', 'Increase quantity')}
            >
              +
            </button>
          </QuantitySelector>

          <ActionButtons>
            <BuyNowButton
              onClick={handleAddToCart} // Assuming Buy Now also adds to cart for simplicity
              disabled={addToCartLoading || currentProduct.stock === 0}
            >
              {addToCartLoading ? 
                t('loading', 'Loading...') : 
                currentProduct.stock === 0 ? t('outOfStock', 'Out of Stock') : t('buyNow', 'Buy Now')}
            </BuyNowButton>
            <AddToCartButton
              onClick={handleAddToCart}
              disabled={addToCartLoading || currentProduct.stock === 0}
            >
              {addToCartLoading ? 
                t('loading', 'Loading...') : 
                currentProduct.stock === 0 ? t('outOfStock', 'Out of Stock') : t('addToCart', 'Add to Cart')}
            </AddToCartButton>
          </ActionButtons>

          {/* <ProductDescription>
            {currentProduct.description}
          </ProductDescription>
          <ProductDetailsList>
            <li><strong>{t('category', 'Category')}: </strong>{currentProduct.category}</li>
            <li><strong>{t('baseWeight', 'Base Weight')}: </strong>{currentProduct.weight}g</li>
            <li><strong>{t('origin', 'Origin')}: </strong>{currentProduct.origin}</li>
            <li><strong>{t('flavor', 'Flavor')}: </strong>{currentProduct.flavor}</li>
          </ProductDetailsList> */}
        </ProductInfo>
      </ProductDetailsWrapper>
      <ProductTabs>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            {t('description', 'Description')}
          </button>
          <button
            className={`tab ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            {t('specifications', 'Specifications')}
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            {t('reviews', 'Reviews')} ({currentProduct.reviewList.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div>
              <h3>{t('productDescription', 'Product Description')}</h3>
              <p>{currentProduct.description}</p>
            </div>
          )}
          {activeTab === 'specifications' && (
            <div>
              <h3>{t('productSpecifications', 'Product Specifications')}</h3>
              <ProductDetailsList>
                <li><strong>{t('baseWeight', 'Base Weight')}: </strong>{currentProduct.weight}g</li>
                <li><strong>{t('origin', 'Origin')}: </strong>{currentProduct.origin}</li>
                <li><strong>{t('flavor', 'Flavor')}: </strong>{currentProduct.flavor}</li>
                {/* Add more specifications as needed */}
              </ProductDetailsList>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
              <h3>{t('customerReviews', 'Customer Reviews')}</h3>
              {currentProduct.reviewList.length === 0 ? (
                <p>{t('noReviewsYet', 'No reviews yet. Be the first to review!')}</p>
              ) : (
                currentProduct.reviewList.map((review, index) => (
                  <Review key={index}>
                    <Rating>
                      <span className="stars">{generateStars(review.rating)}</span>
                      <strong>{review.author || 'Anonymous'}</strong>
                    </Rating>
                    <ReviewContent>
                      <p>{review.text}</p>
                      <small>{review.date || new Date().toLocaleDateString()}</small>
                    </ReviewContent>
                  </Review>
                ))
              )}
              <form onSubmit={handleReviewSubmit} style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                <h4>{t('writeReview', 'Write a Review')}</h4>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="reviewRating" style={{ marginRight: '0.5rem' }}>{t('rating', 'Rating')}: </label>
                  <select id="reviewRating" value={reviewRating} onChange={(e) => setReviewRating(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px' }}>
                    <option value="5">5 {t('stars', 'Stars')}</option>
                    <option value="4">4 {t('stars', 'Stars')}</option>
                    <option value="3">3 {t('stars', 'Stars')}</option>
                    <option value="2">2 {t('stars', 'Stars')}</option>
                    <option value="1">1 {t('star', 'Star')}</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="reviewText" style={{ display: 'block', marginBottom: '0.5rem' }}>{t('review', 'Review')}: </label>
                  <textarea 
                    id="reviewText"
                    value={reviewText} 
                    onChange={(e) => setReviewText(e.target.value)} 
                    rows="4" 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    required 
                    placeholder={t('writeYourReviewPlaceholder', 'Write your review here...')}
                  />
                </div>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#faad14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  {t('submitReview', 'Submit Review')}
                </button>
              </form>
            </div>
          )}
        </div>
      </ProductTabs>
      {relatedProductsData.length > 0 && (
        <RelatedProductsWrapper>
          <RelatedProductsTitle>{t('youMightAlsoLike', 'You Might Also Like')}</RelatedProductsTitle>
          <RelatedProductsGrid>
            {relatedProductsData.map(relatedProd => (
              <RelatedProductCard key={relatedProd.id} to={`/shop/${relatedProd.id}`}>
                <RelatedProductImage src={relatedProd.image} alt={relatedProd.name} />
                <RelatedProductInfo>
                  <RecommendedProductName>{relatedProd.name}</RecommendedProductName>
                  <PriceContainer>
                    {relatedProd.originalPrice && relatedProd.originalPrice > relatedProd.price && (
                      <OriginalPriceDisplay isRelated>
                        ₹{relatedProd.originalPrice.toFixed(2)}
                      </OriginalPriceDisplay>
                    )}
                    <DiscountedPriceDisplay isRelated>
                      ₹{relatedProd.price ? relatedProd.price.toFixed(2) : '0.00'}
                    </DiscountedPriceDisplay>
                  </PriceContainer>
                  <RelatedProductRating>
                    {generateStars(relatedProd.rating)}
                    <RelatedReviewCount>({relatedProd.reviewList.length} {t('reviews', 'reviews')})</RelatedReviewCount>
                  </RelatedProductRating>
                  <RelatedAddToCartButton onClick={(e) => { 
                    e.preventDefault(); 
                    alert(t('addedToCartPlaceholder', `Added ${relatedProd.name} to cart (placeholder)`)); 
                  }}>
                    {t('addToCart', 'ADD TO CART')}
                  </RelatedAddToCartButton>
                </RelatedProductInfo>
              </RelatedProductCard>
            ))}
          </RelatedProductsGrid>
        </RelatedProductsWrapper>
      )}
    </>
  );
};

export default ProductDetails;