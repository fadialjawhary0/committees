import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaPlus, FaUserCircle } from 'react-icons/fa';
import styles from './DiscussionsDetails.module.scss';
import apiService from '../../../services/axiosApi.service';


const DiscussionsDetails = () => {
  const [discussions, setDiscussions] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newComments, setNewComments] = useState({});

  const  handleAddDiscussion = async() => {
    const newDiscussion = {
      MemberID: +localStorage.getItem('memberID'),
      CommitteeID: +localStorage.getItem('selectedCommitteeID'),
      CreatedAt: new Date().toISOString(),
      Message: newMessage,
      Title: newTopic,
    };

    await apiService.create('AddCommitteeDiscussion', newDiscussion);

    setDiscussions([...discussions, newDiscussion]);
    setNewTopic('');
    setNewMessage('');
  };

  const handleAddComment = async discussionId => {
    const newCommentObj = {
      MemberID: +localStorage.getItem('MemberID'),
      CommitteeDiscussionId: discussionId,
      CreatedAt: new Date().toISOString(),
      Comment: newComments[discussionId],
    };
  
    await apiService.create('AddCommentDiscussion', newCommentObj);
  
    const updatedDiscussions = await apiService.getById(
      'GetCommitteeDiscussionByCommittee',
      +localStorage.getItem('selectedCommitteeID')
    );
  
    setDiscussions(updatedDiscussions);
    setNewComments({ ...newComments, [discussionId]: '' }); 
  };
  

useEffect(() => {
  const fetchData =async () => {
    const discussions = await apiService.getById('GetCommitteeDiscussionByCommittee',  +localStorage.getItem('selectedCommitteeID') );
    setDiscussions(discussions);
  }
fetchData();
 }, 
[]);

  return (
    <div className={styles.discussionsPage}>
      <div className={styles.pageHeader}>
        <h5>نقاشات داخل اللجنة</h5>
        <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />
      </div>
      <div className={styles.discussionInput}>
        <input
          type='text'
          placeholder='أدخل عنوان النقاش...'
          value={newTopic}
          onChange={e => setNewTopic(e.target.value)}
          className={styles.inputField}
        />
        <textarea
          placeholder='أدخل رسالتك...'
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className={styles.textareaField}></textarea>
        <button onClick={handleAddDiscussion} className={styles.sharedButton}>
          <FaPlus /> أضف النقاش
        </button>
      </div>
      <div className={styles.discussionsList}>
        {discussions?.map(discussion => (
          <div key={discussion.ID} className={styles.discussionItem}>
            <div className={styles.discussionHeader}>
              <FaUserCircle className={styles.userIcon} />
              <div className={styles.discussionAuthor}>{discussion?.MemberName}</div>
              <div className={styles.discussionTime}>{new Date(discussion?.CreatedAt).toLocaleString('ar-EG')}</div>
            </div>
            <div className={styles.discussionTopic}>{discussion?.Title}</div>
            <div className={styles.discussionMessage}>{discussion?.Message}</div>
            <div className={styles.commentsSection}>
              <h4>التعليقات</h4>
              {discussion.Comments?.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <FaUserCircle className={styles.userIcon} />
                  <div className={styles.commentAuthor}>{comment.UserName}</div>
                  <div className={styles.commentMessage}>{comment.Comment}</div>
                </div>
              ))}
              <div className={styles.commentInput}>
                <textarea
                  placeholder='أضف تعليق...'
                  value={newComments[discussion.ID] || ''}
                  onChange={e => setNewComments({ ...newComments, [discussion?.ID]: e.target.value })}
                  className={styles.textareaField}></textarea>
                <button onClick={() => handleAddComment(discussion?.ID)} className={styles.addButton}>
                  أضف تعليق
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionsDetails;
