import React from 'react';

import '../styles/dropdown.styles.scss';

// onChange, value;
const DropdownFilter = ({ options, label }) => {
  return (
    <div className='filter-dropdown'>
      {/* /onChange={onChange} value={value} */}
      <select defaultValue='' className='dropdown-select'>
        <option value='' disabled hidden>
          {label}
        </option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownFilter;
