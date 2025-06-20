import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import api from '../utils/api';
import axios from 'axios';

const OrderContainer = styled.div`
  padding: 1rem 0;
`;

const OrderTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const OrderSummary = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
`;

const AddressCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const AddressTitle = styled.div`
  font-weight: 600;
`;

const ChangeButton = styled.button`
  background: none;
  border: none;
  color: #2196f3;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProceedButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: #1b5e20;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #757575;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #616161;
  }
`;

const PaymentMethodContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const PaymentMethodTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem;
  border: 1px solid ${props => props.$selected ? '#2e7d32' : '#e0e0e0'};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  background-color: ${props => props.$selected ? '#f1f8e9' : 'white'};
  
  &:hover {
    border-color: ${props => props.$selected ? '#2e7d32' : '#bdbdbd'};
  }
`;

const RadioButton = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${props => props.$selected ? '#2e7d32' : '#bdbdbd'};
  margin-right: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.$selected ? '#2e7d32' : 'transparent'};
  }
`;

const OrderStep = ({ onProceed, onBack }) => {
  const { items: cartItems } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  
  // Get selected address from localStorage
  const selectedAddressString = localStorage.getItem('selectedAddress');
  const selectedAddress = selectedAddressString ? JSON.parse(selectedAddressString) : null;
  
  // Calculate order summary
  const subtotal = cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      onBack();
      return;
    }
    
    setLoading(true);
    try {
      // For authenticated users, call the API
      if (isAuthenticated) {
        // Format cart items as expected by the API
        const formattedCartItems = cartItems.map(item => ({
          productId: item.productId || (item.product && item.product._id),
          weight: item.weight || { value: 100, unit: 'g' },
          quantity: item.quantity
        }));
        
        // Format address data
        const addressData = {
          name: selectedAddress.name || selectedAddress.fullName,
          phone: selectedAddress.phone,
          address: selectedAddress.address || selectedAddress.addressLine1 + (selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''),
          pincode: selectedAddress.pincode,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country || 'India',
          isDefault: selectedAddress.isDefault
        };
        
        // Prepare order data according to backend API expectations
        const orderData = {
          cartItems: formattedCartItems,
          address: addressData, // Backend expects a single address object
          paymentMethod: selectedPaymentMethod === 'Cash on Delivery' ? 'COD' : 'ONLINE'
        };
        
        console.log('Sending order data:', orderData);
        
        const response = await api.post('/api/orders', orderData);
        
        if (response.data && (response.data.success || response.data.data)) {
          // Store order ID for payment step
          const orderId = response.data.data?.orderId || response.data.data?._id;
          localStorage.setItem('currentOrderId', orderId);
          
          // If payment method is COD, we're done
          if (selectedPaymentMethod === 'Cash on Delivery') {
            toast.success('Order placed successfully!');
            onProceed();
          } else {
            // For online payment, proceed to payment step
            toast.success('Order created. Proceeding to payment...');
            onProceed({
              orderId,
              requiresPayment: true
            });
          }
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        // For guest users, create a temporary order in localStorage
        const guestOrder = {
          _id: 'guest-order-' + Date.now(),
          items: cartItems,
          address: selectedAddress,
          paymentMethod: selectedPaymentMethod,
          subtotal,
          shipping,
          tax,
          total,
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('guestOrder', JSON.stringify(guestOrder));
        toast.success('Order created successfully');
        onProceed();
      }
    } catch (error) {
      toast.error('Failed to place order: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <OrderContainer>
      <OrderTitle>Order Summary</OrderTitle>
      
      <OrderSummary>
        {cartItems.map(item => (
          <OrderItem key={item._id}>
            <div>{item.quantity} x {item.productName || item.name}</div>
            <div>₹{((item.price || 0) * item.quantity).toFixed(2)}</div>
          </OrderItem>
        ))}
        
        <OrderItem>
          <div>Subtotal</div>
          <div>₹{subtotal.toFixed(2)}</div>
        </OrderItem>
        
        <OrderItem>
          <div>Shipping</div>
          <div>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</div>
        </OrderItem>
        
        <OrderItem>
          <div>Tax (18% GST)</div>
          <div>₹{tax.toFixed(2)}</div>
        </OrderItem>
        
        <OrderTotal>
          <div>Total</div>
          <div>₹{total.toFixed(2)}</div>
        </OrderTotal>
      </OrderSummary>
      
      {selectedAddress && (
        <AddressCard>
          <AddressHeader>
            <AddressTitle>Delivery Address</AddressTitle>
            <ChangeButton onClick={onBack}>Change</ChangeButton>
          </AddressHeader>
          
          <div>{selectedAddress.fullName}</div>
          <div>{selectedAddress.phone}</div>
          <div>
            {selectedAddress.addressLine1}
            {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
          </div>
          <div>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</div>
        </AddressCard>
      )}
      
      <PaymentMethodContainer>
        <PaymentMethodTitle>Select Payment Method</PaymentMethodTitle>
        
        <PaymentOption 
          $selected={selectedPaymentMethod === 'card'}
          onClick={() => setSelectedPaymentMethod('card')}
        >
          <RadioButton $selected={selectedPaymentMethod === 'card'} />
          <div>Credit/Debit Card</div>
        </PaymentOption>
        
        <PaymentOption 
          $selected={selectedPaymentMethod === 'upi'}
          onClick={() => setSelectedPaymentMethod('upi')}
        >
          <RadioButton $selected={selectedPaymentMethod === 'upi'} />
          <div>UPI Payment</div>
        </PaymentOption>
        
        <PaymentOption 
          $selected={selectedPaymentMethod === 'cod'}
          onClick={() => setSelectedPaymentMethod('cod')}
        >
          <RadioButton $selected={selectedPaymentMethod === 'cod'} />
          <div>Cash on Delivery</div>
        </PaymentOption>
      </PaymentMethodContainer>
      
      <ProceedButton 
        onClick={handlePlaceOrder}
        disabled={loading || !selectedAddress}
      >
        {loading ? 'Processing...' : 'Place Order'}
      </ProceedButton>
      
      <BackButton onClick={onBack} disabled={loading}>
        Back to Address
      </BackButton>
    </OrderContainer>
  );
};

export default OrderStep;
