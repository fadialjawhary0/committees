import React from 'react';
import styles from './styles/Toast.module.scss';

const Toast = ({ message, type }) => {
  return <div className={`${styles.toast} ${styles[type]}`}>{message}</div>;
};

export default Toast;
