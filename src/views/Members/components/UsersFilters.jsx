import React from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';

import DropdownFilter from '../../../components/filters/Dropdown';

import styles from './UsersFilters.module.scss';

const UsersFilters = ({ handleAdd, handleFilterChange, committeeOptions }) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.searchDropdownFilters}>
        <div className={styles.searchFilterContainer}>
          <input placeholder='ابحث عن شخص' dir='rtl' />
          <FaSearch />
        </div>
        <DropdownFilter options={committeeOptions} onSelect={handleFilterChange} defaultValue='كل اللجان' placeholder='اللجنة' />
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

export default UsersFilters;
