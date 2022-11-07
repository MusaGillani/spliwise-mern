import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  connectAuthEmulator
} from 'firebase/auth'
import { app } from './firebaseConfig'

const auth = getAuth(app)
if (import.meta.env.MODE === 'development') connectAuthEmulator(auth, 'http://localhost:9099')

export const createUser = (email, password) => createUserWithEmailAndPassword(auth, email, password)

export const loginUser = (email, password) => signInWithEmailAndPassword(auth, email, password)

export const logoutUser = () => signOut(auth)

export const getCurrentUser = () => auth.currentUser
