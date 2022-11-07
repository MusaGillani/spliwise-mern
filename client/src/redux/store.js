import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'

export default configureStore({
  reducer: {
    user: authReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})
