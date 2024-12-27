import React from 'react';
import styles from './AdminHomepage.module.scss';
// import { FaBuilding, FaUsersCog, FaSitemap, FaMapMarkerAlt, FaTools, FaListAlt, FaUser, FaBullseye } from 'react-icons/fa';
import locationIcon from '../../../assets/location.png';
import buildingIcon from '../../../assets/building.png';
import roomIcon from '../../../assets/room.png';
import commCategoryIcon from '../../../assets/commcategory.png';
import usersIcon from '../../../assets/users.png';
import rolesIcon from '../../../assets/roles.png';
import meetingType from '../../../assets/meetingType.png';
import department from '../../../assets/department.png';
import targetIcon from '../../../assets/target.png';
import { useNavigate } from 'react-router-dom';

const configurations = [
  { id: 1, name: 'المواقع', icon: <img src={locationIcon} alt='location' className={styles.imageIcon} /> },
  { id: 2, name: 'المباني', icon: <img src={buildingIcon} alt='building' className={styles.imageIcon} /> },
  { id: 3, name: 'الغرف', icon: <img src={roomIcon} alt='room' className={styles.imageIcon} /> },
  { id: 4, name: 'فئات اللجنة', icon: <img src={commCategoryIcon} alt='category' className={styles.imageIcon} /> },
  { id: 5, name: 'الإدارات', icon: <img src={department} alt='departments' className={styles.imageIcon} /> },
  { id: 6, name: 'أنواع الاجتماعات', icon: <img src={meetingType} alt='meetingType' className={styles.imageIcon} /> },
  { id: 7, name: 'الصلاحيات', icon: <img src={rolesIcon} alt='roles' className={styles.imageIcon} /> },
  { id: 8, name: 'المستخدمين', icon: <img src={usersIcon} alt='users' className={styles.imageIcon} />, navigate: '/admin/users' },
  { id: 9, name: 'الأهداف', icon: <img src={targetIcon} alt='target' className={styles.imageIcon} /> },
];

const AdminHomepage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.adminHomepageMain}>
      <h2>إعدادات النظام</h2>
      <div className={styles.cardsContainer}>
        {configurations.map(config => (
          <div key={config.id} className={styles.card} onClick={() => navigate(config?.navigate)}>
            <div className={styles.icon}>{config.icon}</div>
            <h3 className={styles.cardTitle}>{config.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHomepage;
