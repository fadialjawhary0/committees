import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaCalendarAlt, FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { FormatDateToArabic, FormatTimeToArabic } from '../../../../helpers';
import { DeleteModalConstants, MeetingStatus } from '../../../../constants';

import DeleteModal from '../../../../components/DeleteModal';
import apiService from '../../../../services/axiosApi.service';

import styles from '../CommitteeDetails.module.scss';

const CommitteeUpcomingMeetings = ({ meetings, setIsModalOpen, isModalOpen, setFetchedCommitteeData }) => {
  const navigate = useNavigate();

  const [showMoreMeetings, setShowMoreMeetings] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const MAX_VISIBLE_ITEMS = 3;

  const handleDeleteMeeting = async (meetingId, meeting) => {
    try {
      await apiService.update('UpdateMeeting', {
        ID: meetingId,
        CommitteeID: parseInt(localStorage.getItem('selectedCommitteeID')),
        ArabicName: meeting?.ArabicName,
        EnglishName: meeting?.EnglishName,
        MeetingTypeID: parseInt(meeting?.MeetingTypeID),
        MeetingLocationID: parseInt(meeting?.MeetingLocationID),
        BuildingID: parseInt(meeting?.BuildingID),
        RoomID: parseInt(meeting?.RoomID),
        StatusId: parseInt(MeetingStatus?.Cancelled),
        Notes: meeting?.Notes,
        Link: meeting?.Link,
        Date: meeting?.Date,
        StartTime: meeting?.StartTime,
        EndTime: meeting?.EndTime,
      });
      setIsModalOpen({ ...isModalOpen, deleteMeeting: false });
      setSelectedMeetingId(null);

      setFetchedCommitteeData(prevData => ({
        ...prevData,
        UpcomingMeetings: prevData?.UpcomingMeetings?.filter(meeting => meeting?.ID !== meetingId),
      }));
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  return (
    <div className={styles.dashboardWidget}>
      <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
        <h5>الاجتماعات القادمة</h5>
        <button className={styles.button} onClick={() => navigate('/meetings/create')}>
          <FaPlus className={styles.addIcon} />
          <p>إنشاء</p>
        </button>
      </div>

      <div className={styles.widgetContent}>
        <FaCalendarAlt className={styles.widgetIcon} />
        <span>{meetings?.length || 0}</span>
      </div>

      <div className={styles.widgetDetails}>
        {meetings?.length ? (
          meetings.slice(0, showMoreMeetings ? meetings.length : MAX_VISIBLE_ITEMS)?.map(meeting => (
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

        {meetings?.length > MAX_VISIBLE_ITEMS && (
          <button onClick={() => setShowMoreMeetings(!showMoreMeetings)} className={styles.viewMoreButton}>
            {showMoreMeetings ? 'عرض أقل' : 'عرض المزيد'}
          </button>
        )}
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
          onDelete={() =>
            handleDeleteMeeting(
              selectedMeetingId,
              meetings?.find(meeting => meeting?.ID === selectedMeetingId),
            )
          }
        />
      )}
    </div>
  );
};

export default CommitteeUpcomingMeetings;
