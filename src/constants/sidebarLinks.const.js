import {
  FaTachometerAlt,
  FaEnvelope,
  FaUsers,
  FaTasks,
  FaCalendarAlt,
  FaPen,
  FaHistory,
  FaFileAlt,
  FaBell,
  FaUserShield,
} from 'react-icons/fa';

export const SidebarLinks = (navigate, setActiveLink, styles) => [
  {
    id: 0,
    text: 'مدير النظام',
    icon: <FaUserShield />,
    onClick: () => {
      navigate('/admin/locations');
    },
  },
  {
    id: 1,
    text: 'نظرة عامة',
    icon: <FaTachometerAlt className={styles.icon} />,
    onClick: () => {
      navigate('/');
    },
  },
  {
    id: 2,
    text: 'صندوق الرسائل',
    icon: <FaEnvelope className={styles.icon} />,
    onClick: () => {
      navigate('/inbox');
    },
  },
  {
    id: 3,
    text: 'الأشخاص',
    icon: <FaUsers className={styles.icon} />,
    onClick: () => {
      navigate('/users');
    },
  },
  {
    id: 4,
    text: 'مهام اللجنة',
    icon: <FaTasks className={styles.icon} />,
    onClick: () => {
      navigate('/committee-tasks');
    },
  },
  {
    id: 5,
    text: 'الاجتماعات',
    icon: <FaCalendarAlt className={styles.icon} />,
    onClick: () => {
      navigate('/meetings');
    },
  },
  {
    id: 6,
    text: 'المهام',
    icon: <FaPen className={styles.icon} />,
    onClick: () => {
      navigate('/tasks');
    },
  },
  {
    id: 7,
    text: 'سجل النشاطات',
    icon: <FaHistory className={styles.icon} />,
    onClick: () => {
      navigate('/activity-log');
    },
  },
  // {
  //   id: 8,
  //   text: 'المشاريع المرتبطة',
  //   icon: <FaProjectDiagram className={styles.icon} />,
  //   onClick: () => {
  //     navigate('/related-projects');
  //     setActiveLink(8);
  //   },
  // },
  {
    id: 9,
    text: 'الوثائق المرتبطة',
    icon: <FaFileAlt className={styles.icon} />,
    onClick: () => {
      navigate('/related-documents');
    },
  },
  {
    id: 10,
    text: 'الاخبار والاشعارات',
    icon: <FaBell className={styles.icon} />,
    onClick: () => {
      navigate('/news');
    },
  },
];
