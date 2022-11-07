import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore'
import { app } from './firebaseConfig'
import { uploadImage } from './storage'
import { getCurrentUser } from './auth'

const db = getFirestore(app)
if (import.meta.env.MODE === 'development') connectFirestoreEmulator(db, 'localhost', 8080)

export const addUser = (email, uid) =>
  setDoc(doc(db, 'users', uid), {
    email
  })

export const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'))
  const users = []
  querySnapshot.forEach(doc =>
    users.push({
      uid: doc.id,
      email: doc.data().email
    })
  )
  return users
}

export const addExpense = async ({
  users,
  description,
  totalPrice,
  paidBy,
  paidByMultiple,
  split,
  splitValues,
  imageFile,
  date
}) => {
  const imageFileUrl = imageFile != null ? await uploadImage(imageFile[0]) : ''
  const addedBy = {
    value: getCurrentUser().uid,
    label: getCurrentUser().email
  }

  addDoc(collection(db, 'expenses'), {
    addedBy,
    users,
    description,
    totalPrice,
    paidBy,
    paidByMultiple,
    split,
    splitValues,
    imageFileUrl,
    date
  })
}

export const getUserExpenses = async () => {
  const lookUpObj = {
    value: getCurrentUser().uid,
    label: getCurrentUser().email
  }
  const q = query(collection(db, 'expenses'), where('users', 'array-contains', lookUpObj))

  const querySnapshot = await getDocs(q)

  const expenses = []
  querySnapshot.forEach(doc => expenses.push({ expenseId: doc.id, ...doc.data() }))

  return expenses
}

export const settleUserExpense = async (expenseId, userUid) => {
  const docRef = doc(db, 'expenses', expenseId)
  const docSnap = await getDoc(docRef)

  const expense = docSnap.data()

  const { users, paidBy, paidByMultiple, splitValues } = expense

  if (users.length === 2) {
    await deleteDoc(docRef)
    return
  }
  if (paidBy === 'multiple') {
    expense.paidByMultiple = paidByMultiple.filter(obj => Object.keys(obj)[0] !== userUid)
  }

  expense.splitValues = splitValues.filter(obj => Object.keys(obj)[0] !== userUid)
  expense.users = expense.users.filter(({ value: uid }) => uid !== userUid)

  await setDoc(docRef, expense)
}
