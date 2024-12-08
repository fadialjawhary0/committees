import React from 'react';

import DropdownFilter from '../../../components/filters/Dropdown';

import styles from './InboxFilters.module.scss';

const InboxFilters = ({ statusOptions, handleFilterChange }) => {
  return (
    <header className={styles.pageHeader}>
      <DropdownFilter options={statusOptions} onSelect={handleFilterChange} defaultValue='الكل' placeholder='الحالة' />
    </header>
  );
};

export default InboxFilters;
