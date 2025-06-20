import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItems } from '../store/cartSlice';

/**
 * CartSynchronizer is a global component that ensures cart quantities
 * are synchronized across the entire application.
 * 
 * It listens for cart updates and refreshes product data when needed.
 */
const CartSynchronizer = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { items, status } = useSelector(state => state.cart);
  
  // Keep track of cart updates without triggering unnecessary API calls
  const lastCartUpdateTime = useRef(Date.now());
  
  // We're removing the automatic product refresh on cart changes
  // Instead, we'll rely on direct Redux state updates for synchronization
  
  // Set up visibility change listener to refresh cart data when the page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Only fetch cart data if it's been more than 2 seconds since the last update
        // This prevents unnecessary API calls when quickly toggling between tabs
        const now = Date.now();
        if (now - lastCartUpdateTime.current > 2000) {
          if (isAuthenticated) {
            // For authenticated users, fetch the latest cart data from the backend
            dispatch(fetchCartItems());
            lastCartUpdateTime.current = now;
          }
        }
      }
    };
    
    // Add event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, isAuthenticated]);
  
  // This component doesn't render anything
  return null;
};

export default CartSynchronizer;
