import React from 'react';

import DropdownFilter from '../../../components/filters/Dropdown';

import styles from './AgreementsFilters.module.scss';

const AgreementsFilters = ({ agreementsOptions, handleFilterChange, committeeOptions, handleCommitteeFilterChange }) => {
  return (
    <div className={styles.pageHeader}>
      <DropdownFilter options={agreementsOptions} onSelect={handleFilterChange} defaultValue='الكل' placeholder='الحالة' />
      {/* <DropdownFilter options={committeeOptions} onSelect={handleCommitteeFilterChange} defaultValue='الكل' placeholder='اللجنة' /> */}
    </div>
  );
};

export default AgreementsFilters;
