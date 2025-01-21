// import React, { useState } from 'react';
// import { FaCheck, FaTimes } from 'react-icons/fa';
// import styles from './Tasks.module.scss';
// import TasksFilters from './TasksFilters';
// import DropdownFilter from '../../../components/filters/Dropdown';

// const Tasks = () => {
//   // const [requests, setRequests] = useState([
//   //   { id: 1, name: 'المهمة 1', date: '2024-11-01', status: 'قيد التنفيذ', committeeName: 'اللجنة 1', assignedTo: 'أحمد علي' },
//   //   { id: 2, name: 'المهمة 2', date: '2024-11-05', status: 'تمت الموافقة', committeeName: 'اللجنة 2', assignedTo: 'فاطمة حسان' },
//   //   { id: 3, name: 'المهمة 3', date: '2024-11-10', status: 'تم الرفض', committeeName: 'اللجنة 3', assignedTo: 'محمد صالح' },
//   //   { id: 4, name: 'المهمة 4', date: '2024-11-01', status: 'قيد التنفيذ', committeeName: 'اللجنة 4', assignedTo: 'أحمد علي' },
//   //   { id: 5, name: 'المهمة 5', date: '2024-11-05', status: 'قيد التنفيذ', committeeName: 'اللجنة 4', assignedTo: 'فاطمة حسان' },
//   //   { id: 6, name: 'المهمة 6', date: '2024-11-10', status: 'تم الرفض', committeeName: 'اللجنة 3', assignedTo: 'محمد صالح' },
//   //   { id: 7, name: 'المهمة 7', date: '2024-11-01', status: 'قيد التنفيذ', committeeName: 'اللجنة 2', assignedTo: 'أحمد علي' },
//   //   { id: 8, name: 'المهمة 8', date: '2024-11-05', status: 'تمت الموافقة', committeeName: 'اللجنة 5', assignedTo: 'فاطمة حسان' },
//   //   { id: 9, name: 'المهمة 9', date: '2024-11-10', status: 'تم الرفض', committeeName: 'اللجنة 1', assignedTo: 'محمد صالح' },
//   //   { id: 10, name: 'المهمة 10', date: '2024-11-01', status: 'تم الرفض', committeeName: 'اللجنة 8', assignedTo: 'أحمد علي' },
//   //   { id: 11, name: 'المهمة 11', date: '2024-11-05', status: 'تم الرفض', committeeName: 'اللجنة 8', assignedTo: 'فاطمة حسان' },
//   //   { id: 12, name: 'المهمة 12', date: '2024-11-10', status: 'تمت الموافقة', committeeName: 'اللجنة 1', assignedTo: 'محمد صالح' },
//   // ]);

//   // const [users, setUsers] = useState([
//   //   { id: 1, name: 'أحمد علي', committees: ['اللجنة 1', 'اللجنة 2'] },
//   //   { id: 2, name: 'فاطمة حسان', committees: ['اللجنة 3'] },
//   //   { id: 3, name: 'محمد صالح', committees: ['اللجنة 1'] },
//   //   { id: 4, name: 'سارة أحمد', committees: ['اللجنة 2', 'اللجنة 3'] },
//   //   { id: 5, name: 'خالد يوسف', committees: ['اللجنة 3'] },
//   //   { id: 6, name: 'أمل ناصر', committees: ['اللجنة 1', 'اللجنة 2'] },
//   //   { id: 7, name: 'رانيا عمر', committees: ['اللجنة 2'] },
//   //   { id: 8, name: 'يوسف القاسم', committees: ['اللجنة 3'] },
//   //   { id: 9, name: 'هبة مصطفى', committees: ['اللجنة 1'] },
//   //   { id: 10, name: 'عمر حسين', committees: ['اللجنة 2', 'اللجنة 3'] },
//   // ]);

//   const [filter, setFilter] = useState('All');

//   const handleApprove = id => {
//     const updatedRequests = requests?.map(req => (req.id === id ? { ...req, status: 'تمت الموافقة' } : req));
//     setRequests(updatedRequests);
//   };

//   const handleReject = id => {
//     const updatedRequests = requests?.map(req => (req.id === id ? { ...req, status: 'تم الرفض' } : req));
//     setRequests(updatedRequests);
//   };

//   const handleReassign = (id, newAssignee) => {
//     const updatedRequests = requests?.map(req => (req.id === id ? { ...req, assignedTo: newAssignee } : req));
//     setRequests(updatedRequests);
//   };

//   const handleFilterChange = selectedValue => {
//     setFilter(selectedValue);
//   };

//   const filteredRequests = filter === 'All' ? requests : requests.filter(req => req.status === filter);

//   const agreementOptions = [
//     { label: 'الكل', value: 'All' },
//     { label: 'قيد التنفيذ', value: 'قيد التنفيذ' },
//     { label: 'تمت الموافقة', value: 'تمت الموافقة' },
//     { label: 'تم الرفض', value: 'تم الرفض' },
//   ];

//   return (
//     <div className={styles.tasksPage}>
//       <TasksFilters tasksOptions={agreementOptions} handleFilterChange={handleFilterChange} />

//       <div className={styles.tableContainer}>
//         <table>
//           <thead>
//             <tr>
//               <th>اسم المهمة</th>
//               <th>المسؤول</th>
//               <th>تاريخ الطلب</th>
//               <th>الحالة</th>
//               <th>اللجنة</th>
//               <th>الإجراءات</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredRequests?.map(request => (
//               <tr key={request.id}>
//                 <td>{request.name}</td>
//                 <td>{request.assignedTo}</td>
//                 <td>{request.date}</td>
//                 <td>
//                   <span
//                     style={{
//                       padding: '0.5rem',
//                       borderRadius: '1rem',
//                       minWidth: '10rem',
//                       fontWeight: '500',
//                       display: 'inline-block',
//                       backgroundColor:
//                         request.status === 'قيد التنفيذ'
//                           ? '#ffc10758'
//                           : request.status === 'تمت الموافقة'
//                           ? '#28A74558'
//                           : '#DC354558',
//                     }}>
//                     {request.status}
//                   </span>
//                 </td>
//                 <td>{request.committeeName}</td>
//                 <td className={`${styles.sharedTd} ${styles.actions}`}>
//                   <DropdownFilter
//                     options={users?.map(user => ({ value: user.name, label: user.name }))}
//                     onSelect={newAssignee => handleReassign(request.id, newAssignee)}
//                     placeholder='إعادة تعيين'
//                   />
//                   {request.status === 'قيد التنفيذ' && (
//                     <>
//                       <button onClick={() => handleApprove(request.id)} className={styles.approveButton}>
//                         <FaCheck /> قبول
//                       </button>
//                       <button onClick={() => handleReject(request.id)} className={styles.rejectButton}>
//                         <FaTimes /> رفض
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Tasks;

import React, { useEffect, useState } from 'react';
import { FaCheck, FaChevronDown, FaTimes } from 'react-icons/fa';
import styles from './Tasks.module.scss';
import TasksFilters from './TasksFilters';
import DropdownFilter from '../../../components/filters/Dropdown';
import apiService from './../../../services/axiosApi.service';
import { ExtractDateFromDateTime } from '../../../helpers';
import { MEETING_TASK_PROCEDURES, MEETING_TASK_STATUS, ToastMessage } from '../../../constants';
import { useToast } from '../../../context';

const Tasks = () => {
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState([]);
  const [taskStatusOptions, setTaskStatusOptions] = useState([]);

  // console.log('🚀 ~ Tasks ~ taskStatus:', taskStatus);
  // console.log('🚀 ~ Tasks ~ tasks:', tasks);

  const [filter, setFilter] = useState('All');
  console.log('🚀 ~ Tasks ~ filter:', filter);

  const handleProcedure = async (task, procedureID) => {
    try {
      await apiService.update('UpdateTask', {
        ID: task?.ID,
        MeetingID: task?.MeetingID,
        MemberID: task?.MemberID,
        NameArabic: task?.NameArabic,
        NameEnglish: task?.NameEnglish,
        StartDate: task?.StartDate,
        EndDate: task?.EndDate,
        StatusID: MEETING_TASK_STATUS?.NOT_STARTED,
        IsApproved: procedureID === MEETING_TASK_PROCEDURES?.ACCEPTED ? true : false,
        CreatedAt: task?.CreatedAt,
      });

      showToast(ToastMessage?.MeetingTaskApproved, 'success');
    } catch (e) {
      console.error(e);
      showToast(ToastMessage?.SomethingWentWrong, 'error');
    }

    fetchTasks();
  };

  const handleReassign = async (task, newAssigneeID) => {
    if (task?.StatusID == MEETING_TASK_STATUS?.COMPLETED) {
      showToast(ToastMessage?.SomethingWentWrong, 'error');
      return;
    }

    try {
      await apiService.update('UpdateTask', {
        ID: task?.ID,
        MeetingID: task?.MeetingID,
        MemberID: +newAssigneeID,
        NameArabic: task?.NameArabic,
        NameEnglish: task?.NameEnglish,
        StartDate: task?.StartDate,
        EndDate: task?.EndDate,
        StatusID: MEETING_TASK_STATUS?.NOT_STARTED,
        CreatedAt: task?.CreatedAt,
      });
      fetchTasks();

      showToast(ToastMessage?.MeetingReassignTaskSuccess, 'success');
    } catch (e) {
      console.error(e);
      showToast(ToastMessage?.SomethingWentWrong, 'error');
    }
  };

  const handleFilterChange = selectedValue => {
    setFilter(selectedValue);
  };

  const filteredRequests = filter === 'All' ? tasks : tasks.filter(task => task?.StatusID === +filter);

  const fetchTasks = async () => {
    try {
      const response = await apiService.getById(
        'GetAllTaskByCommitteeId',
        `${localStorage.getItem('selectedCommitteeID')}/${localStorage.getItem('memberID')}`,
      );

      const tasksWithMembers = await Promise.all(
        response.map(async task => {
          const members = await GetMeetingMembers(task?.MeetingID);
          return {
            ...task,
            meetingMembers: members,
          };
        }),
      );
      setTasks(tasksWithMembers);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTasksStatus = async () => {
    try {
      const response = await apiService.getAll('GetAllTaskStatus');

      const taskStatusOptions = [
        { value: 'All', label: 'الكل' },
        ...response?.map(status => ({
          value: status?.ID,
          label: status?.ArabicName,
        })),
      ];
      setTaskStatusOptions(taskStatusOptions);

      setTaskStatus(response);
    } catch (e) {
      console.error(e);
    }
  };

  const GetMeetingMembers = async meetingId => {
    try {
      return await apiService.getById('GetAllMeetingMemberByMeetingID', meetingId);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTasksStatus();
  }, []);

  const handleTaskStatusChange = async (task, e) => {
    try {
      await apiService.update('UpdateTask', {
        ID: task?.ID,
        MeetingID: task?.MeetingID,
        MemberID: task?.MemberID,
        NameArabic: task?.NameArabic,
        NameEnglish: task?.NameEnglish,
        StartDate: task?.StartDate,
        EndDate: task?.EndDate,
        StatusID: e,
        IsApproved: task?.IsApproved,
        CreatedAt: task?.CreatedAt,
      });

      const updatedTasks = tasks?.map(t => (t.ID === task?.ID ? { ...t, StatusID: e } : t));
      setTasks(updatedTasks);

      showToast(ToastMessage?.MeetingTaskStatusChangeSuccess, 'success');
    } catch (e) {
      console.error(e);
      showToast(ToastMessage?.SomethingWentWrong, 'error');
    }
  };

  return (
    <div className={styles.tasksPage}>
      <TasksFilters tasksOptions={taskStatusOptions} handleFilterChange={handleFilterChange} />

      <div className={styles.tableContainer}>
        <table>
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>اسم المهمة</th>
              <th>المكلّف</th>
              <th>تاريخ الإنشاء</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests?.map(task => (
              <tr key={task?.ID}>
                <td>{task?.NameArabic}</td>
                <td>{task?.FullName}</td>
                <td>{ExtractDateFromDateTime(task?.CreatedAt)}</td>
                <td>
                  <select
                    id={`taskStatus-${task?.ID}`}
                    value={task?.StatusID}
                    onChange={e => handleTaskStatusChange(task, e.target.value)}
                    className={styles.tasksSelect}
                    disabled={task?.IsApproved === MEETING_TASK_PROCEDURES?.REJECTED || !!!task?.IsApproved}
                    required>
                    <option value='' disabled>
                      اختر حالة المهمة
                    </option>
                    {taskStatus?.map(status => (
                      <option key={status?.ID} value={status?.ID}>
                        {status?.ArabicName}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={styles.sharedTd}>
                  <div className={styles.actions}>
                    <select
                      id={`taskAssignee-${task?.ID}`}
                      value={task?.meetingMembers?.find(member => member?.MemberID === task?.MemberID)?.MemberID || ''}
                      onChange={e => handleReassign(task, e.target.value)}
                      className={styles.tasksSelect}
                      disabled={task?.StatusID == MEETING_TASK_STATUS?.COMPLETED}
                      required>
                      <option value='' disabled>
                        إعادة تعيين
                      </option>
                      {task?.meetingMembers?.map(member => (
                        <option key={member?.ID} value={member?.MemberID}>
                          {member?.FullName}
                        </option>
                      ))}
                    </select>

                    {task?.IsApproved === null ? (
                      <>
                        <button
                          onClick={() => handleProcedure(task, MEETING_TASK_PROCEDURES?.ACCEPTED)}
                          className={styles.approveButton}>
                          <FaCheck /> قبول
                        </button>
                        <button
                          onClick={() => handleProcedure(task, MEETING_TASK_PROCEDURES?.REJECTED)}
                          className={styles.rejectButton}>
                          <FaTimes /> رفض
                        </button>
                      </>
                    ) : task?.IsApproved == MEETING_TASK_PROCEDURES?.ACCEPTED ? (
                      <span className={styles.approved}>
                        <FaCheck /> تمت الموافقة
                      </span>
                    ) : (
                      <span className={styles.rejected}>
                        <FaTimes /> تم الرفض
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
