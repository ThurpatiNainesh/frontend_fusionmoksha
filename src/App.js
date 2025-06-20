import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { setAuthToken } from './services/api';
import I18nProvider from './components/I18nProvider';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { store } from './store/index.js';
import { fetchCartItems, loadGuestCart, setIsGuest } from './store/cartSlice';
import CartSynchronizer from './components/CartSynchronizer';

// Initialize auth token from localStorage
const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
};

// Cart initialization component that will be used inside the Redux provider
const CartInitializer = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Initialize cart based on authentication status
    if (isAuthenticated) {
      // For authenticated users, fetch cart from backend
      dispatch(fetchCartItems());
      dispatch(setIsGuest(false));
    } else {
      // For guest users, load cart from localStorage
      dispatch(setIsGuest(true));
      dispatch(loadGuestCart());
    }
  }, [dispatch, isAuthenticated]);
  
  // Return the CartSynchronizer component to ensure cart quantities stay in sync
  return <CartSynchronizer />;
};

// App wrapper with Redux provider
const AppWithProvider = () => {
  return (
    <Provider store={store}>
      <CartInitializer />
      <Routes>
        <Route path="/" element={<Layout children={<Home />} />} />
        <Route path="/about" element={<Layout children={<About />} />} />
        <Route path="/shop" element={<Layout children={<Shop />} />} />
        <Route path="/shop/:id" element={<Layout children={<ProductDetails />} />} />
        <Route path="/contact" element={<Layout children={<Contact />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Layout children={<SearchResults />} />} />
        <Route path="/cart" element={<Layout children={<Cart />} />} />
        <Route path="/checkout" element={<Layout children={<Checkout />} />} />
      </Routes>
    </Provider>
  );
};

const App = () => {
  // Initialize auth token when app loads
  useEffect(() => {
    initializeAuth();
  }, []);
  
  return (
    <BrowserRouter>
      <I18nProvider>
        <AppWithProvider />
      </I18nProvider>
    </BrowserRouter>
  );
};

export default App;
