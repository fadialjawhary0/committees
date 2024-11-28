import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ActivityLogStyles.scss';

const mockLogs = [
  {
    id: 1,
    user: 'Ahmed Ali',
    action: 'أضاف اجتماع جديد',
    details: 'اسم الاجتماع: اجتماع تشاوري',
    time: '2024-09-01T10:00:00',
    committee: 'لجنة الشؤون القانونية',
  },
  {
    id: 2,
    user: 'Hiba Mustafa',
    action: 'حدثت بيانات المدعوين',
    details: 'المدعوون الجدد: سارة أحمد، علي يوسف',
    time: '2024-09-09T10:15:00',
    committee: 'لجنة الشؤون القانونية',
  },
  { id: 3, user: 'Ahmed Ali', action: 'رفع ملف مستندات', details: 'اسم الملف: تقرير الأداء', time: '2024-09-02T12:30:00', committee: 'لجنة الشؤون القانونية' },
  {
    id: 4,
    user: 'Fatima Hassan',
    action: 'ألغى اجتماع',
    details: 'اسم الاجتماع: اجتماع تنسيقي',
    time: '2024-09-10T14:00:00',
    committee: 'لجنة الشؤون القانونية',
  },
  { id: 5, user: 'Ahmed Ali', action: 'أضاف عضو جديد', details: 'اسم العضو: نور الدين', time: '2024-09-04T14:45:00', committee: 'لجنة الشؤون القانونية' },
  { id: 6, user: 'Ahmed Ali', action: 'حذف ملف', details: 'اسم الملف: مستند العقود', time: '2024-09-05T16:20:00', committee: 'لجنة الشؤون القانونية' },
  { id: 7, user: 'Ahmed Ali', action: 'أضافت جدول أعمال', details: 'تفاصيل: اجتماع نصف سنوي', time: '2024-09-06T11:00:00', committee: 'لجنة الشؤون القانونية' },
  {
    id: 8,
    user: 'Ahmed Ali',
    action: 'حدثت وقت الاجتماع',
    details: 'وقت الاجتماع الجديد: 2024-09-15 14:00',
    time: '2024-09-07T13:30:00',
    committee: 'لجنة الشؤون القانونية',
  },
  { id: 9, user: 'Ahmed Ali', action: 'أضاف ملف جديد', details: 'اسم الملف: خطة العمل', time: '2024-09-08T09:45:00', committee: 'لجنة الشؤون القانونية' },
  {
    id: 10,
    user: 'Ahmed Ali',
    action: 'حدثت بيانات المدعوين',
    details: 'المدعوون الجدد: سارة أحمد، علي يوسف',
    time: '2024-09-09T10:15:00',
    committee: 'لجنة الشؤون القانونية',
  },
  {
    id: 11,
    user: 'Ahmed Ali',
    action: 'أضاف اجتماع جديد',
    details: 'اسم الاجتماع: اجتماع تشاوري',
    time: '2024-09-01T10:30:00',
    committee: 'لجنة الشؤون القانونية',
  },
  {
    id: 12,
    user: 'Hiba Mustafa',
    action: 'حدثت بيانات المدعوين',
    details: 'المدعوون الجدد: سارة أحمد، علي يوسف',
    time: '2024-09-09T10:45:00',
    committee: 'لجنة الشؤون القانونية',
  },
  { id: 13, user: 'Ahmed Ali', action: 'رفع ملف مستندات', details: 'اسم الملف: تقرير الأداء', time: '2024-09-02T13:00:00', committee: 'لجنة الشؤون القانونية' },
  {
    id: 14,
    user: 'Fatima Hassan',
    action: 'ألغى اجتماع',
    details: 'اسم الاجتماع: اجتماع تنسيقي',
    time: '2024-09-10T14:30:00',
    committee: 'لجنة الشؤون القانونية',
  },
  { id: 15, user: 'Ahmed Ali', action: 'أضاف عضو جديد', details: 'اسم العضو: نور الدين', time: '2024-09-04T15:15:00', committee: 'لجنة الشؤون القانونية' },
  { id: 16, user: 'Ahmed Ali', action: 'حذف ملف', details: 'اسم الملف: مستند العقود', time: '2024-09-05T16:50:00', committee: 'لجنة الشؤون القانونية' },
  {
    id: 17,
    user: 'Ahmed Ali',
    action: 'أضافت جدول أعمال',
    details: 'تفاصيل: اجتماع نصف سنوي',
    time: '2024-09-06T11:30:00',
    committee: 'لجنة الشؤون القانونية',
  },
  {
    id: 18,
    user: 'Ahmed Ali',
    action: 'حدثت وقت الاجتماع',
    details: 'وقت الاجتماع الجديد: 2024-09-15 14:30',
    time: '2024-09-07T14:00:00',
    committee: 'لجنة الشؤون القانونية',
  },
  { id: 19, user: 'Ahmed Ali', action: 'أضاف ملف جديد', details: 'اسم الملف: خطة العمل', time: '2024-09-08T10:15:00', committee: 'لجنة الشؤون القانونية' },
  {
    id: 20,
    user: 'Ahmed Ali',
    action: 'حدثت بيانات المدعوين',
    details: 'المدعوون الجدد: سارة أحمد، علي يوسف',
    time: '2024-09-09T10:45:00',
    committee: 'لجنة الشؤون القانونية',
  },
  {
    id: 21,
    user: 'Fatima Hassan',
    action: 'رفع ملف مستندات',
    details: 'اسم الملف: تقرير الأداء',
    time: '2024-09-02T12:45:00',
    committee: 'لجنة الشؤون الإستراتيجية',
  },
  {
    id: 22,
    user: 'Sara Ahmad',
    action: 'حدث بيانات اللجنة',
    details: 'تفاصيل التحديث: تغيير وصف اللجنة',
    time: '2024-09-03T09:15:00',
    committee: 'لجنة متابعة مبادرات تحقيق الرؤية',
  },
  { id: 23, user: 'Mohammed Saleh', action: 'أضاف عضو جديد', details: 'اسم العضو: نور الدين', time: '2024-09-04T14:45:00', committee: 'لجنة شوؤن الموظفين' },
  { id: 24, user: 'Khaled Youssef', action: 'حذف ملف', details: 'اسم الملف: مستند العقود', time: '2024-09-05T16:20:00', committee: 'لجنة الشؤون المالية' },
  {
    id: 25,
    user: 'Amal Nasser',
    action: 'أضافت جدول أعمال',
    details: 'تفاصيل: اجتماع نصف سنوي',
    time: '2024-09-06T11:00:00',
    committee: 'لجنة المشتريات والعقود',
  },
  {
    id: 26,
    user: 'Rania Omar',
    action: 'حدثت وقت الاجتماع',
    details: 'وقت الاجتماع الجديد: 2024-09-15 14:00',
    time: '2024-09-07T13:30:00',
    committee: 'لجنة متابعة المشاريع التشغيلية',
  },
  {
    id: 27,
    user: 'Yousef Al-Qassim',
    action: 'أضاف ملف جديد',
    details: 'اسم الملف: خطة العمل',
    time: '2024-09-08T09:45:00',
    committee: 'لجنة متابعة المشاريع الإستراتيجية',
  },
  {
    id: 28,
    user: 'Hiba Mustafa',
    action: 'حدثت بيانات المدعوين',
    details: 'المدعوون الجدد: سارة أحمد، علي يوسف',
    time: '2024-09-09T10:15:00',
    committee: 'لجنة الشؤون القانونية',
  },
  { id: 29, user: 'Omar Hussein', action: 'ألغى اجتماع', details: 'اسم الاجتماع: اجتماع تنسيقي', time: '2024-09-10T14:00:00', committee: 'لجنة شوؤن الموظفين' },
];

const committeeOptions = [
  'لجنة الشؤون القانونية',
  'لجنة الشؤون الإستراتيجية',
  'لجنة متابعة مبادرات تحقيق الرؤية',
  'لجنة شوؤن الموظفين',
  'لجنة الشؤون المالية',
  'لجنة المشتريات والعقود',
  'لجنة متابعة المشاريع التشغيلية',
  'لجنة متابعة المشاريع الإستراتيجية',
];

const ActivityLog = () => {
  const { committeeName } = useParams();
  const [logs, setLogs] = useState(mockLogs.filter(log => log.committee === committeeName));
  const [selectedCommittee, setSelectedCommittee] = useState(committeeName || '');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  const handleCommitteeChange = e => {
    setSelectedCommittee(e.target.value);
    setLogs(mockLogs.filter(log => log.committee === e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  return (
    <div className='activity-log-page'>
      <h1>سجل الأنشطة لـ {selectedCommittee}</h1>
      <div className='committee-selector'>
        <label htmlFor='committee'>اختر لجنة: </label>
        <select id='committee' value={selectedCommittee} onChange={handleCommitteeChange}>
          <option value=''>اختر لجنة</option>
          {committeeOptions.map(committee => (
            <option key={committee} value={committee}>
              {committee}
            </option>
          ))}
        </select>
      </div>
      <div className='log-list'>
        {currentLogs.length > 0 ? (
          currentLogs.map(log => (
            <div key={log.id} className='log-item'>
              <div className='log-user'>{log.user}</div>
              <div className='log-action'>{log.action}</div>
              <div className='log-details'>{log.details}</div>
              <div className='log-time'>{new Date(log.time).toLocaleString('ar-EG')}</div>
            </div>
          ))
        ) : (
          <p className='no-logs__msg'>لا يوجد سجلات لهذه اللجنة.</p>
        )}
      </div>
      <div className='pagination'>
        {[...Array(Math.ceil(logs.length / logsPerPage)).keys()].map(page => (
          <button key={page + 1} onClick={() => handlePageChange(page + 1)} className={`page-button ${currentPage === page + 1 ? 'active' : ''}`}>
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
