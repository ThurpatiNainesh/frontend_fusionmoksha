import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const FooterWrapper = styled.footer`
  background: #111;
  color: #eee;
  padding-top: 2rem;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 1rem;
`;

const FooterGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const NewsletterForm = styled.form`
  display: flex;
  margin-top: 0.5rem;
  input {
    flex: 1;
    padding: 0.5rem;
    border: none;
  }
  button {
    padding: 0 1rem;
    background: #faad14;
    border: none;
    cursor: pointer;
  }
`;

const SocialIconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* Space between icons */
`;

const SocialIconLink = styled.a`
  display: inline-block;
  img {
    height: 24px; // Adjust size as needed
    width: 24px;  // Adjust size as needed
    transition: opacity 0.2s ease-in-out;
    &:hover {
      opacity: 0.7;
    }
  }
`;

const Title = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const Copy = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding: 1rem 0;
  background: #000;
  font-size: 0.85rem;
`;

const Footer = () => {
  const { t } = useTranslation();

  const socialIcons = [
    { name: 'Social Media 1', href: '#', imgSrc: '/images/socialIcons/mok1_28.png' },
    { name: 'Social Media 2', href: '#', imgSrc: '/images/socialIcons/mok1_30.png' },
    { name: 'Social Media 3', href: '#', imgSrc: '/images/socialIcons/mok1_32.png' },
    { name: 'Social Media 4', href: '#', imgSrc: '/images/socialIcons/mok1_36.png' },
  ];


  return (
    <FooterWrapper>
      <Container>
        <FooterGrid>
          <div>
            <Title>Quick links</Title>
            <nav>
              <NavLink to="/" end>{t("home")}</NavLink>
              <NavLink to="/about">{t("about")}</NavLink>
              <NavLink to="/shop">{t("shop")}</NavLink>
              <NavLink to="/contact">{t("contact")}</NavLink>
            </nav>
          </div>
          <div>
            <Title>{t("subscribe")}</Title>
            <NewsletterForm>
              <input type="email" placeholder="Email" />
              <button>OK</button>
            </NewsletterForm>
          </div>
          <div>
            <Title>{t("contact")}</Title>
            <p><strong>{t("email")}</strong>: info@fusionmoksha.com</p>
            <p><strong>{t("phone")}</strong>: +91-9031097845</p>
            <p><strong>{t("address")}</strong>: H No 4, Guwahati, Assam 781028</p>
          </div>
          <div>
            <Title>{t("follow_us")}</Title>
            <SocialIconsWrapper>
              {socialIcons.map(icon => (
                <SocialIconLink key={icon.name} href={icon.href} target="_blank" rel="noopener noreferrer" aria-label={icon.name}>
                  <img src={icon.imgSrc} alt={icon.name} />
                </SocialIconLink>
              ))}
            </SocialIconsWrapper>
          </div>
        </FooterGrid>
      </Container>
      <Copy>
        <img src="/images/mok1.2_03.png" alt="Fusion Moksha Logo" style={{ height: '20px', width: 'auto', marginRight: '0.5rem' }} />
        © Copyright 2025 Fusion Moksha. All rights reserved.
      </Copy>
    </FooterWrapper>
  );
};

export default Footer;
