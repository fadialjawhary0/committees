// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaTrash, FaPlus, FaEdit, FaSearch } from 'react-icons/fa';
// import DropdownFilter from '../../../components/filters/Dropdown';

// import './Meetings.module.scss';

// const initialMeetingsData = [
//   {
//     id: 1,
//     name: 'اجتماع تشاوري',
//     committee: 'لجنة الشؤون القانونية',
//     time: '2024-09-01T10:00:00',
//     location: 'قاعة الاجتماعات 1',
//     invited: ['Ahmed Ali', 'Fatima Hassan', 'Mohammed Saleh'],
//     agenda: 'مناقشة السياسات الجديدة والخطوات التالية.',
//     comments: ['مراجعة السياسات السابقة', 'النظر في مناهج جديدة'],
//   },
//   {
//     id: 2,
//     name: 'اجتماع تخطيطي',
//     committee: 'لجنة الشؤون الإستراتيجية',
//     time: '2024-09-10T14:00:00',
//     location: 'قاعة الاجتماعات 2',
//     invited: ['Sara Ahmad', 'Khaled Youssef'],
//     agenda: 'تخطيط الأنشطة القادمة للربع التالي.',
//     comments: ['تحديد الأهداف', 'توزيع الموارد'],
//   },
//   {
//     id: 3,
//     name: 'اجتماع متابعة',
//     committee: 'لجنة متابعة مبادرات تحقيق الرؤية',
//     time: '2024-09-15T09:00:00',
//     location: 'قاعة الاجتماعات 3',
//     invited: ['Amal Nasser', 'Yousef Al-Qassim'],
//     agenda: 'مراجعة تقدم المبادرات الجارية.',
//     comments: ['مناقشة المعوقات', 'اقتراح حلول للتحديات الحالية'],
//   },
//   {
//     id: 4,
//     name: 'اجتماع نصف سنوي',
//     committee: 'لجنة شوؤن الموظفين',
//     time: '2024-09-20T11:00:00',
//     location: 'قاعة الاجتماعات 4',
//     invited: ['Nour Al-Din', 'Lina Mahmoud', 'Khaled Youssef'],
//     agenda: 'مناقشة تقارير الأداء للنصف الأول من العام.',
//     comments: ['تقييم الأداء', 'تحديد المجالات التي تحتاج إلى تحسين'],
//   },
//   {
//     id: 5,
//     name: 'اجتماع تقرير الأداء',
//     committee: 'لجنة متابعة المشاريع الإستراتيجية',
//     time: '2024-09-25T16:00:00',
//     location: 'قاعة الاجتماعات 5',
//     invited: ['Ayman Ziad', 'Fatima Hassan', 'Sara Ahmad'],
//     agenda: 'تقييم نتائج المشاريع الاستراتيجية.',
//     comments: ['تحليل النتائج', 'التخطيط للخطوات القادمة'],
//   },
//   {
//     id: 6,
//     name: 'اجتماع تنسيقي',
//     committee: 'لجنة المشتريات والعقود',
//     time: '2024-09-28T14:00:00',
//     location: 'قاعة الاجتماعات 6',
//     invited: ['Ahmed Ali', 'Mohammed Saleh', 'Rania Omar'],
//     agenda: 'تنسيق أنشطة المشتريات للربع الرابع.',
//     comments: ['مراجعة العقود', 'التأكد من تلبية جميع المتطلبات'],
//   },
// ];

// const committeeOptions = [
//   { value: '', label: 'كل اللجان' },
//   { value: 'لجنة الشؤون القانونية', label: 'لجنة الشؤون القانونية' },
//   { value: 'لجنة الشؤون الإستراتيجية', label: 'لجنة الشؤون الإستراتيجية' },
//   { value: 'لجنة متابعة مبادرات تحقيق الرؤية', label: 'لجنة متابعة مبادرات تحقيق الرؤية' },
//   { value: 'لجنة شوؤن الموظفين', label: 'لجنة شوؤن الموظفين' },
//   { value: 'لجنة الشؤون المالية', label: 'لجنة الشؤون المالية' },
//   { value: 'لجنة المشتريات والعقود', label: 'لجنة المشتريات والعقود' },
//   { value: 'لجنة متابعة المشاريع التشغيلية', label: 'لجنة متابعة المشاريع التشغيلية' },
//   { value: 'لجنة متابعة المشاريع الإستراتيجية', label: 'لجنة متابعة المشاريع الإستراتيجية' },
// ];

// const Meetings = () => {
//   const navigate = useNavigate();
//   const [meetings, setMeetings] = useState(initialMeetingsData);
//   const [selectedCommittee, setSelectedCommittee] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedMeetingId, setExpandedMeetingId] = useState(null);

//   const handleDelete = id => {
//     setMeetings(meetings.filter(meeting => meeting.id !== id));
//   };

//   const handleEdit = id => {
//     navigate(`/meetings/edit/${id}`);
//   };

//   const handleAddMeeting = () => {
//     navigate('/meetings/create');
//   };

//   const handleFilterChange = event => {
//     setSelectedCommittee(event.target.value);
//   };

//   const handleRowClick = id => {
//     setExpandedMeetingId(expandedMeetingId === id ? null : id);
//   };

//   const filteredMeetings = meetings.filter(
//     meeting => (selectedCommittee ? meeting.committee === selectedCommittee : true) && meeting.name.includes(searchTerm),
//   );

//   return (
//     <div className={styles.meetingsPage}>
//       <div className='meetings-filters'>
//         <div className='search-dropdown__filters'>
//           <div className='meetings-filters__search'>
//             <input
//               className='meetings-filters__search__field'
//               placeholder='ابحث عن اجتماع'
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               dir='rtl'
//             />
//             <FaSearch className='search-icon' />
//           </div>
//           <DropdownFilter options={committeeOptions} label='اختر اللجنة' onChange={handleFilterChange} />
//         </div>
//         <div className='action-buttons-container'>
//           <div className='action-button' onClick={handleAddMeeting}>
//             <FaPlus />
//             <span>إنشاء اجتماع</span>
//           </div>
//         </div>
//       </div>
//       <table className='shared-table'>
//         <thead>
//           <tr>
//             <th className='shared-th'>اسم الاجتماع</th>
//             <th className='shared-th'>اللجنة</th>
//             <th className='shared-th'>الوقت</th>
//             <th className='shared-th'>المكان</th>
//             <th className='shared-th'>إجراءات</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredMeetings.map(meeting => (
//             <React.Fragment key={meeting.id}>
//               <tr onClick={() => handleRowClick(meeting.id)} className='shared-tr-clickable'>
//                 <td className='shared-td'>{meeting.name}</td>
//                 <td className='shared-td'>{meeting.committee}</td>
//                 <td className='shared-td'>{new Date(meeting.time).toLocaleString('ar-EG')}</td>
//                 <td className='shared-td'>{meeting.location}</td>
//                 <td className='shared-td'>
//                   <button className='shared-edit-button' onClick={() => handleEdit(meeting.id)}>
//                     <FaEdit />
//                   </button>
//                   <button className='shared-delete-button' onClick={() => handleDelete(meeting.id)}>
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//               {expandedMeetingId === meeting.id && (
//                 <tr className='expanded-row'>
//                   <td className='shared-td' colSpan='5'>
//                     <div className='expanded-content'>
//                       <p>
//                         <strong>المدعوون:</strong> {meeting.invited.join(', ')}
//                       </p>
//                       <p>
//                         <strong>جدول الأعمال:</strong> {meeting.agenda}
//                       </p>
//                       <div className='comments-section'>
//                         <strong>ملاحظات:</strong>
//                         {meeting.comments.map((comment, index) => (
//                           <p key={index} className='comment'>
//                             {comment}
//                           </p>
//                         ))}
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Meetings;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaTrash, FaPlus, FaEdit, FaSearch } from 'react-icons/fa';
import DropdownFilter from '../../../components/filters/Dropdown';

import styles from './Meetings.module.scss';

const initialMeetingsData = [
  {
    id: 1,
    name: 'اجتماع تشاوري',
    committee: 'لجنة الشؤون القانونية',
    time: '2024-09-01T10:00:00',
    location: 'قاعة الاجتماعات 1',
    invited: ['Ahmed Ali', 'Fatima Hassan', 'Mohammed Saleh'],
    agenda: 'مناقشة السياسات الجديدة والخطوات التالية.',
    comments: ['مراجعة السياسات السابقة', 'النظر في مناهج جديدة'],
  },
  {
    id: 2,
    name: 'اجتماع تخطيطي',
    committee: 'لجنة الشؤون الإستراتيجية',
    time: '2024-09-10T14:00:00',
    location: 'قاعة الاجتماعات 2',
    invited: ['Sara Ahmad', 'Khaled Youssef'],
    agenda: 'تخطيط الأنشطة القادمة للربع التالي.',
    comments: ['تحديد الأهداف', 'توزيع الموارد'],
  },
  {
    id: 3,
    name: 'اجتماع متابعة',
    committee: 'لجنة متابعة مبادرات تحقيق الرؤية',
    time: '2024-09-15T09:00:00',
    location: 'قاعة الاجتماعات 3',
    invited: ['Amal Nasser', 'Yousef Al-Qassim'],
    agenda: 'مراجعة تقدم المبادرات الجارية.',
    comments: ['مناقشة المعوقات', 'اقتراح حلول للتحديات الحالية'],
  },
  {
    id: 4,
    name: 'اجتماع نصف سنوي',
    committee: 'لجنة شوؤن الموظفين',
    time: '2024-09-20T11:00:00',
    location: 'قاعة الاجتماعات 4',
    invited: ['Nour Al-Din', 'Lina Mahmoud', 'Khaled Youssef'],
    agenda: 'مناقشة تقارير الأداء للنصف الأول من العام.',
    comments: ['تقييم الأداء', 'تحديد المجالات التي تحتاج إلى تحسين'],
  },
  {
    id: 5,
    name: 'اجتماع تقرير الأداء',
    committee: 'لجنة متابعة المشاريع الإستراتيجية',
    time: '2024-09-25T16:00:00',
    location: 'قاعة الاجتماعات 5',
    invited: ['Ayman Ziad', 'Fatima Hassan', 'Sara Ahmad'],
    agenda: 'تقييم نتائج المشاريع الاستراتيجية.',
    comments: ['تحليل النتائج', 'التخطيط للخطوات القادمة'],
  },
  {
    id: 6,
    name: 'اجتماع تنسيقي',
    committee: 'لجنة المشتريات والعقود',
    time: '2024-09-28T14:00:00',
    location: 'قاعة الاجتماعات 6',
    invited: ['Ahmed Ali', 'Mohammed Saleh', 'Rania Omar'],
    agenda: 'تنسيق أنشطة المشتريات للربع الرابع.',
    comments: ['مراجعة العقود', 'التأكد من تلبية جميع المتطلبات'],
  },
];

const committeeOptions = [
  { value: '', label: 'كل اللجان' },
  { value: 'لجنة الشؤون القانونية', label: 'لجنة الشؤون القانونية' },
  { value: 'لجنة الشؤون الإستراتيجية', label: 'لجنة الشؤون الإستراتيجية' },
  { value: 'لجنة متابعة مبادرات تحقيق الرؤية', label: 'لجنة متابعة مبادرات تحقيق الرؤية' },
  { value: 'لجنة شوؤن الموظفين', label: 'لجنة شوؤن الموظفين' },
  { value: 'لجنة الشؤون المالية', label: 'لجنة الشؤون المالية' },
  { value: 'لجنة المشتريات والعقود', label: 'لجنة المشتريات والعقود' },
  { value: 'لجنة متابعة المشاريع التشغيلية', label: 'لجنة متابعة المشاريع التشغيلية' },
  { value: 'لجنة متابعة المشاريع الإستراتيجية', label: 'لجنة متابعة المشاريع الإستراتيجية' },
];

const Meetings = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState(initialMeetingsData);
  const [selectedCommittee, setSelectedCommittee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMeetingId, setExpandedMeetingId] = useState(null);

  const handleDelete = id => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
  };

  const handleEdit = id => {
    navigate(`/meetings/edit/${id}`);
  };

  const handleAddMeeting = () => {
    navigate('/meetings/create');
  };

  const handleFilterChange = event => {
    setSelectedCommittee(event.target.value);
  };

  const handleRowClick = id => {
    setExpandedMeetingId(expandedMeetingId === id ? null : id);
  };

  const filteredMeetings = meetings.filter(
    meeting => (selectedCommittee ? meeting.committee === selectedCommittee : true) && meeting.name.includes(searchTerm),
  );

  return (
    <div className={styles.meetingsPage}>
      <div className={styles.meetingsFilters}>
        <div className={styles.searchDropdownFilters}>
          <div className={styles.meetingsFiltersSearch}>
            <input className={styles.searchField} placeholder='ابحث عن اجتماع' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} dir='rtl' />
            <FaSearch className={styles.searchIcon} />
          </div>
          <DropdownFilter options={committeeOptions} label='اختر اللجنة' onChange={handleFilterChange} />
        </div>
        <div className={styles.actionButtonsContainer}>
          <div className={styles.actionButton} onClick={handleAddMeeting}>
            <FaPlus />
            <span>إنشاء اجتماع</span>
          </div>
        </div>
      </div>
      <table className={styles.sharedTable}>
        <thead>
          <tr>
            <th className={styles.sharedTh}>اسم الاجتماع</th>
            <th className={styles.sharedTh}>اللجنة</th>
            <th className={styles.sharedTh}>الوقت</th>
            <th className={styles.sharedTh}>المكان</th>
            <th className={styles.sharedTh}>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredMeetings.map(meeting => (
            <React.Fragment key={meeting.id}>
              <tr onClick={() => handleRowClick(meeting.id)} className={styles.sharedTrClickable}>
                <td className={styles.sharedTd}>{meeting.name}</td>
                <td className={styles.sharedTd}>{meeting.committee}</td>
                <td className={styles.sharedTd}>{new Date(meeting.time).toLocaleString('ar-EG')}</td>
                <td className={styles.sharedTd}>{meeting.location}</td>
                <td className={styles.sharedTd}>
                  <button className={styles.sharedEditButton} onClick={() => handleEdit(meeting.id)}>
                    <FaEdit />
                  </button>
                  <button className={styles.sharedDeleteButton} onClick={() => handleDelete(meeting.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
              {expandedMeetingId === meeting.id && (
                <tr className={styles.expandedRow}>
                  <td className={styles.sharedTd} colSpan='5'>
                    <div className={styles.expandedContent}>
                      <p>
                        <strong>المدعوون:</strong> {meeting.invited.join(', ')}
                      </p>
                      <p>
                        <strong>جدول الأعمال:</strong> {meeting.agenda}
                      </p>
                      <div className={styles.commentsSection}>
                        <strong>ملاحظات:</strong>
                        {meeting.comments.map((comment, index) => (
                          <p key={index} className={styles.comment}>
                            {comment}
                          </p>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Meetings;
