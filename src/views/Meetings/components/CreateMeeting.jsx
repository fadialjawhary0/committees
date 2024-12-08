import React, { useState } from 'react';
import { FaSave, FaArrowLeft, FaPlus, FaChevronDown } from 'react-icons/fa';
import styles from './CreateMeeting.module.scss';

const committeeOptions = [
  { value: 'لجنة الشؤون القانونية', label: 'لجنة الشؤون القانونية' },
  { value: 'لجنة الشؤون الإستراتيجية', label: 'لجنة الشؤون الإستراتيجية' },
  { value: 'لجنة متابعة مبادرات تحقيق الرؤية', label: 'لجنة متابعة مبادرات تحقيق الرؤية' },
  { value: 'لجنة شوؤن الموظفين', label: 'لجنة شوؤن الموظفين' },
  { value: 'لجنة الشؤون المالية', label: 'لجنة الشؤون المالية' },
  { value: 'لجنة المشتريات والعقود', label: 'لجنة المشتريات والعقود' },
  { value: 'لجنة متابعة المشاريع التشغيلية', label: 'لجنة متابعة المشاريع التشغيلية' },
  { value: 'لجنة متابعة المشاريع الإستراتيجية', label: 'لجنة متابعة المشاريع الإستراتيجية' },
];

const peopleOptions = [
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
];

const CreateMeeting = () => {
  const [meetingName, setMeetingName] = useState('');
  const [committee, setCommittee] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [agenda, setAgenda] = useState('');
  const [invitedPeople, setInvitedPeople] = useState([{ person: '', role: '' }]);
  const [notes, setNotes] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSave = () => {
    console.log({
      meetingName,
      committee,
      date,
      location,
      agenda,
      invitedPeople,
      notes,
    });
  };

  const handleInviteChange = (index, key, value) => {
    const updatedInvites = [...invitedPeople];
    updatedInvites[index][key] = value;
    setInvitedPeople(updatedInvites);
  };

  const addInvite = () => {
    setInvitedPeople([...invitedPeople, { person: '', role: '' }]);
  };

  const removeInvite = index => {
    const updatedInvites = invitedPeople.filter((_, i) => i !== index);
    setInvitedPeople(updatedInvites);
  };

  return (
    <div>
      <div className={styles.formHeader}>
        <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />
        <h4>إنشاء اجتماع جديد</h4>
      </div>
      <form>
        <div className={styles.formColumns}>
          <div className={styles.formGroup}>
            <label>اسم الاجتماع</label>
            <input
              type='text'
              value={meetingName}
              onChange={e => setMeetingName(e.target.value)}
              placeholder='أدخل اسم الاجتماع'
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>اللجنة</label>
            <div className='select-container'>
              <select value={committee} onChange={e => setCommittee(e.target.value)} required>
                <option value=''>اختر اللجنة</option>
                {committeeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <FaChevronDown />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>تاريخ الاجتماع</label>
            <input type='date' value={date} onChange={e => setDate(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label>وقت البدء</label>
            <input type='time' value={startTime} onChange={e => setStartTime(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label>وقت الانتهاء</label>
            <input type='time' value={endTime} onChange={e => setEndTime(e.target.value)} required />
          </div>

          {/* <div className={styles.formGroup}>
            <label>المكان</label>
            <input type='text' value={location} onChange={e => setLocation(e.target.value)} placeholder='أدخل مكان الاجتماع' required />
          </div> */}
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label>جدول الأعمال</label>
            <textarea
              value={agenda}
              onChange={e => setAgenda(e.target.value)}
              placeholder='أدخل جدول الأعمال'
              required></textarea>
          </div>
          {/* <div className={`${styles.formGroup} ${styles.formGroupFullWidth} ${styles.invitePeopleGroup}`}>
            <label>المدعوون</label>
            {invitedPeople.map((invite, index) => (
              <div key={index} className={styles.invitePair}>
                <select value={invite.person} onChange={e => handleInviteChange(index, 'person', e.target.value)} required>
                  <option value=''>اختر شخص</option>
                  {peopleOptions.map(option => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <input type='text' value={invite.role} onChange={e => handleInviteChange(index, 'role', e.target.value)} placeholder='أدخل الدور' required />
                <button type='button' onClick={() => removeInvite(index)} className={styles.removeButton}>
                  إزالة
                </button>
              </div>
            ))}
            <button type='button' onClick={addInvite} className={styles.addInviteButton}>
              <FaPlus />
              <p>إضافة مدعو آخر</p>
            </button>
          </div> */}
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label>ملاحظات</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder='أدخل ملاحظات الاجتماع'></textarea>
          </div>
        </div>

        <button type='button' className={styles.saveButton} onClick={handleSave}>
          <FaSave /> حفظ
        </button>
      </form>
    </div>
  );
};

export default CreateMeeting;
