import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const DropdownFilter = ({ options, onSelect, placeholder, defaultValue = '', style }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = event => {
    const value = event.target.value;
    setSelectedValue(value);
    onSelect(value);
  };

  return (
    <div className='select-container'>
      <select value={selectedValue || defaultValue} onChange={handleChange} style={style}>
        {placeholder && !defaultValue ? (
          <option value='' disabled>
            {placeholder}
          </option>
        ) : placeholder && defaultValue ? (
          <option value={defaultValue} disabled>
            {placeholder}
          </option>
        ) : !placeholder && defaultValue ? (
          <option value={defaultValue} disabled>
            {defaultValue}
          </option>
        ) : (
          ''
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FaChevronDown />
    </div>
  );
};

export default DropdownFilter;
