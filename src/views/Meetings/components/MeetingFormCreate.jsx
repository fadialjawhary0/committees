import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaPlus, FaChevronDown, FaTrash } from 'react-icons/fa';

import { Checkbox, Modal } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

import { MeetingServices } from '../services/meetings.service';

import styles from './MeetingForms.module.scss';
import apiService from '../../../services/axiosApi.service';
import { useToast } from '../../../context';
import { MeetingStatus, ToastMessage } from '../../../constants';

const MeetingFormCreate = () => {
  const { showToast } = useToast();

  const location = useLocation();
  const { mode, committeeId, committeeName } = location?.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: '',
    committeeID: '',
    date: '',
    startTime: '',
    endTime: '',
    meetingLocationID: '',
    building: '',
    room: '',
    agenda: [],
    notes: '',
    link: '',
    members: [],
  });

  const [fieldsFetchedItems, setFieldsFetchedItems] = useState({
    committees: [],
    locations: [],
    buildings: [],
    rooms: [],
    meetingTypes: [],
    members: [],
  });

  const handleAddAgenda = () => {
    setFormFields({ ...formFields, agenda: [...formFields?.agenda, ''] });
  };

  const handleDeleteAgenda = index => {
    const newAgenda = formFields?.agenda?.filter((item, i) => i !== index);
    setFormFields({ ...formFields, agenda: newAgenda });
  };

  const handleAgendaChange = (index, value) => {
    const newAgenda = formFields?.agenda?.map((item, i) => (i === index ? value : item));
    setFormFields({ ...formFields, agenda: newAgenda });
  };

  const handleCheckboxChange = (member, checked) => {
    if (checked) {
      setFormFields(prev => ({
        ...prev,
        members: [...prev.members, { UserID: member?.UserID, UserFullName: member?.UserFullName }],
      }));
    } else {
      setFormFields(prev => ({
        ...prev,
        members: prev.members.filter(m => m?.UserID !== member?.UserID),
      }));
    }
  };

  const handleSelectAll = checked => {
    setSelectAll(checked);
    if (checked) {
      setFormFields(prev => ({
        ...prev,
        members: fieldsFetchedItems?.members?.map(member => ({
          UserID: member?.UserID,
          UserFullName: member?.UserFullName,
        })),
      }));
    } else {
      setFormFields(prev => ({ ...prev, members: [] }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const meetingFields = await MeetingServices.commonFormItems();
        const locationsData = await apiService?.getAll('GetAllLocation');
        const buildingsData = await apiService?.getAll('GetAllBuildings');
        const roomsData = await apiService?.getAll('GetAllRoom');
        const membersData = await apiService?.getAll(`GetAllMember/${localStorage.getItem('selectedCommitteeID')}`);

        console.log('🚀 ~ fetchData ~ membersData:', membersData);
        setFieldsFetchedItems({
          // committees: meetingFields?.Committees,
          locations: locationsData,
          buildings: buildingsData,
          rooms: roomsData,
          // meetingTypes: meetingFields?.MeetingTypes,
          members: membersData,
        });

        if (mode === 'add' && committeeId) {
          setFormFields(prev => ({
            ...prev,
            committeeID: committeeId,
          }));
        }
      } catch {
        console.log('error');
      }
    };
    fetchData();
  }, []);

  const fetchMembersForCommittee = async committeeId => {
    if (!committeeId) {
      setFieldsFetchedItems(prev => ({ ...prev, members: [] }));
      return;
    }

    try {
      const response = await MeetingServices.commonFormItems(committeeId);
      setFieldsFetchedItems(prev => ({
        ...prev,
        members: response?.Members || [],
      }));
    } catch (error) {
      console.error('Error fetching members for the committee:', error);
    }
  };

  useEffect(() => {
    if (mode === 'add' && committeeId) {
      fetchMembersForCommittee(committeeId);
    }
  }, [mode, committeeId]);

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);

    const meetingPayload = {
      CommitteeID: parseInt(formFields?.committeeID),
      ArabicName: formFields?.name,
      EnglishName: formFields?.name,
      MeetingLocationID: parseInt(formFields?.meetingLocationID),
      BuildingID: parseInt(formFields?.building),
      RoomID: parseInt(formFields?.room),
      Date: formFields?.date,
      StartTime: formFields?.startTime,
      EndTime: formFields?.endTime,
      Notes: formFields?.notes,
      Link: formFields?.link,
      StatusId: MeetingStatus?.Upcoming,
    };
    console.log('🚀 ~ handleSave ~ meetingPayload:', meetingPayload);

    try {
      const response = await apiService.create('AddMeeting', meetingPayload);
      const newMeetingID = response?.ID;

      const nonEmptyAgendas = formFields?.agenda.filter(item => item.trim().length);
      for (const agendaItem of nonEmptyAgendas) {
        await apiService.create('AddAgenda', {
          MeetingID: 26,
          Sentence: agendaItem,
        });
      }

      for (const member of formFields?.members) {
        await apiService.create('AddMeetingMember', {
          MeetingID: newMeetingID,
          UserID: member?.UserID,
        });
      }

      showToast(ToastMessage?.MeetingSuccessCreation, 'success');
      window.history.back();
    } catch (error) {
      console.error('Error saving the Meeting, Agenda, or Members:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={styles.createMeeting}>
      <div className={styles.formHeader}>
        <h4>إنشاء اجتماع جديد</h4>
      </div>
      <form onSubmit={handleSave}>
        <div className={styles.formColumns}>
          {/***** Meeting Name *****/}
          <div className={styles.formGroup}>
            <label>اسم الاجتماع</label>
            <input
              type='text'
              value={formFields?.name}
              onChange={e => setFormFields({ ...formFields, name: e.target.value })}
              placeholder='أدخل اسم الاجتماع'
              required
            />
          </div>

          {/***** Committee *****/}
          <div className={styles.formGroup}>
            <label>اللجنة</label>
            <div className='select-container'>
              <select
                value={committeeId}
                // onChange={handleCommitteeChange}
                disabled={mode === 'add' && committeeId}
                required>
                {/* <option value=''>اختر اللجنة</option> */}
                <option value={committeeId}>{committeeName}</option>
                {/* {fieldsFetchedItems?.committees?.map(option => (
                  <option key={option?.ID} value={option.ID}>
                    {option?.ArabicName}
                  </option>
                ))} */}
              </select>
              <FaChevronDown />
            </div>
          </div>

          {/***** Date, Start Time, End Time *****/}
          <div className={styles.formGroup}>
            <label>تاريخ الاجتماع</label>
            <input
              type='date'
              value={formFields?.date}
              onChange={e => setFormFields({ ...formFields, date: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>وقت البدء</label>
            <input
              type='time'
              value={formFields?.startTime}
              onChange={e => setFormFields({ ...formFields, startTime: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>وقت الانتهاء</label>
            <input
              type='time'
              value={formFields?.endTime}
              onChange={e => setFormFields({ ...formFields, endTime: e.target.value })}
              required
            />
          </div>

          {/***** Location *****/}
          <div className={styles.formGroup}>
            <label>نوع الموقع</label>
            <div className='select-container'>
              <select
                value={formFields?.meetingLocationID}
                onChange={e => setFormFields({ ...formFields, meetingLocationID: e.target.value })}
                required>
                <option value='' disabled>
                  اختر نوع الموقع
                </option>
                {fieldsFetchedItems?.locations?.map(option => (
                  <option key={option?.ID} value={option?.ID}>
                    {option?.ArabicName}
                  </option>
                ))}
              </select>
              <FaChevronDown />
            </div>
          </div>

          {formFields?.meetingLocationID === '1' ? (
            <>
              {/***** Building *****/}
              <div className={styles.formGroup}>
                <label>المبنى</label>
                <div className='select-container'>
                  <select
                    value={formFields?.building}
                    onChange={e => setFormFields({ ...formFields, building: e.target.value })}
                    required>
                    <option value='' disabled>
                      اختر المبنى
                    </option>
                    {fieldsFetchedItems?.buildings?.map(option => (
                      <option key={option?.ID} value={option?.ID}>
                        {option?.ArabicName}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown />
                </div>
              </div>

              {/***** Room *****/}
              <div className={styles.formGroup}>
                <label>الغرفة</label>
                <div className='select-container'>
                  <select
                    value={formFields?.room}
                    onChange={e => setFormFields({ ...formFields, room: e.target.value })}
                    required>
                    <option value='' disabled>
                      اختر الغرفة
                    </option>
                    {fieldsFetchedItems?.rooms?.map(option => (
                      <option key={option?.ID} value={option?.ID}>
                        {option?.ArabicName}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown />
                </div>
              </div>
            </>
          ) : formFields?.meetingLocationID === '2' ? (
            <div className={styles.formGroup}>
              <label>الرابط الالكتروني</label>
              <input
                type='text'
                value={formFields?.link}
                onChange={e => setFormFields({ ...formFields, link: e.target.value })}
                placeholder='أدخل الرابط الالكتروني'
                required
              />
            </div>
          ) : (
            <></>
          )}

          {/***** Agenda *****/}
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth} `}>
            <div className={styles.agendaHeader}>
              <label className={styles.agendaLabel}>جدول الأعمال</label>
              <button type='button' className={styles.sharedButton} onClick={handleAddAgenda}>
                <FaPlus className={styles.icon} /> إضافة بند جديد
              </button>
            </div>

            <div className={styles.agendaContainer}>
              {/* Empty state */}
              {formFields.agenda.length === 0 && (
                <p className={styles.emptyState}>
                  لم يتم إضافة أي عناصر إلى جدول الأعمال حتى الآن. اضغط على "إضافة بند جديد" للبدء.
                </p>
              )}

              {/* Agenda Items */}
              <ul className={styles.agendaList}>
                {formFields?.agenda?.map((item, index) => (
                  <li key={index} className={styles.agendaItem}>
                    <input
                      className={styles.agendaInput}
                      value={item}
                      onChange={e => handleAgendaChange(index, e.target.value)}
                      placeholder='أدخل بند جدول الأعمال'
                    />
                    <button type='button' className={styles.removeAgendaButton} onClick={() => handleDeleteAgenda(index)}>
                      <FaTrash className={styles.icon} /> حذف
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/***** Notes *****/}
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label>ملاحظات</label>
            <textarea
              value={formFields?.notes}
              onChange={e => setFormFields({ ...formFields, notes: e.target.value })}
              placeholder='أدخل ملاحظات الاجتماع'></textarea>
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
                  {formFields?.members?.length === 0 ? (
                    <tr>
                      <td>
                        <p className={styles.emptyTableLabel}>لا يوجد أعضاء</p>
                      </td>
                    </tr>
                  ) : (
                    formFields?.members?.map(member => (
                      <tr key={member?.UserID}>
                        <td>{member?.UserFullName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/***** Form Buttons *****/}
        <div className={styles.formButtonsContainer}>
          <button type='submit' className={`${styles.saveButton} ${loading ? styles.loading : ''}`} disabled={loading}>
            <SaveIcon /> حفظ
            {loading && <span className={styles.loader}></span>}
          </button>

          <button type='button' className={styles.cancelButton} onClick={() => window.history.back()} disabled={loading}>
            <CancelIcon /> الغاء
          </button>
        </div>
      </form>

      {/* Members Modal */}
      <Modal open={isModalOpen} onClose={toggleModal} className={styles.usersModal}>
        <div className={`${styles.modal} ${styles.tableContainer}`}>
          <table>
            <thead>
              <tr>
                <th>
                  <Checkbox checked={selectAll} onChange={e => handleSelectAll(e.target.checked)} />
                </th>
                <th>الاسم</th>
              </tr>
            </thead>
            <tbody>
              {fieldsFetchedItems?.members?.length > 0 ? (
                fieldsFetchedItems?.members?.map((member, index) => (
                  <tr key={index}>
                    <td>
                      <Checkbox
                        checked={formFields.members.some(m => m?.UserID === member?.UserID)}
                        onChange={e => handleCheckboxChange(member, e.target.checked)}
                      />
                    </td>
                    <td>{member?.UserFullName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', padding: '3rem' }}>
                    يرجى اضافة لجنة لهذا الإجتماع اولاً
                  </td>
                </tr>
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
              disabled={formFields.members.length === 0}
              className={`${styles.usersSaveButton} ${formFields.members.length === 0 ? `${styles.disabled}` : ''}`}
              onClick={toggleModal}>
              إضافة <SaveIcon />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MeetingFormCreate;
