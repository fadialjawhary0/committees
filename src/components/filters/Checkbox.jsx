import React from 'react';

const CheckboxFilter = ({ label, onChange, checked }) => {
  return (
    <div className='filter-checkbox'>
      <label>
        <input type='checkbox' onChange={onChange} checked={checked} />
        {label}
      </label>
    </div>
  );
};

export default CheckboxFilter;
