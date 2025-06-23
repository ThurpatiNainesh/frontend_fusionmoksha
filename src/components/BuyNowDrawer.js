import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';

// Import checkout step components
import AddressStep from './AddressStep';
import PaymentStep from './PaymentStep';

const BuyNowDrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const BuyNowDrawer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  max-width: 90%;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
  }
`;

const BuyNowDrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const BuyNowDrawerTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const BuyNowCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #333;
  
  &:hover {
    color: #faad14;
  }
`;

const BuyNowDrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const ProductSection = styled.div`
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1.5rem;
`;

const ProductHeader = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1rem;
`;

const ProductItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.h5`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
`;

const ProductMeta = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ProductPrice = styled.div`
  font-weight: bold;
  margin-top: 0.5rem;
`;

const SummarySection = styled.div`
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &.total {
    font-weight: bold;
    font-size: 1.1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
  }
`;

const Button = styled.button`
  background-color: ${props => props.secondary ? '#f5f5f5' : '#faad14'};
  color: ${props => props.secondary ? '#333' : '#fff'};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.secondary ? '#e0e0e0' : '#e69b00'};
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Step = styled.div`
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  background-color: ${props => props.$active ? '#faad14' : props.$completed ? '#f0f0f0' : '#f9f9f9'};
  color: ${props => props.$active ? '#fff' : '#333'};
  font-size: 0.8rem;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  
  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const BuyNowDrawerComponent = ({ isOpen, onClose, product }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  // Reset steps when drawer opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay to avoid visual glitch during closing animation
      setTimeout(() => {
        setCurrentStep(0);
        setCompletedSteps([false, false]);
        setSelectedAddress(null);
        setPaymentMethod('cod');
        setIsProcessing(false);
        setOrderId(null);
      }, 300);
    }
  }, [isOpen]);
  
  // Check if user is authenticated when drawer opens
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      toast.error('Please login to continue with Buy Now');
      onClose();
      // Redirect to login page with return URL
      // This would be handled by the parent component
    }
  }, [isOpen, isAuthenticated, onClose]);
  
  const handleStepClick = (step) => {
    // Only allow navigation to completed steps or the next step
    if (completedSteps[step] || step === 0 || completedSteps[step - 1]) {
      setCurrentStep(step);
    }
  };
  
  const handleNextStep = () => {
    // Mark current step as completed
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentStep] = true;
    setCompletedSteps(newCompletedSteps);
    
    // Move to next step
    setCurrentStep(currentStep + 1);
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleComplete = () => {
    onClose();
  };
  
  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
  };
  
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };
  
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Get the selected address details from the AddressStep component
      // This would be passed up from the AddressStep component
      
      // Format address for API
      const formattedAddress = {
        // This would be populated with the selected address details
      };
      
      // Call the buy-now API endpoint
      const response = await axios.post(
        'https://fusionmokshabackend-production.up.railway.app/api/orders/buy-now',
        {
          product: {
            productId: product.productId,
            weight: product.weight,
            quantity: product.quantity
          },
          address: formattedAddress,
          paymentMethod: paymentMethod.toUpperCase()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Handle successful order
      setOrderId(response.data.orderId);
      
      // If payment method is COD, we're done
      if (paymentMethod.toUpperCase() === 'COD') {
        toast.success('Order placed successfully!');
        handleComplete();
      } else {
        // For online payment, handle payment processing
        // This would be implemented in the PaymentStep component
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get step title based on current step
  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return t('deliveryAddress', 'Delivery Address');
      case 1:
        return t('payment', 'Payment');
      default:
        return t('buyNow', 'Buy Now');
    }
  };
  
  // Render product summary
  const renderProductSummary = () => {
    if (!product) return null;
    
    return (
      <ProductSection>
        <ProductHeader>Product</ProductHeader>
        <ProductItem>
          <ProductImage 
            src={product.image || '/images/default-product.png'} 
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/default-product.png';
            }}
          />
          <ProductDetails>
            <ProductName>{product.name}</ProductName>
            <ProductMeta>
              {product.weight.value} {product.weight.unit} × {product.quantity}
            </ProductMeta>
            <ProductPrice>
              ₹{(product.price * product.quantity).toFixed(2)}
            </ProductPrice>
          </ProductDetails>
        </ProductItem>
      </ProductSection>
    );
  };
  
  // Render order summary
  const renderOrderSummary = () => {
    if (!product) return null;
    
    const subtotal = product.price * product.quantity;
    
    return (
      <SummarySection>
        <ProductHeader>Order Summary</ProductHeader>
        <SummaryRow>
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Shipping</span>
          <span>Free</span>
        </SummaryRow>
        <SummaryRow className="total">
          <span>Total</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </SummaryRow>
      </SummarySection>
    );
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            {renderProductSummary()}
            {renderOrderSummary()}
            <AddressStep 
              onProceed={handleNextStep} 
              onAddressSelect={handleAddressSelect}
              selectedAddress={selectedAddress}
            />
          </>
        );
      case 1:
        return (
          <>
            {renderProductSummary()}
            {renderOrderSummary()}
            <PaymentStep 
              onComplete={handlePlaceOrder} 
              onBack={handlePreviousStep}
              onPaymentMethodSelect={handlePaymentMethodSelect}
              selectedPaymentMethod={paymentMethod}
              isProcessing={isProcessing}
            />
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <>
      <BuyNowDrawerOverlay $isOpen={isOpen} onClick={onClose} />
      <BuyNowDrawer $isOpen={isOpen}>
        <BuyNowDrawerHeader>
          <BuyNowDrawerTitle>{getStepTitle()}</BuyNowDrawerTitle>
          <BuyNowCloseButton onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </BuyNowCloseButton>
        </BuyNowDrawerHeader>
        
        <BuyNowDrawerContent>
          <StepIndicator>
            <Step 
              $active={currentStep === 0} 
              $completed={completedSteps[0]}
              $clickable={true}
              onClick={() => handleStepClick(0)}
            >
              Address
            </Step>
            <Step 
              $active={currentStep === 1} 
              $completed={completedSteps[1]}
              $clickable={completedSteps[0]}
              onClick={() => completedSteps[0] && handleStepClick(1)}
            >
              Payment
            </Step>
          </StepIndicator>
          {renderStepContent()}
        </BuyNowDrawerContent>
      </BuyNowDrawer>
    </>
  );
};

export default BuyNowDrawerComponent;
