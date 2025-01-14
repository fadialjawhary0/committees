import {
  FaTachometerAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaDoorOpen,
  FaUser,
  FaUserShield,
  FaKey,
  FaListAlt,
  FaSitemap,
  FaCalendarCheck,
} from 'react-icons/fa';

export const SidebarLinksAdmin = (navigate, setAdminActiveLink, styles) => [
  {
    id: 0,
    text: 'نظام المستخدم',
    icon: <FaTachometerAlt className={styles.icon} />,
    onClick: () => {
      navigate('/overview');
      setAdminActiveLink(0);
    },
  },
  {
    id: 1,
    text: 'المواقع',
    icon: <FaMapMarkerAlt className={styles.icon} />,
    onClick: () => {
      navigate('/admin/locations');
      setAdminActiveLink(1);
    },
  },
  {
    id: 2,
    text: 'المباني',
    icon: <FaBuilding className={styles.icon} />,
    onClick: () => {
      navigate('/admin/buildings');
      setAdminActiveLink(2);
    },
  },
  {
    id: 3,
    text: 'الغرف',
    icon: <FaDoorOpen className={styles.icon} />,
    onClick: () => {
      navigate('/admin/rooms');
      setAdminActiveLink(3);
    },
  },
  {
    id: 4,
    text: 'المستخدمين',
    icon: <FaUser className={styles.icon} />,
    onClick: () => {
      navigate('/admin/users');
      setAdminActiveLink(4);
    },
  },
  {
    id: 5,
    text: 'الأدوار',
    icon: <FaUserShield className={styles.icon} />,
    onClick: () => {
      navigate('/admin/roles');
      setAdminActiveLink(5);
    },
  },
  {
    id: 6,
    text: 'الصلاحيات',
    icon: <FaKey className={styles.icon} />,
    onClick: () => {
      navigate('/admin/permissions');
      setAdminActiveLink(6);
    },
  },
  {
    id: 7,
    text: 'صلاحيات الأدوار',
    icon: <FaKey className={styles.icon} />,
    onClick: () => {
      navigate('/admin/role-permissions');
      setAdminActiveLink(7);
    },
  },
  {
    id: 8,
    text: 'أنواع اللجان',
    icon: <FaListAlt className={styles.icon} />,
    onClick: () => {
      navigate('/admin/committee-categories');
      setAdminActiveLink(8);
    },
  },
  {
    id: 9,
    text: 'أقسام اللجان',
    icon: <FaSitemap className={styles.icon} />,
    onClick: () => {
      navigate('/admin/committee-departments');
      setAdminActiveLink(9);
    },
  },
  {
    id: 10,
    text: 'حالات مهام اللجان',
    icon: <FaCalendarCheck className={styles.icon} />,
    onClick: () => {
      navigate('/admin/committee-task-statuses');
      setAdminActiveLink(10);
    },
  },
  {
    id: 11,
    text: 'أنواع الاجتماعات',
    icon: <FaCalendarCheck className={styles.icon} />,
    onClick: () => {
      navigate('/admin/meeting-types');
      setAdminActiveLink(11);
    },
  },
  {
    id: 12,
    text: 'حالات الاجتماعات',
    icon: <FaCalendarCheck className={styles.icon} />,
    onClick: () => {
      navigate('/admin/meeting-statuses');
      setAdminActiveLink(12);
    },
  },
];
