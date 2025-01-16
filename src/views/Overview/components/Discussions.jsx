import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Discussions.module.scss';

const Discussions = ({ id }) => {
  const navigate = useNavigate();

  const handleDiscussionClick = () => {
    navigate(`/overview/committee/${id}/discussions`);
  };

  const mockDiscussions = [
    {
      id: 1,
      author: 'Ahmed Ali',
      topic: 'اقتراح جدول أعمال جديد',
      message: 'أقترح إضافة بند لمناقشة الميزانية للربع القادم.',
      time: '2024-09-12T10:15:00',
    },
    {
      id: 2,
      author: 'Fatima Hassan',
      topic: 'مراجعة مستندات المشتريات',
      message: 'نحتاج إلى مراجعة جميع مستندات المشتريات قبل الاجتماع القادم.',
      time: '2024-09-13T14:30:00',
    },
  ];

  return (
    <div className={`${styles.dashboardWidget} ${styles.discussionWidget}`} onClick={handleDiscussionClick}>
      <div className={` ${styles.sectionHeaderTitle}`}>
        <h5>نقاشات اللجنة</h5>
      </div>
      <div className={styles.widgetContent}>
        {mockDiscussions?.map(discussion => (
          <div key={discussion.id} className={styles.widgetItem}>
            <div className={styles.itemDetails}>
              <span className={styles.itemName}>{discussion.topic}</span>
              <span className={styles.itemAuthor}>{discussion.author}</span>
              <span className={styles.itemMessage}>{discussion.message}</span>
              <span className={styles.itemTime}>{new Date(discussion.time).toLocaleString('ar-EG')}</span>
            </div>
          </div>
        ))}
        <button className={styles.viewMoreButton}>عرض جميع النقاشات</button>
      </div>
    </div>
  );
};

export default Discussions;
