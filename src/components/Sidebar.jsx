import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { ActiveLinkContext, SidebarContext } from '../context';
import { SidebarLinks } from '../constants';
import useScreenSize from '../hooks/useScreenSize';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './styles/Sidebar.module.scss';

const Sidebar = () => {
  const navigate = useNavigate();

  const { setActiveLink, activeLink } = useContext(ActiveLinkContext);
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);

  const { isSmall } = useScreenSize();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const links = SidebarLinks(navigate, setActiveLink, styles);

  return (
    <>
      {!isSmall && (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.open : styles.closed}`}>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            {isCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <ul>
            {links.map(link => (
              <li key={link.id} className={`${styles.item} ${activeLink === link.id ? styles.active : ''}`}>
                <button className={`${styles.link} ${activeLink === link.id ? styles.active : ''}`} onClick={link.onClick}>
                  {isCollapsed && <span className={styles.text}>{link.text}</span>}
                  <span className={styles.icon}>{link.icon}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
