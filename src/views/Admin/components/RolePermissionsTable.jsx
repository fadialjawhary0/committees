import React, { useEffect, useState } from 'react';
import apiService from '../../../services/axiosApi.service';
import styles from './RolePermissionsTable.module.scss';

const RolePermissionsTable = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [existingRolePermissions, setExistingRolePermissions] = useState({});
  const [modifiedPermissions, setModifiedPermissions] = useState({});

  const fetchData = async () => {
    const rolesData = await apiService.getAll('GetAllRole');
    const permissionsData = await apiService.getAll('GetAllPermission');

    setRoles(rolesData);
    setPermissions(permissionsData);

    const existingPermissionsData = {};
    for (const role of rolesData) {
      const rolePermissionsData = await apiService.getById('GetRolePermission', role.ID);
      existingPermissionsData[role.ID] = rolePermissionsData;
    }
    setExistingRolePermissions(existingPermissionsData);

    const initialRolePermissions = rolesData.reduce((acc, role) => {
      acc[role.ID] = permissionsData?.map(permission => ({
        PermissionId: permission.ID,
        isGranted: existingPermissionsData[role.ID]?.some(p => p.Permission.ID === permission.ID && p.IsGranted) || false,
      }));
      return acc;
    }, {});
    setRolePermissions(initialRolePermissions);

    const initialModifiedPermissions = rolesData.reduce((acc, role) => {
      acc[role.ID] = new Set();
      return acc;
    }, {});
    setModifiedPermissions(initialModifiedPermissions);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePermissionChange = (roleId, permissionId) => {
    setRolePermissions(prevState => ({
      ...prevState,
      [roleId]: prevState[roleId]?.map(permission =>
        permission.PermissionId === permissionId ? { ...permission, isGranted: !permission.isGranted } : permission,
      ),
    }));

    setModifiedPermissions(prevState => ({
      ...prevState,
      [roleId]: prevState[roleId].add(permissionId),
    }));
  };

  const handleAddPermissions = async roleId => {
    const permissionsToAdd = rolePermissions[roleId]?.map(permission => ({
      ID: permission.PermissionId,
      IsGranted: permission.isGranted,
    }));

    const payload = {
      RoleId: roleId,
      Permissions: permissionsToAdd,
    };

    try {
      await apiService.create('AddRolePermission', payload);
      fetchData();
    } catch (error) {
      console.error('Error adding permissions:', error);
    }
  };

  const handleUpdatePermissions = async roleId => {
    if (!existingRolePermissions[roleId]) return;

    const modifiedPermissionsList = Array.from(modifiedPermissions[roleId]);

    for (const permissionId of modifiedPermissionsList) {
      const permission = rolePermissions[roleId].find(p => p.PermissionId === permissionId);
      const existingPermission = existingRolePermissions[roleId]?.find(p => p.Permission.ID === permissionId);

      if (existingPermission) {
        const payload = {
          ID: existingPermission.ID,
          RoleId: roleId,
          PermissionId: permission.PermissionId,
          IsGranted: permission.isGranted,
        };

        try {
          await apiService.update('UpdateRolePermission', payload);
        } catch (error) {
          console.error('Error updating permission:', error);
        }
      }
    }

    alert('Permissions updated successfully!');
    fetchData();
  };

  return (
    <div className={styles.tableContainer}>
      <h5 className={styles.sectionHeaderTitle}>إدارة صلاحيات الأدوار</h5>

      <table>
        <thead>
          <tr>
            <th>الصلاحيات</th>
            <th>الدور</th>
          </tr>
        </thead>
        <tbody>
          {roles?.map(role => (
            <tr key={role.ID}>
              <td>
                <ul className={styles.permissionsList}>
                  {permissions?.map(permission => {
                    const isGranted = rolePermissions[role.ID]?.find(p => p.PermissionId === permission.ID)?.isGranted;
                    return (
                      <li key={permission.ID} className={styles.permissionItem}>
                        <input
                          type='checkbox'
                          id={`${role.ID}-${permission.ID}`}
                          checked={isGranted || false}
                          onChange={() => handlePermissionChange(role.ID, permission.ID)}
                        />
                        <label htmlFor={`${role.ID}-${permission.ID}`}>{permission.ArabicName}</label>
                      </li>
                    );
                  })}
                </ul>

                <div className={styles.buttonGroup}>
                  <button
                    className={`${styles.addButton} ${
                      existingRolePermissions[role.ID]?.length > 0 ? styles.disabled : styles.enabled
                    }`}
                    onClick={() => handleAddPermissions(role.ID)}
                    disabled={existingRolePermissions[role.ID]?.length > 0}>
                    إضافة
                  </button>
                  <button
                    className={`${styles.updateButton} ${
                      modifiedPermissions[role.ID]?.size === 0 ? styles.disabled : styles.enabled
                    }`}
                    onClick={() => handleUpdatePermissions(role.ID)}
                    disabled={modifiedPermissions[role.ID]?.size === 0}>
                    تحديث
                  </button>
                </div>
              </td>
              <td>{role.ArabicName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolePermissionsTable;
