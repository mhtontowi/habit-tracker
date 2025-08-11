import React, { useState } from 'react';
import styled from 'styled-components';

const AddHabitForm = ({ onAdd, onCancel }) => {
  // This state will hold whatever the user types into the input box
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    // This prevents the browser from refreshing the page, which is the default form behavior
    event.preventDefault(); 
    
    // Don't add a habit if the input is empty
    if (!name.trim()) return; 

    // Call the onAdd function that was passed down from App.jsx
    onAdd(name);

    // Clear the input box for the next time
    setName(''); 
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Type in your new habit"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus // Automatically puts the cursor in the input box
      />
      <Button type="button" onClick={onCancel}>Cancel</Button>
      <Button type="submit" primary>Save</Button>
    </FormContainer>
  );
};

// --- STYLES for the AddHabitForm ---

const FormContainer = styled.form`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column; /* Stack items vertically */
    gap: 1rem; /* Add a bit more space between stacked items */
    align-items: stretch; /* Make items stretch to fill the width */
  }
`;

const Input = styled.input`
  flex-grow: 1;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Button = styled.button`
  background: ${({ primary, theme }) => primary ? theme.colors.white : 'transparent'};
  color: ${({ primary, theme }) => primary ? theme.colors.primary : theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.8;
  }
`;

export default AddHabitForm;