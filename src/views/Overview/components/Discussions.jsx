import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Discussions.module.scss';
import apiService from '../../../services/axiosApi.service';
import { useState } from 'react';

const Discussions = ({ id }) => {
  const navigate = useNavigate();
  const [discussion, setDiscussions] = useState([]);
  const handleDiscussionClick = () => {
    navigate(`/overview/committee/${id}/discussions`);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await apiService.getById(
          '/GetCommitteeDiscussionByCommittee',
          +localStorage.getItem('selectedCommitteeID'),
        );
        setDiscussions(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  return (
    <div className={`${styles.dashboardWidget} ${styles.discussionWidget}`} onClick={handleDiscussionClick}>
      <div className={` ${styles.sectionHeaderTitle}`}>
        <h5>نقاشات اللجنة</h5>
      </div>
      <div className={styles.widgetContent}>
        {discussion?.map(discussion => (
          <div key={discussion?.ID} className={styles.widgetItem}>
            <div className={styles.itemDetails}>
              <span className={styles.itemName}>{discussion?.Title}</span>
              <span className={styles.itemAuthor}>{discussion?.MemberName}</span>
              <span className={styles.itemMessage}>{discussion?.Message}</span>
              <span className={styles.itemTime}>{new Date(discussion?.CreatedAt).toLocaleString('ar-EG')}</span>
            </div>
          </div>
        ))}
        <button className={styles.viewMoreButton}>عرض جميع النقاشات</button>
      </div>
    </div>
  );
};

export default Discussions;
