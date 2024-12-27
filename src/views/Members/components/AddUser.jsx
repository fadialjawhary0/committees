import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

import styles from './AddUser.module.scss';
import { MemberServices } from '../services/member.service';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState(0);

  // const [committeeRoles, setCommitteeRoles] = useState([{ committee: '', role: '' }]);

  // const committeeOptions = [
  //   { value: 'Committee 1', label: 'Committee 1' },
  //   { value: 'Committee 2', label: 'Committee 2' },
  //   { value: 'Committee 3', label: 'Committee 3' },
  // ];

  const roleMap = {
    مدير: 1,
    مستخدم: 2,
  };

  const handleSave = async e => {
    e.preventDefault();

    const preparedData = {
      UserFullName: name,
      UserName: username,
      Email: email,
      RoleID: roleMap[role],
      PhoneNumber: phoneNumber,
    };
    console.log(preparedData);

    try {
      await MemberServices.create(preparedData);
    } catch (error) {
      console.log('error');
    } finally {
      navigate('/users');
    }
  };

  // const handleCommitteeRoleChange = (index, key, value) => {
  //   const updatedCommitteeRoles = [...committeeRoles];
  //   updatedCommitteeRoles[index][key] = value;
  //   setCommitteeRoles(updatedCommitteeRoles);
  // };

  // const addCommitteeRole = () => {
  //   setCommitteeRoles([...committeeRoles, { committee: '', role: '' }]);
  // };

  // const removeCommitteeRole = index => {
  //   const updatedCommitteeRoles = committeeRoles.filter((_, i) => i !== index);
  //   setCommitteeRoles(updatedCommitteeRoles);
  // };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h4>إضافة مستخدم جديد</h4>
      </div>
      <form onSubmit={handleSave}>
        <div className={styles.formColumns}>
          <div className={styles.formGroup}>
            <label>الاسم</label>
            <input
              type='text'
              id='userName'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='أدخل الاسم'
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>اسم المستخدم</label>
            <input
              type='text'
              id='userName'
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder='أدخل اسم المستخدم'
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>البريد الإلكتروني</label>
            <input
              type='email'
              id='userEmail'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='أدخل البريد الإلكتروني'
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>رقم الهاتف</label>
            <input
              type='tel'
              id='userPhone'
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder='أدخل رقم الهاتف'
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>الصلاحيات</label>
            <div className='select-container'>
              <select required value={role} onChange={e => setRole(e.target.value)}>
                <option value=''>اختر الصلاحيات</option>
                <option value='مدير'>مدير</option>
                <option value='مستخدم'>مستخدم</option>
              </select>
              <FaChevronDown />
            </div>
          </div>
          {/* <div className={`${styles.formGroup} ${styles.formGroupFullWidth} ${styles.committeeRolesGroup}`}>
            <label>اللجان والأدوار</label>
            {committeeRoles.map((cr, index) => (
              <div key={index} className={styles.committeeRolePair}>
                <div className={`${styles.selectContainer} select-container`}>
                  <select
                    value={cr.committee}
                    onChange={e => handleCommitteeRoleChange(index, 'committee', e.target.value)}
                    required>
                    <option value=''>اختر اللجنة</option>
                    {committeeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown />
                </div>
                <input
                  type='text'
                  value={cr.role}
                  onChange={e => handleCommitteeRoleChange(index, 'role', e.target.value)}
                  placeholder='أدخل الدور'
                  required
                />
                <button type='button' onClick={() => removeCommitteeRole(index)} className={styles.removeButton}>
                  إزالة
                </button>
              </div>
            ))}
            <button type='button' onClick={addCommitteeRole} className={styles.addCommitteeRoleButton}>
              <FaPlus /> إضافة لجنة أخرى
            </button>
          </div> */}
        </div>

        <div className={styles.formButtonsContainer}>
          <button type='submit' className={styles.saveButton}>
            <SaveIcon /> حفظ
          </button>
          <button type='button' className={styles.cancelButton} onClick={() => window.history.back()}>
            <CancelIcon /> الغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
