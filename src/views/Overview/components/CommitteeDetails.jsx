import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaUsers,
  FaCalendarAlt,
  FaPlus,
  FaArrowLeft,
  FaTimes,
  FaSave,
  FaTrash,
  FaPen,
  FaFileAlt,
  FaDownload,
} from 'react-icons/fa';
import styles from './CommitteeDetails.module.scss';
import Logger from './Logger';
import VotingModal from '../../../components/VotingModal';
import VotingSystem from '../../../components/VotingSystem';
import { Checkbox, Modal } from '@mui/material';
import Discussions from './Discussions';
import { CommitteeMembersServices, CommitteeServices } from '../services/committees.service';
import { FormatDateToArabic, FormatDateToArabicShort, FormatTimeToArabic, TruncateFileName } from '../../../helpers';
import DeleteModal from '../../../components/DeleteModal';
import { DeleteModalConstants, MeetingStatus, MIME_TYPE } from '../../../constants';
import { MeetingServices } from '../../Meetings/services/meetings.service';
import apiService from '../../../services/axiosApi.service';
import { useFileUpload } from '../../../hooks/useFileUpload';
import CommitteeTasks from './CommitteeTasks';
import MeetingTasks from './MeetingTasks';

const mockLogs = [
  { id: 1, user: { name: 'Ahmed Ali' }, action: 'أضاف اجتماع جديد', time: '2024-09-01T10:00:00' },
  { id: 2, user: { name: 'Fatima Hassan' }, action: 'رفع ملف مستندات', time: '2024-09-02T12:30:00' },
  { id: 3, user: { name: 'Sara Ahmad' }, action: 'حدث بيانات اللجنة', time: '2024-09-03T09:15:00' },
  { id: 4, user: { name: 'Mohammed Saleh' }, action: 'أضاف عضو جديد', time: '2024-09-04T14:45:00' },
  { id: 5, user: { name: 'Khaled Youssef' }, action: 'حذف ملف', time: '2024-09-05T16:20:00' },
];

const CommitteeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleFileChange } = useFileUpload();

  const [loading, setLoading] = useState(true);

  const [showMoreMembers, setShowMoreMembers] = useState(false);
  const [showMoreMeetings, setShowMoreMeetings] = useState(false);
  const [showMoreFiles, setShowMoreFiles] = useState(false);

  const [newVoting, setNewVoting] = useState({ question: '', options: [] });
  const [newOption, setNewOption] = useState('');

  const [votings, setVotings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState({
    user: false,
    voting: false,
    deleteMeeting: false,
    deleteCommittee: false,
  });

  const [fetchedCommitteeData, setFetchedCommitteeData] = useState({
    Committee: {},
    Members: [],
    PreviousMeetings: [],
    UpcomingMeetings: [],
    RelatedAttachments: [],
  });

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const MAX_VISIBLE_ITEMS = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const committeeDetails = await apiService.getById('GetCommittee', localStorage.getItem('selectedCommitteeID'));

        setFetchedCommitteeData({
          Committee: committeeDetails?.CommitteeDetails,
          Members: committeeDetails?.Members,
          PreviousMeetings: committeeDetails?.Meetings.filter(pm => pm?.StatusId === MeetingStatus?.Completed),
          UpcomingMeetings: committeeDetails?.Meetings.filter(pm => pm?.StatusId === MeetingStatus?.Upcoming),
          RelatedAttachments: committeeDetails?.RelatedAttachments,
        });
        
        localStorage.setItem('MemberID',fetchedCommitteeData?.Members?.find(x=>x?.UserID ===6)?.ID)
        // const fetchedRoles = await MemberRolesServices.getAll();
        // setRoles(fetchedRoles);
      } catch {
        console.log('error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [loading, id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const systemUsers = await apiService.getAll('GetAllSystemUser');
        const filteredUsers = systemUsers.filter(
          user => !fetchedCommitteeData?.Members.some(member => member?.UserID === user?.ID),
        );

        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [fetchedCommitteeData.Members]);

  const handleAddUser = async () => {
    try {
      for (const userId of selectedUsers) {
        const payload = {
          CommitteeID: parseInt(id),
          UserID: userId,
          CommitteeHead: parseInt(selectedRoles[userId]) === 1,
        };

        await CommitteeMembersServices.create(payload);

        const addedUser = users.find(user => user.ID === userId);
        const roleArabicName = roles.find(role => role.ID === parseInt(selectedRoles[userId]))?.NameArabic;

        setFetchedCommitteeData(prevData => ({
          ...prevData,
          Members: [
            ...prevData.Members,
            {
              ID: addedUser.ID,
              UserFullName: addedUser.UserFullName,
              RoleArabicName: roleArabicName,
              UserID: addedUser.ID,
            },
          ],
        }));

        setUsers(prevUsers => prevUsers.filter(user => user.ID !== userId));
      }

      setSelectedUsers([]);
      setSelectedRoles({});
      toggleUserModal();
    } catch (error) {
      console.error('Error adding users to the committee:', error);
    }
  };

  const handleCheckboxChange = userId => {
    setSelectedUsers(prevSelected => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const handleRoleChange = (userId, roleId) => {
    setSelectedRoles(prevRoles => ({
      ...prevRoles,
      [userId]: roleId,
    }));
  };

  // Changes / Deletion
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

  // Changes / Deletion
  const addNewVoting = () => {
    setIsModalOpen({ ...isModalOpen, voting: true });
    setNewVoting({ question: '', options: [] });
  };

  // Changes / Deletion
  const handleSaveVoting = () => {
    if (newVoting.question.trim() === '' || newVoting.options.length === 0) {
      alert('Please enter a question and at least one option.');
      return;
    }
    setVotings([...votings, { id: votings.length + 1, ...newVoting }]);
    setIsModalOpen({ ...isModalOpen, voting: false });
  };

  // Changes / Deletion
  const handleAddOption = () => {
    if (newOption.trim() !== '') {
      setNewVoting(prev => ({
        ...prev,
        options: [...prev.options, { id: prev.options.length + 1, text: newOption, votes: 0 }],
      }));
      setNewOption('');
    }
  };

  // Changes / Deletion
  const handleCancel = () => {
    setIsModalOpen({ ...isModalOpen, voting: false });
  };

  // Changes / Deletion
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

  const toggleUserModal = () => {
    setIsModalOpen({ ...isModalOpen, user: !isModalOpen.user });
    setSelectedUsers([]);
    setSelectedRoles({});
  };

  const toggleDeleteCommitteeModal = () => {
    setIsModalOpen({ ...isModalOpen, deleteCommittee: !isModalOpen.deleteCommittee });
  };

  const handleDeleteMeeting = async meetingId => {
    try {
      await MeetingServices.commonDeleteMeetingWithAgendas(meetingId);

      setFetchedCommitteeData(prevData => ({
        ...prevData,
        UpcomingMeetings: prevData.UpcomingMeetings.filter(meeting => meeting.ID !== meetingId),
      }));

      setIsModalOpen({ ...isModalOpen, deleteMeeting: false });
      setSelectedMeetingId(null);
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const handleDeleteCommittee = async () => {
    try {
      await CommitteeServices.delete(id);
      navigate('/overview');
    } catch (error) {
      console.error('Error deleting committee:', error);
    }
  };

  const handleEditCommittee = () => {
    const payload = {
      CommitteeName: fetchedCommitteeData?.Committee?.ArabicName,
      Number: fetchedCommitteeData?.Committee?.Number,
      ShortName: fetchedCommitteeData?.Committee?.ShortName,
      MeetingTemplateName: fetchedCommitteeData?.Committee?.MeetingTemplateName,
      FormationDate: fetchedCommitteeData?.Committee?.FormationDate,
      StartDate: fetchedCommitteeData?.Committee?.StartDate,
      EndDate: fetchedCommitteeData?.Committee?.EndDate,
      CategoryID: fetchedCommitteeData?.Committee?.CategoryID,
      DepID: fetchedCommitteeData?.Committee?.DepID,
      Members: fetchedCommitteeData?.Members,
      SystemUsers: users,
      Roles: roles,
    };

    navigate(`/overview/committee/edit/${id}`, { state: { payload } });
  };

  if (!fetchedCommitteeData) return <p>Loading...</p>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />
          <button
            className={styles.deleteButton}
            onClick={() => {
              setIsModalOpen({ ...isModalOpen, deleteCommittee: true });
            }}>
            حذف <FaTrash />
          </button>

          <button className={styles.editButton} onClick={handleEditCommittee}>
            تعديل <FaPen />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignContent: 'center', justifyContent: 'center' }}>
          <p className={styles.committeeDate}>
            تاريخ تشكيل اللجنة: {FormatDateToArabicShort(fetchedCommitteeData?.Committee?.FormationDate)}
          </p>
          <h4>{fetchedCommitteeData?.Committee?.ArabicName}</h4>
        </div>
      </div>

      {/************* Page Header 4 Cards ****************/}
      <div className={styles.committeeDashboard}>
        {/******************** Attachments **********************/}
        <div className={styles.dashboardWidget}>
          <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
            <h5>المرفقات</h5>
            <label className={styles.button}>
              <FaPlus className={styles.addIcon} />
              <p>رفع</p>
              <input
                type='file'
                multiple
                accept='.pdf,.jpg,.jpeg,.png,.docx,.txt'
                style={{ display: 'none' }}
                onChange={e => handleFileChange(e, 'AddRelatedAttachment')}
              />
            </label>
          </div>

          <div className={styles.widgetContent}>
            <FaFileAlt className={styles.widgetIcon} />
            <span>{fetchedCommitteeData?.RelatedAttachments?.length || 0}</span>
          </div>

          <div className={styles.widgetDetails}>
            {fetchedCommitteeData?.RelatedAttachments?.slice(
              0,
              showMoreFiles ? fetchedCommitteeData?.RelatedAttachments?.length : MAX_VISIBLE_ITEMS,
            )?.map(file => (
              <div key={file.ID} className={`${styles.widgetItem} ${styles.fileItem}`}>
                <span className={styles.fileName}>{TruncateFileName(file?.DocumentName)}</span>
                <a
                  href={`data:${MIME_TYPE};base64,${file?.DocumentContent}`}
                  download={file?.DocumentName}
                  className={styles.downloadButton}>
                  <FaDownload />
                </a>
              </div>
            ))}

            {fetchedCommitteeData?.RelatedAttachments?.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreFiles(!showMoreFiles)} className={styles.viewMoreButton}>
                {showMoreFiles ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>

        {/******************** Upcoming Meetings **********************/}
        <div className={styles.dashboardWidget}>
          <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
            <h5>الاجتماعات القادمة</h5>
            <button
              className={styles.button}
              onClick={() =>
                navigate('/meetings/create', {
                  state: {
                    mode: 'add',
                    committeeId: fetchedCommitteeData?.Committee?.ID,
                    committeeName: fetchedCommitteeData?.Committee?.ArabicName,
                  },
                })
              }>
              <FaPlus className={styles.addIcon} />
              <p>إنشاء</p>
            </button>
          </div>

          <div className={styles.widgetContent}>
            <FaCalendarAlt className={styles.widgetIcon} />
            <span>{fetchedCommitteeData?.UpcomingMeetings?.length || 0}</span>
          </div>

          <div className={styles.widgetDetails}>
            {fetchedCommitteeData?.UpcomingMeetings?.length ? (
              fetchedCommitteeData?.UpcomingMeetings.slice(
                0,
                showMoreMeetings ? fetchedCommitteeData?.UpcomingMeetings.length : MAX_VISIBLE_ITEMS,
              )?.map(meeting => (
                <div key={meeting.ID} className={`${styles.meetingItem}`} onClick={() => navigate(`/meetings/${meeting?.ID}`)}>
                  <div className={styles.meetingDetails}>
                    <p className={styles.meetingName}>{meeting?.ArabicName}</p>
                    <div className={styles.meetingActions}>
                      <button
                        className={styles.editButton}
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/meetings/edit/${meeting?.ID}`);
                        }}>
                        <FaPen />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedMeetingId(meeting.ID);
                          setIsModalOpen({ ...isModalOpen, deleteMeeting: true });
                        }}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className={styles.meetingDateTime}>
                    <span>{FormatDateToArabic(meeting?.Date)}</span>
                    <span>
                      {FormatTimeToArabic(meeting?.StartTime)} - {FormatTimeToArabic(meeting?.EndTime)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noData}>لا يوجد اجتماعات قادمة</p>
            )}

            {fetchedCommitteeData?.UpcomingMeetings?.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreMeetings(!showMoreMeetings)} className={styles.viewMoreButton}>
                {showMoreMeetings ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>

        {/******************** Past Meetings **********************/}
        <div className={styles.dashboardWidget}>
          <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
            <h5>الاجتماعات المنعقدة</h5>
          </div>
          <div className={styles.widgetContent}>
            <FaCalendarAlt className={styles.widgetIcon} />
            <span>{fetchedCommitteeData?.PreviousMeetings?.length || 0}</span>
          </div>
          <div className={styles.widgetDetails}>
            {fetchedCommitteeData?.PreviousMeetings?.length ? (
              fetchedCommitteeData?.PreviousMeetings?.slice(
                0,
                showMoreMeetings ? fetchedCommitteeData?.PreviousMeetings.length : MAX_VISIBLE_ITEMS,
              )?.map(meeting => (
                <div key={meeting.ID} className={`${styles.meetingItem}`}>
                  <div className={styles.meetingDetails}>
                    <p className={styles.meetingName}>{meeting?.ArabicName}</p>
                  </div>
                  <div className={styles.meetingDateTime}>
                    <span>{FormatDateToArabic(meeting?.Date)}</span>
                    <span>
                      {FormatTimeToArabic(meeting?.StartTime)} - {FormatTimeToArabic(meeting?.EndTime)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noData}>لا يوجد اجتماعات سابقة</p>
            )}

            {fetchedCommitteeData?.PreviousMeetings?.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreMeetings(!showMoreMeetings)} className={styles.viewMoreButton}>
                {showMoreMeetings ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>

        {/******************** Committee Members **********************/}
        <div className={styles.dashboardWidget}>
          <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
            <h5>الأعضاء</h5>
            <button className={styles.button} onClick={toggleUserModal}>
              <FaPlus className={styles.addIcon} />
              <p>إضافة</p>
            </button>
          </div>

          <div className={styles.widgetContent}>
            <FaUsers className={styles.widgetIcon} />
            <span>{fetchedCommitteeData?.Members?.length || 0}</span>
          </div>

          <div className={styles.widgetDetails}>
            {!loading && (
              <>
                {fetchedCommitteeData?.Members?.slice(
                  0,
                  showMoreMembers ? fetchedCommitteeData?.Members?.length : MAX_VISIBLE_ITEMS,
                )?.map(person => (
                  <div key={person.ID} className={styles.widgetItem}>
                    <div className={styles.profileIcon}>{person?.FullName?.charAt(0)}</div>
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{person?.FullName}</span>
                      <span className={styles.itemRole}>{person?.RoleName}</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {fetchedCommitteeData?.Members?.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreMembers(!showMoreMembers)} className={styles.viewMoreButton}>
                {showMoreMembers ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={styles.gridContainer}>
        <MeetingTasks />
        <CommitteeTasks />
      </div>

      <div className={styles.gridContainer}>
        <Discussions id={id} />
        <Logger logs={mockLogs} />
      </div>

      {/************* Add User To Committee Model ****************/}
      {isModalOpen.user && (
        <Modal open={isModalOpen.user} onClose={toggleUserModal} className={styles.usersModal}>
          <div className={styles.modal}>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>الدور</th>
                    <th>الاسم</th>
                    <th>اضافة</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map(person => (
                    <tr key={person?.ID}>
                      <td>
                        <select
                          value={selectedRoles?.[person.ID] || ''}
                          onChange={e => handleRoleChange(person?.ID, e.target.value)}>
                          <option value='' disabled>
                            اختر دور
                          </option>
                          {roles?.map(role => (
                            <option key={role.ID} value={role?.ID}>
                              {role?.NameArabic}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{person?.UserFullName}</td>
                      <td>
                        <Checkbox onChange={() => handleCheckboxChange(person?.ID)} checked={selectedUsers.includes(person.ID)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={toggleUserModal}>
                <FaTimes />
                <p>إلغاء</p>
              </button>
              <button className={styles.saveButton} onClick={handleAddUser}>
                <FaSave />
                <p>حفظ</p>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isModalOpen.deleteMeeting && (
        <DeleteModal
          isOpen={isModalOpen.deleteMeeting}
          onClose={() => {
            setSelectedMeetingId(null);
            setIsModalOpen({ ...isModalOpen, deleteMeeting: false });
          }}
          title={DeleteModalConstants?.MEETING_TITLE}
          description={DeleteModalConstants?.MEETING_DESCRIPTION}
          onDelete={() => handleDeleteMeeting(selectedMeetingId)}
        />
      )}

      <VotingSystem votings={votings} handleVote={handleVote} addNewVoting={addNewVoting} />

      <VotingModal
        isModalOpen={isModalOpen.voting}
        handleSaveVoting={handleSaveVoting}
        handleCancel={handleCancel}
        handleAddOption={handleAddOption}
        newVoting={newVoting}
        newOption={newOption}
        setNewVoting={setNewVoting}
        setNewOption={setNewOption}
      />

      <DeleteModal
        isOpen={isModalOpen.deleteCommittee}
        onClose={toggleDeleteCommitteeModal}
        onDelete={handleDeleteCommittee}
        title={DeleteModalConstants?.COMMITTEE_TITLE}
        description={DeleteModalConstants?.COMMITTEE_DESCRIPTION}
      />
    </div>
  );
};

export default CommitteeDetails;
