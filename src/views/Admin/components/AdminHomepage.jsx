// import React from 'react';
// import styles from './AdminHomepage.module.scss';
// // import { FaBuilding, FaUsersCog, FaSitemap, FaMapMarkerAlt, FaTools, FaListAlt, FaUser, FaBullseye } from 'react-icons/fa';
// import locationIcon from '../../../assets/location.png';
// import buildingIcon from '../../../assets/building.png';
// import roomIcon from '../../../assets/room.png';
// import commCategoryIcon from '../../../assets/commcategory.png';
// import usersIcon from '../../../assets/users.png';
// import rolesIcon from '../../../assets/roles.png';
// import meetingType from '../../../assets/meetingType.png';
// import department from '../../../assets/department.png';
// import targetIcon from '../../../assets/target.png';
// import { useNavigate } from 'react-router-dom';

// const configurations = [
//   { id: 1, name: 'المواقع', icon: <img src={locationIcon} alt='location' className={styles.imageIcon} /> },
//   { id: 2, name: 'المباني', icon: <img src={buildingIcon} alt='building' className={styles.imageIcon} /> },
//   { id: 3, name: 'الغرف', icon: <img src={roomIcon} alt='room' className={styles.imageIcon} /> },
//   { id: 4, name: 'فئات اللجنة', icon: <img src={commCategoryIcon} alt='category' className={styles.imageIcon} /> },
//   { id: 5, name: 'الإدارات', icon: <img src={department} alt='departments' className={styles.imageIcon} /> },
//   { id: 6, name: 'أنواع الاجتماعات', icon: <img src={meetingType} alt='meetingType' className={styles.imageIcon} /> },
//   { id: 7, name: 'الصلاحيات', icon: <img src={rolesIcon} alt='roles' className={styles.imageIcon} /> },
//   { id: 8, name: 'المستخدمين', icon: <img src={usersIcon} alt='users' className={styles.imageIcon} />, navigate: '/admin/users' },
//   { id: 9, name: 'الأهداف', icon: <img src={targetIcon} alt='target' className={styles.imageIcon} /> },
// ];

// const AdminHomepage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className={styles.adminHomepageMain}>
//       <h2>إعدادات النظام</h2>
//       <div className={styles.cardsContainer}>
//         {configurations.map(config => (
//           <div key={config.id} className={styles.card} onClick={() => navigate(config?.navigate)}>
//             <div className={styles.icon}>{config.icon}</div>
//             <h3 className={styles.cardTitle}>{config.name}</h3>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminHomepage;

import React, { useContext } from 'react';
import SharedAdminTable from './SharedAdminTable';
import styles from './AdminHomepage.module.scss';
import { PathURLContext } from '../../../context';
import RolePermissionsTable from './RolePermissionsTable';

const AdminHomepage = () => {
  const { path } = useContext(PathURLContext);

  const obj = {
    buildings: {
      title: 'إدارة المباني',
      apiRouter: {
        getAll: '/GetAllBuildings',
        add: '/AddBuilding',
        update: '/UpdateBuilding',
        delete: '/DeleteBuilding',
      },
      columns: [
        { name: 'اسم المبنى (انجليزي)', key: 'EnglishName', type: 'text', placeholder: 'اسم المبنى باللغة الانجليزية' },
        { name: 'اسم المبنى (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم المبنى باللغة العربية' },
      ],
    },
    locations: {
      title: 'إدارة المواقع',
      apiRouter: {
        getAll: '/GetAllLocation',
        add: '/AddLocation',
        update: '/UpdateLocation',
        delete: '/DeleteLocation',
      },
      columns: [
        { name: 'اسم الموقع (انجليزي)', key: 'EnglishName', type: 'text', placeholder: 'اسم الموقع باللغة الانجليزية' },
        { name: 'اسم الموقع (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم الموقع باللغة العربية' },
      ],
    },
    rooms: {
      title: 'إدارة الغرف',
      apiRouter: {
        getAll: '/GetAllRoom',
        add: '/AddRoom',
        update: '/UpdateRoom',
        delete: '/DeleteRoom',
      },
      columns: [
        { name: 'اسم الغرفة (انجليزي)', key: 'EnglishName', type: 'text', placeholder: 'اسم الغرفة باللغة الانجليزية' },
        { name: 'اسم الغرفة (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم الغرفة باللغة العربية' },
      ],
    },
    roles: {
      title: 'إدارة الأدوار',
      apiRouter: {
        getAll: '/GetAllRole',
        add: '/AddRole',
        update: '/UpdateRole',
        delete: '/DeleteRole',
      },
      columns: [
        { name: 'الوصف', key: 'Description', type: 'text', placeholder: 'أدخل وصف الدور' },
        { name: 'اسم الدور (انجليزي)', key: 'EnglishName', type: 'text', placeholder: 'اسم الدور باللغة الانجليزية' },
        { name: 'اسم الدور (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم الدور باللغة العربية' },
      ],
    },
    permissions: {
      title: 'إدارة الصلاحيات',
      apiRouter: {
        getAll: '/GetAllPermission',
        add: '/AddPermission',
        update: '/UpdatePermission',
        delete: '/DeletePermission',
      },
      columns: [
        { name: 'الوصف', key: 'Description', type: 'text', placeholder: 'أدخل وصف الصلاحية' },
        { name: 'اسم الصلاحية (انجليزي)', key: 'EnglishName', type: 'text', placeholder: 'اسم الصلاحية باللغة الانجليزية' },
        { name: 'اسم الصلاحية (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم الصلاحية باللغة العربية' },
      ],
    },
    'committee-categories': {
      title: 'إدارة أنواع اللجان',
      apiRouter: {
        getAll: '/GetAllCommCat',
        add: '/AddCommCat',
        update: '/UpdateCommCat',
        delete: '/DeleteCommCat',
      },
      columns: [
        { name: 'اسم نوع اللجنة (انجليزي)', key: 'EnglishName', type: 'text', placeholder: 'اسم نوع اللجنة باللغة الانجليزية' },
        { name: 'اسم نوع اللجنة (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم نوع اللجنة باللغة العربية' },
      ],
    },
    'committee-departments': {
      title: 'إدارة أقسام اللجان',
      apiRouter: {
        getAll: '/GetAllDepartment',
        add: '/AddDepartment',
        update: '/UpdateDepartment',
        delete: '/DeleteDepartment',
      },
      columns: [
        { name: 'اسم القسم (انجليزي)', key: 'EnglishName', type: 'text', placeholder: 'اسم القسم باللغة الانجليزية' },
        { name: 'اسم القسم (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم القسم باللغة العربية' },
      ],
    },
    'committee-task-statuses': {
      title: 'إدارة حالات المهام',
      apiRouter: {
        getAll: '/GetAllCommitteeTaskStatus',
        add: '/AddCommitteeTaskStatus',
        update: '/UpdateCommitteeTaskStatus',
        delete: '/DeleteCommitteeTaskStatus',
      },
      columns: [
        { name: 'الوصف', key: 'Description', type: 'text', placeholder: 'أدخل وصف حالة المهمة' },
        { name: 'اسم حالة المهمة (انجليزي)', key: 'EnglishName', type: 'text', placeholder: 'اسم حالة المهمة باللغة الانجليزية' },
        { name: 'اسم حالة المهمة (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم حالة المهمة باللغة العربية' },
      ],
    },
    'meeting-types': {
      title: 'إدارة أنواع الاجتماعات',
      apiRouter: {
        getAll: '/GetAllMeetingType',
        add: '/AddMeetingType',
        update: '/UpdateMeetingType',
        delete: '/DeleteMeetingType',
      },
      columns: [
        {
          name: 'اسم نوع الاجتماع (انجليزي)',
          key: 'EnglishName',
          type: 'text',
          placeholder: 'اسم نوع الاجتماع باللغة الانجليزية',
        },
        { name: 'اسم نوع الاجتماع (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم نوع الاجتماع باللغة العربية' },
      ],
    },
    'meeting-statuses': {
      title: 'إدارة حالات الاجتماعات',
      apiRouter: {
        getAll: '/GetAllMeetingStatus',
        add: '/AddMeetingStatus',
        update: '/UpdateMeetingStatus',
        delete: '/DeleteMeetingStatus',
      },
      columns: [
        {
          name: 'الوصف',
          key: 'Description',
          type: 'text',
          placeholder: 'أدخل وصف حالة الاجتماع',
        },
        {
          name: 'اسم حالة الاجتماع (انجليزي)',
          key: 'EnglishName',
          type: 'text',
          placeholder: 'اسم حالة الاجتماع باللغة الانجليزية',
        },
        { name: 'اسم حالة الاجتماع (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم حالة الاجتماع باللغة العربية' },
      ],
    },
  };
  return (
    <div className={styles.adminHomepageMain}>
      {path?.includes('role-permissions') ? (
        <RolePermissionsTable />
      ) : (
        <SharedAdminTable columns={obj?.[path]?.columns} apiRoutes={obj?.[path]?.apiRouter} title={obj?.[path]?.title} />
      )}
    </div>
  );
};

export default AdminHomepage;
