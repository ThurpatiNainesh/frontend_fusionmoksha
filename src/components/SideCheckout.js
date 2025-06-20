import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../store/productSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { fetchCartItems } from '../store/cartSlice';

// Import checkout step components
import CheckoutSteps from './CheckoutSteps';
import CartStep from './CartStep';
import AddressStep from './AddressStep';
import OrderStep from './OrderStep';
import PaymentStep from './PaymentStep';

const CheckoutDrawerOverlay = styled.div`
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

const CheckoutDrawer = styled.div`
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

const CheckoutDrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const CheckoutDrawerTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
`;

const CheckoutCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const CheckoutDrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const SideCheckout = ({ isOpen, onClose, productCache = {} }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false]);
  
  // Reset steps when drawer opens/closes and ensure data consistency when closing
  useEffect(() => {
    if (!isOpen) {
      // Small delay to avoid visual glitch during closing animation
      setTimeout(() => {
        setCurrentStep(0);
        setCompletedSteps([false, false, false, false]);
        
        // When side cart is closed, ensure we have the latest data from the backend
        // For authenticated users, refresh the cart data
        if (isAuthenticated) {
          dispatch(fetchCartItems());
        }
      }, 300);
    }
  }, [isOpen, dispatch, isAuthenticated]);
  
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
  
  // Get step title based on current step
  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return t('yourCart', 'Your Cart');
      case 1:
        return t('deliveryAddress', 'Delivery Address');
      case 2:
        return t('orderSummary', 'Order Summary');
      case 3:
        return t('payment', 'Payment');
      default:
        return t('checkout', 'Checkout');
    }
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <CartStep onProceed={handleNextStep} productCache={productCache} />;
      case 1:
        return <AddressStep onProceed={handleNextStep} onBack={handlePreviousStep} />;
      case 2:
        return <OrderStep onProceed={handleNextStep} onBack={handlePreviousStep} />;
      case 3:
        return <PaymentStep onComplete={handleComplete} onBack={handlePreviousStep} />;
      default:
        return <CartStep onProceed={handleNextStep} productCache={productCache} />;
    }
  };
  
  return (
    <>
      <CheckoutDrawerOverlay $isOpen={isOpen} onClick={onClose} />
      <CheckoutDrawer $isOpen={isOpen}>
        <CheckoutDrawerHeader>
          <CheckoutDrawerTitle>{getStepTitle()}</CheckoutDrawerTitle>
          <CheckoutCloseButton onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </CheckoutCloseButton>
        </CheckoutDrawerHeader>
        
        <CheckoutDrawerContent>
          <CheckoutSteps 
            currentStep={currentStep} 
            onStepClick={handleStepClick} 
            completedSteps={completedSteps} 
          />
          {renderStepContent()}
        </CheckoutDrawerContent>
      </CheckoutDrawer>
    </>
  );
};

export default SideCheckout;
