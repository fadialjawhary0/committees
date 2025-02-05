import React, { useCallback, useEffect, useState } from 'react';
import { FaChevronDown, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import styles from './CommitteeForms.module.scss';

import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { Checkbox, Modal } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ExtractDateFromDateTime } from '../../../helpers';
import apiService from '../../../services/axiosApi.service';
import { ALLOWED_FILE_EXTENSIONS, LogTypes, MAX_FILE_SIZE_MB, ToastMessage } from '../../../constants';
import { useToast } from '../../../context';

const CommitteeFormEdit = () => {
  const { showToast } = useToast();
  const { id } = useParams();

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
    relatedAttachments: [],
    IsDeleted: false,
  });

  const [fieldsFetchedItems, setFieldsFetchedItems] = useState({
    departments: [],
    categories: [],
    users: [],
    roles: [],
    permissions: [],
    members: [],
    fileTypes: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      const [committeeDetails, categories, departments, users, roles, permissions, members, fileTypes] = await Promise.all([
        apiService.getById('GetCommittee', id),
        apiService.getAll('/GetAllCommCat'),
        apiService.getAll('/GetAllDepartment'),
        apiService.getAll('/GetAllSystemUser'),
        apiService.getAll('/GetAllRole'),
        apiService.getAll('/GetAllPermission'),
        apiService.getById('/GetAllMember', id),
        apiService.getAll('/GetAllAttachmentType'),
      ]);

      setFormFields({
        name: committeeDetails?.CommitteeDetails?.ArabicName || '',
        number: committeeDetails?.CommitteeDetails?.Number || '',
        shortName: committeeDetails?.CommitteeDetails?.ShortName || '',
        meetingTemplateName: committeeDetails?.CommitteeDetails?.MeetingTemplateName || '',
        formationDate: ExtractDateFromDateTime(committeeDetails?.CommitteeDetails?.FormationDate) || '',
        startDate: ExtractDateFromDateTime(committeeDetails?.CommitteeDetails?.StartDate) || '',
        endDate: ExtractDateFromDateTime(committeeDetails?.CommitteeDetails?.EndDate) || '',
        departmentID: committeeDetails?.CommitteeDetails?.DepID || '',
        categoryID: committeeDetails?.CommitteeDetails?.CategoryID || '',
        members: committeeDetails?.Members || [],
        relatedAttachments: committeeDetails?.RelatedAttachments || [],
        IsDeleted: false,
      });

      setFieldsFetchedItems({
        departments,
        categories,
        users,
        roles,
        permissions,
        members,
        fileTypes,
      });
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleSubmit = async e => {
    e.preventDefault();

    const preparedData = {
      ID: parseInt(id),
      ArabicName: formFields?.name,
      EnglishName: formFields?.name,
      Number: formFields?.number,
      ShortName: formFields?.shortName,
      MeetingTemplateName: formFields?.meetingTemplateName,
      FormationDate: formFields?.formationDate,
      StartDate: formFields?.startDate,
      EndDate: formFields?.endDate,
      DepID: parseInt(formFields?.departmentID),
      CategoryID: parseInt(formFields?.categoryID),
      IsDeleted: formFields?.IsDeleted,
    };

    try {
      await apiService?.update('UpdateCommittee', preparedData, LogTypes?.Committee?.Update);

      const originalAttachments = await apiService.getById('GetAllRelatedAttachmentByCommitteeID', id);

      const updatedAttachments = formFields?.relatedAttachments?.filter(file => {
        const originalFile = originalAttachments.find(orig => orig.ID === file.ID);
        return originalFile && originalFile.AttachmentTypeID !== file.AttachmentTypeID;
      });

      for (const file of updatedAttachments) {
        await apiService?.update(
          '/UpdateRelatedAttachment',
          {
            ID: +file?.ID,
            CommitteeID: +id,
            DocumentContent: file?.DocumentContent,
            DocumentExt: file?.DocumentExt,
            DocumentName: file?.DocumentName,
            AttachmentTypeID: +file?.AttachmentTypeID,
            IsDeleted: false,
          },
          LogTypes?.Files?.Update,
        );
      }

      const originalFilesIDs = originalAttachments.map(file => file?.ID);
      const currentFilesIDs = formFields?.relatedAttachments?.map(file => file.ID) || [];
      const filesToDelete = originalFilesIDs?.filter(id => !currentFilesIDs?.includes(id));

      for (const fileId of filesToDelete) {
        await apiService.delete('DeleteRelatedAttachment', fileId, LogTypes?.Files?.Delete);
      }

      const filesToAdd = formFields?.relatedAttachments?.filter(file => !originalFilesIDs.includes(file?.ID));
      for (const file of filesToAdd) {
        await apiService?.create(
          '/AddRelatedAttachment',
          {
            CommitteeID: +id,
            DocumentContent: file?.DocumentContent,
            DocumentExt: file?.DocumentExt,
            DocumentName: file?.DocumentName,
            AttachmentTypeID: +file?.AttachmentTypeID,
            IsDeleted: false,
          },
          LogTypes?.Files?.Create,
        );
      }

      const currentMembersIDs = formFields?.members?.map(member => member?.ID) || [];
      const originalMembersIDs = await apiService.getById('GetAllMember', id).then(data => data.map(member => member?.ID));
      const membersToDelete = originalMembersIDs?.filter(id => !currentMembersIDs?.includes(id));
      const membersToAdd = formFields?.members?.filter(member => !originalMembersIDs.includes(member?.ID));

      for (const memberId of membersToDelete) {
        await apiService?.delete('/DeleteMember', memberId, LogTypes?.DeleteMembers?.CommitteeMemberDelete);
      }

      window.history.back();
    } catch (error) {
      console.error('Error updating the Committee:', error);
    }
  };

  const validateAndConvertFile = file => {
    return new Promise((resolve, reject) => {
      if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
        showToast(ToastMessage?.FileUploadSizeExceeding, 'error');
        reject(new Error('File too large'));
        return;
      }

      const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
        showToast(ToastMessage?.FileUploadExtensionNotAllowed, 'error');
        reject(new Error('Invalid file extension'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () =>
        resolve({ DocumentContent: reader.result.split(',')[1], DocumentExt: extension, DocumentName: file.name });
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async event => {
    const selectedFiles = Array.from(event.target.files);

    try {
      const convertedFiles = await Promise.all(selectedFiles?.map(validateAndConvertFile));
      setFormFields(prev => ({
        ...prev,
        relatedAttachments: [...prev.relatedAttachments, ...convertedFiles],
      }));
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const handleDeleteFile = index => {
    const updatedFiles = formFields?.relatedAttachments.filter((_, i) => i !== index);
    setFormFields({ ...formFields, relatedAttachments: updatedFiles });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const getCombinedUsers = () => {
    const combinedUsers = [
      ...formFields?.members?.map(member => ({
        ID: member?.ID,
        UserFullName: member?.FullName,
        RoleArabicName: member?.RoleName,
        checked: true,
      })),
      ...fieldsFetchedItems?.users
        ?.filter(user => !formFields?.members?.some(m => m?.UserID === user?.ID))
        ?.map(user => ({
          ID: user?.ID,
          UserFullName: user?.UserFullName,
          RoleArabicName: '',
          checked: false,
        })),
    ];

    console.log('🚀 ~ getCombinedUsers ~ combinedUsers:', combinedUsers);
    return combinedUsers;
  };

  const handleCheckboxChange = (userId, checked) => {
    if (checked) {
      const user = fieldsFetchedItems?.users.find(u => u.ID === userId);
      const role = fieldsFetchedItems?.roles[0]?.ArabicName || '';

      const newMember = {
        ID: user.ID,
        FullName: user.UserFullName,
        RoleArabicName: role,
        RoleID: fieldsFetchedItems?.roles.find(r => r.ArabicName === role)?.ID,
      };

      setFormFields(prev => ({
        ...prev,
        members: [...prev.members, newMember],
      }));
      setFieldsFetchedItems(prev => ({
        ...prev,
        users: prev.users.filter(u => u.ID !== userId),
      }));
    } else {
      const member = formFields.members.find(m => m.ID === userId);

      const newSystemUser = {
        ID: member.ID,
        UserFullName: member.UserFullName,
      };

      setFormFields(prev => ({
        ...prev,
        members: prev.members.filter(member => member.ID !== userId),
      }));
      setFieldsFetchedItems(prev => ({
        ...prev,
        users: [...prev.users, newSystemUser],
      }));
    }
  };

  const fetchRolePermissions = async roleId => {
    try {
      const rolePermissionsData = await apiService.getById('GetRolePermission', roleId);

      const members = rolePermissionsData?.map(permission => ({
        ID: permission?.ID,
        Permissions: permission?.Permissions?.map(p => ({
          PermissionID: p?.PermissionID,
          IsGranted: p?.IsGranted,
        })),
      }));

      setFieldsFetchedItems(prev => ({
        ...prev,
        members,
      }));
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  const handleRoleChange = (role, userId) => {
    const updatedMembers = formFields?.members.map(member => (member.ID === userId ? { ...member, RoleName: role } : member));
    setFormFields({ ...formFields, members: updatedMembers });

    fetchRolePermissions(fieldsFetchedItems?.roles.find(r => +r.ID === +role)?.ID);
  };

  const handleFileTypeChange = (e, index) => {
    const selectedFile = formFields.relatedAttachments[index];
    selectedFile.AttachmentTypeID = +e.target.value;
    setFormFields(prev => ({
      ...prev,
      relatedAttachments: [...prev.relatedAttachments],
    }));
  };

  const handlePermissionToggle = (userId, permissionId) => {
    setFieldsFetchedItems(prev => ({
      ...prev,
      members: prev.members.map(member =>
        member.ID === userId
          ? {
              ...member,
              Permissions: member.Permissions.map(permission =>
                permission.PermissionID === permissionId ? { ...permission, IsGranted: !permission.IsGranted } : permission,
              ),
            }
          : member,
      ),
    }));
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />

        <h4>تعديل اللجنة</h4>
      </div>
      <form>
        <div className={styles.formColumns}>
          {/************************* Committee Name *************************/}
          <div className={styles.formGroup}>
            <label htmlFor='committeeName'>اسم اللجنة</label>
            <input
              type='text'
              id='committeeName'
              value={formFields?.name}
              onChange={e => setFormFields({ ...formFields, name: e.target.value })}
              placeholder='أدخل اسم اللجنة'
              required
            />
          </div>

          {/************************* Committee Number *************************/}
          <div className={styles.formGroup}>
            <label htmlFor='committeeNumber'>رقم اللجنة</label>
            <input
              type='text'
              id='committeeNumber'
              value={formFields?.number}
              onChange={e => setFormFields({ ...formFields, number: e.target.value })}
              placeholder='أدخل رقم اللجنة'
              required
            />
          </div>

          {/************************* Committee Short Name *************************/}
          <div className={styles.formGroup}>
            <label htmlFor='shortName'>اسم اللجنة المختصر</label>
            <input
              type='text'
              id='shortName'
              value={formFields?.shortName}
              onChange={e => setFormFields({ ...formFields, shortName: e.target.value })}
              placeholder='أدخل اسم اللجنة المختصر'
              required
            />
          </div>

          {/************************* Meeting Template Name *************************/}
          <div className={styles.formGroup}>
            <label htmlFor='templateName'>اسم نموذج الإجتماع</label>
            <input
              type='text'
              id='templateName'
              value={formFields?.meetingTemplateName}
              onChange={e => setFormFields({ ...formFields, meetingTemplateName: e.target.value })}
              placeholder='أدخل اسم نموذج الإجتماع'
              required
            />
          </div>

          {/************************* Formation Date *************************/}
          <div className={styles.formGroup}>
            <label htmlFor='formationDate'>تاريخ تشكيل اللجنة</label>
            <input
              type='date'
              id='formationDate'
              value={formFields?.formationDate}
              onChange={e => setFormFields({ ...formFields, formationDate: e.target.value })}
              required
            />
          </div>

          {/************************* Start Date *************************/}
          <div className={styles.formGroup}>
            <label htmlFor='startDate'>تاريخ البدء</label>
            <input
              type='date'
              id='startDate'
              value={formFields?.startDate}
              onChange={e => setFormFields({ ...formFields, startDate: e.target.value })}
              required
            />
          </div>

          {/************************* End Date *************************/}
          <div className={styles.formGroup}>
            <label htmlFor='endDate'>تاريخ الانتهاء</label>
            <input
              type='date'
              id='endDate'
              value={formFields?.endDate}
              onChange={e => setFormFields({ ...formFields, endDate: e.target.value })}
            />
          </div>

          {/************************* Committee Type *************************/}
          <div className={styles.formGroup}>
            <label htmlFor='committeeType'>نوع اللجنة</label>
            <div className={`${styles.selectContainer} select-container`}>
              <select
                id='committeeType'
                value={formFields?.categoryID}
                onChange={e => setFormFields({ ...formFields, categoryID: e.target.value })}
                required>
                <option value='' disabled>
                  اختر نوع اللجنة
                </option>
                {fieldsFetchedItems?.categories?.map(type => (
                  <option key={type?.ID} value={type?.ID}>
                    {type?.ArabicName}
                  </option>
                ))}
              </select>
              <FaChevronDown />
            </div>
          </div>

          {/************************* Department *************************/}
          <div className={styles.formGroup}>
            <label htmlFor='departmentType'>اختر القسم</label>
            <div className={`${styles.selectContainer} select-container`}>
              <select
                id='departmentType'
                value={formFields?.departmentID}
                onChange={e => setFormFields({ ...formFields, departmentID: e.target.value })}
                required>
                <option value='' disabled>
                  اختر القسم
                </option>
                {fieldsFetchedItems?.departments?.map(type => (
                  <option key={type?.ID} value={type?.ID}>
                    {type?.ArabicName}
                  </option>
                ))}
              </select>
              <FaChevronDown />
            </div>
          </div>

          {/************************* Committee Members Table *************************/}
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
                  </tr>
                </thead>
                <tbody>
                  {!formFields.members.length ? (
                    <tr>
                      <td colSpan='2'>
                        <p className={styles.emptyTableLabel}>لا يوجد أعضاء</p>
                      </td>
                    </tr>
                  ) : (
                    formFields?.members?.map((member, index) => (
                      <tr key={index}>
                        <td>{member?.FullName}</td>
                        <td>{member?.RoleName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/************************* Committee Members Modal *************************/}
          <Modal open={isModalOpen} onClose={toggleModal} className={styles.usersModal}>
            <div className={`${styles.modal} ${styles.tableContainer}`}>
              <table>
                <thead>
                  <tr>
                    <th>الصلاحيات</th>
                    <th>الدور</th>
                    <th>الاسم</th>
                    <th>إضافة</th>
                  </tr>
                </thead>
                <tbody>
                  {getCombinedUsers()?.map(user => (
                    <tr key={user.ID}>
                      <td>
                        <div className={styles.permissionsList}>
                          {fieldsFetchedItems?.permissions?.map(permission => (
                            <div key={permission?.ID} className={styles.permissionItem}>
                              <label htmlFor={`${user?.ID}-${permission?.ID}`}>{permission?.ArabicName}</label>
                              <input
                                type='checkbox'
                                id={`${user?.ID}-${permission?.ID}`}
                                // disabled={!selectedUsers[user?.ID]?.role}
                                checked={fieldsFetchedItems?.members?.some(
                                  memberPermission =>
                                    memberPermission?.ID === user?.ID &&
                                    memberPermission?.Permissions?.some(
                                      userPermission =>
                                        userPermission?.PermissionID === permission?.ID && userPermission?.IsGranted,
                                    ),
                                )}
                                onChange={() => handlePermissionToggle(user?.ID, permission.ID)}
                              />
                            </div>
                          ))}
                        </div>
                      </td>

                      <td>
                        <select
                          value={formFields?.members.find(m => m.ID === user.ID)?.RoleName || ''}
                          onChange={e => handleRoleChange(e.target.value, user.ID)}
                          disabled={!user.checked}
                          className={styles.roleSelect}>
                          <option value='' disabled>
                            اختر دور
                          </option>
                          {fieldsFetchedItems?.roles?.map(role => (
                            <option key={role.ID} value={role?.ID}>
                              {role?.ArabicName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{user.UserFullName}</td>
                      <td>
                        <Checkbox
                          checked={user.checked || false}
                          onChange={e => handleCheckboxChange(user.ID, e.target.checked)}
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
                <button type='button' className={styles.usersSaveButton} onClick={toggleModal}>
                  إضافة <SaveIcon />
                </button>
              </div>
            </div>
          </Modal>

          {/************************* Committee Files *************************/}
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label htmlFor='fileInput'>رفع ملفات اللجنة</label>
            <div className={styles.uploadContainer}>
              <button type='button' className={styles.uploadButton} onClick={() => document.getElementById('fileInput').click()}>
                اختر الملفات
              </button>
              <input type='file' id='fileInput' multiple onChange={handleFileUpload} style={{ display: 'none' }} />
              <ul className={styles.fileList}>
                {formFields?.relatedAttachments?.map((file, index) => (
                  <li key={index} className={styles.fileItem}>
                    <span className={styles.fileName}>{file?.DocumentName}</span>

                    <div className={styles.fileActionsContainer}>
                      <select
                        value={formFields?.relatedAttachments[index]?.AttachmentTypeID || ''}
                        onChange={e => handleFileTypeChange(e, index)}>
                        <option value='' disabled>
                          اختر نوع الملف
                        </option>
                        {fieldsFetchedItems?.fileTypes?.map(type => (
                          <option key={type?.ID} value={type?.ID}>
                            {type?.ArabicName}
                          </option>
                        ))}
                      </select>
                      <button type='button' className={styles.deleteFileButton} onClick={() => handleDeleteFile(index)}>
                        <FaTrash className={styles.deleteIcon} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.formButtonsContainer}>
          <button type='submit' className={styles.saveButton} onClick={handleSubmit}>
            <SaveIcon /> تعديل
          </button>
          <button type='button' className={styles.cancelButton} onClick={() => window.history.back()}>
            <CancelIcon /> الغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommitteeFormEdit;
