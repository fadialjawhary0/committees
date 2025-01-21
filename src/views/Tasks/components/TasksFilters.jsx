import React from 'react';

import DropdownFilter from '../../../components/filters/Dropdown';

import styles from './TasksFilters.module.scss';
import { FaPlus } from 'react-icons/fa';

const TasksFilters = ({ tasksOptions, handleFilterChange }) => {
  return (
    <div className={styles.pageHeader}>
      <DropdownFilter
        options={tasksOptions}
        onSelect={handleFilterChange}
        defaultValue='الكل'
        placeholder='الحالة'
        style={{
          minWidth: '14rem',
        }}
      />
      {/* <div>
        <div className={styles.actionButton} onClick={handleAddTask}>
          <FaPlus />
          <span>إضافة</span>
        </div>
      </div> */}
      {/* <DropdownFilter options={committeeOptions} onSelect={handleCommitteeFilterChange} defaultValue='الكل' placeholder='اللجنة' /> */}
    </div>
  );
};

export default TasksFilters;
