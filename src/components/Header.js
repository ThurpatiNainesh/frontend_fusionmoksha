import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setFilters } from '../store/searchSlice.js';
import { logout } from '../store/authSlice.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';

// Ensure Font Awesome CSS is imported
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's imported above

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: 6rem;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 1.5rem;
  
  &:hover {
    color: #faad14;
  }
`;

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.8rem;
`;

const Icon = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    color: #faad14;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: none;
  
  input {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 200px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;



const HeaderWrapper = styled.header`
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  padding-bottom: 0.1rem;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 0.15rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0.05rem 0;
  width: 100%;
`;

const MainNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: flex-end;
  flex: 1;
  margin: 0 6rem;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
  margin-right: 6rem;
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
  margin-bottom: -110px;
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
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [searchQuery, setSearchQueryLocal] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e) => {
    setSearchQueryLocal(e.target.value);
    dispatch(setSearchQuery(e.target.value));
  };

  const handleProfileClick = () => {
    window.location.href = '/register';
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearchChange = (event) => {
    setSearchQueryLocal(event.target.value);
    dispatch(setSearchQuery(event.target.value));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      // Dispatch search query and filters to Redux
      dispatch(setSearchQuery(searchQuery));
      dispatch(setFilters({
        category: null,
        minPrice: null,
        maxPrice: null,
        sortBy: 'relevance'
      }));
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <HeaderWrapper>
      <Container>
        <Flex>
          <LeftSection>
            <Logo>
              <NavLink to="/" end>
                <img src="/images/mok1.2_03.png" alt="Fusion Moksha Logo" style={{ height: '140px', width: 'auto', marginBottom: '2rem', position: 'relative', zIndex: 102 }} />
              </NavLink>
            </Logo>
          </LeftSection>
          <MainNav>
            <NavLink to="/" exact>
              {t('home')}
            </NavLink>
            <NavLink to="/about" end>
              {t('about')}
            </NavLink>
            <NavLink to="/shop">
              {t('shop')}
            </NavLink>
            <NavLink to="/contact">
              {t('contact')}
            </NavLink>
            <IconContainer>
              <SearchIcon 
                icon={faMagnifyingGlass} 
                onClick={() => setShowSearch(!showSearch)} 
              />
              <HeaderIcons>
                <Icon icon={faCartShopping} />
                <Icon icon={faUser} onClick={handleProfileClick} />
              </HeaderIcons>
            </IconContainer>
            <SearchContainer style={{ display: showSearch ? 'block' : 'none' }}>
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={handleSearch}
              />
            </SearchContainer>
            <LanguageSelect
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="gu">ગુજરાતી</option>
            </LanguageSelect>
          </MainNav>
        </Flex>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
