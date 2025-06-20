import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AddressContainer = styled.div`
  padding: 1rem 0;
`;

const AddressTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

const AddressCard = styled.div`
  border: 1px solid ${props => props.$selected ? '#2e7d32' : '#e0e0e0'};
  border-radius: 4px;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  background-color: ${props => props.$selected ? '#f1f8e9' : 'white'};
  
  &:hover {
    border-color: ${props => props.$selected ? '#2e7d32' : '#bdbdbd'};
  }
`;

const DefaultBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #2e7d32;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 2rem;
`;

const AddressActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.3rem 0.5rem;
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const AddButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #f5f5f5;
  border: 1px dashed #bdbdbd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #eeeeee;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ProceedButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: #1b5e20;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #757575;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #616161;
  }
`;

const GuestAddressForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: true
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Save to localStorage for guest
    const guestAddress = {
      ...formData,
      _id: 'guest-' + Date.now(), // Generate a temporary ID
      isDefault: true // Guest can only have one address, so it's default
    };
    
    // Store in localStorage
    localStorage.setItem('guestAddress', JSON.stringify(guestAddress));
    
    onSave(guestAddress);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Full Name*</Label>
        <Input 
          type="text" 
          name="fullName" 
          value={formData.fullName} 
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Phone Number*</Label>
        <Input 
          type="tel" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Address Line 1*</Label>
        <Input 
          type="text" 
          name="addressLine1" 
          value={formData.addressLine1} 
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Address Line 2</Label>
        <Input 
          type="text" 
          name="addressLine2" 
          value={formData.addressLine2} 
          onChange={handleChange}
        />
      </FormGroup>
      
      <FormRow>
        <FormGroup>
          <Label>City*</Label>
          <Input 
            type="text" 
            name="city" 
            value={formData.city} 
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>State*</Label>
          <Select 
            name="state" 
            value={formData.state} 
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            {/* Add more states as needed */}
          </Select>
        </FormGroup>
      </FormRow>
      
      <FormGroup>
        <Label>Pincode*</Label>
        <Input 
          type="text" 
          name="pincode" 
          value={formData.pincode} 
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <ProceedButton type="submit">Save Address</ProceedButton>
        <BackButton type="button" onClick={onCancel}>Cancel</BackButton>
      </div>
    </form>
  );
};

const AddressStep = ({ onProceed, onBack }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Fetch addresses if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    } else {
      // For guest users, check localStorage
      const savedAddress = localStorage.getItem('guestAddress');
      if (savedAddress) {
        const parsedAddress = JSON.parse(savedAddress);
        setAddresses([parsedAddress]);
        setSelectedAddress(parsedAddress._id);
      }
    }
  }, [isAuthenticated]);
  
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/addresses');
      setAddresses(response.data.addresses);
        
      // Select default address if available
      const defaultAddress = response.data.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      } else if (response.data.addresses.length > 0) {
        setSelectedAddress(response.data.addresses[0]._id);
      }
    } catch (error) {
      toast.error('Failed to fetch addresses: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddAddress = async (addressData) => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const response = await api.post('/api/addresses', addressData);
        toast.success('Address added successfully');
        fetchAddresses();
        setShowAddForm(false);
      } catch (error) {
        toast.error('Failed to add address: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    } else {
      // For guest users
      setAddresses([addressData]);
      setSelectedAddress(addressData._id);
      setShowAddForm(false);
    }
  };
  
  const handleSetDefaultAddress = async (addressId) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await api.patch(`/api/addresses/${addressId}/default`, {});
      toast.success('Default address updated');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to update default address: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAddress = async (addressId) => {
    if (!isAuthenticated) return;
    
    if (window.confirm('Are you sure you want to delete this address?')) {
      setLoading(true);
      try {
        const response = await api.delete(`/api/addresses/${addressId}`);
        toast.success('Address deleted');
        fetchAddresses();
      } catch (error) {
        toast.error('Failed to delete address: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleProceed = () => {
    if (!selectedAddress) {
      toast.error('Please select an address to proceed');
      return;
    }
    
    // Find the selected address object
    const addressObj = addresses.find(addr => addr._id === selectedAddress);
    
    // Store the selected address in localStorage for order processing
    localStorage.setItem('selectedAddress', JSON.stringify(addressObj));
    
    onProceed();
  };
  
  if (loading) {
    return (
      <AddressContainer>
        <div>Loading addresses...</div>
      </AddressContainer>
    );
  }
  
  if (showAddForm) {
    return (
      <AddressContainer>
        <AddressTitle>Add New Address</AddressTitle>
        <GuestAddressForm 
          onSave={handleAddAddress} 
          onCancel={() => setShowAddForm(false)} 
        />
      </AddressContainer>
    );
  }
  
  return (
    <AddressContainer>
      <AddressTitle>Select Delivery Address</AddressTitle>
      
      {addresses.length > 0 ? (
        <AddressList>
          {addresses.map(address => (
            <AddressCard 
              key={address._id} 
              $selected={selectedAddress === address._id}
              onClick={() => setSelectedAddress(address._id)}
            >
              {address.isDefault && <DefaultBadge>Default</DefaultBadge>}
              <div style={{ fontWeight: '500' }}>{address.fullName}</div>
              <div>{address.phone}</div>
              <div>
                {address.addressLine1}
                {address.addressLine2 && `, ${address.addressLine2}`}
              </div>
              <div>{address.city}, {address.state} - {address.pincode}</div>
              
              {isAuthenticated && (
                <AddressActions>
                  <ActionButton onClick={() => handleSetDefaultAddress(address._id)}>
                    <FontAwesomeIcon icon={faCheck} />
                    Set Default
                  </ActionButton>
                  <ActionButton>
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteAddress(address._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </ActionButton>
                </AddressActions>
              )}
            </AddressCard>
          ))}
        </AddressList>
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem 0', color: '#666' }}>
          No addresses found. Please add an address to continue.
        </div>
      )}
      
      <AddButton onClick={() => setShowAddForm(true)}>
        <FontAwesomeIcon icon={faPlus} />
        Add New Address
      </AddButton>
      
      <ProceedButton 
        onClick={handleProceed}
        disabled={!selectedAddress}
      >
        Deliver to this Address
      </ProceedButton>
      
      <BackButton onClick={onBack}>
        Back to Cart
      </BackButton>
    </AddressContainer>
  );
};

export default AddressStep;
