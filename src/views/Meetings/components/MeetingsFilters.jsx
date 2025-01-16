import React from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import styles from './MeetingsFilters.module.scss';

const MeetingsFilters = ({ searchTerm, setSearchTerm, handleAddMeeting }) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.searchFilterContainer}>
        <input placeholder='ابحث عن اجتماع' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} dir='rtl' />
        <FaSearch />
      </div>
      <div className={styles.filtersContainer}>
        <div className={styles.actionButton} onClick={handleAddMeeting}>
          <FaPlus />
          <span>إضافة</span>
        </div>
      </div>
    </div>
  );
};

export default MeetingsFilters;
