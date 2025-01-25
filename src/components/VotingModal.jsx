import React from 'react';
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa';

import styles from './styles/VotingModal.module.scss';

const VotingModal = ({
  isModalOpen,
  handleSaveVoting,
  handleCancel,
  handleAddOption,
  newVoting,
  newOption,
  setNewVoting,
  setNewOption,
}) => {
  return (
    <>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>إنشاء تصويت جديد</h2>
            <label>السؤال:</label>
            <input
              type='text'
              value={newVoting?.Question}
              onChange={e => setNewVoting({ ...newVoting, Question: e.target.value })}
              placeholder='أدخل سؤال التصويت'
            />
            <label>الإختيارات:</label>
            <div className={styles.optionInput}>
              <button onClick={handleAddOption} className={styles.addOptionButton}>
                <FaPlus />
              </button>
              <input type='text' value={newOption} onChange={e => setNewOption(e.target.value)} placeholder='أدخل خيار جديد' />
            </div>
            <ul className={styles.optionList}>
              {newVoting?.Choices?.map(option => (
                <li key={Math.random()}>{option}</li>
              ))}
            </ul>
            <div className={styles.modalActions}>
              <button onClick={handleCancel} className={styles.cancelButton}>
                <FaTimes />
                <p>إلغاء</p>
              </button>
              <button onClick={handleSaveVoting} className={styles.saveButton}>
                <FaSave />
                <p>حفظ</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VotingModal;
