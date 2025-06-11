import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const AddToCartButton = ({ children }) => {
  return <Button>{children}</Button>;
};

export default AddToCartButton;
