import React from 'react';

import DropdownFilter from '../../../components/filters/Dropdown';

import styles from './ActivityLogFilters.module.scss';

const ActivityLogFilters = ({ committeeOptions, selectedCommittee, handleCommitteeChange }) => {
  return (
    <header className={styles.pageHeader}>
      <DropdownFilter options={committeeOptions} onSelect={handleCommitteeChange} defaultValue='الكل' placeholder='اللجنة' />
    </header>
  );
};

export default ActivityLogFilters;
