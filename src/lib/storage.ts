import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload
 * @param path The path in storage (e.g., 'stores/logos/my-store.png')
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

/**
 * Helper to generate a unique path for store assets
 */
export const getStoreAssetPath = (storeId: string, type: 'logo' | 'banner' | 'product', fileName: string) => {
  const extension = fileName.split('.').pop();
  const timestamp = Date.now();
  return `stores/${storeId}/${type}s/${type}_${timestamp}.${extension}`;
};
