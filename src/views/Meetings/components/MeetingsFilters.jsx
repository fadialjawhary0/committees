import React from 'react';
import DropdownFilter from '../../../components/filters/Dropdown';
import { FaPlus, FaSearch } from 'react-icons/fa';
import styles from './MeetingsFilters.module.scss';

const MeetingsFilters = ({ searchTerm, setSearchTerm, committeeOptions, handleFilterChange, handleAddMeeting }) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.searchFilterContainer}>
        <input placeholder='ابحث عن اجتماع' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} dir='rtl' />
        <FaSearch />
      </div>
      <div className={styles.filtersContainer}>
        <DropdownFilter options={committeeOptions} onSelect={handleFilterChange} defaultValue='كل اللجان' placeholder='اللجنة' />
        <div className={styles.actionButton} onClick={handleAddMeeting}>
          <FaPlus />
          <span>إضافة</span>
        </div>
      </div>
    </div>
  );
};

export default MeetingsFilters;
