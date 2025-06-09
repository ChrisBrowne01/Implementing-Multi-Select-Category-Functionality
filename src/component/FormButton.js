import React from 'react';
import './FormButton.css'; // Your button specific styles (ensure this exists and has .tag and .selected-tag)

export const FormButton = ({ value, selectCategory, isSelected }) => {
  return (
    <button type="button" onClick={() => selectCategory(value)} value={value} name="category" className={`tag ${isSelected ? 'selected-tag' : ''}`}>{value}</button>
  );
};