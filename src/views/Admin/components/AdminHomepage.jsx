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
    users: {
      title: 'إدارة المستخدمين',
      apiRouter: {
        getAll: '/GetAllSystemUser',
        add: '/AddSystemUser',
        update: '/UpdateSystemUser',
        delete: '/DeleteSystemUser',
      },
      columns: [
        { name: 'رقم الهاتف', key: 'PhoneNumber', type: 'text', placeholder: 'رقم الهاتف' },
        { name: 'البريد الإلكتروني', key: 'Email', type: 'text', placeholder: 'البريد الإلكتروني' },
        { name: 'اسم المستخدم الكامل', key: 'UserFullName', type: 'text', placeholder: 'اسم المستخدم الكامل' },
        { name: 'اسم المستخدم', key: 'UserName', type: 'text', placeholder: 'اسم المستخدم' },
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
      title: 'إدارة حالات مهام اللجان',
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
    'meeting-task-statuses': {
      title: 'إدارة حالات مهام الاجتماعات',
      apiRouter: {
        getAll: '/GetAllTaskStatus',
        add: '/AddTaskStatus',
        update: '/UpdateTaskStatus',
        delete: '/DeleteTaskStatus',
      },
      columns: [
        { name: 'الوصف', key: 'Description', type: 'text', placeholder: 'أدخل وصف حالة المهمة' },
        { name: 'اسم حالة المهمة (انجليزي)', key: 'EnglishName', type: 'text', placeholder: 'اسم حالة المهمة باللغة الانجليزية' },
        { name: 'اسم حالة المهمة (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم حالة المهمة باللغة العربية' },
      ],
    },
    'committee-file-types': {
      title: 'إدارة أنواع ملفات اللجان',
      apiRouter: {
        getAll: '/GetAllAttachmentType',
        add: '/AddAttachmentType',
        update: '/UpdateAttachmentType',
        delete: '/DeleteAttachmentType',
      },
      columns: [
        {
          name: 'اسم نوع الملف (انجليزي)',
          key: 'EnglishName',
          type: 'text',
          placeholder: 'اسم نوع الملف باللغة الانجليزية',
        },
        { name: 'اسم نوع الملف (عربي)', key: 'ArabicName', type: 'text', placeholder: 'اسم نوع الملف باللغة العربية' },
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
