import { createAsyncThunk } from '@reduxjs/toolkit'
import { createUser, loginUser, logoutUser } from '../../firebase/auth'
import { addUser } from '../../firebase/database'

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { user } = await createUser(email, password)
      await addUser(email, user.uid)
      const token = await user.getIdToken()
      sessionStorage.setItem('Auth Token', token)
      return user
    } catch (error) {
      return rejectWithValue(error.code)
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { user } = await loginUser(email, password)
      const token = await user.getIdToken()
      sessionStorage.setItem('Auth Token', token)
      return user
    } catch (error) {
      return rejectWithValue(error.code)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    sessionStorage.removeItem('Auth Token')
    await logoutUser()
  } catch (error) {
    return rejectWithValue(error)
  }
})
