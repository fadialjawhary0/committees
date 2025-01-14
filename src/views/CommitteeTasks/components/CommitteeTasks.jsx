import React, { useEffect, useState } from 'react';
import styles from './CommitteeTasks.module.scss';
import DropdownFilter from '../../../components/filters/Dropdown';
import CommitteeTasksFilters from './CommitteeTasksFilters';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../services/axiosApi.service';
import { useToast } from '../../../context';
import { ToastMessage } from '../../../constants';

const CommitteeTasks = () => {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState([]);
  const [tasksStatuses, setTasksStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const tasksData = await apiService.getById('GetAllCommitteeTaskByCommitteeId', localStorage.getItem('selectedCommitteeID'));
      const statusesData = await apiService.getAll('GetAllCommitteeTaskStatus');
      setTasks(tasksData);
      setTasksStatuses(
        statusesData.map(status => ({
          value: status.ID,
          label: status.ArabicName,
        })),
      );
    };
    fetchData();
  }, []);

  const filteredTasks = tasks?.filter(task => task?.ArabicName?.includes(searchTerm));

  const handleStatusUpdate = async (task, newStatusId) => {
    try {
      await apiService.update('UpdateCommitteeTask', {
        ID: task?.ID,
        StatusID: newStatusId,
        ArabicName: task?.ArabicName,
        EnglishName: task?.EnglishName,
        ArabicDescription: task?.ArabicDescription,
        EnglishDescription: task?.EnglishDescription,
        CommitteeID: task?.CommitteeID,
      });
      const updatedTasks = await apiService.getAll('GetAllCommitteeTask');
      showToast(ToastMessage?.CommitteeTaskStatusChangeSuccess, 'success');
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
      showToast(ToastMessage?.SomethingWentWrong, 'error');
    }
  };

  const handleAdd = () => {
    navigate('/committee-tasks/create');
  };

  const getDefaultStatusLabel = statusId => {
    const status = tasksStatuses.find(status => status.value === statusId);
    return status ? status.label : 'اختر الحالة';
  };

  return (
    <div className={styles.userTasksPage}>
      <CommitteeTasksFilters handleAdd={handleAdd} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>اسم المهمة</th>
              <th>الوصف</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks?.map(task => (
              <tr key={task.ID}>
                <td>{task.ArabicName}</td>
                <td>{task.ArabicDescription}</td>
                <td>
                  <DropdownFilter
                    options={tasksStatuses}
                    defaultValue={task.StatusID}
                    onSelect={newStatusId => handleStatusUpdate(task, newStatusId)}
                    placeholder={getDefaultStatusLabel(task.StatusID)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommitteeTasks;
