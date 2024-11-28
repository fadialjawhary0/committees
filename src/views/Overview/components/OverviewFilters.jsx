import React from 'react';

import { CommitteesClassifications, CommitteesType } from '../../../constants';

import styles from './OverviewFilters.module.scss';
import { useNavigate } from 'react-router-dom';
import { FaFileExport, FaPlus, FaSearch } from 'react-icons/fa';
import DropdownFilter from '../../../components/filters/Dropdown';

const OverviewFilters = () => {
  const navigate = useNavigate();

  const handleNewCommittee = () => {
    navigate('/overview/add-committee');
  };

  return (
    <div className={styles.overviewFilters}>
      <div className={styles.actionFiltersContainer}>
        <div className={styles.actionButtonsContainer}>
          <div className={styles.actionButton}>
            <FaFileExport />
            <span>تصدير</span>
          </div>
          <div className={styles.actionButton} onClick={handleNewCommittee}>
            <FaPlus />
            <span>جديد</span>
          </div>
        </div>
        <div className={styles.filtersContainer}>
          <DropdownFilter label='التصنيف' options={CommitteesClassifications} />
          <DropdownFilter label='النوع' options={CommitteesType} />
        </div>
      </div>

      <div className={styles.search}>
        <input className={styles.searchField} placeholder='الكل' dir='rtl' />
        <FaSearch className={styles.searchIcon} />
      </div>
    </div>
  );
};

export default OverviewFilters;
