import React from 'react';
import { FaPlus } from 'react-icons/fa';

import styles from './styles/VotingSystem.module.scss';

const VotingSystem = ({ votings, handleVote, addNewVoting }) => {
  return (
    <div className={styles.votingContainer}>
      <div className={`${styles.sectionHeaderTitle} ${styles.flexSpaceBetween}`}>
        <button onClick={addNewVoting} className={styles.sharedButton}>
          إضافة تصويت جديد
          <FaPlus className={styles.addIcon} />
        </button>
        <h5>نظام التصويت</h5>
      </div>
      <div className={styles.votingSection}>
        {votings?.map(voting => (
          <div key={voting.id} className={styles.votingCard}>
            <h5>{voting.question}</h5>
            <ul>
              {voting.options?.map(option => (
                <li key={option.id}>
                  <span>{option.text}</span>
                  <button onClick={() => handleVote(voting.id, option.id)} className={styles.voteButton}>
                    تصويت
                  </button>
                  <span>{option.votes} أصوات</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingSystem;
