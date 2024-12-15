import React, { useState } from 'react';
import { FaSave, FaArrowLeft, FaPlus, FaChevronDown } from 'react-icons/fa';
import { Checkbox, Modal } from '@mui/material';
import styles from './CreateMeeting.module.scss';
import { useLocation } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

const committeeOptions = [
  {
    value: 'لجنة الشؤون القانونية',
    label: 'لجنة الشؤون القانونية',
    users: ['Ahmed Ali', 'Omar Hussein', 'Fatima Hassan', 'Khaled Youssef', 'Sara Ahmad'],
  },
  {
    value: 'لجنة الشؤون الإستراتيجية',
    label: 'لجنة الشؤون الإستراتيجية',
    users: ['Mohammed Saleh', 'Sara Ahmad', 'Khaled Youssef'],
  },
  {
    value: 'لجنة متابعة مبادرات تحقيق الرؤية',
    label: 'لجنة متابعة مبادرات تحقيق الرؤية',
    users: ['Khaled Youssef', 'Amal Nasser'],
  },
  { value: 'لجنة شوؤن الموظفين', label: 'لجنة شوؤن الموظفين', users: ['Rania Omar', 'Yousef Al-Qassim', 'Amal Nasser'] },
  { value: 'لجنة الشؤون المالية', label: 'لجنة الشؤون المالية', users: ['Hiba Mustafa', 'Omar Hussein'] },
  { value: 'لجنة المشتريات والعقود', label: 'لجنة المشتريات والعقود', users: ['Ahmed Ali', 'Fatima Hassan'] },
  {
    value: 'لجنة متابعة المشاريع التشغيلية',
    label: 'لجنة متابعة المشاريع التشغيلية',
    users: ['Mohammed Saleh', 'Sara Ahmad', 'Amal Nasser'],
  },
  {
    value: 'لجنة متابعة المشاريع الإستراتيجية',
    label: 'لجنة متابعة المشاريع الإستراتيجية',
    users: ['Khaled Youssef', 'Amal Nasser'],
  },
];

const CreateMeeting = () => {
  const [meetingName, setMeetingName] = useState('');
  const [committee, setCommittee] = useState('');
  const [date, setDate] = useState('');
  const [locationType, setLocationType] = useState('');
  const [physicalLocation, setPhysicalLocation] = useState({ location: '', building: '', room: '' });
  const [agenda, setAgenda] = useState('');
  const [notes, setNotes] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommitteeMembers, setSelectedCommitteeMembers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleCommitteeChange = e => {
    const selectedCommittee = committeeOptions.find(option => option.value === e.target.value);
    setCommittee(e.target.value);
    setSelectedCommitteeMembers(selectedCommittee?.users || []);
    setMembers([]);
  };

  const handleCheckboxChange = (member, checked) => {
    if (checked) {
      setMembers(prev => [...prev, { name: member }]);
    } else {
      setMembers(prev => prev.filter(m => m.name !== member));
    }
  };

  const handleSelectAll = checked => {
    setSelectAll(checked);
    if (checked) {
      setMembers(selectedCommitteeMembers.map(member => ({ name: member })));
    } else {
      setMembers([]);
    }
  };

  const handleSave = () => {
    console.log({
      meetingName,
      committee,
      date,
      locationType,
      physicalLocation,
      agenda,
      notes,
      startTime,
      endTime,
      members,
    });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <div className={styles.formHeader}>
        <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />
        <h4>إنشاء اجتماع جديد</h4>
      </div>
      <form>
        <div className={styles.formColumns}>
          {/***** Meeting Name *****/}
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

          {/***** Committee *****/}
          <div className={styles.formGroup}>
            <label>اللجنة</label>
            <div className='select-container'>
              <select value={committee} onChange={handleCommitteeChange} required>
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

          {/***** Date, Start Time, End Time *****/}
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

          {/***** Location *****/}
          <div className={styles.formGroup}>
            <label>نوع الموقع</label>
            <div className='select-container'>
              <select value={locationType || 'اختر نوع الموقع'} onChange={e => setLocationType(e.target.value)} required>
                <option value='اختر نوع الموقع' disabled>
                  اختر نوع الموقع
                </option>
                <option value='physical'>فعلي</option>
                <option value='virtual'>افتراضي</option>
              </select>
              <FaChevronDown />
            </div>
          </div>

          {locationType === 'physical' && (
            <>
              {/***** Physical Location *****/}
              <div className={styles.formGroup}>
                <label>الموقع</label>
                <input
                  type='text'
                  value={physicalLocation.location}
                  onChange={e => setPhysicalLocation({ ...physicalLocation, location: e.target.value })}
                  placeholder='أدخل الموقع'
                  required
                />
              </div>

              {/***** Building *****/}
              <div className={styles.formGroup}>
                <label>المبنى</label>
                <input
                  type='text'
                  value={physicalLocation.building}
                  onChange={e => setPhysicalLocation({ ...physicalLocation, building: e.target.value })}
                  placeholder='أدخل المبنى'
                  required
                />
              </div>

              {/***** Room *****/}
              <div className={styles.formGroup}>
                <label>الغرفة</label>
                <input
                  type='text'
                  value={physicalLocation.room}
                  onChange={e => setPhysicalLocation({ ...physicalLocation, room: e.target.value })}
                  placeholder='أدخل الغرفة'
                  required
                />
              </div>
            </>
          )}

          {/***** Agenda *****/}
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label>جدول الأعمال</label>
            <textarea
              value={agenda}
              onChange={e => setAgenda(e.target.value)}
              placeholder='أدخل جدول الأعمال'
              required></textarea>
          </div>

          {/***** Notes *****/}
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label>ملاحظات</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder='أدخل ملاحظات الاجتماع'></textarea>
          </div>

          {/***** Members *****/}
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <div className={styles.usersTableHeader}>
              <label>أعضاء الاجتماع</label>
              <button type='button' className={styles.sharedButton} onClick={() => setIsModalOpen(true)}>
                <FaPlus /> إضافة أعضاء
              </button>
            </div>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>الاسم</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td>
                        <p className={styles.emptyTableLabel}>لا يوجد أعضاء</p>
                      </td>
                    </tr>
                  ) : (
                    members.map((member, index) => (
                      <tr key={index}>
                        <td>{member.name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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

      <Modal open={isModalOpen} onClose={toggleModal} className={styles.usersModal}>
        <div className={`${styles.modal} ${styles.tableContainer}`}>
          <table>
            <thead>
              <tr>
                <th>
                  <Checkbox checked={selectAll} onChange={e => handleSelectAll(e.target.checked)} style={{ color: 'white' }} />
                </th>
                <th>الاسم</th>
              </tr>
            </thead>
            <tbody>
              {selectedCommitteeMembers.length > 0 ? (
                <>
                  {selectedCommitteeMembers.map((member, index) => (
                    <tr key={index}>
                      <td>
                        <Checkbox
                          checked={members.some(m => m.name === member)}
                          onChange={e => handleCheckboxChange(member, e.target.checked)}
                        />
                      </td>
                      <td>{member}</td>
                    </tr>
                  ))}
                </>
              ) : (
                <td colSpan={2} style={{ textAlign: 'center', padding: '3rem' }}>
                  يرجى اضافة لجنة لهذا الإجتماع اولاً
                </td>
              )}
            </tbody>
          </table>
          <div className={`${styles.formButtonsContainer} ${styles.usersFormButtonsContainer}`}>
            <button type='button' className={styles.usersCancelButton} onClick={toggleModal}>
              الغاء
              <CancelIcon />
            </button>
            <button
              type='button'
              disabled={members.length === 0}
              className={`${styles.usersSaveButton} ${members.length === 0 ? `${styles.disabled}` : ''}`}
              onClick={toggleModal}>
              إضافة <SaveIcon />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateMeeting;
