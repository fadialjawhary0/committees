import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import styles from './Agreements.module.scss';
import AgreementsFilters from './AgreementsFilters';
import DropdownFilter from '../../../components/filters/Dropdown';

const Agreements = () => {
  const [requests, setRequests] = useState([
    { id: 1, name: 'المهمة 1', date: '2024-11-01', status: 'قيد التنفيذ', committeeName: 'اللجنة 1', assignedTo: 'أحمد علي' },
    { id: 2, name: 'المهمة 2', date: '2024-11-05', status: 'تمت الموافقة', committeeName: 'اللجنة 2', assignedTo: 'فاطمة حسان' },
    { id: 3, name: 'المهمة 3', date: '2024-11-10', status: 'تم الرفض', committeeName: 'اللجنة 3', assignedTo: 'محمد صالح' },
    { id: 4, name: 'المهمة 4', date: '2024-11-01', status: 'قيد التنفيذ', committeeName: 'اللجنة 4', assignedTo: 'أحمد علي' },
    { id: 5, name: 'المهمة 5', date: '2024-11-05', status: 'قيد التنفيذ', committeeName: 'اللجنة 4', assignedTo: 'فاطمة حسان' },
    { id: 6, name: 'المهمة 6', date: '2024-11-10', status: 'تم الرفض', committeeName: 'اللجنة 3', assignedTo: 'محمد صالح' },
    { id: 7, name: 'المهمة 7', date: '2024-11-01', status: 'قيد التنفيذ', committeeName: 'اللجنة 2', assignedTo: 'أحمد علي' },
    { id: 8, name: 'المهمة 8', date: '2024-11-05', status: 'تمت الموافقة', committeeName: 'اللجنة 5', assignedTo: 'فاطمة حسان' },
    { id: 9, name: 'المهمة 9', date: '2024-11-10', status: 'تم الرفض', committeeName: 'اللجنة 1', assignedTo: 'محمد صالح' },
    { id: 10, name: 'المهمة 10', date: '2024-11-01', status: 'تم الرفض', committeeName: 'اللجنة 8', assignedTo: 'أحمد علي' },
    { id: 11, name: 'المهمة 11', date: '2024-11-05', status: 'تم الرفض', committeeName: 'اللجنة 8', assignedTo: 'فاطمة حسان' },
    { id: 12, name: 'المهمة 12', date: '2024-11-10', status: 'تمت الموافقة', committeeName: 'اللجنة 1', assignedTo: 'محمد صالح' },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'أحمد علي', committees: ['اللجنة 1', 'اللجنة 2'] },
    { id: 2, name: 'فاطمة حسان', committees: ['اللجنة 3'] },
    { id: 3, name: 'محمد صالح', committees: ['اللجنة 1'] },
    { id: 4, name: 'سارة أحمد', committees: ['اللجنة 2', 'اللجنة 3'] },
    { id: 5, name: 'خالد يوسف', committees: ['اللجنة 3'] },
    { id: 6, name: 'أمل ناصر', committees: ['اللجنة 1', 'اللجنة 2'] },
    { id: 7, name: 'رانيا عمر', committees: ['اللجنة 2'] },
    { id: 8, name: 'يوسف القاسم', committees: ['اللجنة 3'] },
    { id: 9, name: 'هبة مصطفى', committees: ['اللجنة 1'] },
    { id: 10, name: 'عمر حسين', committees: ['اللجنة 2', 'اللجنة 3'] },
  ]);

  const [filter, setFilter] = useState('All');

  const handleApprove = id => {
    const updatedRequests = requests.map(req => (req.id === id ? { ...req, status: 'تمت الموافقة' } : req));
    setRequests(updatedRequests);
  };

  const handleReject = id => {
    const updatedRequests = requests.map(req => (req.id === id ? { ...req, status: 'تم الرفض' } : req));
    setRequests(updatedRequests);
  };

  const handleReassign = (id, newAssignee) => {
    const updatedRequests = requests.map(req => (req.id === id ? { ...req, assignedTo: newAssignee } : req));
    setRequests(updatedRequests);
  };

  const handleFilterChange = selectedValue => {
    setFilter(selectedValue);
  };

  const filteredRequests = filter === 'All' ? requests : requests.filter(req => req.status === filter);

  const agreementOptions = [
    { label: 'الكل', value: 'All' },
    { label: 'قيد التنفيذ', value: 'قيد التنفيذ' },
    { label: 'تمت الموافقة', value: 'تمت الموافقة' },
    { label: 'تم الرفض', value: 'تم الرفض' },
  ];

  return (
    <div className={styles.agreementsPage}>
      <AgreementsFilters agreementsOptions={agreementOptions} handleFilterChange={handleFilterChange} />

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>اسم المهمة</th>
              <th>المسؤول</th>
              <th>تاريخ الطلب</th>
              <th>الحالة</th>
              <th>اللجنة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request.id}>
                <td>{request.name}</td>
                <td>{request.assignedTo}</td>
                <td>{request.date}</td>
                <td>
                  <span
                    style={{
                      padding: '0.5rem',
                      borderRadius: '1rem',
                      minWidth: '10rem',
                      fontWeight: '500',
                      display: 'inline-block',
                      backgroundColor:
                        request.status === 'قيد التنفيذ'
                          ? '#ffc10758'
                          : request.status === 'تمت الموافقة'
                          ? '#28A74558'
                          : '#DC354558',
                    }}>
                    {request.status}
                  </span>
                </td>
                <td>{request.committeeName}</td>
                <td className={`${styles.sharedTd} ${styles.actions}`}>
                  <DropdownFilter
                    options={users.map(user => ({ value: user.name, label: user.name }))}
                    onSelect={newAssignee => handleReassign(request.id, newAssignee)}
                    placeholder='إعادة تعيين'
                  />
                  {request.status === 'قيد التنفيذ' && (
                    <>
                      <button onClick={() => handleApprove(request.id)} className={styles.approveButton}>
                        <FaCheck /> قبول
                      </button>
                      <button onClick={() => handleReject(request.id)} className={styles.rejectButton}>
                        <FaTimes /> رفض
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agreements;
