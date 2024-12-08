import React, { useState } from 'react';
import styles from './UserTasks.module.scss';
import DropdownFilter from '../../../components/filters/Dropdown';
import UserTasksFilters from './UserTasksFilters';

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
];

const CommitteeStatus = [
  { value: 'مكتمل', label: 'مكتمل' },
  { value: 'قيد التنفيذ', label: 'قيد التنفيذ' },
  { value: 'لم يبدأ', label: 'لم يبدأ' },
];

const UserTasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState(userTasks);

  const handleStatusChange = (id, newStatus) => {
    const updatedTasks = tasks.map(task => (task.id === id ? { ...task, status: newStatus } : task));
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => task.taskName.includes(searchTerm) || task.committee.includes(searchTerm));

  return (
    <div className={styles.userTasksPage}>
      <UserTasksFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>اسم المهمة</th>
              <th>تاريخ التكليف</th>
              <th>اللجنة</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id}>
                <td>{task.taskName}</td>
                <td>{task.assignedDate}</td>
                <td>{task.committee}</td>
                <td>
                  <DropdownFilter
                    options={CommitteeStatus}
                    defaultValue={task.status}
                    onSelect={newStatus => handleStatusChange(task.id, newStatus)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTasks;
