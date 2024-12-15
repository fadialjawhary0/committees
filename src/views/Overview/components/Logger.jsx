import React from 'react';
import styles from './Logger.module.scss';

const Logger = ({ logs }) => {
  return (
    <div className={styles.loggerSection}>
      <h5 className={styles.header}>سجل الأنشطة</h5>
      <div className={styles.logger}>
        {logs.map(log => (
          <div key={log.id} className={styles.logItem}>
            <div className={styles.profileIcon}>{log.user.name.charAt(0)}</div>
            <div className={styles.logDetails}>
              <span className={styles.logUser}>{log.user.name}</span>
              <span className={styles.logAction}>{log.action}</span>
              <span className={styles.logTime}>{new Date(log.time).toLocaleString('ar-EG')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logger;
