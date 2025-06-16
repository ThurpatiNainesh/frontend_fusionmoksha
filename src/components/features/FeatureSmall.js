import React from 'react';
import { FeatureImageContainer, ReadMoreButton } from './FeatureStyles';

const FeatureSmall = ({ image, title, description, buttonText }) => {
  return (
    <div style={{
      flex: '1',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start',
      padding: '0 1rem 1rem 1rem',
      paddingTop: '0'
    }}>
      <FeatureImageContainer>
        <img src={image} alt={title} />
      </FeatureImageContainer>
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
        }}>{title}</h4>
        <p style={{
          color: '#666',
          lineHeight: '1.4',
          marginBottom: '1rem'
        }}>{description}</p>
        <ReadMoreButton>{buttonText}</ReadMoreButton>
      </div>
    </div>
  );
};

export default FeatureSmall;
