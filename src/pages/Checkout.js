import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { clearCart } from '../store/cartSlice';
import api from '../utils/api';

// Import components
import CartStep from '../components/CartStep';
import OrderStep from '../components/OrderStep';
import PaymentStep from '../components/PaymentStep';
import CheckoutSteps from '../components/CheckoutSteps';

// Styled components
const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const CheckoutHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckoutTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CheckoutSummary = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  font-size: 1rem;

  &.total {
    font-size: 1.2rem;
    font-weight: bold;
    border-top: 1px solid #eee;
    padding-top: 1rem;
    margin-top: 1.5rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${props => props.secondary ? '#f5f5f5' : '#2e7d32'};
  color: ${props => props.secondary ? '#333' : 'white'};
  border: ${props => props.secondary ? '1px solid #ddd' : 'none'};
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.secondary ? '#e0e0e0' : '#1b5e20'};
  }

  &:disabled {
    background: ${props => props.secondary ? '#f9f9f9' : '#a5d6a7'};
    cursor: not-allowed;
  }
`;

const AddressSection = styled.div`
  margin-bottom: 2rem;
`;

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const AddressCard = styled.div`
  border: 1px solid ${props => props.selected ? '#2e7d32' : '#ddd'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  background: ${props => props.selected ? '#f1f8e9' : 'white'};
  position: relative;
  
  &:hover {
    border-color: ${props => props.selected ? '#2e7d32' : '#aaa'};
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
`;

const AddressCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const AddressName = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

const AddressDefault = styled.span`
  font-size: 0.8rem;
  background: #2e7d32;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
`;

const AddressDetails = styled.div`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
`;

const AddAddressCard = styled.div`
  border: 1px dashed #ddd;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 150px;
  
  &:hover {
    border-color: #aaa;
    background: #f9f9f9;
  }
`;

const AddAddressIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const AddAddressText = styled.p`
  margin: 0;
  text-align: center;
  color: #666;
`;

const GuestAddressForm = styled.form`
  margin-top: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #2e7d32;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #2e7d32;
  }
`;

const ErrorText = styled.p`
  color: #f44336;
  font-size: 0.8rem;
  margin: 0.25rem 0 0;
`;

const PaymentSection = styled.div`
  margin-top: 2rem;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const PaymentOption = styled.div`
  border: 1px solid ${props => props.selected ? '#2e7d32' : '#ddd'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  background: ${props => props.selected ? '#f1f8e9' : 'white'};
  
  &:hover {
    border-color: ${props => props.selected ? '#2e7d32' : '#aaa'};
  }
`;

const PaymentOptionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PaymentOptionTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

const CartItemsList = styled.div`
  margin-top: 1rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const CartItemDetails = styled.div`
  flex: 1;
`;

const CartItemName = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const CartItemMeta = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #666;
`;

const CartItemPrice = styled.div`
  font-weight: bold;
  font-size: 0.9rem;
`;

// Main component
const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, isGuest } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  // State for checkout process
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  // State for guest checkout
  const [guestAddress, setGuestAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: true
  });
  const [guestAddressErrors, setGuestAddressErrors] = useState({});
  
  // Fetch addresses on component mount
  useEffect(() => {
    if (isAuthenticated) {
      // Cart items are already loaded via Redux
      fetchUserAddresses();
    }
  }, [dispatch, isAuthenticated]);
  
  // Fetch user addresses from API
  const fetchUserAddresses = async () => {
    try {
      const response = await fetch('https://fusionmokshabackend-production.up.railway.app/api/addresses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }
      
      const data = await response.json();
      setAddresses(data.addresses || []);
      
      // Set default address as selected if available
      const defaultAddress = data.addresses?.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load your saved addresses');
    }
  };
  
  // Validate guest address form
  const validateGuestAddress = () => {
    const errors = {};
    
    if (!guestAddress.fullName.trim()) errors.fullName = 'Full name is required';
    
    if (!guestAddress.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(guestAddress.phone.trim())) {
      errors.phone = 'Phone number must be 10 digits';
    }
    
    if (!guestAddress.addressLine1.trim()) errors.addressLine1 = 'Address is required';
    if (!guestAddress.city.trim()) errors.city = 'City is required';
    if (!guestAddress.state.trim()) errors.state = 'State is required';
    
    if (!guestAddress.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(guestAddress.pincode.trim())) {
      errors.pincode = 'Pincode must be 6 digits';
    }
    
    setGuestAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle guest address input change
  const handleGuestAddressChange = (e) => {
    const { name, value } = e.target;
    setGuestAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    // Add shipping or other charges if needed
    return subtotal;
  };
  
  // Handle address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
  };
  
  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };
  
  // Handle continue to payment
  const handleContinueToPayment = () => {
    if (isAuthenticated) {
      // For authenticated users, check if an address is selected
      if (!selectedAddress) {
        toast.error('Please select a delivery address');
        return;
      }
    } else {
      // For guest users, validate the address form
      if (!validateGuestAddress()) {
        toast.error('Please fill all required address fields correctly');
        return;
      }
    }
    
    setStep(2); // Move to payment step
  };
  
  // Handle place order
  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      
      let orderData;
      
      if (isAuthenticated) {
        // Get the selected address details
        const selectedAddressDetails = addresses.find(addr => addr._id === selectedAddress);
        
        if (!selectedAddressDetails) {
          throw new Error('Selected address not found');
        }
        
        // Format cart items for the API
        const formattedCartItems = items.map(item => ({
          productId: item.productId,
          weight: {
            value: item.weight.value,
            unit: item.weight.unit
          },
          quantity: item.quantity
        }));
        
        // For authenticated users - call the backend API
        const response = await fetch('https://fusionmokshabackend-production.up.railway.app/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            cartItems: formattedCartItems,
            address: selectedAddressDetails,
            paymentMethod: paymentMethod.toUpperCase() // Backend expects 'COD' or 'ONLINE'
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create order');
        }
        
        orderData = await response.json();
        
        // Store the order ID in localStorage for payment processing
        if (orderData.data && orderData.data.orderId) {
          localStorage.setItem('currentOrderId', orderData.data.orderId);
          setOrderId(orderData.data.orderId);
        }
        
        // If payment method is COD, we're done
        if (paymentMethod.toUpperCase() === 'COD') {
          toast.success('Order placed successfully!');
          // Clear the cart after successful order
          dispatch(clearCart());
          // Move to confirmation step
          setStep(3);
        } else {
          // For online payment, move to payment processing
          setStep(2.5); // Use a half-step to indicate payment processing
          await processOnlinePayment(orderData.data.orderId);
        }
      } else {
        // For guest users - create a temporary order in localStorage
        const guestOrderId = `guest-order-${Date.now()}`;
        const guestOrder = {
          id: guestOrderId,
          items: items,
          address: guestAddress,
          paymentMethod: paymentMethod,
          total: calculateTotal(),
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        // Store guest order in localStorage
        const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
        guestOrders.push(guestOrder);
        localStorage.setItem('guestOrders', JSON.stringify(guestOrders));
        
        orderData = { order: guestOrder };
        setOrderId(guestOrderId);
        
        // For guest users, we'll simulate the order process
        toast.success('Order placed successfully!');
        // Clear the cart
        dispatch(clearCart());
        // Move to confirmation step
        setStep(3);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(`Failed to place your order: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Process online payment
  const processOnlinePayment = async (orderId) => {
    try {
      // Step 1: Create payment intent
      const createIntentResponse = await fetch('https://fusionmokshabackend-production.up.railway.app/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId })
      });
      
      if (!createIntentResponse.ok) {
        const errorData = await createIntentResponse.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }
      
      const intentData = await createIntentResponse.json();
      
      if (!intentData.success || !intentData.clientSecret) {
        throw new Error('Invalid payment intent response');
      }
      
      // Step 2: Simulate payment confirmation (in a real app, this would be handled by the payment gateway UI)
      const confirmPaymentResponse = await fetch('https://fusionmokshabackend-production.up.railway.app/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          paymentIntentId: intentData.clientSecret.split('_secret_')[0],
          forceSuccess: true // For testing, force success
        })
      });
      
      if (!confirmPaymentResponse.ok) {
        const errorData = await confirmPaymentResponse.json();
        throw new Error(errorData.message || 'Payment confirmation failed');
      }
      
      const paymentResult = await confirmPaymentResponse.json();
      
      if (paymentResult.paymentStatus === 'completed') {
        toast.success('Payment processed successfully!');
        // Clear the cart after successful payment
        dispatch(clearCart());
        // Move to confirmation step
        setStep(3);
      } else {
        toast.error('Payment failed. Please try again.');
        // Stay on the payment step
        setStep(2);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error(`Payment failed: ${error.message}`);
      setStep(2); // Stay on payment step on error
    }
  };
  
  // Handle back to cart
  const handleBackToCart = () => {
    navigate('/cart');
  };
  
  // Handle continue shopping after order
  const handleContinueShopping = () => {
    navigate('/shop');
  };
  
  // Render address section
  const renderAddressSection = () => {
    if (isAuthenticated) {
      return (
        <AddressSection>
          <SectionTitle>Select Delivery Address</SectionTitle>
          <AddressGrid>
            {addresses.map(address => (
              <AddressCard 
                key={address._id} 
                selected={selectedAddress === address._id}
                onClick={() => handleAddressSelect(address._id)}
              >
                <AddressCardHeader>
                  <AddressName>{address.fullName}</AddressName>
                  {address.isDefault && <AddressDefault>Default</AddressDefault>}
                </AddressCardHeader>
                <AddressDetails>
                  {address.addressLine1}<br />
                  {address.addressLine2 && <>{address.addressLine2}<br /></>}
                  {address.city}, {address.state} {address.pincode}<br />
                  Phone: {address.phone}
                </AddressDetails>
              </AddressCard>
            ))}
            <AddAddressCard onClick={() => navigate('/profile/addresses/add')}>
              <AddAddressIcon>
                <FontAwesomeIcon icon={faPlus} />
              </AddAddressIcon>
              <AddAddressText>Add New Address</AddAddressText>
            </AddAddressCard>
          </AddressGrid>
        </AddressSection>
      );
    } else {
      // Guest address form
      return (
        <AddressSection>
          <SectionTitle>Enter Delivery Address</SectionTitle>
          <GuestAddressForm>
            <FormRow>
              <FormGroup>
                <Label>Full Name*</Label>
                <Input 
                  type="text" 
                  name="fullName" 
                  value={guestAddress.fullName}
                  onChange={handleGuestAddressChange}
                />
                {guestAddressErrors.fullName && <ErrorText>{guestAddressErrors.fullName}</ErrorText>}
              </FormGroup>
              <FormGroup>
                <Label>Phone Number*</Label>
                <Input 
                  type="tel" 
                  name="phone" 
                  value={guestAddress.phone}
                  onChange={handleGuestAddressChange}
                />
                {guestAddressErrors.phone && <ErrorText>{guestAddressErrors.phone}</ErrorText>}
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Label>Address Line 1*</Label>
              <Input 
                type="text" 
                name="addressLine1" 
                value={guestAddress.addressLine1}
                onChange={handleGuestAddressChange}
              />
              {guestAddressErrors.addressLine1 && <ErrorText>{guestAddressErrors.addressLine1}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Label>Address Line 2</Label>
              <Input 
                type="text" 
                name="addressLine2" 
                value={guestAddress.addressLine2}
                onChange={handleGuestAddressChange}
              />
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Label>City*</Label>
                <Input 
                  type="text" 
                  name="city" 
                  value={guestAddress.city}
                  onChange={handleGuestAddressChange}
                />
                {guestAddressErrors.city && <ErrorText>{guestAddressErrors.city}</ErrorText>}
              </FormGroup>
              <FormGroup>
                <Label>State*</Label>
                <Input 
                  type="text" 
                  name="state" 
                  value={guestAddress.state}
                  onChange={handleGuestAddressChange}
                />
                {guestAddressErrors.state && <ErrorText>{guestAddressErrors.state}</ErrorText>}
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Label>Pincode*</Label>
              <Input 
                type="text" 
                name="pincode" 
                value={guestAddress.pincode}
                onChange={handleGuestAddressChange}
              />
              {guestAddressErrors.pincode && <ErrorText>{guestAddressErrors.pincode}</ErrorText>}
            </FormGroup>
          </GuestAddressForm>
        </AddressSection>
      );
    }
  };
  
  // Render payment section
  const renderPaymentSection = () => {
    return (
      <PaymentSection>
        <SectionTitle>Select Payment Method</SectionTitle>
        <PaymentOptions>
          <PaymentOption 
            selected={paymentMethod === 'cod'}
            onClick={() => handlePaymentMethodSelect('cod')}
          >
            <PaymentOptionHeader>
              <PaymentOptionTitle>Cash on Delivery</PaymentOptionTitle>
            </PaymentOptionHeader>
          </PaymentOption>
          <PaymentOption 
            selected={paymentMethod === 'online'}
            onClick={() => handlePaymentMethodSelect('online')}
          >
            <PaymentOptionHeader>
              <PaymentOptionTitle>Online Payment</PaymentOptionTitle>
            </PaymentOptionHeader>
          </PaymentOption>
        </PaymentOptions>
      </PaymentSection>
    );
  };
  
  // Render order confirmation
  const renderOrderConfirmation = () => {
    return (
      <div>
        <SectionTitle>Order Placed Successfully!</SectionTitle>
        <p>Thank you for your order. Your order number is: <strong>{orderId}</strong></p>
        <p>We have sent you an email with your order details.</p>
        <Button onClick={handleContinueShopping}>Continue Shopping</Button>
      </div>
    );
  };
  
  // Render cart summary
  const renderCartSummary = () => {
    return (
      <CheckoutSummary>
        <SectionTitle>Order Summary</SectionTitle>
        <CartItemsList>
          {items.map(item => (
            <CartItem key={item._id}>
              <CartItemImage 
                src={item.image || '/images/default-product.png'} 
                alt={item.productName || 'Product'}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/default-product.png';
                }}
              />
              <CartItemDetails>
                <CartItemName>{item.productName || 'Product'}</CartItemName>
                <CartItemMeta>
                  {item.weight.value} {item.weight.unit} × {item.quantity}
                </CartItemMeta>
              </CartItemDetails>
              <CartItemPrice>
                ₹{(item.price * item.quantity).toFixed(2)}
              </CartItemPrice>
            </CartItem>
          ))}
        </CartItemsList>
        <SummaryRow>
          <span>Subtotal</span>
          <span>₹{calculateSubtotal().toFixed(2)}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Shipping</span>
          <span>Free</span>
        </SummaryRow>
        <SummaryRow className="total">
          <span>Total</span>
          <span>₹{calculateTotal().toFixed(2)}</span>
        </SummaryRow>
        
        {step === 1 && (
          <Button onClick={handleContinueToPayment} disabled={loading || items.length === 0}>
            Continue to Payment
          </Button>
        )}
        
        {step === 2 && (
          <>
            <Button onClick={handlePlaceOrder} disabled={isProcessing || items.length === 0}>
              {isProcessing ? 'Processing...' : 'Place Order'}
            </Button>
            <Button secondary onClick={() => setStep(1)} disabled={isProcessing}>
              Back to Address
            </Button>
          </>
        )}
      </CheckoutSummary>
    );
  };
  
  // If cart is empty, redirect to cart page
  if (items.length === 0 && step !== 3) {
    return (
      <CheckoutContainer>
        <CheckoutHeader>
          <BackButton onClick={handleBackToCart}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </BackButton>
          <CheckoutTitle>Checkout</CheckoutTitle>
        </CheckoutHeader>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Your cart is empty. Please add items to your cart before checkout.</p>
          <Button onClick={handleBackToCart}>Back to Cart</Button>
        </div>
      </CheckoutContainer>
    );
  }
  
  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 0:
        return <CartStep items={items} onProceed={() => setStep(1)} />;
      case 1:
        return renderAddressSection();
      case 2:
        return renderPaymentSection();
      case 2.5: // Payment processing step
        return (
          <PaymentStep 
            onComplete={() => setStep(3)} 
            onBack={() => setStep(2)}
          />
        );
      case 3:
        return renderOrderConfirmation();
      default:
        return <CartStep items={items} onProceed={() => setStep(1)} />;
    }
  };
  
  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <BackButton onClick={handleBackToCart}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </BackButton>
        <CheckoutTitle>Checkout</CheckoutTitle>
      </CheckoutHeader>
      
      <CheckoutSteps activeStep={step} />
      
      <CheckoutContent>
        {renderStep()}
      </CheckoutContent>
    </CheckoutContainer>
  );
};

export default Checkout;
