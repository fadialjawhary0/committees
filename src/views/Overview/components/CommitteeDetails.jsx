import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaFileAlt, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './CommitteeDetails.module.scss';
import { CommitteesData } from '../../../constants';
import Logger from './Logger';
import VotingModal from '../../../components/VotingModal';
import VotingSystem from '../../../components/VotingSystem';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const CommitteeDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [committee, setCommittee] = useState(null);
  const [showMoreMembers, setShowMoreMembers] = useState(false);
  const [showMoreMeetings, setShowMoreMeetings] = useState(false);
  const [showMoreFiles, setShowMoreFiles] = useState(false);
  const [votings, setVotings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVoting, setNewVoting] = useState({ question: '', options: [] });
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    setVotings([
      {
        id: 1,
        question: 'ما هو موعد الاجتماع القادم المفضل؟',
        options: [
          { id: 1, text: 'الاثنين', votes: 10 },
          { id: 2, text: 'الأربعاء', votes: 15 },
          { id: 3, text: 'الجمعة', votes: 5 },
        ],
      },
    ]);
  }, []);

  const addNewVoting = () => {
    setIsModalOpen(true);
    setNewVoting({ question: '', options: [] });
  };

  const handleSaveVoting = () => {
    if (newVoting.question.trim() === '' || newVoting.options.length === 0) {
      alert('Please enter a question and at least one option.');
      return;
    }
    setVotings([...votings, { id: votings.length + 1, ...newVoting }]);
    setIsModalOpen(false);
  };

  const handleAddOption = () => {
    if (newOption.trim() !== '') {
      setNewVoting(prev => ({
        ...prev,
        options: [...prev.options, { id: prev.options.length + 1, text: newOption, votes: 0 }],
      }));
      setNewOption('');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleVote = (votingId, optionId) => {
    setVotings(prev =>
      prev.map(voting =>
        voting.id === votingId
          ? {
              ...voting,
              options: voting.options.map(option => (option.id === optionId ? { ...option, votes: option.votes + 1 } : option)),
            }
          : voting,
      ),
    );
  };

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
    <div>
      <div className={styles.pageHeader}>
        <p className={styles.committeeDate}>تاريخ الإنشاء: {new Date(committee.startDate).toLocaleDateString('ar-EG')}</p>
        <h4>{committee.name}</h4>
      </div>

      <div className={styles.committeeDashboard}>
        <div className={styles.dashboardWidget}>
          <div className={styles.widgetHeader}>
            <h5>المرفقات</h5>
            <button className={styles.button}>
              <FaPlus className={styles.addIcon} />
              <p>رفع</p>
            </button>
          </div>
          <div className={styles.widgetContent}>
            <FaFileAlt className={styles.widgetIcon} />
            <span>{committee?.files?.length || 0}</span>
          </div>
          <div className={styles.widgetDetails}>
            {committee.files.slice(0, showMoreFiles ? committee.files.length : MAX_VISIBLE_ITEMS).map(file => (
              <div key={file.id} className={styles.widgetItem}>
                {file.name}
              </div>
            ))}
            {committee.files.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreFiles(!showMoreFiles)} className={styles.viewMoreButton}>
                {showMoreFiles ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.dashboardWidget}>
          <div className={styles.widgetHeader}>
            <h5>الاجتماعات القادمة</h5>
            <button className={styles.button}>
              <FaPlus className={styles.addIcon} />
              <p>إنشاء</p>
            </button>
          </div>
          <div className={styles.widgetContent}>
            <FaCalendarAlt className={styles.widgetIcon} />
            <span>{committee?.meetingsDetails?.length}</span>
          </div>
          <div className={styles.widgetDetails}>
            {committee.meetingsDetails
              .slice(0, showMoreMeetings ? committee.meetingsDetails.length : MAX_VISIBLE_ITEMS)
              .map(meeting => (
                <div key={meeting.id} className={styles.widgetItem}>
                  {meeting.name} - {new Date(meeting.time).toLocaleString('ar-EG')}
                </div>
              ))}
            {committee.meetingsDetails.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreMeetings(!showMoreMeetings)} className={styles.viewMoreButton}>
                {showMoreMeetings ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.dashboardWidget}>
          <div className={styles.widgetHeader}>
            <h5>الاجتماعات المنعقدة</h5>
          </div>
          <div className={styles.widgetContent}>
            <FaCalendarAlt className={styles.widgetIcon} />
            <span>{committee?.meetingsDetails?.length}</span>
          </div>
          <div className={styles.widgetDetails}>
            {committee.meetingsDetails
              .slice(0, showMoreMeetings ? committee.meetingsDetails.length : MAX_VISIBLE_ITEMS)
              .map(meeting => (
                <div key={meeting.id} className={styles.widgetItem}>
                  {meeting.name} - {new Date(meeting.time).toLocaleString('ar-EG')}
                </div>
              ))}
            {committee.meetingsDetails.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreMeetings(!showMoreMeetings)} className={styles.viewMoreButton}>
                {showMoreMeetings ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.dashboardWidget}>
          <div className={styles.widgetHeader}>
            <h5>الأعضاء</h5>
            <button className={styles.button}>
              <FaPlus className={styles.addIcon} />
              <p>إضافة</p>
            </button>
          </div>

          <div className={styles.widgetContent}>
            <FaUsers className={styles.widgetIcon} />
            <span>{committee?.peopleDetails?.length}</span>
          </div>

          <div className={styles.widgetDetails}>
            {committee.peopleDetails
              .slice(0, showMoreMembers ? committee.peopleDetails.length : MAX_VISIBLE_ITEMS)
              .map(person => (
                <div key={person.id} className={styles.widgetItem}>
                  <div className={styles.profileIcon}>{person.name.charAt(0)}</div>
                  <div className={styles.itemDetails}>
                    <span className={styles.itemName}>{person.name}</span>
                    <span className={styles.itemRole}>{person.role}</span>
                  </div>
                </div>
              ))}
            {committee.peopleDetails.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreMembers(!showMoreMembers)} className={styles.viewMoreButton}>
                {showMoreMembers ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.chartLoggerContainer}>
        <div className={styles.committeeSection}>
          <h2>توزيع المهام</h2>
          <div className={styles.chartContainer}>
            <Pie data={taskDistributionData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>
        <Logger logs={mockLogs} />
      </div>

      <div className={styles.widgetHeader}>
        <h3>نقاشات اللجنة</h3>
      </div>

      <div className={`${styles.dashboardWidget} ${styles.discussionWidget}`} onClick={handleDiscussionClick}>
        <div className={styles.widgetContent}>
          {mockDiscussions.map(discussion => (
            <div key={discussion.id} className={styles.widgetItem}>
              <div className={styles.itemDetails}>
                <span className={styles.itemName}>{discussion.topic}</span>
                <span className={styles.itemAuthor}>{discussion.author}</span>
                <span className={styles.itemMessage}>{discussion.message}</span>
                <span className={styles.itemTime}>{new Date(discussion.time).toLocaleString('ar-EG')}</span>
              </div>
            </div>
          ))}
          <button className={styles.viewMoreButton}>عرض جميع النقاشات</button>
        </div>
      </div>

      <VotingSystem votings={votings} handleVote={handleVote} addNewVoting={addNewVoting} />

      <VotingModal
        isModalOpen={isModalOpen}
        handleSaveVoting={handleSaveVoting}
        handleCancel={handleCancel}
        handleAddOption={handleAddOption}
        newVoting={newVoting}
        newOption={newOption}
        setNewVoting={setNewVoting}
        setNewOption={setNewOption}
      />
    </div>
  );
};

export default CommitteeDetails;
