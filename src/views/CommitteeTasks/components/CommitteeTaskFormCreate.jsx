import React, { useEffect, useState } from 'react';

import styles from './CommitteeTaskFormCreate.module.scss';
import apiService from '../../../services/axiosApi.service';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { COMMITTEE_TASK_STATUS, LogTypes, ToastMessage } from '../../../constants';
import { useToast } from '../../../context';
import { FaArrowLeft } from 'react-icons/fa';

const CommitteeTaskFormCreate = () => {
  const { showToast } = useToast();

  const [formFields, setFormFields] = useState({
    TaskName: '',
    CommitteeName: localStorage.getItem('selectedCommitteeName'),
    Description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);

    const taskPayload = {
      ArabicName: formFields?.TaskName,
      EnglishName: formFields?.TaskName,
      ArabicDescription: formFields?.Description,
      EnglishDescription: formFields?.Description,
      CommitteeID: parseInt(localStorage.getItem('selectedCommitteeID')),
      StatusID: COMMITTEE_TASK_STATUS?.NOT_STARTED,
      IsDeleted: false,
    };

    try {
      await apiService.create('AddCommitteeTask', taskPayload, LogTypes?.Task?.CommitteeTaskCreate);

      showToast(ToastMessage?.CommitteeTaskSuccessCreation, 'success');
      window.history.back();
    } catch (error) {
      console.error('Error saving the Meeting, Agenda, or Members:', error);
      showToast(ToastMessage?.SomethingWentWrong, 'error');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />

        <h4>إضافة مهمة جديدة</h4>
      </div>
      <form onSubmit={handleSave}>
        <div className={styles.formColumns}>
          <div className={styles.formGroup}>
            <label>اسم المهمة</label>
            <input
              type='text'
              id='TaskName'
              value={formFields?.TaskName}
              onChange={e => setFormFields({ ...formFields, TaskName: e.target.value })}
              placeholder='أدخل اسم المهمة'
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>اسم اللجنة</label>
            <input type='text' id='CommitteeName' value={formFields?.CommitteeName} placeholder='أدخل اسم اللجنة' disabled />
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label>وصف المهمة</label>
            <textarea
              style={{ width: '100%' }}
              rows={4}
              value={formFields?.Description}
              onChange={e => setFormFields({ ...formFields, Description: e.target.value })}
              placeholder='أدخل وصف المهمة'
            />
          </div>
        </div>

        {/***** Form Buttons *****/}
        <div className={styles.formButtonsContainer}>
          <button type='submit' className={`${styles.saveButton} ${loading ? styles.loading : ''}`} disabled={loading}>
            <SaveIcon /> حفظ
            {loading && <span className={styles.loader}></span>}
          </button>

          <button type='button' className={styles.cancelButton} onClick={() => window.history.back()} disabled={loading}>
            <CancelIcon /> الغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommitteeTaskFormCreate;
