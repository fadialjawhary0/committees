import React from 'react';
import { FaPlus } from 'react-icons/fa';

import styles from './styles/VotingSystem.module.scss';

const VotingSystem = ({ votings, handleVote, addNewVoting }) => {
  return (
    <>
      <div className={styles.votingHeader}>
        <button onClick={addNewVoting} className={styles.sharedButton}>
          <p>إضافة تصويت جديد</p>
          <FaPlus className={styles.addIcon} />
        </button>
        <h2>نظام التصويت</h2>
      </div>
      <div className={styles.votingSection}>
        {votings.map(voting => (
          <div key={voting.id} className={styles.votingCard}>
            <h5>{voting.question}</h5>
            <ul>
              {voting.options.map(option => (
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
    </>
  );
};

export default VotingSystem;
