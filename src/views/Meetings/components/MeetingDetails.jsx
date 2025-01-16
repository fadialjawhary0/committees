import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaClipboard,
  FaLink,
  FaUsers,
  FaArrowLeft,
  FaPlus,
  FaPen,
  FaTrash,
} from 'react-icons/fa';
import { IoTime } from 'react-icons/io5';

import styles from './MeetingDetails.module.scss';
import VotingModal from '../../../components/VotingModal';
import VotingSystem from '../../../components/VotingSystem';
import { Modal } from '@mui/material';
import { MeetingServices } from '../services/meetings.service';
import { FormatDateToArabic, FormatTimeToArabic } from '../../../helpers';
import DeleteModal from '../../../components/DeleteModal';
import { DeleteModalConstants, MEETING_TASK_STATUS, MeetingStatus, ToastMessage } from '../../../constants';
import apiService from '../../../services/axiosApi.service';
import { useToast } from '../../../context';

const MeetingDetails = () => {
  const { showToast } = useToast();

  const navigate = useNavigate();
  const { id } = useParams();

  const [votings, setVotings] = useState([]);
  const [newVoting, setNewVoting] = useState({ question: '', options: [] });
  const [newOption, setNewOption] = useState('');

  const [meetingDetails, setMeetingDetails] = useState({});
  console.log('🚀 ~ MeetingDetails ~ meetingDetails:', meetingDetails);
  const [fetchedData, setFetchedData] = useState({
    LocationTypes: [],
    Buildings: [],
    Rooms: [],
    MeetingMembers: [],
    Agendas: [],
    Tasks: [],
    MeetingTypes: [],
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState({ deleteMeeting: false, vote: false, task: false });
  const [task, setTask] = useState({
    taskName: '',
    assignedTo: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meetingData = await apiService.getById('GetMeeting', id);
        const locationTypes = await apiService.getAll('GetAllLocation');
        const buildings = await apiService.getAll('GetAllBuildings');
        const rooms = await apiService.getAll('GetAllRoom');
        const meetingMembers = await apiService.getById('GetAllMeetingMemberByMeetingID', id);
        const agendas = await apiService.getById('GetAgendaByMeeting', id);
        const meetingTypes = await apiService.getAll('GetAllMeetingType');
        const tasks = await apiService.getAll(`GetAllTaskByMeetingId/${id}`);

        setMeetingDetails(meetingData);
        setFetchedData(prev => ({
          ...prev,
          LocationTypes: locationTypes,
          Buildings: buildings,
          Rooms: rooms,
          MeetingMembers: meetingMembers,
          Agendas: agendas,
          MeetingTypes: meetingTypes,
          Tasks: tasks,
        }));
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [task]);

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
    setIsModalOpen({ ...isModalOpen, vote: true });
    setNewVoting({ question: '', options: [] });
  };

  const handleSaveVoting = () => {
    if (newVoting.question.trim() === '' || newVoting.options.length === 0) {
      alert('Please enter a question and at least one option.');
      return;
    }
    setVotings([...votings, { id: votings.length + 1, ...newVoting }]);
    setIsModalOpen({ ...isModalOpen, vote: false });
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
    setIsModalOpen({ ...isModalOpen, vote: false });
  };

  const handleVote = (votingId, optionId) => {
    setVotings(prev =>
      prev?.map(voting =>
        voting.id === votingId
          ? {
              ...voting,
              options: voting.options?.map(option => (option.id === optionId ? { ...option, votes: option.votes + 1 } : option)),
            }
          : voting,
      ),
    );
  };

  const handleAddTask = async () => {
    if (!task.taskName.trim() || !task.assignedTo.trim()) {
      showToast(ToastMessage?.MeetingTaskAssignFail, 'error');
      return;
    }
    try {
      await MeetingServices.addTask({
        MeetingID: parseInt(id),
        NameArabic: task?.taskName,
        NameEnglish: task?.taskName,
        MemberID: parseInt(task?.assignedTo),
        StatusID: MEETING_TASK_STATUS?.NOT_STARTED,
        CreatedAt: new Date().toISOString(),
      });
      setIsModalOpen({ ...isModalOpen, task: false });
      setTask({ taskName: '', assignedTo: '' });
      showToast(ToastMessage?.MeetingTaskAssignSuccess, 'success');
    } catch (error) {
      console.error('Error creating task:', error);
      showToast(ToastMessage?.SomethingWentWrong, 'error');
    }
  };

  const handleDeleteMeeting = async meetingId => {
    try {
      await apiService.update('UpdateMeeting', {
        ID: meetingId,
        CommitteeID: parseInt(localStorage.getItem('selectedCommitteeID')),
        ArabicName: meetingDetails?.ArabicName,
        EnglishName: meetingDetails?.EnglishName,
        MeetingTypeID: parseInt(meetingDetails?.MeetingTypeID),
        MeetingLocationID: parseInt(meetingDetails?.MeetingLocationID),
        BuildingID: parseInt(meetingDetails?.BuildingID),
        RoomID: parseInt(meetingDetails?.RoomID),
        StatusId: parseInt(MeetingStatus?.Cancelled),
        Notes: meetingDetails?.Notes,
        Link: meetingDetails?.Link,
        Date: meetingDetails?.Date,
        StartTime: meetingDetails?.StartTime,
        EndTime: meetingDetails?.EndTime,
      });
      setIsModalOpen({ ...isModalOpen, deleteMeeting: false });
      window.history.back();
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const handleEditMeeting = id => {
    navigate(`/meetings/edit/${id}`);
  };

  return (
    <div className={styles.meetingDetailsPage}>
      {loading ? (
        <h6>Loading...</h6>
      ) : (
        <>
          {/********************** Page Header ************************/}
          <div className={styles.pageHeader}>
            <div className={styles.headerActions}>
              <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />

              <button
                className={styles.deleteButton}
                onClick={() => {
                  setIsModalOpen({ ...isModalOpen, deleteMeeting: true });
                }}>
                حذف <FaTrash />
              </button>

              <button className={styles.editButton} onClick={() => handleEditMeeting(id)}>
                تعديل <FaPen />
              </button>
            </div>
            <h4>{meetingDetails?.ArabicName}</h4>
          </div>

          <div className={styles.sectionsContainer}>
            {/********************** Meeting Details ************************/}
            <div className={styles.info}>
              <h5 className={styles.sectionHeaderTitle}>معلومات الاجتماع</h5>
              <ul>
                <li>
                  <FaCalendarAlt /> تاريخ الإجتماع: <p>{FormatDateToArabic(meetingDetails?.Date)}</p>
                </li>

                <li>
                  <IoTime /> وقت الاجتماع: {FormatTimeToArabic(meetingDetails?.StartTime)} -{' '}
                  {FormatTimeToArabic(meetingDetails?.EndTime)}
                </li>

                <li>
                  <FaClipboard /> نوع الاجتماع:{' '}
                  {fetchedData?.MeetingTypes.filter(m => m.ID === meetingDetails?.MeetingTypeID)[0]?.ArabicName}
                </li>

                {meetingDetails?.MeetingLocationID === 1 ? (
                  <li>
                    <FaMapMarkerAlt /> الموقع:{' '}
                    {fetchedData?.Buildings.filter(b => b.ID === meetingDetails?.BuildingID)?.[0]?.ArabicName} -{' '}
                    {fetchedData?.Rooms.filter(r => r.ID === meetingDetails?.RoomID)?.[0]?.ArabicName}
                  </li>
                ) : (
                  <li>
                    <FaLink />
                    <a href={meetingDetails?.Link} target='_blank' rel='noreferrer'>
                      {meetingDetails?.Link}
                      <span> :الرابط</span>
                    </a>
                  </li>
                )}

                <li>
                  <FaUsers /> اللجنة: {localStorage.getItem('selectedCommitteeName')}
                </li>
              </ul>
            </div>

            {/********************** Meeting Members ************************/}
            <div className={styles.attendees}>
              <div className={styles.attendeesHeader}>
                <h5 className={styles.sectionHeaderTitle}>
                  المدعوون <span className={styles.numberOfItems}>({fetchedData?.MeetingMembers?.length})</span>
                </h5>
              </div>
              <ul className={styles.attendeesList}>
                {!fetchedData?.MeetingMembers?.length ? (
                  <h6 className={styles.noData}>لا يوجد مدعوون حاليًا.</h6>
                ) : (
                  <>
                    {fetchedData?.MeetingMembers?.map(attendee => (
                      <li key={attendee?.ID} className={styles.attendeeItem}>
                        <FaUser className={styles.attendeeIcon} /> {attendee?.FullName}
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className={styles.sectionsContainer}>
            {/********************** Agenda ************************/}
            <div className={`${styles.section} ${styles.agenda}`}>
              <h5 className={styles.sectionHeaderTitle}>جدول الأعمال</h5>
              {!fetchedData?.Agendas?.length ? (
                <h6 className={styles.noData}>لا يوجد جدول أعمال حالي.</h6>
              ) : (
                <ul className={styles.agendaList}>
                  {fetchedData?.Agendas?.map(agenda => (
                    <li key={agenda?.ID}>{agenda?.Sentence}</li>
                  ))}
                </ul>
              )}
            </div>

            {/********************** Tasks ************************/}
            <div className={`${styles.tasks}`}>
              <div className={`${styles.sectionHeaderTitle} ${styles.flexSpaceBetween}`}>
                <h5>
                  مهام الاجتماع <span className={styles.numberOfItems}>({fetchedData?.Tasks?.length})</span>
                </h5>
                <button
                  type='button'
                  className={styles.sharedButton}
                  onClick={() => setIsModalOpen({ ...isModalOpen, task: true })}>
                  <FaPlus /> إضافة مهمة جديدة
                </button>
              </div>
              {!fetchedData?.Tasks?.length ? (
                <h6 className={styles.noData}>لا يوجد مهمات حالية.</h6>
              ) : (
                <div className={`${styles.tableContainer} ${styles.tasksTable}`}>
                  <table>
                    <thead>
                      <tr>
                        <th>المهمة</th>
                        <th>المكلف إليه</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetchedData?.Tasks?.map(task => (
                        <tr key={task?.ID}>
                          <td>{task?.NameArabic}</td>
                          <td>{task?.FullName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/********************** Voting System ************************/}
          <VotingSystem votings={votings} handleVote={handleVote} addNewVoting={addNewVoting} />
          <VotingModal
            isModalOpen={isModalOpen.vote}
            handleSaveVoting={handleSaveVoting}
            handleCancel={handleCancel}
            handleAddOption={handleAddOption}
            newVoting={newVoting}
            newOption={newOption}
            setNewVoting={setNewVoting}
            setNewOption={setNewOption}
          />

          {/********************** Meeting Notes ************************/}
          <div className={styles.section}>
            <h5 className={styles.sectionHeaderTitle}>ملاحظات الاجتماع</h5>
            {meetingDetails?.Notes?.length === 0 ? (
              <h6 className={styles.noData}>لا يوجد ملاحظات حاليًا.</h6>
            ) : (
              <p>{meetingDetails?.Notes}</p>
            )}
          </div>

          {/********************** Add New Task Modal ************************/}
          <Modal
            open={isModalOpen.task}
            onClose={() => setIsModalOpen({ ...isModalOpen, task: false })}
            className={styles.modalContainer}
            aria-labelledby='task-modal-title'
            aria-describedby='task-modal-description'>
            <div className={styles.modal}>
              <h4 id='task-modal-title'>إضافة مهمة جديدة</h4>
              <form>
                <label>
                  اسم المهمة:
                  <input type='text' value={task?.taskName} onChange={e => setTask({ ...task, taskName: e.target.value })} />
                </label>
                <label>
                  مكلف إلى:
                  <select value={task?.assignedTo} onChange={e => setTask({ ...task, assignedTo: e.target.value })}>
                    <option value=''>اختر شخصًا</option>
                    {fetchedData?.MeetingMembers?.length > 0 ? (
                      fetchedData?.MeetingMembers?.map(attendee => (
                        <option key={attendee?.MemberID} value={attendee?.MemberID}>
                          {attendee?.FullName}
                        </option>
                      ))
                    ) : (
                      <option value='' disabled>
                        لا يوجد أعضاء
                      </option>
                    )}
                  </select>
                </label>
                <div className={styles.formButtonsContainer}>
                  <button type='button' onClick={handleAddTask} className={styles.saveButton}>
                    حفظ
                  </button>
                  <button
                    type='button'
                    onClick={() => setIsModalOpen({ ...isModalOpen, task: false })}
                    className={styles.cancelButton}>
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </Modal>

          {/********************** Delete Meeting Modal ************************/}
          {isModalOpen.deleteMeeting && (
            <DeleteModal
              isOpen={isModalOpen.deleteMeeting}
              onClose={() => {
                setIsModalOpen({ ...isModalOpen, deleteMeeting: false });
              }}
              title={DeleteModalConstants?.MEETING_TITLE}
              description={DeleteModalConstants?.MEETING_DESCRIPTION}
              onDelete={() => handleDeleteMeeting(id)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MeetingDetails;
