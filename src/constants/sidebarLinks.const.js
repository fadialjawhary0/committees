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
      navigate('/admin');
      setActiveLink(0);
    },
  },
  {
    id: 1,
    text: 'نظرة عامة',
    icon: <FaTachometerAlt className={styles.icon} />,
    onClick: () => {
      navigate('/overview');
      setActiveLink(1);
    },
  },
  {
    id: 2,
    text: 'صندوق الرسائل',
    icon: <FaEnvelope className={styles.icon} />,
    onClick: () => {
      navigate('/inbox');
      setActiveLink(2);
    },
  },
  {
    id: 3,
    text: 'الأشخاص',
    icon: <FaUsers className={styles.icon} />,
    onClick: () => {
      navigate('/users');
      setActiveLink(3);
    },
  },
  {
    id: 4,
    text: 'المهام المسندة',
    icon: <FaTasks className={styles.icon} />,
    onClick: () => {
      navigate('/my-tasks');
      setActiveLink(4);
    },
  },
  {
    id: 5,
    text: 'الاجتماعات',
    icon: <FaCalendarAlt className={styles.icon} />,
    onClick: () => {
      navigate('/meetings');
      setActiveLink(5);
    },
  },
  {
    id: 6,
    text: 'الموافقات',
    icon: <FaPen className={styles.icon} />,
    onClick: () => {
      navigate('/requests');
      setActiveLink(6);
    },
  },
  {
    id: 7,
    text: 'سجل النشاطات',
    icon: <FaHistory className={styles.icon} />,
    onClick: () => {
      navigate('/activity-log');
      setActiveLink(7);
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
      setActiveLink(9);
    },
  },
  {
    id: 10,
    text: 'الاخبار والاشعارات',
    icon: <FaBell className={styles.icon} />,
    onClick: () => {
      navigate('/news');
      setActiveLink(10);
    },
  },
];
