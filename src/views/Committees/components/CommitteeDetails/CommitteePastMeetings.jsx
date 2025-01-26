import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

import { FormatDateToArabic, FormatTimeToArabic } from '../../../../helpers';

import styles from '../CommitteeDetails.module.scss';

const CommitteePastMeetings = ({ meetings }) => {
  const [showMoreMeetings, setShowMoreMeetings] = useState(false);

  const MAX_VISIBLE_ITEMS = 3;

  return (
    <div className={styles.dashboardWidget}>
      <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
        <h5>الاجتماعات المنعقدة</h5>
      </div>
      <div className={styles.widgetContent}>
        <FaCalendarAlt className={styles.widgetIcon} />
        <span>{meetings?.length || 0}</span>
      </div>
      <div className={styles.widgetDetails}>
        {meetings?.length ? (
          meetings?.slice(0, showMoreMeetings ? meetings?.length : MAX_VISIBLE_ITEMS)?.map(meeting => (
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

        {meetings?.length > MAX_VISIBLE_ITEMS && (
          <button onClick={() => setShowMoreMeetings(!showMoreMeetings)} className={styles.viewMoreButton}>
            {showMoreMeetings ? 'عرض أقل' : 'عرض المزيد'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommitteePastMeetings;
