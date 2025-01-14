import apiService from '../services/axiosApi.service';

import { useToast } from '../context';
import { ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE_MB, ToastMessage } from '../constants';

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

  const handleFileChange = async (event, apiRoute, committeeID) => {
    const files = Array.from(event.target.files);

    for (const file of files) {
      try {
        const fileData = await convertFileToBase64(file);

        await apiService.create(apiRoute, {
          CommitteeID: committeeID || localStorage.getItem('selectedCommitteeID'),
          DocumentContent: fileData.base64,
          DocumentExt: fileData.extension,
          DocumentName: fileData.name,
        });

        showToast(ToastMessage?.FileUploadSuccess, 'success');
      } catch (error) {
        console.error('File upload error:', error);
      }
    }
  };

  return { handleFileChange, convertFileToBase64 };
};
