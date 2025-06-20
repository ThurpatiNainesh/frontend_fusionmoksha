import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { 
  updateCartItemQuantity, 
  removeFromCart,
  updateGuestItemQuantity,
  removeItemFromGuestCart,
  updateCartQuantityApi,
  fetchCartItems
} from '../store/cartSlice';

const CartContainer = styled.div`
  padding: 1rem 0;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #666;
`;

const EmptyCartIcon = styled.div`
  font-size: 3rem;
  color: #e8e8e8;
  margin-bottom: 1rem;
`;

const CartItem = styled.div`
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
`;

const CartItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const CartItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CartItemName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const CartItemWeight = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const CartItemPriceWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const CartItemPrice = styled.div`
  font-weight: 500;
`;

const CartItemQuantity = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  background-color: #f5f5f5;
  border: none;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  padding: 0 0.5rem;
  min-width: 30px;
  text-align: center;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 0;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  
  &:hover {
    color: #f44336;
  }
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin: 1rem 0;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
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
  
  &:hover {
    background-color: ${props => props.$primary ? '#1b5e20' : '#616161'};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const CartStep = ({ onProceed, productCache = {} }) => {
  const dispatch = useDispatch();
  const { items: cartItems, loading: cartLoading, isGuest } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  // Handle updating cart quantity using the unified API endpoint
  const handleUpdateQuantity = async (item, change) => {
    try {
      // Find the item in the cart
      const productId = typeof item.productId === 'object' ? item.productId._id : item.productId;
      const action = change > 0 ? 'increment' : 'decrement';
      
      // Optimistic update for better UX
      const optimisticUpdateId = Date.now().toString();
      
      // Update the local state optimistically
      if (isAuthenticated) {
        dispatch(updateCartItemQuantity({ itemId: item._id, change }));
      } else {
        dispatch(updateGuestItemQuantity({ itemId: item._id, change }));
      }
      
      // Use the same updateCartQuantityApi as the AddToCartButton component
      // The updateCartQuantityApi thunk already updates the product state internally
      const result = await dispatch(updateCartQuantityApi({
        productId,
        weight: item.weight,
        action,
        optimisticUpdateId
      })).unwrap();
      
      if (result.success) {
        // No need to fetch the entire cart again - the API response already has the updated quantity
        // and the Redux state is already updated by the thunk
        
        toast.success('Cart updated');
      } else {
        // Rollback the optimistic update if the API call fails
        if (isAuthenticated) {
          dispatch(updateCartItemQuantity({ itemId: item._id, change: -change }));
        } else {
          dispatch(updateGuestItemQuantity({ itemId: item._id, change: -change }));
        }
        toast.error('Failed to update cart');
      }
    } catch (error) {
      toast.error('Failed to update cart: ' + (error.response?.data?.message || error.message));
    }
  };
  
  // Handle removing item from cart
  const handleRemoveItem = async (itemId) => {
    if (isAuthenticated) {
      try {
        const response = await api.delete(`/api/cart/${itemId}`);
        if (response.status === 200) {
          toast.success('Item removed from cart');
          // Update local state or refetch cart items
          dispatch(removeFromCart(itemId));
        } else {
          toast.error('Failed to remove item');
        }
      } catch (error) {
        toast.error('Failed to remove item: ' + (error.response?.data?.message || error.message));
      }
    } else {
      dispatch(removeItemFromGuestCart(itemId));
      toast.success('Item removed from cart');
    }
  };
  
  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * item.quantity, 
    0
  ).toFixed(2);
  
  if (cartLoading) {
    return (
      <CartContainer>
        <div>Loading cart...</div>
      </CartContainer>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <EmptyCart>
          <EmptyCartIcon>
            <FontAwesomeIcon icon={faCartShopping} />
          </EmptyCartIcon>
          Your cart is empty
          <div style={{ marginTop: '1rem' }}>
            <ActionButton onClick={() => window.location.href = '/shop'}>
              Continue Shopping
            </ActionButton>
          </div>
        </EmptyCart>
      </CartContainer>
    );
  }
  
  return (
    <CartContainer>
      {cartItems.map((item) => (
        <CartItem key={item._id}>
          <CartItemImage 
            src={item.image || item.productId?.mainImage || productCache[item.productId]?.mainImage || '/images/placeholder.png'} 
            alt={item.productName || item.name || item.productId?.name || productCache[item.productId]?.name || 'Product'}
          />
          <CartItemDetails>
            <CartItemName>
              {item.productName || item.name || item.productId?.name || productCache[item.productId]?.name || 'Product'}
            </CartItemName>
            <CartItemWeight>
              {item.weight ? `${item.weight.value}${item.weight.unit}` : '250g'}
            </CartItemWeight>
            
            <CartItemPriceWrapper>
              <CartItemQuantity>
                <QuantityButton 
                  disabled={item.quantity <= 1}
                  onClick={() => handleUpdateQuantity(item, -1)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </QuantityButton>
                <QuantityValue>{item.quantity}</QuantityValue>
                <QuantityButton
                  onClick={() => handleUpdateQuantity(item, 1)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </QuantityButton>
              </CartItemQuantity>
              
              <CartItemPrice>
                {item.originalPrice && item.originalPrice > item.price ? (
                  <>
                    <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '5px', fontSize: '0.85rem' }}>
                      ₹{item.originalPrice}
                    </span>
                    <span style={{ color: 'black', fontWeight: '600' }}>₹{item.price}</span>
                  </>
                ) : (
                  <span>₹{item.price}</span>
                )}
              </CartItemPrice>
            </CartItemPriceWrapper>
          </CartItemDetails>
          
          <RemoveButton
            onClick={() => handleRemoveItem(item._id)}
            title="Remove item"
          >
            <FontAwesomeIcon icon={faTrash} />
          </RemoveButton>
        </CartItem>
      ))}
      
      <CartTotal>
        <span>Subtotal:</span>
        <span>₹{cartTotal}</span>
      </CartTotal>
      
      <ActionButton 
        $primary
        onClick={onProceed}
        disabled={cartItems.length === 0}
      >
        Proceed to Address
      </ActionButton>
      
      <ActionButton onClick={() => window.location.href = '/shop'}>
        Continue Shopping
      </ActionButton>
    </CartContainer>
  );
};

export default CartStep;
