import React from 'react';
import Modal from '@mui/material/Modal';
import styles from './styles/DeleteModal.module.scss';
import { FaTrashAlt } from 'react-icons/fa';

const DeleteModal = ({ isOpen, onClose, title, description, onDelete }) => {
  return (
    <Modal open={isOpen} onClose={onClose} className={styles.deleteModalContainer}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <FaTrashAlt className={styles.deleteIcon} />
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className={styles.deleteModalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            إلغاء
          </button>
          <button className={styles.deleteButton} onClick={onDelete}>
            مسح
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
