import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import I18nProvider from './components/I18nProvider';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';

const App = () => {
  return (
    <BrowserRouter>
      <I18nProvider>
        <Routes>
          <Route path="/" element={<Layout children={<Home />} />} />
          <Route path="/about" element={<Layout children={<About />} />} />
          <Route path="/shop" element={<Layout children={<Shop />} />} />
          <Route path="/shop/:id" element={<Layout children={<ProductDetails />} />} />
          <Route path="/contact" element={<Layout children={<Contact />} />} />
        </Routes>
      </I18nProvider>
    </BrowserRouter>
  );
};

export default App;
