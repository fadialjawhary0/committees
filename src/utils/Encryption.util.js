import CryptoJS from 'crypto-js';

export const encryptData = (data, key) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
    return encryptedData;
  } catch (error) {
    console.error('Error during encryption:', error);
    return null;
  }
};

export const decryptData = (encryptedData, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.error('Error during decryption:', error);
    return null;
  }
};
