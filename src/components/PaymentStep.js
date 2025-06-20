import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faCreditCard, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { clearCart } from '../store/cartSlice';

const PaymentContainer = styled.div`
  padding: 1rem 0;
`;

const PaymentTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const PaymentStatus = styled.div`
  text-align: center;
  padding: 2rem 0;
`;

const StatusIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.$success ? '#4caf50' : props.$loading ? '#2196f3' : '#f44336'};
  margin-bottom: 1rem;
  animation: ${props => props.$loading ? 'spin 2s linear infinite' : 'none'};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StatusMessage = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const StatusDetails = styled.div`
  color: #666;
  margin-bottom: 2rem;
`;

const OrderDetails = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  margin: 1.5rem 0;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: ${props => props.$primary ? '#2e7d32' : '#757575'};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.$primary ? '#1b5e20' : '#616161'};
  }
`;

const CardForm = styled.div`
  margin: 1.5rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const PaymentStep = ({ onComplete, onBack }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  
  // Get order details from localStorage
  const orderId = localStorage.getItem('currentOrderId');
  const guestOrderString = localStorage.getItem('guestOrder');
  const guestOrder = guestOrderString ? JSON.parse(guestOrderString) : null;
  
  useEffect(() => {
    // For authenticated users with COD, we can check order status
    if (isAuthenticated && orderId) {
      checkPaymentStatus();
    }
  }, [isAuthenticated, orderId]);
  
  const checkPaymentStatus = async () => {
    try {
      const response = await api.get(`/api/payments/${orderId}/status`);
      
      if (response.data && response.data.success) {
        const status = response.data.paymentStatus || response.data.status;
        
        if (status === 'completed') {
          setPaymentStatus('success');
          setPaymentDetails({
            orderId,
            status: 'completed',
            timestamp: new Date().toISOString()
          });
          // Clear cart on successful payment
          dispatch(clearCart());
        } else if (status === 'initiated' || status === 'processing' || status === 'pending') {
          setPaymentStatus('pending');
          // Check again in 3 seconds
          setTimeout(checkPaymentStatus, 3000);
        } else {
          setPaymentStatus('failed');
        }
      }
    } catch (error) {
      console.error('Failed to check payment status:', error);
      // If there's an error, we'll try again in 5 seconds
      setTimeout(checkPaymentStatus, 5000);
    }
  };
  
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePayment = async () => {
    // Basic validation
    if (!cardData.cardNumber || !cardData.cardName || !cardData.expiry || !cardData.cvv) {
      toast.error('Please fill all card details');
      return;
    }
    
    setPaymentStatus('processing');
    
    try {
      if (isAuthenticated && orderId) {
        // Step 1: Create payment intent
        const createIntentResponse = await api.post('/api/payments/create-intent', { orderId });
        
        if (!createIntentResponse.data || !createIntentResponse.data.success) {
          throw new Error('Failed to create payment intent');
        }
        
        const { clientSecret, publicKey } = createIntentResponse.data;
        
        if (!clientSecret) {
          throw new Error('Invalid payment intent response');
        }
        
        // Extract the payment intent ID from the client secret
        const paymentIntentId = clientSecret.split('_secret_')[0];
        
        // In a real application, this is where you would use a payment gateway SDK
        // For this simulation, we'll directly confirm the payment after a short delay
        toast.info('Processing payment...');
        
        // Simulate payment processing delay
        setTimeout(async () => {
          try {
            // Step 2: Confirm payment
            const confirmResponse = await api.post('/api/payments/confirm', {
              paymentIntentId,
              forceSuccess: true // For testing, force success
            });
            
            if (!confirmResponse.data || !confirmResponse.data.success) {
              throw new Error('Payment confirmation failed');
            }
            
            const { paymentStatus, orderStatus } = confirmResponse.data;
            
            if (paymentStatus === 'completed') {
              setPaymentStatus('success');
              setPaymentDetails({
                orderId,
                status: 'completed',
                timestamp: new Date().toISOString()
              });
              dispatch(clearCart());
              toast.success('Payment successful!');
            } else {
              setPaymentStatus('failed');
              toast.error(`Payment failed: ${paymentStatus}`);
            }
          } catch (error) {
            console.error('Payment confirmation error:', error);
            setPaymentStatus('failed');
            toast.error('Payment failed: ' + (error.message || 'Unknown error'));
          }
        }, 2000);
      } else if (!isAuthenticated) {
        // For guest users, simulate payment
        setTimeout(() => {
          setPaymentStatus('success');
          setPaymentDetails({
            amount: guestOrder?.total,
            paymentMethod: 'card',
            status: 'paid',
            createdAt: new Date().toISOString()
          });
          
          // Clear guest cart
          localStorage.removeItem('guestCart');
          dispatch(clearCart());
          toast.success('Payment successful!');
        }, 2000);
      }
    } catch (error) {
      setPaymentStatus('failed');
      toast.error('Payment failed: ' + (error.response?.data?.message || error.message));
    }
  };
  
  const renderPaymentForm = () => {
    return (
      <CardForm>
        <FormGroup>
          <Label>Card Number</Label>
          <Input 
            type="text" 
            name="cardNumber" 
            placeholder="1234 5678 9012 3456" 
            value={cardData.cardNumber}
            onChange={handleCardInputChange}
            maxLength={19}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Cardholder Name</Label>
          <Input 
            type="text" 
            name="cardName" 
            placeholder="John Doe" 
            value={cardData.cardName}
            onChange={handleCardInputChange}
          />
        </FormGroup>
        
        <FormRow>
          <FormGroup>
            <Label>Expiry Date</Label>
            <Input 
              type="text" 
              name="expiry" 
              placeholder="MM/YY" 
              value={cardData.expiry}
              onChange={handleCardInputChange}
              maxLength={5}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>CVV</Label>
            <Input 
              type="text" 
              name="cvv" 
              placeholder="123" 
              value={cardData.cvv}
              onChange={handleCardInputChange}
              maxLength={3}
            />
          </FormGroup>
        </FormRow>
        
        <ActionButton 
          $primary 
          onClick={handlePayment}
          disabled={paymentStatus === 'processing'}
        >
          {paymentStatus === 'processing' ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin />
              Processing...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCreditCard} />
              Pay Now
            </>
          )}
        </ActionButton>
        
        <ActionButton onClick={onBack} disabled={paymentStatus === 'processing'}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Order
        </ActionButton>
      </CardForm>
    );
  };
  
  const renderPaymentStatus = () => {
    const orderDetails = isAuthenticated ? null : guestOrder;
    
    return (
      <PaymentStatus>
        <StatusIcon 
          $success={paymentStatus === 'success'} 
          $loading={paymentStatus === 'processing'}
        >
          {paymentStatus === 'success' && <FontAwesomeIcon icon={faCheckCircle} />}
          {paymentStatus === 'processing' && <FontAwesomeIcon icon={faSpinner} />}
          {paymentStatus === 'failed' && <FontAwesomeIcon icon={faCreditCard} />}
        </StatusIcon>
        
        <StatusMessage>
          {paymentStatus === 'success' && 'Payment Successful!'}
          {paymentStatus === 'processing' && 'Processing Payment...'}
          {paymentStatus === 'failed' && 'Payment Failed'}
        </StatusMessage>
        
        <StatusDetails>
          {paymentStatus === 'success' && 'Your order has been placed successfully.'}
          {paymentStatus === 'processing' && 'Please wait while we process your payment.'}
          {paymentStatus === 'failed' && 'There was an issue processing your payment. Please try again.'}
        </StatusDetails>
        
        {paymentStatus === 'success' && (
          <OrderDetails>
            <OrderItem>
              <div>Order ID:</div>
              <div>{orderId || guestOrder?._id || 'N/A'}</div>
            </OrderItem>
            
            <OrderItem>
              <div>Payment Method:</div>
              <div>{paymentDetails?.paymentMethod || 'Card'}</div>
            </OrderItem>
            
            <OrderItem>
              <div>Date:</div>
              <div>{new Date(paymentDetails?.createdAt || Date.now()).toLocaleDateString()}</div>
            </OrderItem>
            
            <OrderTotal>
              <div>Amount Paid:</div>
              <div>₹{paymentDetails?.amount || orderDetails?.total || '0.00'}</div>
            </OrderTotal>
          </OrderDetails>
        )}
        
        {paymentStatus === 'success' && (
          <ActionButton $primary onClick={onComplete}>
            Continue Shopping
          </ActionButton>
        )}
        
        {paymentStatus === 'failed' && (
          <>
            <ActionButton $primary onClick={handlePayment}>
              Try Again
            </ActionButton>
            <ActionButton onClick={onBack}>
              Back to Order
            </ActionButton>
          </>
        )}
      </PaymentStatus>
    );
  };
  
  return (
    <PaymentContainer>
      <PaymentTitle>
        {paymentStatus === 'pending' && 'Payment Details'}
        {paymentStatus === 'processing' && 'Processing Payment'}
        {paymentStatus === 'success' && 'Payment Successful'}
        {paymentStatus === 'failed' && 'Payment Failed'}
      </PaymentTitle>
      
      {paymentStatus === 'pending' && renderPaymentForm()}
      {(paymentStatus === 'processing' || paymentStatus === 'success' || paymentStatus === 'failed') && 
        renderPaymentStatus()}
    </PaymentContainer>
  );
};

export default PaymentStep;
