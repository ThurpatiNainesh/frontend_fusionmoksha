import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CardWrapper = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Price = styled.p`
  color: #faad14;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0;
`;

const Card = ({ product }) => {
  return (
    <Link to={`/shop/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <CardWrapper>
        <Image src={product.image} alt={product.name} />
        <Content>
          <Title>{product.name}</Title>
          <Price>₹{product.price}</Price>
        </Content>
      </CardWrapper>
    </Link>
  );
};

export default Card;
