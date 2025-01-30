import React from 'react';
import './RadioButton.css'; // Import the CSS file
import {RadioButtonProps} from '@/types/_types'


const RadioButton: React.FC<RadioButtonProps> = ({ id, name, value, label, checked, onChange }) => {
  return (
    <div className="radio-button">
      <input
        type="radio"
        className="radio-button__input"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label className="radio-button__label" htmlFor={id}>
        <span className="radio-button__custom"></span>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;