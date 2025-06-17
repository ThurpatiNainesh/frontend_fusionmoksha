import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setFilters } from '../store/searchSlice.js';
import { logout } from '../store/authSlice.js';
import { fetchCartItems, updateCartItemQuantity as updateCartQuantity, removeFromCart, updateItemQuantityOptimistic } from '../store/cartSlice.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faUser, faTimes, faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

// Ensure Font Awesome CSS is imported
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's imported above

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: 6rem;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 1.5rem;
  
  &:hover {
    color: #faad14;
  }
`;

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.8rem;
`;

const Icon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    color: #faad14;
  }
`;

const CartContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const CartDrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const CartDrawer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-400px'};
  width: 380px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 12px rgba(0,0,0,0.15);
  z-index: 1000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    width: 320px;
  }
`;

const CartItem = styled.div`
  display: flex;
  position: relative;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0.5rem;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const CartItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
  align-self: flex-start;
`;

const CartItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 60px;
  justify-content: space-between;
  padding-right: 20px;
`;

const CartItemName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #333;
  line-height: 1.2;
`;

const CartItemPrice = styled.div`
  font-size: 0.95rem;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 60px;
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-top: 1px solid #e8e8e8;
  margin-top: 0.5rem;
  font-weight: 600;
`;

const CartButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #faad14;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #e69b00;
  }
`;

const CartDrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
`;

const CartDrawerTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
`;

const CartDrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const CartDrawerFooter = styled.div`
  padding: 1.25rem;
  border-top: 1px solid #f0f0f0;
  background-color: #f9f9f9;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }
`;

const CartItemQuantity = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const QuantityButton = styled.button`
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0;
  color: #666;
  
  &:hover {
    border-color: #d9d9d9;
    color: #333;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      border-color: #e0e0e0;
      color: #666;
    }
  }
`;

const QuantityValue = styled.span`
  padding: 0 0.5rem;
  min-width: 30px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color:rgb(145, 144, 144);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0.75rem;
  right: 0;
  
  &:hover {
    color: #ff7875;
  }
`;

const CartItemWeight = styled.div`
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 0.5rem;
`;

const CartItemPriceWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  width: 100%;
`;

const CartItemActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const SearchContainer = styled.div`
  position: relative;
  display: none;
  
  input {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 200px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;



const HeaderWrapper = styled.header`
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  padding-bottom: 0.1rem;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 0.15rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0.05rem 0;
  width: 100%;
`;

const MainNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: flex-end;
  flex: 1;
  margin: 0 6rem;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
  margin-right: 6rem;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  margin-bottom: -70px; // To pull it up with the logo
  position: relative;
  z-index: 101;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0.4rem;
  font-size: 0.9rem;
  color: #333;
  width: 200px; // Adjust as needed
  &::placeholder {
    color: #777;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin-bottom: -110px;
  position: relative;
  z-index: 101;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  a {
    position: relative;
    padding-bottom: 0.25rem;
  }
  a.active::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: #faad14;
  }
`;

const LanguageSelect = styled.select`
  border: 1px solid #ddd;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #fff;
`;

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { items: cartItems, loading: cartLoading } = useSelector((state) => state.cart);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQueryLocal] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isAuthenticated]);

  const handleSearch = (e) => {
    setSearchQueryLocal(e.target.value);
    dispatch(setSearchQuery(e.target.value));
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      window.location.href = '/profile';
    } else {
      window.location.href = '/login';
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    // Optional: Redirect to home page after logout
    window.location.href = '/';
  };

  const handleSearchChange = (event) => {
    setSearchQueryLocal(event.target.value);
    dispatch(setSearchQuery(event.target.value));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      // Dispatch search query and filters to Redux
      dispatch(setSearchQuery(searchQuery));
      dispatch(setFilters({
        category: null,
        minPrice: null,
        maxPrice: null,
        sortBy: 'relevance'
      }));
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  // Cart item quantity and remove functions
  const handleUpdateCartQuantity = (itemId, currentQuantity, change) => {
    // Optimistically update the UI first
    dispatch(updateItemQuantityOptimistic({ itemId, change }));
    
    // Then dispatch the async thunk to update on the server
    dispatch(updateCartQuantity({ itemId, change }))
      .unwrap()
      .then(() => {
        toast.success('Cart updated');
      })
      .catch((error) => {
        toast.error('Failed to update cart: ' + error);
      });
  };
  
  const removeCartItem = (itemId) => {
    // Dispatch action to remove item from cart
    dispatch(removeFromCart(itemId))
      .unwrap()
      .then(() => {
        toast.success('Item removed from cart');
      })
      .catch((error) => {
        toast.error('Failed to remove item: ' + error);
      });
  };

  return (
    <HeaderWrapper>
      <Container>
        <Flex>
          <LeftSection>
            <Logo>
              <NavLink to="/" end>
                <img src="/images/mok1.2_03.png" alt="Fusion Moksha Logo" style={{ height: '140px', width: 'auto', marginBottom: '2rem', position: 'relative', zIndex: 102 }} />
              </NavLink>
            </Logo>
          </LeftSection>
          <MainNav>
            <NavLink to="/" exact>
              {t('home')}
            </NavLink>
            <NavLink to="/about" end>
              {t('about')}
            </NavLink>
            <NavLink to="/shop">
              {t('shop')}
            </NavLink>
            <NavLink to="/contact">
              {t('contact')}
            </NavLink>
            <IconContainer>
              <SearchIcon 
                icon={faMagnifyingGlass} 
                onClick={() => setShowSearch(!showSearch)} 
              />
              <HeaderIcons>
                <CartContainer>
                  <div style={{ position: 'relative' }}>
                    <div 
                      style={{ color: 'inherit', cursor: 'pointer' }}
                      onClick={() => {
                        dispatch(fetchCartItems());
                        setIsCartOpen(true);
                      }}
                    >
                      <Icon icon={faCartShopping} />
                      {cartItems.length > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          backgroundColor: '#ff4d4f',
                          color: 'white',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          {cartItems.length > 9 ? '9+' : cartItems.length}
                        </span>
                      )}
                    </div>
                  </div>
                </CartContainer>
                <Icon 
                  icon={faUser} 
                  onClick={handleProfileClick} 
                  title={isAuthenticated ? 'My Profile' : 'Login/Register'}
                />
                {isAuthenticated && (
                  <button 
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#333',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      marginLeft: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      ':hover': {
                        backgroundColor: '#f5f5f5',
                      }
                    }}
                  >
                    <span>Logout</span>
                  </button>
                )}
              </HeaderIcons>
            </IconContainer>
            <SearchContainer style={{ display: showSearch ? 'block' : 'none' }}>
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={handleSearch}
              />
            </SearchContainer>
            <LanguageSelect
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="gu">ગુજરાતી</option>
            </LanguageSelect>
          </MainNav>
        </Flex>
      </Container>
      
      {/* Cart Side Drawer */}
      <CartDrawerOverlay isOpen={isCartOpen} onClick={() => setIsCartOpen(false)} />
      <CartDrawer isOpen={isCartOpen}>
        <CartDrawerHeader>
          <CartDrawerTitle>{t('yourCart', 'Your Cart')}</CartDrawerTitle>
          <CloseButton onClick={() => setIsCartOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </CartDrawerHeader>
        
        <CartDrawerContent>
          {cartLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>Loading...</div>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#666' }}>
              <div style={{ fontSize: '3rem', color: '#e8e8e8', marginBottom: '1rem' }}>
                <FontAwesomeIcon icon={faCartShopping} />
              </div>
              {t('emptyCart', 'Your cart is empty')}
              <div style={{ marginTop: '1rem' }}>
                <CartButton onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}>
                  {t('continueShopping', 'Continue Shopping')}
                </CartButton>
              </div>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <CartItem key={item._id}>
                  <CartItemImage 
                    src={item.image || item.productId?.mainImage || '/images/placeholder.png'} 
                    alt={item.name || item.productId?.name}
                  />
                  <CartItemDetails>
                    <CartItemName>{item.name || item.productId?.name}</CartItemName>
                    <div style={{ fontSize: '0.85rem', fontWeight: '500', color: '#555', marginBottom: '0.25rem' }}>Organic Product</div>
                    <CartItemWeight>{item.weight ? `${item.weight.value}${item.weight.unit}` : '250g'}</CartItemWeight>
                    
                    <CartItemPriceWrapper>
                      <CartItemQuantity>
                        <QuantityButton 
                          disabled={item.quantity <= 1}
                          onClick={() => handleUpdateCartQuantity(item._id, item.quantity, -1)}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </QuantityButton>
                        <QuantityValue>{item.quantity}</QuantityValue>
                        <QuantityButton
                          onClick={() => handleUpdateCartQuantity(item._id, item.quantity, 1)}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </QuantityButton>
                      </CartItemQuantity>
                      
                      <CartItemPrice>
                        {item.originalPrice && item.originalPrice > item.price ? (
                          <>
                            <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '5px', fontSize: '0.85rem' }}>₹{item.originalPrice}</span>
                            <span style={{ color: 'black', fontWeight: '600' }}>₹{item.price}</span>
                          </>
                        ) : (
                          <span>₹{item.price}</span>
                        )}
                      </CartItemPrice>
                    </CartItemPriceWrapper>
                  </CartItemDetails>
                  
                  <RemoveButton
                    onClick={() => removeCartItem(item._id)}
                    title="Remove item"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </RemoveButton>
                </CartItem>
              ))}
              
              {/* Subtotal section and buttons moved right after product list */}
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1rem', marginTop: '1rem' }}>
                <CartTotal style={{ margin: '0.5rem 0 1rem' }}>
                  <span>{t('subtotal', 'Subtotal')}:</span>
                  <span>₹{cartItems.reduce((total, item) => total + (item.price || item.product?.price || 0) * item.quantity, 0).toFixed(2)}</span>
                </CartTotal>
                
                <CartButton 
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  style={{ backgroundColor: 'green', marginTop: '0.5rem' }}
                >
                  {t('proceedToCheckout', 'Checkout')}
                </CartButton>
                
                {/* <CartButton 
                  onClick={() => setIsCartOpen(false)}
                  style={{ backgroundColor: '#8c8c8c', marginTop: '0.5rem' }}
                >
                  {t('continueShopping', 'Continue Shopping')}
                </CartButton> */}
              </div>
            </>
          )}
        </CartDrawerContent>
        
        {/* Footer removed as content was moved into the cart content area */}
      </CartDrawer>
    </HeaderWrapper>
  );
};

export default Header;
