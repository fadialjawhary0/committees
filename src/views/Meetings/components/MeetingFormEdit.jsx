import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus, FaChevronDown, FaTrash, FaArrowLeft } from 'react-icons/fa';

import { Checkbox, Modal } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

import styles from './MeetingForms.module.scss';
import { ExtractDateFromDateTime } from '../../../helpers';
import apiService from '../../../services/axiosApi.service';
import { ALLOWED_FILE_EXTENSIONS, LogTypes, MAX_FILE_SIZE_MB, MeetingLocation, ToastMessage } from '../../../constants';
import { useToast } from '../../../context';

const MeetingFormEdit = () => {
  const { id: meetingId } = useParams();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    ArabicName: '',
    committeeID: '',
    date: '',
    startTime: '',
    endTime: '',
    meetingLocationID: '',
    BuildingID: '',
    RoomID: '',
    agenda: [],
    topics: [],
    notes: '',
    link: '',
    members: [],
    statusId: '',
    meetingTypeID: '',
    relatedAttachments: [],
  });
  const [fieldsFetchedItems, setFieldsFetchedItems] = useState({
    locations: [],
    buildings: [],
    rooms: [],
    meetingTypes: [],
    committeeMembers: [],
  });

  const fetchInitialData = useCallback(async () => {
    try {
      const [meetingDetails, agendas, meetingMembers, locations, buildings, rooms, meetingTypes, relatedAttachments, topics] =
        await Promise.all([
          apiService.getById('GetMeeting', meetingId),
          apiService.getById('GetAgendaByMeeting', meetingId),
          apiService.getById('GetAllMeetingMemberByMeetingID', meetingId),
          apiService.getAll('GetAllLocation'),
          apiService.getAll('GetAllBuildings'),
          apiService.getAll('GetAllRoom'),
          apiService.getAll('GetAllMeetingType'),
          apiService.getById('GetAllRelatedAttachmentMeetingByCommitteeID', meetingId),
          apiService.getById('GetMeetingTopicByMeeting', meetingId),
        ]);

      setFormFields({
        ArabicName: meetingDetails?.ArabicName,
        committeeID: meetingDetails?.CommitteeID,
        date: ExtractDateFromDateTime(meetingDetails?.Date),
        startTime: meetingDetails?.StartTime,
        endTime: meetingDetails?.EndTime,
        meetingLocationID: meetingDetails?.MeetingLocationID,
        BuildingID: meetingDetails?.BuildingID,
        RoomID: meetingDetails?.RoomID,
        agenda: agendas || [],
        topics: topics || [],
        notes: meetingDetails?.Notes || '',
        link: meetingDetails?.Link || '',
        members: meetingMembers || [],
        statusId: meetingDetails?.StatusId,
        meetingTypeID: meetingDetails?.MeetingTypeID,
        relatedAttachments: relatedAttachments || [],
      });

      setFieldsFetchedItems({
        locations,
        buildings,
        rooms,
        meetingTypes,
        committeeMembers: await apiService.getById('GetAllMember', meetingDetails?.CommitteeID),
      });
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  }, [meetingId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // const handleInputChange = (field, value) => {
  //   setFormFields(prev => ({ ...prev, [field]: value }));
  // };

  const handleAgendaChange = (index, value) => {
    setFormFields(prev => ({
      ...prev,
      agenda: prev.agenda?.map((item, i) => (i === index ? { ...item, Sentence: value } : item)),
    }));
  };

  const handleAddAgenda = () => {
    setFormFields(prev => ({
      ...prev,
      agenda: [...prev.agenda, { Sentence: '', MeetingID: parseInt(meetingId) }],
    }));
  };

  const handleDeleteAgenda = index => {
    setFormFields(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index),
    }));
  };

  const handleTopicChange = (index, value) => {
    setFormFields(prev => ({
      ...prev,
      topics: prev.topics?.map((item, i) => (i === index ? { ...item, Sentence: value } : item)),
    }));
  };

  const handleAddTopic = () => {
    setFormFields(prev => ({
      ...prev,
      topics: [...prev.topics, { Sentence: '', MeetingID: parseInt(meetingId) }],
    }));
  };

  const handleDeleteTopic = index => {
    setFormFields(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  const handleCheckboxChange = (member, checked) => {
    const isAlreadyInMeeting = formFields.members.some(m => m?.MemberID === member?.ID);

    if (checked && !isAlreadyInMeeting) {
      setFormFields(prev => ({
        ...prev,
        members: [...prev.members, { MeetingID: meetingId, MemberID: member?.ID, FullName: member?.Name }],
      }));
    } else if (!checked && isAlreadyInMeeting) {
      setFormFields(prev => ({
        ...prev,
        members: prev.members.filter(m => m?.MemberID !== member?.ID),
      }));
    }
  };

  const handleSelectAll = checked => {
    setSelectAll(checked);
    setFormFields(prev => ({
      ...prev,
      members: checked
        ? fieldsFetchedItems?.committeeMembers?.map(member => ({
            MeetingID: meetingId,
            MemberID: member?.ID,
            FullName: member?.Name,
          }))
        : [],
    }));
  };

  const validateAndConvertFile = file => {
    return new Promise((resolve, reject) => {
      if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
        showToast(ToastMessage?.FileUploadSizeExceeding, 'error');
        reject(new Error('File too large'));
        return;
      }

      const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
        showToast(ToastMessage?.FileUploadExtensionNotAllowed, 'error');
        reject(new Error('Invalid file extension'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () =>
        resolve({ DocumentContent: reader.result.split(',')[1], DocumentExt: extension, DocumentName: file.name });
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async event => {
    const selectedFiles = Array.from(event.target.files);

    try {
      const convertedFiles = await Promise.all(selectedFiles?.map(validateAndConvertFile));
      setFormFields(prev => ({
        ...prev,
        relatedAttachments: [...prev.relatedAttachments, ...convertedFiles],
      }));
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const handleDeleteFile = index => {
    const updatedFiles = formFields?.relatedAttachments.filter((_, i) => i !== index);
    setFormFields({ ...formFields, relatedAttachments: updatedFiles });
  };

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.update(
        'UpdateMeeting',
        {
          ID: meetingId,
          ...(() => {
            const { relatedAttachments, ...rest } = formFields;
            return rest;
          })(),
        },
        LogTypes?.Meeting?.Update,
      );

      const originalAgendas = await apiService.getById('GetAgendaByMeeting', meetingId);
      const originalTopics = await apiService.getById('GetMeetingTopicByMeeting', meetingId);
      const originalMembers = await apiService.getById('GetAllMeetingMemberByMeetingID', meetingId);

      const addedAgendas = formFields.agenda.filter(a => !a?.ID);
      const deletedAgendas = originalAgendas.filter(o => !formFields.agenda.some(a => a?.ID === o?.ID));
      const updatedAgendas = formFields.agenda.filter(
        a => a?.ID && originalAgendas.some(o => o?.ID === a?.ID && o?.Sentence !== a?.Sentence),
      );

      await Promise.all([
        ...addedAgendas?.map(a => apiService.create('AddAgenda', { ...a, MeetingID: meetingId })),
        ...deletedAgendas?.map(a => apiService.delete('DeleteAgenda', a?.ID)),
        ...updatedAgendas?.map(a => apiService.update('UpdateAgenda', a)),
      ]);

      const addedTopics = formFields.topics.filter(t => !t?.ID);
      const deletedTopics = originalTopics.filter(o => !formFields.topics.some(t => t?.ID === o?.ID));
      const updatedTopics = formFields.topics.filter(
        t => t?.ID && originalTopics.some(o => o?.ID === t?.ID && o?.Sentence !== t?.Sentence),
      );

      await Promise.all([
        ...addedTopics?.map(t => apiService.create('AddMeetingTopic', { ...t, MeetingID: meetingId })),
        ...deletedTopics?.map(t => apiService.delete('DeleteMeetingTopic', t?.ID)),
        ...updatedTopics?.map(t => apiService.update('UpdateMeetingTopic', t)),
      ]);

      const addedMembers = formFields.members.filter(m => !originalMembers.some(o => o?.MemberID === m?.MemberID));
      const deletedMembers = originalMembers.filter(o => !formFields.members.some(m => m?.MemberID === o?.MemberID));

      await Promise.all([
        ...addedMembers?.map(m =>
          apiService.create(
            'AddMeetingMember',
            {
              MemeberID: m?.MemberID,
              MeetingID: meetingId,
            },
            LogTypes?.AddMembers?.MeetingMemberAdd,
          ),
        ),
        ...deletedMembers?.map(m =>
          apiService.delete('DeleteMeetingMember', m?.ID, LogTypes?.DeleteMembers?.MeetingMemberDelete),
        ),
      ]);

      const originalFilesIDs = await apiService
        ?.getById('GetAllRelatedAttachmentMeetingByCommitteeID', meetingId)
        .then(data => data.map(file => file?.ID));
      const currentFilesIDs = formFields?.relatedAttachments?.map(file => file.ID) || [];
      const filesToDelete = originalFilesIDs?.filter(id => !currentFilesIDs?.includes(id));
      const filesToAdd = formFields?.relatedAttachments?.filter(file => !originalFilesIDs.includes(file?.ID));

      for (const fileId of filesToDelete) {
        await apiService?.delete('/DeleteRelatedAttachmentMeeting', fileId, LogTypes?.Files?.Delete);
      }
      for (const file of filesToAdd) {
        await apiService?.create(
          '/AddRelatedAttachmentMeeting',
          {
            CommitteeID: +localStorage.getItem('selectedCommitteeID'),
            MeetingID: +meetingId,
            DocumentContent: file?.DocumentContent,
            DocumentExt: file?.DocumentExt,
            DocumentName: file?.DocumentName,
          },
          LogTypes?.Files?.Create,
        );
      }

      window.history.back();
    } catch (error) {
      console.error('Error saving meeting details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className={styles.createMeeting}>
      <div className={styles.formHeader}>
        <FaArrowLeft className={styles.backIcon} onClick={() => window.history.back()} />

        <h4>تعديل الاجتماع</h4>
      </div>
      <form onSubmit={handleSave}>
        <div className={styles.formColumns}>
          {/***** Meeting Name *****/}
          <div className={styles.formGroup}>
            <label>اسم الاجتماع</label>
            <input
              type='text'
              value={formFields?.ArabicName}
              onChange={e => setFormFields({ ...formFields, ArabicName: e.target.value })}
              placeholder='أدخل اسم الاجتماع'
              required
            />
          </div>

          {/***** Committee *****/}
          <div className={styles.formGroup}>
            <label>اللجنة</label>
            <div className='select-container'>
              <select
                value={localStorage.getItem('selectedCommitteeID')}
                disabled={localStorage.getItem('selectedCommitteeID')}
                required>
                <option value={localStorage.getItem('selectedCommitteeID')}>
                  {localStorage.getItem('selectedCommitteeName')}
                </option>
              </select>
              <FaChevronDown />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>نوع الاجتماع</label>
            <div className='select-container'>
              <select
                value={formFields?.meetingTypeID}
                onChange={e => setFormFields({ ...formFields, meetingTypeID: e.target.value })}
                required>
                <option value='' disabled>
                  اختر نوع الاجتماع
                </option>
                {fieldsFetchedItems?.meetingTypes?.map(option => (
                  <option key={option?.ID} value={option?.ID}>
                    {option?.ArabicName}
                  </option>
                ))}
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
                {fieldsFetchedItems?.locations?.map(option => (
                  <option key={option?.ID} value={option?.ID}>
                    {option?.ArabicName}
                  </option>
                ))}
              </select>
              <FaChevronDown />
            </div>
          </div>

          {formFields?.meetingLocationID === MeetingLocation?.Phyiscal ? (
            <>
              {/***** Building *****/}
              <div className={styles.formGroup}>
                <label>المبنى</label>
                <div className='select-container'>
                  <select
                    value={formFields?.BuildingID}
                    onChange={e => setFormFields({ ...formFields, BuildingID: e.target.value })}
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
                    value={formFields?.RoomID}
                    onChange={e => setFormFields({ ...formFields, RoomID: e.target.value })}
                    required>
                    <option value='' disabled>
                      اختر الغرفة
                    </option>
                    {fieldsFetchedItems?.rooms?.map(option => (
                      <option key={option.ID} value={option.ID}>
                        {option.ArabicName}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown />
                </div>
              </div>
            </>
          ) : formFields?.meetingLocationID === MeetingLocation?.Virtual ? (
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
              {formFields?.agenda?.length === 0 ? (
                <p className={styles.emptyState}>لا يوجد عناصر مضافة حتى الآن. اضغط على "إضافة بند جديد" للبدء.</p>
              ) : (
                <ul className={styles.agendaList}>
                  {formFields?.agenda?.map((item, index) => (
                    <li key={index} className={styles.agendaItem}>
                      <input
                        className={styles.agendaInput}
                        value={item?.Sentence || ''}
                        onChange={e => handleAgendaChange(index, e.target.value)}
                        placeholder='أدخل بند جدول الأعمال'
                      />

                      <button
                        type='button'
                        className={styles.removeAgendaButton}
                        onClick={() => handleDeleteAgenda(index, item?.ID)}>
                        <FaTrash className={styles.icon} /> حذف
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/***** Topics *****/}
          <div className={`${styles.formGroup} ${styles.formGroupFullWidth} `}>
            <div className={styles.agendaHeader}>
              <label className={styles.agendaLabel}>محاور الاجتماع</label>
              <button type='button' className={styles.sharedButton} onClick={handleAddTopic}>
                <FaPlus className={styles.icon} /> إضافة محور جديد
              </button>
            </div>

            <div className={styles.agendaContainer}>
              {!formFields?.topics ? (
                <p className={styles.emptyState}>لا يوجد عناصر مضافة حتى الآن. اضغط على "إضافة محور جديد" للبدء.</p>
              ) : (
                <ul className={styles.agendaList}>
                  {formFields?.topics?.map((item, index) => (
                    <li key={index} className={styles.agendaItem}>
                      <input
                        className={styles.agendaInput}
                        value={item?.Sentence || ''}
                        onChange={e => handleTopicChange(index, e.target.value)}
                        placeholder='أدخل محور الاجتماع'
                      />

                      <button
                        type='button'
                        className={styles.removeAgendaButton}
                        onClick={() => handleDeleteTopic(index, item?.ID)}>
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
                  {!formFields?.members?.length ? (
                    <tr>
                      <td>
                        <p className={styles.emptyTableLabel}>لا يوجد أعضاء</p>
                      </td>
                    </tr>
                  ) : (
                    formFields?.members?.map(member => (
                      <tr key={member?.ID}>
                        <td>{member?.FullName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.formGroupFullWidth}`}>
            <label htmlFor='fileInput'>رفع ملفات الاجتماع</label>
            <div className={styles.uploadContainer}>
              <button type='button' className={styles.uploadButton} onClick={() => document.getElementById('fileInput').click()}>
                اختر الملفات
              </button>
              <input type='file' id='fileInput' multiple onChange={handleFileUpload} style={{ display: 'none' }} />
              <ul className={styles.fileList}>
                {formFields?.relatedAttachments?.map((file, index) => (
                  <li key={index} className={styles.fileItem}>
                    <span className={styles.fileName}>{file?.DocumentName}</span>
                    <button type='button' className={styles.deleteFileButton} onClick={() => handleDeleteFile(index)}>
                      <FaTrash className={styles.deleteIcon} />
                    </button>
                  </li>
                ))}
              </ul>
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
              {fieldsFetchedItems?.committeeMembers?.map((member, index) => (
                <tr key={member?.ID}>
                  <td>
                    <Checkbox
                      checked={formFields?.members?.some(m => m?.MemberID === member?.ID)}
                      onChange={e => handleCheckboxChange(member, e.target.checked)}
                    />
                  </td>
                  <td>{member?.Name}</td>
                </tr>
              ))}
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
              حفظ <SaveIcon />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MeetingFormEdit;
