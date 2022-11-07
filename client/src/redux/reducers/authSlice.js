import { createSlice } from '@reduxjs/toolkit'
import * as authActions from '../actions/authActionsCreator'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    signUpError: null,
    logoutError: null
  },
  reducers: {},
  extraReducers: {
    // login
    [authActions.login.pending]: state => {
      state.loading = true
    },
    [authActions.login.fulfilled]: (state, action) => {
      state.loading = false
      state.user = action.payload
      state.loginError = null
    },
    [authActions.login.rejected]: (state, action) => {
      state.loading = false
      state.user = null
      state.loginError = action.payload
    },
    // signUp
    [authActions.signUp.pending]: state => {
      state.loading = true
    },
    [authActions.signUp.fulfilled]: (state, action) => {
      state.loading = false
      state.user = action.payload
      state.signUpError = null
    },
    [authActions.signUp.rejected]: (state, action) => {
      state.loading = false
      state.user = null
      state.signUpError = action.payload
    },
    //logout
    [authActions.logout.pending]: state => {
      state.loading = true
    },
    [authActions.logout.fulfilled]: state => {
      state.loading = false
      state.user = null
      state.logoutError = null
    },
    [authActions.logout.rejected]: (state, action) => {
      state.loading = false
      state.logoutError = action.payload
    }
  }
})

export default authSlice.reducer
