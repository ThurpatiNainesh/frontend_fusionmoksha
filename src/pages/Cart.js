import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { 
  fetchCartItems, 
  removeFromCart, 
  updateCartItemQuantity,
  updateItemQuantityOptimistic,
  revertItemQuantity
} from '../store/cartSlice';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const CartHeader = styled.div`
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

const CartTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 150px 100px 50px;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;

  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    grid-template-areas: 
      "image info"
      "quantity price remove";
    gap: 0.5rem;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;

  @media (max-width: 768px) {
    grid-area: image;
  }
`;

const ItemInfo = styled.div`
  @media (max-width: 768px) {
    grid-area: info;
  }
`;

const ItemName = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #333;
`;

const ItemWeight = styled.p`
  margin: 0.25rem 0 0;
  color: #666;
  font-size: 0.9rem;
`;

const ItemPrice = styled.div`
  font-weight: bold;
  color: #2e7d32;
  text-align: right;

  @media (max-width: 768px) {
    grid-area: price;
    text-align: left;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-area: quantity;
  }
`;

const QuantityButton = styled.button`
  background: #f5f5f5;
  border: 1px solid #ddd;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #e0e0e0;
  }
`;

const QuantityInput = styled.input`
  width: 40px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.25rem;
  font-size: 0.9rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    grid-area: remove;
    justify-content: flex-end;
  }
`;

const Summary = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  margin-top: 0;
  font-size: 1.25rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
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

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #1b5e20;
  }

  &:disabled {
    background: #a5d6a7;
    cursor: not-allowed;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyCartTitle = styled.h2`
  margin-top: 0;
  color: #666;
`;

const EmptyCartText = styled.p`
  color: #888;
  margin-bottom: 2rem;
`;

const ShopButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1b5e20;
  }
`;

const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const currentItem = items.find(item => item._id === itemId);
    if (!currentItem) return;
    
    const change = newQuantity - currentItem.quantity;
    if (change === 0) return;
    
    // Optimistically update the UI
    dispatch(updateItemQuantityOptimistic({ itemId, change }));
    
    // Make the API call
    dispatch(updateCartItemQuantity({ itemId, change }))
      .then((result) => {
        if (result.error) {
          // Revert the optimistic update if the API call fails
          dispatch(revertItemQuantity({ itemId }));
        }
      });
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm(t('cart.removeConfirm', 'Are you sure you want to remove this item?'))) {
      dispatch(removeFromCart(itemId));
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    // Add any additional charges like tax, shipping, etc.
    return subtotal;
  };

  if (!isAuthenticated) {
    return (
      <CartContainer>
        <EmptyCart>
          <EmptyCartTitle>{t('cart.loginRequired', 'Please log in to view your cart')}</EmptyCartTitle>
          <EmptyCartText>
            {t('cart.loginToView', 'You need to be logged in to view your shopping cart.')}
          </EmptyCartText>
          <ShopButton onClick={() => navigate('/login')}>
            {t('login', 'Log In')}
          </ShopButton>
        </EmptyCart>
      </CartContainer>
    );
  }

  if (loading && items.length === 0) {
    return (
      <CartContainer>
        <CartTitle>{t('cart.yourCart', 'Your Cart')}</CartTitle>
        <div>{t('loading', 'Loading...')}</div>
      </CartContainer>
    );
  }

  if (error) {
    return (
      <CartContainer>
        <CartTitle>{t('cart.yourCart', 'Your Cart')}</CartTitle>
        <div className="error">{error}</div>
      </CartContainer>
    );
  }

  if (items.length === 0) {
    return (
      <CartContainer>
        <EmptyCart>
          <EmptyCartTitle>{t('cart.empty', 'Your cart is empty')}</EmptyCartTitle>
          <EmptyCartText>
            {t('cart.addItems', 'Looks like you haven\'t added any products to your cart yet.')}
          </EmptyCartText>
          <ShopButton onClick={() => navigate('/shop')}>
            {t('shop.continueShopping', 'Continue Shopping')}
          </ShopButton>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartHeader>
        <BackButton onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
          {t('common.back', 'Back')}
        </BackButton>
        <CartTitle>{t('cart.yourCart', 'Your Cart')}</CartTitle>
      </CartHeader>

      <CartContent>
        <CartItems>
          {items.map((item) => (
            <CartItem key={item._id}>
              <ItemImage 
                src={item.image || '/images/default-product.png'} 
                alt={item.product?.name || 'Product image'} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/default-product.png';
                }}
              />
              <ItemInfo>
                <ItemName>{item.product?.name}</ItemName>
                <ItemWeight>
                  {item.weight.value} {item.weight.unit}
                </ItemWeight>
              </ItemInfo>
              <ItemPrice>
                ₹{(item.price * item.quantity).toFixed(2)}
              </ItemPrice>
              <QuantityControl>
                <QuantityButton 
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.quantity === 1) {
                      handleRemoveItem(item._id);
                    } else {
                      // Optimistically update the UI
                      dispatch(updateItemQuantityOptimistic({ itemId: item._id, change: -1 }));
                      // Make the API call
                      dispatch(updateCartItemQuantity({ itemId: item._id, change: -1 }))
                        .then((result) => {
                          if (result.error) {
                            // Revert the optimistic update if the API call fails
                            dispatch(revertItemQuantity({ itemId: item._id }));
                          }
                        });
                    }
                  }}
                  aria-label={t('cart.decreaseQuantity', 'Decrease quantity')}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </QuantityButton>
                <QuantityInput
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value) || 1;
                    if (newQuantity > 0) {
                      const change = newQuantity - item.quantity;
                      if (change !== 0) {
                        // Optimistically update the UI
                        dispatch(updateItemQuantityOptimistic({ itemId: item._id, change }));
                        // Make the API call
                        dispatch(updateCartItemQuantity({ itemId: item._id, change }))
                          .then((result) => {
                            if (result.error) {
                              // Revert the optimistic update if the API call fails
                              dispatch(revertItemQuantity({ itemId: item._id }));
                            }
                          });
                      }
                    }
                  }}
                  aria-label={t('cart.quantity', 'Quantity')}
                />
                <QuantityButton 
                  onClick={(e) => {
                    e.preventDefault();
                    // Optimistically update the UI
                    dispatch(updateItemQuantityOptimistic({ itemId: item._id, change: 1 }));
                    // Make the API call
                    dispatch(updateCartItemQuantity({ itemId: item._id, change: 1 }))
                      .then((result) => {
                        if (result.error) {
                          // Revert the optimistic update if the API call fails
                          dispatch(revertItemQuantity({ itemId: item._id }));
                        }
                      });
                  }}
                  aria-label={t('cart.increaseQuantity', 'Increase quantity')}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </QuantityButton>
              </QuantityControl>
              <RemoveButton 
                onClick={() => handleRemoveItem(item._id)}
                aria-label={t('cart.removeItem', 'Remove item')}
              >
                <FontAwesomeIcon icon={faTrash} />
              </RemoveButton>
            </CartItem>
          ))}
        </CartItems>

        <Summary>
          <SummaryTitle>{t('cart.orderSummary', 'Order Summary')}</SummaryTitle>
          <SummaryRow>
            <span>{t('cart.subtotal', 'Subtotal')}</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>{t('cart.shipping', 'Shipping')}</span>
            <span>{t('cart.calculatedAtCheckout', 'Calculated at checkout')}</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span>{t('cart.total', 'Total')}</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </SummaryRow>
          <CheckoutButton 
            onClick={() => navigate('/checkout')}
            disabled={loading}
          >
            {loading ? t('loading', 'Loading...') : t('cart.proceedToCheckout', 'Proceed to Checkout')}
          </CheckoutButton>
        </Summary>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
