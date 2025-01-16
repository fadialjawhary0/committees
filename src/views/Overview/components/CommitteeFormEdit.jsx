import React, { useEffect, useState } from 'react';
import { FaUpload, FaFile, FaTrashAlt, FaChevronDown, FaPlus } from 'react-icons/fa';
import styles from './CommitteeForms.module.scss';

import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { Checkbox, Modal } from '@mui/material';
import { CommitteeMembersServices, CommitteeServices } from '../services/committees.service';
import { useLocation, useParams } from 'react-router-dom';
import { ExtractDateFromDateTime } from '../../../helpers';

const CommitteeFormEdit = () => {
  const location = useLocation();
  const { payload } = location?.state || {};
  const { id } = useParams();
  console.log('🚀 ~ CommitteeFormEdit ~ payload:', payload);

  const [formFields, setFormFields] = useState({
    name: payload?.CommitteeName || '',
    number: payload?.Number || '',
    shortName: payload?.ShortName || '',
    meetingTemplateName: payload?.MeetingTemplateName || '',
    formationDate: ExtractDateFromDateTime(payload?.FormationDate) || '',
    startDate: ExtractDateFromDateTime(payload?.StartDate) || '',
    endDate: ExtractDateFromDateTime(payload?.EndDate) || '',
    departmentID: payload?.DepID || '',
    categoryID: payload?.CategoryID || '',
    members: payload?.Members || [],
    systemUsers: payload?.SystemUsers || [],
    roles: payload?.Roles || [],
    files: [],
  });
  console.log('🚀 ~ CommitteeFormEdit ~ formFields:', formFields);

  const [fieldsFetchedItems, setFieldsFetchedItems] = useState({
    departments: [],
    categories: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formItems = await CommitteeServices?.commonFormItems();

        setFieldsFetchedItems({
          departments: formItems?.Departments,
          categories: formItems?.CommitteeCategories,
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
    };

    try {
      await CommitteeServices.update(parseInt(id), preparedData);

      const originalMemberIDs = payload?.Members?.map(member => member.ID) || [];
      const currentMemberIDs = formFields?.members?.map(member => member.ID) || [];

      const membersToDelete = originalMemberIDs.filter(id => !currentMemberIDs.includes(id));

      const membersToAdd = formFields?.members.filter(member => !originalMemberIDs.includes(member.ID));

      const membersToUpdate = formFields?.members.filter(member => {
        const originalMember = payload?.Members.find(m => m.ID === member.ID);
        return originalMember && originalMember.RoleArabicName !== member.RoleArabicName;
      });

      for (const memberId of membersToDelete) {
        await CommitteeMembersServices.delete(memberId);
      }

      for (const member of membersToAdd) {
        await CommitteeMembersServices.create({
          CommitteeID: parseInt(id),
          UserID: member.ID,
          CommitteeHead: member.RoleArabicName === 'مدير' ? 1 : 0,
        });
      }

      for (const member of membersToUpdate) {
        await CommitteeMembersServices.update(member.ID, {
          ID: member?.ID,
          CommitteeID: parseInt(id),
          UserID: member.UserID,
          CommitteeHead: member.RoleArabicName === 'مدير' ? 1 : 0,
        });
      }

      window.history.back();
    } catch (error) {
      console.error('Error updating the Committee:', error);
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

  const getCombinedUsers = () => {
    const combinedUsers = [
      ...formFields.members?.map(member => ({
        ID: member.ID,
        UserFullName: member.UserFullName,
        RoleArabicName: member.RoleArabicName,
        checked: true,
      })),
      ...formFields.systemUsers
        .filter(user => !formFields.members.some(m => m.ID === user.ID))
        ?.map(user => ({
          ID: user.ID,
          UserFullName: user.UserFullName,
          RoleArabicName: '',
          checked: false,
        })),
    ];

    return combinedUsers;
  };

  const handleCheckboxChange = (userId, checked) => {
    if (checked) {
      const user = formFields.systemUsers.find(u => u.ID === userId);
      const role = formFields.roles[0]?.NameArabic || '';

      const newMember = {
        ID: user.ID,
        UserFullName: user.UserFullName,
        RoleArabicName: role,
        RoleID: formFields.roles.find(r => r.NameArabic === role)?.ID,
      };

      setFormFields(prev => ({
        ...prev,
        members: [...prev.members, newMember],
        systemUsers: prev.systemUsers.filter(u => u.ID !== userId),
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
        systemUsers: [...prev.systemUsers, newSystemUser],
      }));
    }
  };

  const handleRoleChange = (userId, role) => {
    setFormFields(prev => ({
      ...prev,
      members: prev.members?.map(member =>
        member.ID === userId
          ? { ...member, RoleArabicName: role, RoleID: formFields.roles.find(r => r.NameArabic === role)?.ID }
          : member,
      ),
    }));
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h4>تعديل اللجنة</h4>
      </div>
      <form>
        <div className={styles.formColumns}>
          {/************************* Committee Name *************************/}
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

          {/************************* Committee Number *************************/}
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

          {/************************* Committee Short Name *************************/}
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

          {/************************* Meeting Template Name *************************/}
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

          {/************************* Formation Date *************************/}
          <div className={styles.formGroup}>
            <label>تاريخ تشكيل اللجنة</label>
            <input
              type='date'
              value={formFields?.formationDate}
              onChange={e => setFormFields({ ...formFields, formationDate: e.target.value })}
              required
            />
          </div>

          {/************************* Start Date *************************/}
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

          {/************************* End Date *************************/}
          <div className={styles.formGroup}>
            <label>تاريخ الانتهاء</label>
            <input
              type='date'
              id='endDate'
              value={formFields?.endDate}
              onChange={e => setFormFields({ ...formFields, endDate: e.target.value })}
            />
          </div>

          {/************************* Committee Type *************************/}
          <div className={styles.formGroup}>
            <label>نوع اللجنة</label>
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
            <label>اختر القسم</label>
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
                  {formFields.members.length === 0 ? (
                    <tr>
                      <td colSpan='2'>
                        <p className={styles.emptyTableLabel}>لا يوجد أعضاء</p>
                      </td>
                    </tr>
                  ) : (
                    formFields.members?.map((member, index) => (
                      <tr key={index}>
                        <td>{member.UserFullName}</td>
                        <td>{member.RoleArabicName}</td>
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
                    <th>الدور</th>
                    <th>الاسم</th>
                    <th>إضافة</th>
                  </tr>
                </thead>
                <tbody>
                  {getCombinedUsers()?.map(user => (
                    <tr key={user.ID}>
                      <td>
                        <select
                          value={formFields.members.find(m => m.ID === user.ID)?.RoleArabicName || ''}
                          onChange={e => handleRoleChange(user.ID, e.target.value)}
                          disabled={!user.checked}
                          className={styles.roleSelect}>
                          <option value='' disabled>
                            اختر دور
                          </option>
                          {formFields.roles?.map(role => (
                            <option key={role.ID} value={role.NameArabic}>
                              {role.NameArabic}
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
          <div className={`${styles.fileUploadGroup} ${styles.formGroupFullWidth}`}>
            <label htmlFor='files' className={styles.fileUploadLabel}>
              <FaFile className={styles.fileUploadIcon} /> رفع ملفات اللجنة
            </label>
            <input type='file' id='files' multiple onChange={handleFileChange} className={styles.fileInput} />
            <div className={styles.filePreview}>
              {formFields?.files.length > 0 &&
                formFields?.files?.map((file, index) => (
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

export default CommitteeFormEdit;

// import React, { useEffect, useState } from 'react';
// import { FaUpload, FaFile, FaTrashAlt, FaChevronDown, FaPlus } from 'react-icons/fa';
// import styles from './CommitteeForms.module.scss';

// import CancelIcon from '@mui/icons-material/Cancel';
// import SaveIcon from '@mui/icons-material/Save';
// import { Checkbox, Modal } from '@mui/material';
// import { CommitteeMembersServices, CommitteeServices } from '../services/committees.service';
// import { useLocation, useParams } from 'react-router-dom';
// import { ExtractDateFromDateTime } from '../../../helpers';
// import apiService from '../../../services/axiosApi.service';

// const CommitteeFormEdit = () => {
//   const { id } = useParams();

//   const [committeeData, setCommitteeData] = useState({});
//   console.log('🚀 ~ CommitteeFormEdit ~ committeeData:', committeeData);

//   useEffect(() => {
//     apiService?.getById('GetCommittee', id).then(data => setCommitteeData(data));
//     console.log('🚀 ~ CommitteeFormEdit ~ committeeData:', committeeData);
//   }, []);

//   return (
//     <div className={styles.formContainer}>
//       <div className={styles.formHeader}>
//         <h4>إضافة لجنة جديدة</h4>
//       </div>
//       {/* <form>
//         <div className={styles.formColumns}>
//           <div className={styles.formGroup}>
//             <label>اسم اللجنة</label>
//             <input
//               type='text'
//               id='committeeName'
//               value={formFields?.name}
//               onChange={e => setFormFields({ ...formFields, name: e.target.value })}
//               placeholder='أدخل اسم اللجنة'
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>رقم اللجنة</label>
//             <input
//               type='text'
//               id='committeeNumber'
//               value={formFields?.number}
//               onChange={e => setFormFields({ ...formFields, number: e.target.value })}
//               placeholder='أدخل رقم اللجنة'
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>اسم اللجنة المختصر</label>
//             <input
//               type='text'
//               id='shortName'
//               value={formFields?.shortName}
//               onChange={e => setFormFields({ ...formFields, shortName: e.target.value })}
//               placeholder='أدخل اسم اللجنة المختصر'
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>اسم نموذج الإجتماع</label>
//             <input
//               type='text'
//               id='templateName'
//               value={formFields?.meetingTemplateName}
//               onChange={e => setFormFields({ ...formFields, meetingTemplateName: e.target.value })}
//               placeholder='أدخل اسم نموذج الإجتماع'
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>تاريخ تشكيل اللجنة</label>
//             <input
//               type='date'
//               value={formFields?.formationDate}
//               onChange={e => setFormFields({ ...formFields, formationDate: e.target.value })}
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>تاريخ البدء</label>
//             <input
//               type='date'
//               id='startDate'
//               value={formFields?.startDate}
//               onChange={e => setFormFields({ ...formFields, startDate: e.target.value })}
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>تاريخ الانتهاء</label>
//             <input
//               type='date'
//               id='endDate'
//               value={formFields?.endDate}
//               onChange={e => setFormFields({ ...formFields, endDate: e.target.value })}
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>نوع اللجنة</label>
//             <div className={`${styles.selectContainer} select-container`}>
//               <select
//                 id='committeeType'
//                 value={formFields?.categoryID}
//                 onChange={e => setFormFields({ ...formFields, categoryID: e.target.value })}
//                 required>
//                 <option value='' disabled>
//                   اختر نوع اللجنة
//                 </option>
//                 {fieldsFetchedItems?.categories.map(type => (
//                   <option key={type?.ID} value={type?.ID}>
//                     {type?.ArabicName}
//                   </option>
//                 ))}
//               </select>
//               <FaChevronDown />
//             </div>
//           </div>

//           <div className={styles.formGroup}>
//             <label>اختر القسم</label>
//             <div className={`${styles.selectContainer} select-container`}>
//               <select
//                 id='departmentType'
//                 value={formFields?.departmentID}
//                 onChange={e => setFormFields({ ...formFields, departmentID: e.target.value })}
//                 required>
//                 <option value='' disabled>
//                   اختر القسم
//                 </option>
//                 {fieldsFetchedItems?.departments.map(type => (
//                   <option key={type?.ID} value={type?.ID}>
//                     {type?.ArabicName}
//                   </option>
//                 ))}
//               </select>
//               <FaChevronDown />
//             </div>
//           </div>

//           <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
//             <div className={styles.usersTableHeader}>
//               <label>أعضاء اللجنة</label>
//               <button type='button' className={styles.sharedButton} onClick={toggleModal}>
//                 <FaPlus /> إضافة أعضاء
//               </button>
//             </div>
//             <div className={styles.tableContainer}>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>الاسم</th>
//                     <th>الدور</th>
//                     <th>إجراءات</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {formFields?.members.length === 0 ? (
//                     <tr>
//                       <td colSpan='3'>
//                         <p className={styles.emptyTableLabel}>لا يوجد أعضاء</p>
//                       </td>
//                     </tr>
//                   ) : (
//                     formFields?.members.map((member, index) => (
//                       <tr key={index}>
//                         <td>{member?.name}</td>
//                         <td>{member?.role}</td>
//                         <td>
//                           <button type='button' className={styles.deleteButton} onClick={() => handleDeleteMember(index)}>
//                             <FaTrashAlt />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <Modal open={isModalOpen} onClose={toggleModal} className={styles.usersModal}>
//             <div className={`${styles.modal} ${styles.tableContainer}`}>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>الصلاحيات</th>
//                     <th>الدور</th>
//                     <th>الاسم</th>
//                     <th>إضافة</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {fieldsFetchedItems?.users.map(user => (
//                     <tr key={user?.ID}>
//                       <td>
//                         <div className={styles.permissionsList}>
//                           {fieldsFetchedItems?.permissions.map(permission => (
//                             <div key={permission?.ID} className={styles.permissionItem}>
//                               <label htmlFor={`${user?.ID}-${permission?.ID}`}>{permission?.ArabicName}</label>
//                               <input
//                                 type='checkbox'
//                                 id={`${user?.ID}-${permission?.ID}`}
//                                 disabled={!selectedUsers[user?.ID]?.role}
//                                 checked={
//                                   selectedUsers[user?.ID]?.permissions?.find(p => p.ID === permission.ID)?.isGranted || false
//                                 }
//                                 onChange={() => handlePermissionToggle(user?.ID, permission.ID)}
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       </td>

//                       <td>
//                         <select
//                           value={selectedUsers[user?.ID]?.role || ''}
//                           disabled={!selectedUsers[user?.ID]?.checked}
//                           onChange={e => handleRoleChange(user?.ID, e.target.value)}
//                           className={styles.roleSelect}>
//                           <option value='' disabled>
//                             اختر دور
//                           </option>
//                           {fieldsFetchedItems?.roles.map(role => (
//                             <option
//                               key={role?.ID}
//                               value={role?.ID}
//                               disabled={selectedUsers[user?.ID]?.role && selectedUsers[user?.ID]?.role !== role?.ArabicName}>
//                               {role?.ArabicName}
//                             </option>
//                           ))}
//                         </select>
//                       </td>

//                       <td>{user?.UserFullName}</td>

//                       <td>
//                         <Checkbox
//                           checked={selectedUsers[user?.ID]?.checked || false}
//                           onChange={e => handleCheckboxChange(user?.ID, e.target.checked)}
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <div className={`${styles.formButtonsContainer} ${styles.usersFormButtonsContainer}`}>
//                 <button type='button' className={styles.usersCancelButton} onClick={toggleModal}>
//                   الغاء <CancelIcon />
//                 </button>
//                 <button type='button' className={styles.usersSaveButton} onClick={addMembers}>
//                   إضافة <SaveIcon />
//                 </button>
//               </div>
//             </div>
//           </Modal>

//           <div className={`${styles.fileUploadGroup} ${styles.formGroupFullWidth}`}>
//             <label htmlFor='files' className={styles.fileUploadLabel}>
//               <FaFile className={styles.fileUploadIcon} /> رفع ملفات اللجنة
//             </label>
//             <input type='file' id='files' multiple onChange={handleFileChange} className={styles.fileInput} />
//             <div className={styles.filePreview}>
//               {formFields?.files.length > 0 &&
//                 formFields?.files.map((file, index) => (
//                   <div key={index} className={styles.fileItem}>
//                     <FaUpload className={styles.fileIcon} />
//                     <span>{file.name}</span>
//                     <FaTrashAlt className={styles.deleteFileIcon} onClick={() => handleDeleteFile(index)} />
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//         <div className={styles.formButtonsContainer}>
//           <button type='submit' className={styles.saveButton} onClick={handleSubmit}>
//             <SaveIcon /> حفظ
//           </button>
//           <button type='button' className={styles.cancelButton}>
//             <CancelIcon /> الغاء
//           </button>
//         </div>
//       </form> */}
//     </div>
//   );
// };

// export default CommitteeFormEdit;
