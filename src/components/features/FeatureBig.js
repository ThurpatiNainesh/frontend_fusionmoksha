import React from 'react';
import { ReadMoreButton } from './FeatureStyles';

const FeatureBig = ({ image, title, description, buttonText }) => {
  return (
    <div style={{
      flex: '1',
      maxWidth: '600px',
      height: '100%'
    }}>
      <div style={{
        height: 'calc(100% - 100px)',
        marginBottom: '1rem',
        overflow: 'hidden'
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
      <div style={{ paddingTop: '1rem' }}>
        <h3 style={{
          color: '#333',
          marginBottom: '0.5rem'
        }}>{title}</h3>
        <p style={{
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '0.5rem'
        }}>{description}</p>
        <div style={{ marginTop: '0.5rem' }}>
          <ReadMoreButton>{buttonText}</ReadMoreButton>
        </div>
      </div>
    </div>
  );
};

export default FeatureBig;
