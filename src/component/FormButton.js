import React from 'react';
import './FormButton.css'; 

export const FormButton = ({ value, selectCategory, selected }) => {
  const addCSStoButton = {
    ReadEmails: {backgroundColor:"orangered"},
    WebParsing: {backgroundColor:"blue"},
    SendEmails: {backgroundColor:"purple"},
    default: {backgroundColor:"white"}
  }

  return (  
    <button type="button" style={ selected ? addCSStoButton[value]:value.default }
      value={value} 
      name="category" 
      onClick={() => selectCategory(value)}
      className={`tag`}
    >{value}
    </button>
  );
};