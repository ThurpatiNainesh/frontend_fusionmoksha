import React, { useState, useEffect } from 'react';
import { FeatureImageContainer, ReadMoreButton } from './FeatureStyles';

const FeatureSmall = ({ image, title, description, buttonText }) => {
  // Use React state to track window width
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const isMobile = windowWidth <= 576;
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div style={{
      flex: '1',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '0.75rem' : '1rem',
      alignItems: isMobile ? 'center' : 'flex-start',
      padding: isMobile ? '0.5rem 0' : '0 1rem 1rem 1rem',
      paddingTop: '0',
      textAlign: isMobile ? 'center' : 'left'
    }}>
      <FeatureImageContainer style={{
        width: isMobile ? '140px' : '100px',
        height: isMobile ? '180px' : '135px',
        marginBottom: isMobile ? '0.5rem' : '0'
      }}>
        <img src={image} alt={title} />
      </FeatureImageContainer>
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: isMobile ? 'center' : 'flex-start'
      }}>
        <h4 style={{
          color: '#333',
          marginBottom: '0.5rem',
          fontSize: 'clamp(1rem, 3vw, 1.1rem)',
          fontWeight: '600'
        }}>{title}</h4>
        <p style={{
          color: '#666',
          lineHeight: '1.4',
          marginBottom: '0.75rem',
          fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
          maxWidth: isMobile ? '90%' : '100%'
        }}>{description}</p>
        <ReadMoreButton>{buttonText}</ReadMoreButton>
      </div>
    </div>
  );
};

export default FeatureSmall;
