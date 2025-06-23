import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setFilters } from '../store/searchSlice.js';
import { logout } from '../store/authSlice.js';
import { 
  fetchCartItems, 
  updateCartItemQuantity as updateCartQuantity, 
  removeFromCart, 
  updateItemQuantityOptimistic,
  removeItemFromGuestCart,
  updateGuestItemQuantity,
  fetchProductDetails
} from '../store/cartSlice.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faUser, faTimes, faTrash, faPlus, faMinus, faBars, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import CartDrawerSkeleton from './CartDrawerSkeleton';
import axios from 'axios';
import SideCheckout from './SideCheckout.js';

// Ensure Font Awesome CSS is imported
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's imported above

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: 6rem;
  
  @media (max-width: 992px) {
    margin-left: 2rem;
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    margin-left: auto;
    margin-right: 0.5rem;
  }
  
  @media (max-width: 576px) {
    gap: 0.8rem;
  }
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

const MobileSearchIcon = styled(FontAwesomeIcon)`
  font-size: 1.2rem;
  color: #333;
  cursor: pointer;
  transition: color 0.2s;
  margin-right: 1rem;
  
  &:hover {
    color: #faad14;
  }
  
  @media (max-width: 768px) {
    margin-right: 0.5rem;
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
  
  @media (max-width: 768px) {
    width: 350px;
  }
  
  @media (max-width: 480px) {
    width: 300px;
  }
  
  @media (max-width: 360px) {
    width: 280px;
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

const CartCloseButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #faad14;
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
  display: ${props => props.isVisible ? 'block' : 'none'};
  
  input {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 200px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    padding: 0.5rem;
    background: white;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 101;
    
    input {
      width: 100%;
    }
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledSearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchButton = styled.button`
  background: #faad14;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  margin-left: -1px;
  
  &:hover {
    background: #e69b00;
  }
`;

const MobileCloseButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #faad14;
  }
`;

const MobileOverlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 104;
  }
`;


const HeaderWrapper = styled.header`
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.8rem 0;
  
  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
  
  @media (max-width: 576px) {
    padding: 0.3rem 0;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 0.5rem;
  
  @media (max-width: 1200px) {
    padding: 0.5rem 1rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.5rem;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0.05rem 0;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  
  @media (max-width: 576px) {
    padding: 0.3rem 0;
  }
`;

const MainNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: flex-end;
  flex: 1;
  margin: 0 6rem;
  
  a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    
    &:hover, &.active {
      color: #faad14;
    }
  }
  
  @media (max-width: 1200px) {
    margin: 0 2rem;
    gap: 1.5rem;
  }
  
  @media (max-width: 992px) {
    margin: 0 1rem;
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px; /* Smaller side nav */
    height: 100vh;
    background: white;
    z-index: 105;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 4rem;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    margin: 0;
    gap: 1rem;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    
    &.mobile-open {
      transform: translateX(0);
    }
    
    a {
      font-size: 1rem;
      padding: 0.7rem 1.5rem;
      width: 100%;
      text-align: left;
      border-left: 3px solid transparent;
      
      &.active, &:hover {
        border-left: 3px solid #faad14;
        background-color: rgba(250, 173, 20, 0.05);
      }
    }
  }
  
  @media (max-width: 576px) {
    width: 220px; /* Even smaller on phones */
    
    a {
      font-size: 0.95rem;
      padding: 0.6rem 1.2rem;
    }
  }
  
  .mobile-menu-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.5rem;
    display: none;
    
    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
  margin-right: 6rem;
  
  @media (max-width: 1200px) {
    margin-right: 2rem;
  }
  
  @media (max-width: 992px) {
    margin-right: 1rem;
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    justify-content: flex-start;
    width: auto;
  }
  
  @media (max-width: 576px) {
    flex: 0;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  
  img {
    height: 140px;
    width: auto;
    margin-bottom: 2rem;
    position: relative;
    z-index: 102;
  }
  
  @media (max-width: 992px) {
    img {
      height: 120px;
      margin-bottom: 1.5rem;
    }
  }
  
  @media (max-width: 768px) {
    img {
      height: 100px;
      margin-bottom: 1rem;
    }
  }
  
  @media (max-width: 576px) {
    img {
      height: 80px;
      margin-bottom: 0.5rem;
    }
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  padding: 0.5rem;
  margin-left: 0.5rem;
  
  &:hover {
    color: #faad14;
  }
  
  @media (max-width: 768px) {
    display: block;
    order: -1;
  }
  
  @media (max-width: 576px) {
    margin-left: 0;
    font-size: 1.3rem;
  }
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

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: -110px;
  position: relative;
  z-index: 101;
  padding: 0.5rem 0;
  
  @media (max-width: 576px) {
    display: none; /* Hide logo on phone screens */
  }
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

const ProfileDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  min-width: 150px;
  z-index: 200;
  overflow: hidden;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const ProfileDropdownItem = styled.div`
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #f5f5f5;
    color: #faad14;
  }
`;

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { items: cartItems, loading: cartLoading, isGuest } = useSelector((state) => state.cart);
  const [productCache, setProductCache] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQueryLocal] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Close mobile menu when navigating to a new page
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Close mobile menu when clicking outside
  const handleOverlayClick = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isAuthenticated]);
  
  // Fetch product details for guest cart items if needed
  useEffect(() => {
    const fetchMissingProductDetails = async () => {
      if (!isAuthenticated && isGuest && cartItems.length > 0) {
        const itemsNeedingDetails = cartItems.filter(item => 
          !item.productName || !item.image
        );
        
        for (const item of itemsNeedingDetails) {
          // Check if we already have this product in cache
          if (!productCache[item.productId]) {
            try {
              // Fetch product details from API
              const productId = typeof item.productId === 'object' ? item.productId._id : item.productId;
              const response = await axios.get(`https://fusionmokshabackend-production.up.railway.app/api/products/${productId}`);
              const productData = response.data;
              
              // Update cache
              setProductCache(prev => ({
                ...prev,
                [productId]: productData
              }));
              
              // Update the item in cart with product details
              dispatch(fetchProductDetails({
                itemId: item._id,
                productDetails: {
                  productName: productData.name,
                  image: productData.mainImage,
                  price: item.price || productData.variants[0]?.price,
                  originalPrice: item.originalPrice || productData.variants[0]?.originalPrice
                }
              }));
            } catch (error) {
              console.error(`Failed to fetch product details for ${item.productId}:`, error);
            }
          }
        }
      }
    };
    
    fetchMissingProductDetails();
  }, [cartItems, isAuthenticated, isGuest, productCache, dispatch]);

  const handleSearch = (e) => {
    setSearchQueryLocal(e.target.value);
    dispatch(setSearchQuery(e.target.value));
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setProfileDropdownOpen(!profileDropdownOpen);
    } else {
      navigate('/login');
    }
  };
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

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
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      // Hide search after submission
      setShowSearch(false);
    }
  };
  
  // Cart item quantity and remove functions
  const handleUpdateCartQuantity = (itemId, currentQuantity, change) => {
    if (isAuthenticated) {
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
    } else {
      // For guest users, update in localStorage
      dispatch(updateGuestItemQuantity({ itemId, change }));
      toast.success('Cart updated');
    }
  };
  
  const removeCartItem = (itemId) => {
    if (isAuthenticated) {
      // Dispatch action to remove item from cart for authenticated users
      dispatch(removeFromCart(itemId))
        .unwrap()
        .then(() => {
          toast.success('Item removed from cart');
        })
        .catch((error) => {
          toast.error('Failed to remove item: ' + error);
        });
    } else {
      // For guest users, remove from localStorage
      dispatch(removeItemFromGuestCart(itemId));
      toast.success('Item removed from cart');
    }
  };

  return (
    <HeaderWrapper>
      <MobileOverlay isOpen={mobileMenuOpen} onClick={handleOverlayClick} />
      
      <Container>
        <Flex>
          <LeftSection>
            <LogoContainer>
              <img src="/images/mok1.2_03.png" alt="Fusion Moksha" style={{ height: '120px', width: 'auto' }} className="header-logo" />
            </LogoContainer>
            <MobileMenuToggle onClick={toggleMobileMenu}>
              <FontAwesomeIcon icon={faBars} />
            </MobileMenuToggle>
          </LeftSection>
          
          <MainNav className={mobileMenuOpen ? 'mobile-open' : ''}>
            <NavLink to="/" end onClick={handleNavLinkClick}>{t('home')}</NavLink>
            <NavLink to="/about" end onClick={handleNavLinkClick}>{t('about')}</NavLink>
            <NavLink to="/shop" onClick={handleNavLinkClick}>{t('shop')}</NavLink>
            <NavLink to="/contact" onClick={handleNavLinkClick}>{t('contact')}</NavLink>
            
            {/* Close button for mobile menu */}
            <MobileCloseButton className="mobile-menu-close" onClick={toggleMobileMenu}>
              <FontAwesomeIcon icon={faTimes} />
            </MobileCloseButton>
          </MainNav>
          
          <IconContainer>
            <MobileSearchIcon 
              icon={faMagnifyingGlass} 
              onClick={() => setShowSearch(!showSearch)} 
            />
            
            <SearchContainer isVisible={showSearch}>
              <SearchForm onSubmit={handleSearchSubmit}>
                <StyledSearchInput 
                  type="text" 
                  placeholder={t('searchPlaceholder')} 
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <SearchButton type="submit">
                  <FontAwesomeIcon icon={faSearch} />
                </SearchButton>
              </SearchForm>
            </SearchContainer>
            
            <HeaderIcons>
              <CartContainer>
                <div style={{ position: 'relative' }}>
                  <div 
                    style={{ color: 'inherit', cursor: 'pointer' }}
                    onClick={() => {
                      if (isAuthenticated) {
                        dispatch(fetchCartItems());
                      }
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
              <div className="profile-dropdown-container" style={{ position: 'relative' }}>
                <Icon 
                  icon={faUser} 
                  onClick={handleProfileClick} 
                  title={isAuthenticated ? 'My Profile' : 'Login/Register'}
                />
                {isAuthenticated && (
                  <ProfileDropdown isOpen={profileDropdownOpen}>
                    <ProfileDropdownItem onClick={() => navigate('/profile')}>
                      <FontAwesomeIcon icon={faUser} />
                      <span>My Profile</span>
                    </ProfileDropdownItem>
                    <ProfileDropdownItem onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span>Logout</span>
                    </ProfileDropdownItem>
                  </ProfileDropdown>
                )}
              </div>
            </HeaderIcons>
            
            <LanguageSelect
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="gu">ગુજરાતી</option>
            </LanguageSelect>
          </IconContainer>
        </Flex>
      </Container>
      
      {/* Integrated Checkout Sidebar */}
      <SideCheckout 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        productCache={productCache}
      />
    </HeaderWrapper>
  );
};

export default Header;
