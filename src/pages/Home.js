import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const HeroBanner = styled.section`
  width: 100%;
  min-height: 320px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  h1 {
    color: #fff;
    font-size: clamp(1.75rem, 4vw, 3rem);
    text-align: center;
  }
`;

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* <HeroBanner style={{ backgroundImage: 'url(/images/home-hero.jpg)' }}>
        <h1>Welcome to Fusion Moksha</h1>
      </HeroBanner> */}
       <HeroBanner style={{ backgroundImage: 'url(/images/shop/shop_02.jpg)' }}>
        <h1>{t('Home')}</h1>
      </HeroBanner>
       {/* <img src="/images/shop/shop_02.jpg" alt="Shop Banner" style={{ width: '100%', height: 'auto', display: 'block', marginTop: '-1rem' }} /> */}
      <div style={{ padding: '2rem 0' }}>
        <h2>{t('headingAbout')}</h2>
        <p>Home content goes here...</p>
      </div>
    </>
  );
};

export default Home;
