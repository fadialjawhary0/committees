// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { FaUsers, FaCalendarAlt, FaFileAlt, FaPlus, FaArrowLeft, FaTimes, FaSave } from 'react-icons/fa';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
// import styles from './CommitteeDetails.module.scss';
// import { CommitteesData } from '../../../constants';
// import Logger from './Logger';
// import VotingModal from '../../../components/VotingModal';
// import VotingSystem from '../../../components/VotingSystem';
// import { Checkbox, Modal } from '@mui/material';
// import Discussions from './Discussions';
// import { CommitteeMembersServices, CommitteeServices } from '../services/committees.service';
// import { MemberServices } from '../../Members/services/member.service';

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// const peopleData = [
//   { id: 1, name: 'Ahmed Ali' },
//   { id: 2, name: 'Fatima Hassan' },
//   { id: 3, name: 'Mohammed Saleh' },
//   { id: 4, name: 'Sara Ahmad' },
//   { id: 5, name: 'Khaled Youssef' },
//   { id: 6, name: 'Amal Nasser' },
//   { id: 7, name: 'Rania Omar' },
//   { id: 8, name: 'Yousef Al-Qassim' },
//   { id: 9, name: 'Hiba Mustafa' },
//   { id: 10, name: 'Omar Hussein' },
//   { id: 11, name: 'Nour Al-Din' },
//   { id: 12, name: 'Ayman Ziad' },
//   { id: 13, name: 'Lina Mahmoud' },
//   { id: 14, name: 'Rami Ibrahim' },
//   { id: 15, name: 'Fadi Hassan' },
//   { id: 16, name: 'Maha Khalil' },
//   { id: 17, name: 'Alaa Sami' },
//   { id: 18, name: 'Hassan Younes' },
//   { id: 19, name: 'Dina Adel' },
//   { id: 20, name: 'Bashar Al-Sayed' },
//   { id: 21, name: 'Sahar Ramzi' },
//   { id: 22, name: 'Nasser Fouad' },
//   { id: 23, name: 'Hana Saleh' },
//   { id: 24, name: 'Ayman Hassan' },
//   { id: 25, name: 'Laila Mahmoud' },
// ];

// const meetingGoalsData = [
//   {
//     id: 1,
//     name: 'اجتماع الميزانية',
//     tasks: ['إعداد تقرير النفقات', 'إقرار الموازنة', 'توزيع الأولويات', 'تحديد الأهداف الرئيسية'],
//   },
//   {
//     id: 2,
//     name: 'اجتماع الموظفين',
//     tasks: ['إعداد خطة تدريب الموظفين', 'مراجعة تقييمات الأداء', 'وضع خطة الاحتياجات المستقبلية'],
//   },
//   { id: 3, name: 'اجتماع المشاريع', tasks: ['تحديث جدول المشروع', 'التأكد من المخاطر', 'إعادة تخصيص الموارد'] },
//   { id: 4, name: 'اجتماع المشتريات', tasks: ['إعداد قائمة الموردين', 'التفاوض على العقود', 'إقرار الموافقات النهائية'] },
// ];

// const mockLogs = [
//   { id: 1, user: { name: 'Ahmed Ali' }, action: 'أضاف اجتماع جديد', time: '2024-09-01T10:00:00' },
//   { id: 2, user: { name: 'Fatima Hassan' }, action: 'رفع ملف مستندات', time: '2024-09-02T12:30:00' },
//   { id: 3, user: { name: 'Sara Ahmad' }, action: 'حدث بيانات اللجنة', time: '2024-09-03T09:15:00' },
//   { id: 4, user: { name: 'Mohammed Saleh' }, action: 'أضاف عضو جديد', time: '2024-09-04T14:45:00' },
//   { id: 5, user: { name: 'Khaled Youssef' }, action: 'حذف ملف', time: '2024-09-05T16:20:00' },
// ];

// const CommitteeDetails = () => {
//   const navigate = useNavigate();

//   const { id } = useParams();
//   const [committee, setCommittee] = useState(null);
//   const [fetchedCommitteeMembers, setFetchedCommitteeMembers] = useState([]);
//   console.log(fetchedCommitteeMembers);

//   const [loading, setLoading] = useState(true);

//   const [showMoreMembers, setShowMoreMembers] = useState(false);
//   const [showMoreMeetings, setShowMoreMeetings] = useState(false);
//   const [showMoreFiles, setShowMoreFiles] = useState(false);

//   const [votings, setVotings] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newVoting, setNewVoting] = useState({ question: '', options: [] });
//   const [newOption, setNewOption] = useState('');

//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [users, setUsers] = useState([]);
//   const [meetingUsers, setMeetingUsers] = useState([]);
//   const rowsPerPage = 3;

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = meetingGoalsData.slice(indexOfFirstRow, indexOfLastRow);

//   const totalPages = Math.ceil(meetingGoalsData.length / rowsPerPage);

//   const handlePageChange = newPage => {
//     setCurrentPage(newPage);
//   };
//   useEffect(() => {
//     setVotings([
//       {
//         id: 1,
//         question: 'ما هو موعد الاجتماع القادم المفضل؟',
//         options: [
//           { id: 1, text: 'الاثنين', votes: 10 },
//           { id: 2, text: 'الأربعاء', votes: 15 },
//           { id: 3, text: 'الجمعة', votes: 5 },
//         ],
//       },
//     ]);
//   }, []);

//   const addNewVoting = () => {
//     setIsModalOpen(true);
//     setNewVoting({ question: '', options: [] });
//   };

//   const handleSaveVoting = () => {
//     if (newVoting.question.trim() === '' || newVoting.options.length === 0) {
//       alert('Please enter a question and at least one option.');
//       return;
//     }
//     setVotings([...votings, { id: votings.length + 1, ...newVoting }]);
//     setIsModalOpen(false);
//   };

//   const handleAddOption = () => {
//     if (newOption.trim() !== '') {
//       setNewVoting(prev => ({
//         ...prev,
//         options: [...prev.options, { id: prev.options.length + 1, text: newOption, votes: 0 }],
//       }));
//       setNewOption('');
//     }
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   const handleVote = (votingId, optionId) => {
//     setVotings(prev =>
//       prev.map(voting =>
//         voting.id === votingId
//           ? {
//               ...voting,
//               options: voting.options.map(option => (option.id === optionId ? { ...option, votes: option.votes + 1 } : option)),
//             }
//           : voting,
//       ),
//     );
//   };

//   useEffect(() => {
//     const fetchCommitteeDetails = () => {
//       const selectedCommittee = CommitteesData.find(c => c.id === parseInt(id));
//       setCommittee(selectedCommittee);
//       setFetchedCommitteeMembers(selectedCommittee.peopleDetails);
//     };

//     fetchCommitteeDetails();
//   }, [id]);

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       // const [committeeData, usersData, fetchedCommitteeMembers] = await Promise.all([
//   //       //   CommitteeServices.getByID(id),
//   //       //   MemberServices.getAll(),
//   //       //   CommitteeMembersServices.getAll(),
//   //       // ]);
//   //       setCommittee(CommitteesData);
//   //       // setUsers(usersData);

//   //       // const filteredMembers = fetchedCommitteeMembers.filter(member => member.CommitteeID === parseInt(id));
//   //       // const memberDetails = users.filter(user => filteredMembers.some(member => member?.UserID === user?.ID));
//   //       // setFetchedCommitteeMembers(memberDetails);
//   //     } catch {
//   //       console.log('error');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchData();
//   // }, [loading]);

//   if (!committee) return <p>Loading...</p>;

//   const toggleUserModal = () => {
//     setIsUserModalOpen(!isUserModalOpen);
//   };

//   const MAX_VISIBLE_ITEMS = 3;

//   const handleAddMeeting = () => {
//     navigate('/meetings/create', { state: { mode: 'add', committeeId: committee?.ID } });
//   };

//   const handleAddUser = () => {
//     console.log(meetingUsers);
//   };

//   return (
//     <div>
//       <div className={styles.pageHeader}>
//         <div style={{ display: 'flex', gap: '1rem' }}>
//           <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />
//           <p className={styles.committeeDate}>تاريخ الإنشاء: {new Date(committee?.startDate).toLocaleDateString('ar-EG')}</p>
//         </div>
//         <h4>{committee?.name}</h4>
//       </div>

//       <div className={styles.committeeDashboard}>
//         <div className={styles.dashboardWidget}>
//           <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
//             <h5>المرفقات</h5>
//             <button className={styles.button}>
//               <FaPlus className={styles.addIcon} />
//               <p>رفع</p>
//             </button>
//           </div>
//           <div className={styles.widgetContent}>
//             <FaFileAlt className={styles.widgetIcon} />
//             <span>{committee?.files?.length || 0}</span>
//           </div>
//           <div className={styles.widgetDetails}>
//             {committee?.files.slice(0, showMoreFiles ? committee?.files.length : MAX_VISIBLE_ITEMS).map(file => (
//               <div key={file.id} className={styles.widgetItem}>
//                 {file.name}
//               </div>
//             ))}
//             {committee?.files?.length > MAX_VISIBLE_ITEMS && (
//               <button onClick={() => setShowMoreFiles(!showMoreFiles)} className={styles.viewMoreButton}>
//                 {showMoreFiles ? 'عرض أقل' : 'عرض المزيد'}
//               </button>
//             )}
//           </div>
//         </div>

//         <div className={styles.dashboardWidget}>
//           <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
//             <h5>الاجتماعات القادمة</h5>
//             <button className={styles.button} onClick={handleAddMeeting}>
//               <FaPlus className={styles.addIcon} />
//               <p>إنشاء</p>
//             </button>
//           </div>
//           <div className={styles.widgetContent}>
//             <FaCalendarAlt className={styles.widgetIcon} />
//             <span>{committee?.meetingsDetails?.length}</span>
//           </div>
//           <div className={styles.widgetDetails}>
//             {committee?.meetingsDetails
//               .slice(0, showMoreMeetings ? committee?.meetingsDetails.length : MAX_VISIBLE_ITEMS)
//               .map(meeting => (
//                 <div key={meeting.id} className={styles.widgetItem}>
//                   {meeting.name} - {new Date(meeting.time).toLocaleString('ar-EG')}
//                 </div>
//               ))}
//             {committee?.meetingsDetails?.length > MAX_VISIBLE_ITEMS && (
//               <button onClick={() => setShowMoreMeetings(!showMoreMeetings)} className={styles.viewMoreButton}>
//                 {showMoreMeetings ? 'عرض أقل' : 'عرض المزيد'}
//               </button>
//             )}
//           </div>
//         </div>

//         <div className={styles.dashboardWidget}>
//           <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
//             <h5>الاجتماعات المنعقدة</h5>
//           </div>
//           <div className={styles.widgetContent}>
//             <FaCalendarAlt className={styles.widgetIcon} />
//             <span>{committee?.meetingsDetails?.length}</span>
//           </div>
//           <div className={styles.widgetDetails}>
//             {committee?.meetingsDetails
//               .slice(0, showMoreMeetings ? committee?.meetingsDetails.length : MAX_VISIBLE_ITEMS)
//               .map(meeting => (
//                 <div key={meeting.id} className={styles.widgetItem}>
//                   {meeting.name} - {new Date(meeting.time).toLocaleString('ar-EG')}
//                 </div>
//               ))}
//             {committee?.meetingsDetails?.length > MAX_VISIBLE_ITEMS && (
//               <button onClick={() => setShowMoreMeetings(!showMoreMeetings)} className={styles.viewMoreButton}>
//                 {showMoreMeetings ? 'عرض أقل' : 'عرض المزيد'}
//               </button>
//             )}
//           </div>
//         </div>

//         <div className={styles.dashboardWidget}>
//           <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
//             <h5>الأعضاء</h5>
//             <button className={styles.button} onClick={toggleUserModal}>
//               <FaPlus className={styles.addIcon} />
//               <p>إضافة</p>
//             </button>
//           </div>

//           <div className={styles.widgetContent}>
//             <FaUsers className={styles.widgetIcon} />
//             <span>{fetchedCommitteeMembers?.length}</span>
//           </div>

//           <div className={styles.widgetDetails}>
//             {loading && (
//               <>
//                 {fetchedCommitteeMembers
//                   .slice(0, showMoreMembers ? fetchedCommitteeMembers?.length : MAX_VISIBLE_ITEMS)
//                   .map(person => (
//                     <div key={person.id} className={styles.widgetItem}>
//                       <div className={styles.profileIcon}>{person?.name.charAt(0)}</div>
//                       <div className={styles.itemDetails}>
//                         <span className={styles.itemName}>{person?.name}</span>
//                         <span className={styles.itemRole}>{person?.role}</span>
//                       </div>
//                     </div>
//                   ))}
//               </>
//             )}

//             {fetchedCommitteeMembers?.length > MAX_VISIBLE_ITEMS && (
//               <button onClick={() => setShowMoreMembers(!showMoreMembers)} className={styles.viewMoreButton}>
//                 {showMoreMembers ? 'عرض أقل' : 'عرض المزيد'}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className={styles.meetingsMissions}>
//         <h5>مهام الاجتماعات</h5>
//         <div className={styles.tableContainer}>
//           <table>
//             <thead>
//               <tr>
//                 <th>المهام</th>
//                 <th>اسم الاجتماع</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentRows.map(meeting => (
//                 <tr key={meeting.id}>
//                   <td>
//                     <ul>
//                       {meeting.tasks.map((goal, index) => (
//                         <li key={index}>{goal}</li>
//                       ))}
//                     </ul>
//                   </td>
//                   <td>{meeting.name}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className={styles.pagination}>
//             {[...Array(totalPages)].map((_, index) => (
//               <button
//                 key={index + 1}
//                 onClick={() => handlePageChange(index + 1)}
//                 className={currentPage === index + 1 ? styles.activePage : ''}>
//                 {index + 1}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className={styles.LogsDiscussionsContainer}>
//         <Discussions id={id} />
//         <Logger logs={mockLogs} />
//       </div>

//       {isUserModalOpen && (
//         <Modal open={isUserModalOpen} onClose={toggleUserModal} className={styles.usersModal}>
//           <div className={styles.modal}>
//             <div className={styles.tableContainer}>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>الاسم</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map(person => (
//                     <tr key={person.ID}>
//                       <td>{person.UserFullName}</td>
//                       <td>
//                         <Checkbox
//                           onChange={() => setMeetingUsers([...meetingUsers, person])}
//                           checked={meetingUsers.some(user => user.ID === person.ID)}
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <div className={styles.modalActions}>
//                 <button className={styles.cancelButton} onClick={toggleUserModal}>
//                   <FaTimes />
//                   <p>إلغاء</p>
//                 </button>
//                 <button className={styles.saveButton} onClick={handleAddUser}>
//                   <FaSave />
//                   <p>حفظ</p>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       )}

//       <VotingSystem votings={votings} handleVote={handleVote} addNewVoting={addNewVoting} />

//       <VotingModal
//         isModalOpen={isModalOpen}
//         handleSaveVoting={handleSaveVoting}
//         handleCancel={handleCancel}
//         handleAddOption={handleAddOption}
//         newVoting={newVoting}
//         newOption={newOption}
//         setNewVoting={setNewVoting}
//         setNewOption={setNewOption}
//       />
//     </div>
//   );
// };

// export default CommitteeDetails;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaPlus, FaArrowLeft, FaTimes, FaSave, FaTrash, FaPen } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './CommitteeDetails.module.scss';
import Logger from './Logger';
import VotingModal from '../../../components/VotingModal';
import VotingSystem from '../../../components/VotingSystem';
import { Checkbox, Modal } from '@mui/material';
import Discussions from './Discussions';
import { CommitteeMembersServices, CommitteeServices, MemberRolesServices } from '../services/committees.service';
import { MemberServices } from '../../Members/services/member.service';
import { FormatDateToArabic, FormatTimeToArabic } from '../../../helpers';
import DeleteModal from '../../../components/DeleteModal';
import { DeleteModalConstants } from '../../../constants';
import { MeetingServices } from '../../Meetings/services/meetings.service';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const meetingGoalsData = [
  {
    id: 1,
    name: 'اجتماع الميزانية',
    tasks: ['إعداد تقرير النفقات', 'إقرار الموازنة', 'توزيع الأولويات', 'تحديد الأهداف الرئيسية'],
  },
  {
    id: 2,
    name: 'اجتماع الموظفين',
    tasks: ['إعداد خطة تدريب الموظفين', 'مراجعة تقييمات الأداء', 'وضع خطة الاحتياجات المستقبلية'],
  },
  { id: 3, name: 'اجتماع المشاريع', tasks: ['تحديث جدول المشروع', 'التأكد من المخاطر', 'إعادة تخصيص الموارد'] },
  { id: 4, name: 'اجتماع المشتريات', tasks: ['إعداد قائمة الموردين', 'التفاوض على العقود', 'إقرار الموافقات النهائية'] },
];

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
  const [loading, setLoading] = useState(true);

  const [showMoreMembers, setShowMoreMembers] = useState(false);
  const [showMoreMeetings, setShowMoreMeetings] = useState(false);
  // const [showMoreFiles, setShowMoreFiles] = useState(false);

  const [votings, setVotings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState({
    user: false,
    voting: false,
    deleteMeeting: false,
  });

  const [newVoting, setNewVoting] = useState({ question: '', options: [] });
  const [newOption, setNewOption] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const [fetchedCommitteeData, setFetchedCommitteeData] = useState({
    Committee: {},
    Members: [],
    PreviousMeetings: [],
    UpcomingMeetings: [],
  });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const MAX_VISIBLE_ITEMS = 3;

  const rowsPerPage = 3;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = meetingGoalsData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(meetingGoalsData.length / rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const committeeDetails = await CommitteeServices.commonCommitteeDetails(id);

        setFetchedCommitteeData({
          Committee: committeeDetails?.Committee,
          Members: committeeDetails?.Members,
          PreviousMeetings: committeeDetails?.PreviousMeetings,
          UpcomingMeetings: committeeDetails?.UpcomingMeetings,
        });

        const fetchedRoles = await MemberRolesServices.getAll();
        setRoles(fetchedRoles);
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
        const systemUsers = await MemberServices.getAll();
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
  const handlePageChange = newPage => {
    setCurrentPage(newPage);
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

  const toggleUserModal = () => {
    setIsModalOpen({ ...isModalOpen, user: !isModalOpen.user });
    setSelectedUsers([]);
    setSelectedRoles({});
  };

  const handleAddMeeting = () => {
    navigate('/meetings/create', { state: { mode: 'add', committeeId: fetchedCommitteeData?.Committee?.ID } });
  };

  const handleEditMeeting = id => {
    navigate(`/meetings/edit/${id}`);
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

  if (!fetchedCommitteeData) return <p>Loading...</p>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />
          <p className={styles.committeeDate}>
            تاريخ الإنشاء: {new Date(fetchedCommitteeData?.Committee?.FormationDate).toLocaleDateString('ar-EG')}
          </p>
        </div>
        <h4>{fetchedCommitteeData?.Committee?.ArabicName}</h4>
      </div>

      {/************* Page Header 4 Cards ****************/}
      <div className={styles.committeeDashboard}>
        {/******************** Attachments **********************/}
        <div className={styles.dashboardWidget}>
          <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
            <h5>المرفقات</h5>
            <button className={styles.button}>
              <FaPlus className={styles.addIcon} />
              <p>رفع</p>
            </button>
          </div>
          {/* <div className={styles.widgetContent}>
            <FaFileAlt className={styles.widgetIcon} />
            <span>{committee?.files?.length || 0}</span>
          </div> */}
          <div className={styles.widgetDetails}>
            {/* {committee?.files.slice(0, showMoreFiles ? committee?.files.length : MAX_VISIBLE_ITEMS).map(file => (
              <div key={file.id} className={styles.widgetItem}>
                {file.name}
              </div>
            ))} */}
            {/* {committee?.files?.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreFiles(!showMoreFiles)} className={styles.viewMoreButton}>
                {showMoreFiles ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )} */}
          </div>
        </div>

        {/******************** Upcoming Meetings **********************/}
        <div className={styles.dashboardWidget}>
          <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
            <h5>الاجتماعات القادمة</h5>
            <button className={styles.button} onClick={handleAddMeeting}>
              <FaPlus className={styles.addIcon} />
              <p>إنشاء</p>
            </button>
          </div>

          <div className={styles.widgetContent}>
            <FaCalendarAlt className={styles.widgetIcon} />
            <span>{fetchedCommitteeData?.UpcomingMeetings?.length}</span>
          </div>

          <div className={styles.widgetDetails}>
            {fetchedCommitteeData?.UpcomingMeetings.length ? (
              fetchedCommitteeData?.UpcomingMeetings.slice(
                0,
                showMoreMeetings ? fetchedCommitteeData?.UpcomingMeetings.length : MAX_VISIBLE_ITEMS,
              ).map(meeting => (
                <div key={meeting.ID} className={`${styles.meetingItem}`}>
                  <div className={styles.meetingDetails}>
                    <p className={styles.meetingName}>{meeting?.ArabicName}</p>
                    <div className={styles.meetingActions}>
                      <button className={styles.editButton} onClick={() => handleEditMeeting(meeting.ID)}>
                        <FaPen />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => {
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
            <span>{fetchedCommitteeData?.PreviousMeetings?.length}</span>
          </div>
          <div className={styles.widgetDetails}>
            {fetchedCommitteeData?.PreviousMeetings.length ? (
              fetchedCommitteeData?.PreviousMeetings.slice(
                0,
                showMoreMeetings ? fetchedCommitteeData?.PreviousMeetings.length : MAX_VISIBLE_ITEMS,
              ).map(meeting => (
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
            <span>{fetchedCommitteeData?.Members.length}</span>
          </div>

          <div className={styles.widgetDetails}>
            {!loading && (
              <>
                {fetchedCommitteeData?.Members.slice(
                  0,
                  showMoreMembers ? fetchedCommitteeData?.Members.length : MAX_VISIBLE_ITEMS,
                ).map(person => (
                  <div key={person.ID} className={styles.widgetItem}>
                    <div className={styles.profileIcon}>{person?.UserFullName.charAt(0)}</div>
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{person?.UserFullName}</span>
                      <span className={styles.itemRole}>{person?.RoleArabicName}</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {fetchedCommitteeData?.Members.length > MAX_VISIBLE_ITEMS && (
              <button onClick={() => setShowMoreMembers(!showMoreMembers)} className={styles.viewMoreButton}>
                {showMoreMembers ? 'عرض أقل' : 'عرض المزيد'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.meetingsMissions}>
        <h5>مهام الاجتماعات</h5>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>المهام</th>
                <th>اسم الاجتماع</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map(meeting => (
                <tr key={meeting.id}>
                  <td>
                    <ul>
                      {meeting.tasks.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{meeting.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? styles.activePage : ''}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.LogsDiscussionsContainer}>
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
                  {users.map(person => (
                    <tr key={person.ID}>
                      <td>
                        <select
                          value={selectedRoles[person.ID] || ''}
                          onChange={e => handleRoleChange(person.ID, e.target.value)}>
                          <option value='' disabled>
                            اختر دور
                          </option>
                          {roles.map(role => (
                            <option key={role.ID} value={role.ID}>
                              {role?.NameArabic}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{person?.UserFullName}</td>
                      <td>
                        <Checkbox onChange={() => handleCheckboxChange(person.ID)} checked={selectedUsers.includes(person.ID)} />
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
    </div>
  );
};

export default CommitteeDetails;
