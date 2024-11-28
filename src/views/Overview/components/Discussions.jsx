import React, { useState } from 'react';
import { FaPlus, FaUserCircle } from 'react-icons/fa';
import './DiscussionsStyles.scss';

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

const Discussions = () => {
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
    <div className='discussions-page'>
      <h1>نقاشات داخل اللجنة</h1>
      <div className='discussion-input'>
        <input type='text' placeholder='أدخل عنوان النقاش...' value={newTopic} onChange={e => setNewTopic(e.target.value)} />
        <textarea placeholder='أدخل رسالتك...' value={newMessage} onChange={e => setNewMessage(e.target.value)}></textarea>
        <button onClick={handleAddDiscussion}>
          <FaPlus /> أضف النقاش
        </button>
      </div>
      <div className='discussions-list'>
        {discussions.map(discussion => (
          <div key={discussion.id} className='discussion-item'>
            <div className='discussion-header'>
              <FaUserCircle className='user-icon' />
              <div className='discussion-author'>{discussion.author}</div>
              <div className='discussion-time'>{new Date(discussion.time).toLocaleString('ar-EG')}</div>
            </div>
            <div className='discussion-topic'>{discussion.topic}</div>
            <div className='discussion-message'>{discussion.message}</div>
            <div className='comments-section'>
              <h4>التعليقات</h4>
              {discussion.comments.map((comment, index) => (
                <div key={index} className='comment'>
                  <FaUserCircle className='user-icon' />
                  <div className='comment-author'>{comment.author}</div>
                  <div className='comment-message'>{comment.message}</div>
                </div>
              ))}
              <div className='comment-input'>
                <textarea placeholder='أضف تعليق...' value={newComment} onChange={e => setNewComment(e.target.value)}></textarea>
                <button onClick={() => handleAddComment(discussion.id)}>أضف تعليق</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discussions;
