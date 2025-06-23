import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ShopProductGrid from '../components/ShopProductGrid';
import { getTopProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import { featuredData } from '../data/featuredData';
import FeatureBig from '../components/features/FeatureBig';
import FeatureSmall from '../components/features/FeatureSmall';


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
  
  @media (max-width: 992px) {
    justify-content: flex-start;
    padding: 0.8rem 1rem;
  }
  
  @media (max-width: 576px) {
    gap: 1.2rem;
    padding: 1rem;
    justify-content: flex-start;
  }
`;

const CategoryImage = styled.img`
  width: 50px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
  margin: 0.2rem;
  scroll-snap-align: center;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    width: 45px;
    height: 55px;
  }
  
  @media (max-width: 576px) {
    width: 60px;
    height: 70px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const HorizontalImage = styled.div`
  width: calc(25% - 0.5rem);
  height: 450px;
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
  
  @media (max-width: 992px) {
    width: calc(50% - 0.5rem);
    height: 350px;
  }
  
  @media (max-width: 576px) {
    min-width: calc(50% - 0.5rem);
    flex: 0 0 calc(50% - 0.5rem);
    height: 250px;
    scroll-snap-align: start;
  }
`;

const ProductGrid = styled.div`
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
    gap: 0.5rem;
    padding: 0.75rem 0.5rem;
  }
`;

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const { topProducts, loading, error } = useSelector((state) => ({
    topProducts: state.products.topProducts || [],
    loading: state.products.loading,
    error: state.products.error
  }));
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(getTopProducts());
  }, [dispatch]);

  if (loading) {
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
        <div style={{ padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Featured Products</h2>
          <ShopProductGrid count={8} />
        </div>
      </>
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
        paddingTop: '10px', 
        paddingBottom: '0.5rem',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <h4 style={{
          textAlign: 'center',
          margin: '0.5rem 0',
          fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
          color: '#333',
          display: windowWidth <= 576 ? 'block' : 'none'
        }}>Shop by Category</h4>
        <CategorySection>
          <CategoryImage src="/images/category/cat_03.png" alt="Category 1" />
          <CategoryImage src="/images/category/cat_05.png" alt="Category 2" />
          <CategoryImage src="/images/category/cat_07.png" alt="Category 3" />
          <CategoryImage src="/images/category/cat_09.png" alt="Category 4" />
          <CategoryImage src="/images/category/cat_11.png" alt="Category 5" />
          <CategoryImage src="/images/category/cat_13.png" alt="Category 6" />
        </CategorySection>
      </div>
     <div style={{ marginBottom: '1rem' }}>
        {/* Hero images container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* First hero image */}
          <div style={{
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw'
          }}>
            <picture>
              {/* Mobile-optimized image */}
              <source 
                media="(max-width: 576px)" 
                srcSet="/images/homePage/home_11.png"
              />
              {/* Default image */}
              <img 
                src="/images/homePage/home_11.png" 
                alt="Hero Image" 
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }} 
              />
            </picture>
          </div>
          
          {/* Second hero image */}
          <div style={{
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            marginTop: windowWidth <= 576 ? '0' : '-2rem'
          }}>
            <picture>
              {/* Mobile-optimized image */}
              <source 
                media="(max-width: 576px)" 
                srcSet="/images/homePage/home_12.png"
              />
              {/* Default image */}
              <img
                src="/images/homePage/home_12.png"
                alt="Home Section 2"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </picture>
          </div>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          marginBottom: '0.5rem'
        }}>
          <h3 style={{
            margin: '1rem 0 0.5rem',
            fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
            color: '#333'
          }}>Featured Products</h3>
          
          {windowWidth <= 768 && (
            <div style={{
              fontSize: '0.8rem',
              color: '#666',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span>Scroll</span>
              <span style={{ 
                marginLeft: '0.3rem',
                fontSize: '1rem'
              }}>→</span>
            </div>
          )}
        </div>
        
        <ProductGrid>
          {topProducts.map((product) => (
            <div key={product._id} style={{ 
              scrollSnapAlign: 'start',
              flex: '0 0 auto',
              width: windowWidth <= 576 ? '48%' : '85%',
              maxWidth: windowWidth <= 576 ? '220px' : '300px',
              minWidth: windowWidth <= 576 ? '170px' : '200px',
              padding: '0 0.25rem'
            }}>
              <ProductCard product={product} />
            </div>
          ))}
        </ProductGrid>
      </div>
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

      <div style={{ paddingTop: '1rem', paddingBottom: '4rem', overflow: 'hidden' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Featured Categories</h3>
        <div style={{ position: 'relative', width: '100%' }}>
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
      </div>
      <div style={{
        marginTop: '0.2rem',
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}>
        <img
          src="/images/homePage/home_64.png" alt="Home Section 4"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      </div>
      <div style={{ padding: '2rem 1rem' }}>
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row-reverse',
          flexWrap: 'wrap',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>

          <div style={{
            flex: '1',
            minWidth: '280px',
            maxWidth: '500px',
            padding: '0 1rem'
          }}>
            <p style={{
              color: '#4CAF50',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: '600',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Natural & Pure</p>
            <h2 style={{
              color: '#333',
              marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
              marginTop: '0',
              fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
              fontWeight: '700',
              lineHeight: '1.2'
            }}>Welcome to Fusion Moksha</h2>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
            }}>Experience the perfect blend of style and comfort. Our collection features the latest trends in fashion, carefully curated to suit every occasion. From casual to formal, we have everything you need to express your unique style.</p>
            <Link to="/about" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <button style={{
                backgroundColor: 'white',
                color: 'black',
                padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)',
                borderRadius: '4px',
                border: '2px solid black',
                cursor: 'pointer',
                marginTop: 'clamp(0.75rem, 2vw, 1rem)',
                fontWeight: '550',
                transition: 'all 0.3s ease',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                width: '100%',
                maxWidth: '200px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>Know More</button>
            </Link>
          </div>
          <div style={{
            flex: '1',
            minWidth: '280px',
            paddingBottom: 'clamp(1rem, 3vw, 2rem)',
            order: windowWidth <= 768 ? -1 : 0
          }}>
            <img src="/images/homePage/home_67.png" alt="Home Section 5" style={{
              width: 'clamp(70%, 20vw, 60%)',
              maxWidth: '300px',
              height: 'auto',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }} />
          </div>
        </div>
      </div>
     <div style={{ marginTop: '2rem' }}>
        {/* Full-width image container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: windowWidth <= 576 ? '0' : '0.2rem'
        }}>
          {/* First image */}
          <div style={{
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw'
          }}>
            <img
              src="/images/homePage/home_73.png" 
              alt="Home Section 6"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                marginBottom: windowWidth <= 576 ? '0' : '-1rem'
              }}
            />
          </div>
          
          {/* Second image */}
          <div style={{
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw'
          }}>
            <img
              src="/images/homePage/home_74.png" 
              alt="Home Section 6"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
          
          {/* Third image */}
          <div style={{
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            marginTop: windowWidth <= 576 ? '0' : '-2rem'
          }}>
            <img
              src="/images/homePage/home_75.png" 
              alt="Home Section 7"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ padding: '2rem 1rem' }}>
        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)'
        }}>Featured Collections</h3>
        <div style={{
          display: 'flex',
          flexDirection: windowWidth <= 768 ? 'column' : 'row',
          gap: windowWidth <= 768 ? '1.5rem' : '2rem',
          alignItems: 'flex-start',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Left side with big feature */}
          <div style={{
            flex: windowWidth <= 768 ? '1' : '1.2',
            width: '100%'
          }}>
            <FeatureBig {...featuredData.mainFeature} />
          </div>
          
          {/* Right side with three small features */}
          <div style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: windowWidth <= 576 ? '1.5rem' : '1rem',
            width: '100%',
            paddingTop: windowWidth <= 768 ? '0' : '1rem'
          }}>
            {featuredData.features.map((feature, index) => (
              <div key={feature.id} style={{
                paddingTop: index === 0 ? '0' : '',
                borderBottom: windowWidth <= 576 && index < featuredData.features.length - 1 ? '1px solid #eee' : 'none',
                paddingBottom: windowWidth <= 576 ? '1.5rem' : '0'
              }}>
                <FeatureSmall {...feature} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
