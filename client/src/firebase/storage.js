import {
  getStorage,
  connectStorageEmulator,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

import { app } from './firebaseConfig'

const storage = getStorage(app)
if (import.meta.env.MODE === 'development') connectStorageEmulator(storage, 'localhost', 9199)

export const uploadImage = async imageFile => {
  const imageRef = ref(storage, `expenses/${uuidv4()}${imageFile.name}`)
  const { ref: uploadRef } = await uploadBytes(imageRef, imageFile)
  const downloadUrl = await getDownloadURL(uploadRef)
  return downloadUrl
}
