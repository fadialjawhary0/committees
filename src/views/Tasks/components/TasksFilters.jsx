import React from 'react';

import DropdownFilter from '../../../components/filters/Dropdown';

import styles from './TasksFilters.module.scss';

const TasksFilters = ({ tasksOptions, handleFilterChange, committeeOptions, handleCommitteeFilterChange }) => {
  return (
    <div className={styles.pageHeader}>
      <DropdownFilter options={tasksOptions} onSelect={handleFilterChange} defaultValue='الكل' placeholder='الحالة' />
      {/* <DropdownFilter options={committeeOptions} onSelect={handleCommitteeFilterChange} defaultValue='الكل' placeholder='اللجنة' /> */}
    </div>
  );
};

export default TasksFilters;
