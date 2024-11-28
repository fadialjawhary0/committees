import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaPlus } from 'react-icons/fa';
import './AddUserStyles.scss';

const EditUser = () => {
  const { id } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [committeeRoles, setCommitteeRoles] = useState([{ committee: '', role: '' }]);

  const committeeOptions = [
    { value: 'Committee 1', label: 'Committee 1' },
    { value: 'Committee 2', label: 'Committee 2' },
    { value: 'Committee 3', label: 'Committee 3' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = {
        name: 'Ahmed Ali',
        email: 'ahmed.ali@example.com',
        phoneNumber: '123456789',
        committeeRoles: [
          { committee: 'Committee 1', role: 'Admin' },
          { committee: 'Committee 2', role: 'Member' },
        ],
      };

      setName(userData.name);
      setEmail(userData.email);
      setPhoneNumber(userData.phoneNumber);
      setCommitteeRoles(userData.committeeRoles);
    };

    fetchUserData();
  }, [id]);

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
    <div className='add-user-page'>
      <div className='page-header'>
        <FaArrowLeft className='back-icon' onClick={() => window.history.back()} />
        <h1>تعديل بيانات المستخدم</h1>
      </div>
      <form className='add-user-form'>
        <div className='form-columns'>
          <div className='form-group'>
            <label htmlFor='userName'>الاسم</label>
            <input type='text' id='userName' value={name} onChange={e => setName(e.target.value)} placeholder='أدخل اسم المستخدم' required />
          </div>
          <div className='form-group'>
            <label htmlFor='userEmail'>البريد الإلكتروني</label>
            <input type='email' id='userEmail' value={email} onChange={e => setEmail(e.target.value)} placeholder='أدخل البريد الإلكتروني' required />
          </div>
          <div className='form-group'>
            <label htmlFor='userPhone'>رقم الهاتف</label>
            <input type='tel' id='userPhone' value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder='أدخل رقم الهاتف' required />
          </div>
        </div>
        <div className='form-group committee-roles-group'>
          <label>اللجان والأدوار</label>
          {committeeRoles.map((cr, index) => (
            <div key={index} className='committee-role-pair'>
              <select value={cr.committee} onChange={e => handleCommitteeRoleChange(index, 'committee', e.target.value)} required>
                <option value=''>اختر اللجنة</option>
                {committeeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input type='text' value={cr.role} onChange={e => handleCommitteeRoleChange(index, 'role', e.target.value)} placeholder='أدخل الدور' required />
              <button type='button' onClick={() => removeCommitteeRole(index)} className='remove-button'>
                إزالة
              </button>
            </div>
          ))}
          <button type='button' onClick={addCommitteeRole} className='add-committee-role-button'>
            <FaPlus /> إضافة لجنة أخرى
          </button>
        </div>
        <button type='button' className='save-button' onClick={handleSave}>
          <FaSave /> حفظ
        </button>
      </form>
    </div>
  );
};

export default EditUser;
