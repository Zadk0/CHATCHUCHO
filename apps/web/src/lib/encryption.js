import CryptoJS from 'crypto-js';

/**
 * Generates a consistent shared key from two user IDs by sorting them.
 * This ensures both users use the exact same key for their conversation.
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @returns {string} - The shared encryption key
 */
export const getSharedEncryptionKey = (userId1, userId2) => {
  if (!userId1 || !userId2) return '';
  return [userId1, userId2].sort().join('_');
};

/**
 * Encrypts a message using AES encryption
 * @param {string} text - The message to encrypt
 * @param {string} key - The encryption key
 * @returns {string} - The encrypted message
 */
export const encryptMessage = (text, key) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, key).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Error al encriptar el mensaje');
  }
};

/**
 * Decrypts a message using AES decryption
 * @param {string} encryptedText - The encrypted message
 * @param {string} key - The decryption key
 * @returns {string} - The decrypted message
 */
export const decryptMessage = (encryptedText, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || '[No se pudo desencriptar el mensaje]';
  } catch (error) {
    console.error('Decryption error:', error);
    return '[Error de desencriptación]';
  }
};