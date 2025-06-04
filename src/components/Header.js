import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeaderWrapper = styled.header`
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  margin-bottom: -70px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 1rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: flex-start; // Align items to the top of the container
  gap: 1.5rem; // Space between logo and search bar
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  margin-bottom: -70px; // To pull it up with the logo
  position: relative;
  z-index: 101;
  /* transform: translateY(-8px); // Removed, flex-start should primarily handle top alignment */
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0.4rem;
  font-size: 0.9rem;
  color: #333;
  width: 200px; // Adjust as needed
  &::placeholder {
    color: #777;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin-bottom: -70px;
  position: relative;
  z-index: 101;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  a {
    position: relative;
    padding-bottom: 0.25rem;
  }
  a.active::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: #faad14;
  }
`;

const LanguageSelect = styled.select`
  border: 1px solid #ddd;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #fff;
`;

const Header = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      console.log('Search submitted:', searchQuery);
      // Implement actual search logic here (e.g., navigate to search results page)
      // For now, we'll just log it and clear the query
      setSearchQuery('');
    }
  };

  return (
    <HeaderWrapper>
      <Container>
        <Flex>
          <LeftSection>
            <Logo>
              <NavLink to="/" end>
                <img src="/images/mok1.2_03.png" alt="Fusion Moksha Logo" style={{ height: '100px', width: 'auto', marginBottom: '1rem', position: 'relative', zIndex: 102 }} />
              </NavLink>
            </Logo>
            <SearchWrapper>
              <SearchInput 
                type="text" 
                placeholder={t('searchPlaceholder', 'Search products...')}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleSearchSubmit}
              />
              {/* You can add a search icon here if desired */}
              {/* For example: <i className="fas fa-search"></i> */}
            </SearchWrapper>
          </LeftSection>
          <Nav>
            <NavLink to="/" end>{t("home")}</NavLink>
            <NavLink to="/about" end>{t("about")}</NavLink>
            <NavLink to="/shop" end>{t("shop")}</NavLink>
            <NavLink to="/contact" end>{t("contact")}</NavLink>
          </Nav>
          <LanguageSelect
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="pl">PL</option>
            <option value="de">DE</option>
            <option value="es">ES</option>
            <option value="ru">RU</option>
          </LanguageSelect>
        </Flex>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
