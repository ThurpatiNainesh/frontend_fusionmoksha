import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 0;
`;

const Layout = ({ children }) => {
  return (
    <>
      <Header />
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
