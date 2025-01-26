import React, { useEffect, useState } from 'react';
import { Checkbox, Modal } from '@mui/material';
import { FaPlus, FaUsers } from 'react-icons/fa';

import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

import styles from '../CommitteeDetails.module.scss';
import apiService from '../../../../services/axiosApi.service';
import { LogTypes } from '../../../../constants';

const CommitteeMembers = ({ members, setIsModalOpen, isModalOpen, setFetchedCommitteeDetails }) => {
  const [showMoreMembers, setShowMoreMembers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);

  const MAX_VISIBLE_ITEMS = 3;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const systemUsers = await apiService.getAll('GetAllSystemUser');
        const filteredUsers = systemUsers?.filter(user => !members?.some(member => member?.UserID === user?.ID));

        await apiService.getAll('GetAllRole').then(data => setRoles(data));
        await apiService.getAll('/GetAllPermission').then(data => setPermissions(data));

        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const addMembers = async () => {
    try {
      const payload = Object.values(selectedUsers).map(user => ({
        CommitteeID: +localStorage.getItem('selectedCommitteeID'),
        UserID: user?.userId,
        RoleID: +user?.role,
        Permissions: user?.permissions?.map(p => ({ ID: p.ID, IsGranted: p.isGranted })),
      }));

      await apiService.create('AddMemberToCommittee', payload, LogTypes?.AddMembers?.CommitteeMemberAdd);

      const committeeDetails = await apiService.getById('GetCommittee', localStorage.getItem('selectedCommitteeID'));
      setFetchedCommitteeDetails(prevState => ({
        ...prevState,
        Members: committeeDetails?.Members,
      }));

      toggleUserModal();
    } catch (error) {
      console.error('Error adding users to the committee:', error);
    }
  };

  const handleCheckboxChange = (userId, checked) => {
    setSelectedUsers(prev => ({
      ...prev,
      [userId]: { ...prev[userId], userId: userId, role: checked ? roles[0]?.name : '', checked },
    }));
  };

  const handleRoleChange = async (userId, role) => {
    setSelectedUsers(prev => ({
      ...prev,
      [userId]: { ...prev?.[userId], role },
    }));
    await fetchRolePermissions(userId, role);
  };

  const fetchRolePermissions = async (userId, roleId) => {
    try {
      const rolePermissionsData = await apiService.getById('GetRolePermission', roleId);
      setSelectedUsers(prevState => ({
        ...prevState,
        [userId]: {
          ...prevState?.[userId],
          role: roleId,
          permissions: rolePermissionsData?.map(p => ({
            ID: p?.Permission?.ID,
            isGranted: p?.IsGranted,
          })),
        },
      }));
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  const handlePermissionToggle = (userId, permissionId) => {
    setSelectedUsers(prevState => ({
      ...prevState,
      [userId]: {
        ...prevState?.[userId],
        permissions: prevState?.[userId]?.permissions?.map(p => (p?.ID === permissionId ? { ...p, isGranted: !p.isGranted } : p)),
      },
    }));
  };

  const toggleUserModal = () => {
    setIsModalOpen({ ...isModalOpen, user: !isModalOpen.user });
    setSelectedUsers([]);
  };

  return (
    <div className={styles.dashboardWidget}>
      <div className={`${styles.widgetHeader} ${styles.sectionHeaderTitle}`}>
        <h5>الأعضاء</h5>
        <button className={styles.button} onClick={toggleUserModal}>
          <FaPlus className={styles.addIcon} />
          <p>إضافة</p>
        </button>
      </div>

      <div className={styles.widgetContent}>
        <FaUsers className={styles.widgetIcon} />
        <span>{members?.length || 0}</span>
      </div>

      <div className={styles.widgetDetails}>
        <>
          {members?.slice(0, showMoreMembers ? members?.length : MAX_VISIBLE_ITEMS)?.map(person => (
            <div key={person.ID} className={styles.widgetItem}>
              <div className={styles.profileIcon}>{person?.FullName?.charAt(0)}</div>
              <div className={styles.itemDetails}>
                <span className={styles.itemName}>{person?.FullName}</span>
                <span className={styles.itemRole}>{person?.RoleName}</span>
              </div>
            </div>
          ))}
        </>

        {members?.length > MAX_VISIBLE_ITEMS && (
          <button onClick={() => setShowMoreMembers(!showMoreMembers)} className={styles.viewMoreButton}>
            {showMoreMembers ? 'عرض أقل' : 'عرض المزيد'}
          </button>
        )}
      </div>

      {isModalOpen.user && (
        <Modal open={isModalOpen.user} onClose={toggleUserModal} className={styles.usersModal}>
          <div className={styles.modal}>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>الصلاحيات</th>
                    <th>الدور</th>
                    <th>الاسم</th>
                    <th>اضافة</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map(person => (
                    <tr key={person?.ID}>
                      <td>
                        <div className={styles.permissionsList}>
                          {permissions?.map(permission => (
                            <div key={permission?.ID} className={styles.permissionItem}>
                              <label htmlFor={`${person?.ID}-${permission?.ID}`}>{permission?.ArabicName}</label>
                              <input
                                type='checkbox'
                                id={`${person?.ID}-${permission?.ID}`}
                                disabled={!selectedUsers[person?.ID]?.role}
                                checked={
                                  selectedUsers[person?.ID]?.permissions?.find(p => p.ID === permission.ID)?.isGranted || false
                                }
                                onChange={() => handlePermissionToggle(person?.ID, permission.ID)}
                              />
                            </div>
                          ))}
                        </div>
                      </td>

                      <td>
                        <select
                          value={selectedUsers[person?.ID]?.role || ''}
                          onChange={e => handleRoleChange(person?.ID, e.target.value)}
                          disabled={!selectedUsers[person?.ID]?.checked}
                          className={styles.roleSelect}>
                          <option value='' disabled>
                            اختر دور
                          </option>
                          {roles?.map(role => (
                            <option key={role?.ID} value={role?.ID}>
                              {role?.ArabicName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{person?.UserFullName}</td>
                      <td>
                        <Checkbox
                          onChange={e => handleCheckboxChange(person?.ID, e.target.checked)}
                          checked={selectedUsers[person?.ID]?.checked || false}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`${styles.formButtonsContainer} ${styles.usersFormButtonsContainer}`}>
              <button type='button' className={styles.usersCancelButton} onClick={toggleUserModal}>
                الغاء <CancelIcon />
              </button>
              <button type='button' className={styles.usersSaveButton} onClick={addMembers}>
                إضافة <SaveIcon />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CommitteeMembers;
