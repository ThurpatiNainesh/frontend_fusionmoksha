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
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { topProducts, loading, error } = useSelector((state) => ({
    topProducts: state.products.topProducts || [],
    loading: state.products.loading,
    error: state.products.error
  }));

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
          src="/images/homePage/home_11.png" 
          alt="Hero Image" 
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }} 
        />
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
          src="/images/homePage/home_12.png"
          alt="Home Section 2"
          style={{
            marginTop:"-2rem",
            height: 'auto',
            display: 'block'
          }}
        />
      </div>
      <ProductGrid>
        {topProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
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

      <div style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
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
      <div style={{ paddingTop: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row-reverse'
        }}>

          <div style={{
            flex: '1',
            maxWidth: '500px',
            padding: '0 2rem'
          }}>
            <p style={{
              color: '#4CAF50',
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Natural & Pure</p>
            <h2 style={{
              color: '#333',
              marginBottom: '1rem',
              marginTop: '0',
              fontSize: '2.25rem',
              fontWeight: '700'
            }}>Welcome to Fusion Moksha</h2>
            <p style={{
              color: '#666',
              lineHeight: '1.6'
            }}>Experience the perfect blend of style and comfort. Our collection features the latest trends in fashion, carefully curated to suit every occasion. From casual to formal, we have everything you need to express your unique style.</p>
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: 'white',
                color: 'black',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: '2px solid black',
                cursor: 'pointer',
                marginTop: '1rem',
                fontWeight: '550',
                transition: 'all 0.3s ease'
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
          src="/images/homePage/home_73.png" alt="Home Section 6"
          style={{
            marginBottom:"-1rem",
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
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
          src="/images/homePage/home_74.png" alt="Home Section 6"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      </div>
      <div style={{
        marginTop: '-2rem',
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}>
        <img
          src="/images/homePage/home_75.png" alt="Home Section 7"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      </div>
      <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'flex-start',
          height: '100%'
        }}>
          {/* Left side with big feature */}
          <FeatureBig {...featuredData.mainFeature} />
          
          {/* Right side with three small features */}
          <div style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '100%',
            maxHeight: '100%',
            paddingTop: '1rem'
          }}>
            {featuredData.features.map((feature, index) => (
              <div key={feature.id} style={index === 0 ? { paddingTop: '0' } : {}}>
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
