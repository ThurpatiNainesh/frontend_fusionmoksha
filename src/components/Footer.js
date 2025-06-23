import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { contactInfo } from '../data/data';


// const Title = styled.h3`
//   font-size: 1rem;
//   margin-bottom: 0.5rem;
// `;


const FooterWrapper = styled.footer`
  background: #111;
  color: #eee;
  padding-top: 3rem;
  border-top: 1px solid #333;
`;

const StyledNavLink = styled(RouterNavLink)`
  display: block;
  color: #ccc;
  text-decoration: none;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  position: relative;
  padding-left: 0.5rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: #fff;
    transition: height 0.2s ease;
  }

  &:hover {
    color: #fff;
    padding-left: 1rem;
    
    &::before {
      height: 70%;
    }
  }

  &.active {
    color: #fff;
    font-weight: 600;
    
    &::before {
      height: 70%;
    }
  }
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
  grid-template-columns: 1fr 1fr 1fr;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    
    & > div:last-child {
      grid-column: 2;
    }
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    
    & > div:last-child {
      grid-column: 1;
    }
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  margin-top: 1rem;
  width: 100%;
  max-width: 300px;
  position: relative;
  
  input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    background: #222;
    color: #fff;
    border-radius: 4px;
    border: 1px solid #333;
    width: 100%;
    
    &::placeholder {
      color: #999;
    }
    
    &:focus {
      outline: none;
      border-color: #555;
    }
  }
  
  button {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    padding: 0.4rem 0.75rem;
    background: #444;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.2s;
    font-weight: 600;
    font-size: 0.8rem;
    
    &:hover {
      background: #555;
    }
  }
`;

const SocialIconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  justify-content: center;
`;

const SocialIconLink = styled.a`
  display: inline-block;
  
  img {
    height: 24px;
    width: 24px;
    transition: opacity 0.2s ease-in-out;
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

const Title = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1.25rem;
  color: #fff;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.75rem;
  letter-spacing: 0.5px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: #fff;
  }
`;

const ContactItem = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  i {
    font-size: 1rem;
    margin-right: 0.75rem;
    width: 20px;
    text-align: center;
  }
  
  h3 {
    font-size: 0.9rem;
    font-weight: 500;
    color: #fff;
    margin: 0;
    letter-spacing: 0.3px;
  }
`;

const ContactValue = styled.div`
  padding-left: 2rem;
  color: #ccc;
  font-size: 0.9rem;
`;

const ContactDivider = styled.div`
  height: 1px;
  background-color: #333;
  margin: 0.75rem 0;
`;

const Copy = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding: 1.5rem 0;
  background: #000;
  font-size: 0.85rem;
  border-top: 1px solid #222;
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
          {/* Quick Links - Left Column */}
          <div>
            <Title>Quick links</Title>
            <nav>
              <StyledNavLink to="/" end>{t("home")}</StyledNavLink>
              <StyledNavLink to="/about">{t("about")}</StyledNavLink>
              <StyledNavLink to="/shop">{t("shop")}</StyledNavLink>
              <StyledNavLink to="/contact">{t("contact")}</StyledNavLink>
            </nav>
          </div>
          
          {/* Newsletter & Social - Center Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Title style={{ textAlign: 'center', '&::after': { left: '50%', transform: 'translateX(-50%)' } }}>{t("subscribe")}</Title>
              <NewsletterForm style={{ width: '100%' }}>
                <input type="email" placeholder="Email" />
                <button>OK</button>
              </NewsletterForm>
              
              <div style={{ marginTop: '1.5rem', textAlign: 'center', width: '100%' }}>
                <SocialIconsWrapper>
                  {socialIcons.map(icon => (
                    <SocialIconLink key={icon.name} href={icon.href} target="_blank" rel="noopener noreferrer" aria-label={icon.name}>
                      <img src={icon.imgSrc} alt={icon.name} />
                    </SocialIconLink>
                  ))}
                </SocialIconsWrapper>
              </div>
            </div>
          </div>
          
          {/* Contact Info - Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <Title>{t("contact")}</Title>
            
            <ContactItem>
              <ContactHeader>
                <i className="fa-regular fa-envelope"></i>
                <h3>{t("email")}</h3>
              </ContactHeader>
              <ContactValue>{contactInfo.email}</ContactValue>
            </ContactItem>
            
            <ContactDivider />
            
            <ContactItem>
              <ContactHeader>
                <i className="fa-solid fa-phone"></i>
                <h3>{t("phone")}</h3>
              </ContactHeader>
              <ContactValue>{contactInfo.phone}</ContactValue>
            </ContactItem>
            
            <ContactDivider />
            
            <ContactItem>
              <ContactHeader>
                <i className="fa-solid fa-location-dot"></i>
                <h3>{t("address")}</h3>
              </ContactHeader>
              <ContactValue>{contactInfo.address}</ContactValue>
            </ContactItem>
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
