import React, { useEffect, useState } from 'react';
import styles from './Logger.module.scss';
import apiService from '../../../../services/axiosApi.service';
import { FormatDateToArabic } from '../../../../helpers';

const Logger = () => {
  const [committeeLogs, setCommitteeLogs] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService?.getById('GetAuditLogs', +localStorage.getItem('selectedCommitteeID'));
        setCommitteeLogs(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.loggerSection}>
      <h5 className={styles.sectionHeaderTitle}>سجل الأنشطة</h5>
      <div className={styles.logger}>
        {!committeeLogs?.length ? (
          <h6 className={styles.noData}>لا يوجد سجل للأنشطة</h6>
        ) : (
          committeeLogs?.map(log => (
            <div key={log?.ID} className={styles.logItem}>
              <div className={styles.logDetails}>
                <span className={styles.logUser}>{log?.Name} - </span>
                <span className={styles.logAction}>{log?.LogType} - </span>
                <span className={styles.logTime}>{FormatDateToArabic(log?.LogDate)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Logger;
