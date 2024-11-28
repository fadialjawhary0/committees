import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCircle, FaCalendarAlt, FaFolderOpen, FaTasks, FaFileExport, FaPlus, FaSearch } from 'react-icons/fa';

import { CommitteesClassifications, CommitteesData, CommitteesStatus, CommitteesType } from '../../../constants';
import styles from './Overview.module.scss';
import DropdownFilter from '../../../components/filters/Dropdown';
import OverviewFilters from './OverviewFilters';

const Overview = () => {
  const [committees, setCommittees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommittees = () => {
      return new Promise(resolve => {
        resolve(CommitteesData);
      });
    };

    fetchCommittees().then(data => {
      setCommittees(data);
    });
  }, []);

  const committeeStatusLabel = status => {
    switch (status) {
      case 1:
        return { label: CommitteesStatus?.ACTIVE, style: styles.statusActive };
      case 2:
        return { label: CommitteesStatus?.DEACTIVATED, style: styles.statusDeactivated };
      case 3:
        return { label: CommitteesStatus?.DELETED, style: styles.statusDeleted };
      default:
        return { label: '', style: '' };
    }
  };

  const handleCardClick = id => {
    navigate(`/overview/committee/${id}`);
  };

  return (
    <React.Fragment>
      <OverviewFilters />

      <div className={styles.overviewPage}>
        {committees.map(committee => {
          const status = committeeStatusLabel(committee?.status);
          return (
            <div key={committee?.id} className={styles.committeeCard} onClick={() => handleCardClick(committee.id)}>
              <label className={`${styles.statusBadge} ${status.style}`}>{status.label}</label>
              <div className={styles.committeeContent}>
                <h6 className={styles.committeeName}>{committee?.name}</h6>
                <span className={styles.committeeDate}>تاريخ الإنشاء: {new Date(committee?.startDate).toLocaleDateString('ar-EG')}</span>
                <div className={styles.committeeMetrics}>
                  <div className={styles.metricItem} dir='rtl'>
                    <FaFolderOpen className={styles.metricIcon} />
                    <span>{committee?.projects} مشاريع</span>
                  </div>
                  <div className={styles.metricItem} dir='rtl'>
                    <FaCalendarAlt className={styles.metricIcon} />
                    <span>{committee?.upcomingMeetings} الإجتماعات القادمة</span>
                  </div>
                  <div className={styles.metricItem} dir='rtl'>
                    <FaTasks className={styles.metricIcon} />
                    <span>{committee?.pendingActions} معاملات قيد الاجراء</span>
                  </div>
                </div>
              </div>
              <ul className={styles.tasksList}>
                {committee?.tasks.map(task => (
                  <li key={task.label} className={`${styles.taskItem} ${styles[`task${task.color}`]}`}>
                    {task.label}: {task.count}
                    <FaCircle className={styles.taskIcon} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Overview;
