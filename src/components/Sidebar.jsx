import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaEnvelope,
  FaUsers,
  FaTasks,
  FaCalendarAlt,
  FaPen,
  FaStickyNote,
  FaHistory,
  FaProjectDiagram,
  FaFileAlt,
  FaBell,
} from 'react-icons/fa';
import { ActiveLinkContext } from '../context';

import styles from './styles/Sidebar.module.scss';

const Sidebar = () => {
  const { setActiveLink, activeLink } = useContext(ActiveLinkContext);
  const navigate = useNavigate();

  const links = [
    {
      id: 1,
      text: 'نظرة عامة',
      icon: <FaTachometerAlt className={styles.icon} />,
      state: 'overview',
      onClick: () => {
        navigate('/overview');
        setActiveLink(1);
      },
    },
    {
      id: 2,
      text: 'صندوق الرسائل',
      icon: <FaEnvelope className={styles.icon} />,
      state: 'inbox',
      onClick: () => {
        navigate('/inbox');
        setActiveLink(2);
      },
    },
    {
      id: 3,
      text: 'الأشخاص',
      icon: <FaUsers className={styles.icon} />,
      state: 'people',
      onClick: () => {
        navigate('/users');
        setActiveLink(3);
      },
    },
    {
      id: 4,
      text: 'المهام المسندة',
      icon: <FaTasks className={styles.icon} />,
      state: 'my-tasks',
      onClick: () => {
        navigate('/my-tasks');
        setActiveLink(4);
      },
    },
    {
      id: 5,
      text: 'الاجتماعات',
      icon: <FaCalendarAlt className={styles.icon} />,
      state: 'meetings',
      onClick: () => {
        navigate('/meetings');
        setActiveLink(5);
      },
    },
    {
      id: 6,
      text: 'الموافقات',
      icon: <FaPen className={styles.icon} />,
      state: 'requests',
      onClick: () => {
        navigate('/requests');
        setActiveLink(6);
      },
    },
    {
      id: 7,
      text: 'سجل النشاطات',
      icon: <FaHistory className={styles.icon} />,
      state: 'activity-log',
      onClick: () => {
        navigate('/activity-log');
        setActiveLink(7);
      },
    },
    {
      id: 8,
      text: 'المشاريع المرتبطة',
      icon: <FaProjectDiagram className={styles.icon} />,
      state: 'related-projects',
      onClick: () => {
        navigate('/related-projects');
        setActiveLink(8);
      },
    },
    {
      id: 9,
      text: 'الوثائق المرتبطة',
      icon: <FaFileAlt className={styles.icon} />,
      state: 'related-documents',
      onClick: () => {
        navigate('/related-documents');
        setActiveLink(9);
      },
    },
    {
      id: 10,
      text: 'الاخبار والاشعارات',
      icon: <FaBell className={styles.icon} />,
      state: 'news-notifications',
      onClick: () => {
        navigate('/news');
        setActiveLink(10);
      },
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <ul>
        {links.map(link => (
          <li key={link.id} className={`${styles.item} ${activeLink === link.id ? styles.active : ''}`}>
            <button className={styles.link} onClick={link.onClick}>
              {link.text}
              {link.icon}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
