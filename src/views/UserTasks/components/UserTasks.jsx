import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './UserTasks.module.scss';

const userTasks = [
  {
    id: 1,
    taskName: 'إعداد تقرير الأداء السنوي',
    assignedDate: '2024-11-15',
    committee: 'لجنة الشؤون القانونية',
    status: 'قيد التنفيذ',
  },
  {
    id: 2,
    taskName: 'مراجعة عقود المشتريات',
    assignedDate: '2024-11-10',
    committee: 'لجنة المشتريات والعقود',
    status: 'مكتمل',
  },
  {
    id: 3,
    taskName: 'تنظيم ورشة عمل داخلية',
    assignedDate: '2024-11-08',
    committee: 'لجنة متابعة مبادرات تحقيق الرؤية',
    status: 'لم يبدأ',
  },
  {
    id: 4,
    taskName: 'إعداد خطة الربع الأول',
    assignedDate: '2024-11-01',
    committee: 'لجنة الشؤون الإستراتيجية',
    status: 'لم يبدأ',
  },
  {
    id: 5,
    taskName: 'تنظيم اجتماع الموظفين',
    assignedDate: '2024-11-05',
    committee: 'لجنة شوؤن الموظفين',
    status: 'قيد التنفيذ',
  },
  {
    id: 6,
    taskName: 'إعداد تقرير مالي',
    assignedDate: '2024-11-12',
    committee: 'لجنة الشؤون المالية',
    status: 'مكتمل',
  },
  {
    id: 7,
    taskName: 'مراجعة السياسات القانونية',
    assignedDate: '2024-11-18',
    committee: 'لجنة الشؤون القانونية',
    status: 'قيد التنفيذ',
  },
  {
    id: 8,
    taskName: 'إعداد ميزانية المشتريات',
    assignedDate: '2024-11-20',
    committee: 'لجنة المشتريات والعقود',
    status: 'مكتمل',
  },
  {
    id: 9,
    taskName: 'متابعة تنفيذ المبادرات',
    assignedDate: '2024-11-22',
    committee: 'لجنة متابعة مبادرات تحقيق الرؤية',
    status: 'قيد التنفيذ',
  },
  {
    id: 10,
    taskName: 'تحديث الخطة الإستراتيجية',
    assignedDate: '2024-11-25',
    committee: 'لجنة الشؤون الإستراتيجية',
    status: 'مكتمل',
  },
  {
    id: 11,
    taskName: 'إعداد تقرير الموظفين الشهري',
    assignedDate: '2024-11-27',
    committee: 'لجنة شوؤن الموظفين',
    status: 'قيد التنفيذ',
  },
  {
    id: 12,
    taskName: 'مراجعة الحسابات الختامية',
    assignedDate: '2024-11-29',
    committee: 'لجنة الشؤون المالية',
    status: 'مكتمل',
  },
];

const UserTasks = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = userTasks.filter(task => task.taskName.includes(searchTerm) || task.committee.includes(searchTerm));

  return (
    <div className={styles.userTasksPage}>
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <input type='text' placeholder='ابحث عن مهمة' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={styles.searchField} />
          <FaSearch className={styles.searchIcon} />
        </div>
      </div>
      <table className={styles.sharedTable}>
        <thead>
          <tr>
            <th className={styles.sharedTh}>اسم المهمة</th>
            <th className={styles.sharedTh}>تاريخ التكليف</th>
            <th className={styles.sharedTh}>اللجنة</th>
            <th className={styles.sharedTh}>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => (
            <tr key={task.id}>
              <td className={styles.sharedTd}>{task.taskName}</td>
              <td className={styles.sharedTd}>{task.assignedDate}</td>
              <td className={styles.sharedTd}>{task.committee}</td>
              <td className={styles.sharedTd}>
                <select defaultValue={task.status}>
                  <option value='مكتمل'>مكتمل</option>
                  <option value='قيد التنفيذ'>قيد التنفيذ</option>
                  <option value='لم يبدأ'>لم يبدأ</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTasks;
