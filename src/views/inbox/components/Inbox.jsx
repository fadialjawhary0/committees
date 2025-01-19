import React, { useState, useEffect } from 'react';
import { FaReply } from 'react-icons/fa';
import styles from './Inbox.module.scss';
// import InboxFilters from './InboxFilters';
import apiService from '../../../services/axiosApi.service';

const Inbox = () => {
  // const [filter, setFilter] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  console.log('🚀 ~ Inbox ~ selectedMessage:', selectedMessage);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  // const handleFilterChange = status => {
  //   setFilter(status);
  //   console.log(status);
  // };

  const handleMemberClick = async member => {
    await apiService
      .getById(
        'GetCommitteeMessageByCommittee',
        `${localStorage.getItem('selectedCommitteeID')}/${+localStorage.getItem('memberID')}/${member?.ID}/${false}`,
      )
      .then(data => {
        setSelectedMessage(data);
      });

    setSelectedMember(member);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await apiService.getById('GetAllMember', +localStorage.getItem('selectedCommitteeID')).then(data => {
          setMembers(data?.filter(member => member?.ID !== +localStorage.getItem('memberID')));
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const handleSendMessage = async () => {
    const data = {
      CommitteeId: +localStorage.getItem('selectedCommitteeID'),
      SenderID: +localStorage.getItem('memberID'),
      ReciverID: selectedMember?.ID,
      IsRead: false,
      CreatedAt: new Date().toISOString(),
      Message: messageContent,
      IsPublic: false,
    };
    await apiService.create('AddCommitteeMessage', data);
    setMessageContent('');

    await apiService
      .getById(
        'GetCommitteeMessageByCommittee',
        `${localStorage.getItem('selectedCommitteeID')}/${+localStorage.getItem('memberID')}/${selectedMember?.ID}/${false}`,
      )
      .then(data => {
        setSelectedMessage(data);
      });
  };

  return (
    <div>
      {/* <InboxFilters statusOptions={statusOptions} handleFilterChange={handleFilterChange} /> */}

      <div className={styles.inboxContainer}>
        <aside className={styles.messageList}>
          {members?.map(member => (
            <div
              key={member?.ID}
              className={`${styles.messageCard} 
            ${selectedMember?.ID === member?.ID ? styles.selectedMember : ''}
            `}
              onClick={() => handleMemberClick(member)}>
              <p className={styles.memberName}>{member?.Name}</p>
            </div>
          ))}
        </aside>
        <main className={styles.messageViewer}>
          {selectedMessage ? (
            <>
              <h4 className={styles.messageHeader}>{selectedMember?.Name} ارسال الى</h4>
              {selectedMessage?.map(message => (
                <div
                  key={message?.ID}
                  className={`${styles.messageCard} ${
                    +localStorage.getItem('memberID') === message?.SenderID ? styles.sentMessage : styles.receivedMessage
                  }`}>
                  <p className={styles.senderName}>
                    {+localStorage.getItem('memberID') === message?.SenderID ? 'You' : message?.SenderName}
                  </p>
                  <p className={styles.messageContent}>{message?.Message}</p>
                </div>
              ))}

              <div className={styles.replyContainer}>
                <textarea
                  className={styles.replyInput}
                  placeholder='اكتب رسالتك هنا...'
                  value={messageContent}
                  onChange={e => setMessageContent(e.target.value)}
                />
                <button className={styles.replyButton} onClick={handleSendMessage}>
                  ارسال
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
