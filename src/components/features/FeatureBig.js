import React from 'react';
import { ReadMoreButton } from './FeatureStyles';

const FeatureBig = ({ image, title, description, buttonText }) => {
  return (
    <div style={{
      flex: '1',
      maxWidth: '100%',
      height: 'auto'
    }}>
      <div style={{
        height: 'auto',
        minHeight: '250px',
        maxHeight: '400px',
        marginBottom: '1rem',
        overflow: 'hidden',
        borderRadius: '4px'
      }}>
        <img 
          src={image} 
          alt={title} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }} 
        />
      </div>
      <div style={{ padding: '0.5rem 0.5rem 1rem' }}>
        <h3 style={{
          color: '#333',
          marginBottom: '0.75rem',
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
          fontWeight: '600'
        }}>{title}</h3>
        <p style={{
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '0.75rem',
          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
        }}>{description}</p>
        <div style={{ marginTop: '0.75rem' }}>
          <ReadMoreButton>{buttonText}</ReadMoreButton>
        </div>
      </div>
    </div>
  );
};

export default FeatureBig;
