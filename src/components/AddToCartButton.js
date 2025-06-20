import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import { 
  addToCart, 
  addItemToGuestCart, 
  updateCartItemQuantity, 
  updateGuestItemQuantity, 
  removeFromCart,
  removeItemFromGuestCart,
  fetchCartItems,
  updateCartQuantityApi
} from '../store/cartSlice';
import { getProductById, getProducts } from '../store/productSlice';

const GUEST_CART_KEY = 'fusionmoksha_guest_cart';

const Button = styled.button`
  background-color: ${props => props.$added ? '#4CAF50' : props.theme.primary || '#2e7d32'};
  color: white;
  padding: ${props => props.$style?.padding || '10px 20px'};
  border: ${props => props.$style?.border || 'none'};
  border-radius: ${props => props.$style?.borderRadius || '8px'};
  cursor: pointer;
  font-size: ${props => props.$style?.fontSize || '14px'};
  font-weight: ${props => props.$style?.fontWeight || '500'};
  display: inline-block;
  text-align: center;
  transition: all 0.3s ease;
  min-width: ${props => props.$style?.minWidth || '140px'};
  width: ${props => props.$style?.width || 'auto'};
  ${props => props.$style?.hover ? `&:hover { ${Object.entries(props.$style.hover).map(([key, val]) => `${key}: ${val};`).join('')} }` : ''}

  &:hover {
    background-color: ${props => props.$added ? '#43a047' : '#1b5e20'};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  width: ${props => props.$style?.width || '140px'};
  height: ${props => props.$style?.height || '40px'};
`;

const QuantityButton = styled.button`
  background-color: #f5f5f5;
  color: #333;
  border: none;
  padding: 0;
  width: 40px;
  height: 100%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &:active {
    background-color: #d5d5d5;
  }
  
  &:disabled {
    color: #aaa;
    cursor: not-allowed;
    background-color: #f9f9f9;
  }
`;

const QuantityDisplay = styled.div`
  flex: 1;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  padding: 0 8px;
  color: #333;
`;

const AddToCartButton = ({ product, weight, variant, quantity = 1, className, style }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);
  const { isGuest, items, status } = useSelector(state => state.cart);
  
  // Get the item ID for cart operations
  const getItemId = () => {
    const selectedWeight = weight || product.variants[0].weight;
    return isAuthenticated 
      ? items.find(item => 
          item.productId === product._id && 
          item.weight.value === selectedWeight.value && 
          item.weight.unit === selectedWeight.unit
        )?._id
      : `${product._id}-${selectedWeight.value}-${selectedWeight.unit}`;
  };
  
  // Get the selected variant
  const getSelectedVariant = () => {
    const selectedWeight = weight || product.variants[0].weight;
    return variant || product.variants.find(v => 
      v.weight.value === selectedWeight.value && v.weight.unit === selectedWeight.unit
    );
  };
  
  // On page load, check login status and initialize cart quantity
  useEffect(() => {
    // Initialize cart quantity from localStorage ONLY - treat logged-in users the same as guest users
    const initializeCartQuantity = async () => {
      try {
        const selectedWeight = weight || product.variants[0].weight;
        let initialQuantity = 0;
        
        // Check localStorage for cart quantity - same approach for both logged-in and guest users
        const cartKey = isAuthenticated ? 'fusionmoksha_auth_cart' : 'fusionmoksha_guest_cart';
        const cartJSON = localStorage.getItem(cartKey);
        
        console.log(`Initializing from ${cartKey} for product:`, { 
          productId: product._id, 
          weight: selectedWeight,
          cartJSON: cartJSON
        });
        
        if (cartJSON) {
          const cart = JSON.parse(cartJSON);
          
          const localCartItem = cart.find(item => {
            const itemProductId = isAuthenticated ? 
              (typeof item.productId === 'object' ? item.productId._id : item.productId) : 
              item.productId;
            
            const match = itemProductId === product._id && 
                   item.weight?.value === selectedWeight.value && 
                   item.weight?.unit === selectedWeight.unit;
                   
            if (match) {
              console.log('Found matching item in localStorage:', item);
            }
            
            return match;
          });
          
          if (localCartItem) {
            initialQuantity = localCartItem.quantity;
            console.log('Setting initial quantity from localStorage:', initialQuantity);
          } else {
            console.log('Product not found in localStorage, setting quantity to 0');
          }
        } else {
          console.log('No cart in localStorage, setting quantity to 0');
        }
        
        // Always update the UI from localStorage
        console.log('Updating UI with quantity:', initialQuantity);
        setCartQuantity(initialQuantity);
        setIsAdded(initialQuantity > 0);
        
        // Mark as initialized to show the UI
        setIsInitialized(true);
        
        // Fetch from backend in the background to update localStorage
        // But don't use the response to update UI directly
        console.log('Fetching cart data from backend in background');
        dispatch(fetchCartItems())
          .unwrap()
          .then(data => {
            if (!data || !data.items) {
              console.log('No items returned from backend');
              return;
            }
            
            console.log('Backend returned items:', data.items);
            
            // Update localStorage with backend data
            if (isAuthenticated) {
              localStorage.setItem('fusionmoksha_auth_cart', JSON.stringify(data.items));
            } else {
              localStorage.setItem('fusionmoksha_guest_cart', JSON.stringify(data.items));
            }
            
            // Find the matching cart item
            const cartItem = data.items.find(item => {
              // Check if the product ID and weight match
              const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId;
              return itemProductId === product._id && 
                     item.weight.value === selectedWeight.value && 
                     item.weight.unit === selectedWeight.unit;
            });
            
            // Update UI if the backend quantity is different from localStorage
            if (cartItem && cartItem.quantity !== initialQuantity) {
              console.log('Backend quantity differs from localStorage, updating UI:', cartItem.quantity);
              setCartQuantity(cartItem.quantity);
              setIsAdded(cartItem.quantity > 0);
            }
          })
          .catch(fetchError => {
            console.error('Error fetching cart from backend:', fetchError);
            // Keep the localStorage values if backend fetch fails
          });
      } catch (error) {
        console.error('Error initializing cart quantity:', error);
        setIsInitialized(true);
      }
    };
    
    initializeCartQuantity();
  }, [dispatch, product._id, weight, isAuthenticated]);
  
  // Update cart quantity when items change (after add/remove/update operations)
  // Using a ref to avoid unnecessary re-renders
  const prevItemsRef = React.useRef(items);
  
  // Listen for localStorage changes (triggered by our custom action)
  useEffect(() => {
    if (!isInitialized) return;
    
    // Check localStorage for current quantity
    const selectedWeight = weight || product.variants[0].weight;
    const cartKey = isAuthenticated ? 'fusionmoksha_auth_cart' : 'fusionmoksha_guest_cart';
    
    try {
      const cartJSON = localStorage.getItem(cartKey);
      if (cartJSON) {
        const cart = JSON.parse(cartJSON);
        
        // Find the item in localStorage
        const localCartItem = cart.find(item => {
          const itemProductId = isAuthenticated ? 
            (typeof item.productId === 'object' ? item.productId._id : item.productId) : 
            item.productId;
          
          return itemProductId === product._id && 
                 item.weight?.value === selectedWeight.value && 
                 item.weight?.unit === selectedWeight.unit;
        });
        
        // Update UI based on localStorage
        if (localCartItem) {
          console.log('Updating UI from localStorage:', localCartItem.quantity);
          setCartQuantity(localCartItem.quantity);
          setIsAdded(localCartItem.quantity > 0);
        } else if (cartQuantity !== 0) {
          // Reset if not found in localStorage
          setCartQuantity(0);
          setIsAdded(false);
        }
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, [product, weight, isAuthenticated, isInitialized, cartQuantity]);
  
  // Handle adding to cart using the new API endpoint
  const handleAddToCart = async (e) => {
    if (e) {
      e.preventDefault(); // Prevent default action
      e.stopPropagation(); // Stop event propagation
    }
    
    // Optimistic UI update - immediately show as added
    setIsAdded(true);
    setCartQuantity(1);
    
    try {
      setIsAdding(true);
      
      // Get the selected variant
      const selectedWeight = weight || product.variants[0].weight;
      const selectedVariant = getSelectedVariant();
      
      if (!selectedVariant) {
        // Revert optimistic update
        setIsAdded(false);
        setCartQuantity(0);
        toast.error('Selected product variant not available');
        return;
      }
      
      // Prepare guest cart item for local storage (needed for both flows)
      const guestCartItem = {
        _id: `${product._id}-${selectedWeight.value}-${selectedWeight.unit}`, // Generate a temporary ID
        productId: product._id,
        weight: selectedWeight,
        price: selectedVariant.price,
        originalPrice: selectedVariant.originalPrice,
        discountPrice: selectedVariant.discountPrice,
        savings: selectedVariant.savings,
        savingsPercentage: selectedVariant.savingsPercentage,
        image: selectedVariant.image || product.mainImage,
        quantity: 1,
        productName: product.name, // Add product name for better display in cart
      };
      
      // For guest users, update Redux state immediately for better UX
      if (!isAuthenticated) {
        dispatch(addItemToGuestCart(guestCartItem));
      }
      
      // Use the new API endpoint for both authenticated and guest users
      const result = await dispatch(updateCartQuantityApi({
        productId: product._id,
        weight: selectedWeight,
        action: 'increment'
      })).unwrap();
      
      if (result.success) {
        // For authenticated users, the API returns the updated cartQuantity
        if (result.cartQuantity !== undefined) {
          setCartQuantity(result.cartQuantity);
          toast.success('Item added to your cart');
        } else {
          toast.success('Item added to your guest cart');
        }
        
        // Keep the "Added" state for a short time
        setTimeout(() => setIsAdded(false), 2000);
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsAdded(false);
      setCartQuantity(0);
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };
  
  // Helper function to update localStorage with current cart quantity
  const updateLocalStorage = (productId, weightObj, quantity) => {
    try {
      console.log('Updating localStorage:', { productId, weightObj, quantity, isAuthenticated });
      
      if (isAuthenticated) {
        // Update authenticated user cart in localStorage
        const authCartJSON = localStorage.getItem('fusionmoksha_auth_cart');
        console.log('Current auth cart:', authCartJSON);
        const authCart = authCartJSON ? JSON.parse(authCartJSON) : [];
        
        // Fix potential issues with object comparison by normalizing the productId
        const existingItemIndex = authCart.findIndex(item => {
          const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId;
          return itemProductId === productId && 
                 item.weight?.value === weightObj.value && 
                 item.weight?.unit === weightObj.unit;
        });
        
        console.log('Existing item index:', existingItemIndex);
        
        if (quantity > 0) {
          if (existingItemIndex !== -1) {
            // Update existing item
            console.log('Updating existing item to quantity:', quantity);
            authCart[existingItemIndex].quantity = quantity;
          } else {
            // Add new item
            console.log('Adding new item with quantity:', quantity);
            authCart.push({
              productId: { _id: productId },
              weight: weightObj,
              quantity: quantity
            });
          }
        } else if (existingItemIndex !== -1) {
          // Remove item if quantity is 0
          console.log('Removing item because quantity is 0');
          authCart.splice(existingItemIndex, 1);
        }
        
        console.log('Saving auth cart:', authCart);
        localStorage.setItem('fusionmoksha_auth_cart', JSON.stringify(authCart));
        console.log('Auth cart saved to localStorage');
      } else {
        // Update guest cart in localStorage
        const guestCartJSON = localStorage.getItem('fusionmoksha_guest_cart');
        console.log('Current guest cart:', guestCartJSON);
        const guestCart = guestCartJSON ? JSON.parse(guestCartJSON) : [];
        
        const existingItemIndex = guestCart.findIndex(item => {
          return item.productId === productId && 
                 item.weight?.value === weightObj.value && 
                 item.weight?.unit === weightObj.unit;
        });
        
        console.log('Existing guest item index:', existingItemIndex);
        
        if (quantity > 0) {
          if (existingItemIndex !== -1) {
            // Update existing item
            console.log('Updating existing guest item to quantity:', quantity);
            guestCart[existingItemIndex].quantity = quantity;
          } else {
            // Add new item
            console.log('Adding new guest item with quantity:', quantity);
            guestCart.push({
              productId: productId,
              weight: weightObj,
              quantity: quantity
            });
          }
        } else if (existingItemIndex !== -1) {
          // Remove item if quantity is 0
          console.log('Removing guest item because quantity is 0');
          guestCart.splice(existingItemIndex, 1);
        }
        
        console.log('Saving guest cart:', guestCart);
        localStorage.setItem('fusionmoksha_guest_cart', JSON.stringify(guestCart));
        console.log('Guest cart saved to localStorage');
      }
      
      // Verify the save worked
      const savedCart = isAuthenticated ? 
        localStorage.getItem('fusionmoksha_auth_cart') : 
        localStorage.getItem('fusionmoksha_guest_cart');
      console.log('Verification - saved cart in localStorage:', savedCart);
      
      // Update the UI immediately with the new quantity
      setCartQuantity(quantity);
      setIsAdded(quantity > 0);
      
      // Force a re-render by dispatching an empty action
      // This ensures the UI updates when localStorage changes
      dispatch({ type: 'cart/localStorageUpdated' });
      
      // Trigger a custom event to notify other components of the change
      window.dispatchEvent(new CustomEvent('fusionmoksha_cart_updated', {
        detail: { productId, weight: weightObj, quantity }
      }));
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  };
  
  // Handle increasing quantity using the updateCartQuantity API endpoint
  const handleIncreaseQuantity = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Prevent actions if we're already processing
    if (isAdding) return;
    
    try {
      setIsAdding(true);
      const selectedWeight = weight || product.variants[0].weight;
      
      // Store current quantity before update
      const currentQuantity = cartQuantity;
      
      // Optimistically update UI for better user experience
      const newQuantity = currentQuantity + 1;
      setCartQuantity(newQuantity);
      setIsAdded(true);
      
      // Update localStorage immediately for fast UI feedback
      updateLocalStorage(product._id, selectedWeight, newQuantity);
      
      // Use the updateCartQuantity API endpoint to increment cart item
      // This happens in the background - we don't wait for the response to update UI
      dispatch(updateCartQuantityApi({
        productId: product._id,
        weight: selectedWeight,
        action: 'increment' // Using the increment action from the API
      }));
      
      // Set a timeout to ensure the UI stays updated
      setTimeout(() => {
        try {
          // Double-check that our UI still shows the correct quantity
          const storedCart = isAuthenticated ? 
            JSON.parse(localStorage.getItem('fusionmoksha_auth_cart') || '[]') : 
            JSON.parse(localStorage.getItem('fusionmoksha_guest_cart') || '[]');
          
          console.log('Verifying UI matches localStorage:', { storedCart, productId: product._id, weight: selectedWeight });
          
          const storedItem = storedCart.find(item => {
            const itemProductId = isAuthenticated ? 
              (typeof item.productId === 'object' ? item.productId._id : item.productId) : 
              item.productId;
            
            return itemProductId === product._id && 
                   item.weight?.value === selectedWeight.value && 
                   item.weight?.unit === selectedWeight.unit;
          });
          
          console.log('Found stored item:', storedItem);
          
          // If the stored quantity doesn't match our UI, update the UI
          if (storedItem && storedItem.quantity !== cartQuantity) {
            console.log('Updating UI to match localStorage:', storedItem.quantity);
            setCartQuantity(storedItem.quantity);
          }
        } catch (error) {
          console.error('Error verifying localStorage:', error);
        } finally {
          setIsAdding(false);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error in handleIncreaseQuantity:', error);
      toast.error('Failed to update quantity');
      
      // Rollback optimistic update on error
      setCartQuantity(cartQuantity);
      if (cartQuantity === 0) {
        setIsAdded(false);
      }
      setIsAdding(false);
    }
  };
  
  // Handle decreasing quantity using the updateCartQuantity API endpoint
  const handleDecreaseQuantity = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Prevent actions if we're already processing
    if (isAdding) return;
    
    try {
      setIsAdding(true);
      const selectedWeight = weight || product.variants[0].weight;
      
      // Store current quantity before update
      const currentQuantity = cartQuantity;
      
      // Optimistically update UI for better user experience
      const newQuantity = Math.max(0, currentQuantity - 1);
      setCartQuantity(newQuantity);
      setIsAdded(newQuantity > 0);
      
      // Update localStorage immediately for fast UI feedback
      updateLocalStorage(product._id, selectedWeight, newQuantity);
      
      // Use the updateCartQuantity API endpoint to decrement cart item
      // This happens in the background - we don't wait for the response to update UI
      dispatch(updateCartQuantityApi({
        productId: product._id,
        weight: selectedWeight,
        action: 'decrement' // Using the decrement action from the API
      }));
      
      // Set a timeout to ensure the UI stays updated
      setTimeout(() => {
        try {
          // Double-check that our UI still shows the correct quantity
          const storedCart = isAuthenticated ? 
            JSON.parse(localStorage.getItem('fusionmoksha_auth_cart') || '[]') : 
            JSON.parse(localStorage.getItem('fusionmoksha_guest_cart') || '[]');
          
          console.log('Verifying UI matches localStorage (decrement):', { storedCart, productId: product._id, weight: selectedWeight });
          
          const storedItem = storedCart.find(item => {
            const itemProductId = isAuthenticated ? 
              (typeof item.productId === 'object' ? item.productId._id : item.productId) : 
              item.productId;
            
            return itemProductId === product._id && 
                   item.weight?.value === selectedWeight.value && 
                   item.weight?.unit === selectedWeight.unit;
          });
          
          console.log('Found stored item (decrement):', storedItem);
          
          // If the stored quantity doesn't match our UI, update the UI
          if (storedItem && storedItem.quantity !== cartQuantity) {
            console.log('Updating UI to match localStorage (decrement):', storedItem.quantity);
            setCartQuantity(storedItem.quantity);
            setIsAdded(storedItem.quantity > 0);
          } else if (!storedItem && cartQuantity !== 0) {
            // Item was removed from cart
            console.log('Item was removed from cart, setting quantity to 0');
            setCartQuantity(0);
            setIsAdded(false);
          }
        } catch (error) {
          console.error('Error verifying localStorage (decrement):', error);
        } finally {
          setIsAdding(false);
        }
      }, 100);
    } catch (error) {
      console.error('Error in handleDecreaseQuantity:', error);
      toast.error('Failed to update quantity');
      
      // Rollback optimistic update on error
      // Use cartQuantity since currentQuantity might not be defined in this scope
      setCartQuantity(cartQuantity);
      setIsAdded(cartQuantity > 0);
      setIsAdding(false);
    }
  };

  // Only render once we've initialized the cart quantity
  if (!isInitialized) {
    return (
      <Button
        disabled={true}
        className={className}
        $style={style}
      >
        Loading...
      </Button>
    );
  }
  
  return (
    <>
      {cartQuantity > 0 ? (
        <QuantityContainer className={className} $style={style}>
          <QuantityButton 
            onClick={handleDecreaseQuantity} 
            disabled={isAdding}
            aria-label="Decrease quantity"
          >
            <FontAwesomeIcon icon={faMinus} />
          </QuantityButton>
          <QuantityDisplay>{cartQuantity}</QuantityDisplay>
          <QuantityButton 
            onClick={handleIncreaseQuantity} 
            disabled={isAdding}
            aria-label="Increase quantity"
          >
            <FontAwesomeIcon icon={faPlus} />
          </QuantityButton>
        </QuantityContainer>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          $added={isAdded}
          className={className}
          $style={style}
        >
          {isAdding ? 'Adding...' : isAdded ? 'Added to Cart' : 'Add to Cart'}
        </Button>
      )}
    </>
  );
};

export default AddToCartButton;
