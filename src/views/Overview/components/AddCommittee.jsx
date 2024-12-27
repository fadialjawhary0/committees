import React, { useEffect, useState } from 'react';
import { FaUpload, FaFile, FaTrashAlt, FaChevronDown, FaPlus } from 'react-icons/fa';
import styles from './AddCommittee.module.scss';

import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { Checkbox, Modal } from '@mui/material';
import { CommitteeMembersServices, CommitteeServices } from '../services/committees.service';

const AddCommittee = () => {
  const [formFields, setFormFields] = useState({
    name: '',
    number: '',
    shortName: '',
    meetingTemplateName: '',

    formationDate: '',
    startDate: '',
    endDate: '',

    departmentID: '',
    categoryID: '',
    members: [],
    files: [],
  });

  const [fieldsFetchedItems, setFieldsFetchedItems] = useState({
    departments: [],
    categories: [],
    users: [],
    roles: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formItems = await CommitteeServices?.commonFormItems();

        setFieldsFetchedItems({
          departments: formItems?.Departments,
          categories: formItems?.CommitteeCategories,
          users: formItems?.SystemUsers,
          roles: formItems?.Roles,
        });
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    const preparedData = {
      ArabicName: formFields?.name,
      EnglishName: formFields?.name,
      Number: formFields?.number,
      ShortName: formFields?.shortName,
      MeetingTemplateName: formFields?.meetingTemplateName,
      FormationDate: formFields?.formationDate,
      StartDate: formFields?.startDate,
      EndDate: formFields?.endDate,
      CategoryID: parseInt(formFields?.categoryID),
      DepID: parseInt(formFields?.departmentID),
    };

    try {
      const response = await CommitteeServices.create(preparedData);

      const membersData = formFields?.members.map(member => ({
        CommitteeID: response?.NewCommitteeID,
        UserID: member?.id,
        CommitteeHead: member?.role === 'مدير',
      }));

      await Promise.all(membersData.map(member => CommitteeMembersServices.create(member)));
    } catch (error) {
      console.error('Error adding the Committee:', error);
    }
  };

  const handleFileChange = e => {
    setFormFields({ ...formFields, files: Array.from(e.target.files) });
  };

  const handleDeleteFile = index => {
    const updatedFiles = formFields?.files.filter((_, i) => i !== index);
    setFormFields({ ...formFields, files: updatedFiles });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCheckboxChange = (userId, checked) => {
    setSelectedUsers(prev => ({
      ...prev,
      [userId]: { ...prev[userId], role: checked ? fieldsFetchedItems?.roles[0].name : '', checked },
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
      .map(([id, user]) => ({
        id: Number(id),
        name: fieldsFetchedItems?.users.find(u => u.ID === Number(id)).UserFullName,
        role: user.role,
        roleID: fieldsFetchedItems?.roles.find(r => r.NameArabic === user?.role).ID,
      }));
    setFormFields({ ...formFields, members: newMembers });
    toggleModal();
  };

  const handleDeleteMember = index => {
    const memberToRemove = formFields?.members[index];
    setFormFields(prev => ({ ...prev, members: prev.members.filter((_, i) => i !== index) }));

    setSelectedUsers(prev => {
      const updatedUsers = { ...prev };
      if (memberToRemove) {
        delete updatedUsers[memberToRemove.id];
      }
      return updatedUsers;
    });
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h4>إضافة لجنة جديدة</h4>
      </div>
      <form>
        <div className={styles.formColumns}>
          <div className={styles.formGroup}>
            <label>اسم اللجنة</label>
            <input
              type='text'
              id='committeeName'
              value={formFields?.name}
              onChange={e => setFormFields({ ...formFields, name: e.target.value })}
              placeholder='أدخل اسم اللجنة'
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>رقم اللجنة</label>
            <input
              type='text'
              id='committeeNumber'
              value={formFields?.number}
              onChange={e => setFormFields({ ...formFields, number: e.target.value })}
              placeholder='أدخل رقم اللجنة'
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>اسم اللجنة المختصر</label>
            <input
              type='text'
              id='shortName'
              value={formFields?.shortName}
              onChange={e => setFormFields({ ...formFields, shortName: e.target.value })}
              placeholder='أدخل اسم اللجنة المختصر'
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>اسم نموذج الإجتماع</label>
            <input
              type='text'
              id='templateName'
              value={formFields?.meetingTemplateName}
              onChange={e => setFormFields({ ...formFields, meetingTemplateName: e.target.value })}
              placeholder='أدخل اسم نموذج الإجتماع'
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>تاريخ تشكيل اللجنة</label>
            <input
              type='date'
              value={formFields?.formationDate}
              onChange={e => setFormFields({ ...formFields, formationDate: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>تاريخ البدء</label>
            <input
              type='date'
              id='startDate'
              value={formFields?.startDate}
              onChange={e => setFormFields({ ...formFields, startDate: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>تاريخ الانتهاء</label>
            <input
              type='date'
              id='endDate'
              value={formFields?.endDate}
              onChange={e => setFormFields({ ...formFields, endDate: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>نوع اللجنة</label>
            <div className={`${styles.selectContainer} select-container`}>
              <select
                id='committeeType'
                value={formFields?.categoryID}
                onChange={e => setFormFields({ ...formFields, categoryID: e.target.value })}
                required>
                <option value=''>اختر نوع اللجنة</option>
                {fieldsFetchedItems?.categories.map(type => (
                  <option key={type?.ID} value={type?.ID}>
                    {type?.ArabicName}
                  </option>
                ))}
              </select>
              <FaChevronDown />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>اختر القسم</label>
            <div className={`${styles.selectContainer} select-container`}>
              <select
                id='departmentType'
                value={formFields?.departmentID}
                onChange={e => setFormFields({ ...formFields, departmentID: e.target.value })}
                required>
                <option value=''>اختر القسم</option>
                {fieldsFetchedItems?.departments.map(type => (
                  <option key={type?.ID} value={type?.ID}>
                    {type?.ArabicName}
                  </option>
                ))}
              </select>
              <FaChevronDown />
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <div className={styles.usersTableHeader}>
              <label>أعضاء اللجنة</label>
              <button type='button' className={styles.sharedButton} onClick={toggleModal}>
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
                  {formFields?.members.length === 0 ? (
                    <tr>
                      <td colSpan='3'>
                        <p className={styles.emptyTableLabel}>لا يوجد أعضاء</p>
                      </td>
                    </tr>
                  ) : (
                    formFields?.members.map((member, index) => (
                      <tr key={index}>
                        <td>{member.name}</td>
                        <td>{member.role}</td>
                        <td>
                          <button type='button' className={styles.deleteButton} onClick={() => handleDeleteMember(index)}>
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
                  {fieldsFetchedItems?.users.map(user => (
                    <tr key={user?.ID}>
                      <td>
                        <select
                          value={selectedUsers[user?.ID]?.role || ''}
                          onChange={e => handleRoleChange(user?.ID, e.target.value)}
                          disabled={!selectedUsers[user?.ID]?.checked}
                          className={styles.roleSelect}>
                          <option value='' disabled>
                            اختر دور
                          </option>
                          {fieldsFetchedItems?.roles.map(role => (
                            <option key={role?.ID} value={role?.NameArabic}>
                              {role?.NameArabic}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{user?.UserFullName}</td>
                      <td>
                        <Checkbox
                          checked={selectedUsers[user?.ID]?.checked || false}
                          onChange={e => handleCheckboxChange(user?.ID, e.target.checked)}
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
              {formFields?.files.length > 0 &&
                formFields?.files.map((file, index) => (
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
          <button type='submit' className={styles.saveButton} onClick={handleSubmit}>
            <SaveIcon /> حفظ
          </button>
          <button type='button' className={styles.cancelButton}>
            <CancelIcon /> الغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommittee;
