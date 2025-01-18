import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaTrash, FaPen } from 'react-icons/fa';

import styles from './Meetings.module.scss';
import MeetingsFilters from './MeetingsFilters';
import { MeetingServices } from '../services/meetings.service';
import { FormatDateToArabic, FormatTimeToArabic } from '../../../helpers';
import DeleteModal from '../../../components/DeleteModal';
import { DeleteModalConstants, MeetingStatus } from '../../../constants';
import apiService from '../../../services/axiosApi.service';

const Meetings = () => {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  console.log('🚀 ~ Meetings ~ meetings:', meetings);
  const [committees, setCommittees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState({ deleteMeeting: false });
  const [selectedDeleteMeeting, setSelectedDeleteMeeting] = useState({});

  const filteredMeetings = meetings?.filter(meeting => meeting?.ArabicName?.includes(searchTerm));

  const rowsPerPage = 8;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredMeetings?.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math?.ceil(filteredMeetings.length / rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService?.getAll(
          `GetMeetingByCommitteeId/${localStorage.getItem('selectedCommitteeID')}/${localStorage.getItem('memberID')}`,
        ); // UPDATE HERE

        setMeetings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteMeeting = async selectedDeleteMeeting => {
    try {
      await apiService.update('UpdateMeeting', {
        ID: selectedDeleteMeeting?.ID,
        CommitteeID: parseInt(localStorage.getItem('selectedCommitteeID')),
        ArabicName: selectedDeleteMeeting?.ArabicName,
        EnglishName: selectedDeleteMeeting?.EnglishName,
        MeetingTypeID: parseInt(selectedDeleteMeeting?.MeetingTypeID),
        MeetingLocationID: parseInt(selectedDeleteMeeting?.MeetingLocation?.ID),
        BuildingID: parseInt(selectedDeleteMeeting?.Building?.ID),
        RoomID: parseInt(selectedDeleteMeeting?.Room?.ID),
        StatusId: parseInt(MeetingStatus?.Cancelled),
        Notes: selectedDeleteMeeting?.Notes,
        Link: selectedDeleteMeeting?.Link,
        Date: selectedDeleteMeeting?.Date,
        StartTime: selectedDeleteMeeting?.StartTime,
        EndTime: selectedDeleteMeeting?.EndTime,
      });

      const updatedMeetings = meetings?.map(meeting =>
        meeting.ID === selectedDeleteMeeting?.ID ? { ...meeting, Status: { ...meeting.Status, ArabicName: 'ملغي' } } : meeting,
      );

      setMeetings(updatedMeetings);

      setIsModalOpen({ ...isModalOpen, deleteMeeting: false });
      setSelectedDeleteMeeting({});
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const handleEditMeeting = (e, id) => {
    e.stopPropagation();
    navigate(`/meetings/edit/${id}`);
  };

  const handleAddMeeting = () => {
    navigate('/meetings/create', { state: { mode: 'add' } });
  };

  const handleRowClick = id => {
    navigate(`/meetings/${id}`);
  };

  const handlePaginationChange = newPage => {
    setCurrentPage(newPage);
  };

  return (
    <div className={styles.meetingsPage}>
      <MeetingsFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleAddMeeting={handleAddMeeting} />
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>اسم الاجتماع</th>
              <th>الحالة</th>
              <th>التاريخ</th>
              <th>وقت البدء</th>
              <th>وقت الانتهاء</th>
              <th>المكان</th>
              <th>الرابط</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {currentRows?.map(meeting => (
              <tr key={meeting?.ID} className={styles.trClickable} onClick={() => handleRowClick(meeting?.ID)}>
                <td>{meeting?.ArabicName}</td>
                <td>{meeting?.Status?.ArabicName}</td>
                <td>{FormatDateToArabic(meeting?.Date)}</td>
                <td>{FormatTimeToArabic(meeting?.StartTime)}</td>
                <td>{FormatTimeToArabic(meeting?.EndTime)}</td>
                <td>{meeting?.Building ? `${meeting?.Building?.ArabicName} - ${meeting?.Room?.ArabicName}` : <span>-</span>}</td>
                <td style={{ direction: 'ltr' }}>
                  <a href={meeting?.Link} target='_blank' rel='noreferrer' onClick={e => e.stopPropagation()}>
                    {meeting?.Link ? meeting?.Link : <span>-</span>}
                  </a>
                </td>
                <td>
                  <button className={styles.editButton} onClick={e => handleEditMeeting(e, meeting?.ID)}>
                    <FaPen />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedDeleteMeeting(meeting);
                      setIsModalOpen({ ...isModalOpen, deleteMeeting: true });
                    }}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.paginationContainer}>
        {[...Array(totalPages)]?.map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePaginationChange(index + 1)}
            className={currentPage === index + 1 ? styles.activePage : ''}>
            {index + 1}
          </button>
        ))}
      </div>

      {isModalOpen.deleteMeeting && (
        <DeleteModal
          isOpen={isModalOpen.deleteMeeting}
          onClose={() => {
            setSelectedDeleteMeeting({});
            setIsModalOpen({ ...isModalOpen, deleteMeeting: false });
          }}
          title={DeleteModalConstants?.MEETING_TITLE}
          description={DeleteModalConstants?.MEETING_DESCRIPTION}
          onDelete={() => handleDeleteMeeting(selectedDeleteMeeting)}
        />
      )}
    </div>
  );
};

export default Meetings;
