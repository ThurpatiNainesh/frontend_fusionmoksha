import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getTopProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';


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
  height: 375px;
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
  padding: 2rem 0;
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
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading featured products...</h2>
      </div>
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
        {topProducts.slice(0, 3).map((product) => (
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
