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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ContactGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
`;

const ContactInfo = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  h2 {
    color: #faad14;
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }
  
  p {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: #333;
    
    strong {
      color: #222;
      font-weight: 600;
    }
  }
  
  .contact-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    .contact-image {
      grid-column: 1 / -1;
      margin-bottom: 1.5rem;
    }
  }
`;

const ContactForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
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
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  height: 150px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: #faad14;
  border: none;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 4px;
  
  &:hover {
    background: #e0a000;
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
      {/* <HeroBanner style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1546832947-15b015b363e5?w=1200)' }}>
        <h1>{t('headingContact')}</h1>
      </HeroBanner> */}
      <HeroBanner style={{ backgroundImage: 'url(/images/contactuspage/cont0.png)' }}>
        <h1>{t('headingContact')}</h1>
      </HeroBanner>
       {/* <img src="/images/contactuspage/cont0.png" alt="Contact Banner" style={{ width: '100%', height: 'auto', display: 'block', marginTop: '-1rem' }} /> */}
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
            <div>
              <h2>Contact Information</h2>
              <p><strong>Email:</strong> {contactInfo.email}</p>
              <p><strong>Phone:</strong> {contactInfo.phone}</p>
              <p><strong>Address:</strong> {contactInfo.address}</p>
              <p><strong>Working Hours:</strong> {contactInfo.workingHours}</p>
            </div>
            <img src="/images/contactuspage/cont1.png" alt="Contact Map" className="contact-image" />
          </ContactInfo>
        </ContactGrid>
      </ContentWrapper>
    </>
  );
};

export default Contact;
