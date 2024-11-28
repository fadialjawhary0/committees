import React from 'react';
import './LoggerStyles.scss';

const Logger = ({ logs }) => {
  return (
    <div className='logger-section'>
      <h2>سجل الأنشطة</h2>
      <div className='logger'>
        <div className='log-list'>
          {logs.map(log => (
            <div key={log.id} className='log-item'>
              <div className='log-profile'>
                <div className='profile-icon'>{log.user.name.charAt(0)}</div>
              </div>
              <div className='log-details'>
                <span className='log-user'>{log.user.name} </span>
                <span className='log-action'>{log.action} </span>
                <span className='log-time'>{new Date(log.time).toLocaleString('ar-EG')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logger;
