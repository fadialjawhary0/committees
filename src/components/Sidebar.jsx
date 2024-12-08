import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ActiveLinkContext } from '../context';
import { SidebarLinks } from '../constants';
import useScreenSize from '../hooks/useScreenSize';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons for toggle
import styles from './styles/Sidebar.module.scss';

const Sidebar = () => {
  const navigate = useNavigate();
  const { setActiveLink, activeLink } = useContext(ActiveLinkContext);
  const { isSmall } = useScreenSize();

  const [isOpen, setIsOpen] = useState(true); // Track sidebar open/close state

  const toggleSidebar = () => setIsOpen(!isOpen);

  const links = SidebarLinks(navigate, setActiveLink, styles);

  return (
    <>
      {!isSmall && (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <ul>
            {links.map(link => (
              <li key={link.id} className={`${styles.item} ${activeLink === link.id ? styles.active : ''}`}>
                <button className={`${styles.link} ${activeLink === link.id ? styles.active : ''}`} onClick={link.onClick}>
                  {isOpen && <span className={styles.text}>{link.text}</span>}
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
