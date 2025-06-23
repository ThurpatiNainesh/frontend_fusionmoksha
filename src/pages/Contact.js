import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { contactInfo } from '../data/data';

const HeroBanner = styled.section`
  width: 100%;
  min-height: 320px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/contact/contact_01.jpg');
  color: white;
  text-align: center;
  h1 {
    color: #fff;
    font-size: clamp(1.75rem, 4vw, 3rem);
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const ContactGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

const ContactInfo = styled.div`
  background-color: #f2f2f2; /* Light cement color */
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfoContent = styled.div`
  padding: 3rem 10%;
  position: relative;
  z-index: 2;
  width: 100%;
  
  h2 {
    margin-bottom: 2rem;
    color: #333;
    font-size: 1.75rem;
  }
`;

const ContactItem = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  
  i {
    color: #8c8c8c; /* Cement color */
    font-size: 1.25rem;
    margin-right: 0.75rem;
  }
  
  h3 {
    font-size: 1.1rem;
    font-weight: 500;
    color: #333;
    margin: 0;
  }
`;

const ContactValue = styled.div`
  padding-left: 2rem;
  color: #666;
  font-size: 1rem;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 1.5rem 0;
`;

const ContactImageContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  background-color: rgba(255, 255, 255, 0.3); /* Lighter fog effect to blend with background */
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, rgba(242, 242, 242, 0.9), rgba(242, 242, 242, 0.3));
    z-index: 1;
  }
  
  img {
    width: 80%; /* Reduced size */
    height: auto;
    position: absolute;
    left: 0;
    bottom: 0;
    object-fit: contain;
    display: block;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    height: 250px;
  }
`;

const ContactForm = styled.form`
  background: white;
  padding: 3rem 10%;
  width: 100%;
  
  h2 {
    color: #faad14;
    font-size: 1.75rem;
    margin-bottom: 2rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .full-width {
    grid-column: 1 / -1;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  textarea {
    height: 150px;
    resize: vertical;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background: #faad14;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #e0a000;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #8c8c8c; /* Icon cement color */
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #8c8c8c; /* Icon cement color */
    box-shadow: 0 0 0 1px rgba(140, 140, 140, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #8c8c8c; /* Icon cement color */
  border-radius: 4px;
  height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #8c8c8c; /* Icon cement color */
    box-shadow: 0 0 0 1px rgba(140, 140, 140, 0.2);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: #8c8c8c !important; /* Icon cement color - with !important */
  border: none;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
  color: white;
  
  &:hover {
    background-color: #777777 !important;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.3rem;
  }
`;

const Contact = () => {
  const { t } = useTranslation();
  return (
    <>
       <HeroBanner style={{ backgroundImage: 'url(/images/contactuspage/cont0.png)' }}>
        <h1>{t('headingContact')}</h1>
      </HeroBanner>
      
      <ContentWrapper>
        <ContactGrid>
          <ContactForm>
            <h2>Send us a message</h2>
            <div className="form-grid">
              <Input type="text" placeholder={t("name")} />
              <Input type="email" placeholder={t("email")} />
            </div>
            <div className="form-grid">
              <Input type="tel" placeholder={t("phone")} />
              <Input type="text" placeholder={t("address")} />
            </div>
            <div className="full-width">
              <TextArea placeholder="Your message" />
            </div>
            <div className="full-width">
              <SubmitButton type="submit">{t("submitNow")}</SubmitButton>
            </div>
          </ContactForm>
          <ContactInfo>
            <ContactInfoContent>
              <h2>Contact Information</h2>
              
              <ContactItem>
                <ContactHeader>
                  <i className="fa-regular fa-envelope"></i>
                  <h3>Email</h3>
                </ContactHeader>
                <ContactValue>{contactInfo.email}</ContactValue>
              </ContactItem>
              
              <Divider />
              
              <ContactItem>
                <ContactHeader>
                  <i className="fa-solid fa-phone"></i>
                  <h3>Phone</h3>
                </ContactHeader>
                <ContactValue>{contactInfo.phone}</ContactValue>
              </ContactItem>
              
              <Divider />
              
              <ContactItem>
                <ContactHeader>
                  <i className="fa-solid fa-location-dot"></i>
                  <h3>Address</h3>
                </ContactHeader>
                <ContactValue>{contactInfo.address}</ContactValue>
              </ContactItem>
            </ContactInfoContent>
            
            <ContactImageContainer>
              <img src="/images/contactuspage/cont1.png" alt="Contact Map" />
            </ContactImageContainer>
          </ContactInfo>
        </ContactGrid>
      </ContentWrapper>
    </>
  );
};

export default Contact;
