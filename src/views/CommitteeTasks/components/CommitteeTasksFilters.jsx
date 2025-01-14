import React from 'react';

import styles from './CommitteeTasksFilters.module.scss';
import { FaPlus, FaSearch } from 'react-icons/fa';

const CommitteeTasksFilters = ({ handleAdd, searchTerm, setSearchTerm }) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.searchFilterContainer}>
        <input type='text' placeholder='ابحث عن مهمة' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <FaSearch />
      </div>
      <div className={styles.actionButtonsContainer}>
        <div className={styles.actionButton} onClick={handleAdd}>
          <FaPlus />
          <span>إضافة</span>
        </div>
      </div>
    </div>
  );
};

export default CommitteeTasksFilters;
