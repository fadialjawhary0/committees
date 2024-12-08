import React from 'react';

import styles from './UserTasksFilters.module.scss';
import { FaSearch } from 'react-icons/fa';

const UserTasksFilters = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.searchFilterContainer}>
        <input type='text' placeholder='ابحث عن مهمة' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <FaSearch />
      </div>
    </div>
  );
};

export default UserTasksFilters;
