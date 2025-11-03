/**
 * Firebase Storage Service
 *
 * Handles file uploads and downloads for receipts, avatars, and documents.
 */

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './firebase';

// Re-export storage for convenience
export { storage };

export interface UploadProgress {
  progress: number;
  snapshot: UploadTaskSnapshot;
}

// Storage paths
export const STORAGE_PATHS = {
  RECEIPTS: 'receipts',
  AVATARS: 'avatars',
  DOCUMENTS: 'documents',
  EXPENSES: 'expenses',
};

class StorageService {
  /**
   * Upload a file to Firebase Storage
   * @param file - File to upload
   * @param path - Storage path (folder)
   * @param fileName - Optional custom filename
   * @returns Promise with download URL
   */
  async uploadFile(
    file: File,
    path: string,
    fileName?: string
  ): Promise<string> {
    try {
      const filename = fileName || `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${path}/${filename}`);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Upload a file with progress tracking
   * @param file - File to upload
   * @param path - Storage path (folder)
   * @param onProgress - Callback for progress updates
   * @param fileName - Optional custom filename
   * @returns Promise with download URL
   */
  async uploadFileWithProgress(
    file: File,
    path: string,
    onProgress: (progress: number) => void,
    fileName?: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const filename = fileName || `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${path}/${filename}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  /**
   * Delete a file from Firebase Storage
   * @param fileUrl - Full download URL of the file
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Delete a file by path
   * @param path - Storage path including filename
   */
  async deleteFileByPath(path: string): Promise<void> {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file by path:', error);
      throw error;
    }
  }

  /**
   * List all files in a directory
   * @param path - Storage path (folder)
   * @returns Array of download URLs
   */
  async listFiles(path: string): Promise<string[]> {
    try {
      const listRef = ref(storage, path);
      const res = await listAll(listRef);

      const urls = await Promise.all(
        res.items.map((itemRef) => getDownloadURL(itemRef))
      );

      return urls;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  /**
   * Upload receipt file
   * @param file - Receipt file
   * @param receiptId - Receipt ID for organizing files
   * @returns Download URL
   */
  async uploadReceipt(file: File, receiptId: string): Promise<string> {
    return this.uploadFile(file, STORAGE_PATHS.RECEIPTS, `receipt_${receiptId}_${file.name}`);
  }

  /**
   * Upload expense receipt
   * @param file - Expense receipt file
   * @param expenseId - Expense ID
   * @returns Download URL
   */
  async uploadExpenseReceipt(file: File, expenseId: string): Promise<string> {
    return this.uploadFile(file, STORAGE_PATHS.EXPENSES, `expense_${expenseId}_${file.name}`);
  }

  /**
   * Upload team member avatar
   * @param file - Avatar image file
   * @param userId - User/Team member ID
   * @returns Download URL
   */
  async uploadAvatar(file: File, userId: string): Promise<string> {
    return this.uploadFile(file, STORAGE_PATHS.AVATARS, `avatar_${userId}.${file.name.split('.').pop()}`);
  }

  /**
   * Upload general document
   * @param file - Document file
   * @returns Download URL
   */
  async uploadDocument(file: File): Promise<string> {
    return this.uploadFile(file, STORAGE_PATHS.DOCUMENTS);
  }
}

// Export singleton instance
export const storageService = new StorageService();
