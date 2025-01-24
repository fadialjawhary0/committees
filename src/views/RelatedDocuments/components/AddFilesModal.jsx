import React, { useState, useEffect } from 'react';
import { FaUpload, FaTrashAlt } from 'react-icons/fa';
import styles from './RelatedDocuments.module.scss';
import { Modal } from '@mui/material';
import { useFileUpload } from '../../../hooks/useFileUpload';
import apiService from '../../../services/axiosApi.service';

const AddFilesModal = ({ isOpen, onClose, fetchDocuments }) => {
  const { convertFileToBase64, handleFileUpload } = useFileUpload();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [attachmentTypes, setAttachmentTypes] = useState([]);
  console.log('🚀 ~ AddFilesModal ~ attachmentTypes:', attachmentTypes);

  useEffect(() => {
    const fetchAttachmentTypes = async () => {
      try {
        const response = await apiService.getAll('GetAllAttachmentType');
        setAttachmentTypes(response || []);
      } catch (error) {
        console.error('Error fetching attachment types:', error);
      }
    };

    fetchAttachmentTypes();
  }, []);

  const handleFileSelection = async e => {
    const files = Array.from(e.target.files);

    const filesWithData = await Promise.all(
      files.map(async file => {
        const fileData = await convertFileToBase64(file);
        return { ...fileData, attachmentTypeID: 1002 }; // UPDATE HERE
      }),
    );

    setSelectedFiles(prev => [...prev, ...filesWithData]);
  };

  const handleAttachmentTypeChange = (index, newTypeID) => {
    setSelectedFiles(prev => prev.map((file, i) => (i === index ? { ...file, attachmentTypeID: newTypeID } : file)));
  };

  const handleSubmit = async () => {
    const committeeID = +localStorage.getItem('selectedCommitteeID');
    await handleFileUpload(selectedFiles, 'AddRelatedAttachment', committeeID, fetchDocuments);
    setSelectedFiles([]);
    onClose();
  };

  const handleRemoveFile = index => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal open={isOpen} className={styles.addFileContainer}>
      <div className={styles.modalContent}>
        <h5 className={styles.modalHeader}>اضافة ملفات الى اللجنة</h5>

        {selectedFiles.length > 0 && (
          <div className={styles.fileList}>
            {selectedFiles.map((file, index) => (
              <>
                <span className={styles.fileName}>{file.name}</span>
                <div key={index} className={styles.fileRow}>
                  <button className={styles.removeButton} onClick={() => handleRemoveFile(index)}>
                    <FaTrashAlt />
                  </button>
                  <select value={file.attachmentTypeID} onChange={e => handleAttachmentTypeChange(index, +e.target.value)}>
                    {attachmentTypes.map(type => (
                      <option key={type?.ID} value={type?.ID}>
                        {type?.ArabicName}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ))}
          </div>
        )}

        <div>
          <button
            type='button'
            className={styles.uploadButton}
            onClick={() => document.getElementById('fileInput').click()}
            style={{ marginBottom: '1rem' }}>
            اختر الملفات
          </button>
          <input type='file' id='fileInput' multiple onChange={handleFileSelection} style={{ display: 'none' }} />
          <div className={styles.addModalActions}>
            <button className={styles.cancelButton} onClick={onClose}>
              إلغاء
            </button>
            <button className={styles.addButton} onClick={handleSubmit}>
              اضافة
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddFilesModal;
