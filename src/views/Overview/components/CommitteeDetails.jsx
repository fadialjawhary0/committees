import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaFileAlt, FaPlus } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import './CommitteeDetailsStyles.scss';
import { CommitteesData } from '../../../constants';
import Logger from './Logger';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const CommitteeDetails = () => {
  const navigate = useNavigate();
  const { committeeName } = useParams();

  const { id } = useParams();
  const [committee, setCommittee] = useState(null);
  const [showMoreMembers, setShowMoreMembers] = useState(false);
  const [showMoreMeetings, setShowMoreMeetings] = useState(false);
  const [showMoreFiles, setShowMoreFiles] = useState(false);

  useEffect(() => {
    const fetchCommitteeDetails = () => {
      const selectedCommittee = CommitteesData.find(c => c.id === parseInt(id));
      setCommittee(selectedCommittee);
    };

    fetchCommitteeDetails();
  }, [id]);

  if (!committee) return <p>Loading...</p>;

  const taskDistributionData = {
    labels: ['مهمة منجزة', 'مهمة قيد الإجراء', 'متأخرة'],
    datasets: [
      {
        label: 'توزيع المهام',
        data: committee.tasks.map(task => task.count),
        backgroundColor: ['#38a169', '#e53e3e', '#dd6b20'],
        hoverOffset: 4,
      },
    ],
  };

  const handleDiscussionClick = () => {
    navigate(`/overview/committee/${id}/discussions`);
  };

  const MAX_VISIBLE_ITEMS = 3;

  const mockLogs = [
    { id: 1, user: { name: 'Ahmed Ali' }, action: 'أضاف اجتماع جديد', time: '2024-09-01T10:00:00' },
    { id: 2, user: { name: 'Fatima Hassan' }, action: 'رفع ملف مستندات', time: '2024-09-02T12:30:00' },
    { id: 3, user: { name: 'Sara Ahmad' }, action: 'حدث بيانات اللجنة', time: '2024-09-03T09:15:00' },
    { id: 4, user: { name: 'Mohammed Saleh' }, action: 'أضاف عضو جديد', time: '2024-09-04T14:45:00' },
    { id: 5, user: { name: 'Khaled Youssef' }, action: 'حذف ملف', time: '2024-09-05T16:20:00' },
  ];

  const mockDiscussions = [
    {
      id: 1,
      author: 'Ahmed Ali',
      topic: 'اقتراح جدول أعمال جديد',
      message: 'أقترح إضافة بند لمناقشة الميزانية للربع القادم.',
      time: '2024-09-12T10:15:00',
    },
    {
      id: 2,
      author: 'Fatima Hassan',
      topic: 'مراجعة مستندات المشتريات',
      message: 'نحتاج إلى مراجعة جميع مستندات المشتريات قبل الاجتماع القادم.',
      time: '2024-09-13T14:30:00',
    },
  ];

  return (
    <div className='committee-details-page'>
      <div className='page-header'>
        <p className='committee-date'>تاريخ الإنشاء: {new Date(committee.startDate).toLocaleDateString('ar-EG')}</p>
        <h1>{committee.name}</h1>
      </div>

      <div className='committee-dashboard'>
        <div className='dashboard-widget'>
          <div className='widget-header'>
            <h3>عدد الأعضاء</h3>
            <button className='add-button'>
              <FaPlus className='add-icon' /> إضافة
            </button>
          </div>
          <div className='widget-content'>
            <FaUsers className='widget-icon' />
            <span>{committee?.peopleDetails?.length}</span>
          </div>
          <div className='widget-details'>
            {committee.peopleDetails.slice(0, showMoreMembers ? committee.peopleDetails.length : MAX_VISIBLE_ITEMS).map(person => (
              <div key={person.id} className='widget-item'>
                <div className='profile-icon'>{person.name.charAt(0)}</div>
                <div className='item-details'>
                  <span className='item-name'>{person.name}</span>
                  <span className='item-role'>{person.role}</span>
                </div>
              </div>
            ))}
            {committee.peopleDetails.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreMembers(!showMoreMembers)} className='view-more-button'>
                {showMoreMembers ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>

        <div className='dashboard-widget'>
          <div className='widget-header'>
            <h3>الاجتماعات القادمة</h3>
            <button className='create-button'>
              <FaPlus className='add-icon' /> إنشاء
            </button>
          </div>
          <div className='widget-content'>
            <FaCalendarAlt className='widget-icon' />
            <span>{committee?.meetingsDetails?.length}</span>
          </div>
          <div className='widget-details'>
            {committee.meetingsDetails.slice(0, showMoreMeetings ? committee.meetingsDetails.length : MAX_VISIBLE_ITEMS).map(meeting => (
              <div key={meeting.id} className='widget-item'>
                {meeting.name} - {new Date(meeting.time).toLocaleString('ar-EG')}
              </div>
            ))}
            {committee.meetingsDetails.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreMeetings(!showMoreMeetings)} className='view-more-button'>
                {showMoreMeetings ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>

        <div className='dashboard-widget'>
          <div className='widget-header'>
            <h3>المرفقات</h3>
            <button className='upload-button'>
              <FaPlus className='add-icon' /> رفع
            </button>
          </div>
          <div className='widget-content'>
            <FaFileAlt className='widget-icon' />
            <span>{committee?.files?.length || 0}</span>
          </div>
          <div className='widget-details'>
            {committee.files.slice(0, showMoreFiles ? committee.files.length : MAX_VISIBLE_ITEMS).map(file => (
              <div key={file.id} className='widget-item'>
                {file.name}
              </div>
            ))}
            {committee.files.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreFiles(!showMoreFiles)} className='view-more-button'>
                {showMoreFiles ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '3rem' }}>
        <div className='committee-section'>
          <h2>توزيع المهام</h2>
          <div className='chart-container'>
            <Pie data={taskDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <Logger logs={mockLogs} />
      </div>
      <div className='widget-header'>
        <h3>نقاشات اللجنة</h3>
      </div>
      <div className='dashboard-widget discussion-widget' onClick={handleDiscussionClick}>
        <div className='widget-content'>
          {mockDiscussions.map(discussion => (
            <div key={discussion.id} className='widget-item'>
              <div className='item-details'>
                <span className='item-name'>{discussion.topic}</span>
                <span className='item-author'>{discussion.author}</span>
                <span className='item-message'>{discussion.message}</span>
                <span className='item-time'>{new Date(discussion.time).toLocaleString('ar-EG')}</span>
              </div>
            </div>
          ))}
          <button className='view-more-button'>عرض جميع النقاشات</button>
        </div>
      </div>
    </div>
  );
};

export default CommitteeDetails;
