import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaMapMarkerAlt, FaClipboard, FaLink, FaUsers, FaArrowLeft, FaPlus } from 'react-icons/fa';
import styles from './MeetingDetails.module.scss';
import VotingModal from '../../../components/VotingModal';
import VotingSystem from '../../../components/VotingSystem';
import { Modal } from '@mui/material';

const dummyMeetingData = {
  ID: 1,
  ArabicName: 'اجتماع تشاوري',
  type: 'استراتيجي',
  CommitteeID: 'الشؤون القانونية',
  Date: '2024-09-01',
  StartTime: '10:00:00',
  EndTime: '12:00:00',
  MeetingType: 'فعلي',
  BuldingID: 'المبنى الإداري',
  RoomID: 'قاعة الاجتماعات 1',
  MeetingLink: 'https://meet.google.com/abc-xyz',
  attendees: ['أحمد علي', 'فاطمة حسن', 'محمد صالح', 'سارة أحمد'],
  agenda: 'مناقشة السياسات الجديدة والخطوات التالية.',
  notes: ['مراجعة السياسات السابقة', 'النظر في مناهج جديدة'],
};

const MeetingDetails = () => {
  // const { id } = useParams();
  const meeting = dummyMeetingData;
  const [votings, setVotings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVoting, setNewVoting] = useState({ question: '', options: [] });
  const [newOption, setNewOption] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', assignedTo: '' });

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

  const handleAddTask = () => {
    if (!newTask.name.trim() || !newTask.assignedTo.trim()) {
      alert('يرجى إدخال اسم المهمة وتحديد الشخص المكلف.');
      return;
    }
    setTasks([...tasks, { id: tasks.length + 1, ...newTask }]);
    setIsTaskModalOpen(false);
    setNewTask({ name: '', assignedTo: '' });
  };

  return (
    <div className={styles.meetingDetailsPage}>
      <div className={styles.pageHeader}>
        <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />

        <h4>{meeting.ArabicName}</h4>
      </div>

      <div className={styles.sectionsContainer}>
        <div className={styles.info}>
          <h5 className={styles.sectionHeaderTitle}>معلومات الاجتماع</h5>
          <ul>
            <li>
              <FaCalendarAlt /> وقت الإجتماع: <p>{new Date(meeting.Date).toLocaleDateString('ar-EG')}</p> - {meeting.StartTime} -{' '}
              {meeting.EndTime}
            </li>

            <li>
              <FaClipboard /> نوع الاجتماع: {meeting.MeetingType}
            </li>

            {meeting.MeetingType === 'فعلي' ? (
              <li>
                <FaMapMarkerAlt /> الموقع: {meeting.BuldingID} - {meeting.RoomID}
              </li>
            ) : (
              <li>
                <FaLink />
                <a href={meeting.MeetingLink} target='_blank' rel='noreferrer'>
                  {meeting.MeetingLink}
                </a>
              </li>
            )}

            <li>
              <FaUsers /> اللجنة: {meeting.CommitteeID}
            </li>
          </ul>
        </div>

        <div className={styles.attendees}>
          <div className={styles.attendeesHeader}>
            <h5 className={styles.sectionHeaderTitle}>
              المدعوون <span className={styles.numberOfItems}>({meeting.attendees.length})</span>
            </h5>
          </div>
          <ul className={styles.attendeesList}>
            {meeting.attendees.map((attendee, index) => (
              <li key={index} className={styles.attendeeItem}>
                <FaUser className={styles.attendeeIcon} /> {attendee}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.sectionsContainer}>
        <div className={`${styles.section} ${styles.agenda}`}>
          <h5 className={styles.sectionHeaderTitle}>جدول الأعمال</h5>
          <p>{meeting.agenda}</p>
        </div>

        <div className={`${styles.tasks}`}>
          <div className={`${styles.sectionHeaderTitle} ${styles.flexSpaceBetween}`}>
            <h5>
              مهام الاجتماع <span className={styles.numberOfItems}>({tasks.length})</span>
            </h5>
            <button type='button' className={styles.sharedButton} onClick={() => setIsTaskModalOpen(true)}>
              <FaPlus /> إضافة مهمة جديدة
            </button>
          </div>
          {tasks.length === 0 ? (
            <h6 className={styles.noData}>لا يوجد مهمات حالية.</h6>
          ) : (
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>المهمة</th>
                    <th>المكلف إليه</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr>
                      <td>{task.name}</td>
                      <td>{task.assignedTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

      <div className={styles.section}>
        <h5 className={styles.sectionHeaderTitle}>ملاحظات الاجتماع</h5>
        <ul>
          {meeting.notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>

      <Modal open={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} className={styles.modalContainer}>
        <div className={styles.modal}>
          <h4>إضافة مهمة جديدة</h4>
          <form>
            <label>
              اسم المهمة:
              <input type='text' value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} />
            </label>
            <label>
              مكلف إلى:
              <select value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}>
                <option value=''>اختر شخصًا</option>
                {meeting.attendees.map((attendee, index) => (
                  <option key={index} value={attendee}>
                    {attendee}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.formButtonsContainer}>
              <button type='button' onClick={handleAddTask} className={styles.saveButton}>
                حفظ
              </button>
              <button type='button' onClick={() => setIsTaskModalOpen(false)} className={styles.cancelButton}>
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default MeetingDetails;
