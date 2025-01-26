import React, { useEffect, useState } from 'react';

import styles from './ActivityLogStyles.module.scss';
import apiService from '../../../services/axiosApi.service';
import { FormatDateToArabic } from '../../../helpers';

const ActivityLog = () => {
  // const { committeeName } = useParams();
  const [logs, setLogs] = useState([]);
  // const [selectedCommittee, setSelectedCommittee] = useState(committeeName || '');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await apiService?.getById('GetAuditLogs', +localStorage.getItem('selectedCommitteeID')).then(data => setLogs(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // const handleCommitteeChange = selectedValue => {
  //   setSelectedCommittee(selectedValue);
  //   setLogs(mockLogs.filter(log => (selectedValue === 'All' ? logs : log.committee === selectedValue)));
  //   setCurrentPage(1);
  // };

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  return (
    <div className={styles.activityLogPage}>
      {/* <ActivityLogFilters
        committeeOptions={committeeOptions}
        selectedCommittee={selectedCommittee}
        handleCommitteeChange={handleCommitteeChange}
      /> */}

      <div className={styles.logList}>
        {currentLogs.length > 0 ? (
          currentLogs?.map(log => (
            <div key={log?.ID} className={styles.logItem}>
              <div className={styles.logUser}>{log?.Name}</div>
              <div className={styles.logAction}>{log?.LogType}</div>
              {/* <div className={styles.logDetails}>{log?.}</div> */}
              <div className={styles.logTime}>{FormatDateToArabic(log?.LogDate)}</div>
            </div>
          ))
        ) : (
          <p className={styles.noLogsMsg}>لا يوجد سجلات لهذه اللجنة.</p>
        )}
      </div>
      <div className={styles.pagination}>
        {[...Array(Math.ceil(logs.length / logsPerPage)).keys()]?.map(page => (
          <button
            key={page + 1}
            onClick={() => handlePageChange(page + 1)}
            className={`${styles.pageButton} ${currentPage === page + 1 ? styles.active : ''}`}>
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
