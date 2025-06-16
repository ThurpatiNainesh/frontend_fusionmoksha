import styled from 'styled-components';

export const FeatureImageContainer = styled.div`
  width: 100px;
  height: 135px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ReadMoreButton = styled.button`
  background-color: #4CAF50;
  width: 110px;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  font-weight: normal;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;
