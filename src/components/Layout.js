import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 0;
`;

const AuthButton = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.9rem;
  a {
    color: #faad14;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Layout = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const logout = () => dispatch(logout());

  return (
    <>
      <Header />
      <AuthButton>
        {isAuthenticated ? (
          <span onClick={logout} style={{ cursor: 'pointer' }}>
            Logout
          </span>
        ) : (
          <>
            <Link to="/login">Login</Link>
            {' | '}
            <Link to="/register">Register</Link>
          </>
        )}
      </AuthButton>
      <main>
        <Container>
          {children}
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
