import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCircle, FaCalendarAlt, FaFolderOpen, FaTasks, FaUser } from 'react-icons/fa';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CommitteesData, CommitteesStatus } from '../../../constants';
import styles from './Overview.module.scss';
import OverviewFilters from './OverviewFilters';

const Overview = () => {
  const navigate = useNavigate();

  const [timeRemaining, setTimeRemaining] = useState('');
  const [committees, setCommittees] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const intervals = committees.map(committee => {
      const nextMeetingTime = new Date('2024-12-14T23:59:59').getTime();
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = nextMeetingTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeRemaining(prev => ({
          ...prev,
          [committee.id]: distance < 0 ? 'Expired' : `${days}d ${hours}h ${minutes}m ${seconds}s`,
        }));

        if (distance < 0) {
          clearInterval(interval);
        }
      }, 0);

      return interval;
    });

    return () => intervals.forEach(clearInterval);
  }, [committees]);

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
        return {
          label: CommitteesStatus?.ACTIVE,
          style: styles.statusActive,
        };
      case 2:
        return {
          label: CommitteesStatus?.DEACTIVATED,
          style: styles.statusDeactivated,
        };
      case 3:
        return {
          label: CommitteesStatus?.DELETED,
          style: styles.statusDeleted,
        };
      default:
        return {
          label: '',
          style: '',
        };
    }
  };

  const handleCardClick = id => {
    navigate(`/overview/committee/${id}`);
  };

  const toggleDropdown = id => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleOptionClick = (status, id) => {
    const updatedCommittees = committees.map(committee => {
      if (committee.id === id) {
        return {
          ...committee,
          status: status === CommitteesStatus.ACTIVE ? 2 : 1,
        };
      }
      return committee;
    });
    setCommittees(updatedCommittees);
    setActiveDropdown(null);
  };

  return (
    <React.Fragment>
      <OverviewFilters />

      <div className={styles.overviewPage}>
        {committees.map(committee => {
          const status = committeeStatusLabel(committee?.status);
          return (
            <div key={committee?.id} className={styles.committeeCard}>
              <div className={styles.cardHeader}>
                <label className={`${styles.statusBadge} ${status.style}`}>{status.label}</label>
                <div className={styles.committeeHeader}>
                  <h6 className={styles.committeeName}>{committee?.name}</h6>
                  <MoreVertIcon
                    className={styles.committeeOptions}
                    fontSize='large'
                    onClick={() => toggleDropdown(committee?.id)}
                  />
                </div>

                {activeDropdown === committee?.id && (
                  <div
                    className={`${styles.optionsDropdown} ${
                      status.label === CommitteesStatus.ACTIVE ? styles.deactivate : styles.activate
                    }`}>
                    <button onClick={() => handleOptionClick(status.label, committee?.id)} className={styles.dropdownOption}>
                      {status.label === CommitteesStatus.ACTIVE ? 'إلغاء التفعيل' : 'تفعيل'}
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.committeeContentContainer} onClick={() => handleCardClick(committee.id)}>
                <span className={styles.committeeDate}>
                  تاريخ تشكيل اللجنة: {new Date(committee?.InitiatieDate).toLocaleDateString('ar-EG')}
                </span>

                <div className={styles.committeeInfoContainer}>
                  <div className={styles.upcomingMeeting}>
                    <h6 style={{ textAlign: 'center' }}> الوقت المتبقي للاجتماع القادم </h6>
                    <span style={{ textAlign: 'center' }}> اسم الاجتماع </span>
                    <span className={styles.upcomingMeetingTimer}>{timeRemaining[committee.id]}</span>
                  </div>

                  <div className={styles.committeeDetails}>
                    <div className={styles.committeeDetails__group}>
                      <span>{committee?.upcomingMeetings} :الإجتماعات القادمة</span>
                      <FaCalendarAlt className={styles.metricIcon} />
                    </div>

                    <div className={styles.committeeDetails__group} style={{}}>
                      <span>{committee?.previousMeetings} :الإجتماعات المنعقدة</span>
                      <FaCalendarAlt className={styles.metricIcon} />
                    </div>

                    <div className={styles.committeeDetails__group}>
                      <span>{committee?.members} :عدد الأعضاء</span>
                      <FaUser className={styles.metricIcon} />
                    </div>

                    <div className={styles.committeeDetails__group}>
                      <span>{committee?.projects} :المشاريع</span>
                      <FaFolderOpen className={styles.metricIcon} />
                    </div>
                  </div>
                </div>

                <div className={styles.tasksListContainer}>
                  <span className={styles.tasksListContainer__group}>
                    :المهام <FaTasks className={styles.metricIcon} />
                  </span>

                  <ul className={styles.tasksList}>
                    {committee?.tasks.map(task => (
                      <li key={task.label} className={`${styles.taskItem} ${styles[`task${task.color}`]}`}>
                        {task.label}: {task.count}
                        <FaCircle className={styles.taskIcon} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Overview;
