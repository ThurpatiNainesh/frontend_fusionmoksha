import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import BuyNowDrawer from './BuyNowDrawer';

const BuyNowButtonStyled = styled(Button)`
  background-color: #FF9900;
  color: #000;
  border: 1px solid #FF9900;
  border-radius: 20px;
  font-weight: 500;
  text-transform: none;
  padding: 8px 16px;
  min-width: 120px;
  
  &:hover {
    background-color: #F7CA00;
    border-color: #F2C200;
  }
  
  &:active {
    background-color: #F0B800;
    border-color: #008296;
    box-shadow: 0 0 0 3px #c8f3fa;
    outline: 0;
  }
  
  &.Mui-disabled {
    background-color: #e7e7e7;
    color: #767676;
    border-color: #e7e7e7;
  }
`;

const BuyNowButton = ({ product, weight, variant, quantity = 1, className, style }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  
  // Handle Buy Now action
  const handleBuyNow = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.info('Please login to continue with purchase');
      navigate('/login', { 
        state: { 
          from: window.location.pathname,
          buyNowProduct: {
            productId: product._id,
            weight: weight || product.variants[0].weight,
            quantity: quantity,
            variant: variant || product.variants[0]
          }
        } 
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Get the selected variant
      const selectedWeight = weight || product.variants[0].weight;
      const selectedVariant = variant || product.variants.find(v => 
        v.weight.value === selectedWeight.value && v.weight.unit === selectedWeight.unit
      );
      
      if (!selectedVariant) {
        toast.error('Selected product variant not available');
        return;
      }
      
      // Prepare product data for checkout
      const productData = {
        productId: product._id,
        weight: selectedWeight,
        quantity: quantity,
        price: selectedVariant.price,
        originalPrice: selectedVariant.originalPrice,
        discountPrice: selectedVariant.discountPrice,
        savings: selectedVariant.savings,
        savingsPercentage: selectedVariant.savingsPercentage,
        image: selectedVariant.image || product.mainImage,
        name: product.name
      };
      
      // Set the product data and open the drawer
      setBuyNowProduct(productData);
      setIsDrawerOpen(true);
      
    } catch (error) {
      console.error('Error processing buy now:', error);
      toast.error('Failed to process your request');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };
  
  return (
    <>
      <BuyNowButtonStyled
        variant="contained"
        onClick={handleBuyNow}
        disabled={isProcessing}
        className={className}
        style={style}
      >
        Buy Now
      </BuyNowButtonStyled>
      
      {/* Buy Now Drawer */}
      {buyNowProduct && (
        <BuyNowDrawer 
          isOpen={isDrawerOpen} 
          onClose={handleCloseDrawer} 
          product={buyNowProduct} 
        />
      )}
    </>
  );
};

export default BuyNowButton;
