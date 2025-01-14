import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaTrash, FaPen } from 'react-icons/fa';

import styles from './Meetings.module.scss';
import MeetingsFilters from './MeetingsFilters';
import { MeetingServices } from '../services/meetings.service';
import { FormatDateToArabic, FormatTimeToArabic } from '../../../helpers';
import DeleteModal from '../../../components/DeleteModal';
import { DeleteModalConstants } from '../../../constants';

const Meetings = () => {
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [selectedCommittee, setSelectedCommittee] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState({ deleteMeeting: false });
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const filteredMeetings = meetings.filter(
    meeting =>
      (selectedCommittee === 'الكل' || !selectedCommittee || meeting.CommitteeName === selectedCommittee) &&
      meeting.MeetingName.includes(searchTerm),
  );

  const rowsPerPage = 8;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredMeetings.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredMeetings.length / rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await MeetingServices.commonMeetingOverview();

        const committees = [...new Set(data?.map(meeting => meeting?.CommitteeName))];

        const committeeOptions = [
          { value: 'الكل', label: 'كل اللجان' },
          ...committees.map(name => ({
            value: name,
            label: name,
          })),
        ];

        setCommittees(committeeOptions);
        setMeetings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteMeeting = async meetingId => {
    try {
      await MeetingServices.commonDeleteMeetingWithAgendas(meetingId);

      const updatedMeetings = meetings.filter(meeting => meeting.ID !== meetingId);
      setMeetings(updatedMeetings);

      setIsModalOpen({ ...isModalOpen, deleteMeeting: false });
      setSelectedMeetingId(null);
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

  const handleFilterChange = selectedValue => {
    setSelectedCommittee(selectedValue);
  };

  const handlePaginationChange = newPage => {
    setCurrentPage(newPage);
  };

  return (
    <div className={styles.meetingsPage}>
      <MeetingsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        committeeOptions={committees}
        handleFilterChange={handleFilterChange}
        handleAddMeeting={handleAddMeeting}
      />
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>اسم الاجتماع</th>
              <th>اللجنة</th>
              <th>التاريخ</th>
              <th>وقت البدء</th>
              <th>وقت الانتهاء</th>
              <th>المكان</th>
              <th>الرابط</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map(meeting => (
              <tr key={meeting?.ID} className={styles.trClickable} onClick={() => handleRowClick(meeting?.ID)}>
                <td>{meeting?.MeetingName}</td>
                <td>{meeting?.CommitteeName}</td>
                <td>{FormatDateToArabic(meeting?.MeetingDate)}</td>
                <td>{FormatTimeToArabic(meeting?.MeetingStartTime)}</td>
                <td>{FormatTimeToArabic(meeting?.MeetingEndTime)}</td>
                <td>{meeting?.LocationDetails ? meeting?.LocationDetails : <span>-</span>}</td>
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
                      setSelectedMeetingId(meeting?.ID);
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
        {[...Array(totalPages)].map((_, index) => (
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
            setSelectedMeetingId(null);
            setIsModalOpen({ ...isModalOpen, deleteMeeting: false });
          }}
          title={DeleteModalConstants?.MEETING_TITLE}
          description={DeleteModalConstants?.MEETING_DESCRIPTION}
          onDelete={() => handleDeleteMeeting(selectedMeetingId)}
        />
      )}
    </div>
  );
};

export default Meetings;
