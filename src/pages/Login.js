import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice.js';
import { mergeGuestCart, getGuestCart, setIsGuest } from '../store/cartSlice.js';
import { toast } from 'react-toastify';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #faad14;
  }
`;

const Button = styled.button`
  background: #faad14;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;

  &:hover {
    background: #f5a623;
  }
`;

const Error = styled.div`
  color: #ff4d4f;
  text-align: center;
  margin-top: 1rem;
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666;
`;

const RegisterLink = styled.a`
  color: #faad14;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, loading } = useSelector((state) => state.auth);
  const { isGuest } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get returnUrl from location state if available
  const returnUrl = location.state?.returnUrl || '/shop';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check if there's a guest cart before login
      const hasGuestCart = getGuestCart().length > 0;
      
      // Login the user
      await dispatch(login({ email, password })).unwrap();
      
      // If there was a guest cart, merge it with the user's cart
      if (hasGuestCart && isGuest) {
        try {
          const result = await dispatch(mergeGuestCart()).unwrap();
          toast.success('Your guest cart items have been added to your account');
        } catch (mergeError) {
          toast.error('Failed to merge your guest cart: ' + mergeError);
        }
      }
      
      // Update guest status
      dispatch(setIsGuest(false));
      
      // Navigate to returnUrl or default to shop
      navigate(returnUrl, { replace: true });
    } catch (error) {
      // Error is already handled by the auth slice
    }
  };

  // Clear any previous errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <Container>
      <FormContainer>
        <Title>Login</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Error>{error}</Error>}
          <Button type="submit">Login</Button>
        </Form>
        <LinkText>
          <RegisterLink href="#">Forgot Password?</RegisterLink>
        </LinkText>
        <LinkText>
          Don't have an account?{' '}
          <RegisterLink href="/register">Register</RegisterLink>
        </LinkText>
      </FormContainer>
    </Container>
  );
};

export default Login;
