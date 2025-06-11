import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setFilters } from '../store/searchSlice';
import { fetchProducts, searchProducts } from '../services/api';
import styled from 'styled-components';

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
`;

const ProductCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductTitle = styled.h3`
  margin: 1rem 0;
  font-size: 1.1rem;
`;

const ProductPrice = styled.p`
  color: #2ecc71;
  font-weight: bold;
  font-size: 1.2rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.search.query);
  const filters = useSelector((state) => state.search.filters);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const params = {
          query: searchQuery,
          ...filters
        };
        const data = searchQuery || Object.keys(filters).length > 0 
          ? await searchProducts(params)
          : await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductsData();
  }, [searchQuery, filters]);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleFilterChange = (e) => {
    dispatch(setFilters({
      ...filters,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ProductsContainer>
      <FiltersContainer>
        <FilterInput
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <FilterSelect name="category" onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </FilterSelect>
        <FilterInput
          type="number"
          name="minPrice"
          placeholder="Min Price"
          onChange={handleFilterChange}
        />
        <FilterInput
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          onChange={handleFilterChange}
        />
      </FiltersContainer>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product._id}>
            <ProductImage src={product.image} alt={product.name} />
            <ProductTitle>{product.name}</ProductTitle>
            <ProductPrice>${product.price}</ProductPrice>
            <p>{product.description}</p>
          </ProductCard>
        ))}
      </ProductGrid>
    </ProductsContainer>
  );
};

export default Products;
