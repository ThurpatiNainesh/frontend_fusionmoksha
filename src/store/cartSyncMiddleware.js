import { fetchCartItems } from './cartSlice';

/**
 * Cart Synchronization Middleware
 * 
 * This middleware ensures perfect synchronization between cart and product quantities
 * by intercepting specific actions and dispatching appropriate synchronization actions.
 */
const cartSyncMiddleware = store => next => action => {
  // First, process the action normally
  const result = next(action);
  
  // Then, handle synchronization based on action types
  if (action.type === 'cart/updateCartQuantityApi/fulfilled') {
    // After a successful cart update, ensure product state is updated
    const { productId, cartQuantity } = action.payload;
    
    if (productId && cartQuantity !== undefined) {
      // Update the product state with the exact quantity from the backend
      store.dispatch({
        type: 'products/updateProductCartQuantity',
        payload: { productId, cartQuantity }
      });
    }
  }
  
  // When products are fetched, ensure cart quantities are applied
  if (action.type === 'products/getProducts/fulfilled' && action.payload?.products) {
    const state = store.getState();
    const cartItems = state.cart.items;
    
    // If we have cart items, update the product quantities
    if (cartItems && cartItems.length > 0) {
      // For each product in the fetched products
      action.payload.products.forEach(product => {
        // Find matching cart item
        const cartItem = cartItems.find(item => 
          item.product._id === product._id || item.product === product._id
        );
        
        // If found, update the product's cart quantity
        if (cartItem) {
          store.dispatch({
            type: 'products/updateProductCartQuantity',
            payload: {
              productId: product._id,
              cartQuantity: cartItem.quantity
            }
          });
        }
      });
    }
  }
  
  return result;
};

export default cartSyncMiddleware;
