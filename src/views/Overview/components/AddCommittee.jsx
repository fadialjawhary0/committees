import React, { useState } from 'react';
import { FaArrowLeft, FaUpload, FaFile, FaTrashAlt, FaChevronDown, FaPlus } from 'react-icons/fa';
import styles from './AddCommittee.module.scss';

import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Checkbox, FormControlLabel, MenuItem, Modal, Select } from '@mui/material';

const AddCommittee = () => {
  const [committeeName, setCommitteeName] = useState('');
  const [committeeNumber, setCommitteeNumber] = useState('');
  const [formationDate, setFormationDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [committeeType, setCommitteeType] = useState('');
  const [committeeClassification, setCommitteeClassification] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState({});

  const peopleData = [
    { id: 1, name: 'Ahmed Ali' },
    { id: 2, name: 'Fatima Hassan' },
    { id: 3, name: 'Mohammed Saleh' },
    { id: 4, name: 'Sara Ahmad' },
    { id: 5, name: 'Khaled Youssef' },
    { id: 6, name: 'Amal Nasser' },
    { id: 7, name: 'Rania Omar' },
    { id: 8, name: 'Yousef Al-Qassim' },
    { id: 9, name: 'Hiba Mustafa' },
    { id: 10, name: 'Omar Hussein' },
    { id: 11, name: 'Nour Al-Din' },
    { id: 12, name: 'Ayman Ziad' },
    { id: 13, name: 'Lina Mahmoud' },
    { id: 14, name: 'Rami Ibrahim' },
    { id: 15, name: 'Fadi Hassan' },
    { id: 16, name: 'Maha Khalil' },
    { id: 17, name: 'Alaa Sami' },
    { id: 18, name: 'Hassan Younes' },
    { id: 19, name: 'Dina Adel' },
    { id: 20, name: 'Bashar Al-Sayed' },
    { id: 21, name: 'Sahar Ramzi' },
    { id: 22, name: 'Nasser Fouad' },
    { id: 23, name: 'Hana Saleh' },
    { id: 24, name: 'Ayman Hassan' },
    { id: 25, name: 'Laila Mahmoud' },
  ];

  const roles = [
    {
      id: 1,
      name: 'عضو',
    },
    {
      id: 2,
      name: 'رئيس اللجنة',
    },
    {
      id: 3,
      name: 'نائب رئيس اللجنة',
    },
    {
      id: 4,
      name: 'أمين اللجنة',
    },
  ];

  const handleSave = () => {
    console.log({
      committeeName,
      committeeNumber,
      startDate,
      endDate,
      committeeType,
      committeeClassification,
      description,
      files,
    });
  };

  const handleFileChange = e => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const handleDeleteFile = index => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCheckboxChange = (userId, checked) => {
    setSelectedUsers(prev => ({
      ...prev,
      [userId]: { ...prev[userId], role: checked ? roles[0].name : '', checked },
    }));
  };

  const handleRoleChange = (userId, role) => {
    setSelectedUsers(prev => ({
      ...prev,
      [userId]: { ...prev[userId], role },
    }));
  };

  const addMembers = () => {
    const newMembers = Object.entries(selectedUsers)
      .filter(([, user]) => user.checked && user.role)
      .map(([id, user]) => ({ id: Number(id), name: peopleData.find(u => u.id === Number(id)).name, role: user.role }));
    setMembers(newMembers);
    toggleModal();
  };

  const handleDeleteMember = index => {
    const memberToRemove = members[index];
    setMembers(prevMembers => prevMembers.filter((_, i) => i !== index));

    setSelectedUsers(prev => {
      const updatedUsers = { ...prev };
      if (memberToRemove) {
        delete updatedUsers[memberToRemove.id];
      }
      return updatedUsers;
    });
  };

  return (
    <div>
      <div className={styles.formHeader}>
        <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />
        <h4>إضافة لجنة جديدة</h4>
      </div>
      <form>
        <div className={styles.formColumns}>
          <div className={styles.formGroup}>
            <label>اسم اللجنة</label>
            <input
              type='text'
              id='committeeName'
              value={committeeName}
              onChange={e => setCommitteeName(e.target.value)}
              placeholder='أدخل اسم اللجنة'
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>رقم اللجنة</label>
            <input
              type='text'
              id='committeeNumber'
              value={committeeNumber}
              onChange={e => setCommitteeNumber(e.target.value)}
              placeholder='أدخل رقم اللجنة'
              required
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label>الوصف</label>
            <textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='أدخل وصف اللجنة'
              required></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>تاريخ تشكيل اللجنة</label>
            <input type='date' value={formationDate} onChange={e => setFormationDate(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label>نوع اللجنة</label>
            <div className={`${styles.selectContainer} select-container`}>
              <select id='committeeType' value={committeeType} onChange={e => setCommitteeType(e.target.value)} required>
                <option value=''>اختر نوع اللجنة</option>
              </select>
              <FaChevronDown />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>تاريخ البدء</label>
            <input type='date' id='startDate' value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label>تاريخ الانتهاء</label>
            <input type='date' id='endDate' value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label>تصنيف اللجنة</label>
            <div className={`${styles.selectContainer} select-container`}>
              <select
                id='committeeClassification'
                value={committeeClassification}
                onChange={e => setCommitteeClassification(e.target.value)}
                required>
                <option value=''>اختر تصنيف اللجنة</option>
              </select>
              <FaChevronDown />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <div className={styles.usersTableHeader}>
              <label>أعضاء اللجنة</label>
              <button type='button' className={styles.usersTableAddButton} onClick={toggleModal}>
                <FaPlus /> إضافة أعضاء
              </button>
            </div>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>الدور</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan='3'>
                        <p className={styles.emptyTableLabel}>لا يوجد أعضاء</p>
                      </td>
                    </tr>
                  ) : (
                    members.map((member, index) => (
                      <tr key={index}>
                        <td>{member.name}</td>
                        <td>{member.role}</td>
                        <td>
                          <button type='button' className={styles.tableDeleteButton} onClick={() => handleDeleteMember(index)}>
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Modal open={isModalOpen} onClose={toggleModal} className={styles.usersModal}>
            <div className={`${styles.modal} ${styles.tableContainer}`}>
              <table>
                <thead>
                  <tr>
                    <th>الدور</th>
                    <th>الاسم</th>
                    <th>إضافة</th>
                  </tr>
                </thead>
                <tbody>
                  {peopleData.map(user => (
                    <tr key={user.id}>
                      <td>
                        <select
                          value={selectedUsers[user.id]?.role || ''}
                          onChange={e => handleRoleChange(user.id, e.target.value)}
                          disabled={!selectedUsers[user.id]?.checked}
                          className={styles.roleSelect}>
                          <option value='' disabled>
                            اختر دور
                          </option>
                          {roles.map(role => (
                            <option key={role.id} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{user.name}</td>
                      <td>
                        <Checkbox
                          checked={selectedUsers[user.id]?.checked || false}
                          onChange={e => handleCheckboxChange(user.id, e.target.checked)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={`${styles.formButtonsContainer} ${styles.usersFormButtonsContainer}`}>
                <button type='button' className={styles.usersCancelButton} onClick={toggleModal}>
                  الغاء
                  <CancelIcon />
                </button>
                <button type='button' className={styles.usersSaveButton} onClick={addMembers}>
                  إضافة <SaveIcon />
                </button>
              </div>
            </div>
          </Modal>

          <div className={`${styles.fileUploadGroup} ${styles.formGroupFullWidth}`}>
            <label htmlFor='files' className={styles.fileUploadLabel}>
              <FaFile className={styles.fileUploadIcon} /> رفع ملفات اللجنة
            </label>
            <input type='file' id='files' multiple onChange={handleFileChange} className={styles.fileInput} />
            <div className={styles.filePreview}>
              {files.length > 0 &&
                files.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <FaUpload className={styles.fileIcon} />
                    <span>{file.name}</span>
                    <FaTrashAlt className={styles.deleteFileIcon} onClick={() => handleDeleteFile(index)} />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={styles.formButtonsContainer}>
          <button type='submit' className={styles.saveButton} onClick={handleSave}>
            <SaveIcon /> حفظ
          </button>
          <button type='button' className={styles.cancelButton} onClick={handleSave}>
            <CancelIcon /> الغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommittee;
