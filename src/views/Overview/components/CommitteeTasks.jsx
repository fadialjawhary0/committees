import React, { useEffect, useState } from 'react';

import apiService from '../../../services/axiosApi.service';

import styles from './CommitteeTasks.module.scss';

const CommitteeTasks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [committeeTasks, setCommitteeTasks] = useState([]);

  const rowsPerPage = 3;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = committeeTasks?.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(committeeTasks?.length / rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getById('GetAllCommitteeTaskByCommitteeId', localStorage.getItem('selectedCommitteeID'));

      setCommitteeTasks(response);
    };
    fetchData();
  }, []);

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  return (
    <div className={styles.CommitteesTasksContainer}>
      <h5>مهام اللجنة</h5>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>الحالة</th>
              <th>الوصف</th>
              <th>اسم المهمة</th>
            </tr>
          </thead>
          {!committeeTasks?.length ? (
            <tbody>
              <tr>
                <td colSpan={3}>
                  <h6 className={styles.noData}>لا يوجد مهام لهذه اللجنة</h6>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {currentRows?.map(task => (
                <tr key={task?.ID}>
                  <td>{task?.StatusName}</td>
                  <td>{task?.ArabicDescription}</td>
                  <td>{task?.ArabicName}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {committeeTasks?.length > 0 && (
        <div className={styles.pagination}>
          {[...Array(totalPages)]?.map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? styles.activePage : ''}>
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommitteeTasks;
