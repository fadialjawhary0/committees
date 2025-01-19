import React, { useEffect, useState } from 'react';

import { CommitteeStatusFilter } from '../../../constants';
import styles from './OverviewFilters.module.scss';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';
import DropdownFilter from '../../../components/filters/Dropdown';
import apiService from '../../../services/axiosApi.service';

const OverviewFilters = ({ committees, applyFilters }) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleNewCommittee = () => {
    navigate('/overview/create');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.getAll('GetAllCommCat');
        const formattedCategories = data?.map(category => ({
          value: category.ID,
          label: category.ArabicName,
        }));
        setCategories([{ value: '', label: 'كل الفئات' }, ...formattedCategories]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleStatusChange = value => {
    setSelectedStatus(value);
    applyFilters(value, selectedCategory);
  };

  const handleCategoryChange = value => {
    setSelectedCategory(value);
    applyFilters(selectedStatus, value);
  };

  return (
    <div className={styles.pageHeader}>
      <div className={styles.actionFiltersContainer}>
        <div className={styles.filtersContainer}>
          <DropdownFilter options={CommitteeStatusFilter} onSelect={handleStatusChange} placeholder='تصفية حسب الحالة' />
          <DropdownFilter options={categories} onSelect={handleCategoryChange} placeholder='تصفية حسب الفئة' />
        </div>
        <div className={styles.actionButtonsContainer}>
          <div className={styles.actionButton} onClick={handleNewCommittee}>
            <FaPlus />
            <span>إنشاء لجنة جديدة</span>
          </div>
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
