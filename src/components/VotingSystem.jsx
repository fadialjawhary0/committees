import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import styles from './styles/VotingSystem.module.scss';

const VotingSystem = ({ votings, handleVote, addNewVoting, numOfMembers }) => {
  const [selectedChoices, setSelectedChoices] = useState({});

  const calculatePercentage = voteCount => {
    if (!numOfMembers || numOfMembers === 0) return '0%';
    return `${Math.round((voteCount / numOfMembers) * 100)}%`;
  };

  const handleCheckboxChange = (votingID, choiceID) => {
    setSelectedChoices(prev => ({
      ...prev,
      [votingID]: choiceID,
    }));

    handleVote(votingID, choiceID);
  };

  return (
    <div className={styles.votingContainer}>
      <div className={`${styles.sectionHeaderTitle} ${styles.flexSpaceBetween}`}>
        <button onClick={addNewVoting} className={styles.sharedButton}>
          إضافة تصويت جديد
          <FaPlus className={styles.addIcon} />
        </button>
        <h5>نظام التصويت</h5>
      </div>
      {!votings.length ? (
        <div className={styles.noVotings}>
          <h6 className={styles.noData}>لا يوجد أي تصويتات حالياً.</h6>
        </div>
      ) : (
        <>
          <div className={styles.votingSection}>
            {votings?.map(voting => (
              <div key={voting?.ID} className={styles.votingCard}>
                <h5>{voting?.Question}</h5>
                <div className={styles.choicesContainer}>
                  {voting?.Choices?.map(choice => (
                    <div key={choice?.ID} className={styles.choiceContainer}>
                      <div className={styles.choice}>
                        <div className={styles.choiceText}>
                          <input
                            type='checkbox'
                            id={choice?.ID}
                            name={`voting-${voting?.ID}`}
                            value={choice?.ID}
                            checked={selectedChoices[voting?.ID] === choice?.ID || choice?.IsSelectedByUser === true}
                            onChange={() => handleCheckboxChange(voting?.ID, choice?.ID)}
                          />
                          <label htmlFor={choice?.ID}>{choice?.Text}</label>
                        </div>
                        <p className={styles.voteCount}>{calculatePercentage(choice?.VoteCount)}</p>
                      </div>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progress}
                          style={{
                            width: calculatePercentage(choice?.VoteCount),
                          }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VotingSystem;
