import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheck } from '@fortawesome/free-solid-svg-icons';
import { addToCart } from '../store/cartSlice';

const Button = styled.button`
  background-color: ${props => props.$added ? '#4CAF50' : '#2e7d32'};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-width: 140px;

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

const AddToCartButton = ({ product, weight, quantity = 1, className }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.cart);

  const handleAddToCart = async () => {
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
      disabled={isAdding || loading}
      className={className}
      $added={isAdded}
      aria-label={isAdded ? 'Added to cart' : 'Add to cart'}
    >
      {isAdding ? (
        'Adding...'
      ) : isAdded ? (
        <>
          <FontAwesomeIcon icon={faCheck} />
          Added
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faShoppingCart} />
          Add to Cart
        </>
      )}
    </Button>
  );
};

export default AddToCartButton;
