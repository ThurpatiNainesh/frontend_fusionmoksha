import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card';
import { setSearchQuery, setFilters, setSearchResults, setLoading, setError } from '../store/searchSlice.js';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const SearchResults = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const { products = [], loading, error, filters } = useSelector((state) => state.search);

  useEffect(() => {
    // Update Redux state with search parameters
    dispatch(setSearchQuery(query));
    dispatch(setFilters({
      category: searchParams.get('category'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      sortBy: searchParams.get('sortBy') || 'relevance'
    }));
    
    // Fetch search results from backend
    const fetchResults = async () => {
      try {
        dispatch(setLoading(true));
        const searchUrl = new URL('http://localhost:5000/api/products/search');
        searchUrl.searchParams.set('q', query);
        searchUrl.searchParams.set('category', searchParams.get('category') || '');
        searchUrl.searchParams.set('minPrice', searchParams.get('minPrice') || '');
        searchUrl.searchParams.set('maxPrice', searchParams.get('maxPrice') || '');
        searchUrl.searchParams.set('sortBy', searchParams.get('sortBy') || 'relevance');
        searchUrl.searchParams.set('page', searchParams.get('page') || '1');
        searchUrl.searchParams.set('limit', searchParams.get('limit') || '20');

        const response = await fetch(searchUrl.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }
        
        const data = await response.json();
        if (!data || !data.products) {
          throw new Error('Invalid response format');
        }
        
        dispatch(setSearchResults(data));
      } catch (error) {
        console.error('Error fetching search results:', error);
        dispatch(setSearchResults([]));
        dispatch(setError(error.message || 'Failed to fetch search results'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (query) {
      fetchResults();
    }
  }, [dispatch, query]);

  const handleSortChange = (event) => {
    const sortBy = event.target.value;
    dispatch(setFilters({ ...filters, sortBy }));
    // Update URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('sortBy', sortBy);
    window.history.pushState({}, '', newUrl);
  };

  return (
    <Container>
      <h1>Search Results for "{query}"</h1>
      
      {loading ? (
        <p>Loading results...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <Filters>
            <FilterSelect value={filters.sortBy} onChange={handleSortChange}>
              <option value="relevance">Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </FilterSelect>
          </Filters>

          <ProductsGrid>
            {products.length > 0 ? (
              products.map((product) => (
                <Card key={product._id} product={product} />
              ))
            ) : (
              <NoResults>No results found for "{query}"</NoResults>
            )}
          </ProductsGrid>
        </>
      )}
    </Container>
  );
};

export default SearchResults;
