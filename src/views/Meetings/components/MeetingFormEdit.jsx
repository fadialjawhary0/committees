import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus, FaChevronDown, FaTrash } from 'react-icons/fa';

import { Checkbox, Modal } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

import { MeetingServices } from '../services/meetings.service';
import { MeetingMembersServices } from '../../../services/meetingMembers.service';
import { AgendaServices } from '../../../services/agenda.service';

import styles from './MeetingForms.module.scss';
import { ExtractDateFromDateTime } from '../../../helpers';

const MeetingFormEdit = () => {
  const { id: meetingId } = useParams();

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
  console.log('🚀 ~ MeetingFormEdit ~ formFields:', formFields);

  const [fieldsFetchedItems, setFieldsFetchedItems] = useState({
    committees: [],
    locations: [],
    buildings: [],
    rooms: [],
    meetingTypes: [],
    members: [],
  });

  // Setting FormFields
  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        const meetingDetails = await MeetingServices.commonMeetingEditDetails(meetingId);

        const normalizedMembers =
          meetingDetails?.Members?.map(member => ({
            UserID: member?.MeetingMember?.UserID,
            UserFullName: member?.UserFullName,
          })) || [];

        setFormFields({
          name: meetingDetails?.ArabicName,
          committeeID: meetingDetails?.CommitteeID,
          date: ExtractDateFromDateTime(meetingDetails?.Date),
          startTime: meetingDetails?.StartTime,
          endTime: meetingDetails?.EndTime,
          meetingLocationID: meetingDetails?.MeetingLocationID,
          building: meetingDetails?.BuildingID,
          room: meetingDetails?.RoomID,
          agenda: meetingDetails?.Agenda || [],
          notes: meetingDetails?.Notes || '',
          link: meetingDetails?.Link || '',
          members: normalizedMembers,
        });

        fetchMembersForCommittee(meetingDetails?.CommitteeID);
      } catch (error) {
        console.error('Error fetching meeting details:', error);
      }
    };

    fetchMeetingDetails();
  }, [meetingId]);

  // Fetching Committees, Locations, Buildings, Rooms, MeetingTypes, Members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meetingFields = await MeetingServices.commonFormItems();

        setFieldsFetchedItems({
          committees: meetingFields?.Committees,
          locations: meetingFields?.Locations,
          buildings: meetingFields?.Buildings,
          rooms: meetingFields?.Rooms,
          meetingTypes: meetingFields?.MeetingTypes,
          members: meetingFields?.Members,
        });
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

  const handleAgendaChange = (index, value) => {
    const newAgenda = formFields.agenda.map((item, i) => (i === index ? { ...item, Sentence: value } : item));
    setFormFields({ ...formFields, agenda: newAgenda });
  };

  const handleAddAgenda = () => {
    setFormFields(prev => ({
      ...prev,
      agenda: [...prev.agenda, { ID: null, Sentence: '', MeetingID: meetingId }],
    }));
  };

  const handleDeleteAgenda = index => {
    const newAgenda = formFields.agenda.filter((_, i) => i !== index);
    setFormFields({ ...formFields, agenda: newAgenda });
  };

  const handleCheckboxChange = (member, checked) => {
    const isAlreadyInMeeting = formFields.members.some(m => m?.UserID === member.UserID);

    if (checked && !isAlreadyInMeeting) {
      setFormFields(prev => ({
        ...prev,
        members: [...prev.members, { UserID: member.UserID, UserFullName: member.UserFullName }],
      }));
    } else if (!checked && isAlreadyInMeeting) {
      setFormFields(prev => ({
        ...prev,
        members: prev.members.filter(m => m?.UserID !== member.UserID),
      }));
    }
  };

  const handleSelectAll = checked => {
    setSelectAll(checked);
    if (checked) {
      setFormFields(prev => ({
        ...prev,
        members: fieldsFetchedItems.members.map(member => ({
          UserID: member.UserID,
          UserFullName: member.UserFullName,
        })),
      }));
    } else {
      setFormFields(prev => ({ ...prev, members: [] }));
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);

    const meetingPayload = {
      ID: meetingId,
      CommitteeID: parseInt(formFields?.committeeID),
      ArabicName: formFields?.name,
      EnglishName: formFields?.name,
      MeetingLocationID: parseInt(formFields?.meetingLocationID),
      BuildingID: formFields?.meetingLocationID === 1 ? parseInt(formFields?.building) : null,
      RoomID: formFields?.meetingLocationID === 1 ? parseInt(formFields?.room) : null,
      Date: formFields?.date,
      StartTime: formFields?.startTime,
      EndTime: formFields?.endTime,
      Notes: formFields?.notes,
      Link: formFields?.meetingLocationID === 2 ? formFields?.link : null,
    };

    try {
      await MeetingServices.update(meetingId, meetingPayload);

      const existingMeetingDetails = await MeetingServices.commonMeetingEditDetails(meetingId);
      const existingAgendas = existingMeetingDetails?.Agenda || [];
      const existingMembers =
        existingMeetingDetails?.Members.map(member => ({
          ID: member?.MeetingMember?.ID,
          UserID: member?.MeetingMember?.UserID,
          UserFullName: member?.UserFullName,
        })) || [];

      const nonEmptyAgendas = formFields?.agenda.filter(item => item?.Sentence?.trim().length);

      const agendasToDelete = existingAgendas.filter(
        existing => !nonEmptyAgendas.some(updated => updated.Sentence === existing.Sentence),
      );

      const agendasToAdd = nonEmptyAgendas.filter(
        updated => !existingAgendas.some(existing => existing.Sentence === updated.Sentence),
      );

      for (const agendaToDelete of agendasToDelete) {
        await AgendaServices.delete(agendaToDelete.ID);
      }
      for (const agendaToAdd of agendasToAdd) {
        await AgendaServices.create({
          MeetingID: meetingId,
          Sentence: agendaToAdd.Sentence.trim(),
        });
      }

      const membersToDelete = existingMembers.filter(
        existing => !formFields?.members.some(updated => updated.UserID === existing.UserID),
      );
      const membersToAdd = formFields?.members.filter(
        updated => !existingMembers.some(existing => existing.UserID === updated.UserID),
      );

      for (const memberToDelete of membersToDelete) {
        await MeetingMembersServices.delete(memberToDelete.ID);
      }
      for (const memberToAdd of membersToAdd) {
        await MeetingMembersServices.create({
          MeetingID: meetingId,
          UserID: memberToAdd.UserID,
        });
      }

      window.history.back();
    } catch (error) {
      console.error('Error updating the Meeting, Agenda, or Members:', error);
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
        <h4>تعديل الاجتماع</h4>
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
              <select value={formFields?.committeeID} disabled required>
                <option value=''>{fieldsFetchedItems?.committees?.find(c => c.ID === formFields.committeeID)?.ArabicName}</option>
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
                onChange={e => setFormFields({ ...formFields, meetingLocationID: parseInt(e.target.value) })}
                required>
                <option value='' disabled>
                  اختر نوع الموقع
                </option>
                {fieldsFetchedItems?.locations.map(option => (
                  <option key={option?.ID} value={option?.ID}>
                    {option?.ArabicName}
                  </option>
                ))}
              </select>
              <FaChevronDown />
            </div>
          </div>

          {formFields?.meetingLocationID === 1 ? (
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
                    {fieldsFetchedItems?.buildings.map(option => (
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
                    {fieldsFetchedItems?.rooms.map(option => (
                      <option key={option.ID} value={option.ID}>
                        {option.ArabicName}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown />
                </div>
              </div>
            </>
          ) : formFields?.meetingLocationID === 2 ? (
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
          ) : null}

          {/***** Agenda *****/}
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth} `}>
            <div className={styles.agendaHeader}>
              <label className={styles.agendaLabel}>جدول الأعمال</label>
              <button type='button' className={styles.sharedButton} onClick={handleAddAgenda}>
                <FaPlus className={styles.icon} /> إضافة بند جديد
              </button>
            </div>

            <div className={styles.agendaContainer}>
              {formFields.agenda.length === 0 ? (
                <p className={styles.emptyState}>لا يوجد عناصر مضافة حتى الآن. اضغط على "إضافة بند جديد" للبدء.</p>
              ) : (
                <ul className={styles.agendaList}>
                  {formFields.agenda.map((item, index) => (
                    <li key={index} className={styles.agendaItem}>
                      <input
                        className={styles.agendaInput}
                        value={item?.Sentence || ''}
                        onChange={e => handleAgendaChange(index, e.target.value)}
                        placeholder='أدخل بند جدول الأعمال'
                      />

                      <button type='button' className={styles.removeAgendaButton} onClick={() => handleDeleteAgenda(index)}>
                        <FaTrash className={styles.icon} /> حذف
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
                    formFields?.members.map(member => (
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
            <SaveIcon /> تعديل
            {loading && <span className={styles.loader}></span>}
          </button>
          <button type='button' className={styles.cancelButton} onClick={() => window.history.back()} disabled={loading}>
            <CancelIcon /> الغاء
          </button>
        </div>
      </form>

      {/***** Members Modal *****/}
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
                fieldsFetchedItems.members.map((member, index) => (
                  <tr key={member?.UserID}>
                    <td>
                      <Checkbox
                        checked={formFields.members.some(m => m?.UserID === member.UserID)} // Check by UserID
                        onChange={e => handleCheckboxChange(member, e.target.checked)}
                      />
                    </td>
                    <td>{member.UserFullName}</td>
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

export default MeetingFormEdit;
