import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaMapMarkerAlt, FaClipboard, FaStickyNote } from 'react-icons/fa';
import styles from './MeetingDetails.module.scss';
import VotingModal from '../../../components/VotingModal';
import VotingSystem from '../../../components/VotingSystem';

const dummyMeetingData = {
  id: 1,
  name: 'اجتماع تشاوري',
  type: 'استراتيجي',
  committee: 'لجنة الشؤون القانونية',
  time: '2024-09-01T10:00:00',
  location: 'قاعة الاجتماعات 1',
  building: 'المبنى الإداري',
  attendees: ['أحمد علي', 'فاطمة حسن', 'محمد صالح', 'سارة أحمد'],
  agenda: 'مناقشة السياسات الجديدة والخطوات التالية.',
  notes: ['مراجعة السياسات السابقة', 'النظر في مناهج جديدة'],
  status: 'منشور',
};

const MeetingDetails = () => {
  const { id } = useParams();
  const meeting = dummyMeetingData;
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

  return (
    <div className={styles.meetingDetailsPage}>
      <div className={styles.header}>
        <h3>{meeting.name}</h3>
        <p>نوع الاجتماع: {meeting.type}</p>
        <p>اللجنة: {meeting.committee}</p>
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.info}>
          <h3>معلومات الاجتماع</h3>
          <ul>
            <li>
              <FaCalendarAlt /> وقت الاجتماع: {new Date(meeting.time).toLocaleString('ar-EG')}
            </li>
            <li>
              <FaMapMarkerAlt /> الموقع: {meeting.location} - {meeting.building}
            </li>
            <li>
              <FaClipboard /> الحالة: {meeting.status}
            </li>
          </ul>
        </div>

        <div className={styles.attendees}>
          <h3>الحضور</h3>
          <ul>
            {meeting.attendees.map((attendee, index) => (
              <li key={index}>
                <FaUser /> {attendee}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h3>جدول الأعمال</h3>
        <p>{meeting.agenda}</p>
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

      <div className={styles.section}>
        <h3>ملاحظات الاجتماع</h3>
        <ul>
          {meeting.notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MeetingDetails;
