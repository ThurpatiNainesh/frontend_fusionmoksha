import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faAddressCard, faFileInvoice, faCreditCard, faCheck } from '@fortawesome/free-solid-svg-icons';

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 25px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #e0e0e0;
    z-index: 0;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  opacity: ${props => props.$active || props.$completed ? 1 : 0.6};
`;

const StepIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.$completed ? '#4caf50' : props.$active ? '#2196f3' : '#f5f5f5'};
  color: ${props => props.$completed || props.$active ? 'white' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
`;

const StepLabel = styled.div`
  font-size: 12px;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  color: ${props => props.$active ? '#2196f3' : props.$completed ? '#4caf50' : '#666'};
`;

/**
 * Component to display checkout steps with progress indicators
 * @param {Object} props
 * @param {number} props.currentStep - Current active step (0: Cart, 1: Address, 2: Order, 3: Payment)
 * @param {Function} props.onStepClick - Function to call when a step is clicked
 * @param {Array<boolean>} props.completedSteps - Array indicating which steps are completed
 */
const CheckoutSteps = ({ currentStep, onStepClick, completedSteps = [false, false, false, false] }) => {
  const steps = [
    { name: 'Cart', icon: faShoppingCart },
    { name: 'Address', icon: faAddressCard },
    { name: 'Order', icon: faFileInvoice },
    { name: 'Payment', icon: faCreditCard }
  ];

  return (
    <StepsContainer>
      {steps.map((step, index) => {
        const isCompleted = completedSteps[index];
        const isActive = currentStep === index;
        // A step is clickable if it's completed or it's the next step after the last completed step
        const isClickable = isCompleted || index === 0 || completedSteps[index - 1];
        
        return (
          <Step 
            key={index} 
            $active={isActive} 
            $completed={isCompleted}
            $clickable={isClickable}
            onClick={() => isClickable && onStepClick(index)}
          >
            <StepIcon $active={isActive} $completed={isCompleted}>
              {isCompleted ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={step.icon} />
              )}
            </StepIcon>
            <StepLabel $active={isActive} $completed={isCompleted}>
              {step.name}
            </StepLabel>
          </Step>
        );
      })}
    </StepsContainer>
  );
};

export default CheckoutSteps;
