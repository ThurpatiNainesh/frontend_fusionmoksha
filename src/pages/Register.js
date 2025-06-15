import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/authSlice.js';

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

const LoginLink = styled.a`
  color: #faad14;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { error, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(register({ name, email, password, phone })).unwrap();
      navigate('/login');
    } catch (error) {
      // Error is already handled by the auth slice
    }
  };

  // Clear any previous errors when component mounts
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <Container>
      <FormContainer>
        <Title>Register</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {error && <Error>{error}</Error>}
          <Button type="submit">Register</Button>
        </Form>
        <LinkText>
          Already have an account?{' '}
          <LoginLink href="/login">Login</LoginLink>
        </LinkText>
      </FormContainer>
    </Container>
  );
};

export default Register;
