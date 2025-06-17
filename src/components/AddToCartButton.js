import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { addToCart } from '../store/cartSlice';

const Button = styled.button`
  background-color: ${props => props.$added ? '#4CAF50' : props.theme.primary || '#2e7d32'};
  color: white;
  padding: ${props => props.$style?.padding || '10px 20px'};
  border: ${props => props.$style?.border || 'none'};
  border-radius: ${props => props.$style?.borderRadius || '8px'};
  cursor: pointer;
  font-size: ${props => props.$style?.fontSize || '14px'};
  font-weight: ${props => props.$style?.fontWeight || '500'};
  display: inline-block;
  text-align: center;
  transition: all 0.3s ease;
  min-width: ${props => props.$style?.minWidth || '140px'};
  width: ${props => props.$style?.width || 'auto'};
  ${props => props.$style?.hover ? `&:hover { ${Object.entries(props.$style.hover).map(([key, val]) => `${key}: ${val};`).join('')} }` : ''}

  &:hover {
    background-color: ${props => props.$added ? '#43a047' : '#1b5e20'};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const AddToCartButton = ({ product, weight, variant, quantity = 1, className, style }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent default action
    e.stopPropagation(); // Stop event propagation
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      setIsAdding(true);
      await dispatch(addToCart({
        productId: product._id,
        weight: weight || product.variants[0].weight,
        quantity
      })).unwrap();
      
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      $added={isAdded}
      className={className}
      $style={style}
    >
      {isAdding ? 'Adding...' : isAdded ? 'Added to Cart' : 'Add to Cart'}
    </Button>
  );
};

export default AddToCartButton;
