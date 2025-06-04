import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { aboutContent } from '../data/data';

const HeroBanner = styled.section`
  width: 100%;
  min-height: 320px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  h1 {
    color: #fff;
    font-size: clamp(1.75rem, 4vw, 3rem);
    text-align: center;
    margin: 0;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FeatureIcon = styled.span`
  font-size: 2.5rem;
  color: #faad14;
  margin-bottom: 1rem;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 1.5rem;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-end;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
`;

const ContentSection = styled.div`
  padding: 2.5rem;
  
  h3 {
    color: black;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
  }
  
  p {
    line-height: 1.8;
    color: #222;
    font-size: 1.0rem;
    font-weight: 300;
    margin-bottom: 1.5rem;
    letter-spacing: 0.5px;
  }
`;

const About = () => {
  const { t } = useTranslation();
  return (
    <>
       <HeroBanner style={{ backgroundImage: 'url(/images/shop/shop_02.jpg)' }}>
        <h1>{t('headingAbout')}</h1>
      </HeroBanner>
      {/* <img src="/images/shop/shop_02.jpg" alt="Shop Banner" style={{ width: '100%', height: 'auto', display: 'block', marginTop: '-1rem' }} /> */}
      <ContentWrapper>
        
        <TwoColumnLayout>
          <ContentSection>
            <h3>Our Store</h3>
            <p>Fusion Moksha was born from a passion for premium tea and coffee. We source our products directly from local farmers in Assam, ensuring the highest quality standards and supporting local communities.</p>
            <p>Our mission is to bring the authentic taste of Assam to your home, combining traditional craftsmanship with modern convenience.</p>
          </ContentSection>
          
          <ImageContainer>
            <img src="/images/mok1_05.png" alt="About Image 1" />
            <img src="/images/mok1_08.png" alt="About Image 2" />
          </ImageContainer>
        </TwoColumnLayout>
      </ContentWrapper>
    </>
    // </Layout>
  );
};

export default About;
