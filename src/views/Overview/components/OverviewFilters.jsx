import React from 'react';

import { CommitteesClassifications, CommitteesType } from '../../../constants';

import styles from './OverviewFilters.module.scss';
import { useNavigate } from 'react-router-dom';
import { FaFileExport, FaPlus, FaSearch } from 'react-icons/fa';
import DropdownFilter from '../../../components/filters/Dropdown';

const OverviewFilters = () => {
  const navigate = useNavigate();

  const handleNewCommittee = () => {
    navigate('/overview/create');
  };

  const handleTypeFilter = type => {
    // setSelectedType(type);
    // applyFilters(type, selectedManager);
  };

  const handleClassificationFilter = classification => {
    // setSelectedManager(manager);
    // applyFilters(selectedType, manager);
  };

  // const applyFilters = (type, manager) => {
  //   // let filtered = initialData;
  //   // if (type) {
  //   //   filtered = filtered.filter(item => item.type === type);
  //   // }
  //   // if (manager) {
  //   //   filtered = filtered.filter(item => item.manager === manager);
  //   // }
  //   // setFilteredData(filtered);
  // };

  return (
    <div className={styles.pageHeader}>
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
          <DropdownFilter options={CommitteesType} onSelect={handleTypeFilter} placeholder='النوع' />
          <DropdownFilter options={CommitteesClassifications} onSelect={handleClassificationFilter} placeholder='التصنيف' />
        </div>
      </div>

      <div className={styles.searchFilterContainer}>
        <input placeholder='ابحث...' dir='rtl' />
        <FaSearch />
      </div>
    </div>
  );
};

export default OverviewFilters;
