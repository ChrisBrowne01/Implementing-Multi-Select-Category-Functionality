import React from 'react';
import './FormButton.css'; 

export const FormButton = ({ value, handleCategoryClick, isSelected }) => {
  return (
    <button type="button" onClick={() => handleCategoryClick(value)} value={value} name="category" className={`tag ${isSelected ? 'selected-tag' : ''}`}>{value}</button>
  );
};