import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPen, FaTrash } from 'react-icons/fa';

import { FormatDateToArabicShort } from '../../../../helpers';

import styles from './CommitteeHeader.module.scss';
import { DeleteModalConstants } from '../../../../constants';
import { CommitteeServices } from '../../services/committees.service';
import DeleteModal from '../../../../components/DeleteModal';

const CommitteeHeader = ({ setIsModalOpen, isModalOpen, committee }) => {
  const navigate = useNavigate();

  const handleEditCommittee = () => {
    navigate(`/committee/edit/${committee?.ID}`);
  };

  const handleDeleteCommittee = async () => {
    try {
      await CommitteeServices.delete(committee?.ID);
      navigate('/');
    } catch (error) {
      console.error('Error deleting committee:', error);
    }
  };

  const toggleDeleteCommitteeModal = () => {
    setIsModalOpen({ ...isModalOpen, deleteCommittee: !isModalOpen.deleteCommittee });
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.headerActions}>
          <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />
          <button
            className={styles.deleteButton}
            onClick={() => {
              setIsModalOpen({ ...isModalOpen, deleteCommittee: true });
            }}>
            حذف <FaTrash />
          </button>

          <button className={styles.editButton} onClick={handleEditCommittee}>
            تعديل <FaPen />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignContent: 'center', justifyContent: 'center' }}>
          <p className={styles.committeeDate}>تاريخ تشكيل اللجنة: {FormatDateToArabicShort(committee?.FormationDate)}</p>
          <h4>{committee?.ArabicName}</h4>
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen.deleteCommittee}
        onClose={toggleDeleteCommitteeModal}
        onDelete={handleDeleteCommittee}
        title={DeleteModalConstants?.COMMITTEE_TITLE}
        description={DeleteModalConstants?.COMMITTEE_DESCRIPTION}
      />
    </>
  );
};

export default CommitteeHeader;
