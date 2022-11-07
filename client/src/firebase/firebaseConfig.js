// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBmjs8CqH7iKg_qMFyzgb--Ew675nwmhxU',
  authDomain: 'splitwise-480ce.firebaseapp.com',
  databaseURL: 'https://splitwise-480ce-default-rtdb.firebaseio.com',
  projectId: 'splitwise-480ce',
  storageBucket: 'splitwise-480ce.appspot.com',
  messagingSenderId: '887782076112',
  appId: '1:887782076112:web:d24f1877e66cee346db8d5',
  measurementId: 'G-KPDHW7RQ5X'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
