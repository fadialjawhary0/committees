import React, { useState } from 'react';
import { FaSave, FaArrowLeft, FaUpload, FaFile, FaTrashAlt } from 'react-icons/fa';
import './AddCommitteeStyles.scss';

const AddCommittee = () => {
  const [committeeName, setCommitteeName] = useState('');
  const [committeeNumber, setCommitteeNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [committeeType, setCommitteeType] = useState('');
  const [committeeClassification, setCommitteeClassification] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);

  const handleSave = () => {
    console.log({
      committeeName,
      committeeNumber,
      startDate,
      endDate,
      committeeType,
      committeeClassification,
      description,
      files,
    });
  };

  const handleFileChange = e => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const handleDeleteFile = index => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <div className='add-committee-page'>
      <div className='page-header'>
        <FaArrowLeft className='back-icon' onClick={() => window.history.back()} />
        <h1>إضافة لجنة جديدة</h1>
      </div>
      <form className='add-committee-form'>
        <div className='form-columns'>
          <div className='form-group'>
            <label htmlFor='committeeName'>اسم اللجنة</label>
            <input
              type='text'
              id='committeeName'
              value={committeeName}
              onChange={e => setCommitteeName(e.target.value)}
              placeholder='أدخل اسم اللجنة'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='committeeNumber'>رقم اللجنة</label>
            <input
              type='text'
              id='committeeNumber'
              value={committeeNumber}
              onChange={e => setCommitteeNumber(e.target.value)}
              placeholder='أدخل رقم اللجنة'
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='startDate'>تاريخ البدء</label>
            <input type='date' id='startDate' value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label htmlFor='endDate'>تاريخ الانتهاء</label>
            <input type='date' id='endDate' value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div className='form-group'>
            <label htmlFor='committeeType'>نوع اللجنة</label>
            <select id='committeeType' value={committeeType} onChange={e => setCommitteeType(e.target.value)} required>
              <option value=''>اختر نوع اللجنة</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='committeeClassification'>تصنيف اللجنة</label>
            <select id='committeeClassification' value={committeeClassification} onChange={e => setCommitteeClassification(e.target.value)} required>
              <option value=''>اختر تصنيف اللجنة</option>
            </select>
          </div>
        </div>
        <div className='form-group'>
          <label htmlFor='description'>الوصف</label>
          <textarea id='description' value={description} onChange={e => setDescription(e.target.value)} placeholder='أدخل وصف اللجنة' required></textarea>
        </div>
        <div className='file-upload-group'>
          <label htmlFor='files' className='file-upload-label'>
            <FaFile className='file-upload-icon' /> رفع ملفات اللجنة
          </label>
          <input type='file' id='files' multiple onChange={handleFileChange} className='file-input' />
          <div className='file-preview'>
            {files.length > 0 &&
              files.map((file, index) => (
                <div key={index} className='file-item'>
                  <FaUpload className='file-icon' />
                  <span>{file.name}</span>
                  <FaTrashAlt className='delete-file-icon' onClick={() => handleDeleteFile(index)} />
                </div>
              ))}
          </div>
        </div>
        <button type='button' className='save-button' onClick={handleSave}>
          <FaSave /> حفظ
        </button>
      </form>
    </div>
  );
};

export default AddCommittee;
