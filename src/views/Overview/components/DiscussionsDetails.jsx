import React, { useState } from 'react';
import { FaArrowLeft, FaPlus, FaUserCircle } from 'react-icons/fa';
import styles from './DiscussionsDetails.module.scss';

const mockDiscussions = [
  {
    id: 1,
    author: 'Ahmed Ali',
    topic: 'اقتراح جدول أعمال جديد',
    message: 'أقترح إضافة بند لمناقشة الميزانية للربع القادم.',
    time: '2024-09-12T10:15:00',
    comments: [],
  },
  {
    id: 2,
    author: 'Fatima Hassan',
    topic: 'مراجعة مستندات المشتريات',
    message: 'نحتاج إلى مراجعة جميع مستندات المشتريات قبل الاجتماع القادم.',
    time: '2024-09-13T14:30:00',
    comments: [],
  },
];

const DiscussionsDetails = () => {
  const [discussions, setDiscussions] = useState(mockDiscussions);
  const [newTopic, setNewTopic] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newComment, setNewComment] = useState('');

  const handleAddDiscussion = () => {
    const newDiscussion = {
      id: discussions.length + 1,
      author: 'Ahmed Ali',
      topic: newTopic,
      message: newMessage,
      time: new Date().toISOString(),
      comments: [],
    };
    setDiscussions([...discussions, newDiscussion]);
    setNewTopic('');
    setNewMessage('');
  };

  const handleAddComment = discussionId => {
    const updatedDiscussions = discussions.map(discussion => {
      if (discussion.id === discussionId) {
        return {
          ...discussion,
          comments: [...discussion.comments, { author: 'Ahmed Ali', message: newComment }],
        };
      }
      return discussion;
    });
    setDiscussions(updatedDiscussions);
    setNewComment('');
  };

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
        {discussions.map(discussion => (
          <div key={discussion.id} className={styles.discussionItem}>
            <div className={styles.discussionHeader}>
              <FaUserCircle className={styles.userIcon} />
              <div className={styles.discussionAuthor}>{discussion.author}</div>
              <div className={styles.discussionTime}>{new Date(discussion.time).toLocaleString('ar-EG')}</div>
            </div>
            <div className={styles.discussionTopic}>{discussion.topic}</div>
            <div className={styles.discussionMessage}>{discussion.message}</div>
            <div className={styles.commentsSection}>
              <h4>التعليقات</h4>
              {discussion.comments.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <FaUserCircle className={styles.userIcon} />
                  <div className={styles.commentAuthor}>{comment.author}</div>
                  <div className={styles.commentMessage}>{comment.message}</div>
                </div>
              ))}
              <div className={styles.commentInput}>
                <textarea
                  placeholder='أضف تعليق...'
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className={styles.textareaField}></textarea>
                <button onClick={() => handleAddComment(discussion.id)} className={styles.addButton}>
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
