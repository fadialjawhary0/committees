import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { FaCog } from 'react-icons/fa';
import { ActiveLinkContext } from '../context';

import styles from './styles/Navbar.module.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setActiveLink } = useContext(ActiveLinkContext);

  const onLogoClick = () => {
    navigate('/');
    setActiveLink(null);
  };

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/overview');
    }
  }, [location.pathname]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={onLogoClick}>
        <FaCog className={styles.logoIcon} />
        <span>نظام إدارة اللجان</span>
      </div>
      <div className={styles.buttons}>
        <button className={styles.button}>تسجيل الدخول</button>
        <button className={styles.button}>تسجيل</button>
      </div>
    </nav>
  );
};

export default Navbar;
