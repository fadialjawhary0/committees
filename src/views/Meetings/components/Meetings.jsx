import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaTrash, FaPen } from 'react-icons/fa';

import styles from './Meetings.module.scss';
import MeetingsFilters from './MeetingsFilters';

const initialMeetingsData = [
  {
    id: 1,
    name: 'اجتماع تشاوري',
    type: 'استراتيجي',
    committee: 'لجنة الشؤون القانونية',
    time: '2024-09-01T10:00:00',
    Date: '2024-09-01',
    StartTime: '10:00:00',
    EndTime: '12:00:00',
    location: 'قاعة الاجتماعات 1',
    building: 'المبنى الإداري',
    attendees: ['أحمد علي', 'فاطمة حسن', 'محمد صالح'],
    agenda: 'مناقشة السياسات الجديدة والخطوات التالية.',
    notes: ['مراجعة السياسات السابقة', 'النظر في مناهج جديدة'],
    status: 'منشور',
  },
  {
    id: 2,
    name: 'اجتماع تخطيطي',
    type: 'عملياتي',
    committee: 'لجنة الشؤون الإستراتيجية',
    time: '2024-09-10T14:00:00',
    Date: '2024-09-05',
    StartTime: '12:00:00',
    EndTime: '13:30:00',
    location: 'قاعة الاجتماعات 2',
    building: 'المبنى الشمالي',
    attendees: ['سارة أحمد', 'خالد يوسف'],
    agenda: 'تخطيط الأنشطة القادمة للربع التالي.',
    notes: ['تحديد الأهداف', 'توزيع الموارد'],
    status: 'غير منشور',
  },
  {
    id: 3,
    name: 'اجتماع متابعة',
    type: 'تنفيذي',
    committee: 'لجنة متابعة مبادرات تحقيق الرؤية',
    time: '2024-09-15T09:00:00',
    Date: '2024-10-01',
    StartTime: '14:00:00',
    EndTime: '15:00:00',
    location: 'قاعة الاجتماعات 3',
    building: 'المبنى الرئيسي',
    attendees: ['أمل ناصر', 'يوسف القاسم'],
    agenda: 'مراجعة تقدم المبادرات الجارية.',
    notes: ['مناقشة المعوقات', 'اقتراح حلول للتحديات الحالية'],
    status: 'منشور',
  },
];

const committeeOptions = [
  { value: 'الكل', label: 'كل اللجان' },
  { value: 'لجنة الشؤون القانونية', label: 'لجنة الشؤون القانونية' },
  { value: 'لجنة الشؤون الإستراتيجية', label: 'لجنة الشؤون الإستراتيجية' },
  { value: 'لجنة متابعة مبادرات تحقيق الرؤية', label: 'لجنة متابعة مبادرات تحقيق الرؤية' },
];

const Meetings = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState(initialMeetingsData);
  const [selectedCommittee, setSelectedCommittee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = id => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
  };

  const handleEdit = id => {
    navigate(`/meetings/edit/${id}`);
  };

  const handleAddMeeting = () => {
    navigate('/meetings/create', { state: { mode: 'add' } });
  };

  const handleRowClick = id => {
    navigate(`/meetings/${id}`);
  };

  const handleFilterChange = selectedValue => {
    setSelectedCommittee(selectedValue);
  };

  const filteredMeetings = meetings.filter(
    meeting =>
      (selectedCommittee === 'الكل' || !selectedCommittee || meeting.committee === selectedCommittee) &&
      meeting.name.includes(searchTerm),
  );

  return (
    <div className={styles.meetingsPage}>
      <MeetingsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        committeeOptions={committeeOptions}
        handleFilterChange={handleFilterChange}
        handleAddMeeting={handleAddMeeting}
      />
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>اسم الاجتماع</th>
              <th>اللجنة</th>
              <th>التاريخ</th>
              <th>وقت البدء</th>
              <th>وقت الانتهاء</th>
              <th>المكان</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeetings.map(meeting => (
              <tr key={meeting.id} className={styles.trClickable} onClick={() => handleRowClick(meeting.id)}>
                <td>{meeting.name}</td>
                <td>{meeting.committee}</td>
                <td>{new Date(meeting.Date).toLocaleDateString('ar-EG')}</td>
                <td>{meeting.StartTime}</td>
                <td>{meeting.EndTime}</td>
                <td>
                  {meeting.location} - {meeting.building}
                </td>
                <td>
                  <button className={styles.editButton} onClick={() => handleEdit(meeting.id)}>
                    <FaPen />
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(meeting.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Meetings;
