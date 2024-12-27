// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaCircle, FaCalendarAlt, FaTasks, FaUser, FaTrash } from 'react-icons/fa';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { CommitteesData, CommitteesStatus } from '../../../constants';
// import styles from './Overview.module.scss';
// import OverviewFilters from './OverviewFilters';
// import { CommitteeServices } from '../services/committees.service';
// import { Modal } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// const Overview = () => {
//   const navigate = useNavigate();

//   const [timeRemaining, setTimeRemaining] = useState('');
//   const [committees, setCommittees] = useState([]);
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedCommitteeID, setSelectedCommitteeID] = useState(null);

//   useEffect(() => {
//     const intervals = committees.map(committee => {
//       const nextMeetingTime = new Date('2024-12-22T23:59:59').getTime();
//       const interval = setInterval(() => {
//         const now = new Date().getTime();
//         const distance = nextMeetingTime - now;

//         const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//         setTimeRemaining(prev => ({
//           ...prev,
//           [committee.id]: distance < 0 ? 'Expired' : `${days}d ${hours}h ${minutes}m ${seconds}s`,
//         }));

//         if (distance < 0) {
//           clearInterval(interval);
//         }
//       }, 0);

//       return interval;
//     });

//     return () => intervals.forEach(clearInterval);
//   }, [committees]);

//   useEffect(() => {
//     const fetchCommittees = () => {
//       return new Promise(resolve => {
//         resolve(CommitteesData);
//       });
//     };

//     fetchCommittees().then(data => {
//       setCommittees(data);
//     });
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await CommitteeServices.getAll();
//         console.log(data);

//         setCommittees(data);
//       } catch {
//         console.log('error');
//       }
//     };
//     fetchData();
//   }, []);

//   const committeeStatusLabel = status => {
//     switch (status) {
//       case 1:
//         return {
//           label: CommitteesStatus?.ACTIVE,
//           style: styles.statusActive,
//         };
//       case 2:
//         return {
//           label: CommitteesStatus?.DEACTIVATED,
//           style: styles.statusDeactivated,
//         };
//       case 3:
//         return {
//           label: CommitteesStatus?.DELETED,
//           style: styles.statusDeleted,
//         };
//       default:
//         return {
//           label: '',
//           style: '',
//         };
//     }
//   };

//   const handleCardClick = id => {
//     navigate(`/overview/committee/${id}`);
//   };

//   const toggleDropdown = id => {
//     setActiveDropdown(activeDropdown === id ? null : id);
//   };

//   const handleOptionClick = (status, id) => {
//     const updatedCommittees = committees.map(committee => {
//       if (committee.id === id) {
//         return {
//           ...committee,
//           status: status === CommitteesStatus.ACTIVE ? 2 : 1,
//         };
//       }
//       return committee;
//     });
//     setCommittees(updatedCommittees);
//     setActiveDropdown(null);
//   };

//   const toggleDeleteModal = id => {
//     setSelectedCommitteeID(id);
//     setIsDeleteModalOpen(!isDeleteModalOpen);
//   };

//   const handleCommitteeDeletion = async () => {
//     try {
//       console.log(selectedCommitteeID);
//       await CommitteeServices.delete(selectedCommitteeID);
//       setCommittees(prevCommittees => prevCommittees.filter(c => c.ID !== selectedCommitteeID));
//       toggleDeleteModal(null);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   return (
//     <React.Fragment>
//       <OverviewFilters />

//       <div className={styles.overviewPage}>
//         {committees.map(committee => {
//           const status = committeeStatusLabel(committee?.status);
//           return (
//             <div key={committee?.ID} className={styles.committeeCard}>
//               <div className={styles.cardHeader}>
//                 <label className={`${styles.statusBadge} ${status.style}`}>{status.label}</label>
//                 <div className={styles.committeeHeader}>
//                   <h6 className={styles.committeeName}>{committee?.name}</h6>
//                   <MoreVertIcon
//                     className={styles.committeeOptions}
//                     fontSize='large'
//                     onClick={() => toggleDropdown(committee?.ID)}
//                   />
//                 </div>

//                 {activeDropdown === committee?.ID && (
//                   <div
//                     className={`${styles.optionsDropdown} ${
//                       status.label === CommitteesStatus.ACTIVE ? styles.deactivate : styles.activate
//                     }`}>
//                     <button onClick={() => handleOptionClick(status.label, committee?.ID)} className={styles.dropdownOption}>
//                       {status.label === CommitteesStatus.ACTIVE ? 'إلغاء التفعيل' : 'تفعيل'}
//                     </button>
//                     <button className={styles.dropdownOption} onClick={() => toggleDeleteModal(committee?.ID)}>
//                       حذف
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className={styles.committeeContentContainer} onClick={() => handleCardClick(committee?.ID)}>
//                 <span className={styles.committeeDate}>
//                   تاريخ تشكيل اللجنة: {new Date(committee?.startDate).toLocaleDateString('ar-EG')}
//                 </span>

//                 <div className={styles.committeeInfoContainer}>
//                   <div className={styles.upcomingMeeting}>
//                     <p style={{ textAlign: 'center' }}> الوقت المتبقي للاجتماع القادم </p>
//                     <span style={{ textAlign: 'center' }}> اسم الاجتماع </span>
//                     <span className={styles.upcomingMeetingTimer}>{timeRemaining[committee.id]}</span>
//                   </div>

//                   <div className={styles.committeeDetails}>
//                     <div className={styles.committeeDetails__group}>
//                       <span>{committee?.upcomingMeetings} :الإجتماعات القادمة</span>
//                       <FaCalendarAlt className={styles.metricIcon} />
//                     </div>

//                     <div className={styles.committeeDetails__group} style={{}}>
//                       <span>{committee?.previousMeetings} :الإجتماعات المنعقدة</span>
//                       <FaCalendarAlt className={styles.metricIcon} />
//                     </div>

//                     <div className={styles.committeeDetails__group}>
//                       <span>{committee?.members} :عدد الأعضاء</span>
//                       <FaUser className={styles.metricIcon} />
//                     </div>
//                   </div>
//                 </div>

//                 <div className={styles.tasksListContainer}>
//                   <span className={styles.tasksListContainer__group} style={{ marginTop: '1rem' }}>
//                     :المهام <FaTasks className={styles.metricIcon} />
//                   </span>

//                   <ul className={styles.tasksList}>
//                     {committee?.tasks?.map(task => (
//                       <li key={task?.label} className={`${styles.taskItem} ${styles[`task${task.color}`]}`}>
//                         {task?.label}: {task?.count}
//                         <FaCircle className={styles.taskIcon} />
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         <Modal open={isDeleteModalOpen} onClose={toggleDeleteModal} className={styles.modalContainer}>
//           <div className={styles.modalContent}>
//             <div className={styles.modalHeader}>
//               <DeleteIcon />
//               <h3>مسح اللجنة؟</h3>
//               <p>هل أنت متأكد أنك تريد مسح هذه اللجنة؟</p>
//             </div>
//             <div className={styles.deleteModalActions}>
//               <button className={styles.cancelButton} onClick={toggleDeleteModal}>
//                 إلغاء
//               </button>
//               <button className={styles.deleteButton} onClick={handleCommitteeDeletion}>
//                 مسح
//               </button>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Overview;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCircle, FaCalendarAlt, FaTasks, FaUser } from 'react-icons/fa';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CommitteesStatus } from '../../../constants';
import styles from './Overview.module.scss';
import OverviewFilters from './OverviewFilters';
import { CommitteeServices } from '../services/committees.service';
import { Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Overview = () => {
  const navigate = useNavigate();

  const [timeRemaining, setTimeRemaining] = useState({});
  const [committees, setCommittees] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCommitteeID, setSelectedCommitteeID] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      const updatedTimeRemaining = committees.reduce((acc, committee) => {
        if (!committee.NextMeetingDate || !committee.NextMeetingStartTime) {
          acc[committee.ID] = 'Invalid';
          return acc;
        }

        const cleanDate = committee.NextMeetingDate.split('T')[0];
        const nextMeetingTime = new Date(`${cleanDate}T${committee.NextMeetingStartTime}`);
        const distance = nextMeetingTime.getTime() - now;

        if (distance <= 0) {
          acc[committee.ID] = 'Expired';
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          acc[committee.ID] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        return acc;
      }, {});

      setTimeRemaining(updatedTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [committees]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await CommitteeServices.commonCommitteeOverviewDetails();

        setCommittees(data);
      } catch {
        console.log('error');
      }
    };
    fetchData();
  }, []);

  const committeeStatusLabel = status => {
    switch (status) {
      case 1:
        return {
          label: CommitteesStatus?.ACTIVE,
          style: styles.statusActive,
        };
      case 2:
        return {
          label: CommitteesStatus?.DEACTIVATED,
          style: styles.statusDeactivated,
        };
      case 3:
        return {
          label: CommitteesStatus?.DELETED,
          style: styles.statusDeleted,
        };
      default:
        return {
          label: '',
          style: '',
        };
    }
  };

  const handleCardClick = id => {
    navigate(`/overview/committee/${id}`);
  };

  const toggleDropdown = id => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleOptionClick = (status, id) => {
    const updatedCommittees = committees.map(committee => {
      if (committee.id === id) {
        return {
          ...committee,
          status: status === CommitteesStatus.ACTIVE ? 2 : 1,
        };
      }
      return committee;
    });
    setCommittees(updatedCommittees);
    setActiveDropdown(null);
  };

  const toggleDeleteModal = id => {
    setSelectedCommitteeID(id);
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleCommitteeDeletion = async () => {
    try {
      console.log(selectedCommitteeID);
      await CommitteeServices.delete(selectedCommitteeID);
      setCommittees(prevCommittees => prevCommittees.filter(c => c.ID !== selectedCommitteeID));
      toggleDeleteModal(null);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <React.Fragment>
      <OverviewFilters />

      <div className={styles.overviewPage}>
        {committees.map(committee => {
          const status = committeeStatusLabel(committee?.status);
          return (
            <div key={committee?.ID} className={styles.committeeCard}>
              <div className={styles.cardHeader}>
                <label className={`${styles.statusBadge} ${status.style}`}>{status.label}</label>
                <div className={styles.committeeHeader}>
                  <h6 className={styles.committeeName}>{committee?.ArabicName}</h6>
                  <MoreVertIcon
                    className={styles.committeeOptions}
                    fontSize='large'
                    onClick={() => toggleDropdown(committee?.ID)}
                  />
                </div>

                {activeDropdown === committee?.ID && (
                  <div
                    className={`${styles.optionsDropdown} ${
                      status.label === CommitteesStatus.ACTIVE ? styles.deactivate : styles.activate
                    }`}>
                    <button onClick={() => handleOptionClick(status.label, committee?.ID)} className={styles.dropdownOption}>
                      {status.label === CommitteesStatus.ACTIVE ? 'إلغاء التفعيل' : 'تفعيل'}
                    </button>
                    <button className={styles.dropdownOption} onClick={() => toggleDeleteModal(committee?.ID)}>
                      حذف
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.committeeContentContainer} onClick={() => handleCardClick(committee?.ID)}>
                <span className={styles?.committeeDate}>
                  تاريخ تشكيل اللجنة: {new Date(committee?.FormationDate).toLocaleDateString('ar-EG')}
                </span>

                <div className={styles.committeeInfoContainer}>
                  <div className={styles.upcomingMeeting}>
                    <p style={{ textAlign: 'center' }}>الوقت المتبقي للاجتماع القادم</p>
                    {committee?.NextMeetingDate == null ? (
                      <span className={styles.upcomingMeetingTimer} style={{ textAlign: 'center' }}>
                        لا يوجد اجتماعات قادمة
                      </span>
                    ) : (
                      <>
                        <span style={{ textAlign: 'center' }}>{committee?.NextMeetingName || 'اسم الاجتماع غير متوفر'}</span>
                        <span className={styles.upcomingMeetingTimer}>{timeRemaining[committee?.ID]}</span>
                      </>
                    )}
                  </div>

                  <div className={styles.committeeDetails}>
                    <div className={styles.committeeDetails__group}>
                      <span>{committee?.LengthUpcomingMeetings} :الإجتماعات القادمة</span>
                      <FaCalendarAlt className={styles.metricIcon} />
                    </div>

                    <div className={styles.committeeDetails__group} style={{}}>
                      <span>{committee?.LengthPreviousMeetings} :الإجتماعات المنعقدة</span>
                      <FaCalendarAlt className={styles.metricIcon} />
                    </div>

                    <div className={styles.committeeDetails__group}>
                      <span>{committee?.LengthMembers} :عدد الأعضاء</span>
                      <FaUser className={styles.metricIcon} />
                    </div>
                  </div>
                </div>

                <div className={styles.tasksListContainer}>
                  <span className={styles.tasksListContainer__group} style={{ marginTop: '1rem' }}>
                    :المهام <FaTasks className={styles.metricIcon} />
                  </span>

                  <ul className={styles.tasksList}>
                    {committee?.tasks?.map(task => (
                      <li key={task?.label} className={`${styles.taskItem} ${styles[`task${task.color}`]}`}>
                        {task?.label}: {task?.count}
                        <FaCircle className={styles.taskIcon} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}

        <Modal open={isDeleteModalOpen} onClose={toggleDeleteModal} className={styles.modalContainer}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <DeleteIcon />
              <h3>مسح اللجنة؟</h3>
              <p>هل أنت متأكد أنك تريد مسح هذه اللجنة؟</p>
            </div>
            <div className={styles.deleteModalActions}>
              <button className={styles.cancelButton} onClick={toggleDeleteModal}>
                إلغاء
              </button>
              <button className={styles.deleteButton} onClick={handleCommitteeDeletion}>
                مسح
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default Overview;
