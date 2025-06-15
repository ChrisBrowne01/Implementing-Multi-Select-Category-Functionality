// ./src/component/FormButton.js
import React from 'react';
import './FormButton.css';
 
// Removed isSelected and handleCategoryClick specific props
// Now takes a generic onClick, style, and className
export const FormButton = ({ value, onClick, style, className }) => {
  return (  
    <button 
      type="button"
      onClick={onClick}
      value={value} 
      className={className} 
      style={style} 
    >
      {value}
    </button>
  );
};