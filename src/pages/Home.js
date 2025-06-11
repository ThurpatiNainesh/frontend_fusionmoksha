import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { products } from '../data/data';
import AddToCartButton from '../components/AddToCartButton';

// Helper function to generate star rating
const generateStars = (rating) => {
  const stars = Math.floor(rating);
  const half = rating - stars >= 0.5;
  const fullStars = '★'.repeat(stars);
  const halfStar = half ? '★' : '';
  const emptyStars = '☆'.repeat(5 - stars - (half ? 1 : 0));
  return `${fullStars}${halfStar}${emptyStars}`;
};

const CategorySection = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  padding: 0.8rem 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @media (max-width: 768px) {
    gap: 2rem;
    padding: 1.5rem 0;
  }
`;

const CategoryImage = styled.img`
  width: 50px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
  margin: 0.2rem;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 50px;
  }
`;

const HorizontalImage = styled.div`
  width: calc(25% - 0.5rem);
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: #f5f5f5;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 180px;
    height: 220px;
  }
`;

const LoadingImage = styled.div`
  width: 200px;
  height: 250px;
  background: #f5f5f5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;

  @keyframes pulse {
    0% { opacity: 0.8; }
    50% { opacity: 0.5; }
    100% { opacity: 0.8; }
  }

  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 2px solid #e0e0e0;
    border-radius: 50%;
    border-top-color: #faad14;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    width: 180px;
    height: 220px;
  }
`;

const HeroBanner = styled.section`
  width: 100%;
  min-height: 220px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 2rem;
  color: white;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/homePage/home_11.png');
  h1 {
    color: #fff;
    font-size: clamp(1.75rem, 4vw, 3rem);
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
`;

const HomePageSection = styled.section`
  width: 100%;
  margin-top: 0;
  padding: 0;
`;

const HomePageImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
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

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <div style={{ paddingTop: '10px', paddingBottom: '0.5rem' }}>
        <CategorySection>
          <CategoryImage src="/images/category/cat_03.png" alt="Category 1" />
          <CategoryImage src="/images/category/cat_05.png" alt="Category 2" />
          <CategoryImage src="/images/category/cat_07.png" alt="Category 3" />
          <CategoryImage src="/images/category/cat_09.png" alt="Category 4" />
          <CategoryImage src="/images/category/cat_11.png" alt="Category 5" />
          <CategoryImage src="/images/category/cat_13.png" alt="Category 6" />
        </CategorySection>
      </div>
      <div style={{ marginTop: '0.2rem' }}>
        <img src="/images/homePage/home_11.png" alt="Hero Image" style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }} />
      </div>
      <HomePageSection>
        <HomePageImage src="/images/homePage/home_12.png" alt="Home Section 2" />
      </HomePageSection>
      <ProductGrid>
        {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} to={`/shop/${product.id}`}>
            <ProductImage src={product.image} alt={product.name} style={{ position: 'relative', zIndex: 1 }} />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>₹{product.price}</ProductPrice>
              <ProductRating>
                {generateStars(product.rating)}
                <ReviewCount>({product.reviews} {t('reviews')})</ReviewCount>
              </ProductRating>
              <AddToCartButton>
                {t('Add To Cart')}
              </AddToCartButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
      <div style={{ padding: '2rem 0', textAlign: 'center' }}>
        <Link to="/shop" style={{ textDecoration: 'none' }}>
          <button style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '600',
            transition: 'transform 0.3s ease',
            display: 'inline-block'
          }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >Shop All</button>
        </Link>
      </div>
      {/* <div style={{ padding: '2rem 0' }}>
        <h2>{t('headingAbout')}</h2>
        <p>Home content goes here...</p>
      </div> */}

      <div style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <CategorySection>
          <HorizontalImage>
            <img src="/images/homePage/home_52.png" alt="Image 1" />
          </HorizontalImage>
          <HorizontalImage>
            <img src="/images/homePage/home_54.png" alt="Image 2" />
          </HorizontalImage>
          <HorizontalImage>
            <img src="/images/homePage/home_56.png" alt="Image 3" />
          </HorizontalImage>
          <HorizontalImage>
            <img src="/images/homePage/home_58.png" alt="Image 4" />
          </HorizontalImage>
        </CategorySection>
      </div>
      <div style={{
        paddingTop: '0',
        marginTop: '-1rem'
      }}>
        <img src="/images/homePage/home_64.png" alt="Home Section 4" style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          margin: '0'
        }} />
      </div>
      <div style={{ paddingTop: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            flex: '1',
            maxWidth: '500px'
          }}>
            <h2 style={{
              color: '#333',
              marginBottom: '1rem'
            }}>Welcome to Fusion Moksha</h2>
            <p style={{
              color: '#666',
              lineHeight: '1.6'
            }}>Experience the perfect blend of style and comfort. Our collection features the latest trends in fashion, carefully curated to suit every occasion. From casual to formal, we have everything you need to express your unique style.</p>
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>know More</button>
            </Link>
          </div>
          <div style={{
            flex: '1',
            paddingBottom: '2rem'
          }}>
            <img src="/images/homePage/home_67.png" alt="Home Section 5" style={{
              width: '60%',
              height: 'auto',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }} />
          </div>
        </div>
      </div>
      <div>
        <img src="/images/homePage/home_74.png" alt="Home Section 6" style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          margin: '0 auto'
        }} />
      </div>
      <div>
        <img src="/images/homePage/home_75.png" alt="Home Section 7" style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          margin: '0 auto'
        }} />
      </div>
      <div style={{ paddingTop: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'flex-start',
          height: '100%'
        }}>
          {/* Left side with big image and description */}
          <div style={{
            flex: '1',
            maxWidth: '600px',
            height: '100%'
          }}>
            <img src="/images/homePage/home_80.png" alt="Main Feature" style={{
              width: '100%',
              height: '100%',
              display: 'block',
              marginBottom: '1rem'
            }} />
            <h3 style={{
              color: '#333',
              marginBottom: '0.5rem'
            }}>Special Collection</h3>
            <p style={{
              color: '#666',
              lineHeight: '1.6'
            }}>Discover our exclusive collection of premium products designed for the modern lifestyle. Each piece is crafted with attention to detail and quality materials.</p>
            <button style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: 'normal'
            }}>Read More</button>
          </div>
          {/* Right side with three images */}
          <div style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '100%',
            maxHeight: '100%'
          }}>
            <div style={{
              flex: '1',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              padding: '1rem'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <img src="/images/homePage/home_77.png" alt="Feature 1" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} />
              </div>
              <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h4 style={{
                  color: '#333',
                  marginBottom: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>Summer Collection</h4>
                <p style={{
                  color: '#666',
                  lineHeight: '1.4',
                  marginBottom: '1rem'
                }}>Fresh styles for the season</p>
                <button style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  alignSelf: 'flex-start'
                }}>Read More</button>
              </div>
            </div>
            <div style={{
              flex: '1',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              padding: '1rem'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <img src="/images/homePage/home_77.png" alt="Feature 2" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} />
              </div>
              <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h4 style={{
                  color: '#333',
                  marginBottom: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>New Arrivals</h4>
                <p style={{
                  color: '#666',
                  lineHeight: '1.4',
                  marginBottom: '1rem'
                }}>Latest additions to our collection</p>
                <button style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  alignSelf: 'flex-start'
                }}>Read More</button>
              </div>
            </div>
            <div style={{
              flex: '1',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              padding: '1rem'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <img src="/images/homePage/home_77.png" alt="Feature 3" style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} />
              </div>
              <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h4 style={{
                  color: '#333',
                  marginBottom: '0.5rem',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>Best Sellers</h4>
                <p style={{
                  color: '#666',
                  lineHeight: '1.4',
                  marginBottom: '1rem'
                }}>Most loved by our customers</p>
                <button style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  alignSelf: 'flex-start'
                }}>Read More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
