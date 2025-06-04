import React from 'react';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          home: "Home",
          about: "About Us",
          shop: "Shop",
          contact: "Contact",
          subscribe: "Subscribe to our Newsletter",
          submitNow: "Submit Now",
          address: "Address",
          email: "Email",
          phone: "Phone",
          headingAbout: "ABOUT US",
          headingContact: "CONTACT US",
          headingShop: "SHOP",
        },
      },
      pl: { translation: { /* Polish translations */ } },
      de: { translation: { /* German translations */ } },
      es: { translation: { /* Spanish translations */ } },
      ru: { translation: { /* Russian translations */ } },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

const I18nProvider = ({ children }) => (
  <React.StrictMode>
    {children}
  </React.StrictMode>
);

export default I18nProvider;
