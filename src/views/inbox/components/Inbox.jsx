import React, { useState } from 'react';
import { FaFilter, FaReply, FaPaperPlane } from 'react-icons/fa';
import styles from './Inbox.module.scss';

// Dummy data
const messages = [
  {
    id: 1,
    sender: 'أحمد علي',
    subject: 'طلب اجتماع الأسبوع القادم',
    content: 'مرحباً، أريد التأكد من حضورك الاجتماع المقرر يوم الأحد القادم. شكراً!',
    date: '2024-11-26',
    status: 'unread',
  },
  {
    id: 2,
    sender: 'فاطمة حسن',
    subject: 'متابعة مشروع العميل',
    content: 'مرحباً، أرجو إرسال مستندات المشروع الأخيرة لمراجعتي. تحياتي.',
    date: '2024-11-25',
    status: 'read',
  },
  {
    id: 3,
    sender: 'محمد إبراهيم',
    subject: 'استفسار حول العقد الجديد',
    content: 'مرحباً، أود الاستفسار عن تفاصيل العقد الجديد. شكراً!',
    date: '2024-11-24',
    status: 'unread',
  },
];

// Filters
const statuses = ['الكل', 'غير مقروء', 'مقروء'];

const Inbox = () => {
  const [filter, setFilter] = useState('الكل');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const filteredMessages = filter === 'الكل' ? messages : messages.filter(msg => msg.status === (filter === 'غير مقروء' ? 'unread' : 'read'));

  const handleFilterChange = status => setFilter(status);
  const handleMessageClick = message => setSelectedMessage(message);

  return (
    <div className={styles.inboxPage}>
      <header className={styles.header}>
        <div className={styles.filterContainer}>
          <select className={styles.filterDropdown} value={filter} onChange={e => handleFilterChange(e.target.value)}>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <FaFilter className={styles.filterIcon} />
        </div>
      </header>
      <div className={styles.inboxContainer}>
        <aside className={styles.messageList}>
          {filteredMessages.map(message => (
            <div
              key={message.id}
              className={`${styles.messageCard} ${message.status === 'unread' ? styles.unread : styles.read}`}
              onClick={() => handleMessageClick(message)}>
              <p className={styles.sender}>{message.sender}</p>
              <p className={styles.subject}>{message.subject}</p>
              <p className={styles.date}>{message.date}</p>
            </div>
          ))}
        </aside>
        <main className={styles.messageViewer}>
          {selectedMessage ? (
            <>
              <h4 className={styles.messageSubject}>{selectedMessage.subject}</h4>
              <p className={styles.messageContent}>{selectedMessage.content}</p>
              <div className={styles.replyContainer}>
                <textarea className={styles.replyInput} placeholder='اكتب رسالتك هنا...' />
                <button className={styles.replyButton}>
                  رد
                  <FaReply />
                </button>
              </div>
            </>
          ) : (
            <p className={styles.placeholder}>اختر رسالة لعرض محتواها والرد عليها.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Inbox;
