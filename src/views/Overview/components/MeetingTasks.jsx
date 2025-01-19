import React, { useState } from 'react';

import styles from './MeetingTasks.module.scss';
import { useEffect } from 'react';
import apiService from '../../../services/axiosApi.service';

const MeetingTasks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [meetingDetails, setMeetingDetails] = useState([]);
  console.log('🚀 ~ MeetingTasks ~ meetingDetails:', meetingDetails);

  const rowsPerPage = 3;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = meetingDetails?.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(meetingDetails?.length / rowsPerPage) || 0;

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        await apiService
          ?.getById('GetAllTaskByCommitteeId', `${localStorage.getItem('selectedCommitteeID')}/${null}`)
          .then(response => {
            setMeetingDetails(response);
          });
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeetingDetails();
  }, []);

  return (
    <div className={styles.meetingsMissions}>
      <h5>مهام الاجتماعات</h5>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>الحالة</th>
              <th>المكلف</th>
              <th>اسم الاجتماع</th>
              <th>اسم المهمة</th>
            </tr>
          </thead>
          {!meetingDetails?.length ? (
            <tbody>
              <tr>
                <td colSpan={4}>
                  <h6 className={styles.noData}>لا يوجد مهام لإجتماعات اللجنة</h6>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {currentRows?.map(task => (
                <tr key={task.ID}>
                  <td>{task?.Status}</td>
                  <td>{task?.FullName}</td>
                  <td>{task?.MeetingName}</td>
                  <td>{task?.NameArabic}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
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
    </div>
  );
};

export default MeetingTasks;
