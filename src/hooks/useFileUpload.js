import apiService from '../services/axiosApi.service';

import { useToast } from '../context';
import { ALLOWED_FILE_EXTENSIONS, LogTypes, MAX_FILE_SIZE_MB, ToastMessage } from '../constants';

export const useFileUpload = () => {
  const { showToast } = useToast();

  const convertFileToBase64 = file => {
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
      reader.onload = () => resolve({ base64: reader.result.split(',')[1], extension, name: file.name });
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event, apiRoute, committeeID, meetingID, updateDocumentsCallback) => {
    const files = Array.from(event.target.files);

    for (const file of files) {
      try {
        const fileData = await convertFileToBase64(file);

        const payload = {
          DocumentContent: fileData.base64,
          DocumentExt: fileData.extension,
          DocumentName: fileData.name,
          ...(committeeID ? { CommitteeID: committeeID || localStorage.getItem('selectedCommitteeID') } : {}),
          ...(meetingID ? { MeetingID: meetingID } : {}),
        };

        const response = await apiService.create(apiRoute, payload, LogTypes?.Files?.Create);

        if (response && typeof updateDocumentsCallback === 'function') {
          updateDocumentsCallback(response);
        }

        showToast(ToastMessage?.FileUploadSuccess, 'success');
      } catch (error) {
        console.error('File upload error:', error);
      }
    }
  };

  const handleFileUpload = async (filesWithTypes, apiRoute, committeeID, updateDocumentsCallback) => {
    for (const fileData of filesWithTypes) {
      try {
        const payload = {
          DocumentContent: fileData.base64,
          DocumentExt: fileData.extension,
          DocumentName: fileData.name,
          AttachmentTypeID: fileData.attachmentTypeID || 1, // Default to 1 if not selected
          CreatedAt: new Date().toISOString(),
          CommitteeID: committeeID || localStorage.getItem('selectedCommitteeID'),
        };

        const response = await apiService.create(apiRoute, payload, LogTypes?.Files?.Create);

        if (response && typeof updateDocumentsCallback === 'function') {
          updateDocumentsCallback(response);
        }

        showToast(ToastMessage?.FileUploadSuccess, 'success');
      } catch (error) {
        console.error('File upload error:', error);
        showToast(ToastMessage?.FileUploadError, 'error');
      }
    }
  };

  return { handleFileChange, convertFileToBase64, handleFileUpload };
};
