import React, { useState } from 'react';

import styles from './MeetingTasks.module.scss';
import { useEffect } from 'react';
import apiService from '../../../services/axiosApi.service';

const meetingGoalsData = [
  {
    id: 1,
    name: 'اجتماع الميزانية',
    tasks: ['تحديد الأهداف الرئيسية'],
  },
  {
    id: 2,
    name: 'اجتماع الموظفين',
    tasks: ['وضع خطة الاحتياجات المستقبلية'],
  },
  { id: 3, name: 'اجتماع المشاريع', tasks: ['إعادة تخصيص الموارد'] },
  { id: 4, name: 'اجتماع المشتريات', tasks: ['إقرار الموافقات النهائية'] },
];

const MeetingTasks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [meetingDetails, setMeetingDetails] = useState({});

  const rowsPerPage = 3;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = meetingGoalsData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(meetingGoalsData.length / rowsPerPage);

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        const response = await apiService?.getById(
          'GetAllTaskByCommitteeId',
          `${localStorage.getItem('selectedCommitteeID')}/${null}`,
        );
        console.log('🚀 ~ fetchMeetingDetails ~ response:', response);
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
              <th>المهام</th>
              <th>اسم الاجتماع</th>
            </tr>
          </thead>
          <tbody>
            {currentRows?.map(meeting => (
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
