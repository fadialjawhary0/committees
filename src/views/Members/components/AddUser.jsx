import React, { useState } from 'react';
import { FaSave, FaArrowLeft, FaPlus, FaChevronDown } from 'react-icons/fa';
import styles from './AddUser.module.scss';

const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [committeeRoles, setCommitteeRoles] = useState([{ committee: '', role: '' }]);

  const committeeOptions = [
    { value: 'Committee 1', label: 'Committee 1' },
    { value: 'Committee 2', label: 'Committee 2' },
    { value: 'Committee 3', label: 'Committee 3' },
  ];

  const handleSave = () => {
    console.log({ name, email, phoneNumber, committeeRoles });
  };

  const handleCommitteeRoleChange = (index, key, value) => {
    const updatedCommitteeRoles = [...committeeRoles];
    updatedCommitteeRoles[index][key] = value;
    setCommitteeRoles(updatedCommitteeRoles);
  };

  const addCommitteeRole = () => {
    setCommitteeRoles([...committeeRoles, { committee: '', role: '' }]);
  };

  const removeCommitteeRole = index => {
    const updatedCommitteeRoles = committeeRoles.filter((_, i) => i !== index);
    setCommitteeRoles(updatedCommitteeRoles);
  };

  return (
    <div>
      <div className={styles.formHeader}>
        <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />
        <h4>إضافة مستخدم جديد</h4>
      </div>
      <form>
        <div className={styles.formColumns}>
          <div className={styles.formGroup}>
            <label>الاسم</label>
            <input type='text' id='userName' value={name} onChange={e => setName(e.target.value)} placeholder='أدخل اسم المستخدم' required />
          </div>
          <div className={styles.formGroup}>
            <label>البريد الإلكتروني</label>
            <input type='email' id='userEmail' value={email} onChange={e => setEmail(e.target.value)} placeholder='أدخل البريد الإلكتروني' required />
          </div>
          <div className={styles.formGroup}>
            <label>رقم الهاتف</label>
            <input type='tel' id='userPhone' value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder='أدخل رقم الهاتف' required />
          </div>
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth} ${styles.committeeRolesGroup}`}>
            <label>اللجان والأدوار</label>
            {committeeRoles.map((cr, index) => (
              <div key={index} className={styles.committeeRolePair}>
                <div className={`${styles.selectContainer} select-container`}>
                  <select value={cr.committee} onChange={e => handleCommitteeRoleChange(index, 'committee', e.target.value)} required>
                    <option value=''>اختر اللجنة</option>
                    {committeeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown />
                </div>
                <input type='text' value={cr.role} onChange={e => handleCommitteeRoleChange(index, 'role', e.target.value)} placeholder='أدخل الدور' required />
                <button type='button' onClick={() => removeCommitteeRole(index)} className={styles.removeButton}>
                  إزالة
                </button>
              </div>
            ))}
            <button type='button' onClick={addCommitteeRole} className={styles.addCommitteeRoleButton}>
              <FaPlus /> إضافة لجنة أخرى
            </button>
          </div>
        </div>
        <button type='button' className={styles.saveButton} onClick={handleSave}>
          <FaSave /> حفظ
        </button>
      </form>
    </div>
  );
};

export default AddUser;
